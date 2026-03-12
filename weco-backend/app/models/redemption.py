from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..core.database import Base


class Redemption(Base):
    """Модель погашения наград (выдача мерча)"""
    
    __tablename__ = "redemptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reward_id = Column(Integer, ForeignKey("reward_items.id"), nullable=False)
    code = Column(String(10), unique=True, nullable=False, index=True)  # Уникальный код
    status = Column(String(20), default='PENDING', nullable=False)  # PENDING или CLAIMED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)  # created_at + 30 дней
    claimed_at = Column(DateTime(timezone=True), nullable=True)
    claimed_by = Column(String(50), nullable=True)  # Кто погасил (например, "staff")
    
    # Связи
    user = relationship("User", back_populates="redemptions")
    reward = relationship("RewardItem")
    
    def __repr__(self):
        return f"<Redemption(id={self.id}, code='{self.code}', status='{self.status}')>"