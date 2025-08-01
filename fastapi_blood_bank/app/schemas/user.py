from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    is_donor: bool
    is_patient: bool

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str
    user_id: int


class TokenData(BaseModel):
    username: Optional[str] = None