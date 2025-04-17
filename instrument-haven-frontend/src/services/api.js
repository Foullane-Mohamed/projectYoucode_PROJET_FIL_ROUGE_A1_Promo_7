import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status } = error.response;
      
      if (status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      if (status === 403) {
        // Permission denied
        console.error('Permission denied');
      }
      
      if (status === 422) {
        // Validation errors
        console.error('Validation errors:', error.response.data.errors);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getProfile: () => api.get('/profile'),
  updateProfile: (userData) => api.put('/profile', userData),
};

// Products API calls
const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getByTag: (tagId) => api.get(`/products/tag/${tagId}`),
  search: (query) => api.get('/search', { params: { query } }),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => {
    formData.append('_method', 'PUT');
    return api.post(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories API calls
const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getParentCategories: () => api.get('/parent-categories'),
  getSubcategories: (id) => api.get(`/categories/${id}/subcategories`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Tags API calls
const tagsAPI = {
  getAll: () => api.get('/tags'),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// Wishlist API calls
const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { product_id: productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// Orders API calls
const ordersAPI = {
  getAllAdmin: () => api.get('/orders'),
  getMyOrders: () => api.get('/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
};

// Coupons API calls
const couponsAPI = {
  getAll: () => api.get('/coupons'),
  getById: (id) => api.get(`/coupons/${id}`),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
  validate: (code) => api.post('/validate-coupon', { code }),
};

// Contact form
const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// Users API (for admin)
const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  tags: tagsAPI,
  wishlist: wishlistAPI,
  orders: ordersAPI,
  coupons: couponsAPI,
  contact: contactAPI,
  users: usersAPI,
};