from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint

from ..core.database import Base


class PickupInventory(Base):
    """Модель остатков товаров в партнерских точках выдачи"""
    
    __tablename__ = "pickup_inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    pickup_location_id = Column(Integer, ForeignKey("pickup_locations.id"), nullable=False)
    reward_id = Column(Integer, ForeignKey("reward_items.id"), nullable=False)
    stock = Column(Integer, default=0, nullable=False)  # Остаток товара
    
    # Уникальное ограничение: одна запись на пару (точка, товар)
    __table_args__ = (
        UniqueConstraint('pickup_location_id', 'reward_id', name='uix_pickup_reward'),
    )
    
    def __repr__(self):
        return f"<PickupInventory(pickup_location_id={self.pickup_location_id}, reward_id={self.reward_id}, stock={self.stock})>"