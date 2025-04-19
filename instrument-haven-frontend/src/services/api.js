import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure the Authorization header is properly set
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added token to request:', config.url);
    } else {
      console.log('No token available for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`Response from ${response.config.url}:`, response.status);
    
    // Check if the response is valid and has expected format
    if (response.data === null || response.data === undefined) {
      console.warn(`Empty response data from ${response.config.url}`);
      // Return a standardized empty response rather than null/undefined
      return {
        ...response,
        data: { status: 'success', data: [] }
      };
    }
    
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data, config } = error.response;
      console.error(`Error ${status} from ${config.url}:`, data);
      
      if (status === 401) {
        // Token expired or invalid
        console.warn('Authentication failed - clearing credentials');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login page...');
          window.location.href = '/login';
        }
      }
      
      if (status === 403) {
        // Permission denied
        console.error('Permission denied - insufficient privileges');
      }
      
      if (status === 422) {
        // Validation errors
        console.error('Validation errors:', data.errors || data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      toast.error('Network error. Please check your connection and try again.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    // Return the error so it can be caught and handled by the calling component
    return Promise.reject(error);
  }
);

// Auth API calls
const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/user'),
  // Since there's no specific endpoint for updating profile in the API documentation,
  // we'll need to create one on the backend. For now, we'll use a custom endpoint.
  updateProfile: (userData) => api.put('/auth/user/update', userData),
};

// Products API calls
const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/categories/${categoryId}`, { params: { include: 'products' } }),
  search: (query) => {
    // Support both string and object formats for search parameter
    const params = typeof query === 'string' ? { search: query } : query;
    return api.get('/products', { params });
  },
  create: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/admin/products/${id}`),
};

// Categories API calls
const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  // Simplified to fetch all categories, as the API doesn't specify parent categories
  getParentCategories: () => api.get('/categories'),
  // Admin routes for category management
  create: (data) => api.post('/admin/categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/admin/categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

// Wishlist API calls
const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { product_id: productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// Orders API calls
const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { cancel_reason: reason }),
};

// Reviews API calls
const reviewsAPI = {
  getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  update: (productId, reviewId, data) => api.put(`/products/${productId}/reviews/${reviewId}`, data),
  delete: (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`),
};

// Contact form
const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// Cart API calls
const cartAPI = {
  getItems: () => api.get('/cart'),
  addItem: (productId, quantity = 1) => api.post('/cart/items', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  applyCoupon: (code) => api.post('/cart/apply-coupon', { code }),
  removeCoupon: () => api.post('/cart/remove-coupon'),
};

// Admin APIs
const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
  getOrderStatistics: () => api.get('/admin/orders/statistics'),
  
  // Coupons
  getCoupons: (params) => api.get('/admin/coupons', { params }),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  
  // Admin Products - same as productsAPI but explicitly defined for clarity
  createProduct: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Admin Categories - same as categoriesAPI but explicitly defined for clarity
  createCategory: (data) => api.post('/admin/categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  wishlist: wishlistAPI,
  orders: ordersAPI,
  reviews: reviewsAPI,
  contact: contactAPI,
  cart: cartAPI,
  admin: adminAPI
};