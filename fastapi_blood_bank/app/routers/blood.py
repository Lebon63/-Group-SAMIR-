from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.users import User
from app.models.blood import Stock, BloodRequest
from app.auth.jwt import get_current_active_user, is_admin
from app.schemas import StockResponse, RequestResponse, RequestUpdate

router = APIRouter(
    prefix="/blood",
    tags=["blood"],
)

@router.get("/stock", response_model=list[StockResponse])
async def read_blood_stock(
    db: Session = Depends(get_db)
):
    """Get current blood stock levels"""
    stocks = db.query(Stock).all()
    return stocks

@router.get("/requests", response_model=list[RequestResponse])
async def read_blood_requests(
    skip: int = 0, 
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get blood requests with optional status filter"""
    query = db.query(BloodRequest)
    
    if status:
        query = query.filter(BloodRequest.status == status)
    
    requests = query.offset(skip).limit(limit).all()
    return requests

@router.put("/requests/{request_id}", response_model=RequestResponse)
async def update_request_status(
    request_id: int,
    request_update: RequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(is_admin)
):
    """Update blood request status (admin only)"""
    # Get the request
    db_request = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Blood request not found")
    
    # Update the status
    db_request.status = request_update.status
    
    # If approved, update stock
    if request_update.status == "Approved":
        # Check if we have enough blood
        stock = db.query(Stock).filter(Stock.bloodgroup == db_request.bloodgroup).first()
        if not stock or stock.unit < db_request.unit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Not enough blood of group {db_request.bloodgroup} in stock"
            )
        
        # Deduct from stock
        stock.unit -= db_request.unit
    
    db.commit()
    db.refresh(db_request)
    
    return db_request