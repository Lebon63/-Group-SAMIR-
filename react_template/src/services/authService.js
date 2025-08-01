import axios from 'axios';

// Configure base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock authentication for development (will be replaced with actual API calls)
const mockUsers = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN',
    first_name: 'Admin',
    last_name: 'User',
  },
  donor: [
    {
      username: 'donor1',
      password: 'donor123',
      role: 'DONOR',
      first_name: 'John',
      last_name: 'Doe',
      bloodgroup: 'A+',
      email: 'john.doe@example.com',
    },
  ],
  patient: [
    {
      username: 'patient1',
      password: 'patient123',
      role: 'PATIENT',
      first_name: 'Jane',
      last_name: 'Smith',
      bloodgroup: 'B+',
      email: 'jane.smith@example.com',
    },
  ],
};

/**
 * Login function for all user types
 * @param {string} userType - 'admin', 'donor', or 'patient'
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} - Response with token and user data or error
 */
export const login = async (userType, credentials) => {
  try {
    // In a real application, make an API call to Django
    // const response = await axios.post(`${API_URL}/${userType}/login/`, credentials);
    // return response.data;

    // For development, mock the authentication
    let user = null;

    if (userType === 'admin' && 
        credentials.username === mockUsers.admin.username && 
        credentials.password === mockUsers.admin.password) {
      user = mockUsers.admin;
    } else if (userType === 'donor') {
      user = mockUsers.donor.find(
        (d) => d.username === credentials.username && d.password === credentials.password
      );
    } else if (userType === 'patient') {
      user = mockUsers.patient.find(
        (p) => p.username === credentials.username && p.password === credentials.password
      );
    }

    if (user) {
      // Store token and user info in localStorage
      const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', userType);

      return {
        token,
        user,
        error: false,
      };
    } else {
      return {
        error: true,
        message: 'Invalid username or password',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: true,
      message: error.response?.data?.message || 'An error occurred during login',
    };
  }
};

/**
 * Register function for donor and patient
 * @param {string} userType - 'donor' or 'patient'
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Response with success message or error
 */
export const register = async (userType, userData) => {
  try {
    // In a real application, make an API call to Django
    // const response = await axios.post(`${API_URL}/${userType}/signup/`, userData);
    // return response.data;

    // For development, mock the registration
    // In a real app, this would be handled by the backend
    
    if (userType === 'donor') {
      // Check if username exists
      const existingUser = mockUsers.donor.find(d => d.username === userData.username);
      if (existingUser) {
        return {
          error: true,
          message: 'Username already exists',
        };
      }
      
      // Add new donor
      mockUsers.donor.push({
        username: userData.username,
        password: userData.password,
        role: 'DONOR',
        first_name: userData.first_name,
        last_name: userData.last_name,
        bloodgroup: userData.bloodgroup,
        email: userData.email,
      });
    } else if (userType === 'patient') {
      // Check if username exists
      const existingUser = mockUsers.patient.find(p => p.username === userData.username);
      if (existingUser) {
        return {
          error: true,
          message: 'Username already exists',
        };
      }
      
      // Add new patient
      mockUsers.patient.push({
        username: userData.username,
        password: userData.password,
        role: 'PATIENT',
        first_name: userData.first_name,
        last_name: userData.last_name,
        bloodgroup: userData.bloodgroup,
        email: userData.email,
      });
    }

    return {
      error: false,
      message: 'Registration successful',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      error: true,
      message: error.response?.data?.message || 'An error occurred during registration',
    };
  }
};

/**
 * Logout function
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
};

/**
 * Check if user is authenticated
 * @returns {Object} - Auth data with isAuthenticated, user, role, and loading properties
 */
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userType = localStorage.getItem('userType');
  
  let role = '';
  if (userType === 'admin') role = 'ADMIN';
  else if (userType === 'donor') role = 'DONOR';
  else if (userType === 'patient') role = 'PATIENT';

  return {
    isAuthenticated: !!token && !!user,
    user,
    role,
    loading: false,
  };
};

/**
 * Get current user
 * @returns {Object|null} - User object or null
 */
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || 'null');
};

export default {
  login,
  register,
  logout,
  checkAuth,
  getCurrentUser,
};