from concurrent.futures import TimeoutError
from io import BytesIO
import logging
from queue import Empty, Queue
from threading import Thread
from time import perf_counter, sleep
from typing import Any

from PIL import Image, UnidentifiedImageError

from app.core.config import settings
from app.integrations.gemini.client import get_gemini_model
from app.schemas.chat import ChatHistoryMessage, ChatResponse

logger = logging.getLogger(__name__)

MAX_HISTORY_MESSAGES = 8
MAX_HISTORY_ITEM_CHARS = 600
MAX_IMAGE_SIDE = 1280


def generate_chat_response(
    message: str,
    history: list[ChatHistoryMessage] | None = None,
) -> ChatResponse:
    normalized_message = message.strip()
    safe_history = _compact_history(history or [])

    if not settings.gemini_api_key:
        logger.info('Gemini API key not configured. Using Rimay fallback response.')
        return ChatResponse(response=_fallback_response(normalized_message, safe_history))

    prompt = _build_prompt(normalized_message, safe_history)
    total_attempts = max(settings.gemini_max_retries, 0) + 1
    candidate_models = _candidate_models()

    for attempt in range(1, total_attempts + 1):
        started_at = perf_counter()
        model_name = candidate_models[min(attempt - 1, len(candidate_models) - 1)]

        try:
            logger.info(
                'Gemini request started. attempt=%s/%s model=%s history_messages=%s',
                attempt,
                total_attempts,
                model_name,
                len(safe_history),
            )
            response_text = _generate_with_gemini(prompt, model_name=model_name)
            elapsed_ms = int((perf_counter() - started_at) * 1000)

            if not response_text:
                raise ValueError('Gemini returned an empty response.')

            logger.info(
                'Gemini response received. attempt=%s elapsed_ms=%s chars=%s',
                attempt,
                elapsed_ms,
                len(response_text),
            )
            return ChatResponse(response=response_text.strip())
        except TimeoutError as exc:
            elapsed_ms = int((perf_counter() - started_at) * 1000)
            logger.warning(
                'Gemini timeout. attempt=%s/%s elapsed_ms=%s timeout_seconds=%s',
                attempt,
                total_attempts,
                elapsed_ms,
                settings.gemini_timeout_seconds,
            )
            last_error = exc
        except Exception as exc:
            elapsed_ms = int((perf_counter() - started_at) * 1000)
            error_kind = _classify_gemini_error(exc)
            logger.warning(
                'Gemini request failed. attempt=%s/%s elapsed_ms=%s kind=%s error=%s',
                attempt,
                total_attempts,
                elapsed_ms,
                error_kind,
                _summarize_error(exc),
                exc_info=error_kind not in {'rate_limit', 'auth', 'model_not_found'},
            )
            last_error = exc

        if attempt < total_attempts:
            sleep(settings.gemini_retry_delay_seconds * attempt)

    logger.warning(
        'Gemini unavailable after retries. Using Rimay fallback. reason=%s',
        _classify_gemini_error(last_error),
    )
    return ChatResponse(response=_fallback_response(normalized_message, safe_history))


