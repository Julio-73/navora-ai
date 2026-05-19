from pydantic import BaseModel, Field


class ChatHistoryMessage(BaseModel):
    role: str = Field(..., pattern='^(user|assistant)$')
    content: str = Field(..., min_length=1, max_length=1600)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1200)
    history: list[ChatHistoryMessage] = Field(default_factory=list, max_length=12)


class ChatResponse(BaseModel):
    response: str
