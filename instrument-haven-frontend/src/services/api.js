import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});


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


api.interceptors.response.use(
  (response) => {
    if (response.data === null || response.data === undefined) {
      return {
        ...response,
        data: { status: 'success', data: [] }
      };
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection and try again.');
    }
    return Promise.reject(error);
  }
);


const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/user'),

  updateProfile: (userData) => api.put('/auth/user/update', userData),
};


const productsAPI = {
  getAll: (params) => {
    console.log('Getting all products with params:', params);
    return api.get('/products', { params });
  },
  getById: (id) => {
    console.log('Getting product by id:', id);
    return api.get(`/products/${id}`);
  },
  getByCategory: (categoryId) => {
    console.log('Getting products by category:', categoryId);
    return api.get(`/categories/${categoryId}`, { params: { include: 'products' } });
  },
  search: (query) => {

    const params = typeof query === 'string' ? { search: query } : query;
    console.log('Searching products with params:', params);
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


const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),

  getParentCategories: () => api.get('/categories'),

  create: (data) => api.post('/admin/categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/admin/categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};


const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { product_id: productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};


const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { cancel_reason: reason }),
};


const reviewsAPI = {
  getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  update: (productId, reviewId, data) => api.put(`/products/${productId}/reviews/${reviewId}`, data),
  delete: (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`),
};


const contactAPI = {
  send: (data) => api.post('/contact', data),
};


const cartAPI = {
  getItems: () => api.get('/cart'),
  addItem: (productId, quantity = 1) => api.post('/cart/items', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  applyCoupon: (code) => api.post('/cart/apply-coupon', { code }),
  removeCoupon: () => api.post('/cart/remove-coupon'),
};


const adminAPI = {

  getDashboard: () => api.get('/admin/dashboard'),
  

  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  

  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
  getOrderStatistics: () => api.get('/admin/orders/statistics'),
  

  getCoupons: (params) => api.get('/admin/coupons', { params }),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  

  createProduct: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  

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