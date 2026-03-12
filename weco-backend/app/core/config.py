from decouple import config


class Settings:
    """Настройки приложения WEco Backend"""
    
    # База данных
    DATABASE_URL: str = config("DATABASE_URL")
    
    # JWT
    SECRET_KEY: str = config("SECRET_KEY")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)
    
    # API ключ для машин
    MACHINE_API_KEY: str = config("MACHINE_API_KEY")
    
    # API ключ для персонала
    STAFF_API_KEY: str = config("STAFF_API_KEY")
    
    # Таймауты (секунды)
    QR_SCAN_TIMEOUT: int = 60  # После сканирования QR
    VERIFICATION_TIMEOUT: int = 30  # На проверку бутылки
    DROP_SENSOR_TIMEOUT: int = 5  # Ожидание датчика падения


settings = Settings()