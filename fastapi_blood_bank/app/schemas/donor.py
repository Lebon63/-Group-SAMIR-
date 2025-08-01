from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class DonorBase(BaseModel):
    bloodgroup: str
    address: str
    mobile: str


class DonorCreate(DonorBase):
    user_id: int
    profile_pic: Optional[str] = None


class DonorResponse(DonorBase):
    id: int
    user_id: int
    profile_pic: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True


class DonationBase(BaseModel):
    disease: Optional[str] = None
    age: int
    bloodgroup: str
    unit: int


class DonationCreate(DonationBase):
    donor_id: int


class DonationResponse(DonationBase):
    id: int
    donor_id: int
    status: str
    date: datetime

    class Config:
        orm_mode = True