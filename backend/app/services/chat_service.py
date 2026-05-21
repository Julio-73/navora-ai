from concurrent.futures import TimeoutError
from io import BytesIO
import json
import logging
from queue import Empty, Queue
import re
from threading import Thread
from time import perf_counter, sleep
from typing import Any

from PIL import Image, UnidentifiedImageError
from pydantic import ValidationError

from app.core.config import settings
from app.integrations.gemini.client import get_gemini_model
from app.schemas.chat import ChatHistoryMessage, ChatResponse

logger = logging.getLogger(__name__)

MAX_HISTORY_MESSAGES = 8
MAX_HISTORY_ITEM_CHARS = 600
MAX_IMAGE_SIDE = 1280
BARRIER_TYPES = {
    'Infraestructura / Física',
    'Comunicacional / Sensorial',
    'Ninguna / Guía Informativa',
}
SEVERITIES = {'Alta', 'Media', 'Baja', 'Ninguna'}


def generate_chat_response(
    message: str,
    history: list[ChatHistoryMessage] | None = None,
) -> ChatResponse:
    normalized_message = message.strip()
    safe_history = _compact_history(history or [])

    if not settings.gemini_api_key:
        logger.info('Gemini API key not configured. Using NAVORA structured fallback response.')
        return _fallback_response(normalized_message, safe_history)

    prompt = _build_prompt(normalized_message, safe_history)
    total_attempts = max(settings.gemini_max_retries, 0) + 1
    candidate_models = _candidate_models()
    last_error: Exception | None = None

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

            structured_response = _parse_ai_response(
                response_text=response_text,
                message=normalized_message,
                history=safe_history,
                is_image=False,
            )
            logger.info(
                'Gemini structured response received. attempt=%s elapsed_ms=%s chars=%s barrier=%s severity=%s',
                attempt,
                elapsed_ms,
                len(response_text),
                structured_response.tipo_barrera,
                structured_response.gravedad,
            )
            return structured_response
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
        'Gemini unavailable after retries. Using NAVORA structured fallback. reason=%s',
        _classify_gemini_error(last_error),
    )
    return _fallback_response(normalized_message, safe_history)


def generate_image_chat_response(
    message: str,
    history: list[ChatHistoryMessage] | None,
    image_bytes: bytes,
    mime_type: str,
) -> ChatResponse:
    normalized_message = message.strip() or (
        'Analiza esta imagen desde accesibilidad turística y sugiere una ruta o acción amable.'
    )
    safe_history = _compact_history(history or [])

    try:
        image = _prepare_image_for_gemini(image_bytes)
    except ValueError:
        return _build_response(
            tipo_barrera='Ninguna / Guía Informativa',
            gravedad='Ninguna',
            emocion_usuario=_infer_emotion(normalized_message),
            sitio_origen=_infer_context(normalized_message, safe_history) or 'Destino no identificado',
            mensaje_asistente=(
                'No pude leer la imagen con claridad. Intenta subir una foto en JPG o PNG, '
                'bien iluminada y enfocada en el ingreso, la vereda, una rampa o el obstáculo. '
                'Así podré ayudarte con una lectura accesible más precisa y amable. 📷'
            ),
        )

    if not settings.gemini_api_key:
        logger.info('Gemini API key not configured. Using NAVORA structured image fallback response.')
        return _fallback_image_response(normalized_message, safe_history)

    prompt = _build_image_prompt(normalized_message, safe_history, mime_type)
    total_attempts = max(settings.gemini_max_retries, 0) + 1
    candidate_models = _candidate_models()
    last_error: Exception | None = None

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

            structured_response = _parse_ai_response(
                response_text=response_text,
                message=normalized_message,
                history=safe_history,
                is_image=True,
            )
            logger.info(
                'Gemini multimodal structured response received. attempt=%s elapsed_ms=%s chars=%s barrier=%s severity=%s',
                attempt,
                elapsed_ms,
                len(response_text),
                structured_response.tipo_barrera,
                structured_response.gravedad,
            )
            return structured_response
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
            error_kind = _classify_gemini_error(exc)
            logger.warning(
                'Gemini multimodal request failed. attempt=%s/%s elapsed_ms=%s kind=%s error=%s',
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
        'Gemini multimodal unavailable after retries. Using NAVORA structured image fallback. reason=%s',
        _classify_gemini_error(last_error),
    )
    return _fallback_image_response(normalized_message, safe_history)


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
            'temperature': 0.78,
            'top_p': 0.92,
            'response_mime_type': 'application/json',
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


