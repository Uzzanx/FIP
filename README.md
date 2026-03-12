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

1. Запустить базу данных:
```bash
docker-compose up -d postgres
```

2. Настроить backend:
```bash
cd weco-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

3. Настроить frontend:
```bash
cd weco-frontend
npm install
npm run dev
```

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