from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..core.security import verify_token
from ..schemas.auth import LoginRequest, Token
from ..schemas.user import UserCreate, UserResponse
from ..services.auth_service import AuthService
from ..services.user_service import UserService
from ..models.user import User


router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Регистрация нового пользователя"""
    user = await UserService.create_user(db, user_data)
    return user


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Вход пользователя"""
    user = await AuthService.authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль"
        )
    
    access_token = await AuthService.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}


# Dependency для получения текущего пользователя
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Получение текущего пользователя из JWT токена"""
    username = verify_token(credentials.credentials)
    
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный токен"
        )
    
    user = await AuthService.get_user_by_username(db, username)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден"
        )
    
    return user