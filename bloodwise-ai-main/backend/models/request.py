from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base
from datetime import datetime

class BloodRetrievalRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    patient_name = Column(String(100), nullable=False)
    patient_age = Column(Integer, nullable=False)
    blood_group = Column(String(3), nullable=False)
    requested_date = Column(DateTime, default=datetime.now)
    received_blood_group = Column(String(3))
    status = Column(String(20), nullable=False)
    urgency = Column(String(20))

class DonorValidationRequest(Base):
    __tablename__ = "donor_requests"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    donor_name = Column(String(100), nullable=False)
    donor_age = Column(Integer, nullable=False)
    contact = Column(String(100), nullable=False)
    blood_group = Column(String(3), nullable=False)
    quantity = Column(Integer)
    requested_date = Column(DateTime, default=datetime.now)
    status = Column(String(20), nullable=False)