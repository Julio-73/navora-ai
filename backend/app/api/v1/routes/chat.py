import json
import logging

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from app.schemas.chat import ChatHistoryMessage, ChatRequest, ChatResponse
from app.services.chat_service import generate_chat_response, generate_image_chat_response

router = APIRouter()
logger = logging.getLogger(__name__)

MAX_UPLOAD_BYTES = 4 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp'}


@router.post('/chat', response_model=ChatResponse)
def chat(request: ChatRequest) -> JSONResponse:
    try:
        response = generate_chat_response(request.message, request.history)
        return _utf8_json_response(response)
    except Exception as exc:
        logger.exception('Chat route failed before response serialization.')
        raise HTTPException(status_code=500, detail='NAVORA está reorganizando la mejor respuesta para ti.') from exc


@router.post('/chat/image', response_model=ChatResponse)
async def chat_image(
    image: UploadFile = File(...),
    message: str = Form(''),
    history: str = Form('[]'),
) -> JSONResponse:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail='Formato no compatible. Sube una imagen JPG, PNG o WebP.',
        )

    try:
        image_bytes = await image.read()
    finally:
        await image.close()

    if not image_bytes or len(image_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400,
            detail='La imagen debe pesar menos de 4 MB.',
        )

    try:
        response = generate_image_chat_response(
            message=message,
            history=_parse_history(history),
            image_bytes=image_bytes,
            mime_type=image.content_type,
        )
        return _utf8_json_response(response)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception('Image chat route failed before response serialization.')
        raise HTTPException(status_code=500, detail='NAVORA está revisando la imagen con más cuidado. Intenta nuevamente.') from exc


def _parse_history(raw_history: str) -> list[ChatHistoryMessage]:
    try:
        decoded = json.loads(raw_history)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail='Historial inválido.') from exc

    if not isinstance(decoded, list):
        raise HTTPException(status_code=400, detail='Historial inválido.')

    try:
        return [ChatHistoryMessage.model_validate(item) for item in decoded[-12:]]
    except Exception as exc:
        raise HTTPException(status_code=400, detail='Historial inválido.') from exc


def _utf8_json_response(response: ChatResponse) -> JSONResponse:
    return JSONResponse(
        content=response.model_dump(mode='json'),
        media_type='application/json; charset=utf-8',
    )
