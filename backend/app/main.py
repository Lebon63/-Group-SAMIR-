from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from db.database import Base, engine, SessionLocal
from db.models import Patient  # Import Patient from models.py

# Initialize FastAPI app
app = FastAPI()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create tables (this will now use the Patient model from models.py)
Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas ---
class PatientBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str
    role: Optional[str] = "patient"

class PatientCreate(PatientBase):
    password: str

class PatientResponse(PatientBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# --- Database Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---
@app.post("/patients/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_patient = db.query(Patient).filter(Patient.email == patient.email).first()
    if db_patient:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = pwd_context.hash(patient.password)
    
    # Create new patient
    new_patient = Patient(
        email=patient.email,
        password=hashed_password,  # Changed from hashed_password to password to match model
        first_name=patient.first_name,
        last_name=patient.last_name,
        phone_number=patient.phone_number,
        is_active=True,
        # Note: The role field doesn't exist in models.py's Patient
        # You might want to add it to the model if needed
    )
    
    try:
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
        return new_patient
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/patients/{patient_id}", response_model=PatientResponse)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return patient

# --- Authentication Setup ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Health Check ---
@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)