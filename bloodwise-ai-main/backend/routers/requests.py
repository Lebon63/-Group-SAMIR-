from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.request import BloodRetrievalRequest, DonorValidationRequest
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

class BloodRetrievalRequestCreate(BaseModel):
    doctor_id: int
    patient_name: str
    patient_age: int
    blood_group: str
    urgency: str = "normal"

class DonorValidationRequestCreate(BaseModel):
    doctor_id: int
    donor_name: str
    donor_age: int
    contact: str
    blood_group: str
    quantity: int

class BloodRetrievalRequestResponse(BaseModel):
    id: int
    doctor_id: int
    patient_name: str
    patient_age: int
    blood_group: str
    requested_date: datetime
    received_blood_group: str | None
    status: str
    urgency: str

class DonorValidationRequestResponse(BaseModel):
    id: int
    doctor_id: int
    donor_name: str
    donor_age: int
    contact: str
    blood_group: str
    quantity: int
    requested_date: datetime
    status: str

@router.post("/blood")
def submit_blood_request(request: BloodRetrievalRequestCreate, db: Session = Depends(get_db)):
    db_request = BloodRetrievalRequest(
        doctor_id=request.doctor_id,
        patient_name=request.patient_name,
        patient_age=request.patient_age,
        blood_group=request.blood_group,
        requested_date=datetime.now(),
        status="pending",
        urgency=request.urgency
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return {"request_id": db_request.id, "message": "Request submitted"}

@router.post("/donor")
def submit_donor_request(request: DonorValidationRequestCreate, db: Session = Depends(get_db)):
    db_request = DonorValidationRequest(
        doctor_id=request.doctor_id,
        donor_name=request.donor_name,
        donor_age=request.donor_age,
        contact=request.contact,
        blood_group=request.blood_group,
        quantity=request.quantity,
        requested_date=datetime.now(),
        status="pending"
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return {"request_id": db_request.id, "message": "Request submitted"}

@router.put("/approve/blood/{request_id}")
def approve_blood_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(BloodRetrievalRequest).filter(BloodRetrievalRequest.id == request_id).first()
    if db_request:
        db_request.status = "approved"
        db.commit()
        db.refresh(db_request)
    return {"message": "Request approved"}

@router.put("/refuse/blood/{request_id}")
def refuse_blood_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(BloodRetrievalRequest).filter(BloodRetrievalRequest.id == request_id).first()
    if db_request:
        db_request.status = "refused"
        db.commit()
        db.refresh(db_request)
    return {"message": "Request refused"}

@router.get("/history", response_model=dict[str, List[BloodRetrievalRequestResponse | DonorValidationRequestResponse]])
def get_request_history(db: Session = Depends(get_db)):
    blood_requests = db.query(BloodRetrievalRequest).all()
    donor_requests = db.query(DonorValidationRequest).all()
    return {
        "blood_requests": blood_requests,
        "donor_requests": donor_requests
    }