from typing import List
from fastapi import APIRouter, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..schemas.reward import RewardItemResponse, RewardRedeemRequest
from ..schemas.redemption import RedeemRewardResponse
from ..services.reward_service import RewardService
from .auth import get_current_user
from ..models.user import User


router = APIRouter(prefix="/rewards", tags=["Rewards"])


@router.get("", response_model=List[RewardItemResponse])
async def get_rewards(db: AsyncSession = Depends(get_db)):
    """Получение списка доступных товаров"""
    rewards = await RewardService.get_active_rewards(db)
    return rewards


@router.post("/{reward_id}/redeem", response_model=RedeemRewardResponse)
async def redeem_reward(
    reward_id: int = Path(..., description="ID товара"),
    redeem_data: RewardRedeemRequest = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Покупка товара за поинты"""
    # Получаем и проверяем товар
    reward = await RewardService.get_reward_by_id(db, reward_id)
    
    # Покупаем
    transaction, redemption_info = await RewardService.redeem_reward(db, current_user, reward)
    return redemption_info