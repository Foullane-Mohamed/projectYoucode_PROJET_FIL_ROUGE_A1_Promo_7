import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Done as DoneIcon,
} from '@mui/icons-material';

// Transition effect for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderConfirmation = ({ 
  orderData, 
  cart, 
  shippingData, 
  paymentData, 
  totalPrice, 
  discountAmount, 
  finalPrice,
  onBack,
  onConfirm,
  loading
}) => {
  const navigate = useNavigate();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };
  
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };
  
  const handleConfirmOrder = async () => {
    // Call the original onConfirm function to process the order
    const success = await onConfirm();
    
    // Only redirect to home if the order was successful
    if (success) {
      // Close the confirmation dialog
      setConfirmDialogOpen(false);
      
      // Show success dialog
      setSuccessDialogOpen(true);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      // Close the dialog if there was an error
      // Error details will be shown on the order page
      setConfirmDialogOpen(false);
    }
  };
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 36, mr: 2 }} />
          <Typography variant="h5">Order Confirmation</Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ShippingIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Shipping Address</Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2">{`${shippingData.firstName} ${shippingData.lastName}`}</Typography>
                  <Typography variant="body2">{shippingData.address}</Typography>
                  <Typography variant="body2">
                    {`${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`}
                  </Typography>
                  <Typography variant="body2">{shippingData.country}</Typography>
                  <Typography variant="body2">{`Phone: ${shippingData.phone}`}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Payment Method</Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2">
                    {paymentData.method === 'cash_on_delivery' ? 'Cash on Delivery' : paymentData.method}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Order Summary</Typography>
        
        <List>
          {cart.items.map((item) => (
            <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
              <ListItemText 
                primary={item.product ? item.product.name : 'Product'}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body2">
                ${((item.price || (item.product ? item.product.price : 0)) * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Subtotal:</Typography>
          <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
        </Box>
        
        {discountAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Discount:</Typography>
            <Typography variant="body1" color="error">-${discountAmount.toFixed(2)}</Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Shipping:</Typography>
          <Typography variant="body1">Free</Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">${finalPrice.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={onBack} 
            variant="outlined" 
            disabled={loading}
          >
            Back
          </Button>
          <Button 
            onClick={handleOpenConfirmDialog}
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={<ArrowForwardIcon />}
          >
            Confirm Purchase
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseConfirmDialog}
        aria-describedby="confirm-order-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 5 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center' 
          }}>
            <CheckCircleIcon 
              color="success" 
              sx={{ fontSize: 80, mb: 3 }} 
            />
            <Typography variant="h4" gutterBottom>
              Your order is ready!
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Are you sure you want to place this order?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Once confirmed, your order will be processed immediately.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button 
            onClick={handleCloseConfirmDialog} 
            color="inherit"
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmOrder} 
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={<DoneIcon />}
          >
            Yes, Place My Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        TransitionComponent={Transition}
        aria-describedby="success-order-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 5 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center' 
          }}>
            <CheckCircleIcon 
              color="success" 
              sx={{ fontSize: 100, mb: 3 }} 
            />
            <Typography variant="h4" gutterBottom>
              Order Placed Successfully!
            </Typography>
            <Typography variant="subtitle1">
              Thank you for your purchase.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You will be redirected to the home page shortly...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default OrderConfirmation;