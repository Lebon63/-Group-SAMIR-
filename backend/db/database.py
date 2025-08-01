from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from urllib.parse import quote_plus  # Add this import

# URL-encode password and force IPv4/SSL
password = os.getenv("DB_PASSWORD", "Eventsnap101#")  # Store password separately
encoded_password = quote_plus(password)  # Encodes special characters like #
DATABASE_URL = f"postgres://postgres:{encoded_password}@db.ylytqdkdulrtducrekvp.supabase.co:5432/postgres?sslmode=require"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Auto-reconnect if connection drops
    connect_args={
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
    }
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
