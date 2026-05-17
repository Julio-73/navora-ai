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


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