def _parse_ai_response(
    response_text: str,
    message: str,
    history: list[ChatHistoryMessage],
    is_image: bool,
) -> ChatResponse:
    cleaned_text = _strip_json_fence(response_text)

    try:
        payload = json.loads(cleaned_text)
    except json.JSONDecodeError:
        logger.warning('Gemini returned non-JSON content. Wrapping as structured response.')
        return _fallback_from_raw_text(response_text, message, history, is_image)

    if not isinstance(payload, dict):
        logger.warning('Gemini returned JSON that is not an object. Wrapping as structured response.')
        return _fallback_from_raw_text(response_text, message, history, is_image)

    normalized_payload = {
        'tipo_barrera': _normalize_barrier_type(payload.get('tipo_barrera'), message, is_image),
        'gravedad': _normalize_severity(payload.get('gravedad'), message, is_image),
        'emocion_usuario': _clean_text(payload.get('emocion_usuario')) or _infer_emotion(message),
        'sitio_origen': _clean_text(payload.get('sitio_origen')) or _infer_context(message, history) or 'Destino no identificado',
        'mensaje_asistente': _clean_text(payload.get('mensaje_asistente') or payload.get('response')),
    }

    if not normalized_payload['mensaje_asistente']:
        return _fallback_from_raw_text(response_text, message, history, is_image)

    try:
        return ChatResponse.model_validate(normalized_payload)
    except ValidationError as exc:
        logger.warning('Gemini JSON failed schema validation. error=%s', _summarize_error(exc))
        normalized_payload['mensaje_asistente'] = normalized_payload['mensaje_asistente'][:5000]
        normalized_payload['emocion_usuario'] = normalized_payload['emocion_usuario'][:220]
        normalized_payload['sitio_origen'] = normalized_payload['sitio_origen'][:160]
        return ChatResponse.model_validate(normalized_payload)


def _strip_json_fence(text: str) -> str:
    stripped = text.strip()
    fenced_match = re.fullmatch(r'```(?:json)?\s*(.*?)\s*```', stripped, flags=re.DOTALL | re.IGNORECASE)

    if fenced_match:
        return fenced_match.group(1).strip()

    object_match = re.search(r'\{.*\}', stripped, flags=re.DOTALL)
    if object_match:
        return object_match.group(0).strip()

    return stripped


def _fallback_from_raw_text(
    response_text: str,
    message: str,
    history: list[ChatHistoryMessage],
    is_image: bool,
) -> ChatResponse:
    raw_message = _clean_text(response_text)

    if not raw_message:
        return _fallback_image_response(message, history) if is_image else _fallback_response(message, history)

    return _build_response(
        tipo_barrera=_infer_barrier_type(message, is_image),
        gravedad=_infer_severity(message, is_image),
        emocion_usuario=_infer_emotion(message),
        sitio_origen=_infer_context(message, history) or 'Destino no identificado',
        mensaje_asistente=raw_message,
    )


def _normalize_barrier_type(value: Any, message: str, is_image: bool) -> str:
    cleaned = _clean_text(value)

    if cleaned in BARRIER_TYPES:
        return cleaned

    lowered = cleaned.lower()
    if 'infra' in lowered or 'física' in lowered or 'fisica' in lowered:
        return 'Infraestructura / Física'
    if 'comunic' in lowered or 'sensorial' in lowered:
        return 'Comunicacional / Sensorial'
    if 'ninguna' in lowered or 'guía' in lowered or 'guia' in lowered:
        return 'Ninguna / Guía Informativa'

    return _infer_barrier_type(message, is_image)


def _normalize_severity(value: Any, message: str, is_image: bool) -> str:
    cleaned = _clean_text(value).capitalize()

    if cleaned in SEVERITIES:
        return cleaned

    return _infer_severity(message, is_image)


