import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import EnhancedProductCard from '../../components/common/EnhancedProductCard';
import FeaturesRow from '../../components/common/FeaturesRow';
import '../../styles/features.css';
import { CircularProgress } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        try {
          const productsResponse = await api.products.getAll();
          
          if (productsResponse?.data?.status === 'success' && 
              productsResponse?.data?.data?.products) {
            setFeaturedProducts(productsResponse.data.data.products.slice(0, 8));
          } else {
            setFeaturedProducts([]);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          setFeaturedProducts([]);
        }
        
        // Fetch categories
        try {
          const categoriesResponse = await api.categories.getParentCategories();
          
          if (categoriesResponse?.data?.status === 'success' && 
              categoriesResponse?.data?.data?.categories) {
            setCategories(categoriesResponse.data.data.categories);
          } else {
            setCategories([]);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setCategories([]);
        }
        
        // Fetch testimonials
        try {
          // When API route is implemented:
          const testimonialsResponse = await api.testimonials.getAll();
          if (testimonialsResponse?.data?.status === 'success' && 
              testimonialsResponse?.data?.data?.testimonials) {
            setTestimonials(testimonialsResponse.data.data.testimonials);
          } else {
            setTestimonials([]);
          }
        } catch (error) {
          console.error('Error fetching testimonials:', error);
          setTestimonials([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroSection = () => (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gradient-to-br from-pink-400 to-red-500 flex items-center mb-4 md:rounded-2xl md:mx-2 md:mt-2">
      <div className="absolute inset-0 bg-black bg-opacity-15 z-10"></div>
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mx-2">
          <div className="md:col-span-7">
            <div className="text-white drop-shadow-md">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight -tracking-wide">
                Discover Your Sound
              </h1>
              <p className="text-xl mb-8 max-w-xl leading-relaxed">
                Premium musical instruments for every musician, from beginner to professional.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="px-8 py-3 bg-red-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-red-600 transition-all"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/categories" 
                  className="px-8 py-3 bg-white text-pink-500 rounded-full text-lg font-bold shadow-lg hover:opacity-90 transition-all"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:col-span-5">
            <div className="mt-4 flex flex-col gap-4">
              <div className="p-4 bg-white bg-opacity-90 rounded-lg border-l-4 border-red-500 shadow-md">
                <h3 className="text-lg font-bold text-red-500">
                  Special Offer
                </h3>
                <p className="font-medium">
                  Get 10% off your first purchase with code <strong>WELCOME10</strong>
                </p>
              </div>
              
              <div className="p-4 bg-white bg-opacity-90 rounded-lg border-l-4 border-pink-500 shadow-md">
                <h3 className="text-lg font-bold text-pink-500">
                  Free Shipping
                </h3>
                <p className="font-medium">
                  On all orders over $100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const categorySection = () => (
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 relative">
          <span className="absolute h-2 w-1/2 bottom-0 left-0 bg-pink-300 bg-opacity-50 -z-10"></span>
          Shop by Category
        </h2>
        <Link 
          to="/categories" 
          className="text-pink-500 font-medium hover:bg-pink-50 flex items-center gap-1 px-2 py-1 rounded-md"
        >
          View All
          <ArrowForwardIcon fontSize="small" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
        {categories.slice(0, isSmallScreen ? 4 : 8).map((category) => (
          <Link
            to={`/categories/${category.id}`}
            key={category.id}
            className="h-full flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 no-underline text-inherit relative"
          >
            <div className={`p-4 bg-${category.id % 2 === 0 ? 'red' : 'pink'}-${400 + (category.id % 3) * 100} relative`}>
              <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white bg-opacity-10"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white bg-opacity-10"></div>
              <h3 className="text-white text-lg font-semibold z-10 relative">
                {category.name}
              </h3>
            </div>
            <div className="bg-white p-4 flex-grow">
              <p className="text-sm text-gray-600 mb-2">
                {category.description}
              </p>
              <span className="text-pink-500 font-normal hover:bg-pink-50 text-sm">
                View
              </span>
            </div>
            <div className="absolute top-2 left-2 w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center text-xs font-bold text-pink-500">
              {category.id}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-right mt-4">
        <Link 
          to="/categories" 
          className="text-pink-500 font-medium hover:bg-pink-50 text-sm flex items-center gap-1 justify-end px-2 py-1 rounded-md inline-flex"
        >
          View All Categories
          <ArrowForwardIcon fontSize="small" />
        </Link>
      </div>
    </div>
  );

  const featuredProductsSection = () => (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold relative">
              <span className="absolute h-2 w-2/5 bottom-0 left-0 bg-red-300 bg-opacity-30 -z-10"></span>
              Hot Deals
            </h2>
            <p className="text-gray-600 mt-2">
              Limited time offers on popular instruments
            </p>
          </div>
          <Link 
            to="/products" 
            className="text-red-500 font-medium hover:bg-red-50 flex items-center gap-1 px-2 py-1 rounded-md"
          >
            View All
            <ArrowForwardIcon fontSize="small" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 px-4 mb-12 mx-auto max-w-7xl">
          {featuredProducts.map((product) => (
            <div key={product.id} className="flex">
              <EnhancedProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-6 mt-12 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Exclusive Online Discounts
            </h3>
            <p className="text-gray-600 mt-2">
              Get extra 15% off your first purchase with code <span className="font-bold text-red-500">WELCOME15</span>
            </p>
          </div>
          <Link 
            to="/products" 
            className="rounded-full px-8 py-3 bg-red-500 text-white font-bold min-w-[200px] text-center hover:bg-red-600 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );

  const testimonialsSection = () => (
    <div className="py-16 bg-white mt-8 md:mx-2 md:rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read testimonials from musicians who love our instruments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="p-8 h-full flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(testimonial.rating) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="italic text-gray-700 mb-6 flex-grow leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full mr-4 overflow-hidden bg-gray-200">
                    <img
                      src={testimonial.avatar ? `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${testimonial.avatar}` : '/images/avatar-placeholder.jpg'}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-xl text-gray-500">
                No testimonials available yet. Be the first one to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const featuresSection = () => (
    <FeaturesRow />
  );



  const ctaSection = () => (
    <div className="py-16 bg-gradient-to-br from-red-500 to-pink-400 text-white mt-16 relative overflow-hidden md:mx-2 md:mb-2 md:rounded-2xl">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white bg-opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white bg-opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/3 z-0"></div>
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">
              Find Your Perfect Sound Today
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-xl">
              Join thousands of musicians who trust Instrument Haven for quality instruments and exceptional service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="px-8 py-3 rounded-full text-base font-bold bg-white text-red-500 shadow-lg hover:bg-white hover:bg-opacity-90 inline-block transition-all"
              >
                Shop Now
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 rounded-full text-lg font-bold border-2 border-white text-white hover:border-white hover:bg-white hover:bg-opacity-10 inline-block transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:col-span-4">
            <img 
              src="/cta-image.png" 
              alt="Musical instruments" 
              className="w-full max-w-[300px] mx-auto block"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {heroSection()}
      {categories.length > 0 && categorySection()}
      {featuredProducts.length > 0 && featuredProductsSection()}
      {testimonials.length > 0 && testimonialsSection()}
      {featuresSection()}
      {ctaSection()}
    </div>
  );
};

export default Home;