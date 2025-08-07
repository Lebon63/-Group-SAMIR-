from sqlalchemy import Column, String, Date, Float, Enum
from database import Base
from datetime import datetime

class Inventory(Base):
    __tablename__ = "inventory"

    blood_unit_id = Column(String(50), primary_key=True, index=True)
    donor_id = Column(String(50))
    donor_age = Column(Float)
    donor_gender = Column(String(1))
    blood_type = Column(String(3), nullable=False)
    collection_site = Column(String(100))
    donation_date = Column(Date)
    expiry_date = Column(Date)
    collection_volume_ml = Column(Float)
    hemoglobin_g_dl = Column(Float)
    status = Column(String(20), default="available")