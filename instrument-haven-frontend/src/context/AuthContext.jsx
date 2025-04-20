import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // First set user from localStorage for immediate UI update
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
        }
      }
      
      // Then verify and update user data from the API
      if (token) {
        try {
          const response = await api.auth.getProfile();
          
          // According to API documentation, user data is in response.data.data.user
          const userData = response.data?.data?.user || response.data?.user;
          
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error('Invalid user data format in response');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Clear auth data if profile fetch fails
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Function to get CSRF token
  const getCsrfToken = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      await axios.get(`${API_URL}/csrf-cookie`, {
        withCredentials: true
      });
      console.log('CSRF cookie set for auth context');
      return true;
    } catch (error) {
      console.error('Error getting CSRF token in AuthContext:', error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      // Request CSRF cookie first
      await getCsrfToken();
      
      const response = await api.auth.login({ email, password });
      
      // According to API documentation format
      const userData = response.data?.data?.user;
      const token = response.data?.data?.token;
      
      if (!userData || !token) {
        console.error('Invalid response format:', response.data);
        return {
          success: false,
          message: 'Invalid response from server',
        };
      }
      
      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { 
        success: true, 
        user: userData, 
        message: response.data?.message || 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 419) {
        return {
          success: false,
          message: 'CSRF token mismatch. Please refresh the page and try again.',
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials',
      };
    }
  };

  const register = async (userData) => {
    try {
      // Request CSRF cookie first
      await getCsrfToken();
      
      const response = await api.auth.register(userData);
      
      // According to API documentation format
      const user = response.data?.data?.user;
      const token = response.data?.data?.token;
      
      if (!user || !token) {
        console.error('Invalid register response format:', response.data);
        return {
          success: false,
          message: 'Invalid response from server',
        };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { 
        success: true, 
        user,
        message: response.data?.message || 'User registered successfully'
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 419) {
        return {
          success: false,
          message: 'CSRF token mismatch. Please refresh the page and try again.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Validation error',
        errors: error.response?.data?.errors
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout API endpoint as per documentation
      const response = await api.auth.logout();
      if (response.data?.status === 'success') {
        // API call successful
        console.log('Logged out successfully on server');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // Always clean up local storage and state, even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.auth.updateProfile(userData);
      
      // According to API documentation format
      const updatedUser = response.data?.data?.user;
      
      if (!updatedUser) {
        console.error('Invalid update profile response format:', response.data);
        return {
          success: false,
          message: 'Invalid response from server',
        };
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { 
        success: true, 
        user: updatedUser, 
        message: response.data?.message || 'Profile updated successfully' 
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
        errors: error.response?.data?.errors
      };
    }
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};