def generate_image_chat_response(
    message: str,
    history: list[ChatHistoryMessage] | None,
    image_bytes: bytes,
    mime_type: str,
) -> ChatResponse:
    normalized_message = message.strip() or (
        'Analiza esta imagen desde accesibilidad turistica y sugiere una ruta o accion amable.'
    )
    safe_history = _compact_history(history or [])

    try:
        image = _prepare_image_for_gemini(image_bytes)
    except ValueError:
        return ChatResponse(
            response=(
                'No pude leer la imagen con claridad. Intenta subir una foto en JPG o PNG, '
                'idealmente bien iluminada y enfocada en el ingreso, vereda, rampa u obstaculo.'
            )
        )

    if not settings.gemini_api_key:
        logger.info('Gemini API key not configured. Using Rimay image fallback response.')
        return ChatResponse(response=_fallback_image_response(normalized_message, safe_history))

    prompt = _build_image_prompt(normalized_message, safe_history, mime_type)
    total_attempts = max(settings.gemini_max_retries, 0) + 1
    candidate_models = _candidate_models()

    for attempt in range(1, total_attempts + 1):
        started_at = perf_counter()
        model_name = candidate_models[min(attempt - 1, len(candidate_models) - 1)]

        try:
            logger.info(
                'Gemini multimodal request started. attempt=%s/%s model=%s history_messages=%s mime=%s bytes=%s',
                attempt,
                total_attempts,
                model_name,
                len(safe_history),
                mime_type,
                len(image_bytes),
            )
            response_text = _generate_with_gemini(prompt, image, model_name=model_name)
            elapsed_ms = int((perf_counter() - started_at) * 1000)

            if not response_text:
                raise ValueError('Gemini returned an empty multimodal response.')

            logger.info(
                'Gemini multimodal response received. attempt=%s elapsed_ms=%s chars=%s',
                attempt,
                elapsed_ms,
                len(response_text),
            )
            return ChatResponse(response=response_text.strip())
        except TimeoutError as exc:
            elapsed_ms = int((perf_counter() - started_at) * 1000)
            logger.warning(
                'Gemini multimodal timeout. attempt=%s/%s elapsed_ms=%s timeout_seconds=%s',
                attempt,
                total_attempts,
                elapsed_ms,
                settings.gemini_timeout_seconds,
            )
            last_error = exc
        except Exception as exc:
            elapsed_ms = int((perf_counter() - started_at) * 1000)
            logger.warning(
                'Gemini multimodal request failed. attempt=%s/%s elapsed_ms=%s kind=%s error=%s',
                attempt,
                total_attempts,
                elapsed_ms,
                _classify_gemini_error(exc),
                _summarize_error(exc),
                exc_info=_classify_gemini_error(exc) not in {'rate_limit', 'auth', 'model_not_found'},
            )
            last_error = exc

        if attempt < total_attempts:
            sleep(settings.gemini_retry_delay_seconds * attempt)

    logger.warning(
        'Gemini multimodal unavailable after retries. Using Rimay fallback. reason=%s',
        _classify_gemini_error(last_error),
    )
    return ChatResponse(response=_fallback_image_response(normalized_message, safe_history))


def _generate_with_gemini(
    prompt: str,
    image: Image.Image | None = None,
    model_name: str | None = None,
) -> str | None:
    result_queue: Queue[str | Exception | None] = Queue(maxsize=1)
    thread = Thread(
        target=_run_gemini_call,
        args=(prompt, result_queue, image, model_name),
        daemon=True,
    )
    thread.start()

    try:
        result = result_queue.get(timeout=settings.gemini_timeout_seconds)
    except Empty as exc:
        raise TimeoutError from exc

    if isinstance(result, Exception):
        raise result

    return result


def _run_gemini_call(
    prompt: str,
    result_queue: Queue[str | Exception | None],
    image: Image.Image | None = None,
    model_name: str | None = None,
) -> None:
    try:
        result_queue.put(_call_gemini(prompt, image, model_name))
    except Exception as exc:
        result_queue.put(exc)


def _call_gemini(
    prompt: str,
    image: Image.Image | None = None,
    model_name: str | None = None,
) -> str | None:
    model = get_gemini_model(model_name)
    content: str | list[Any] = prompt if image is None else [prompt, image]
    gemini_response = model.generate_content(
        content,
        generation_config={
            'max_output_tokens': settings.gemini_max_output_tokens,
            'temperature': 0.72,
            'top_p': 0.9,
        },
        request_options={'timeout': settings.gemini_timeout_seconds},
    )
    return getattr(gemini_response, 'text', None)


def _prepare_image_for_gemini(image_bytes: bytes) -> Image.Image:
    try:
        image = Image.open(BytesIO(image_bytes))
        image.thumbnail((MAX_IMAGE_SIDE, MAX_IMAGE_SIDE))
        return image.convert('RGB')
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError('Invalid image file.') from exc


def _candidate_models() -> list[str]:
    models = [settings.gemini_model]

    if settings.gemini_fallback_model and settings.gemini_fallback_model not in models:
        models.append(settings.gemini_fallback_model)

    return models


