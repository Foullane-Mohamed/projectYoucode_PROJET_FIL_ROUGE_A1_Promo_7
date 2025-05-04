import axios from 'axios';
import { getData } from '../utils/fileSystem';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(
  async (config) => {
    const token = getData('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
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
    return api.get('/products', { params });
  },
  getById: (id) => {
    return api.get(`/products/${id}`);
  },
  getByCategory: (categoryId) => {
    return api.get(`/categories/${categoryId}`);
  },
  search: (query) => {
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
  getAll: () => {
    return api.get('/wishlist');
  },
  add: (productId) => api.post('/wishlist', { product_id: productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};


const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/my'),
  create: (orderData) => api.post('/orders', orderData),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { cancel_reason: reason }),
};


const reviewsAPI = {
  getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
  create: (data) => api.post(`/products/${data.product_id}/reviews`, {
    rating: data.rating,
    comment: data.comment
  }),
  update: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
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
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
  getOrderStatistics: () => api.get('/admin/orders/statistics'),
  
  getCoupons: (params) => api.get('/admin/coupons', { params }),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  
  getProducts: (params) => api.get('/products', { params }),
  createProduct: (formData) => {
    return api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProduct: (id, formData) => {
    return api.post(`/admin/products/${id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  getCategories: (params) => {
    const defaultParams = {
      per_page: 10,
      page: 1
    };
    const mergedParams = { ...defaultParams, ...params };
    
    return api.get('/admin/categories', { params: mergedParams });
  },
  createCategory: (data) => {
    if (data instanceof FormData) {
      return api.post('/admin/categories', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/admin/categories', data);
  },
  updateCategory: (id, data) => {
    if (data instanceof FormData) {
      return api.post(`/admin/categories/${id}?_method=PUT`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/admin/categories/${id}`, data);
  },
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
};

export { api };

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