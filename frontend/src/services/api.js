import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
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

// Authentication services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
};

export default api;