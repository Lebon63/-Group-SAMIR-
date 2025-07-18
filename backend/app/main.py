import sys
from pathlib import Path
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Optional, List, Union

from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt

from db.database import Base, engine, SessionLocal
from db.models import Patient, FeedbackCategory, Feedback, Doctor

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# App initialization with lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        init_feedback_categories(db)
        yield
    finally:
        db.close()

app = FastAPI(
    title="DGH Care API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration - Updated to handle all required origins and methods
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.186:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Security configurations
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Global OPTIONS handler for all /auth routes
@app.api_route("/auth/{path:path}", methods=["OPTIONS"])
async def handle_options(request: Request, path: str):
    return Response(
        status_code=204,
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers", "*")
        }
    )

# Schemas
class PatientBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str

class PatientCreate(PatientBase):
    password: str

class PatientResponse(PatientBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    user_role: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    name: Optional[str] = None
    specialty: Optional[str] = None
    role: str

class FeedbackCategoryResponse(BaseModel):
    id: int
    name: str

class FeedbackCreate(BaseModel):
    category_id: int
    rating: Optional[int] = None
    comment: Optional[str] = None
    voice_transcript: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    patient_id: int
    category_id: int
    rating: Optional[int]
    comment: Optional[str]
    voice_transcript: Optional[str]
    created_at: datetime
    category_name: str

    class Config:
        from_attributes = True

class DoctorCreate(BaseModel):
    name: str
    specialty: str
    email: EmailStr
    password: str

class DoctorOut(BaseModel):
    id: int
    name: str
    specialty: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Password utilities
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        user_role: str = payload.get("role")
        if user_id is None or user_role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    if user_role == "patient":
        user = db.query(Patient).filter(Patient.id == int(user_id)).first()
    elif user_role == "doctor":
        user = db.query(Doctor).filter(Doctor.id == int(user_id)).first()
    else:
        raise credentials_exception
    
    if user is None:
        raise credentials_exception
    
    return user

# Initialize feedback categories
def init_feedback_categories(db: Session):
    categories = [
        "Service Quality",
        "Doctor Consultation", 
        "Wait Time",
        "Staff Behavior",
        "Facilities",
        "Overall Experience"
    ]
    for category_name in categories:
        existing = db.query(FeedbackCategory).filter(FeedbackCategory.name == category_name).first()
        if not existing:
            category = FeedbackCategory(name=category_name)
            db.add(category)
    db.commit()

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "DGH Care API"}

# Authentication endpoints
@app.post("/auth/patient", response_model=PatientResponse)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    existing_patient = db.query(Patient).filter(Patient.email == patient.email).first()
    if existing_patient:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(patient.password)
    db_patient = Patient(
        email=patient.email,
        password=hashed_password,
        first_name=patient.first_name,
        last_name=patient.last_name,
        phone_number=patient.phone_number,
        is_active=True
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.post("/auth/doctor", response_model=DoctorOut)
def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    existing_doctor = db.query(Doctor).filter(Doctor.email == doctor.email).first()
    if existing_doctor:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(doctor.password)
    db_doctor = Doctor(
        email=doctor.email,
        password=hashed_password,
        name=doctor.name,
        specialty=doctor.specialty,
        is_active=True
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@app.post("/auth/token", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    # Check patient first
    patient = db.query(Patient).filter(Patient.email == login_data.email).first()
    if patient and verify_password(login_data.password, patient.password):
        if not patient.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is inactive")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(patient.id), "role": "patient"}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": patient.id,
            "user_role": "patient"
        }
    
    # If not patient, check doctor
    doctor = db.query(Doctor).filter(Doctor.email == login_data.email).first()
    if doctor and verify_password(login_data.password, doctor.password):
        if not doctor.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is inactive")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(doctor.id), "role": "doctor"}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": doctor.id,
            "user_role": "doctor"
        }
    
    # If neither found
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

@app.get("/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: Union[Patient, Doctor] = Depends(get_current_user)):
    if isinstance(current_user, Patient):
        return {
            "id": current_user.id,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "phone_number": current_user.phone_number,
            "role": "patient"
        }
    else:  # Doctor
        return {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "specialty": current_user.specialty,
            "role": "doctor"
        }

# Admin Dashboard Endpoints
@app.get("/patients", response_model=List[PatientResponse])
def get_all_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@app.get("/feedback", response_model=List[FeedbackResponse])
def get_all_feedback(db: Session = Depends(get_db)):
    feedbacks = db.query(Feedback, FeedbackCategory).join(
        FeedbackCategory, Feedback.category_id == FeedbackCategory.id
    ).all()
    
    return [
        {
            "id": feedback.id,
            "patient_id": feedback.patient_id,
            "category_id": feedback.category_id,
            "rating": feedback.rating,
            "comment": feedback.comment,
            "voice_transcript": feedback.voice_transcript,
            "created_at": feedback.created_at,
            "category_name": category.name
        }
        for feedback, category in feedbacks
    ]

@app.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db), current_user: Patient = Depends(get_current_user)):
    if current_user.id != patient_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this patient's data")
    
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    return patient

