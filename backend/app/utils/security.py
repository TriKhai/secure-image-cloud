from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import SECRET_KEY, ALGORITHM
import random
import string
import secrets

# Dùng PBKDF2 thay vì bcrypt (không bị bug, không giới hạn độ dài)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# def generate_random_string(length=16):
#     characters = string.ascii_letters + string.digits  # a-zA-Z0-9
#     return ''.join(random.choice(characters) for _ in range(length))

def generate_aes_key():
    return secrets.token_hex(16)

def generate_henon_params():
    return {
        "henon_x0": random.uniform(0, 1),
        "henon_y0": random.uniform(0, 1),
        "henon_a": 1.4,
        "henon_b": 0.3
    }