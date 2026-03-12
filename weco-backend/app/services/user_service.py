from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from fastapi import HTTPException, status

from ..models.user import User
from ..models.transaction import Transaction
from ..core.security import get_password_hash, generate_qr_token
from ..schemas.user import UserCreate


class UserService:
    """Сервис для работы с пользователями"""
    
    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
        """Создание нового пользователя"""
        # Проверка уникальности имени
        existing_user = await db.execute(
            select(User).where(User.username == user_data.username)
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким именем уже существует"
            )
        
        # Создание пользователя
        user = User(
            username=user_data.username,
            password_hash=get_password_hash(user_data.password),
            qr_token=generate_qr_token()
        )
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    
    @staticmethod
    async def get_user_with_balance(db: AsyncSession, user: User) -> dict:
        """Получение пользователя с балансом поинтов"""
        # Подсчитываем сумму всех транзакций
        result = await db.execute(
            select(func.coalesce(func.sum(Transaction.delta_points), 0))
            .where(Transaction.user_id == user.id)
        )
        total_points = result.scalar()
        
        return {
            "id": user.id,
            "username": user.username,
            "qr_token": user.qr_token,
            "status": "Active",
            "total_points": total_points,
            "created_at": user.created_at
        }
    
    @staticmethod
    async def get_user_transactions(db: AsyncSession, user: User) -> List[Transaction]:
        """Получение списка транзакций пользователя"""
        result = await db.execute(
            select(Transaction)
            .where(Transaction.user_id == user.id)
            .order_by(Transaction.created_at.desc())
        )
        return result.scalars().all()