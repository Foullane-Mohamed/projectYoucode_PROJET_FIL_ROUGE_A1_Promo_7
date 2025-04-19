import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await api.orders.getById(id);
        setOrder(response.data.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await api.orders.cancel(id, cancelReason);
      // Update the order status locally
      setOrder(prev => ({
        ...prev,
        status: 'cancelled'
      }));
      setCancelDialogOpen(false);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order. Please try again later.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Order Details
        </Typography>
        <Alert severity="info">Please log in to view order details.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Order Details
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Order Details
        </Typography>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate('/my-orders')}
        >
          Back to My Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Order Details
        </Typography>
        <Alert severity="warning">Order not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate('/my-orders')}
        >
          Back to My Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/my-orders')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Order #{order.id}
        </Typography>
        <Chip
          label={order.status}
          color={getStatusColor(order.status)}
          size="small"
          sx={{ ml: 2 }}
        />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Order Information
            </Typography>
            <Typography variant="body2">
              <strong>Placed on:</strong> {formatDate(order.created_at)}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {order.status}
            </Typography>
            {order.updated_at && (
              <Typography variant="body2">
                <strong>Last updated:</strong> {formatDate(order.updated_at)}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Customer Information
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {`${order.user?.first_name} ${order.user?.last_name}`}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {order.user?.email}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {order.phone || 'Not provided'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Shipping Information
            </Typography>
            <Typography variant="body2" whiteSpace="pre-line">
              {order.shipping_address}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Payment Information
            </Typography>
            <Typography variant="body2">
              <strong>Method:</strong> {order.payment_method.replace('_', ' ').toUpperCase()}
            </Typography>
            {order.payment_id && (
              <Typography variant="body2">
                <strong>Transaction ID:</strong> {order.payment_id}
              </Typography>
            )}
            <Typography variant="body2">
              <strong>Status:</strong> {order.payment_status || 'Pending'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Order Items
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items && order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.product && (
                      <>
                        {item.product.images && item.product.images.length > 0 ? (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              overflow: 'hidden',
                              borderRadius: 1,
                              mr: 2,
                              flexShrink: 0,
                              bgcolor: 'background.paper',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <img
                              src={`${import.meta.env.VITE_STORAGE_URL}/${item.product.images[0]}`}
                              alt={item.product.name}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              overflow: 'hidden',
                              borderRadius: 1,
                              mr: 2,
                              flexShrink: 0,
                              bgcolor: 'background.paper',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <ShoppingBagIcon />
                          </Box>
                        )}
                        <Link 
                          to={`/products/${item.product.id}`}
                          style={{ 
                            textDecoration: 'none', 
                            color: 'inherit'
                          }}
                        >
                          <Typography variant="body1">
                            {item.product.name}
                          </Typography>
                        </Link>
                      </>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">${parseFloat(item.price).toFixed(2)}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>${parseFloat(order.subtotal).toFixed(2)}</Typography>
        </Box>
        
        {order.coupon && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>
              Discount ({order.coupon.code}):
            </Typography>
            <Typography color="error">
              -${parseFloat(order.discount).toFixed(2)}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Shipping:</Typography>
          <Typography>${parseFloat(order.shipping_cost).toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tax:</Typography>
          <Typography>${parseFloat(order.tax).toFixed(2)}</Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">${parseFloat(order.total).toFixed(2)}</Typography>
        </Box>
      </Paper>

      {order.status === 'pending' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => setCancelDialogOpen(true)}
          >
            Cancel Order
          </Button>
        </Box>
      )}

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for cancellation"
            fullWidth
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
            Back
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            color="error" 
            disabled={cancelling || !cancelReason.trim()}
          >
            {cancelling ? <CircularProgress size={24} /> : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderDetail;