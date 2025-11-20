from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import UserCreate, UserLogin, Token
from app.models import User
from app.utils.security import hash_password, verify_password, create_access_token, generate_aes_key, generate_henon_params
from app.database import get_db
from app.auth.utils import get_current_user

router = APIRouter()

# @router.post("/register", response_model=dict)
# def register(user: UserCreate, db: Session = Depends(get_db)):
#     if db.query(User).filter_by(username=user.username).first():
#         raise HTTPException(status_code=400, detail="Username already exists")
    
#     # print("username: ", user.username)
#     # print("password: ", user.password)

#     new_user = User(username=user.username, password=hash_password(user.password))
#     # print(hash_password(user.password))
#     db.add(new_user)
#     db.commit()
#     return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter_by(username=user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/register", response_model=dict)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter_by(username=user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Tạo AES key & Henon cho user mới
    aes_key = generate_aes_key()
    henon = generate_henon_params()

    new_user = User(
        username=user.username,
        password=hash_password(user.password),
        aes_key=aes_key,
        **henon       # unpack dict -> henon_x0, henon_y0, henon_a, henon_b
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "aes_key": new_user.aes_key,
        "henon": {
            "x0": new_user.henon_x0,
            "y0": new_user.henon_y0,
            "a": new_user.henon_a,
            "b": new_user.henon_b
        }
    }


# Test token
@router.get("/me")
def get_my_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "message": "Đã đăng nhập hợp lệ"
    }