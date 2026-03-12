from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..models.machine import Machine
from ..models.transaction import Transaction


class MachineService:
    """Сервис для работы с eco-боксами"""
    
    @staticmethod
    async def get_all_active_machines(db: AsyncSession) -> List[dict]:
        """Получить все активные машины с количеством собранных бутылок"""
        query = (
            select(
                Machine,
                func.coalesce(func.count(Transaction.id), 0).label('bottles_collected')
            )
            .outerjoin(
                Transaction,
                (Transaction.machine_id == Machine.id) & (Transaction.type == 'bottle_recycled')
            )
            .where(Machine.is_active == True)
            .group_by(Machine.id)
            .order_by(Machine.created_at)
        )
        
        result = await db.execute(query)
        machines_with_counts = result.all()
        
        return [
            {
                "id": machine.id,
                "title": machine.title,
                "address": machine.address,
                "lat": machine.lat,
                "lng": machine.lng,
                "photo_url": machine.photo_url,
                "bottles_collected": bottles_collected
            }
            for machine, bottles_collected in machines_with_counts
        ]
    
    @staticmethod
    async def get_machine_detail(db: AsyncSession, machine_id: str) -> Optional[dict]:
        """Получить детальную информацию о машине"""
        query = (
            select(
                Machine,
                func.coalesce(func.count(Transaction.id), 0).label('bottles_collected')
            )
            .outerjoin(
                Transaction,
                (Transaction.machine_id == Machine.id) & (Transaction.type == 'bottle_recycled')
            )
            .where(Machine.id == machine_id)
            .group_by(Machine.id)
        )
        
        result = await db.execute(query)
        machine_data = result.first()
        
        if not machine_data:
            return None
            
        machine, bottles_collected = machine_data
        
        return {
            "id": machine.id,
            "title": machine.title,
            "address": machine.address,
            "lat": machine.lat,
            "lng": machine.lng,
            "photo_url": machine.photo_url,
            "description": machine.description,
            "bottles_collected": bottles_collected
        }
    
    @staticmethod
    async def machine_exists_and_active(db: AsyncSession, machine_id: str) -> bool:
        """Проверить, существует ли машина и активна ли она"""
        result = await db.execute(
            select(Machine.id)
            .where(Machine.id == machine_id)
            .where(Machine.is_active == True)
        )
        return result.scalar_one_or_none() is not None