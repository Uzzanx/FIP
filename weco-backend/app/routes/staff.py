from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.config import settings
from ..schemas.redemption import StaffClaimRequest, StaffClaimResponse, StaffPreviewRequest, StaffPreviewResponse
from ..services.redemption_service import RedemptionService
from ..services.pickup_location_service import PickupLocationService


router = APIRouter(prefix="/staff", tags=["Staff API"])


# Dependency для проверки staff API ключа
def require_staff_key(x_staff_key: str = Header(..., alias="X-STAFF-KEY")):
    """Проверка API ключа персонала"""
    if x_staff_key != settings.STAFF_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Неверный API ключ персонала"
        )
    return True


@router.post("/redemptions/preview", response_model=StaffPreviewResponse)
async def preview_redemption(
    preview_data: StaffPreviewRequest,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(require_staff_key)
):
    """Предпросмотр кода награды персоналом"""
    # Проверяем существование и активность pickup_location_id
    pickup_location_exists = await PickupLocationService.pickup_location_exists_and_active(
        db, preview_data.pickup_location_id
    )
    if not pickup_location_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Точка выдачи не найдена"
        )
    
    result_data, error_code = await RedemptionService.preview_redemption(
        db, preview_data.code, preview_data.pickup_location_id
    )
    
    if error_code == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Код не найден"
        )
    elif error_code == "already_claimed":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Код уже использован"
        )
    elif error_code == "expired":
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Срок действия кода истек"
        )
    
    return result_data


@router.post("/redemptions/claim", response_model=StaffClaimResponse)
async def claim_redemption(
    claim_data: StaffClaimRequest,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(require_staff_key)
):
    """Погашение кода награды персоналом"""
    # Проверяем существование и активность pickup_location_id
    pickup_location_exists = await PickupLocationService.pickup_location_exists_and_active(
        db, claim_data.pickup_location_id
    )
    if not pickup_location_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Точка выдачи не найдена"
        )
    
    result_data, error_code = await RedemptionService.claim_redemption_with_inventory(
        db, claim_data.code, claim_data.pickup_location_id
    )
    
    if error_code == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Код не найден"
        )
    elif error_code == "already_claimed":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Код уже использован"
        )
    elif error_code == "expired":
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Срок действия кода истек"
        )
    elif error_code == "out_of_stock":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Товар закончился в данной точке выдачи"
        )
    
    return result_data