from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.forecast import ForecastData
from pydantic import BaseModel
import pandas as pd
import os

router = APIRouter()

class ForecastRequest(BaseModel):
    blood_type: str
    period: str

@router.post("/predict")
def predict_demand(request: ForecastRequest, db: Session = Depends(get_db)):
    # Load cleaned data from the correct directory
    cleaned_data = pd.read_csv("data/cleaned/cleaned_blood_bank_records.csv")
    filtered_data = cleaned_data[cleaned_data['blood_type'] == request.blood_type]
    
    # Simple mock forecast based on historical average (to be replaced with ML model)
    if not filtered_data.empty:
        avg_demand = filtered_data['collection_volume_ml'].mean()
        if request.period == "7days":
            predicted_demand = avg_demand * 0.9  # Adjust based on trend
        elif request.period == "30days":
            predicted_demand = avg_demand * 1.1
        else:
            predicted_demand = avg_demand
    else:
        predicted_demand = 0

    # Store forecast
    forecast = ForecastData(blood_type=request.blood_type, period=request.period, predicted_demand=int(predicted_demand))
    db.add(forecast)
    db.commit()
    db.refresh(forecast)

    return {"predicted_demand": int(predicted_demand), "period": request.period}