def _compact_history(history: list[ChatHistoryMessage]) -> list[ChatHistoryMessage]:
    compacted = []

    for item in history[-MAX_HISTORY_MESSAGES:]:
        content = item.content.strip()

        if not content:
            continue

        compacted.append(
            ChatHistoryMessage(
                role=item.role,
                content=content[:MAX_HISTORY_ITEM_CHARS],
            )
        )

    return compacted


def _classify_gemini_error(exc: Exception | None) -> str:
    if exc is None:
        return 'unknown'

    name = exc.__class__.__name__.lower()
    details = str(exc).lower()
    combined = f'{name} {details}'

    if 'timeout' in combined or 'deadline' in combined:
        return 'timeout'

    if 'notfound' in combined or 'not found' in combined or '404' in combined:
        return 'model_not_found'

    if 'resourceexhausted' in combined or 'quota' in combined or 'rate limit' in combined or '429' in combined:
        return 'rate_limit'

    if 'permission' in combined or 'api key' in combined or '401' in combined or '403' in combined:
        return 'auth'

    if 'unavailable' in combined or '503' in combined or 'connection' in combined:
        return 'network'

    if 'empty response' in combined:
        return 'empty_response'

    return 'gemini_error'


def _summarize_error(exc: Exception, limit: int = 420) -> str:
    message = str(exc).replace('\n', ' ').strip()

    if len(message) <= limit:
        return message

    return f'{message[:limit]}...'


def _build_prompt(message: str, history: list[ChatHistoryMessage]) -> str:
    conversation = '\n'.join(
        f"{'Usuario' if item.role == 'user' else 'Rimay AI'}: {item.content}"
        for item in history
    )

    if not conversation:
        conversation = 'Sin historial previo.'

    return f"""
Contexto reciente de la conversacion:
{conversation}

Nuevo mensaje del usuario:
{message}

Responde como Rimay AI, manteniendo memoria del destino, tipo de accesibilidad
y necesidad humana mencionada en el historial. Si hay un destino turistico,
incluye contexto cultural, experiencia sensorial y recomendacion accesible.
""".strip()


def _build_image_prompt(message: str, history: list[ChatHistoryMessage], mime_type: str) -> str:
    conversation = '\n'.join(
        f"{'Usuario' if item.role == 'user' else 'Rimay AI'}: {item.content}"
        for item in history
    )

    if not conversation:
        conversation = 'Sin historial previo.'

    return f"""
Contexto reciente de la conversacion:
{conversation}

Mensaje del usuario junto a la imagen:
{message}

Tipo de archivo recibido:
{mime_type}

Analiza la imagen como Rimay AI, asistente de turismo inclusivo del Peru.
Describe con claridad lo que puedas observar relacionado con accesibilidad:
rampas, escaleras, sardinel, ancho de paso, senalizacion, contraste visual,
iluminacion, obstaculos, flujo peatonal y posibles rutas mas amables.

Mantente prudente: no inventes certezas si la imagen no permite confirmarlas.
Entrega una respuesta humana, breve y accionable con:
1. lectura visual accesible
2. nivel de cuidado sugerido
3. recomendacion concreta para una persona viajera
""".strip()


