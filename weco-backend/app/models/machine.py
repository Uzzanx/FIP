from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, func

from ..core.database import Base


class Machine(Base):
    """Модель eco-бокса для приема бутылок"""
    
    __tablename__ = "machines"
    
    id = Column(String(50), primary_key=True)  # BOX-001, BOX-002, etc.
    title = Column(String(100), nullable=False)  # "Mall Eco Box"
    address = Column(String(200), nullable=False)  # "Main Street 12"
    lat = Column(Float, nullable=False)  # 42.87
    lng = Column(Float, nullable=False)  # 74.59
    photo_url = Column(String(300), nullable=False)  # "/static/boxes/box1.jpg"
    description = Column(Text, nullable=True)  # "Located near the entrance"
    is_active = Column(Boolean, default=True, nullable=False)  # активный ли бокс
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Machine(id='{self.id}', title='{self.title}', is_active={self.is_active})>"