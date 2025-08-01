## AI-Enhanced Blood Bank Stock Monitoring and Forecasting System

A comprehensive blood bank management system with gamification features to encourage blood donations.

## Project Overview

This Blood Bank Management System is a web application that facilitates the management of blood donations, donor tracking, patient requests, and blood inventory. The system includes a gamification component that rewards donors with points, achievements, and levels to encourage regular blood donations.

### Key Features

- **User Authentication**: Secure login and registration for administrators, donors, and patients
- **Role-Based Access**: Different interfaces and capabilities for administrators, donors, and patients
- **Donor Management**: Track donor profiles, donation history, and eligibility status
- **Patient Management**: Manage patient profiles and blood requests
- **Blood Inventory**: Track blood stock levels by blood type
- **Request Processing**: Submit, approve, and fulfill blood requests
- **Gamification**: Points system, achievements, donation streaks, and leaderboards to incentivize donors

## System Architecture

The system is built using a modern tech stack with separate frontend and backend components:

### Frontend
- Built with React.js
- Bootstrap for responsive UI components
- React Router for navigation
- Context API for state management
- Axios for API communication

### Backend
- FastAPI (Python) for RESTful API endpoints
- SQLAlchemy for ORM
- JWT-based authentication
- CORS middleware for secure cross-origin requests

## Getting Started

Follow these instructions to set up and run the Blood Bank Management System on your local machine.

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- pip (Python package manager)
- npm or pnpm (Node.js package managers)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd /path/to/blood\ Bank\ management\ system/fastapi_blood_bank
   ```

2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```
   uvicorn main:app --reload
   ```

   The backend server will start at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd /path/to/blood\ Bank\ management\ system/react_template
   ```

2. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   pnpm run dev
   ```

   The frontend application will be available at http://localhost:5173

## Usage

### Admin Access
- URL: http://localhost:5173/admin/adminlogin
- Dashboard: Manage blood inventory, approve/reject donations, process requests

### Donor Access
- Registration: http://localhost:5173/donor/donorsignup
- Login: http://localhost:5173/donor/donorlogin
- Dashboard: View donation history, donate blood, check achievements

### Patient Access
- Registration: http://localhost:5173/patient/patientsignup
- Login: http://localhost:5173/patient/patientlogin
- Dashboard: Request blood, view request status

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Gamification System

The system includes a gamification component to encourage regular blood donations:

- **Points**: Earned for each successful donation
- **Levels**: Progress through levels as points accumulate
- **Achievements**: Unlock achievements for donation milestones
- **Donation Streaks**: Maintain regular donations to build streaks
- **Leaderboard**: See how you rank among other donors

## Development

### Project Structure

```
blood Bank management system/
├── fastapi_blood_bank/        # Backend application
│   ├── app/
│   │   ├── auth/              # Authentication utilities
│   │   ├── database/          # Database models and session
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routers/           # API endpoints
│   │   └── schemas/           # Pydantic schemas
│   └── main.py                # Application entry point
└── react_template/            # Frontend application
    ├── public/
    └── src/
        ├── components/        # Reusable UI components
        ├── contexts/          # React contexts
        ├── pages/             # Page components
        ├── services/          # API service layer
        └── App.jsx            # Main application component
```

