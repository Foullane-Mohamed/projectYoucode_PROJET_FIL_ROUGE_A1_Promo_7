import api from './index';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get latest products (for homepage)
  getLatestProducts: async (limit = 8) => {
    const response = await api.get(`/products/latest?limit=${limit}`);
    return response.data;
  },

  // Search products by term
  searchProducts: async (term) => {
    const response = await api.get(`/products/search?term=${term}`);
    return response.data;
  },

  // Get products by subcategory
  getProductsBySubcategory: async (subcategoryId) => {
    const response = await api.get(`/products/subcategory/${subcategoryId}`);
    return response.data;
  },

  // Get products by price range
  getProductsByPriceRange: async (min, max) => {
    const response = await api.get(`/products/price-range?min=${min}&max=${max}`);
    return response.data;
  },

  // Get product comments/reviews
  getProductComments: async (productId) => {
    const response = await api.get(`/comments/product/${productId}`);
    return response.data;
  },

  // Add product comment/review
  addProductComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Get product rating
  getProductRating: async (productId) => {
    const response = await api.get(`/comments/product/${productId}/rating`);
    return response.data;
  }
};

export default productService;