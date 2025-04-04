import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../api/products';
import { categoryService } from '../api/categories';
import Breadcrumb from '../components/common/Breadcrumb';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import ProductCard from '../components/common/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    const category = queryParams.get('category');
    const subcategory = queryParams.get('subcategory');
    const search = queryParams.get('search');
    const min = queryParams.get('min');
    const max = queryParams.get('max');
    const sort = queryParams.get('sort');
    
    if (category) setSelectedCategory(Number(category));
    if (subcategory) setSelectedSubcategory(Number(subcategory));
    if (search) setSearchTerm(search);
    if (min) setMinPrice(min);
    if (max) setMaxPrice(max);
    if (sort) setSortBy(sort);
  }, [location.search]);
  
  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategoriesWithSubcategories();
        if (response.status === 'success') {
          setCategories(response.data);
          
          // Flatten all subcategories
          const allSubcategories = response.data.reduce((acc, category) => {
            if (category.subcategories && category.subcategories.length > 0) {
              return [...acc, ...category.subcategories];
            }
            return acc;
          }, []);
          
          setSubcategories(allSubcategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let productsData = [];
        
        // Handle different filter scenarios
        if (searchTerm) {
          // Search by term
          const response = await productService.searchProducts(searchTerm);
          if (response.status === 'success') {
            productsData = response.data;
          }
        } else if (selectedSubcategory) {
          // Filter by subcategory
          const response = await productService.getProductsBySubcategory(selectedSubcategory);
          if (response.status === 'success') {
            productsData = response.data;
          }
        } else if (minPrice && maxPrice) {
          // Filter by price range
          const response = await productService.getProductsByPriceRange(minPrice, maxPrice);
          if (response.status === 'success') {
            productsData = response.data;
          }
        } else {
          // Get all products
          const response = await productService.getAllProducts();
          if (response.status === 'success') {
            productsData = response.data;
          }
        }
        
        // Filter by category if needed
        if (selectedCategory && !selectedSubcategory) {
          // Find subcategories for this category
          const categorySubcategories = categories.find(
            cat => cat.id === selectedCategory
          )?.subcategories || [];
          
          // Filter products by these subcategories
          productsData = productsData.filter(product => 
            categorySubcategories.some(subcat => subcat.id === product.subcategory_id)
          );
        }
        
        // Sort products
        switch (sortBy) {
          case 'price-low-high':
            productsData.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            productsData.sort((a, b) => b.price - a.price);
            break;
          case 'name-a-z':
            productsData.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-z-a':
            productsData.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'latest':
          default:
            productsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        }
        
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, minPrice, maxPrice, searchTerm, sortBy, categories]);
  
  // Update URL with filters
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedSubcategory) queryParams.set('subcategory', selectedSubcategory);
    if (searchTerm) queryParams.set('search', searchTerm);
    if (minPrice) queryParams.set('min', minPrice);
    if (maxPrice) queryParams.set('max', maxPrice);
    if (sortBy && sortBy !== 'latest') queryParams.set('sort', sortBy);
    
    navigate(`/products?${queryParams.toString()}`, { replace: true });
  }, [selectedCategory, selectedSubcategory, minPrice, maxPrice, searchTerm, sortBy, navigate]);
  
  // Handle filter changes
  const handleCategoryChange = (e) => {
    const categoryId = Number(e.target.value) || null;
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when category changes
  };
  
  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(Number(e.target.value) || null);
  };
  
  const handlePriceFilter = (e) => {
    e.preventDefault();
    // Price filter is applied through the useEffect
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is applied through the useEffect
  };
  
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSortBy('latest');
  };
  
  // Get filtered subcategories based on selected category
  const filteredSubcategories = selectedCategory
    ? subcategories.filter(subcat => subcat.category_id === selectedCategory)
    : subcategories;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Products', path: '/products' },
        ]} 
        className="mb-8"
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Search</h2>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-indigo-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                id="subcategory"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedSubcategory || ''}
                onChange={handleSubcategoryChange}
                disabled={!selectedCategory}
              >
                <option value="">All Subcategories</option>
                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Price Range</h2>
            <form onSubmit={handlePriceFilter}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    step="1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    min="0"
                    step="1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Apply Filter
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={handleClearFilters}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="lg:w-3/4">
          {/* Sort and count bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 mb-3 sm:mb-0">
              Showing <span className="font-medium">{products.length}</span> products
            </p>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
              <select
                id="sort"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="latest">Latest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>
          
          {/* Products grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error" message={error} />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;