from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class MachineResponse(BaseModel):
    """Схема ответа для машины/бокса"""
    id: str
    title: str
    address: str
    lat: float
    lng: float
    photo_url: str
    bottles_collected: int
    
    class Config:
        from_attributes = True


class MachineDetailResponse(BaseModel):
    """Схема детальной информации о машине/боксе"""
    id: str
    title: str
    address: str
    lat: float
    lng: float
    photo_url: str
    description: Optional[str] = None
    bottles_collected: int
    
    class Config:
        from_attributes = True