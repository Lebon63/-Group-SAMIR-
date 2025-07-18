from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    feedbacks = relationship("Feedback", back_populates="patient")

class FeedbackCategory(Base):
    __tablename__ = "feedback_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

class Feedback(Base):
    __tablename__ = "patient_feedback"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, nullable=True)
    category_id = Column(Integer, ForeignKey("feedback_categories.id"), nullable=True)
    rating = Column(Integer, nullable=True)
    comment = Column(Text, nullable=True)
    voice_transcript = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
      # Relationships
    patient = relationship("Patient", back_populates="feedbacks")
    category = relationship("FeedbackCategory")  
    #doctor
class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # Consider hashing in production
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

  