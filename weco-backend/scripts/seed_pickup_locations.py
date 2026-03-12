#!/usr/bin/env python3
"""
Seed script для создания партнерских точек выдачи и их инвентаря
Использование: python scripts/seed_pickup_locations.py
"""
import asyncio
import sys
import os
from pathlib import Path

# Добавляем корневую директорию в PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text, select
from app.core.database import AsyncSessionLocal
from app.models.pickup_location import PickupLocation
from app.models.pickup_inventory import PickupInventory
from app.models.reward_item import RewardItem


async def seed_pickup_locations():
    """Добавляет партнерские точки выдачи и их инвентарь если их нет"""
    async with AsyncSessionLocal() as db:
        try:
            # Проверяем количество точек выдачи
            result = await db.execute(text("SELECT COUNT(*) FROM pickup_locations"))
            count = result.scalar()
            
            if count > 0:
                print(f"✓ В базе уже есть {count} партнерских точек выдачи. Пропускаем seed.")
                return
                
            print("🔄 Создаём партнерские точки выдачи...")
            
            pickup_locations = [
                PickupLocation(
                    title="Partner Store Mall",
                    address="Shopping Mall, 2nd Floor",
                    lat=42.8765,
                    lng=74.5712,
                    photo_url="/static/pickups/partner1.jpg",
                    is_active=True
                ),
                PickupLocation(
                    title="Eco Shop Downtown",
                    address="Green Boulevard 25",
                    lat=42.8823,
                    lng=74.5689,
                    photo_url="/static/pickups/partner2.jpg",
                    is_active=True
                ),
                PickupLocation(
                    title="Campus Store",
                    address="University Campus, Student Center", 
                    lat=42.8691,
                    lng=74.5834,
                    photo_url="/static/pickups/partner3.jpg",
                    is_active=True
                )
            ]
            
            for location in pickup_locations:
                db.add(location)
            
            await db.commit()
            
            # Refresh для получения ID
            for location in pickup_locations:
                await db.refresh(location)
            
            print(f"✅ Успешно добавлено {len(pickup_locations)} партнерских точек выдачи")
            
            # Показываем что создали
            for location in pickup_locations:
                print(f"   - {location.id}: {location.title} ({location.address})")
            
            # Добавляем инвентарь для активных товаров
            print("🔄 Создаём инвентарь для партнерских точек...")
            
            # Получаем активные товары
            reward_result = await db.execute(
                select(RewardItem).where(RewardItem.is_active == True)
            )
            active_rewards = reward_result.scalars().all()
            
            if not active_rewards:
                print("⚠️ Нет активных товаров для создания инвентаря")
                return
            
            inventory_count = 0
            for location in pickup_locations:
                for reward in active_rewards:
                    # Создаём запись инвентаря с базовым запасом
                    inventory = PickupInventory(
                        pickup_location_id=location.id,
                        reward_id=reward.id,
                        stock=10  # Базовый запас
                    )
                    db.add(inventory)
                    inventory_count += 1
            
            await db.commit()
            print(f"✅ Создано {inventory_count} записей инвентаря")
            
            # Показываем статистику
            for location in pickup_locations:
                print(f"   - {location.title}: {len(active_rewards)} товаров по 10 шт.")
                
        except Exception as e:
            print(f"❌ Ошибка при создании партнерских точек: {e}")
            await db.rollback()
            raise


if __name__ == "__main__":
    print("🚀 Запуск seed скрипта для партнерских точек выдачи...")
    asyncio.run(seed_pickup_locations())
    print("✨ Готово!")