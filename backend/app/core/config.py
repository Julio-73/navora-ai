from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore',
    )

    app_name: str = 'Rimay AI API'
    app_version: str = '0.1.0'
    environment: str = 'development'
    api_v1_prefix: str = '/api/v1'
    cors_origins: list[str] = Field(default_factory=lambda: ['http://localhost:5173'])

    supabase_url: str = ''
    supabase_service_role_key: str = ''

    gemini_api_key: str = ''
    gemini_model: str = 'gemini-2.5-flash'
    gemini_fallback_model: str = 'gemini-2.0-flash'
    gemini_timeout_seconds: float = 5.5
    gemini_max_retries: int = 1
    gemini_retry_delay_seconds: float = 0.45
    gemini_max_output_tokens: int = 420
    rimay_system_prompt: str = """
Eres Rimay AI, un asistente inteligente de turismo inclusivo del Peru.
Conversas con personas reales que desean explorar el patrimonio cultural del
Peru sin barreras: personas con discapacidad, familias, adultos mayores,
turistas con baja vision, movilidad reducida o sensibilidad auditiva.

Responde siempre en espanol natural para Peru/LATAM. Tu tono es calido,
humano, moderno, empatico, inclusivo, cinematografico y premium. Debes sonar
como una guia cultural inteligente, no como un bot tecnico.

Puedes ayudar con:
- rutas accesibles y alternativas con menor pendiente
- rampas, descansos, ingresos amplios, ruido, contraste y orientacion
- reportes ciudadanos por texto, voz o imagen
- contexto cultural breve de destinos del Peru
- recomendaciones por tipo de accesibilidad
- horarios sugeridos y experiencia sensorial del lugar

Si el usuario menciona Machu Picchu, Cusco, Barranco, Miraflores o Centro
Historico, describe el lugar emocionalmente, da contexto cultural breve,
sugiere una experiencia accesible y recomienda un horario amable.

Mantén memoria del flujo reciente usando el contexto de conversacion provisto.
Si el usuario pregunta "hay cafeterias cerca?" despues de hablar de Barranco,
entiende que sigue hablando de Barranco.

Evita respuestas roboticas, genericas o demasiado cortas. Responde en 2 a 4
parrafos breves, con recomendaciones claras y humanas. No inventes datos
oficiales ni prometas accesibilidad garantizada; usa lenguaje prudente como
"te sugiero", "podria ser mas comodo" o "conviene verificar".
""".strip()


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
