import json

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.chat import ChatHistoryMessage, ChatRequest, ChatResponse
from app.services.chat_service import generate_chat_response, generate_image_chat_response

router = APIRouter()

MAX_UPLOAD_BYTES = 4 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp'}


@router.post('/chat', response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    return generate_chat_response(request.message, request.history)


@router.post('/chat/image', response_model=ChatResponse)
async def chat_image(
    image: UploadFile = File(...),
    message: str = Form(''),
    history: str = Form('[]'),
) -> ChatResponse:
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

    return generate_image_chat_response(
        message=message,
        history=_parse_history(history),
        image_bytes=image_bytes,
        mime_type=image.content_type,
    )


def _parse_history(raw_history: str) -> list[ChatHistoryMessage]:
    try:
        decoded = json.loads(raw_history)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail='Historial invalido.') from exc

    if not isinstance(decoded, list):
        raise HTTPException(status_code=400, detail='Historial invalido.')

    try:
        return [ChatHistoryMessage.model_validate(item) for item in decoded[-12:]]
    except Exception as exc:
        raise HTTPException(status_code=400, detail='Historial invalido.') from exc
