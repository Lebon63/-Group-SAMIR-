from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class GameProfileBase(BaseModel):
    points: int = 0
    level: int = 1
    donation_streak: int = 0

class GameProfileCreate(GameProfileBase):
    pass

class GameProfileUpdate(BaseModel):
    points: Optional[int] = None
    level: Optional[int] = None
    donation_streak: Optional[int] = None
    last_donation_date: Optional[datetime] = None

class GameProfileResponse(GameProfileBase):
    id: int
    user_id: int
    last_donation_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AchievementBase(BaseModel):
    name: str
    description: str
    points_reward: int = 0
    icon: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: int

    class Config:
        orm_mode = True

class UserAchievementBase(BaseModel):
    achievement_id: int

class UserAchievementCreate(UserAchievementBase):
    user_id: int

class UserAchievementResponse(BaseModel):
    id: int
    user_id: int
    achievement_id: int
    earned_at: datetime
    achievement: AchievementResponse

    class Config:
        orm_mode = True

class GameStateResponse(BaseModel):
    profile: GameProfileResponse
    achievements: List[UserAchievementResponse]
    total_donations: int
    next_level_points: int = Field(..., description="Points needed for next level")