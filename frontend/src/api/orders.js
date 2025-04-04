import api from './index';

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await api.get('/user/orders');
    return response.data;
  },

  // Get order details by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get active payment methods
  getActivePaymentMethods: async () => {
    const response = await api.get('/payment-methods/active');
    return response.data;
  }
};

export default orderService;