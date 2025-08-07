from sqlalchemy import Column, Integer, String, Date
from database import Base

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    department = Column(String, nullable=False)
    registered_date = Column(Date, nullable=False)
    total_requests = Column(Integer, default=0)
    status = Column(String, default="active")