import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Rating,
  IconButton,
  Badge,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Visibility,
  LocalShipping,
  CheckCircle,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../../styles/enhancedProductCard.css';

const EnhancedProductCard = ({ product }) => {
  if (!product) {
    console.error('EnhancedProductCard received null or undefined product');
    return null;
  }
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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
    <Card 
      className="enhanced-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box className="product-header">
        <Box className="product-image-container">
          <img
            src={
              product.thumbnail
                ? `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.thumbnail}`
                : (product.images && Array.isArray(product.images) && product.images.length > 0
                  ? `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.images[0]}`
                  : '/images/categories/placeholder.jpg')
            }
            alt={product.name || 'Product'}
            className="product-image"
            style={{
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s ease'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/categories/placeholder.jpg';
            }}
          />
          
          {product.on_sale && product.sale_price && (
            <Box className="discount-badge">
              <Typography variant="body2">
                {discountPercentage}% OFF
              </Typography>
            </Box>
          )}
          
          {product.stock <= 0 && (
            <Box className="out-of-stock-overlay">
              <Typography variant="h6">Out of Stock</Typography>
            </Box>
          )}
        </Box>
        
        <IconButton 
          className="wishlist-button" 
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
        >
          {isInWishlist(product.id) ? (
            <Favorite className="wishlist-icon-active" />
          ) : (
            <FavoriteBorder className="wishlist-icon" />
          )}
        </IconButton>
      </Box>
      
      <CardContent className="product-content">
        <Box className="product-rating">
          <Rating 
            value={product.average_rating || 0} 
            readOnly 
            precision={0.5} 
            size="small" 
          />
          <Typography variant="caption" className="review-count">
            ({product.reviews ? product.reviews.length : 0})
          </Typography>
        </Box>
        
        <Typography 
          component={Link} 
          to={`/products/${product.id}`}
          className="product-title"
          variant="h6"
        >
          {product.name || 'Unnamed Product'}
        </Typography>
        
        <Typography variant="body2" className="product-description">
          {product.description || 'No description available'}
        </Typography>
        
        <Box className="pricing-container">
          {product.on_sale && product.sale_price ? (
            <>
              <Typography variant="h5" className="sale-price">
                ${parseFloat(product.sale_price).toFixed(2)}
              </Typography>
              <Typography variant="body2" className="regular-price">
                ${parseFloat(product.price).toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="h5" className="regular-price-solo">
              ${parseFloat(product.price).toFixed(2)}
            </Typography>
          )}
        </Box>
        
        <Box className="stock-status">
          {product.stock > 0 ? (
            <Chip 
              icon={<CheckCircle fontSize="small" />}
              label={`In Stock (${product.stock})`}
              size="small"
              color="success"
              variant="outlined"
            />
          ) : (
            <Chip 
              label="Out of Stock"
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box className="product-actions">
          <Button
            variant="contained"
            className="add-cart-button"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            fullWidth
          >
            Add to Cart
          </Button>
          
          <Button
            variant="outlined"
            className="view-details-button"
            startIcon={<Visibility />}
            component={Link}
            to={`/products/${product.id}`}
            fullWidth
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedProductCard;