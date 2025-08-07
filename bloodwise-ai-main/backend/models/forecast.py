from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime

class ForecastData(Base):
    __tablename__ = "forecast_data"

    id = Column(Integer, primary_key=True, index=True)
    blood_type = Column(String(3), nullable=False)
    period = Column(String(10), nullable=False)
    predicted_demand = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)