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
} from '@mui/material';
import { AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';

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

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        },
        border: 'none',
        borderRadius: '12px',
      }}
    >
      <IconButton
        aria-label="add to wishlist"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          '&:hover': {
            bgcolor: 'white',
          },
          width: 36,
          height: 36,
        }}
        onClick={handleWishlistToggle}
      >
        {isInWishlist(product.id) ? (
          <Favorite color="error" />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      <CardActionArea component={Link} to={`/products/${product.id}`}>
        <CardMedia
          component="img"
          height="200"
          image={
            product.thumbnail
              ? `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.thumbnail}`
              : (product.images && Array.isArray(product.images) && product.images.length > 0
                ? `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${product.images[0]}`
                : '/images/categories/placeholder.jpg')
          }
          alt={product.name || 'Product'}
          sx={{ 
            objectFit: 'contain', 
            p: 2, 
            bgcolor: 'background.paper',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite error loop
            e.target.src = '/images/categories/placeholder.jpg';
          }}
        />
        <CardContent sx={{ flexGrow: 1, pb: 1, px: 2 }}>
          <Typography 
            gutterBottom 
            variant="subtitle1" 
            component="div" 
            noWrap
            sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333' }}
          >
            {product.name || 'Unnamed Product'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.average_rating || 0} readOnly size="small" precision={0.5} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
              ({product.reviews ? product.reviews.length : 0})
            </Typography>
          </Box>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
              height: '36px',
              fontSize: '0.8rem',
              color: '#666'
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
          p: 2,
          pt: 0,
          mt: 'auto',
        }}
      >
        {product.on_sale && product.sale_price ? (
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography 
              variant="h6" 
              color="primary.main" 
              sx={{ fontWeight: 'bold' }}
            >
              ${(parseFloat(product.sale_price) || 0).toFixed(2)}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ textDecoration: 'line-through', fontSize: '0.8rem' }}
            >
              ${(parseFloat(product.price) || 0).toFixed(2)}
            </Typography>
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                px: 1, 
                py: 0.3, 
                borderRadius: '10px', 
                fontSize: '0.7rem',
                fontWeight: 'bold',
                ml: 0.5
              }}
            >
              {Math.round(100 - ((parseFloat(product.sale_price) / parseFloat(product.price)) * 100))}% OFF
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
            ${(parseFloat(product.price) || 0).toFixed(2)}
          </Typography>
        )}
        <Button
          size="small"
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          sx={{
            borderRadius: '30px',
            px: 2,
            minWidth: '100px',
            fontWeight: 'medium',
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 3px 8px rgba(255, 43, 82, 0.3)'
            }
          }}
        >
          {product.stock > 0 ? 'Add' : 'Sold Out'}
        </Button>
      </Box>
      
      {product.stock <= 0 && (
        <Chip 
          label="Out of Stock" 
          color="error" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            left: 16
          }}
        />
      )}
    </Card>
  );
};

export default ProductCard;