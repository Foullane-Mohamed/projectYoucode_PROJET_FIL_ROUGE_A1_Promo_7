import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Skeleton,
  useMediaQuery,
  Chip,
  Rating
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Discount,
  LocalShipping,
  Star
} from '@mui/icons-material';
// Using MUI components instead of external carousel
import FeaturesRow from '../../components/common/FeaturesRow';
import EnhancedProductCard from '../../components/common/EnhancedProductCard';
import { CATEGORY_IMAGES } from '../../components/common/constants';

// Create a custom styles object
const styles = {
  heroSection: {
    position: 'relative',
    height: { xs: '60vh', md: '70vh' },
    minHeight: { xs: '400px', sm: '500px', md: '600px' },
    overflow: 'hidden',
    borderRadius: '20px',
    mb: 6,
    mt: 2,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center'
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    px: { xs: 3, md: 6 },
    py: { xs: 4, md: 8 },
    maxWidth: '600px'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: 0
  },
  heroTitle: {
    fontWeight: 800,
    color: 'white',
    mb: 2,
    textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
  },
  heroSubtitle: {
    color: 'white',
    mb: 3,
    fontWeight: 400,
    textShadow: '0px 1px 2px rgba(0,0,0,0.3)',
    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
    lineHeight: 1.6
  },
  ctaButton: {
    borderRadius: '30px',
    py: 1.5,
    px: 4,
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 4px 8px rgba(255, 43, 82, 0.3)',
    backgroundColor: '#FF2B52',
    '&:hover': {
      backgroundColor: '#e01641',
      boxShadow: '0 6px 10px rgba(255, 43, 82, 0.4)'
    }
  },
  secondaryButton: {
    borderRadius: '30px',
    borderColor: 'white',
    color: 'white',
    py: 1.5,
    px: 4,
    fontWeight: 'bold',
    fontSize: '1rem',
    ml: 2,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'white'
    }
  },
  sectionTitle: {
    fontWeight: 700,
    color: '#333',
    position: 'relative',
    mb: 1,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: 0,
      width: '60px',
      height: '4px',
      backgroundColor: '#FF2B52',
      borderRadius: '2px'
    }
  },
  sectionSubtitle: {
    color: '#666',
    mb: 4,
    mt: 2
  },
  categoryCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    height: '100%',
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.12)'
    }
  },
  categoryImage: {
    height: 180,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)'
    }
  },
  categoryTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    color: 'white',
    padding: '20px',
    fontWeight: 700,
    zIndex: 2,
    textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
  },
  categoryText: {
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  featureSection: {
    my: 8,
    py: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: '20px'
  },

  saleCard: {
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)'
  },

  sectionDivider: {
    my: 8
  }
};

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  
  const heroSlides = [
    {
      image: '/images/hero/hero-slide1.jpg',
      title: 'Find Your Perfect Sound',
      subtitle: 'Discover premium quality instruments for musicians of all levels',
      primaryAction: 'Shop Now',
      secondaryAction: 'Learn More'
    },
    {
      image: '/images/hero/hero-slide2.jpg',
      title: 'Special Discounts',
      subtitle: 'Amazing deals on selected guitars, pianos, and other instruments',
      primaryAction: 'View Deals',
      secondaryAction: 'See All'
    },
    {
      image: '/images/hero/hero-slide3.jpg',
      title: 'Professional Quality',
      subtitle: 'Expert-curated collection of instruments for the discerning musician',
      primaryAction: 'Browse Collection',
      secondaryAction: 'Contact Us'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleChangeSlide = (index) => {
    setActiveSlide(index);
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <Box sx={{ position: 'relative', ...styles.heroSection }}>
      {/* Main Slide */}
      <img src={currentSlide.image} alt={currentSlide.title} style={styles.heroImage} />
      <Box sx={styles.heroOverlay} />
      <Box sx={styles.heroContent}>
        <Typography variant="h2" component="h1" sx={styles.heroTitle}>
          {currentSlide.title}
        </Typography>
        <Typography variant="h6" sx={styles.heroSubtitle}>
          {currentSlide.subtitle}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={styles.ctaButton}
            onClick={() => navigate('/products')}
          >
            {currentSlide.primaryAction}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={styles.secondaryButton}
            onClick={() => navigate('/categories')}
          >
            {currentSlide.secondaryAction}
          </Button>
        </Box>
      </Box>
      
      {/* Carousel Navigation */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        position: 'absolute', 
        bottom: 20, 
        width: '100%',
        zIndex: 3 
      }}>
        {heroSlides.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleChangeSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              margin: '0 6px',
              cursor: 'pointer',
              backgroundColor: index === activeSlide ? '#FF2B52' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: index === activeSlide ? '#FF2B52' : 'rgba(255,255,255,0.8)'
              }
            }}
          />
        ))}
      </Box>
      
      {/* Navigation Arrows */}
      <IconButton
        sx={{
          position: 'absolute',
          left: { xs: 10, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
          zIndex: 2
        }}
        onClick={() => setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        sx={{
          position: 'absolute',
          right: { xs: 10, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
          zIndex: 2
        }}
        onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State for API data
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Ref for scrolling
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await apiService.categories.getAll();
        const categoriesData = categoriesResponse.data?.data?.categories || categoriesResponse.data?.categories || [];
        setCategories(categoriesData.slice(0, 6)); // Limit to 6 categories

        // Fetch featured products (products marked as featured)
        const featuredResponse = await apiService.products.getAll({ featured: true, per_page: 8 });
        const featuredData = featuredResponse.data?.data?.products || featuredResponse.data?.products || [];
        setFeaturedProducts(featuredData);

        // Fetch sale products
        const saleResponse = await apiService.products.getAll({ on_sale: true, per_page: 8 });
        const saleData = saleResponse.data?.data?.products || saleResponse.data?.products || [];
        setSaleProducts(saleData);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Helper function to get a valid category image
  const getCategoryImage = (category) => {
    if (!category || !category.name) return CATEGORY_IMAGES.default;
    
    const lowerName = category.name.toLowerCase();
    
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
      if (lowerName.includes(key)) {
        return url;
      }
    }
    
    return CATEGORY_IMAGES.default;
  };



  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Carousel */}
      <Container maxWidth="xl">
        <HeroCarousel />
      </Container>

      {/* Search Bar */}
      <Container maxWidth="md" sx={{ mb: 8, mt: -3 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: '40px',
            overflow: 'hidden',
            display: 'flex',
            p: 1,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex' }}>
            <TextField
              fullWidth
              placeholder="Search for instruments, brands, categories..."
              variant="standard"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ ml: 2, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { px: 1, py: 1 }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '30px',
                px: 4,
                backgroundColor: '#FF2B52',
                '&:hover': {
                  backgroundColor: '#e01641'
                }
              }}
            >
              Search
            </Button>
          </form>
        </Paper>
      </Container>

      {/* Categories Section */}
      <Container maxWidth="xl" ref={categoriesRef}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" sx={styles.sectionTitle}>
            Browse Categories
          </Typography>
          <Typography variant="subtitle1" sx={styles.sectionSubtitle}>
            Explore our wide range of musical instruments and equipment
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {loading ? (
            // Skeleton loading for categories
            Array(6).fill(0).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`category-skeleton-${index}`}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '16px', mb: 1 }} />
                <Skeleton width="60%" height={24} />
              </Grid>
            ))
          ) : (
            // Actual categories
            categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card 
                  sx={styles.categoryCard}
                  onClick={() => navigate(`/categories/${category.id}`)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={getCategoryImage(category)}
                      alt={category.name}
                      sx={styles.categoryImage}
                    />
                    <Typography variant="h6" component="h3" sx={styles.categoryTitle}>
                      {category.name}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {category.description ? 
                        (category.description.length > 100 ? 
                          `${category.description.substring(0, 100)}...` : 
                          category.description) : 
                        `Explore our collection of ${category.name.toLowerCase()}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/categories')}
            sx={{
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              borderColor: '#FF2B52',
              color: '#FF2B52',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#e01641',
                backgroundColor: 'rgba(255, 43, 82, 0.04)'
              }
            }}
          >
            View All Categories
          </Button>
        </Box>
      </Container>

      {/* Features Row */}
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <FeaturesRow />
      </Container>

      {/* Featured Products Section */}
      <Container maxWidth="xl" sx={{ mt: 8 }} ref={featuredRef}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" sx={styles.sectionTitle}>
            Featured Products
          </Typography>
          <Typography variant="subtitle1" sx={styles.sectionSubtitle}>
            Handpicked by our music experts
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {loading ? (
            // Skeleton loading for products
            Array(8).fill(0).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`featured-skeleton-${index}`}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px', mb: 1 }} />
                <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                <Skeleton width="30%" height={20} />
              </Grid>
            ))
          ) : featuredProducts.length > 0 ? (
            // Actual featured products
            featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <EnhancedProductCard product={product} />
              </Grid>
            ))
          ) : (
            // Display a message if no featured products
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center" sx={{ py: 4, color: '#666' }}>
                Featured products coming soon!
              </Typography>
            </Grid>
          )}
        </Grid>

        {featuredProducts.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/products?featured=true')}
              sx={{
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                borderColor: '#FF2B52',
                color: '#FF2B52',
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: '#e01641',
                  backgroundColor: 'rgba(255, 43, 82, 0.04)'
                }
              }}
            >
              View All Featured Products
            </Button>
          </Box>
        )}
      </Container>


    </Box>
  );
};

export default Home;