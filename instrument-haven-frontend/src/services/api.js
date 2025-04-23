import axios from 'axios';
import { toast } from 'react-toastify';

// Use environment variable or fallback to the base URL in the API documentation
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

// Log API URL during initialization to verify correct URL
console.log('API URL:', API_URL);


// Function to get CSRF token
async function getCsrfToken() {
  try {
    await axios.get(`${API_URL}/csrf-cookie`, {
      withCredentials: true
    });
    console.log('CSRF cookie requested');
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    toast.error('Failed to set up secure session. Please refresh the page.');
  }
}

// Call getCsrfToken on initial load
getCsrfToken();


api.interceptors.request.use(
  async (config) => {
    // For login/register requests, get a fresh CSRF token first
    if (
      (config.url === '/auth/login' || config.url === '/auth/register') &&
      (config.method === 'post' || config.method === 'POST')
    ) {
      await getCsrfToken();
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log request details when in development
    if (import.meta.env.DEV) {
      console.log(`Request: ${config.method.toUpperCase()} ${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    // Ensure we have a properly formatted response according to API documentation
    if (response.data === null || response.data === undefined) {
      return {
        ...response,
        data: { status: 'success', data: {} }
      };
    }
    return response;
  },
  (error) => {
    // Handle network errors (CORS issues often appear as network errors)
    if (!error.response) {
      console.error('Network Error:', error.message);
      toast.error('Network error. This could be due to CORS issues or server unavailability. Please check your connection and try again.');
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;
      
      // Log the error details for debugging
      console.error(`API Error (${status}):`, data);
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        toast.error('Access forbidden. You may not have permission to perform this action.');
      } else if (status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
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
    return api.get(`/categories/${categoryId}`);
  },
  search: (query) => {
    // Properly format search params according to API documentation
    const params = typeof query === 'string' ? { search: query } : query;
    console.log('Searching products with params:', params);
    return api.get('/products', { params });
  },
  // Admin operations
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
  // Dashboard statistics
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Users management
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  // Orders management
  getOrders: (params) => {
    console.log('Fetching admin orders with params:', params);
    return api.get('/admin/orders', { params })
      .then(response => {
        console.log('Admin orders response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Error fetching admin orders:', error.response?.data || error);
        throw error;
      });
  },
  updateOrder: (id, data) => {
    console.log(`Updating order ${id} with data:`, data);
    // Ensure status is a string and matches expected values
    if (data.status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(data.status)) {
        console.error(`Invalid status value: ${data.status}. Expected one of: ${validStatuses.join(', ')}`);
      }
    }
    return api.put(`/admin/orders/${id}`, data)
      .then(response => {
        console.log(`Order ${id} updated successfully:`, response.data);
        return response;
      })
      .catch(error => {
        console.error(`Error updating order ${id}:`, error.response?.data || error);
        throw error;
      });
  },
  getOrderStatistics: () => api.get('/admin/orders/statistics'),
  
  // Coupons management
  getCoupons: (params) => api.get('/admin/coupons', { params }),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  
  // Products management
  getProducts: (params) => api.get('/products', { params }), // Fallback to public endpoint
  createProduct: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Categories management
  getCategories: (params) => {
    const defaultParams = {
      per_page: 10,
      page: 1
    };
    const mergedParams = { ...defaultParams, ...params };
    
    return api.get('/admin/categories', { params: mergedParams })
      .catch(error => {
        console.warn('Admin categories endpoint failed, falling back to public endpoint', error);
        return api.get('/categories', { params: mergedParams });
      });
  },
  createCategory: (data) => {
    // If the data has files, use FormData
    if (data instanceof FormData) {
      return api.post('/admin/categories', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    // Otherwise, send as JSON
    return api.post('/admin/categories', data);
  },
  updateCategory: (id, data) => {
    // If the data has files, use FormData
    if (data instanceof FormData) {
      return api.put(`/admin/categories/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    // Otherwise, send as JSON
    return api.put(`/admin/categories/${id}`, data);
  },
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Tags are not supported in the backend
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