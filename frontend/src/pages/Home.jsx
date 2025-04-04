import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../api/products';
import { categoryService } from '../api/categories';
import Spinner from '../components/common/Spinner';
import ProductCard from '../components/common/ProductCard';
import Alert from '../components/common/Alert';

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch latest products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getLatestProducts(8),
          categoryService.getCategoriesWithSubcategories(),
        ]);

        if (productsResponse.status === 'success') {
          setLatestProducts(productsResponse.data);
        }

        if (categoriesResponse.status === 'success') {
          setCategories(categoriesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Instrument</h1>
              <p className="text-xl mb-8">
                Discover a wide range of high-quality musical instruments for musicians of all levels.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Browse Products
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-indigo-600 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="/images/hero-instrument.jpg"
                alt="Musical instruments"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error" message={error} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <div key={category.id} className="relative group overflow-hidden rounded-lg shadow-md">
                  <img
                    src={category.image ? `/storage/${category.image}` : '/images/category-placeholder.jpg'}
                    alt={category.name}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                      <Link
                        to={`/products?category=${category.id}`}
                        className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-600 hover:text-white transition-colors duration-200"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link
    to="/products"
    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200"
  >
    View All Categories
  </Link>
</div>
</div>
</section>

{/* Latest Products */}
<section className="py-16">
<div className="container mx-auto px-4">
<h2 className="text-3xl font-bold text-center mb-12">Latest Products</h2>

{loading ? (
  <div className="flex justify-center">
    <Spinner size="lg" />
  </div>
) : error ? (
  <Alert variant="error" message={error} />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {latestProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

<div className="text-center mt-10">
  <Link
    to="/products"
    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200"
  >
    View All Products
  </Link>
</div>
</div>
</section>

{/* Why Choose Us */}
<section className="py-16 bg-gray-50">
<div className="container mx-auto px-4">
<h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-indigo-100 rounded-full text-indigo-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold mb-3">Quality Products</h3>
    <p className="text-gray-600">We offer a wide selection of high-quality musical instruments from trusted brands.</p>
  </div>
  
  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-indigo-100 rounded-full text-indigo-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold mb-3">Competitive Prices</h3>
    <p className="text-gray-600">Get the best value for your money with our competitive pricing and special offers.</p>
  </div>
  
  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-indigo-100 rounded-full text-indigo-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
    <p className="text-gray-600">Get expert advice and support from our team of passionate musicians.</p>
  </div>
</div>
</div>
</section>

{/* Newsletter Subscription */}
<section className="py-16 bg-indigo-600 text-white">
<div className="container mx-auto px-4">
<div className="max-w-3xl mx-auto text-center">
  <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
  <p className="text-xl mb-8">Subscribe to our newsletter for the latest products, special offers, and music tips.</p>
  
  <form className="flex flex-col sm:flex-row gap-4">
    <input
      type="email"
      placeholder="Your email address"
      className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
      required
    />
    <button
      type="submit"
      className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
    >
      Subscribe
    </button>
  </form>
  
  <p className="mt-4 text-sm text-indigo-200">
    We respect your privacy. Unsubscribe at any time.
  </p>
</div>
</div>
</section>
</div>
);
};

export default Home;