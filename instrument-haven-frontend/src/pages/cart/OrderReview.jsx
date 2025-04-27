import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const ProductImage = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('/images/categories/placeholder.jpg');
  
  useEffect(() => {
    if (product?.thumbnail) {
      setImageSrc(`/images/products/${product.thumbnail}`);
      setImageError(false);
    } else if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      setImageSrc(`/images/products/${product.images[0]}`);
      setImageError(false);
    } else {
      setImageSrc('/images/categories/placeholder.jpg');
    }
  }, [product]);
  
  const handleError = () => {
    setImageError(true);
    setImageSrc('/images/categories/placeholder.jpg');
  };
  
  return (
    <Avatar
      variant="rounded"
      alt={product ? product.name : 'Product'}
      src={imageError ? '/images/categories/placeholder.jpg' : imageSrc}
      sx={{ 
        width: 60, 
        height: 60, 
        mr: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 1,
        bgcolor: '#f5f7fa',
      }}
      imgProps={{
        style: {
          objectFit: 'contain',
          width: '100%',
          height: '100%',
          padding: '4px',
        },
        onError: handleError
      }}
    />
  );
};

const OrderReview = ({
  cart,
  shippingData,
  paymentData,
  totalItems,
  subtotal = 0,
  discount = 0,
  total = 0,
  couponData,
  onBack,
  onPlaceOrder,
  loading,
}) => {
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method ? method.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Cash on Delivery';
    }
  };
  
  const getCountryName = (code) => {
    const countries = {
      'MA': 'Morocco',
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'FR': 'France',
      'DE': 'Germany',
      'ES': 'Spain',
      'IT': 'Italy',
    };
    return code ? (countries[code] || code) : '';
  };

  // Ensure cart items exist before rendering
  const cartItems = cart && cart.items ? cart.items : [];
  
  // Calculate safeguarded subtotal
  const safeSubtotal = typeof subtotal === 'number' ? subtotal : 0;
  const safeDiscount = typeof discount === 'number' ? discount : 0;
  const safeTotal = typeof total === 'number' ? total : 0;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Order
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {/* Order Items */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Order Items ({totalItems || 0})
            </Typography>
            
            <List sx={{ width: '100%' }}>
              {cartItems.map((item) => {
                // Get safe price value
                const itemPrice = item.price || (item.product ? item.product.price : 0) || 0;
                return (
                  <ListItem
                  key={item.id}
                  alignItems="flex-start"
                  sx={{ 
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { 
                    borderBottom: 'none' 
                    },
                      '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.01)'
                    }
                  }}
                >
                    <ListItemAvatar>
                      <ProductImage product={item.product} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link 
                          to={`/products/${item.product_id}`} 
                          style={{ textDecoration: 'none' }}
                        >
                          <Typography variant="subtitle1" component="span" sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            '&:hover': { color: 'primary.main' }
                          }}>
                            {item.product ? item.product.name : 'Product'}
                          </Typography>
                        </Link>
                      }
                      secondary={
                        <>
                          <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Qty: {item.quantity || 1} × <span style={{ fontWeight: 500 }}>${parseFloat(itemPrice).toFixed(2)}</span>
                          </Typography>
                        </>
                      }
                      sx={{ mr: 2 }}
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF2B52' }}>
                      ${((item.quantity || 1) * itemPrice).toFixed(2)}
                    </Typography>
                  </ListItem>
                );
              })}
              
              {cartItems.length === 0 && (
                <ListItem>
                  <ListItemText primary="No items in cart" />
                </ListItem>
              )}
            </List>
          </Paper>
          
          {/* Shipping Info */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShippingIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                Shipping Information
              </Typography>
            </Box>
            
            <Box sx={{ ml: 4 }}>
              <Typography variant="body1">
                {`${shippingData?.firstName || ''} ${shippingData?.lastName || ''}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingData?.address || ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${shippingData?.city || ''}, ${shippingData?.state || ''} ${shippingData?.zipCode || ''}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getCountryName(shippingData?.country || '')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Phone: ${shippingData?.phone || ''}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Email: ${shippingData?.email || ''}`}
              </Typography>
            </Box>
          </Paper>
          
          {/* Payment Method */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaymentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                Payment Method
              </Typography>
            </Box>
            
            <Box sx={{ ml: 4 }}>
              <Typography variant="body1">
                {formatPaymentMethod(paymentData?.method)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          {/* Order Summary */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 1 
              }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">${safeSubtotal.toFixed(2)}</Typography>
              </Box>
              
              {safeDiscount > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1 
                }}>
                  <Typography variant="body1">
                    Discount{couponData ? ` (${couponData.code})` : ''}:
                  </Typography>
                  <Typography variant="body1" color="error">
                    -${safeDiscount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              {/* Show cart coupon discount if present */}
              {!safeDiscount && cart && cart.discount > 0 && cart.coupon && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1 
                }}>
                  <Typography variant="body1">
                    Discount ({cart.coupon.code}):
                  </Typography>
                  <Typography variant="body1" color="error">
                    -${Number(cart.discount).toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 1 
              }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">Free</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${(safeTotal > 0 ? safeTotal : (cart && cart.total ? cart.total : (safeSubtotal - (safeDiscount || (cart && cart.discount ? cart.discount : 0))))).toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={onPlaceOrder}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Place Order'
                )}
              </Button>
              
              <Button
                onClick={onBack}
                fullWidth
                sx={{ mt: 1 }}
                disabled={loading}
              >
                Back to Payment
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderReview;