# WEco - Умные боксы для переработки пластиковых бутылок

Экосистема умных боксов для переработки пластиковых бутылок с системой мотивации через бонусные поинты.

## Компоненты системы

- **Backend**: FastAPI + PostgreSQL + JWT авторизация
- **Frontend**: React + TypeScript + Vite + CSS Modules  
- **Database**: PostgreSQL в Docker контейнере

## Структура проекта

```
WEco/
├── weco-backend/     # Backend API на FastAPI
├── weco-frontend/    # Frontend на React + TypeScript
└── docker-compose.yml # PostgreSQL в Docker
```

## Быстрый старт

## Локальный запуск через Docker

1. `docker compose down -v`
2. `docker compose up --build`
3. Открыть `http://localhost:8000/health`
4. Открыть `http://localhost:8000/docs`
5. Открыть `http://localhost:5173`

После первого запуска для тестовых данных:

```bash
docker compose exec backend python add_test_data.py
docker compose exec backend python scripts/seed_pickup_locations.py
```

## Локальный запуск без Docker

Если нужен ручной запуск для отладки, можно поднимать сервисы отдельно, но для обычной локальной работы рекомендуется Docker Compose.

## API Documentation

После запуска backend:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend

После запуска frontend: http://localhost:5173

## Архитектура

### Backend
- **Core**: конфигурация, база данных, безопасность
- **Models**: SQLAlchemy модели
- **Schemas**: Pydantic схемы для API
- **Routes**: FastAPI роуты  
- **Services**: бизнес-логика

### Frontend
- **Components**: переиспользуемые компоненты
- **Pages**: страницы приложения
- **Services**: API клиент, аутентификация
- **Navigation**: кастомная навигация без react-router
- **Types**: TypeScript типы