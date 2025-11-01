from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.image.cloud import upload_to_cloud
from app.models import Image
import shutil, tempfile, os, requests
from app.auth.utils import get_current_user
from app.models import User
from app.image.encryptor import encrypt_image, decrypt_image
from app.config import AES_KEY, HENON_PARAMS
import io
import base64

router = APIRouter()

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Đọc nội dung ảnh gốc vào RAM
        image_bytes = await file.read()

        # Mã hoá trực tiếp trong RAM, trả về base64
        encrypted_base64 = encrypt_image(image_bytes, AES_KEY, HENON_PARAMS)

        # Chuyển base64 => bytes để upload
        encrypted_bytes = base64.b64decode(encrypted_base64)

        # Upload ảnh mã hoá lên cloud
        url = upload_to_cloud(encrypted_bytes)

        # Lưu metadata vào DB
        new_img = Image(
            filename=file.filename,
            url=url,
            user_id=current_user.id
        )
        db.add(new_img)
        db.commit()
        db.refresh(new_img)

        return {
            "message": "Upload và mã hoá thành công!",
            "url": url,
            "filename": new_img.filename,
            "user_id": new_img.user_id
        }

    except Exception as e:
        import traceback
        print("LỖI KHI UPLOAD:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# list image chua giair max
@router.get("/list")
def list_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    images = db.query(Image).filter(Image.user_id == current_user.id).all()
    return [
        {"id": img.id, "filename": img.filename, "url": img.url}
        for img in images
    ]


@router.get("/get-all")
def get_all_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_list = db.query(Image).filter(Image.user_id == current_user.id).all()

    results = []
    for img in image_list:
        response = requests.get(img.url)
        if response.status_code != 200:
            continue

        # --- Không lưu file, dùng BytesIO ---
        img_bytes = io.BytesIO(response.content)
        base64_img = decrypt_image(img_bytes, AES_KEY, HENON_PARAMS)

        results.append({
            "id": img.id,
            "filename": img.filename,
            "image_base64": f"data:image/png;base64,{base64_img}"
        })

    return results