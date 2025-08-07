import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Alpha_123.@localhost:5432/blood_db")