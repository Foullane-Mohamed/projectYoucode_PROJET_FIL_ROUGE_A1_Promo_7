import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Breadcrumbs,
  Tabs,
  Tab,
  Divider,
  TextField,
  Chip,
  Stack,
  Rating,
  IconButton,
  Alert,
  Paper,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  NavigateNext,
  AddCircle,
  RemoveCircle,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.products.getById(id);
        const productData = response.data.data;
        setProduct(productData);
        
        // Fetch related products from the same category
        if (productData.category_id) {
          try {
            const relatedResponse = await api.products.getByCategory(productData.category_id);
            setRelatedProducts(
              relatedResponse.data.data
                .filter((item) => item.id !== parseInt(id))
                .slice(0, 4)
            );
          } catch (err) {
            console.error('Error fetching related products:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    const inWishlist = isInWishlist(product.id);
    
    if (inWishlist) {
      const result = await removeFromWishlist(product.id);
      if (result.success) {
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        toast.error(result.message || 'Failed to remove from wishlist');
      }
    } else {
      const result = await addToWishlist(product.id);
      if (result.success) {
        toast.success(`${product.name} added to wishlist!`);
      } else {
        toast.error(result.message || 'Failed to add to wishlist');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          Products
        </Link>
        {product.category && (
          <Link
            to={`/categories/${product.category_id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {product.category.name}
          </Link>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                height: 400,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'background.paper',
              }}
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={`http://localhost:8000/storage/${product.images[currentImage]}`}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <img
                  src="/placeholder.png"
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </Paper>
            
            {product.images && product.images.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  overflowX: 'auto',
                  py: 1,
                }}
              >
                {product.images.map((image, index) => (
                  <Paper
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    elevation={index === currentImage ? 3 : 1}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: index === currentImage ? '2px solid' : '1px solid',
                      borderColor: index === currentImage ? 'primary.main' : 'divider',
                    }}
                  >
                    <img
                      src={`http://localhost:8000/storage/${image}`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          {/* This is placeholder, you can implement real reviews later */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <Rating value={4.5} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              (25 reviews)
            </Typography>
          </Box>
          
          <Typography variant="h5" color="primary" gutterBottom>
            ${parseFloat(product.price).toFixed(2)}
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Availability:
              <Chip 
                label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                color={product.stock > 0 ? 'success' : 'error'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            
            {product.category && (
              <Typography variant="subtitle1">
                Category:
                <Link 
                  to={`/categories/${product.category_id}`}
                  style={{ 
                    textDecoration: 'none', 
                    color: 'primary.main',
                    marginLeft: '8px'
                  }}
                >
                  {product.category.name}
                </Link>
              </Typography>
            )}
            
            {product.tags && product.tags.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Tags:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {product.tags.map((tag) => (
                    <Chip key={tag.id} label={tag.name} size="small" />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {product.stock > 0 ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" mr={2}>
                  Quantity:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <RemoveCircle />
                  </IconButton>
                  <TextField
                    size="small"
                    type="number"
                    value={quantity}
                    InputProps={{ inputProps: { min: 1, max: product.stock } }}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    sx={{ width: 60, mx: 1 }}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <AddCircle />
                  </IconButton>
                </Box>
              </Box>
          
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  sx={{ flexGrow: 1, minWidth: 200 }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleWishlistToggle}
                  startIcon={isInWishlist(product.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                >
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </Box>
            </>
          ) : (
            <Alert severity="warning" sx={{ my: 3 }}>
              This product is currently out of stock.
            </Alert>
          )}
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Paper elevation={1} sx={{ mt: 6, borderRadius: 1 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Reviews" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Typography variant="body1">{product.description}</Typography>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Specifications for {product.name}:
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Item ID:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Type:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.category?.name || 'Musical Instrument'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Price:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${parseFloat(product.price).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Stock:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.stock} units
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Customer reviews for {product.name}:
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No reviews yet. Be the first to review this product!
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                <Paper
                  elevation={1}
                  component={Link}
                  to={`/products/${relatedProduct.id}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2,
                    }}
                  >
                    <img
                      src={
                        relatedProduct.images && relatedProduct.images.length > 0
                          ? `http://localhost:8000/storage/${relatedProduct.images[0]}`
                          : '/placeholder.png'
                      }
                      alt={relatedProduct.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" noWrap>
                      {relatedProduct.name}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      ${parseFloat(relatedProduct.price).toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;