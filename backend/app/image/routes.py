from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.image.cloud import upload_to_cloud, delete_from_cloud
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
        # 1. Đọc bytes -> ảnh gốc
        image_bytes = await file.read()

        aes_key_bytes = bytes.fromhex(current_user.aes_key)

        henon_params = {
            "x0": current_user.henon_x0,
            "y0": current_user.henon_y0,
            "a": current_user.henon_a,
            "b": current_user.henon_b,
        }


        # 2. Mã hoá -> base64
        # encrypted_base64 = encrypt_image(image_bytes, AES_KEY, HENON_PARAMS)
        encrypted_base64 = encrypt_image(image_bytes, aes_key_bytes, henon_params)

        # 3. base64 -> bytes để upload
        encrypted_bytes = base64.b64decode(encrypted_base64)

        # 4. Upload lên Cloudinary
        cloud_res = upload_to_cloud(encrypted_bytes)
        url = cloud_res["url"]
        cloud_id = cloud_res["public_id"]

        # 5. Lưu DB
        new_img = Image(
            filename=file.filename,
            url=url,
            cloud_id=cloud_id,
            user_id=current_user.id,
        )
        db.add(new_img)
        db.commit()
        db.refresh(new_img)

        return {
            "message": "Upload và mã hoá thành công!",
            "id": new_img.id,
            "url": new_img.url,
            "filename": new_img.filename,
            "user_id": new_img.user_id,
            "cloud_id": new_img.cloud_id,
        }

    except Exception as e:
        import traceback
        print("LỖI KHI UPLOAD:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
def list_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    images = db.query(Image).filter(Image.user_id == current_user.id).all()
    return [
        {
            "id": img.id,
            "filename": img.filename,
            "url": img.url,
            "cloud_id": img.cloud_id,
            "created_at": img.created_at,
        }
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

        img_bytes = io.BytesIO(response.content)

        aes_key_bytes = bytes.fromhex(current_user.aes_key)

        henon_params = {
            "x0": current_user.henon_x0,
            "y0": current_user.henon_y0,
            "a": current_user.henon_a,
            "b": current_user.henon_b,
        }

        # base64_img = decrypt_image(img_bytes, AES_KEY, HENON_PARAMS)
        base64_img = decrypt_image(img_bytes, aes_key_bytes, henon_params)

        results.append({
            "id": img.id,
            "filename": img.filename,
            "image_base64": f"data:image/png;base64,{base64_img}",
        })

    return results


@router.delete("/delete/{image_id}")
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    img = (
        db.query(Image)
        .filter(Image.id == image_id, Image.user_id == current_user.id)
        .first()
    )

    if not img:
        raise HTTPException(status_code=404, detail="Image not found")

    # Xoá Cloudinary
    if img.cloud_id:
        try:
            delete_from_cloud(img.cloud_id)
        except Exception as e:
            print("LỖI XOÁ CLOUDINARY:", e)

    # Xoá DB
    db.delete(img)
    db.commit()

    return {"message": "Đã xoá ảnh", "deleted_id": image_id}


@router.delete("/delete-all")
def delete_all_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    images = db.query(Image).filter(Image.user_id == current_user.id).all()

    if not images:
        return {"message": "Không có ảnh nào để xoá", "deleted_count": 0}

    for img in images:
        if img.cloud_id:
            try:
                delete_from_cloud(img.cloud_id)
            except Exception as e:
                print("LỖI XOÁ CLOUDINARY:", e)

        db.delete(img)

    db.commit()

    return {
        "message": "Đã xoá tất cả ảnh của user hiện tại (DB + Cloudinary)",
        "deleted_count": len(images),
    }