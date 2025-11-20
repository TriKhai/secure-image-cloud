from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Float
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    
    aes_key = Column(String, nullable=False, default="abcabcbcabcabcaa")  # 16 bytes
    henon_x0 = Column(Float, default=0.0)
    henon_y0 = Column(Float, default=0.0)
    henon_a = Column(Float, default=1.4)
    henon_b = Column(Float, default=0.3)

    images = relationship("Image", back_populates="owner")
    
class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String)
    filename = Column(String)
    cloud_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner = relationship("User", back_populates="images")
