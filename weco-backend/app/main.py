from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routes import auth, users, rewards, verify, machine, public_machines, public_pickup_locations, staff

# Создание приложения FastAPI
app = FastAPI(
    title="WEco Backend API",
    description="API для системы умных боксов переработки пластиковых бутылок",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware для frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex="https://.*vercel.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутов
app.include_router(public_machines.router)  # Публичные эндпоинты без авторизации
app.include_router(public_pickup_locations.router)  # Публичные pickup locations
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(rewards.router)
app.include_router(verify.router)
app.include_router(machine.router)
app.include_router(staff.router)

# Отдача статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    """Корневой эндпоинт для проверки работы API"""
    return {
        "message": "WEco Backend API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {"status": "healthy"}