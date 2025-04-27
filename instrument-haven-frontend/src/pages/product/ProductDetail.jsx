import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiService, { api } from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import EnhancedProductCard from '../../components/common/EnhancedProductCard';
import { PRODUCT_IMAGES, getCategoryImage } from '../../components/common/constants';
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
  const [storageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching product details for ID: ${id}, API URL: ${import.meta.env.VITE_API_URL}`);
        
        // Direct API call to see the raw response
        try {
          const directResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/products/${id}`);
          const responseData = await directResponse.json();
          console.log('Direct API call response:', responseData);
        } catch (directError) {
          console.error('Direct API call failed:', directError);
        }
        
        const response = await apiService.products.getById(id);
        console.log('Product API response:', response);
        
        // Ensure we use the correct data structure according to API documentation
        let productData = null;
        
        if (response?.data?.data?.product) {
          productData = response.data.data.product;
        } else if (response?.data?.product) {
          productData = response.data.product;
        } else if (response?.data?.data) {
          productData = response.data.data;
        }
        
        console.log('Extracted product data:', productData);
        
        if (!productData) {
          setError('Product not found or data format is unexpected.');
          return;
        }
        
        // Ensure images array is valid and has proper URLs
        if (productData.images && !Array.isArray(productData.images)) {
          try {
            productData.images = JSON.parse(productData.images);
          } catch (e) {
            console.error('Error parsing images JSON:', e);
            productData.images = [];
          }
        }
        
        // Make sure images are always an array
        if (!Array.isArray(productData.images)) {
          productData.images = [];
        }
        
        console.log('Processed product data:', productData);
        console.log('Storage URL being used:', storageUrl);
        
        setProduct(productData);
        
        // Fetch related products from the same category
        if (productData.category_id) {
          try {
            const relatedResponse = await apiService.products.getByCategory(productData.category_id);
            console.log('Related products response:', relatedResponse);
            
            // Extract products from the category response
            let categoryProducts = [];
            
            if (relatedResponse?.data?.data?.category?.products) {
              categoryProducts = relatedResponse.data.data.category.products;
            } else if (relatedResponse?.data?.category?.products) {
              categoryProducts = relatedResponse.data.category.products;
            } else if (relatedResponse?.data?.data?.products) {
              categoryProducts = relatedResponse.data.data.products;
            } else if (Array.isArray(relatedResponse?.data?.products)) {
              categoryProducts = relatedResponse.data.products;
            }
            
            setRelatedProducts(
              categoryProducts
                .filter((item) => item.id !== parseInt(id))
                .slice(0, 4)
            );
          } catch (err) {
            console.error('Error fetching related products:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        
        // More detailed error message for debugging
        let errorMessage = 'Failed to load product details.';
        
        if (err.response) {
          console.error('Error response data:', err.response.data);
          errorMessage += ` Server responded with ${err.response.status}: ${err.response.data?.message || 'Unknown error'}`;
        } else if (err.request) {
          errorMessage += ' No response received from server. Check your network connection and server status.';
        } else {
          errorMessage += ` ${err.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

// Utility function to safely get image URL with fallback
const getSafeImageUrl = (imagePath) => {
  if (!imagePath) return '/images/categories/placeholder.jpg';
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's just a filename, use local path
  return `/images/products/${imagePath}`;
};

// Get a consistent product image - using local paths
const getProductImage = (imageIndex = 0) => {
  if (!product) return '';
  
  // Use the storage URL from environment variables
  const storageBaseUrl = storageUrl;
  
  try {
    if (product.images && Array.isArray(product.images) && product.images.length > imageIndex) {
      // Use the public storage URL or fallback to local path
      return getSafeImageUrl(product.images[imageIndex]);
    } else if (product.thumbnail) {
      return getSafeImageUrl(product.thumbnail);
    }
  } catch (e) {
    console.error('Error getting product image:', e);
  }
  
  // Use placeholder image as fallback
  const index = Math.abs((product?.id % PRODUCT_IMAGES.length)) || 0;
  return PRODUCT_IMAGES[index];
};

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
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.history.back()}>
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={() => window.history.back()}>
              Go Back
            </Button>
          }
        >
          Failed to load product details. Please try again later.
        </Alert>
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
                  src={getProductImage(currentImage)}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite error loop
                    const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
                    e.target.src = PRODUCT_IMAGES[index];
                  }}
                />
              ) : (
                <img
                  src={getProductImage()}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite error loop
                    const index = (product.id % PRODUCT_IMAGES.length) || 0;
                    e.target.src = PRODUCT_IMAGES[index];
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
                      src={getSafeImageUrl(image)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite error loop
                        const imgIndex = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
                        e.target.src = PRODUCT_IMAGES[imgIndex];
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
            <Rating 
              value={product.average_rating || 0} 
              precision={0.5} 
              readOnly 
            />
            <Typography variant="body2" color="text.secondary">
              ({product.reviews ? product.reviews.length : 0} reviews)
            </Typography>
          </Box>
          
          <Typography variant="h5" gutterBottom>
            {product.on_sale && product.sale_price ? (
              <>
                <Typography 
                  component="span" 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ textDecoration: 'line-through', mr: 1 }}
                >
                  ${parseFloat(product.price).toFixed(2)}
                </Typography>
                <Typography component="span" variant="h5" color="error">
                  ${parseFloat(product.sale_price).toFixed(2)}
                </Typography>
              </>
            ) : (
              <>${parseFloat(product.price).toFixed(2)}</>
            )}
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
              
              {product.reviews && product.reviews.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {product.reviews.map((review) => (
                    <Paper key={review.id} elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', color: 'text.primary' }}>
                           {review.user?.name || review.user_name || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{review.comment}</Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No reviews yet. Be the first to review this product!
                  </Typography>
                </Box>
              )}
              
              {user && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Write a Review</Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      setShowReviewForm(true);
                      setTabValue(2); // Ensure we're on the reviews tab
                    }}
                  >
                    Add Your Review
                  </Button>
                  
                  {showReviewForm && (
                    <Paper elevation={0} sx={{ mt: 2, p: 3, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="h6" gutterBottom>Your Review</Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography component="legend">Your Rating</Typography>
                        <Rating
                          name="review-rating"
                          value={reviewRating}
                          onChange={(event, newValue) => {
                            setReviewRating(newValue);
                          }}
                          size="large"
                        />
                      </Box>
                      
                      <TextField
                        label="Your Comment"
                        multiline
                        rows={4}
                        fullWidth
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          disabled={reviewSubmitting || !reviewComment.trim()}
                          onClick={async () => {
                            if (!reviewComment.trim()) {
                              toast.error('Please enter a comment');
                              return;
                            }
                            
                            setReviewSubmitting(true);
                            try {
                              // Using the correct endpoint format for your backend
                              const response = await api.post(`/products/${product.id}/reviews`, {
                                rating: reviewRating,
                                comment: reviewComment
                              });
                              
                              if (response.data?.status === 'success') {
                                toast.success('Review submitted successfully!');
                                // Refresh product data to show the new review
                                const updatedProduct = await apiService.products.getById(id);
                                setProduct(updatedProduct.data?.data?.product || updatedProduct.data?.product);
                                
                                // Reset form
                                setShowReviewForm(false);
                                setReviewComment('');
                                setReviewRating(5);
                              } else {
                                toast.error(response.data?.message || 'Failed to submit review');
                              }
                            } catch (err) {
                              console.error('Error submitting review:', err);
                              toast.error(err.response?.data?.message || 'Failed to submit review');
                            } finally {
                              setReviewSubmitting(false);
                            }
                          }}
                        >
                          {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewComment('');
                            setReviewRating(5);
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Paper>
                  )}
                </Box>
              )}
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
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={relatedProduct.id}>
                <EnhancedProductCard product={relatedProduct} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;