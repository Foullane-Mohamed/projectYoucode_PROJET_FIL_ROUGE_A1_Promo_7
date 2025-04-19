import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  LocalOffer as CouponIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const OrderReview = ({
  cart,
  shippingData,
  paymentData,
  totalItems,
  subtotal,
  discount,
  total,
  couponCode,
  couponData,
  onApplyCoupon,
  onRemoveCoupon,
  onCouponCodeChange,
  onBack,
  onPlaceOrder,
  loading,
}) => {
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  
  const handleApplyCoupon = async () => {
    setApplyingCoupon(true);
    await onApplyCoupon(couponCode);
    setApplyingCoupon(false);
  };
  
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit/Debit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
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
    return countries[code] || code;
  };
  
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
              Order Items ({totalItems})
            </Typography>
            
            <List sx={{ width: '100%' }}>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  alignItems="flex-start"
                  sx={{ 
                    px: 0,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { 
                      borderBottom: 'none' 
                    } 
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      alt={item.name}
                      src={item.image ? `${import.meta.env.VITE_STORAGE_URL}/${item.image}` : '/placeholder.png'}
                      sx={{ width: 60, height: 60, mr: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link 
                        to={`/products/${item.id}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography variant="subtitle1" component="span">
                          {item.name}
                        </Typography>
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                        </Typography>
                      </>
                    }
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="subtitle1" component="span">
                    ${(item.quantity * item.price).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
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
                {`${shippingData.firstName} ${shippingData.lastName}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingData.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getCountryName(shippingData.country)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Phone: ${shippingData.phone}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Email: ${shippingData.email}`}
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
                {formatPaymentMethod(paymentData.method)}
              </Typography>
              
              {paymentData.method === 'credit_card' && paymentData.card_number && (
                <Typography variant="body2" color="text.secondary">
                  Card ending in {paymentData.card_number.slice(-4)}
                </Typography>
              )}
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
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>
              
              {discount > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1 
                }}>
                  <Typography variant="body1">Discount:</Typography>
                  <Typography variant="body1" color="error">
                    -${discount.toFixed(2)}
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
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            {/* Apply Coupon */}
            {!couponData ? (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Apply Coupon Code
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <TextField
                    size="small"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={onCouponCodeChange}
                    sx={{ flexGrow: 1, mr: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CouponIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || applyingCoupon}
                  >
                    {applyingCoupon ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  borderRadius: 1,
                  px: 2,
                  py: 1
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" component="div">
                      Coupon applied: 
                      <Box component="span" fontWeight="bold" sx={{ ml: 1 }}>
                        {couponData.code}
                      </Box>
                      <Box component="div" fontSize="0.75rem">
                        {couponData.type === 'percentage' 
                          ? `${couponData.discount}% off`
                          : `$${couponData.discount} off`
                        }
                      </Box>
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={onRemoveCoupon}
                    sx={{ color: 'inherit' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
            
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
          
          <Alert severity="info" variant="outlined">
            This is a demo application. No real payments will be processed.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderReview;