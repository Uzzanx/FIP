from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RewardItemResponse(BaseModel):
    """Схема ответа с информацией о товаре"""
    id: int
    title: str
    description: Optional[str]
    points_cost: int
    image_url: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class RewardRedeemRequest(BaseModel):
    """Схема запроса на покупку товара"""
    pass  # Идентификатор товара в URL