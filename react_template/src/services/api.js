import axios from 'axios';

// API base URL - adjust based on your deployment environment
const API_URL = 'http://localhost:8000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  // Login user
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    return api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
};

// User API calls
export const userAPI = {
  // Get current user
  getCurrentUser: () => {
    return api.get('/users/me');
  },
};

// Donor API calls
export const donorAPI = {
  // Create donor profile
  createDonorProfile: (donorData) => {
    return api.post('/donors', donorData);
  },
  
  // Get all donors
  getAllDonors: () => {
    return api.get('/donors');
  },
  
  // Get donor by ID
  getDonor: (id) => {
    return api.get(`/donors/${id}`);
  },
  
  // Donate blood
  donateBlood: (donationData) => {
    return api.post('/donors/donate', donationData);
  },
  
  // Get donor's donations
  getMyDonations: () => {
    return api.get('/donors/my-donations');
  },
};

// Patient API calls
export const patientAPI = {
  // Create patient profile
  createPatientProfile: (patientData) => {
    return api.post('/patients', patientData);
  },
  
  // Get all patients
  getAllPatients: () => {
    return api.get('/patients');
  },
  
  // Get patient by ID
  getPatient: (id) => {
    return api.get(`/patients/${id}`);
  },
  
  // Create blood request
  requestBlood: (requestData) => {
    return api.post('/patients/blood-request', requestData);
  },
  
  // Get patient's blood requests
  getMyRequests: () => {
    return api.get('/patients/my-requests');
  },
};

// Blood API calls
export const bloodAPI = {
  // Get blood stock
  getBloodStock: () => {
    return api.get('/blood/stock');
  },
  
  // Get all blood requests
  getAllBloodRequests: (status = null) => {
    const params = status ? { status } : {};
    return api.get('/blood/requests', { params });
  },
  
  // Update blood request status
  updateRequestStatus: (requestId, status) => {
    return api.put(`/blood/requests/${requestId}`, { status });
  },
};

// Admin API calls
export const adminAPI = {
  // Approve blood donation
  approveDonation: (donationId) => {
    return api.put(`/donors/donations/${donationId}/approve`);
  },
  
  // Reject blood donation
  rejectDonation: (donationId) => {
    return api.put(`/donors/donations/${donationId}/reject`);
  },
};

export default api;