def _clean_text(value: Any) -> str:
    if value is None:
        return ''

    return str(value).replace('\x00', '').strip()


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
    conversation = _format_conversation(history)

    return f"""
Contexto reciente de la conversación:
{conversation}

Nuevo mensaje del usuario:
{message}

Devuelve únicamente un objeto JSON válido con estas llaves exactas:
tipo_barrera, gravedad, emocion_usuario, sitio_origen, mensaje_asistente.

Prioriza una respuesta conversacional premium, cálida y útil dentro de mensaje_asistente.
Si es una guía de viaje, no inventes barreras: usa tipo_barrera "Ninguna / Guía Informativa" y gravedad "Ninguna".
Si detectas solicitud por voz, baja visión o audio, expande orientación espacial, referencias táctiles, iluminación y distancias.
""".strip()


def _build_image_prompt(message: str, history: list[ChatHistoryMessage], mime_type: str) -> str:
    conversation = _format_conversation(history)

    return f"""
Contexto reciente de la conversación:
{conversation}

Mensaje del usuario junto a la imagen:
{message}

Tipo de archivo recibido:
{mime_type}

Analiza la fotografía como visión artificial de accesibilidad turística.
Observa sardineles, escalones, rampas, ancho de paso, relieve, iluminación,
barandas, obstáculos, contraste visual, señalización y flujo peatonal.

Devuelve únicamente un objeto JSON válido con estas llaves exactas:
tipo_barrera, gravedad, emocion_usuario, sitio_origen, mensaje_asistente.

En mensaje_asistente explica qué se observa, por qué importa para una persona viajera
y qué desvío o acción amable recomiendas de inmediato.
""".strip()


def _format_conversation(history: list[ChatHistoryMessage]) -> str:
    conversation = '\n'.join(
        f"{'Usuario' if item.role == 'user' else 'NAVORA AI'}: {item.content}"
        for item in history
    )

    return conversation or 'Sin historial previo.'


def _fallback_response(message: str, history: list[ChatHistoryMessage]) -> ChatResponse:
    lowered = message.lower()
    context = _infer_context(message, history)

    if any(word in lowered for word in ['puente', 'suspiros', 'patrimonio', 'historia', 'muéstrame', 'muestrame']):
        return _build_response(
            tipo_barrera='Ninguna / Guía Informativa',
            gravedad='Ninguna',
            emocion_usuario=_infer_emotion(message),
            sitio_origen=context or 'Barranco',
            mensaje_asistente=(
                'El Puente de los Suspiros se siente como una pausa poética de Barranco: '
                'balcones, música y una brisa suave que conecta historia y barrio. 🌉 '
                'Para vivirlo con menos barreras, te sugiero llegar por una ruta de pendiente suave, '
                'avanzar con calma y elegir el atardecer, cuando el ambiente es más sereno y sensorial.'
            ),
        )

    if any(word in lowered for word in ['cafetería', 'cafeteria', 'café', 'cafe', 'comer', 'descansar']):
        place = context or 'la zona que mencionaste'
        return _build_response(
            tipo_barrera='Ninguna / Guía Informativa',
            gravedad='Ninguna',
            emocion_usuario=_infer_emotion(message),
            sitio_origen=place,
            mensaje_asistente=(
                f'Si seguimos hablando de {place}, buscaría una cafetería tranquila, con ingreso amplio, '
                'espacio para maniobrar y mesas accesibles. ☕ También conviene elegir horarios de menor afluencia '
                'para que la pausa sea más cómoda, especialmente si vienes con silla de ruedas, baja visión o una persona adulta mayor.'
            ),
        )

    if any(word in lowered for word in ['cusco', 'machu', 'miraflores', 'barranco', 'centro histórico', 'centro historico']):
        place = context or _infer_place_from_text(lowered) or 'ese destino'
        return _build_response(
            tipo_barrera='Ninguna / Guía Informativa',
            gravedad='Ninguna',
            emocion_usuario=_infer_emotion(message),
            sitio_origen=place,
            mensaje_asistente=(
                f'{place} tiene una identidad cultural muy especial. ✨ Puedo ayudarte a vivirlo con un ritmo tranquilo: '
                'elegir horarios de menor afluencia, ubicar rutas con menos pendiente, reconocer puntos de descanso '
                'y convertir la visita en una experiencia más segura, sensible e inclusiva.'
            ),
        )

    return _build_response(
        tipo_barrera=_infer_barrier_type(message, is_image=False),
        gravedad=_infer_severity(message, is_image=False),
        emocion_usuario=_infer_emotion(message),
        sitio_origen=context or 'Destino no identificado',
        mensaje_asistente=(
            f'Estoy reorganizando la mejor ruta accesible para ti{f" en {context}" if context else ""}. '
            'Puedo ayudarte a entender la barrera, recordar el destino del que venimos hablando, sugerir una alternativa más cómoda '
            'y transformar tu reporte en una recomendación clara para explorar el Perú con menos obstáculos. 🧭'
        ),
    )


