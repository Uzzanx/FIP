from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class MachineScanRequest(BaseModel):
    """Схема запроса от машины на сканирование QR"""
    qr_token: str
    machine_id: str


class VerificationSessionResponse(BaseModel):
    """Схема ответа с информацией о сессии проверки"""
    id: str
    status: str
    is_bottle: Optional[bool]
    expires_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class VerificationStartRequest(BaseModel):
    """Схема запроса на начало проверки"""
    pass  # Идентификатор сессии в URL


class VerificationResultRequest(BaseModel):
    """Схема запроса от машины с результатом"""
    session_id: str
    is_bottle: bool
    event_id: Optional[str] = None  # Опциональный event_id для дополнительной защиты от дублей


class MachineSessionPollResponse(BaseModel):
    """Схема ответа для поллинга статуса сессии"""
    status: str
    should_start: bool