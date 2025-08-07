from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.doctor import Doctor
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class DoctorCreate(BaseModel):
    name: str
    email: str
    phone: str | None = None
    department: str
    registered_date: str

class DoctorResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None
    department: str
    registered_date: str  # Changed to string to match frontend
    total_requests: int
    status: str

    class Config:
        from_attributes = True
        json_encoders = {
            date: lambda v: v.isoformat()  # Convert date to ISO string
        }

@router.post("/register")
def register_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    db_doctor = Doctor(**doctor.dict())
    db_doctor.total_requests = 0
    db_doctor.status = "active"
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return {"doctor_id": db_doctor.id, "message": "Doctor registered successfully"}

@router.get("/list", response_model=list[DoctorResponse])
def list_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()
    return doctors