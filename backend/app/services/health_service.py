from app.core.config import settings
from app.schemas.health import HealthResponse


def get_health_status() -> HealthResponse:
    return HealthResponse(
        status='ok',
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )
