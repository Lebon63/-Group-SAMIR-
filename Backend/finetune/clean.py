import pandas as pd

# Load the dataset
df = pd.read_csv("C:/Users/Allan/Downloads/Hackaton resource/Hackaton resource/dataset/clinical_summaries.csv")

# Handle missing data
df['patient_age'] = df['patient_age'].fillna("unknown")
df['patient_gender'] = df['patient_gender'].fillna("unknown")
df['diagnosis'] = df['diagnosis'].fillna("unknown diagnosis")
df['summary_text'] = df['summary_text'].fillna("No summary available.")

# Optionally, calculate median age to use instead of "unknown" if preferred
# median_age = df['patient_age'].median()
# df['patient_age'] = df['patient_age'].fillna(median_age)

# Clean and generate prompt-response pairs
data = []
for index, row in df.iterrows():
    # Use cleaned values
    age = row['patient_age']
    gender = row['patient_gender']
    diagnosis = row['diagnosis']
    summary = row['summary_text']

    # Create prompt
    prompt = f"What are the symptoms or condition for a {age}-year-old {gender} patient diagnosed with {diagnosis}?"
    response = summary

    data.append({"prompt": prompt, "response": response})

# Save to JSON file
output_dir = "C:/Users/Allan/Desktop/patient-voice-clarity-bot-main/data"
import os
os.makedirs(output_dir, exist_ok=True)
with open(os.path.join(output_dir, "medical_data.json"), "w") as f:
    import json
    json.dump(data, f, indent=2)

print("Data cleaning complete. Saved to medical_data.json")