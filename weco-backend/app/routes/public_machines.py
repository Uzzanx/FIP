from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..schemas.machine import MachineResponse, MachineDetailResponse
from ..services.machine_service import MachineService

# Публичный роутер (без авторизации) для карты боксов
router = APIRouter(tags=["Public Machines"])


@router.get("/machines", response_model=List[MachineResponse])
async def get_all_machines(db: AsyncSession = Depends(get_db)):
    """Получить список всех активных eco-боксов для карты (публично)"""
    machines = await MachineService.get_all_active_machines(db)
    return machines


@router.get("/machines/{machine_id}", response_model=MachineDetailResponse)
async def get_machine_detail(machine_id: str, db: AsyncSession = Depends(get_db)):
    """Получить подробную информацию о боксе (публично)"""
    machine = await MachineService.get_machine_detail(db, machine_id)
    
    if not machine:
        raise HTTPException(status_code=404, detail="Бокс не найден")
    
    return machine