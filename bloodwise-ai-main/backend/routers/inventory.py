from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.inventory import Inventory
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

class InventoryCreate(BaseModel):
    blood_unit_id: str
    donor_id: str
    donor_age: float
    donor_gender: str
    blood_type: str
    collection_site: str
    donation_date: datetime
    expiry_date: datetime
    collection_volume_ml: float
    hemoglobin_g_dl: float
    status: str = "available"

@router.get("/status", response_model=List[InventoryCreate])
def get_inventory_status(db: Session = Depends(get_db)):
    inventory = db.query(Inventory).all()
    return inventory

@router.put("/update")
def update_inventory(inventory: InventoryCreate, db: Session = Depends(get_db)):
    db_inventory = db.query(Inventory).filter(Inventory.blood_unit_id == inventory.blood_unit_id).first()
    if db_inventory:
        for key, value in inventory.dict().items():
            setattr(db_inventory, key, value)
        db.commit()
        db.refresh(db_inventory)
    return {"message": "Inventory updated"}