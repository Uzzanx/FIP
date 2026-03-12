#!/usr/bin/env python3
"""
Seed script для создания тестовых машин (eco-боксов)
Использование: python scripts/seed_machines.py
"""
import asyncio
import sys
import os
from pathlib import Path

# Добавляем корневую директорию в PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.core.database import AsyncSessionLocal
from app.models.machine import Machine


async def seed_machines():
    """Добавляет тестовые машины если их нет"""
    async with AsyncSessionLocal() as db:
        try:
            # Проверяем количество машин
            result = await db.execute(text("SELECT COUNT(*) FROM machines"))
            count = result.scalar()
            
            if count > 0:
                print(f"✓ В базе уже есть {count} машин. Пропускаем seed.")
                return
                
            print("🔄 Создаём тестовые машины...")
            
            machines = [
                Machine(
                    id="BOX-001",
                    title="Mall Eco Box",
                    address="Main Street 12, Shopping Mall",
                    lat=42.8746,
                    lng=74.5698,
                    photo_url="/static/boxes/box1.jpg",
                    description="Расположен рядом с главным входом в торговый центр",
                    is_active=True
                ),
                Machine(
                    id="BOX-002",
                    title="Park Eco Station", 
                    address="Green Park Avenue 5",
                    lat=42.8812,
                    lng=74.5734,
                    photo_url="/static/boxes/box2.jpg",
                    description="Установлен в центре парка рядом с фонтаном",
                    is_active=True
                ),
                Machine(
                    id="BOX-003",
                    title="University Eco Point",
                    address="University Campus, Building A", 
                    lat=42.8673,
                    lng=74.5821,
                    photo_url="/static/boxes/box3.jpg",
                    description="Находится в главном корпусе университета",
                    is_active=True
                )
            ]
            
            for machine in machines:
                db.add(machine)
            
            await db.commit()
            print(f"✅ Успешно добавлено {len(machines)} машин")
            
            # Показываем что создали
            for machine in machines:
                print(f"   - {machine.id}: {machine.title} ({machine.address})")
                
        except Exception as e:
            print(f"❌ Ошибка при создании машин: {e}")
            await db.rollback()
            raise


if __name__ == "__main__":
    print("🚀 Запуск seed скрипта для машин...")
    asyncio.run(seed_machines())
    print("✨ Готово!")