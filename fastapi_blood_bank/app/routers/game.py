from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta

from app.database.session import get_db
from app.models.users import User
from app.models.donor import BloodDonation
from app.models.game import GameProfile, Achievement, UserAchievement
from app.schemas.game import (
    GameProfileResponse, GameProfileCreate, GameProfileUpdate,
    AchievementResponse, AchievementCreate,
    UserAchievementResponse, GameStateResponse
)
from app.auth.jwt import get_current_user

router = APIRouter(
    prefix="/game",
    tags=["game"],
)

# Helper functions
def calculate_next_level_points(level: int) -> int:
    """Calculate points needed for the next level."""
    return level * 100

def check_achievements(db: Session, user_id: int) -> List[UserAchievementResponse]:
    """Check and award achievements based on user's donation history."""
    # Get user's game profile
    profile = db.query(GameProfile).filter(GameProfile.user_id == user_id).first()
    if not profile:
        return []
    
    # Get donation count
    donation_count = db.query(func.count(BloodDonation.id))\
        .filter(BloodDonation.donor_id == user_id, BloodDonation.status == "approved")\
        .scalar()
    
    # List of achievements to check
    achievements_to_check = [
        # First donation
        {
            "name": "First Time Hero",
            "description": "Complete your first blood donation",
            "condition": donation_count >= 1,
            "points_reward": 100,
            "icon": "first_hero_badge"
        },
        # Three donations
        {
            "name": "Regular Hero",
            "description": "Complete three blood donations",
            "condition": donation_count >= 3,
            "points_reward": 300,
            "icon": "regular_hero_badge"
        },
        # Five donations
        {
            "name": "Super Hero",
            "description": "Complete five blood donations",
            "condition": donation_count >= 5,
            "points_reward": 500,
            "icon": "super_hero_badge"
        },
        # Ten donations
        {
            "name": "Blood Donation Master",
            "description": "Complete ten blood donations",
            "condition": donation_count >= 10,
            "points_reward": 1000,
            "icon": "master_badge"
        },
        # Streak achievement
        {
            "name": "Consistent Donor",
            "description": "Maintain a donation streak of 3",
            "condition": profile.donation_streak >= 3,
            "points_reward": 500,
            "icon": "streak_badge"
        }
    ]
    
    new_achievements = []
    
    for achievement_data in achievements_to_check:
        if achievement_data["condition"]:
            # Check if achievement exists in the database
            achievement = db.query(Achievement)\
                .filter(Achievement.name == achievement_data["name"])\
                .first()
            
            # Create achievement if it doesn't exist
            if not achievement:
                achievement = Achievement(
                    name=achievement_data["name"],
                    description=achievement_data["description"],
                    points_reward=achievement_data["points_reward"],
                    icon=achievement_data["icon"]
                )
                db.add(achievement)
                db.flush()
            
            # Check if user already has this achievement
            existing = db.query(UserAchievement)\
                .filter(
                    UserAchievement.user_id == user_id,
                    UserAchievement.achievement_id == achievement.id
                ).first()
            
            if not existing:
                # Award the achievement
                user_achievement = UserAchievement(
                    user_id=user_id,
                    achievement_id=achievement.id
                )
                db.add(user_achievement)
                
                # Add points to the profile
                profile.points += achievement_data["points_reward"]
                
                # Check if user should level up
                while profile.points >= calculate_next_level_points(profile.level):
                    profile.level += 1
                
                db.add(profile)
                new_achievements.append(user_achievement)
    
    if new_achievements:
        db.commit()
        for achievement in new_achievements:
            db.refresh(achievement)
    
    # Return all user achievements
    return db.query(UserAchievement)\
        .filter(UserAchievement.user_id == user_id)\
        .all()

# Routes
@router.post("/profiles", response_model=GameProfileResponse)
def create_game_profile(
    profile: GameProfileCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new game profile for the current user."""
    # Check if profile already exists
    existing_profile = db.query(GameProfile)\
        .filter(GameProfile.user_id == current_user.id)\
        .first()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game profile already exists for this user"
        )
    
    # Create new profile
    db_profile = GameProfile(
        user_id=current_user.id,
        points=profile.points,
        level=profile.level,
        donation_streak=profile.donation_streak
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/profiles/me", response_model=GameProfileResponse)
def get_my_game_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the current user's game profile."""
    profile = db.query(GameProfile)\
        .filter(GameProfile.user_id == current_user.id)\
        .first()
    
    if not profile:
        # Create a default profile if it doesn't exist
        profile = GameProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return profile

@router.get("/state", response_model=GameStateResponse)
def get_game_state(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the complete game state for the current user."""
    # Get or create user's game profile
    profile = db.query(GameProfile)\
        .filter(GameProfile.user_id == current_user.id)\
        .first()
    
    if not profile:
        profile = GameProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Check for new achievements
    user_achievements = check_achievements(db, current_user.id)
    
    # Get donation count
    total_donations = db.query(func.count(BloodDonation.id))\
        .filter(
            BloodDonation.donor_id == current_user.id,
            BloodDonation.status == "approved"
        ).scalar()
    
    # Calculate points needed for next level
    next_level_points = calculate_next_level_points(profile.level)
    
    return {
        "profile": profile,
        "achievements": user_achievements,
        "total_donations": total_donations,
        "next_level_points": next_level_points
    }

@router.post("/donation-complete", response_model=GameStateResponse)
def process_donation_complete(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Process a completed blood donation, updating game state.
    This is called automatically when a donation is approved.
    """
    # Get or create user's game profile
    profile = db.query(GameProfile)\
        .filter(GameProfile.user_id == current_user.id)\
        .first()
    
    if not profile:
        profile = GameProfile(user_id=current_user.id)
    
    # Update donation streak
    now = datetime.utcnow()
    if profile.last_donation_date:
        # If last donation was within 3 months, increment streak
        if now - profile.last_donation_date <= timedelta(days=90):
            profile.donation_streak += 1
        else:
            # Reset streak if it's been more than 3 months
            profile.donation_streak = 1
    else:
        # First donation
        profile.donation_streak = 1
    
    # Update last donation date
    profile.last_donation_date = now
    
    # Award points for donation
    donation_points = 100
    profile.points += donation_points
    
    # Check for level up
    while profile.points >= calculate_next_level_points(profile.level):
        profile.level += 1
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    # Check achievements after donation
    user_achievements = check_achievements(db, current_user.id)
    
    # Get donation count
    total_donations = db.query(func.count(BloodDonation.id))\
        .filter(
            BloodDonation.donor_id == current_user.id,
            BloodDonation.status == "approved"
        ).scalar()
    
    # Calculate points needed for next level
    next_level_points = calculate_next_level_points(profile.level)
    
    return {
        "profile": profile,
        "achievements": user_achievements,
        "total_donations": total_donations,
        "next_level_points": next_level_points
    }

@router.get("/leaderboard", response_model=List[GameProfileResponse])
def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get the top donors leaderboard based on game points."""
    leaderboard = db.query(GameProfile)\
        .order_by(GameProfile.points.desc())\
        .limit(limit)\
        .all()
    
    return leaderboard

@router.get("/achievements", response_model=List[AchievementResponse])
def get_all_achievements(db: Session = Depends(get_db)):
    """Get all possible achievements in the game."""
    achievements = db.query(Achievement).all()
    return achievements

@router.get("/achievements/me", response_model=List[UserAchievementResponse])
def get_my_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all achievements earned by the current user."""
    user_achievements = db.query(UserAchievement)\
        .filter(UserAchievement.user_id == current_user.id)\
        .all()
    
    return user_achievements