from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean 
from sqlalchemy.sql import func
from .database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    is_active = Column(Boolean, default=True)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    language = Column(String(50))
    rating = Column(Integer, nullable=True)
    emoji = Column(String(10), nullable=True)
    voice_text = Column(Text, nullable=True)
    comment = Column(Text)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())


