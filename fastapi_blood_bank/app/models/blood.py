from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Stock(Base):
    __tablename__ = "blood_stocks"

    id = Column(Integer, primary_key=True, index=True)
    bloodgroup = Column(String(3), unique=True)
    unit = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_by_patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    request_by_donor_id = Column(Integer, ForeignKey("donors.id"), nullable=True)
    patient_name = Column(String(100))
    patient_age = Column(Integer)
    reason = Column(Text)
    bloodgroup = Column(String(3))
    unit = Column(Integer)
    status = Column(String(20), default="Pending")
    date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    request_by_patient = relationship("Patient", foreign_keys=[request_by_patient_id], back_populates="blood_requests")
    request_by_donor = relationship("Donor", foreign_keys=[request_by_donor_id], back_populates="blood_requests")