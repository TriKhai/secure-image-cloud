from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.config import SECRET_KEY, ALGORITHM

# Định nghĩa scheme để FastAPI biết đọc token trong header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Hàm lấy user từ token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực người dùng",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Giải mã JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Tìm user trong DB
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception

    return user
