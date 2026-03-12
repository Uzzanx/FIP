from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status

from ..models.user import User
from ..models.reward_item import RewardItem
from ..models.transaction import Transaction
from .redemption_service import RedemptionService


class RewardService:
    """Сервис для работы с наградами и мерчандайзом"""
    
    @staticmethod
    async def get_active_rewards(db: AsyncSession) -> List[RewardItem]:
        """Получение списка активных товаров"""
        result = await db.execute(
            select(RewardItem)
            .where(RewardItem.is_active == True)
            .order_by(RewardItem.points_cost.asc())
        )
        return result.scalars().all()
    
    @staticmethod
    async def get_reward_by_id(db: AsyncSession, reward_id: int) -> RewardItem:
        """Получение товара по ID"""
        result = await db.execute(
            select(RewardItem).where(RewardItem.id == reward_id)
        )
        reward = result.scalar_one_or_none()
        
        if not reward:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Товар не найден"
            )
        
        if not reward.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Товар недоступен для покупки"
            )
        
        return reward
    
    @staticmethod
    async def get_user_balance(db: AsyncSession, user: User) -> int:
        """Получение баланса пользователя"""
        result = await db.execute(
            select(func.coalesce(func.sum(Transaction.delta_points), 0))
            .where(Transaction.user_id == user.id)
        )
        return result.scalar()
    
    @staticmethod
    async def redeem_reward(db: AsyncSession, user: User, reward: RewardItem) -> Tuple[Transaction, dict]:
        """Покупка товара за поинты с созданием redemption"""
        # Проверяем баланс
        balance = await RewardService.get_user_balance(db, user)
        
        if balance < reward.points_cost:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Недостаточно поинтов. Нужно: {reward.points_cost}, доступно: {balance}"
            )
        
        # Создаём транзакцию списания
        transaction = Transaction(
            user_id=user.id,
            delta_points=-reward.points_cost,
            type="reward_redeemed",
            description=f"Покупка: {reward.title}"
        )
        
        db.add(transaction)
        
        # Создаём redemption
        redemption = await RedemptionService.create_redemption(db, user, reward)
        
        # Обновляем transaction
        await db.refresh(transaction)
        
        # Формируем ответ
        redemption_info = {
            "redemption_id": redemption.id,
            "code": redemption.code,
            "expires_at": redemption.expires_at,
            "points_deducted": reward.points_cost
        }
        
        return transaction, redemption_info