def _fallback_image_response(message: str, history: list[ChatHistoryMessage]) -> ChatResponse:
    context = _infer_context(message, history)

    return _build_response(
        tipo_barrera='Infraestructura / Física',
        gravedad='Media',
        emocion_usuario=_infer_emotion(message),
        sitio_origen=context or 'Destino no identificado',
        mensaje_asistente=(
            f'Estoy revisando la imagen con enfoque de accesibilidad{f" en {context}" if context else ""}. 📷 '
            'Observa si hay sardinel alto, escalones sin rampa, pasillos estrechos, señalización poco visible u obstáculos en la vereda. '
            'Para viajar con más calma, conviene buscar un ingreso alterno amplio, buena iluminación y una ruta con puntos de descanso cercanos.'
        ),
    )


def _build_response(
    tipo_barrera: str,
    gravedad: str,
    emocion_usuario: str,
    sitio_origen: str,
    mensaje_asistente: str,
) -> ChatResponse:
    return ChatResponse(
        tipo_barrera=_normalize_barrier_type(tipo_barrera, mensaje_asistente, False),
        gravedad=_normalize_severity(gravedad, mensaje_asistente, False),
        emocion_usuario=emocion_usuario.strip() or 'Busca orientación clara y segura',
        sitio_origen=sitio_origen.strip() or 'Destino no identificado',
        mensaje_asistente=mensaje_asistente.strip(),
    )


def _infer_barrier_type(message: str, is_image: bool) -> str:
    lowered = message.lower()

    if is_image:
        return 'Infraestructura / Física'

    if any(word in lowered for word in ['rampa', 'sardinel', 'escalón', 'escalon', 'vereda', 'silla', 'ruedas', 'obstáculo', 'obstaculo']):
        return 'Infraestructura / Física'

    if any(word in lowered for word in ['baja visión', 'baja vision', 'audio', 'voz', 'señalización', 'senalizacion', 'ruido', 'auditiva']):
        return 'Comunicacional / Sensorial'

    return 'Ninguna / Guía Informativa'


def _infer_severity(message: str, is_image: bool) -> str:
    lowered = message.lower()

    if any(word in lowered for word in ['peligro', 'bloqueado', 'bloqueada', 'no puedo pasar', 'imposible', 'caída', 'caida']):
        return 'Alta'

    if is_image or any(word in lowered for word in ['rampa', 'sardinel', 'escalón', 'escalon', 'silla', 'ruedas', 'obstáculo', 'obstaculo']):
        return 'Media'

    if any(word in lowered for word in ['señalización', 'senalizacion', 'contraste', 'ruido', 'iluminación', 'iluminacion']):
        return 'Baja'

    return 'Ninguna'


def _infer_emotion(message: str) -> str:
    lowered = message.lower()

    if any(word in lowered for word in ['urgente', 'peligro', 'miedo', 'no puedo', 'ayuda']):
        return 'Preocupación y necesidad de ayuda inmediata'

    if any(word in lowered for word in ['confundido', 'confundida', 'perdido', 'perdida', 'cómo llego', 'como llego']):
        return 'Incertidumbre y búsqueda de orientación clara'

    if any(word in lowered for word in ['quiero', 'muéstrame', 'muestrame', 'explorar', 'visitar', 'guía', 'guia']):
        return 'Curiosidad y deseo de explorar con confianza'

    return 'Busca una experiencia más cómoda, segura e inclusiva'


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
        return 'Centro Histórico'

    return None
