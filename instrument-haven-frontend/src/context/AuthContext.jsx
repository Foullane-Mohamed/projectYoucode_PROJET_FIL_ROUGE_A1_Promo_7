import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // First try to load user from localStorage for immediate display
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
        }
      }
      
      // If we have a token, validate it by fetching fresh user data
      if (token) {
        try {
          const response = await api.auth.getProfile();
          console.log('Profile response:', response);
          
          // Extract user data from the correct location in the response
          const userData = response.data?.data?.user || response.data?.user || response.data;
          
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error('Invalid user data format in response');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Clear storage if authentication fails
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      console.log('Login response:', response);
      
      // The backend returns data in a nested structure
      // Extract the user and token from the correct location
      const userData = response.data?.data?.user || response.data?.user;
      const token = response.data?.data?.token || response.data?.token;
      
      if (!userData || !token) {
        console.error('Invalid response format:', response.data);
        return {
          success: false,
          message: 'Invalid response from server',
        };
      }
      
      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.auth.register(userData);
      console.log('Register response:', response);
      
      // Extract the user and token from the correct location
      const user = response.data?.data?.user || response.data?.user;
      const token = response.data?.data?.token || response.data?.token;
      
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
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors
      };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.auth.updateProfile(userData);
      console.log('Update profile response:', response);
      
      // Extract user data from the correct location in the response
      const updatedUser = response.data?.data?.user || response.data?.user;
      
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