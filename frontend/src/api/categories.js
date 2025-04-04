import api from './index';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get a single category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get all categories with subcategories
  getCategoriesWithSubcategories: async () => {
    const response = await api.get('/categories-with-subcategories');
    return response.data;
  },

  // Get all subcategories
  getAllSubcategories: async () => {
    const response = await api.get('/subcategories');
    return response.data;
  },

  // Get a single subcategory by ID
  getSubcategoryById: async (id) => {
    const response = await api.get(`/subcategories/${id}`);
    return response.data;
  },

  // Get subcategories by category ID
  getSubcategoriesByCategory: async (categoryId) => {
    const response = await api.get(`/subcategories/category/${categoryId}`);
    return response.data;
  },

  // Get subcategories with products
  getSubcategoriesWithProducts: async () => {
    const response = await api.get('/subcategories-with-products');
    return response.data;
  }
};

export default categoryService;