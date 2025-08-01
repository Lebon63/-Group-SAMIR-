from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.users import User
from app.models.patient import Patient
from app.models.blood import BloodRequest
from app.auth.jwt import get_current_active_user, is_patient
from app.schemas import PatientCreate, PatientResponse, RequestCreate, RequestResponse

router = APIRouter(
    prefix="/patients",
    tags=["patients"],
)

@router.post("/", response_model=PatientResponse)
async def create_patient(
    patient: PatientCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if patient already exists for this user
    db_patient = db.query(Patient).filter(Patient.user_id == patient.user_id).first()
    if db_patient:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient profile already exists for this user"
        )
    
    # Create new patient profile
    db_patient = Patient(
        user_id=patient.user_id,
        bloodgroup=patient.bloodgroup,
        address=patient.address,
        mobile=patient.mobile,
        profile_pic=patient.profile_pic
    )
    
    # Update user to mark as patient
    db_user = db.query(User).filter(User.id == patient.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.is_patient = True
    
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/", response_model=list[PatientResponse])
async def read_patients(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
async def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.post("/blood-request", response_model=RequestResponse)
async def create_blood_request(
    request: RequestCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Create new blood request
    db_request = BloodRequest(
        request_by_patient_id=request.request_by_patient_id,
        request_by_donor_id=request.request_by_donor_id,
        patient_name=request.patient_name,
        patient_age=request.patient_age,
        reason=request.reason,
        bloodgroup=request.bloodgroup,
        unit=request.unit,
        status="Pending"  # Default status
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/requests", response_model=list[RequestResponse])
async def read_blood_requests(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    requests = db.query(BloodRequest).offset(skip).limit(limit).all()
    return requests

@router.get("/my-requests", response_model=list[RequestResponse])
async def read_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(is_patient)
):
    # Get patient by user ID
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    
    requests = db.query(BloodRequest).filter(BloodRequest.request_by_patient_id == patient.id).all()
    return requests