from sqlalchemy import Column, Integer, String, Date
from database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    department = Column(String(50), nullable=False)
    total_requests = Column(Integer, default=0)
    status = Column(String(20), default="active")
    registered_date = Column(Date, nullable=False)