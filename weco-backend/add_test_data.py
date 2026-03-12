import asyncio
from sqlalchemy import text
from app.core.database import AsyncSessionLocal
from app.models.reward_item import RewardItem
from app.models.machine import Machine

async def add_test_rewards():
    """Добавляем тестовые товары для покупки"""
    async with AsyncSessionLocal() as db:
        # Проверяем, есть ли уже награды
        result = await db.execute(text("SELECT COUNT(*) FROM reward_items"))
        count = result.scalar()
        
        if count > 0:
            print("Тестовые товары уже существуют")
            return
            
        rewards = [
            RewardItem(
                title="Футболка WEco",
                description="Стильная футболка из органического хлопка с логотипом WEco",
                points_cost=50,
                image_url="https://via.placeholder.com/300x300?text=WEco+T-Shirt",
                is_active=True
            ),
            RewardItem(
                title="Эко-сумка",
                description="Многоразовая сумка из переработанных материалов",
                points_cost=30,
                image_url="https://via.placeholder.com/300x300?text=Eco+Bag",
                is_active=True
            ),
            RewardItem(
                title="Бутылка для воды",
                description="Спортивная бутылка из нержавеющей стали 500мл",
                points_cost=40,
                image_url="https://via.placeholder.com/300x300?text=Water+Bottle",
                is_active=True
            ),
            RewardItem(
                title="Стикеры WEco",
                description="Набор стикеров с экологическими слоганами",
                points_cost=15,
                image_url="https://via.placeholder.com/300x300?text=Stickers",
                is_active=True
            ),
            RewardItem(
                title="Кепка WEco",
                description="Бейсболка с вышивкой логотипа WEco",
                points_cost=35,
                image_url="https://via.placeholder.com/300x300?text=WEco+Cap",
                is_active=True
            )
        ]
        
        for reward in rewards:
            db.add(reward)
        
        await db.commit()
        print(f"Добавлено {len(rewards)} тестовых товаров")


async def add_test_machines():
    """Добавляем тестовые eco-боксы"""
    async with AsyncSessionLocal() as db:
        # Проверяем, есть ли уже машины
        result = await db.execute(text("SELECT COUNT(*) FROM machines"))
        count = result.scalar()
        
        if count > 0:
            print("Тестовые машины уже существуют")
            return
            
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
        print(f"Добавлено {len(machines)} тестовых боксов")

async def main():
    """Main функция для добавления всех тестовых данных"""
    await add_test_rewards()
    await add_test_machines()

if __name__ == "__main__":
    asyncio.run(main())