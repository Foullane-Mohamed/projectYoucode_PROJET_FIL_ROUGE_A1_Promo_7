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
} from '@mui/material';
// Remove the Carousel import since it doesn't exist in MUI
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Navigation, Autoplay } from 'swiper';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        try {
          const productsResponse = await api.products.getAll();
          console.log('Products response:', productsResponse);
          
          // Properly extract products from the response structure
          if (productsResponse && productsResponse.data && 
              productsResponse.data.status === 'success' && 
              productsResponse.data.data && 
              productsResponse.data.data.products) {
            // Extract products array from the nested structure
            setFeaturedProducts(productsResponse.data.data.products.slice(0, 8));
          } else {
            console.error('Unexpected products response format:', productsResponse);
            setFeaturedProducts([]);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          setFeaturedProducts([]);
        }
        
        // Fetch categories
        try {
          const categoriesResponse = await api.categories.getParentCategories();
          console.log('Categories response:', categoriesResponse);
          
          // Properly extract categories from the response structure
          if (categoriesResponse && categoriesResponse.data && 
              categoriesResponse.data.status === 'success' && 
              categoriesResponse.data.data && 
              categoriesResponse.data.data.categories) {
            // Extract categories array from the nested structure
            setCategories(categoriesResponse.data.data.categories);
          } else {
            console.error('Unexpected categories response format:', categoriesResponse);
            setCategories([]);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slider content
  const sliderItems = [
    {
      id: 1,
      image: '/slider/slider1.jpg',
      title: 'Quality Musical Instruments',
      description: 'Discover our wide selection of premium instruments',
      link: '/products',
    },
    {
      id: 2,
      image: '/slider/slider2.jpg',
      title: 'Special Offers',
      description: 'Check out our latest deals and discounts',
      link: '/products',
    },
    {
      id: 3,
      image: '/slider/slider3.jpg',
      title: 'For All Skill Levels',
      description: 'From beginners to professional musicians',
      link: '/products',
    },
  ];

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
      {/* Hero Slider */}
      <Box sx={{ mb: 6 }}>
        {/* <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          style={{ height: '500px' }}
        >
          {sliderItems.map((item) => (
            <SwiperSlide key={item.id}>
              <Box
                sx={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                  }}
                />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ color: 'white', maxWidth: '600px' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h6" paragraph>
                      {item.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={item.link}
                      variant="contained"
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Shop Now
                    </Button>
                  </Box>
                </Container>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper> */}
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Shop by Category
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" paragraph>
          Browse our wide selection of instruments
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item xs={12} md={4} key={category.id}>
              <Card
                component={Link}
                to={`/categories/${category.id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  alt={category.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" align="center">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button component={Link} to="/categories" variant="outlined" size="large">
            View All Categories
          </Button>
        </Box>
      </Container>

      <Divider />

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Products
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" paragraph>
          Discover our most popular instruments
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button component={Link} to="/products" variant="outlined" size="large">
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Call to Action Section */}
      <Box sx={{ bgcolor: 'primary.light', py: 8, mt: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom align="center" color="white">
            Join Our Community
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph color="white">
            Get exclusive offers, music tips, and be the first to know about new arrivals
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              color="secondary"
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;