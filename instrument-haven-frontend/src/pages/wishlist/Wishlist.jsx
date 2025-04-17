import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Delete,
  ShoppingCart,
  FavoriteBorder,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      toast.success('Product removed from wishlist!');
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.product_id,
      name: product.product.name,
      price: product.product.price,
      images: product.product.images,
    });
    toast.success(`${product.product.name} added to cart!`);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please login to view your wishlist.
        </Alert>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
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
      </Container>
    );
  }

  if (wishlist.length === 0) {
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
            Products you add to your wishlist will appear here.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Wishlist
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {wishlist.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      borderRadius: 1,
                      overflow: 'hidden',
                      mr: 2,
                    }}
                  >
                    <img
                      src={
                        item.product.images && item.product.images.length > 0
                          ? `${process.env.REACT_APP_API_URL}/storage/${item.product.images[0]}`
                          : '/placeholder.png'
                      }
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/products/${item.product_id}`}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {item.product.name}
                    </Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      ${item.product.price.toFixed(2)}
                    </Typography>
                    {item.product.stock > 0 ? (
                      <Typography variant="body2" color="success.main">
                        In Stock
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error">
                        Out of Stock
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(item)}
                    disabled={item.product.stock <= 0}
                    sx={{ mr: 1 }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFromWishlist(item.product_id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Wishlist;