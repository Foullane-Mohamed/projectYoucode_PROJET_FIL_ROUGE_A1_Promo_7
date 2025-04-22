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
  Chip,
  CardActionArea,
  CardMedia
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  AddShoppingCart,
  Visibility,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../../styles/enhancedProductCard.css';
import { PRODUCT_IMAGES } from './constants';

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

  // Get a consistent product image based on product ID
  const getProductImage = () => {
    // Try to use actual product image first
    if (product.thumbnail) {
      return `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.thumbnail}`;
    }
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.images[0]}`;
    }
    
    // Use placeholder image as fallback - ensuring we use product images, not category images
    const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
    return PRODUCT_IMAGES[index];
  };

  const discountPercentage = product.on_sale && product.sale_price 
    ? Math.round(100 - ((parseFloat(product.sale_price) / parseFloat(product.price)) * 100)) 
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'white',
        maxWidth: '100%',
        m: 0,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconButton
        aria-label="add to wishlist"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
          '&:hover': {
            bgcolor: 'white',
            boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
          },
          width: 40,
          height: 40,
        }}
        onClick={handleWishlistToggle}
      >
        {isInWishlist(product.id) ? (
          <Favorite sx={{ color: '#FF2B52' }} />
        ) : (
          <FavoriteBorder sx={{ color: '#777' }} />
        )}
      </IconButton>

      <CardActionArea component={Link} to={`/products/${product.id}`}>
        <Box sx={{ 
          position: 'relative', 
          bgcolor: '#f5f7fa', 
          pt: 2, 
          px: 2, 
          pb: 2, 
          height: '240px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              image={getProductImage()}
              alt={product.name || 'Product'}
              sx={{ 
                maxWidth: '85%',
                maxHeight: '85%',
                objectFit: 'contain',
                transition: 'transform 0.4s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite error loop
                const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
                e.target.src = PRODUCT_IMAGES[index];
              }}
            />
          </Box>
          
          {product.on_sale && product.sale_price && discountPercentage > 0 && (
            <Chip 
              label={`${discountPercentage}% OFF`} 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16,
                backgroundColor: 'rgba(255, 43, 82, 0.95)',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.8rem',
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                zIndex: 2,
                py: 0.8,
                borderRadius: '6px'
              }}
            />
          )}
          
          {product.stock <= 0 && (
            <Chip 
              label="Out of Stock" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16,
                backgroundColor: 'rgba(211, 47, 47, 0.95)',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.8rem',
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                zIndex: 2,
                py: 0.8,
                borderRadius: '6px'
              }}
            />
          )}
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 2, pt: 1.5, height: '120px', overflow: 'hidden' }}>
          <Typography 
            gutterBottom 
            variant="subtitle1" 
            component="div" 
            noWrap
            sx={{ 
              fontSize: '1rem', 
              mb: 0.5,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              fontWeight: 600,
              color: '#333'
            }}
          >
            {product.name || 'Unnamed Product'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, mt: 0.5, bgcolor: '#fff9f9', py: 0.5, px: 1, borderRadius: 2, width: 'fit-content' }}>
            <Rating 
              value={product.average_rating || 0} 
              readOnly 
              size="small" 
              precision={0.5} 
              sx={{ 
                color: '#FFB612', 
                '& .MuiRating-iconEmpty': {
                  color: '#e0e0e0'
                }
              }}
            />
            <Typography variant="body2" sx={{ ml: 0.5, fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>
              ({product.reviews ? product.reviews.length : 0})
            </Typography>
          </Box>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              maxHeight: '36px',
              fontSize: '0.8rem',
              color: '#666',
              lineHeight: 1.3,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.description 
              ? (product.description.length > 60 
                  ? `${product.description.substring(0, 60)}...` 
                  : product.description)
              : 'No description available'}
          </Typography>
        </CardContent>
      </CardActionArea>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          pt: 1.5,
          pb: 2,
          mt: 'auto',
          backgroundColor: 'white',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          height: '60px',
          position: 'relative',
          width: '100%'
        }}
      >
        {product.on_sale && product.sale_price ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '1.4rem',
                  fontWeight: 700, 
                  color: '#FF2B52',
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '"$"',
                    fontSize: '1rem',
                    position: 'relative',
                    top: '-0.2em',
                    mr: 0.3,
                    opacity: 0.8
                  }
                }}
              >
                {(parseFloat(product.sale_price) || 0).toFixed(2)}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  textDecoration: 'line-through', 
                  fontSize: '0.9rem', 
                  color: '#999',
                  mt: 0.5
                }}
              >
                ${(parseFloat(product.price) || 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#FF2B52', 
            fontSize: '1.4rem',
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '"$"',
              fontSize: '1rem',
              position: 'relative',
              top: '-0.2em',
              mr: 0.3,
              opacity: 0.8
            }
          }}>
            {(parseFloat(product.price) || 0).toFixed(2)}
          </Typography>
        )}
        <Button
          size="small"
          variant="contained"
          startIcon={<AddShoppingCart fontSize="small" />}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          sx={{
            px: 2.5,
            py: 1,
            minWidth: '120px',
            fontWeight: '600',
            fontSize: '0.85rem',
            boxShadow: '0 4px 10px rgba(255, 43, 82, 0.25)',
            backgroundColor: '#FF2B52',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#e01e41',
              boxShadow: '0 6px 12px rgba(255, 43, 82, 0.35)'
            },
            '&.Mui-disabled': {
              backgroundColor: '#f5f5f5',
              color: '#999'
            }
          }}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </Box>
      
      {product.stock > 0 && (
        <Box sx={{ 
          position: 'absolute', 
          bottom: 70, 
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            variant="outlined"
            startIcon={<Visibility fontSize="small" />}
            component={Link}
            to={`/products/${product.id}`}
            size="small"
            sx={{
              borderColor: '#ccc',
              color: '#666',
              '&:hover': {
                borderColor: '#FF2B52',
                color: '#FF2B52',
                backgroundColor: 'rgba(255, 43, 82, 0.04)'
              },
              fontSize: '0.75rem',
              py: 0.5,
              display: isHovered ? 'flex' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            View Details
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default EnhancedProductCard;