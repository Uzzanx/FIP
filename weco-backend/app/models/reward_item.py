from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, func

from ..core.database import Base


class RewardItem(Base):
    """Модель товара для покупки за поинты (WEco мерч)"""
    
    __tablename__ = "reward_items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    points_cost = Column(Integer, nullable=False)  # Сколько поинтов стоит
    image_url = Column(String(500), nullable=True)  # URL картинки
    is_active = Column(Boolean, default=True)  # Доступен ли для покупки
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<RewardItem(id={self.id}, title='{self.title}', cost={self.points_cost})>"