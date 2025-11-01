import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data.db")
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = "HS256"

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

AES_KEY = os.getenv("AES_KEY").encode()
HENON_PARAMS = {
    "x0": float(os.getenv("HENON_X0")),
    "y0": float(os.getenv("HENON_Y0")),
    "a": float(os.getenv("HENON_A")),
    "b": float(os.getenv("HENON_B")),
}
