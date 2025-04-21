import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Box,
  Button,
  Card,
  Typography,
  Rating,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../../styles/enhancedProductCard.css';

const EnhancedListProductCard = ({ product }) => {
  if (!product) {
    console.error('EnhancedListProductCard received null or undefined product');
    return null;
  }
  
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product || !product.id || !product.name) {
      toast.error('Cannot add product to cart: missing product information');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product || !product.id || !product.name) {
      toast.error('Cannot add product to wishlist: missing product information');
      return;
    }
    
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return;
    }

    const inWishlist = isInWishlist(product.id);
    
    try {
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
    } catch (error) {
      console.error('Wishlist operation error:', error);
      toast.error('An error occurred while updating wishlist');
    }
  };

  const discountPercentage = product.on_sale && product.sale_price 
    ? Math.round(100 - ((parseFloat(product.sale_price) / parseFloat(product.price)) * 100)) 
    : 0;

  return (
    <Card className="enhanced-list-product-card">
      {/* Product Badges */}
      <Box className="product-badges">
        {product.on_sale && product.sale_price && (
          <Chip 
            label={`${discountPercentage}% OFF`}
            color="error"
            size="small"
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ff6b6b, #ff2b52)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(255, 43, 82, 0.3)',
            }}
          />
        )}
        
        {product.stock <= 0 && (
          <Chip 
            label="Out of Stock"
            color="error"
            variant="filled"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        )}
      </Box>
      
      {/* Wishlist Button */}
      <IconButton 
        className="wishlist-button"
        onClick={handleWishlistToggle}
        aria-label="Add to wishlist"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        {isInWishlist(product.id) ? (
          <Favorite sx={{ color: '#FF2B52' }} />
        ) : (
          <FavoriteBorder sx={{ color: '#555' }} />
        )}
      </IconButton>
      
      {/* Product Image */}
      <Box className="product-image-section">
        <img
          src={
            product.thumbnail
              ? `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.thumbnail}`
              : (product.images && Array.isArray(product.images) && product.images.length > 0
                ? `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.images[0]}`
                : '/images/categories/placeholder.jpg')
          }
          alt={product.name || 'Product'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/categories/placeholder.jpg';
          }}
        />
      </Box>
      
      {/* Product Details */}
      <Box className="product-details">
        <Box className="product-title-row">
          <Box className="product-title-section">
            <Typography 
              component={Link} 
              to={`/products/${product.id}`}
              className="product-title"
              variant="h5"
            >
              {product.name || 'Unnamed Product'}
            </Typography>
            
            <Box className="product-rating">
              <Rating 
                value={product.average_rating || 0} 
                readOnly 
                precision={0.5} 
                size="small" 
              />
              <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                ({product.reviews ? product.reviews.length : 0} reviews)
              </Typography>
              
              {product.stock > 0 && (
                <Chip 
                  icon={<CheckCircle fontSize="small" />}
                  label={`In Stock (${product.stock})`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Typography className="product-description">
          {product.description || 'No description available'}
        </Typography>
        
        <Box className="product-footer">
          <Box className="price-section">
            {product.on_sale && product.sale_price ? (
              <>
                <Typography className="sale-price">
                  ${parseFloat(product.sale_price).toFixed(2)}
                </Typography>
                <Typography className="regular-price">
                  ${parseFloat(product.price).toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography className="sale-price">
                ${parseFloat(product.price).toFixed(2)}
              </Typography>
            )}
          </Box>
          
          <Box className="actions-section">
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              sx={{
                backgroundColor: '#FF2B52',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '8px 24px',
                boxShadow: '0 4px 12px rgba(255, 43, 82, 0.2)',
                '&:hover': {
                  backgroundColor: '#e01e41',
                  boxShadow: '0 6px 16px rgba(255, 43, 82, 0.3)',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f5f5f5',
                  color: '#999',
                }
              }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              component={Link}
              to={`/products/${product.id}`}
              sx={{
                borderColor: '#ccc',
                color: '#666',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '8px 16px',
                '&:hover': {
                  borderColor: '#FF2B52',
                  color: '#FF2B52',
                  backgroundColor: 'rgba(255, 43, 82, 0.04)',
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default EnhancedListProductCard;