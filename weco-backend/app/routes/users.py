from typing import List
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..schemas.user import UserProfile
from ..schemas.transaction import TransactionResponse
from ..schemas.redemption import RedemptionResponse
from ..services.user_service import UserService
from ..services.redemption_service import RedemptionService
from ..services.qr_generator import QRGeneratorService
from .auth import get_current_user
from ..models.user import User


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfile)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение профиля текущего пользователя с балансом"""
    profile = await UserService.get_user_with_balance(db, current_user)
    return profile


@router.get("/me/qr.png")
async def get_my_qr_code(current_user: User = Depends(get_current_user)):
    """Получение QR-кода пользователя в формате PNG"""
    qr_bytes = QRGeneratorService.generate_user_qr(current_user.qr_token)
    
    return Response(
        content=qr_bytes,
        media_type="image/png",
        headers={"Content-Disposition": "inline; filename=qr_code.png"}
    )


@router.get("/me/redemptions", response_model=List[RedemptionResponse])
async def get_my_redemptions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение полученных наград (только PENDING)"""
    redemptions = await RedemptionService.get_user_pending_redemptions(db, current_user)
    return redemptions


@router.get("/me/transactions", response_model=List[TransactionResponse])
async def get_my_transactions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получение списка транзакций текущего пользователя"""
    transactions = await UserService.get_user_transactions(db, current_user)
    return transactions