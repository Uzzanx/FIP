import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from ..models.user import User
from ..models.verification_session import VerificationSession
from ..models.transaction import Transaction
from ..core.config import settings


class VerificationService:
    """Сервис для работы с проверками бутылок"""
    
    @staticmethod
    async def create_session(db: AsyncSession, user: User, machine_id: str) -> VerificationSession:
        """Создание новой сессии проверки"""
        # Проверяем, нет ли активных сессий для этого пользователя
        existing = await db.execute(
            select(VerificationSession)
            .where(
                VerificationSession.user_id == user.id,
                VerificationSession.status.in_(["pending", "in_progress"]),
                VerificationSession.expires_at > datetime.now(timezone.utc)
            )
        )
        
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="У вас уже есть активная сессия проверки"
            )
        
        # Создаём новую сессию
        session = VerificationSession(
            id=str(uuid.uuid4()),
            user_id=user.id,
            machine_id=machine_id,
            status="pending",
            expires_at=datetime.now(timezone.utc) + timedelta(seconds=settings.QR_SCAN_TIMEOUT)
        )
        
        db.add(session)
        await db.commit()
        await db.refresh(session)
        
        return session
    
    @staticmethod
    async def get_session(db: AsyncSession, session_id: str) -> VerificationSession:
        """Получение сессии по ID"""
        result = await db.execute(
            select(VerificationSession).where(VerificationSession.id == session_id)
        )
        session = result.scalar_one_or_none()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Сессия проверки не найдена"
            )
        
        return session
    
    @staticmethod
    async def get_user_active_session(db: AsyncSession, user: User) -> Optional[VerificationSession]:
        """Получение активной сессии пользователя"""
        # Сначала закрываем все истекшие сессии
        expired_sessions_result = await db.execute(
            select(VerificationSession)
            .where(
                VerificationSession.user_id == user.id,
                VerificationSession.status.in_(["pending", "in_progress"]),
                VerificationSession.expires_at <= datetime.now(timezone.utc)
            )
        )
        expired_sessions = expired_sessions_result.scalars().all()
        for session in expired_sessions:
            session.status = "expired"
        
        if expired_sessions:
            await db.commit()
        
        # Теперь ищем активные
        result = await db.execute(
            select(VerificationSession)
            .where(
                VerificationSession.user_id == user.id,
                VerificationSession.status.in_(["pending", "in_progress"]),
                VerificationSession.expires_at > datetime.now(timezone.utc)
            )
            .order_by(VerificationSession.created_at.desc())
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def start_session(db: AsyncSession, session: VerificationSession) -> VerificationSession:
        """Начало проверки"""
        if session.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Нельзя начать проверку. Текущий статус: {session.status}"
            )
        
        if session.expires_at <= datetime.now(timezone.utc):
            session.status = "expired"
            await db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Сессия проверки истекла"
            )
        
        # Обновляем статус и время истечения
        session.status = "in_progress"
        session.expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.VERIFICATION_TIMEOUT)
        
        await db.commit()
        await db.refresh(session)
        
        return session
    
    @staticmethod
    async def complete_session(
        db: AsyncSession, 
        session: VerificationSession, 
        is_bottle: bool, 
        custom_event_id: Optional[str] = None
    ) -> tuple[Optional[Transaction], bool]:  # Возвращаем (transaction, is_duplicate)
        """Завершение сессии с результатом"""
        # Обновляем сессию
        session.is_bottle = is_bottle
        session.status = "completed"
        
        transaction = None
        is_duplicate = False
        
        # Начисляем поинт ТОЛЬКО если is_bottle == True
        if is_bottle:
            # Определяем event_id: либо custom_event_id, либо session_id
            event_id = custom_event_id or session.id
            
            # Проверяем, нет ли уже транзакции с таким event_id
            existing_result = await db.execute(
                select(Transaction).where(Transaction.event_id == event_id)
            )
            existing_transaction = existing_result.scalar_one_or_none()
            
            if existing_transaction:
                # Уже есть транзакция с таким event_id - это дубль
                is_duplicate = True
                transaction = existing_transaction
            else:
                # Создаём новую транзакцию
                transaction = Transaction(
                    user_id=session.user_id,
                    delta_points=1,
                    type="bottle_recycled",
                    event_id=event_id,
                    machine_id=session.machine_id,  # Добавляем machine_id для статистики
                    description=f"Переработка бутылки (бокс {session.machine_id})"
                )
                db.add(transaction)
        else:
            session.status = "failed"  # Не бутылка
        
        await db.commit()
        
        if transaction and not is_duplicate:
            await db.refresh(transaction)
        
        return transaction, is_duplicate
    
    @staticmethod
    async def get_machine_active_sessions(db: AsyncSession, machine_id: str) -> list:
        """Получение активных сессий для машины"""
        result = await db.execute(
            select(VerificationSession)
            .where(
                VerificationSession.machine_id == machine_id,
                VerificationSession.status.in_(["pending", "in_progress"]),
                VerificationSession.expires_at > datetime.now(timezone.utc)
            )
            .order_by(VerificationSession.created_at.asc())
        )
        return result.scalars().all()