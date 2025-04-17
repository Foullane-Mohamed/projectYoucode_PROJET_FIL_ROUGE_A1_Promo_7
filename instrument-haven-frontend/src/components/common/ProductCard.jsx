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
  Chip,
  Stack,
  CardActionArea,
  Rating,
} from '@mui/material';
import { AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
          boxShadow: 4,
        },
      }}
    >
      <IconButton
        aria-label="add to wishlist"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          },
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
          height="180"
          image={
            product.images && product.images.length > 0
              ? `http://localhost:8000/storage/${product.images[0]}`
              : '/placeholder.png'
          }
          alt={product.name}
          sx={{ objectFit: 'contain', p: 2, bgcolor: 'background.paper' }}
        />
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={4} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              (24)
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
              height: '40px',
            }}
          >
            {product.description}
          </Typography>
          
          {product.tags && product.tags.length > 0 && (
            <Stack 
              direction="row" 
              spacing={0.5} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: 0.5, 
                mb: 1.5,
                height: '24px',
                overflow: 'hidden'
              }}
            >
              {product.tags.slice(0, 2).map((tag) => (
                <Chip key={tag.id} label={tag.name} size="small" />
              ))}
              {product.tags.length > 2 && (
                <Typography variant="caption" color="text.secondary">
                  +{product.tags.length - 2} more
                </Typography>
              )}
            </Stack>
          )}
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
        <Typography variant="h6" color="primary">
          ${parseFloat(product.price).toFixed(2)}
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
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