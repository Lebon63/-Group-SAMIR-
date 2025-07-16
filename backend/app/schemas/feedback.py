from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    name: Optional[str]
    language: Optional[str]
    rating: Optional[int]
    emoji: Optional[str]
    voice_text: Optional[str]
    comment: str

class FeedbackResponse(FeedbackCreate):
    id: int
    submitted_at: datetime

    class Config:
        orm_mode = True
