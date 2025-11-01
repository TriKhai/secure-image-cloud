from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ImageResponse(BaseModel):
    id: int
    url: str
    filename: str

    class Config:
        orm_mode = True
