from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, donor, patient, blood, game
from app.database.session import create_tables

# Create database tables
create_tables()

app = FastAPI(title="Blood Bank Management System API")

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port
    "*",  # For development only - remove in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(donor.router)
app.include_router(patient.router)
app.include_router(blood.router)
app.include_router(game.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Blood Bank Management System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)