from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship

from ..core.database import Base


class VerificationSession(Base):
    """Модель сессии проверки бутылки"""
    
    __tablename__ = "verification_sessions"
    
    id = Column(String(36), primary_key=True)  # UUID4
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    machine_id = Column(String(50), nullable=False)  # Идентификатор бокса
    
    # Статус: 'pending', 'in_progress', 'completed', 'failed', 'expired'
    status = Column(String(20), default='pending', nullable=False)
    
    # Результаты проверки
    is_bottle = Column(Boolean, nullable=True)  # Результат CV-модели
    
    # Временные метки
    expires_at = Column(DateTime(timezone=True), nullable=False)  # Когда истекает
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связь с пользователем
    user = relationship("User", back_populates="verification_sessions")
    
    def __repr__(self):
        return f"<VerificationSession(id='{self.id}', user_id={self.user_id}, status='{self.status}')>"