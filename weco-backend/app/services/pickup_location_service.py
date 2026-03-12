from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.pickup_location import PickupLocation


class PickupLocationService:
    """Сервис для работы с партнерскими точками выдачи"""
    
    @staticmethod
    async def get_all_active_pickup_locations(db: AsyncSession) -> List[PickupLocation]:
        """Получить все активные точки выдачи"""
        result = await db.execute(
            select(PickupLocation)
            .where(PickupLocation.is_active == True)
            .order_by(PickupLocation.created_at)
        )
        return result.scalars().all()
    
    @staticmethod
    async def get_pickup_location_by_id(db: AsyncSession, pickup_location_id: int) -> Optional[PickupLocation]:
        """Получить точку выдачи по ID"""
        result = await db.execute(
            select(PickupLocation)
            .where(PickupLocation.id == pickup_location_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def pickup_location_exists_and_active(db: AsyncSession, pickup_location_id: int) -> bool:
        """Проверить, существует ли точка выдачи и активна ли она"""
        result = await db.execute(
            select(PickupLocation.id)
            .where(PickupLocation.id == pickup_location_id)
            .where(PickupLocation.is_active == True)
        )
        return result.scalar_one_or_none() is not None