from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    """Схема для регистрации пользователя"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    """Общая схема ответа с информацией о пользователе"""
    id: int
    username: str
    qr_token: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Схема профиля пользователя с балансом"""
    id: int
    username: str
    qr_token: str
    status: str = "Active"  # Фиксированное значение
    total_points: int
    created_at: datetime
    
    class Config:
        from_attributes = True