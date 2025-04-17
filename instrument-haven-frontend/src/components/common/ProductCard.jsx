import { useContext } from 'react';
import { Link } from 'react-router-dom';
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
  Stack
} from '@mui/material';
import { AddShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

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

  return (
    <Card
      component={Link}
      to={`/products/${product.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={
            product.images && product.images.length > 0
              ? `${process.env.REACT_APP_API_URL}/storage/${product.images[0]}`
              : '/placeholder.png'
          }
          alt={product.name}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={handleWishlistToggle}
        >
          {isInWishlist(product.id) ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
            height: '40px',
          }}
        >
          {product.description}
        </Typography>
        {product.tags && product.tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            {product.tags.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" />
            ))}
          </Stack>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Button
            size="small"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            variant="contained"
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;