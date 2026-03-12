from datetime import timedelta
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from ..models.user import User
from ..core.security import verify_password, create_access_token


class AuthService:
    """Сервис для аутентификации пользователей"""
    
    @staticmethod
    async def authenticate_user(db: AsyncSession, username: str, password: str) -> Optional[User]:
        """Проверка креденшалов пользователя"""
        result = await db.execute(
            select(User).where(User.username == username)
        )
        user = result.scalar_one_or_none()
        
        if user and verify_password(password, user.password_hash):
            return user
        return None
    
    @staticmethod
    async def create_access_token_for_user(user: User) -> str:
        """Создание JWT токена для пользователя"""
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=access_token_expires
        )
        return access_token
    
    @staticmethod
    async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
        """Получение пользователя по имени"""
        result = await db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_qr_token(db: AsyncSession, qr_token: str) -> Optional[User]:
        """Получение пользователя по QR токену"""
        result = await db.execute(
            select(User).where(User.qr_token == qr_token)
        )
        return result.scalar_one_or_none()