import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

console.log('API URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});



async function getCsrfToken() {
  try {
    await axios.get(`${API_URL}/csrf-cookie`, {
      withCredentials: true
    });
  } catch (error) {
    toast.error('Failed to set up secure session. Please refresh the page.');
  }
}

getCsrfToken();


api.interceptors.request.use(
  async (config) => {
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
    
  
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data);
    if (response.data === null || response.data === undefined) {
      return {
        ...response,
        data: { status: 'success', data: {} }
      };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    if (!error.response) {
      toast.error('Network error. This could be due to CORS issues or server unavailability. Please check your connection and try again.');
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;
      
      
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
    console.log('Fetching wishlist data from:', `${API_URL}/wishlist`);
    return api.get('/wishlist').then(response => {
      console.log('Wishlist API response:', response);
      return response;
    }).catch(error => {
      console.error('Wishlist API error:', error.response || error.message);
      throw error;
    });
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
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  getOrders: (params) => {
    return api.get('/admin/orders', { params })
      .then(response => {
        return response;
      })
      .catch(error => {
        throw error;
      });
  },
  updateOrder: (id, data) => {
    if (data.status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    }
    return api.put(`/admin/orders/${id}`, data)
      .then(response => {
        return response;
      })
      .catch(error => {
        throw error;
      });
  },
  getOrderStatistics: () => api.get('/admin/orders/statistics'),
  
  getCoupons: (params) => api.get('/admin/coupons', { params }),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  
  getProducts: (params) => api.get('/products', { params }), // Fallback to public endpoint
  createProduct: (formData) => {
    // Log the FormData contents for debugging
    console.log('FormData contents for createProduct:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
    }
    
    return api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateProduct: (id, formData) => {
    // Log the FormData contents for debugging
    console.log('FormData contents for updateProduct:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
    }
    
    return api.put(`/admin/products/${id}`, formData, {
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
    
    return api.get('/admin/categories', { params: mergedParams })
      .catch(error => {
        return api.get('/categories', { params: mergedParams });
      });
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
      return api.put(`/admin/categories/${id}`, data, {
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