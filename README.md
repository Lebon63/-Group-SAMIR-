# Douala General Hospital Patient Feedback and Reminder System

## Features

1. **Multilingual Patient Feedback Interface**
   - Text input with voice recognition support (using Web Speech API)
   - Star rating system for easy feedback

2. **Automated Patient Reminder System**
   - SMS reminders via Twilio integration
   - Appointment and medication reminders

3. **Real-time Hospital Performance Dashboard**
   - Visual summary of patient feedback and metrics

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd uploads/backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up Twilio environment variables:
   ```
   export TWILIO_ACCOUNT_SID="your_account_sid"
   export TWILIO_AUTH_TOKEN="your_auth_token"
   export TWILIO_PHONE_NUMBER="your_twilio_phone_number"
   ```

4. Run the backend server:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd uploads/Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a .env file with your backend URL:
   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

4. Run the frontend development server:
   ```
   npm run dev
   ```

## Speech-to-Text Feature

The system uses the Web Speech API for speech recognition. This is currently supported in:
- Chrome
- Edge
- Safari

For Firefox users, the application will default to text input only.

## Twilio SMS Integration

The system is integrated with Twilio for sending medication and appointment reminders via SMS. To use this feature:

1. Create a Twilio account at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token from the Twilio Console
3. Buy a phone number from Twilio
4. Set the environment variables as described in the backend setup

When patients set reminders, they'll automatically receive SMS notifications based on their preferences.