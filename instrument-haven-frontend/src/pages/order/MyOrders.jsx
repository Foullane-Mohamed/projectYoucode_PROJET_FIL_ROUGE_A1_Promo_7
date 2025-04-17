import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await api.orders.getMyOrders();
        setOrders(response.data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Alert severity="info">Please log in to view your orders.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            You haven't placed any orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            When you place orders, they will appear here.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      
      {orders.map((order) => (
        <Accordion key={order.id} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`order-${order.id}-content`}
            id={`order-${order.id}-header`}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              width: '100%', 
              alignItems: 'center',
              flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}>
              <Box>
                <Typography variant="subtitle1">
                  Order #{order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(order.created_at)}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mt: { xs: 1, sm: 0 },
                ml: { xs: 0, sm: 'auto' }
              }}>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  size="small"
                  sx={{ mr: 2 }}
                />
                <Typography variant="subtitle1">
                  ${parseFloat(order.total).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Shipping Information:
                </Typography>
                <Typography variant="body2">
                  {order.shipping_address}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Details:
                </Typography>
                <Typography variant="body2">
                  Method: {order.payment_method.replace('_', ' ').toUpperCase()}
                </Typography>
                {order.payment_id && (
                  <Typography variant="body2">
                    Transaction ID: {order.payment_id}
                  </Typography>
                )}
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Order Items:
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
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
                                    width: 40,
                                    height: 40,
                                    overflow: 'hidden',
                                    borderRadius: 1,
                                    mr: 1,
                                    flexShrink: 0,
                                    bgcolor: 'background.paper',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <img
                                    src={`http://localhost:8000/storage/${item.product.images[0]}`}
                                    alt={item.product.name}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    overflow: 'hidden',
                                    borderRadius: 1,
                                    mr: 1,
                                    flexShrink: 0,
                                    bgcolor: 'background.paper',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <img
                                    src="/placeholder.png"
                                    alt={item.product.name}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                  />
                                </Box>
                              )}
                              <Link 
                                to={`/products/${item.product.id}`}
                                style={{ 
                                  textDecoration: 'none', 
                                  color: 'inherit'
                                }}
                              >
                                <Typography variant="body2">
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
                  
                  {/* Display coupon discount if applicable */}
                  {order.coupon && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="body2">
                          Coupon: {order.coupon.code}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          Discount:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="error">
                          -${order.coupon.type === 'percentage' 
                            ? ((order.coupon.discount / 100) * parseFloat(order.total)).toFixed(2)
                            : parseFloat(order.coupon.discount).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle2">Total:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        ${parseFloat(order.total).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            {order.status === 'pending' && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    // Implement cancel order functionality
                    alert('Cancel order functionality will be implemented in the future');
                  }}
                >
                  Cancel Order
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default MyOrders;