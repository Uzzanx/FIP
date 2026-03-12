from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, func

from ..core.database import Base


class PickupLocation(Base):
    """Модель партнерской точки выдачи наград"""
    
    __tablename__ = "pickup_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)  # "Mall Partner Store"
    address = Column(String(200), nullable=False)  # "Main Street 15"
    lat = Column(Float, nullable=False)  # 42.87
    lng = Column(Float, nullable=False)  # 74.59
    photo_url = Column(String(300), nullable=True)  # "/static/pickups/pickup1.jpg"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<PickupLocation(id={self.id}, title='{self.title}', is_active={self.is_active})>"