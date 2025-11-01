from fastapi import FastAPI
from app.database import Base, engine
from app.auth import routes as auth_routes
from app.image import routes as image_routes
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Image Encryptor Backend")

# CORS
origins = [
    "http://localhost:5173",   
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(image_routes.router, prefix="/image", tags=["Image"])

@app.get("/")
def root():
    return {"message": "Backend is running"}