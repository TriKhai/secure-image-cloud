import cloudinary
import cloudinary.uploader
from app.config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

def upload_to_cloud(file: bytes) -> dict:
    """
    Upload file lên Cloudinary.
    Trả về dict chứa url và public_id.
    """
    result = cloudinary.uploader.upload(file)
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def delete_from_cloud(public_id: str):
    """
    Xoá ảnh trên Cloudinary theo public_id.
    """
    try:
        res = cloudinary.uploader.destroy(public_id)
        print("Cloudinary destroy:", res)
        return res
    except Exception as e:
        print("LỖI XOÁ CLOUDINARY:", e)
        return None