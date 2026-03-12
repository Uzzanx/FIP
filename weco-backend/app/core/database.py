from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from .config import settings


# Создание асинхронного движка базы данных
engine = create_async_engine(settings.DATABASE_URL, echo=False)

# Фабрика сессий
AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession,
    expire_on_commit=False
)

# Базовый класс для моделей
Base = declarative_base()


async def get_db() -> AsyncSession:
    """Dependency для получения сессии базы данных"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()