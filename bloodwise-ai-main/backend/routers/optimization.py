from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.inventory import Inventory
from pydantic import BaseModel
import pandas as pd

router = APIRouter()

class OptimizationRequest(BaseModel):
    blood_type: str

@router.post("/recommend")
def optimize_inventory(request: OptimizationRequest, db: Session = Depends(get_db)):
    # Load cleaned data from the correct directory
    cleaned_data = pd.read_csv("data/cleaned/cleaned_blood_bank_records.csv")
    filtered_data = cleaned_data[cleaned_data['blood_type'] == request.blood_type]
    
    # Mock optimization (to be replaced with PuLP/SciPy)
    current_stock = db.query(Inventory).filter(Inventory.blood_type == request.blood_type).count()
    if not filtered_data.empty:
        avg_demand = filtered_data['collection_volume_ml'].mean()
        reorder_point = max(50, int(avg_demand * 1.2))  # Buffer based on demand
    else:
        reorder_point = 50

    message = f"Reorder {request.blood_type} if stock falls below {reorder_point} units"
    return {"reorder_point": reorder_point, "message": message}