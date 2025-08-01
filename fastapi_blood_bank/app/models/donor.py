from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    bloodgroup = Column(String(3))
    address = Column(Text)
    mobile = Column(String(20))
    profile_pic = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    blood_donations = relationship("BloodDonate", back_populates="donor")
    blood_requests = relationship("BloodRequest", foreign_keys="[BloodRequest.request_by_donor_id]", back_populates="request_by_donor")

class BloodDonate(Base):
    __tablename__ = "blood_donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id"))
    disease = Column(String(100), nullable=True)
    age = Column(Integer)
    bloodgroup = Column(String(3))
    unit = Column(Integer)
    status = Column(String(20), default="Pending")
    date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    donor = relationship("Donor", back_populates="blood_donations")