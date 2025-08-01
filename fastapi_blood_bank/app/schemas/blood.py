from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class StockBase(BaseModel):
    bloodgroup: str
    unit: int


class StockCreate(StockBase):
    pass


class StockResponse(StockBase):
    id: int
    updated_at: datetime

    class Config:
        orm_mode = True


class RequestBase(BaseModel):
    patient_name: str
    patient_age: int
    reason: str
    bloodgroup: str
    unit: int


class RequestCreate(RequestBase):
    request_by_patient_id: Optional[int] = None
    request_by_donor_id: Optional[int] = None


class RequestResponse(RequestBase):
    id: int
    status: str
    date: datetime
    request_by_patient_id: Optional[int] = None
    request_by_donor_id: Optional[int] = None

    class Config:
        orm_mode = True


class RequestUpdate(BaseModel):
    status: str

    class Config:
        orm_mode = True