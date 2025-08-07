import requests

url = "http://127.0.0.1:8000"

# Test root
response = requests.get(f"{url}/")
print("Root:", response.json())

# Test register doctor
doctor_data = {
    "name": "Dr. Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "123-456-7890",
    "department": "Hematology",
    "registered_date": "2025-08-07"
}
response = requests.post(f"{url}/donors/register", json=doctor_data)
print("Register Doctor:", response.json())

# Test forecast
forecast_data = {"blood_type": "A-", "period": "7days"}
response = requests.post(f"{url}/forecast/predict", json=forecast_data)
print("Forecast:", response.json())