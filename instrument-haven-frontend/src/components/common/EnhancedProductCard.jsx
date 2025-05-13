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

  const getProductImage = () => {
    if (product.thumbnail) {
      return `/images/products/${product.thumbnail}`;
    }
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return `/images/products/${product.images[0]}`;
    }
    
    const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
    return PRODUCT_IMAGES[index];
  };

  const discountPercentage = product.on_sale && product.sale_price 
    ? Math.round(100 - ((parseFloat(product.sale_price) / parseFloat(product.price)) * 100)) 
    : 0;

  return (
    <Card
      className="enhanced-product-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid #f0f0f0',
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: 'white',
        width: '300px',
        maxWidth: '300px',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        margin: '0 auto',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '240px',  // Same as image container height
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            zIndex: 3,
            transition: 'all 0.3s ease',
          }}
        />
      )}
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
          bgcolor: '#f8fafc', 
          pt: 0,
          px: 0,
          pb: 0,
          height: '240px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(to bottom, #f8fafc, #ffffff)'
        }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 3
            }}
          >
            <CardMedia
              component="img"
              image={getProductImage()}
              alt={product.name || 'Product'}
              sx={{ 
                width: '85%',
                height: '85%',
                objectFit: 'contain',
                transition: 'all 0.5s ease',
                filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.1))',
                '&:hover': {
                  transform: 'scale(1.08)',
                  filter: 'drop-shadow(0px 8px 15px rgba(0,0,0,0.15))'
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
        
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 3, 
          pt: 2, 
          pb: 0,
          minHeight: '120px', 
          overflow: 'hidden', 
          backgroundColor: 'white', 
        }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              fontSize: '1.15rem', 
              mb: 1,
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              fontWeight: 700,
              color: '#222',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#FF2B52'
              }
            }}
          >
            {product.name || 'Unnamed Product'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 0.5, py: 0.5, borderRadius: 2, width: 'fit-content' }}>
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
              maxHeight: '40px',
              fontSize: '0.85rem',
              color: '#777',
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              width: '100%',
              mb: 2
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
          flexDirection: 'column',
          mt: 'auto',
          backgroundColor: 'white',
          width: '100%',
          borderTop: '1px solid #f0f0f0'
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {product.on_sale && product.sale_price ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'baseline', 
              gap: 1.5,
              justifyContent: 'center',
              width: '100%'
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontSize: '1.8rem',
                  fontWeight: 800, 
                  color: '#FF2B52',
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  textShadow: '0px 1px 1px rgba(255,43,82,0.1)',
                  '&::before': {
                    content: '"$"',
                    fontSize: '1.2rem',
                    fontWeight: 800,
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
                  fontSize: '1rem', 
                  color: '#999',
                  mt: 0.5
                }}
              >
                ${(parseFloat(product.price) || 0).toFixed(2)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h5" sx={{ 
              fontWeight: 800, 
              color: '#FF2B52', 
              fontSize: '1.8rem',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              textShadow: '0px 1px 1px rgba(255,43,82,0.1)',
              '&::before': {
                content: '"$"',
                fontSize: '1.2rem',
                fontWeight: 800,
                position: 'relative',
                top: '-0.2em',
                mr: 0.3,
                opacity: 0.8
              }
            }}>
              {(parseFloat(product.price) || 0).toFixed(2)}
            </Typography>
          )}
        </Box>
        
        <Button
          size="large"
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="add-cart-button"
          sx={{
            width: 'calc(100% - 32px)',
            height: '52px',
            margin: '0 16px 16px 16px',
            fontWeight: '700',
            fontSize: '1rem',
            boxShadow: '0 8px 16px rgba(255, 43, 82, 0.18)',
            backgroundColor: '#FF2B52',
            borderRadius: '12px',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#e01e41',
              boxShadow: '0 10px 20px rgba(255, 43, 82, 0.35)',
              transform: 'translateY(-2px)',
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
      
      {product.stock > 0 && isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            width: '80%',
            textAlign: 'center',
          }}
        >
          <Button
            variant="contained"
            startIcon={<Visibility fontSize="small" />}
            component={Link}
            to={`/products/${product.id}`}
            size="medium"
            className="view-details-button"
            sx={{
              borderColor: '#fff',
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.7)',
              '&:hover': {
                bgcolor: '#FF2B52',
                color: '#fff',
              },
              fontSize: '0.875rem',
              py: 1.2,
              px: 3,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textTransform: 'none',
              fontWeight: 600,
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