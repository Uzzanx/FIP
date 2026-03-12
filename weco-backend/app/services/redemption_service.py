import random
import string
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from ..models.redemption import Redemption
from ..models.reward_item import RewardItem
from ..models.user import User
from ..models.pickup_location import PickupLocation
from ..models.pickup_inventory import PickupInventory


class RedemptionService:
    """Сервис для работы с погашением наград"""
    
    @staticmethod
    def generate_code() -> str:
        """Генерирует уникальный код из 8 символов (uppercase letters + digits)"""
        chars = string.ascii_uppercase + string.digits
        return ''.join(random.choices(chars, k=8))
    
    @staticmethod
    async def ensure_unique_code(db: AsyncSession) -> str:
        """Генерирует уникальный код, проверяя что он не существует в БД"""
        max_attempts = 10
        for _ in range(max_attempts):
            code = RedemptionService.generate_code()
            # Проверяем уникальность
            result = await db.execute(
                select(Redemption.id).where(Redemption.code == code)
            )
            if result.scalar_one_or_none() is None:
                return code
        
        # Если не удалось найти уникальный код за 10 попыток
        raise Exception("Could not generate unique redemption code")
    
    @staticmethod
    async def create_redemption(
        db: AsyncSession, 
        user: User, 
        reward: RewardItem
    ) -> Redemption:
        """Создает новое погашение награды"""
        code = await RedemptionService.ensure_unique_code(db)
        expires_at = datetime.now(timezone.utc) + timedelta(days=30)
        
        redemption = Redemption(
            user_id=user.id,
            reward_id=reward.id,
            code=code,
            status='PENDING',
            expires_at=expires_at
        )
        
        db.add(redemption)
        await db.commit()
        await db.refresh(redemption)
        
        return redemption
    
    @staticmethod
    async def get_user_pending_redemptions(
        db: AsyncSession, 
        user: User
    ) -> List[dict]:
        """Получает все PENDING redemptions пользователя с информацией о наградах"""
        query = (
            select(Redemption, RewardItem)
            .join(RewardItem, Redemption.reward_id == RewardItem.id)
            .where(Redemption.user_id == user.id)
            .where(Redemption.status == 'PENDING')
            .order_by(Redemption.created_at.desc())
        )
        
        result = await db.execute(query)
        redemption_rewards = result.all()
        
        return [
            {
                "id": redemption.id,
                "reward_id": reward.id,
                "reward_title": reward.title,
                "reward_description": reward.description,
                "reward_image_url": reward.image_url,
                "code": redemption.code,
                "created_at": redemption.created_at,
                "expires_at": redemption.expires_at
            }
            for redemption, reward in redemption_rewards
        ]
    
    @staticmethod
    async def get_inventory_stock(db: AsyncSession, pickup_location_id: int, reward_id: int) -> int:
        """Получить остаток товара в точке выдачи"""
        result = await db.execute(
            select(PickupInventory.stock)
            .where(and_(
                PickupInventory.pickup_location_id == pickup_location_id,
                PickupInventory.reward_id == reward_id
            ))
        )
        stock = result.scalar_one_or_none()
        return stock if stock is not None else 0
    
    @staticmethod
    async def preview_redemption(
        db: AsyncSession, 
        code: str, 
        pickup_location_id: int
    ) -> Tuple[Optional[dict], str]:
        """Предпросмотр redemption по коду с проверкой остатков"""
        # Ищем redemption с подгрузкой reward и user
        query = (
            select(Redemption, RewardItem, User)
            .join(RewardItem, Redemption.reward_id == RewardItem.id)
            .join(User, Redemption.user_id == User.id)
            .where(Redemption.code == code)
        )
        
        result = await db.execute(query)
        data = result.first()
        
        if not data:
            return None, "not_found"
        
        redemption, reward, user = data
        
        # Определяем статус
        if redemption.status != "PENDING":
            status = "claimed"
        elif datetime.now(timezone.utc) > redemption.expires_at:
            status = "expired"
        else:
            status = "pending"
        
        # Получаем остаток
        stock = await RedemptionService.get_inventory_stock(db, pickup_location_id, reward.id)
        can_claim = status == "pending" and stock > 0
        
        return {
            "status": status,
            "reward_title": reward.title,
            "reward_image_url": reward.image_url,
            "username": user.username,
            "expires_at": redemption.expires_at,
            "stock": stock,
            "can_claim": can_claim
        }, "success"
    @staticmethod
    async def claim_redemption_with_inventory(
        db: AsyncSession, 
        code: str,
        pickup_location_id: int
    ) -> Tuple[Optional[dict], str]:
        """Погашает redemption по коду с учетом inventory. Возвращает (result_data, error_code)"""
        # Ищем redemption с подгрузкой reward, user и pickup_location
        query = (
            select(Redemption, RewardItem, User, PickupLocation)
            .join(RewardItem, Redemption.reward_id == RewardItem.id)
            .join(User, Redemption.user_id == User.id)
            .join(PickupLocation, PickupLocation.id == pickup_location_id)
            .where(Redemption.code == code)
        )
        
        result = await db.execute(query)
        data = result.first()
        
        if not data:
            return None, "not_found"
        
        redemption, reward, user, pickup_location = data
        
        # Проверяем статус
        if redemption.status != "PENDING":
            return None, "already_claimed"
        
        # Проверяем срок действия
        if datetime.now(timezone.utc) > redemption.expires_at:
            return None, "expired"
        
        # Проверяем остаток
        inventory_result = await db.execute(
            select(PickupInventory)
            .where(and_(
                PickupInventory.pickup_location_id == pickup_location_id,
                PickupInventory.reward_id == reward.id
            ))
        )
        inventory = inventory_result.scalar_one_or_none()
        
        if not inventory or inventory.stock <= 0:
            return None, "out_of_stock"
        
        # Атомарно погашаем и списываем stock
        redemption.status = "CLAIMED"
        redemption.claimed_at = datetime.now(timezone.utc)
        redemption.claimed_by = f"pickup_location:{pickup_location_id}"
        inventory.stock -= 1
        
        await db.commit()
        
        return {
            "status": "claimed",
            "reward_title": reward.title,
            "username": user.username,
            "pickup_location_id": pickup_location_id,
            "remaining_stock": inventory.stock
        }, "success"