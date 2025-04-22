import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Rating,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Delete,
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  ArrowBack,
} from '@mui/icons-material';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [removingItem, setRemovingItem] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [storageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');

  useEffect(() => {
    // Refresh wishlist when component mounts
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItem(productId);
    try {
      const result = await removeFromWishlist(productId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Failed to remove item from wishlist');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        toast.success('Product added to cart');
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    } catch (err) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleClearWishlist = () => {
    setClearDialogOpen(true);
  };

  const confirmClearWishlist = async () => {
    try {
      // Remove each item from wishlist
      for (const item of wishlist) {
        const productId = item.product_id || (item.product && item.product.id);
        if (productId) {
          await removeFromWishlist(productId);
        }
      }
      toast.success('Wishlist cleared successfully');
    } catch (err) {
      toast.error('Failed to clear wishlist');
    } finally {
      setClearDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6">Loading your wishlist...</Typography>
        </Box>
      </Container>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 6,
          }}
        >
          <FavoriteBorder sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Save items you love to your wishlist and find them here anytime.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Explore Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Wishlist
        </Typography>
        <Button 
          color="error" 
          onClick={handleClearWishlist}
          disabled={loading || wishlist.length === 0}
        >
          Clear Wishlist
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {wishlist.map((item) => {
          // Handle both direct product and nested product object structures
          const product = item.product || item;
          const productId = item.product_id || (product && product.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={productId}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    product.thumbnail
                      ? `${storageUrl}/${product.thumbnail}`
                      : '/placeholder.png'
                  }
                  alt={product.name}
                  sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f7' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component={Link} 
                    to={`/products/${productId}`}
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '3.6em',
                      lineHeight: '1.8em'
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.review_count || 0})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    {product.on_sale && product.sale_price ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="error">
                          ${Number(product.sale_price).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ${Number(product.price).toFixed(2)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h6" color="primary">
                        ${Number(product.price).toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFromWishlist(productId)}
                    disabled={removingItem === productId}
                  >
                    <Favorite />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          component={Link}
          to="/products"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Continue Shopping
        </Button>
      </Box>

      {/* Clear Wishlist Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
      >
        <DialogTitle>Clear Wishlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all items from your wishlist? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmClearWishlist} color="error" autoFocus>
            Clear Wishlist
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wishlist;