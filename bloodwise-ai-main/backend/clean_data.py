import pandas as pd
import numpy as np
from datetime import datetime

# Load the CSV file from the raw data directory
df = pd.read_csv("../raw/blood_bank_records.csv")

# Step 1: Handle missing or invalid values
# Drop rows where record_id is missing (as it's a key identifier)
df = df.dropna(subset=['record_id'])

# Fill missing donor_id with a placeholder or drop if critical
df['donor_id'] = df['donor_id'].fillna('UNKNOWN')

# Fill or impute missing numerical fields (age, volume, hemoglobin)
df['donor_age'] = pd.to_numeric(df['donor_age'], errors='coerce')
df['collection_volume_ml'] = pd.to_numeric(df['collection_volume_ml'], errors='coerce')
df['hemoglobin_g_dl'] = pd.to_numeric(df['hemoglobin_g_dl'], errors='coerce')

# Impute missing ages with median
df['donor_age'] = df['donor_age'].fillna(df['donor_age'].median())

# Impute missing volumes with mean (within blood type)
df['collection_volume_ml'] = df.groupby('blood_type')['collection_volume_ml'].transform(lambda x: x.fillna(x.mean()))

# Impute missing hemoglobin with mean (within blood type and gender)
df['hemoglobin_g_dl'] = df.groupby(['blood_type', 'donor_gender'])['hemoglobin_g_dl'].transform(lambda x: x.fillna(x.mean()))

# Step 2: Handle date fields
# Convert date strings to datetime, fill missing with a default or drop if both are missing
df['donation_date'] = pd.to_datetime(df['donation_date'], errors='coerce')
df['expiry_date'] = pd.to_datetime(df['expiry_date'], errors='coerce')

# Drop rows where both donation_date and expiry_date are missing
df = df.dropna(subset=['donation_date', 'expiry_date'], how='all')

# Fill missing donation_date with the earliest date in the dataset
df['donation_date'] = df['donation_date'].fillna(df['donation_date'].min())

# Fill missing expiry_date with donation_date + 6 months (standard blood shelf life)
df['expiry_date'] = df.apply(
    lambda row: row['donation_date'] + pd.Timedelta(days=180) if pd.isna(row['expiry_date']) else row['expiry_date'],
    axis=1
)

# Step 3: Clean categorical data
# Fill missing collection_site with 'Unknown'
df['collection_site'] = df['collection_site'].fillna('Unknown')

# Fill missing donor_gender with 'U' (Unknown)
df['donor_gender'] = df['donor_gender'].fillna('U')

# Step 4: Validate data ranges
# Ensure collection_volume_ml is between 250 and 500 ml
df = df[(df['collection_volume_ml'] >= 250) & (df['collection_volume_ml'] <= 500)]

# Ensure hemoglobin is within a reasonable range (12-16 g/dL for adults)
df = df[(df['hemoglobin_g_dl'] >= 12) & (df['hemoglobin_g_dl'] <= 16)]

# Step 5: Add derived features for forecasting
# Calculate days_until_expiry using pd.Timestamp for compatibility
df['days_until_expiry'] = (df['expiry_date'] - pd.Timestamp(datetime.now().date())).dt.days

# Flag records expiring soon (<30 days)
df['expiring_soon'] = df['days_until_expiry'] < 30

# Save cleaned data to the cleaned directory
df.to_csv("../cleaned/cleaned_blood_bank_records.csv", index=False)

print("Data cleaning complete. Saved to ../cleaned/cleaned_blood_bank_records.csv")