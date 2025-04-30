import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import { CATEGORY_IMAGES } from "../../components/common/constants";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Button,
  useTheme,
  Paper,
  Divider,
  Chip
} from "@mui/material";
import { MusicNote, Category, KeyboardArrowRight } from "@mui/icons-material";

const Categories = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get an image URL based on category name or ID
  const getCategoryImage = (category) => {
    // First check if the category has an image_url from the server
    if (category && category.image_url) {
      const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';
      return `${storageUrl}/${category.image_url}`;
    }
    
    if (!category || !category.name) return CATEGORY_IMAGES.default;
    
    const lowerName = category.name.toLowerCase();
    
    // Specific instrument category mappings with direct paths
    const specificCategoryMapping = {
      "guitare": "/images/categories/guitar.jpg",
      "violon": "/images/categories/string-instruments.jpg",
      "violin": "/images/categories/string-instruments.jpg",
      "piano": "/images/categories/piano.jpg",
      "accordion": "/images/categories/keyboard.jpg",
      "banjo": "/images/categories/banjo.jpg",
    };
    
    // If we have a direct mapping for this category, use it
    if (specificCategoryMapping[lowerName]) {
      return specificCategoryMapping[lowerName];
    }
    
    // Otherwise, check for partial matches in CATEGORY_IMAGES
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
      if (lowerName.includes(key)) {
        return url;
      }
    }
    
    return CATEGORY_IMAGES.default;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.categories.getAll();
        
        if (response?.data?.status === 'success' && 
            response?.data?.data?.categories) {
          setCategories(response.data.data.categories);
        } else {
          setError("Failed to load categories. Please try again later.");
        }
      } catch (error) {
        setError("Error connecting to the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Group categories for featured sections
  const featuredCategories = categories.slice(0, 8);
  const remainingCategories = categories.slice(8);

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              position: 'relative',
              display: 'inline-block',
              pb: 1
            }}
          >
            <Box 
              component="span"
              sx={{
                position: 'absolute',
                height: '8px',
                width: '70%',
                bottom: '8px',
                left: '15%',
                backgroundColor: 'primary.light',
                opacity: 0.3,
                zIndex: -1
              }}
            />
            Browse Categories
          </Typography>
              
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: "center", 
              bgcolor: "error.light", 
              color: "error.dark",
              borderRadius: 3
            }}
          >
            <Typography variant="h6">{error}</Typography>
          </Paper>
        ) : (
          <>
            {/* Featured Categories Section */}
            <Box sx={{ mb: 5 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
              >
                <Category sx={{ mr: 1 }} /> Featured Categories
              </Typography>
              
              <Grid container spacing={2}>
                {featuredCategories.map((category) => (
                  <Grid item xs={6} sm={4} md={3} key={category.id}>
                    <Card 
                      component={Link}
                      to={`/categories/${category.id}`}
                      sx={{ 
                        height: '100%',
                        display: 'flex', 
                        flexDirection: 'row',
                        alignItems: 'center',
                        textDecoration: 'none',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: '80px',
                          height: '80px',
                          position: 'relative',
                          flexShrink: 0
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={getCategoryImage(category)}
                          alt={category.name}
                          sx={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            console.error('Featured category image failed to load:', e.target.src);
                            e.target.onerror = null; // Prevent infinite error loop
                            e.target.src = CATEGORY_IMAGES.default;
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                          {category.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                            Browse <KeyboardArrowRight fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Divider with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Box 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'inline-flex',
                  mx: 2
                }}
              >
                <MusicNote sx={{ color: 'white' }} />
              </Box>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            {/* All Categories */}
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
              >
                <Category sx={{ mr: 1 }} /> All Categories
              </Typography>
              
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(255, 43, 82, 0.04)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box
                        component={Link}
                        to={`/categories/${category.id}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={getCategoryImage(category)}
                            alt={category.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              console.error('All categories image failed to load:', e.target.src);
                              e.target.onerror = null; // Prevent infinite error loop
                              e.target.src = CATEGORY_IMAGES.default;
                            }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {category.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              size="small" 
                              label={category.product_count || "0 products"} 
                              sx={{ 
                                fontSize: '0.7rem', 
                                height: 20,
                                backgroundColor: 'rgba(255, 43, 82, 0.1)',
                                color: 'primary.dark'
                              }} 
                            />
                          </Box>
                        </Box>
                        <KeyboardArrowRight color="primary" />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Call to Action */}
            <Paper
              elevation={0}
              sx={{
                mt: 5,
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #FF2B52, #FF6B87)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Can't find what you're looking for?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Our extensive inventory includes many more instruments and accessories.
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                View All Products
              </Button>
            </Paper>
          </>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default Categories;