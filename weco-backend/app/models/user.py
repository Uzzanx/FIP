from sqlalchemy import Column, Integer, String, DateTime, Text, func
from sqlalchemy.orm import relationship

from ..core.database import Base


class User(Base):
    """Модель пользователя WEco"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    qr_token = Column(String(36), unique=True, index=True, nullable=False)  # UUID4 строка
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Связи с другими таблицами
    transactions = relationship("Transaction", back_populates="user")
    verification_sessions = relationship("VerificationSession", back_populates="user")
    redemptions = relationship("Redemption", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"