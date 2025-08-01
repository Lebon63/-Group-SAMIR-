from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class PatientBase(BaseModel):
    bloodgroup: str
    address: str
    mobile: str


class PatientCreate(PatientBase):
    user_id: int
    profile_pic: Optional[str] = None


class PatientResponse(PatientBase):
    id: int
    user_id: int
    profile_pic: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True