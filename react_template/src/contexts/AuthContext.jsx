import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token is valid and get user details
          const response = await userAPI.getCurrentUser();
          setCurrentUser({
            ...response.data,
            userType: localStorage.getItem('userType'),
            userId: parseInt(localStorage.getItem('userId'))
          });
        } catch (error) {
          // If token is invalid, clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          console.error("Authentication error:", error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const response = await authAPI.login(username, password);
      const { access_token, user_type, user_id } = response.data;
      
      // Store token and user info in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('userType', user_type);
      localStorage.setItem('userId', user_id);
      
      // Get user details
      const userResponse = await userAPI.getCurrentUser();
      setCurrentUser({
        ...userResponse.data,
        userType: user_type,
        userId: user_id
      });
      
      return user_type;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.detail || 'Login failed. Please try again.');
      throw error;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      await authAPI.register(userData);
      // After registration, login automatically
      return await login(userData.username, userData.password);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.detail || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);