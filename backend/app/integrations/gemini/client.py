from functools import lru_cache

from google import genai

from app.core.config import settings


@lru_cache
def get_gemini_client() -> genai.Client:
    if not settings.gemini_api_key:
        raise RuntimeError('Gemini API key is not configured.')

    return genai.Client(api_key=settings.gemini_api_key)
