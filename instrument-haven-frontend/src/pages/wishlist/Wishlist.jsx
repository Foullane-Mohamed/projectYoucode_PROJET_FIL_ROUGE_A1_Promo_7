import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Rating,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import { Favorite, ShoppingCart, ArrowBack, FavoriteBorder } from '@mui/icons-material';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { PRODUCT_IMAGES } from '../../components/common/constants';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    if (!product || !product.id || !product.name) {
      toast.error('Cannot add product to cart: missing product information');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getProductImage = (product) => {
    // Try to use actual product image first
    if (product.thumbnail) {
      return `/images/products/${product.thumbnail}`;
    }
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return `/images/products/${product.images[0]}`;
    }
    
    // Use placeholder image as fallback
    const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
    return PRODUCT_IMAGES[index];
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">Loading your wishlist...</Typography>
        </Box>
      </Container>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '50vh', justifyContent: 'center' }}>
          <FavoriteBorder sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>Your wishlist is empty</Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Save items you love to your wishlist and find them here anytime.
          </Typography>
          <Button component={Link} to="/products" variant="contained" startIcon={<ArrowBack />}>
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
          My Wishlist
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {wishlist.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
            <FavoriteBorder sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your wishlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: '400px' }}>
              Add items to your wishlist to keep track of products you're interested in.
            </Typography>
            <Button 
              component={Link} 
              to="/products" 
              variant="contained" 
              sx={{ mt: 2 }}
              startIcon={<ArrowBack />}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {wishlist.map((item) => {
              const product = item.product || item;
              const productId = item.product_id || (product && product.id);
              
              if (!product || !productId) return null;
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={productId}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        pt: '75%', // 4:3 Aspect ratio
                        bgcolor: '#f5f5f7',
                        overflow: 'hidden'
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={getProductImage(product)}
                        alt={product.name || 'Product'}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          p: 2,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite error loop
                          e.target.src = '/images/categories/placeholder.jpg';
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'error.main',
                            color: 'white'
                          }
                        }}
                        onClick={() => removeFromWishlist(productId)}
                      >
                        <Favorite />
                      </IconButton>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Typography 
                        variant="h6" 
                        component={Link} 
                        to={`/products/${productId}`}
                        sx={{ 
                          textDecoration: 'none', 
                          color: 'text.primary',
                          fontWeight: 500,
                          fontSize: '1rem',
                          display: 'block',
                          mb: 1,
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                      >
                        {product.name || 'Product'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating 
                          value={product.average_rating || 0} 
                          precision={0.5} 
                          readOnly 
                          size="small" 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.reviews?.length || 0})
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" color="primary.main" sx={{ mt: 1, fontWeight: 700 }}>
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(product)}
                        sx={{
                          borderRadius: '8px',
                          py: 1,
                          fontWeight: 500,
                          boxShadow: 2
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          component={Link} 
          to="/products" 
          variant="outlined" 
          startIcon={<ArrowBack />}
          sx={{
            borderRadius: 28,
            px: 3,
            py: 1
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default Wishlist;