@app.get("/feedback/categories", response_model=List[FeedbackCategoryResponse])
def get_feedback_categories(db: Session = Depends(get_db)):
    categories = db.query(FeedbackCategory).all()
    return [{"id": cat.id, "name": cat.name} for cat in categories]

@app.post("/feedback/", response_model=FeedbackResponse)
def create_feedback(
    feedback: FeedbackCreate, 
    db: Session = Depends(get_db), 
    current_user: Patient = Depends(get_current_user)
):
    category = db.query(FeedbackCategory).filter(FeedbackCategory.id == feedback.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid feedback category")

    new_feedback = Feedback(
        patient_id=current_user.id,
        category_id=feedback.category_id,
        rating=feedback.rating,
        comment=feedback.comment,
        voice_transcript=feedback.voice_transcript
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return {
        "id": new_feedback.id,
        "patient_id": new_feedback.patient_id,
        "category_id": new_feedback.category_id,
        "rating": new_feedback.rating,
        "comment": new_feedback.comment,
        "voice_transcript": new_feedback.voice_transcript,
        "created_at": new_feedback.created_at,
        "category_name": category.name
    }

@app.get("/feedback/", response_model=List[FeedbackResponse])
def get_patient_feedback(
    db: Session = Depends(get_db), 
    current_user: Patient = Depends(get_current_user)
):
    feedbacks = db.query(Feedback, FeedbackCategory).join(
        FeedbackCategory, Feedback.category_id == FeedbackCategory.id
    ).filter(Feedback.patient_id == current_user.id).all()
    
    return [
        {
            "id": feedback.id,
            "patient_id": feedback.patient_id,
            "category_id": feedback.category_id,
            "rating": feedback.rating,
            "comment": feedback.comment,
            "voice_transcript": feedback.voice_transcript,
            "created_at": feedback.created_at,
            "category_name": category.name
        }
        for feedback, category in feedbacks
    ]

@app.get("/doctors", response_model=List[DoctorOut])
def get_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@app.post("/doctors", response_model=DoctorOut)
def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    existing_doctor = db.query(Doctor).filter(Doctor.email == doctor.email).first()
    if existing_doctor:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(doctor.password)
    db_doctor = Doctor(
        name=doctor.name,
        specialty=doctor.specialty,
        email=doctor.email,
        password=hashed_password,
        is_active=True
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@app.patch("/doctors/{doctor_id}/status", response_model=DoctorOut)
def toggle_doctor_status(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor.is_active = not doctor.is_active
    db.commit()
    db.refresh(doctor)
    return doctor

@app.get("/support/contact")
def get_support_info():
    return {
        "email": "support@dghcare.cm",
        "phone": "+237 XXX XXX XXX",
        "hours": "24/7 Emergency Support",
        "languages": ["English", "French", "Douala", "Bassa", "Ewondo"]
    }