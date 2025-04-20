import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
  Rating,
  Chip,
  Avatar
} from '@mui/material';
import { 
  MusicNote as MusicNoteIcon, 
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Sample images for better display
const CATEGORY_IMAGES = {
  'Guitars': '/guitars.jpg',
  'Drums': '/drums.jpg',
  'Keyboards': '/keyboards.jpg',
  'Wind Instruments': '/wind.jpg',
  'Accessories': '/accessories.jpg',
  'Electric Guitars': '/electric-guitars.jpg',
  'Acoustic Guitars': '/acoustic-guitars.jpg',
  'Bass Guitars': '/bass-guitars.jpg',
  'Acoustic Drums': '/acoustic-drums.jpg',
  'Electronic Drums': '/electronic-drums.jpg',
  'Digital Pianos': '/digital-pianos.jpg',
  'Synthesizers': '/synthesizers.jpg'
};

// Sample data in case the API fails
const SAMPLE_CATEGORIES = [
  { id: 1, name: 'Guitars', description: 'All types of guitars' },
  { id: 2, name: 'Drums', description: 'Acoustic and electronic drums' },
  { id: 3, name: 'Keyboards', description: 'Electronic keyboards and pianos' },
  { id: 4, name: 'Wind Instruments', description: 'All types of wind instruments' },
  { id: 5, name: 'Accessories', description: 'Accessories for all instruments' },
  { id: 6, name: 'Electric Guitars', description: 'Electric guitars for all styles' },
  { id: 7, name: 'Acoustic Guitars', description: 'Classical and acoustic guitars' },
  { id: 8, name: 'Bass Guitars', description: 'Electric and acoustic bass guitars' },
  { id: 9, name: 'Acoustic Drums', description: 'Traditional acoustic drum sets' },
  { id: 10, name: 'Electronic Drums', description: 'Digital and electronic drum kits' },
  { id: 11, name: 'Digital Pianos', description: 'Digital pianos with weighted keys' },
  { id: 12, name: 'Synthesizers', description: 'Analog and digital synthesizers' }
];

const FEATURED_INSTRUMENTS = [
  {
    id: 1,
    name: "Fender Stratocaster",
    price: 799.99,
    thumbnail: "fender-strat.jpg",
    rating: 4.8,
    on_sale: true,
    sale_price: 699.99,
    stock: 12
  },
  {
    id: 2,
    name: "Gibson Les Paul",
    price: 1299.99,
    thumbnail: "gibson-les-paul.jpg",
    rating: 4.9,
    on_sale: false,
    stock: 8
  },
  {
    id: 3,
    name: "Roland TD-17KVX",
    price: 1699.99,
    thumbnail: "roland-drums.jpg",
    rating: 4.7,
    on_sale: true,
    sale_price: 1499.99,
    stock: 5
  },
  {
    id: 4,
    name: "Yamaha P-125",
    price: 649.99,
    thumbnail: "yamaha-p125.jpg",
    rating: 4.6,
    on_sale: false,
    stock: 15
  },
  {
    id: 5,
    name: "Martin D-28",
    price: 2999.99,
    thumbnail: "martin-d28.jpg",
    rating: 4.9,
    on_sale: false,
    stock: 3
  },
  {
    id: 6,
    name: "Fender Precision Bass",
    price: 899.99,
    thumbnail: "fender-pbass.jpg",
    rating: 4.7,
    on_sale: true,
    sale_price: 799.99,
    stock: 7
  },
  {
    id: 7,
    name: "Pearl Export",
    price: 699.99,
    thumbnail: "pearl-export.jpg",
    rating: 4.5,
    on_sale: false,
    stock: 4
  },
  {
    id: 8,
    name: "Korg Minilogue",
    price: 499.99,
    thumbnail: "korg-minilogue.jpg",
    rating: 4.8,
    on_sale: false,
    stock: 10
  }
];

// Testimonials from happy customers
const TESTIMONIALS = [
  {
    id: 1,
    name: "David Johnson",
    role: "Professional Guitarist",
    comment: "The quality of instruments at Instrument Haven is outstanding. I've been buying my gear here for years and have never been disappointed.",
    avatar: "avatar1.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Music Teacher",
    comment: "As a music educator, I always recommend Instrument Haven to my students. Great selection, great prices, and fantastic customer service.",
    avatar: "avatar2.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Studio Producer",
    comment: "I've equipped my entire studio with instruments from Instrument Haven. Their quality and reliability are exactly what professionals need.",
    avatar: "avatar3.jpg",
    rating: 4.5
  }
];

// Featured brands
const FEATURED_BRANDS = [
  "fender.png", "gibson.png", "yamaha.png", "roland.png", 
  "korg.png", "martin.png", "pearl.png", "ibanez.png"
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        try {
          const productsResponse = await api.products.getAll();
          
          // Properly extract products from the response structure
          if (productsResponse && productsResponse.data && 
              productsResponse.data.status === 'success' && 
              productsResponse.data.data && 
              productsResponse.data.data.products) {
            // Extract products array from the nested structure
            setFeaturedProducts(productsResponse.data.data.products.slice(0, 8));
          } else {
            console.warn('Using sample product data due to API response format');
            setFeaturedProducts(FEATURED_INSTRUMENTS);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          setFeaturedProducts(FEATURED_INSTRUMENTS);
        }
        
        // Fetch categories
        try {
          const categoriesResponse = await api.categories.getParentCategories();
          
          // Properly extract categories from the response structure
          if (categoriesResponse && categoriesResponse.data && 
              categoriesResponse.data.status === 'success' && 
              categoriesResponse.data.data && 
              categoriesResponse.data.data.categories) {
            // Extract categories array from the nested structure
            setCategories(categoriesResponse.data.data.categories);
          } else {
            console.warn('Using sample category data due to API response format');
            setCategories(SAMPLE_CATEGORIES);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setCategories(SAMPLE_CATEGORIES);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
        setFeaturedProducts(FEATURED_INSTRUMENTS);
        setCategories(SAMPLE_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroSection = () => (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '70vh' },
        overflow: 'hidden',
        backgroundImage: 'url(/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        mb: 6,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 1,
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{ color: 'white', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Discover Your Sound
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ mb: 4, maxWidth: '600px', lineHeight: 1.5 }}
              >
                Premium musical instruments for every musician, from beginner to professional.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  component={Link} 
                  to="/products" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.2,
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  Shop Now
                </Button>
                <Button 
                  component={Link} 
                  to="/categories" 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.2,
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    border: '2px solid',
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'primary.light',
                      backgroundColor: 'rgba(255,255,255,0.05)'
                    }
                  }}
                >
                  Browse Categories
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              sx={{ 
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {/* Special offers cards */}
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  Special Offer
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Get 10% off your first purchase with code <b>WELCOME10</b>
                </Typography>
              </Paper>
              
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderLeft: '4px solid',
                  borderColor: 'secondary.main',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                  Free Shipping
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  On all orders over $100
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  const categorySection = () => (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          sx={{ fontWeight: 'bold' }}
        >
          Shop by Category
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: '700px', mx: 'auto' }}
        >
          Browse our wide selection of instruments
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {categories.slice(0, isSmall ? 4 : 8).map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
            <Card
              component={Link}
              to={`/categories/${category.id}`}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box sx={{ position: 'relative', pt: '80%' }}>
                <CardMedia
                  component="img"
                  image={CATEGORY_IMAGES[category.name] || `/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  alt={category.name}
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    p: 2,
                  }}
                >
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                    }}
                  >
                    {category.name}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 2,
                    color: 'primary.main',
                    fontWeight: 'medium'
                  }}
                >
                  <Typography variant="button" sx={{ mr: 1 }}>
                    View Products
                  </Typography>
                  <ArrowForwardIcon fontSize="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button 
          component={Link} 
          to="/categories" 
          variant="outlined" 
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            borderRadius: '30px',
            px: 4,
            py: 1.2,
            fontWeight: 'bold'
          }}
        >
          View All Categories
        </Button>
      </Box>
    </Container>
  );

  const featuredProductsSection = () => (
    <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ fontWeight: 'bold' }}
          >
            Featured Products
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            Discover our most popular instruments
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained" 
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              borderRadius: '30px', 
              px: 4,
              py: 1.2,
              fontWeight: 'bold'
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );

  const testimonialsSection = () => (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ fontWeight: 'bold' }}
          >
            What Our Customers Say
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            Read testimonials from musicians who love our instruments
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {TESTIMONIALS.map((testimonial) => (
            <Grid item xs={12} md={4} key={testimonial.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Rating value={testimonial.rating} precision={0.5} readOnly />
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontStyle: 'italic',
                    mb: 3,
                    flexGrow: 1,
                    color: 'text.primary',
                    lineHeight: 1.7
                  }}
                >
                  "{testimonial.comment}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  const featuresSection = () => (
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ fontWeight: 'bold' }}
          >
            Why Choose Us
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            We're committed to providing the best musical instrument shopping experience
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                height: '100%',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <MusicNoteIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quality Instruments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We carefully select and test each instrument to ensure exceptional quality and sound.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                height: '100%',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <ShippingIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Free shipping on orders over $100, with quick and reliable delivery to your door.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                height: '100%',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#4caf50',
                  color: 'white',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <SecurityIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Secure Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shop with confidence with our secure payment system and satisfaction guarantee.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                height: '100%',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#ff9800',
                  color: 'white',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <SupportIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Expert Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our team of musicians is here to help you find the perfect instrument for your needs.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  const brandsSection = () => (
    <Box sx={{ py: 6, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ fontWeight: 'bold' }}
          >
            Top Brands
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            We partner with the best brands in the music industry
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 3, md: 6 },
            opacity: 0.7
          }}
        >
          {FEATURED_BRANDS.map((brand, index) => (
            <Box 
              key={index} 
              component="img"
              src={`/brands/${brand}`}
              alt={`Brand ${index+1}`}
              sx={{ 
                height: { xs: 40, md: 50 },
                filter: 'grayscale(100%)',
                opacity: 0.7,
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'grayscale(0%)',
                  opacity: 1,
                }
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );

  const ctaSection = () => (
    <Box 
      sx={{ 
        py: 8, 
        backgroundImage: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
        color: 'white'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
              }}
            >
              Find Your Perfect Sound Today
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: '600px' }}>
              Join thousands of musicians who trust Instrument Haven for quality instruments and exceptional service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                component={Link} 
                to="/products" 
                variant="contained" 
                color="secondary"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.2,
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                Shop Now
              </Button>
              <Button 
                component={Link} 
                to="/contact" 
                variant="outlined" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.2,
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: '2px solid',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              component="img"
              src="/cta-image.png"
              alt="Musical instruments"
              sx={{ 
                width: '100%',
                maxWidth: '300px',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {heroSection()}
      {categorySection()}
      {featuredProductsSection()}
      {featuresSection()}
      {testimonialsSection()}
      {brandsSection()}
      {ctaSection()}
    </Box>
  );
};

export default Home;