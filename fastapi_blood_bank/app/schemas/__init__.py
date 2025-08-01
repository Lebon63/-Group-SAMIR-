from app.schemas.user import UserCreate, UserResponse, Token
from app.schemas.donor import DonorCreate, DonorResponse, BloodDonationCreate, BloodDonationResponse
from app.schemas.patient import PatientCreate, PatientResponse, BloodRequestCreate, BloodRequestResponse
from app.schemas.blood import BloodStockResponse
from app.schemas.game import (
    GameProfileResponse, GameProfileCreate, GameProfileUpdate,
    AchievementResponse, AchievementCreate,
    UserAchievementResponse, GameStateResponse
)