def _fallback_response(message: str, history: list[ChatHistoryMessage]) -> str:
    lowered = message.lower()
    context = _infer_context(message, history)

    if any(
        word in lowered
        for word in ['puente', 'suspiros', 'patrimonio', 'historia', 'muestrame', 'muéstrame', 'muestrame']
    ):
        return (
            'El Puente de los Suspiros se siente como una pausa poetica de Barranco: '
            'balcones, musica y una brisa suave que conecta historia y barrio. Para '
            'vivirlo con menos barreras, te sugiero llegar por una ruta de pendiente '
            'suave, avanzar con calma y elegir el atardecer, cuando el ambiente es '
            'mas sereno y la experiencia se vuelve mas sensorial.'
        )

    if any(word in lowered for word in ['cafeteria', 'cafeterias', 'cafe', 'comer', 'descansar']):
        place = context or 'la zona que mencionaste'
        return (
            f'Si seguimos hablando de {place}, buscaria una cafeteria tranquila, '
            'con ingreso amplio, espacio para maniobrar y mesas accesibles. Tambien '
            'conviene elegir horarios de menor afluencia para que la pausa sea mas '
            'comoda, especialmente si vienes con silla de ruedas, baja vision o una '
            'persona adulta mayor.'
        )

    if any(word in lowered for word in ['silla', 'rueda', 'rampa', 'wheelchair']):
        place = f' en {context}' if context else ''
        return (
            f'Gracias por avisar. Identifique una posible barrera de accesibilidad{place}. '
            'Te sugiero buscar una ruta alterna con rampas verificadas, menor pendiente '
            'y puntos de descanso. Si puedes, guarda la ubicacion exacta y comparte el '
            'reporte para que otras personas viajen con mas seguridad.'
        )

    if any(word in lowered for word in ['adulto mayor', 'persona adulta mayor', 'mayor', 'anciano']):
        place = f' en {context}' if context else ''
        return (
            f'Para una persona adulta mayor{place}, conviene priorizar una ruta con '
            'tramos cortos, bancas o puntos de descanso, cruces tranquilos y horarios '
            'de menor afluencia. Si el destino tiene pendiente o veredas irregulares, '
            'te sugiero avanzar por zonas mas iluminadas y guardar una alternativa '
            'offline por si la senal baja durante el recorrido.'
        )

    if any(word in lowered for word in ['foto', 'imagen', 'entrada', 'ingreso']):
        return (
            'Puedo ayudarte a revisar la imagen con mirada accesible: altura del sardinel, '
            'ancho de paso, senalizacion tactil, iluminacion y presencia de rampa. Si algo '
            'no es comodo, lo mejor es sugerir un ingreso alterno mas amable.'
        )

    if any(word in lowered for word in ['cusco', 'machu', 'miraflores', 'barranco', 'centro historico', 'centro histórico']):
        place = context or _infer_place_from_text(lowered) or 'ese destino'
        return (
            f'{place} tiene una identidad cultural muy especial. Puedo ayudarte a vivirlo '
            'con un ritmo mas tranquilo: elegir horarios de menor afluencia, ubicar rutas '
            'con menos pendiente, reconocer puntos de descanso y convertir la visita en '
            'una experiencia mas segura, sensible e inclusiva.'
        )

    place = f' en {context}' if context else ''

    return (
        f'Estoy reorganizando la mejor ruta accesible para ti{place}. Puedo ayudarte '
        'a entender la barrera, recordar el destino del que venimos hablando, sugerir '
        'una alternativa mas comoda y transformar tu reporte en una recomendacion clara '
        'para explorar el Peru con menos obstaculos.'
    )


def _fallback_image_response(message: str, history: list[ChatHistoryMessage]) -> str:
    context = _infer_context(message, history)
    place = f' en {context}' if context else ''

    return (
        f'Estoy revisando la imagen con enfoque de accesibilidad{place}. Observa si hay '
        'sardinel alto, escalones sin rampa, pasillos estrechos, senalizacion poco visible '
        'u obstaculos en la vereda. Para viajar con mas calma, conviene buscar un ingreso '
        'alterno amplio, buena iluminacion y una ruta con puntos de descanso cercanos.'
    )


def _infer_context(message: str, history: list[ChatHistoryMessage]) -> str | None:
    combined_text = ' '.join([item.content for item in history[-8:]] + [message])
    return _infer_place_from_text(combined_text.lower())


def _infer_place_from_text(text: str) -> str | None:
    if 'barranco' in text or 'suspiros' in text:
        return 'Barranco'
    if 'miraflores' in text or 'malecon' in text or 'malecón' in text:
        return 'Miraflores'
    if 'machu' in text:
        return 'Machu Picchu'
    if 'cusco' in text:
        return 'Cusco'
    if 'centro historico' in text or 'centro histórico' in text:
        return 'Centro Historico'

    return None
