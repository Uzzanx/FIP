from typing import Optional
from fastapi import APIRouter, Depends, Path, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..schemas.verification import VerificationSessionResponse, VerificationStartRequest
from ..services.verification_service import VerificationService
from .auth import get_current_user
from ..models.user import User


router = APIRouter(prefix="/verify", tags=["Verification"])


@router.get("/my/active", response_model=Optional[VerificationSessionResponse])
async def get_my_active_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение активной сессии проверки пользователя"""
    session = await VerificationService.get_user_active_session(db, current_user)
    return session


@router.post("/{session_id}/start", response_model=VerificationSessionResponse)
async def start_verification(
    session_id: str = Path(..., description="ID сессии"),
    start_data: VerificationStartRequest = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Начало проверки бутылки"""
    # Получаем сессию
    session = await VerificationService.get_session(db, session_id)
    
    # Проверяем, что это сессия текущего пользователя
    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этой сессии"
        )
    
    # Начинаем проверку
    session = await VerificationService.start_session(db, session)
    return session