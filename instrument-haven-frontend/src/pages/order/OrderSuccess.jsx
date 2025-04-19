import { useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Grid,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ShoppingBag as ShoppingBagIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  
  // Get order details from location state or redirect to home
  const order = location.state?.order;
  
  useEffect(() => {
    // If no order in state, redirect to home
    if (!order) {
      navigate('/');
      return;
    }
    
    // Clear the cart after successful order
    clearCart();
    
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };
    
    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }
      
      confetti({
        particleCount: 2,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 }
      });
      
    }, 250);
    
    return () => clearInterval(confettiInterval);
  }, [order, clearCart, navigate]);
  
  if (!order) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon
          sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
        />
        
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        
        <Typography variant="subtitle1" paragraph color="text.secondary">
          Your order has been placed successfully and is being processed.
        </Typography>
        
        <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
          Order confirmation has been sent to your email.
        </Alert>
        
        <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography variant="body2">Order Number:</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1" fontWeight="medium">#{order.id}</Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Typography variant="body2">Order Date:</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1">{new Date(order.created_at).toLocaleString()}</Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Typography variant="body2">Payment Method:</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1">{order.payment_method.replace('_', ' ').toUpperCase()}</Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Typography variant="body2">Total Amount:</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1" fontWeight="bold">${parseFloat(order.total).toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to={`/orders/${order.id}`}
            variant="contained"
            color="primary"
            startIcon={<ReceiptIcon />}
          >
            View Order Details
          </Button>
          
          <Button
            component={Link}
            to="/my-orders"
            variant="outlined"
            color="primary"
            startIcon={<ShoppingBagIcon />}
          >
            My Orders
          </Button>
          
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<HomeIcon />}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;