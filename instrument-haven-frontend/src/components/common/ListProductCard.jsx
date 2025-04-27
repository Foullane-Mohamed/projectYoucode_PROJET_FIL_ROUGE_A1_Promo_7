import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Rating,
  Chip
} from '@mui/material';
import { AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../../styles/listProductCard.css';

const ListProductCard = ({ product }) => {
  if (!product) {
    console.error('ListProductCard received null or undefined product');
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
    <Card className="list-product-card">
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
          }}
        />
      )}
      
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
      
      <Box className="product-image">
        <Link to={`/products/${product.id}`}>
          <img
            src={
              product.thumbnail
                ? `/images/products/${product.thumbnail}`
                : (product.images && Array.isArray(product.images) && product.images.length > 0
                  ? `/images/products/${product.images[0]}`
                  : '/images/categories/placeholder.jpg')
            }
            alt={product.name || 'Product'}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite error loop
              e.target.src = '/images/categories/placeholder.jpg';
            }}
          />
        </Link>
      </Box>
      
      <CardContent className="product-content">
        <Typography 
          component={Link} 
          to={`/products/${product.id}`}
          className="product-title"
          sx={{
            textDecoration: 'none',
            display: 'block',
            '&:hover': {
              color: '#FF2B52',
            }
          }}
        >
          {product.name || 'Unnamed Product'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={product.average_rating || 0} 
            readOnly 
            size="small" 
            precision={0.5} 
          />
          <Typography variant="body2" sx={{ ml: 0.5, fontSize: '0.75rem', color: '#666' }}>
            ({product.reviews ? product.reviews.length : 0})
          </Typography>
        </Box>
        
        <Typography className="product-description">
          {product.description || 'No description available'}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          {product.on_sale && product.sale_price ? (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography className="product-price">
                ${(parseFloat(product.sale_price) || 0).toFixed(2)}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ textDecoration: 'line-through', fontSize: '1rem', color: '#999' }}
              >
                ${(parseFloat(product.price) || 0).toFixed(2)}
              </Typography>
              <Chip
                label={`${Math.round(100 - ((parseFloat(product.sale_price) / parseFloat(product.price)) * 100))}% OFF`}
                size="small"
                className="discount-tag"
              />
            </Box>
          ) : (
            <Typography className="product-price">
              ${(parseFloat(product.price) || 0).toFixed(2)}
            </Typography>
          )}
        </Box>
        
        <Box className="product-actions">
          <Button
            variant="contained"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            sx={{
              borderRadius: '10px',
              fontWeight: '600',
              boxShadow: '0 4px 10px rgba(255, 43, 82, 0.2)',
              backgroundColor: '#FF2B52',
              '&:hover': {
                backgroundColor: '#e01e41',
                boxShadow: '0 6px 12px rgba(255, 43, 82, 0.3)'
              },
              '&.Mui-disabled': {
                backgroundColor: '#f5f5f5',
                color: '#999'
              }
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
          </Button>
          
          <Button
            variant="outlined"
            component={Link}
            to={`/products/${product.id}`}
            sx={{
              ml: 2,
              borderColor: '#ccc',
              color: '#666',
              borderRadius: '10px',
              '&:hover': {
                borderColor: '#FF2B52',
                color: '#FF2B52',
                backgroundColor: 'rgba(255, 43, 82, 0.04)'
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListProductCard;