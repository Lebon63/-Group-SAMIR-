from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, select, func
from db.models import Patient, Feedback, FeedbackCategory, Appointment, Medication, Base, patient_medication
from db.database import SessionLocal
from pydantic import BaseModel
from datetime import datetime, timedelta

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite database
engine = create_engine("sqlite:///./test.db")
# Base.metadata.create_all(bind=engine)  # Moved to init_db.py

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class FeedbackCreate(BaseModel):
    patient_name: str
    category: str
    rating: int
    comment: str
    status: str = "New"

class AppointmentCreate(BaseModel):
    patient_name: str
    date: str
    time: str
    description: str
    status: str

class MedicationCreate(BaseModel):
    patient_name: str
    medication: str
    dosage: str
    frequency: str
    instructions: str

# API Endpoints
@app.get("/feedback/", response_model=list[FeedbackCreate])
def read_feedback(db: Session = Depends(get_db)):
    stmt = select(Feedback).join(Patient).join(FeedbackCategory)
    feedback = db.execute(stmt).scalars().all()
    return [
        {
            "patient_name": f.patient.first_name + " " + f.patient.last_name,
            "category": f.category.name if f.category else None,
            "rating": f.rating,
            "comment": f.comment,
            "status": "New" if f.created_at > (datetime.now() - timedelta(days=7)) else "Reviewed"
        }
        for f in feedback
    ]

@app.post("/feedback/")
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    patient = db.execute(select(Patient).where(Patient.first_name + " " + Patient.last_name == feedback.patient_name)).scalar()
    if not patient:
        patient = Patient(first_name=feedback.patient_name.split()[0], last_name=feedback.patient_name.split()[-1] if len(feedback.patient_name.split()) > 1 else "", email=f"{feedback.patient_name.replace(' ', '.')}@example.com", password="default")
        db.add(patient)
        db.commit()
        db.refresh(patient)
    category = db.execute(select(FeedbackCategory).where(FeedbackCategory.name == feedback.category)).scalar()
    if not category:
        category = FeedbackCategory(name=feedback.category)
        db.add(category)
        db.commit()
        db.refresh(category)
    db_feedback = Feedback(patient_id=patient.id, category_id=category.id, rating=feedback.rating, comment=feedback.comment)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return {"message": "Feedback created", "id": db_feedback.id}

@app.get("/appointments/", response_model=list[AppointmentCreate])
def read_appointments(db: Session = Depends(get_db)):
    stmt = select(Appointment).join(Patient)
    appointments = db.execute(stmt).scalars().all()
    return [
        {
            "patient_name": a.patient.first_name + " " + a.patient.last_name,
            "date": a.date,
            "time": a.time,
            "description": a.description,
            "status": a.status
        }
        for a in appointments
    ]

@app.post("/appointments/")
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    patient = db.execute(select(Patient).where(Patient.first_name + " " + Patient.last_name == appointment.patient_name)).scalar()
    if not patient:
        patient = Patient(first_name=appointment.patient_name.split()[0], last_name=appointment.patient_name.split()[-1] if len(appointment.patient_name.split()) > 1 else "", email=f"{appointment.patient_name.replace(' ', '.')}@example.com", password="default")
        db.add(patient)
        db.commit()
        db.refresh(patient)
    db_appointment = Appointment(patient_id=patient.id, date=appointment.date, time=appointment.time, description=appointment.description, status=appointment.status)
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return {
        "id": db_appointment.id,
        "patient_name": appointment.patient_name,
        "date": db_appointment.date,
        "time": db_appointment.time,
        "description": db_appointment.description,
        "status": db_appointment.status
    }

@app.get("/medications/", response_model=list[MedicationCreate])
def read_medications(db: Session = Depends(get_db)):
    stmt = select(Medication).join(patient_medication).join(Patient)
    medications = db.execute(stmt).scalars().all()
    results = []
    for m in medications:
        for p in m.patients:
            results.append({
                "patient_name": p.first_name + " " + p.last_name,
                "medication": m.medication,
                "dosage": m.dosage,
                "frequency": m.frequency,
                "instructions": m.instructions
            })
    return results

@app.post("/medications/")
def create_medication(medication: MedicationCreate, db: Session = Depends(get_db)):
    # Search for existing patient by name
    patient = db.execute(select(Patient).where(func.concat(Patient.first_name, " ", Patient.last_name) == medication.patient_name)).scalar()
    if not patient:
        # Try to find by email to reuse existing patient
        email = f"{medication.patient_name.replace(' ', '.')}@example.com"
        patient = db.execute(select(Patient).where(Patient.email == email)).scalar()
        if not patient:
            # Create new patient only if no match by name or email
            first_name = medication.patient_name.split()[0]
            last_name = medication.patient_name.split()[-1] if len(medication.patient_name.split()) > 1 else ""
            patient = Patient(first_name=first_name, last_name=last_name, email=email, password="default")
            db.add(patient)
            db.commit()
            db.refresh(patient)
        else:
            db.refresh(patient)  # Ensure fresh data for existing patient
    else:
        db.refresh(patient)  # Ensure fresh data for existing patient
    # Create new medication and associate with existing patient
    db_medication = Medication(medication=medication.medication, dosage=medication.dosage, frequency=medication.frequency, instructions=medication.instructions)
    patient.medications.append(db_medication)
    db.add(db_medication)
    try:
        db.commit()  # Commit with error handling
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    db.refresh(patient)
    db.refresh(db_medication)
    # Verify the association
    db_patient = db.execute(select(Patient).where(Patient.id == patient.id)).scalar()
    print(f"Patient {patient.first_name} {patient.last_name} now has medications: {[m.medication for m in db_patient.medications]}")
    return {
        "id": db_medication.id,
        "patient_name": medication.patient_name,
        "medication": db_medication.medication,
        "dosage": db_medication.dosage,
        "frequency": db_medication.frequency,
        "instructions": db_medication.instructions
    }