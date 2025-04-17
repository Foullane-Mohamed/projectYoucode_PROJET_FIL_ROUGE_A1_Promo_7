import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
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
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
        
        // Fetch related products from the same category
        const relatedResponse = await api.get(
          `/products/category/${response.data.data.category_id}`
        );
        setRelatedProducts(
          relatedResponse.data.data
            .filter((item) => item.id !== parseInt(id))
            .slice(0, 4)
        );
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
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    const inWishlist = isInWishlist(product.id);
    
    if (inWishlist) {
      const result = await removeFromWishlist(product.id);
      if (result.success) {
        toast.success(`${product.name} removed from wishlist!`);
      }
    } else {
      const result = await addToWishlist(product.id);
      if (result.success) {
        toast.success(`${product.name} added to wishlist!`);
      } else {
        toast.error(result.message);
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
        <Link
          to={`/categories/${product.category_id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {product.category?.name || 'Category'}
        </Link>
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
            <Box
              sx={{
                height: 400,
                width: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <img
                src={
                  product.images && product.images.length > 0
                    ? `${process.env.REACT_APP_API_URL}/storage/${product.images[currentImage]}`
                    : '/placeholder.png'
                }
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            {product.images && product.images.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  overflowX: 'auto',
                }}
              >
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      border: '1px solid',
                      borderColor: index === currentImage ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/storage/${image}`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
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
            ${product.price.toFixed(2)}
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
                {product.category?.name || 'Category'}
              </Link>
            </Typography>
            
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
      <Box sx={{ mt: 6 }}>
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
        <Box sx={{ py: 3 }}>
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
                    ${product.price.toFixed(2)}
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
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                <Box
                  component={Link}
                  to={`/products/${relatedProduct.id}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      width: '100%',
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={
                        relatedProduct.images && relatedProduct.images.length > 0
                          ? `${process.env.REACT_APP_API_URL}/storage/${relatedProduct.images[0]}`
                          : '/placeholder.png'
                      }
                      alt={relatedProduct.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle1" noWrap>
                    {relatedProduct.name}
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    ${relatedProduct.price.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;
          
        