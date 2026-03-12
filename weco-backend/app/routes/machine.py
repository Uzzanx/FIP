from typing import List
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.security import verify_machine_api_key
from ..core.config import settings
from ..schemas.verification import (
    MachineScanRequest,
    VerificationSessionResponse,
    VerificationResultRequest,
)
from ..services.verification_service import VerificationService
from ..services.auth_service import AuthService
from ..services.machine_service import MachineService


router = APIRouter(prefix="/machine", tags=["Machine API"])


# Dependency для проверки API ключа машины
def verify_machine_access(x_api_key: str = Header(..., alias="X-API-Key")):
    """Проверка API ключа машины"""
    if not verify_machine_api_key(x_api_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный API ключ машины"
        )
    return True


@router.post("/scan", response_model=VerificationSessionResponse)
async def machine_scan_qr(
    scan_data: MachineScanRequest,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_machine_access)
):
    """Обработка сканирования QR-кода машиной"""
    # Проверяем, что machine_id существует и активен
    machine_exists = await MachineService.machine_exists_and_active(db, scan_data.machine_id)
    if not machine_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Бокс {scan_data.machine_id} не найден или неактивен"
        )
    
    # Находим пользователя по QR токену
    user = await AuthService.get_user_by_qr_token(db, scan_data.qr_token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QR-код не найден"
        )
    
    # Создаём новую сессию проверки
    session = await VerificationService.create_session(db, user, scan_data.machine_id)
    return session


@router.post("/sessions/result")
async def submit_verification_result(
    result_data: VerificationResultRequest,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_machine_access)
):
    """Отправка результата проверки от машины"""
    # Получаем сессию
    session = await VerificationService.get_session(db, result_data.session_id)
    
    # Завершаем сессию с проверкой event_id
    transaction, is_duplicate = await VerificationService.complete_session(
        db, session, result_data.is_bottle, result_data.event_id
    )
    
    # Определяем количество начисленных поинтов
    if is_duplicate:
        points_awarded = 0  # Дубль - не начисляем
    elif result_data.is_bottle:
        points_awarded = 1  # Новая успешная операция
    else:
        points_awarded = 0  # Неуспешная операция
    
    return {
        "success": True,
        "points_awarded": points_awarded,
        "session_status": session.status,
        "duplicate": is_duplicate
    }