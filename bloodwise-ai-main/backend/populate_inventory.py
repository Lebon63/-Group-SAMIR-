import csv
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.inventory import Inventory
import os

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Alpha_123.@localhost:5432/blood_db")
engine = create_engine(DATABASE_URL, echo=True)  # Enable SQL logging for debugging
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def parse_date(date_str):
    """Parse date string to datetime.date, return None if invalid."""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None

def populate_inventory(csv_file_path):
    db = SessionLocal()
    try:
        with open(csv_file_path, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            inserted = 0
            skipped = 0
            
            for row in reader:
                # Validate and transform data
                blood_unit_id = row["record_id"] if row["record_id"] else None
                blood_type = row["blood_type"] if row["blood_type"] else None
                donation_date = parse_date(row["donation_date"])
                expiry_date = parse_date(row["expiry_date"])
                collection_volume_ml = float(row["collection_volume_ml"]) if row["collection_volume_ml"] and row["collection_volume_ml"] != "UNKNOWN" else None

                # Skip invalid rows
                if not all([blood_unit_id, blood_type, donation_date, expiry_date, collection_volume_ml]):
                    print(f"Skipping invalid row: {row}")
                    skipped += 1
                    continue

                # Check for existing record to avoid duplicates
                if db.query(Inventory).filter(Inventory.blood_unit_id == blood_unit_id).first():
                    print(f"Skipping duplicate blood_unit_id: {blood_unit_id}")
                    skipped += 1
                    continue

                # Create inventory record
                inventory_record = Inventory(
                    blood_unit_id=blood_unit_id,
                    blood_type=blood_type,
                    donation_date=donation_date,
                    expiry_date=expiry_date,
                    collection_volume_ml=collection_volume_ml,
                    status="available"  # Default status
                )

                try:
                    db.add(inventory_record)
                    db.commit()
                    inserted += 1
                    print(f"Inserted record: {blood_unit_id}")
                except Exception as e:
                    db.rollback()
                    print(f"Failed to insert record {blood_unit_id}: {str(e)}")
                    skipped += 1

        print(f"Population complete: {inserted} records inserted, {skipped} records skipped.")
    except Exception as e:
        print(f"Error processing CSV: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    csv_file_path = "data/cleaned/cleaned_blood_bank_records.csv"  # Updated path
    populate_inventory(csv_file_path)