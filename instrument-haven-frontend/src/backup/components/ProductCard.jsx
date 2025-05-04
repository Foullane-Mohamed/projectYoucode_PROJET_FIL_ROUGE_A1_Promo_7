import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  CardActionArea,
  Rating,
  Chip
} from '@mui/material';
import { AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {

  if (!product) {
    console.error('ProductCard received null or undefined product');
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
    
  
      if (inWishlist) {
        const result = await removeFromWishlist(product.id);
        if (result.success) {
          toast.success(`${product.name} removed from wishlist!`);
        } 
      } else {
        const result = await addToWishlist(product.id);
        if (result.success) {
          toast.success(`${product.name} added to wishlist!`);
        } 
      }
    
  };

  return (
    <Card
      className="product-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid #e0e0e0',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: 'white'
      }}
    >
      <IconButton
        aria-label="add to wishlist"
        className="wishlist-button"
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
        <Box sx={{ position: 'relative', bgcolor: '#f5f7fa', pt: 3, px: 3, pb: 2, height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardMedia
            component="img"
            height="160"
            image={
              product.thumbnail
                ? `/images/products/${product.thumbnail}`
                : (product.images && Array.isArray(product.images) && product.images.length > 0
                  ? `/images/products/${product.images[0]}`
                  : '/images/categories/placeholder.jpg')
            }
            alt={product.name || 'Product'}
            sx={{ 
              objectFit: 'contain', 
              maxHeight: '180px',
              transition: 'transform 0.4s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/images/categories/placeholder.jpg';
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 3, pt: 2, height: '120px', overflow: 'hidden' }}>
          <Typography 
            gutterBottom 
            variant="subtitle1" 
            component="div" 
            noWrap
            className="product-title"
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
            className="product-description"
            sx={{
              mb: 1,
              minHeight: '36px',
              fontSize: '0.8rem',
              color: '#666',
              lineHeight: 1.3
            }}
          >
            {product.description || 'No description available'}
          </Typography>
          

        </CardContent>
      </CardActionArea>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          pt: 2,
          pb: 3,
          mt: 'auto',
          backgroundColor: 'white',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          height: '80px',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%'
        }}
      >
        {product.on_sale && product.sale_price ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                className="price-display"
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
            <Chip
              label={`${Math.round(100 - ((parseFloat(product.sale_price) / parseFloat(product.price)) * 100))}% OFF`}
              size="small"
              className="discount-tag"
              sx={{
                height: '22px',
                '.MuiChip-label': {
                  px: 1
                }
              }}
            />
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
          className="add-cart-button"
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
            borderRadius: '6px',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)',
              backgroundSize: '6px 6px',
              zIndex: -1,
              opacity: 0.3,
              borderRadius: '6px'
            }
          }}
        />
      )}
    </Card>
  );
};

export default ProductCard;