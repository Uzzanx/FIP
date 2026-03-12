from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Схема запроса на вход"""
    username: str
    password: str


class Token(BaseModel):
    """Схема ответа с JWT токеном"""
    access_token: str
    token_type: str