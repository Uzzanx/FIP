from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..schemas.pickup_location import PickupLocationResponse, PickupLocationDetailResponse
from ..services.pickup_location_service import PickupLocationService

# Публичный роутер (без авторизации) для карты партнерских точек
router = APIRouter(tags=["Public Pickup Locations"])


@router.get("/pickup-locations", response_model=List[PickupLocationResponse])
async def get_all_pickup_locations(db: AsyncSession = Depends(get_db)):
    """Получить список всех активных партнерских точек выдачи для карты (публично)"""
    pickup_locations = await PickupLocationService.get_all_active_pickup_locations(db)
    return pickup_locations


@router.get("/pickup-locations/{pickup_location_id}", response_model=PickupLocationDetailResponse)
async def get_pickup_location_detail(pickup_location_id: int, db: AsyncSession = Depends(get_db)):
    """Получить подробную информацию о партнерской точке выдачи (публично)"""
    pickup_location = await PickupLocationService.get_pickup_location_by_id(db, pickup_location_id)
    
    if not pickup_location:
        raise HTTPException(status_code=404, detail="Партнерская точка выдачи не найдена")
    
    return pickup_location