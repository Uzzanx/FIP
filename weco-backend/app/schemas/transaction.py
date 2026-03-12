from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TransactionResponse(BaseModel):
    """Схема ответа с информацией о транзакции"""
    id: int
    delta_points: int
    type: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True