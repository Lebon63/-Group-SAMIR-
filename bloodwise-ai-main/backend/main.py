from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import donors, inventory, forecast, optimization, requests
from database import engine, Base

app = FastAPI(title="BloodWise AI Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Updated to match frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(donors.router, prefix="/donors", tags=["donors"])
app.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
app.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
app.include_router(optimization.router, prefix="/optimization", tags=["optimization"])
app.include_router(requests.router, prefix="/requests", tags=["requests"])

@app.get("/")
def read_root():
    return {"message": "BloodWise AI Backend - API is running", "status": "active"}