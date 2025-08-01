from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.users import User
from app.models.donor import Donor, BloodDonate
from app.models.blood import Stock
from app.auth.jwt import get_current_active_user, is_donor
from app.schemas import DonorCreate, DonorResponse, DonationCreate, DonationResponse

router = APIRouter(
    prefix="/donors",
    tags=["donors"],
)

@router.post("/", response_model=DonorResponse)
async def create_donor(
    donor: DonorCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if donor already exists for this user
    db_donor = db.query(Donor).filter(Donor.user_id == donor.user_id).first()
    if db_donor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donor profile already exists for this user"
        )
    
    # Create new donor profile
    db_donor = Donor(
        user_id=donor.user_id,
        bloodgroup=donor.bloodgroup,
        address=donor.address,
        mobile=donor.mobile,
        profile_pic=donor.profile_pic
    )
    
    # Update user to mark as donor
    db_user = db.query(User).filter(User.id == donor.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.is_donor = True
    
    db.add(db_donor)
    db.commit()
    db.refresh(db_donor)
    return db_donor

@router.get("/", response_model=list[DonorResponse])
async def read_donors(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    donors = db.query(Donor).offset(skip).limit(limit).all()
    return donors

@router.get("/{donor_id}", response_model=DonorResponse)
async def read_donor(donor_id: int, db: Session = Depends(get_db)):
    db_donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if db_donor is None:
        raise HTTPException(status_code=404, detail="Donor not found")
    return db_donor

@router.post("/donate", response_model=DonationResponse)
async def donate_blood(
    donation: DonationCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(is_donor)
):
    # Create new blood donation
    db_donation = BloodDonate(
        donor_id=donation.donor_id,
        disease=donation.disease,
        age=donation.age,
        bloodgroup=donation.bloodgroup,
        unit=donation.unit,
        status="Pending"  # Default status
    )
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation

@router.put("/donations/{donation_id}/approve")
async def approve_donation(
    donation_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Get the donation
    db_donation = db.query(BloodDonate).filter(BloodDonate.id == donation_id).first()
    if not db_donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    if db_donation.status != "Pending":
        raise HTTPException(status_code=400, detail="Donation already processed")
    
    # Update donation status
    db_donation.status = "Approved"
    
    # Update blood stock
    bloodgroup = db_donation.bloodgroup
    units = db_donation.unit
    
    # Check if blood group exists in stock
    stock = db.query(Stock).filter(Stock.bloodgroup == bloodgroup).first()
    if stock:
        stock.unit += units
    else:
        # Create new stock entry
        new_stock = Stock(bloodgroup=bloodgroup, unit=units)
        db.add(new_stock)
    
    db.commit()
    db.refresh(db_donation)
    
    return {"message": "Donation approved successfully"}

@router.put("/donations/{donation_id}/reject")
async def reject_donation(
    donation_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Get the donation
    db_donation = db.query(BloodDonate).filter(BloodDonate.id == donation_id).first()
    if not db_donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    if db_donation.status != "Pending":
        raise HTTPException(status_code=400, detail="Donation already processed")
    
    # Update donation status
    db_donation.status = "Rejected"
    db.commit()
    
    return {"message": "Donation rejected successfully"}

@router.get("/donations", response_model=list[DonationResponse])
async def read_donations(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    donations = db.query(BloodDonate).offset(skip).limit(limit).all()
    return donations

@router.get("/my-donations", response_model=list[DonationResponse])
async def read_my_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(is_donor)
):
    # Get donor by user ID
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor profile not found")
    
    donations = db.query(BloodDonate).filter(BloodDonate.donor_id == donor.id).all()
    return donations