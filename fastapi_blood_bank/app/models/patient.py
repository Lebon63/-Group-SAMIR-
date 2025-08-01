from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    bloodgroup = Column(String(3))
    address = Column(Text)
    mobile = Column(String(20))
    profile_pic = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    blood_requests = relationship("BloodRequest", foreign_keys="[BloodRequest.request_by_patient_id]", back_populates="request_by_patient")