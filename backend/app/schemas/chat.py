from typing import Literal

from pydantic import BaseModel, Field, computed_field


BarrierType = Literal[
    'Infraestructura / Física',
    'Comunicacional / Sensorial',
    'Ninguna / Guía Informativa',
]
Severity = Literal['Alta', 'Media', 'Baja', 'Ninguna']


class ChatHistoryMessage(BaseModel):
    role: str = Field(..., pattern='^(user|assistant)$')
    content: str = Field(..., min_length=1, max_length=1600)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1200)
    history: list[ChatHistoryMessage] = Field(default_factory=list, max_length=12)


class ChatResponse(BaseModel):
    tipo_barrera: BarrierType
    gravedad: Severity
    emocion_usuario: str = Field(..., min_length=2, max_length=220)
    sitio_origen: str = Field(..., min_length=2, max_length=160)
    mensaje_asistente: str = Field(..., min_length=20, max_length=5000)

    @computed_field(return_type=str)
    @property
    def response(self) -> str:
        return self.mensaje_asistente
