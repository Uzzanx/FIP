from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class RedemptionResponse(BaseModel):
    """Схема ответа с информацией о погашении награды"""
    id: UUID
    reward_id: int
    reward_title: str
    reward_description: Optional[str]
    reward_image_url: Optional[str]
    code: str
    created_at: datetime
    expires_at: datetime
    
    class Config:
        from_attributes = True


class RedeemRewardResponse(BaseModel):
    """Схема ответа на redeem награды с информацией о коде"""
    redemption_id: UUID
    code: str
    expires_at: datetime
    points_deducted: int
    
    class Config:
        from_attributes = True


class StaffClaimRequest(BaseModel):
    """Схема запроса на погашение кода сотрудником"""
    code: str
    pickup_location_id: int


class StaffClaimResponse(BaseModel):
    """Схема ответа на погашение кода"""
    status: str
    reward_title: str
    username: str
    pickup_location_id: int
    remaining_stock: Optional[int] = None
    
    class Config:
        from_attributes = True


class StaffPreviewRequest(BaseModel):
    """Схема запроса на предпросмотр кода"""
    code: str
    pickup_location_id: int


class StaffPreviewResponse(BaseModel):
    """Схема ответа на предпросмотр кода"""
    status: str  # pending/claimed/expired
    reward_title: str
    reward_image_url: Optional[str]
    username: str
    expires_at: datetime
    stock: int
    can_claim: bool
    
    class Config:
        from_attributes = True