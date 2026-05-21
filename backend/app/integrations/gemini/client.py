from functools import lru_cache
import warnings

from app.core.config import settings
from app.services.ai.prompts import NAVORA_SYSTEM_PROMPT


@lru_cache
def get_gemini_model(model_name: str | None = None):
    if not settings.gemini_api_key:
        raise RuntimeError('Gemini API key is not configured.')

    with warnings.catch_warnings():
        warnings.simplefilter('ignore', FutureWarning)
        import google.generativeai as genai

    genai.configure(api_key=settings.gemini_api_key)

    return genai.GenerativeModel(
        model_name=model_name or settings.gemini_model,
        system_instruction=NAVORA_SYSTEM_PROMPT,
    )
