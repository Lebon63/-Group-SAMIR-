from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from db.models import Doctor, Patient
from db.database import SessionLocal
from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from pydantic import BaseModel
from db.models import Doctor, Patient, Admin

# ---------------------- Settings ----------------------
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------------- Database Dependency ----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------- Utility Functions ----------------------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------------- Schemas ----------------------
class PatientCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    phone_number: str

class LoginRequest(BaseModel):
    email: str
    password: str
    
# ---------------------- Routes ----------------------


@router.post("/token")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    email = data.email
    password = data.password

    user = db.query(Admin).filter(Admin.email == email).first()
    user_role = "admin" if user else None
    
    if not user:
        user = db.query(Doctor).filter(Doctor.email == email).first()
        user_role = "doctor" if user else None
    
    if not user:
        user = db.query(Patient).filter(Patient.email == email).first()
        user_role = "patient" if user else None

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id), "role": user_role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "user_role": user_role,
        "name": getattr(user, "name", None) or getattr(user, "first_name", "") + " " + getattr(user, "last_name", "")
    }

@router.post("/patient")
def register_patient(data: PatientCreate, db: Session = Depends(get_db)):
    existing = db.query(Patient).filter_by(email=data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(data.password)

    new_patient = Patient(
        email=data.email,
        password=hashed_password,
        first_name=data.first_name,
        last_name=data.last_name,
        phone_number=data.phone_number,
    )

    try:
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error during registration")

    return {
        "message": "Patient registered successfully",
        "patient_id": new_patient.id
    }
