from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship

from ..core.database import Base


class Transaction(Base):
    """Модель транзакции (начисление/списание поинтов)"""
    
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    delta_points = Column(Integer, nullable=False)  # +1 за бутылку, -Н за мерч
    type = Column(String(20), nullable=False)  # 'bottle_recycled', 'reward_redeemed'
    event_id = Column(String(36), unique=True, index=True, nullable=True)  # Для idempotency
    machine_id = Column(String(50), nullable=True)  # ID бокса для статистики
    description = Column(Text, nullable=True)  # Описание (название мерча и т.п.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Связь с пользователем
    user = relationship("User", back_populates="transactions")
    
    def __repr__(self):
        return f"<Transaction(id={self.id}, user_id={self.user_id}, delta={self.delta_points}, type='{self.type}')>"