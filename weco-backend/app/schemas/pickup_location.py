from typing import Optional

from pydantic import BaseModel


class PickupLocationResponse(BaseModel):
    """Схема ответа для партнерской точки выдачи"""
    id: int
    title: str
    address: str
    lat: float
    lng: float
    photo_url: Optional[str]
    
    class Config:
        from_attributes = True


class PickupLocationDetailResponse(BaseModel):
    """Схема детальной информации о партнерской точке выдачи"""
    id: int
    title: str
    address: str
    lat: float
    lng: float
    photo_url: Optional[str]
    
    class Config:
        from_attributes = True