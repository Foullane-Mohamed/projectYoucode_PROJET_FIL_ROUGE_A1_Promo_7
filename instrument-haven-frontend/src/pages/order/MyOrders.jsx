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
  Button,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await api.orders.getMyOrders();
        // Check if response data has the expected structure
        console.log('API response:', response);
        if (response && response.data && response.data.data) {
          // In case the response data is an array directly
          const ordersData = Array.isArray(response.data.data) ? response.data.data : 
            // Or if it's nested under 'orders' key
            (response.data.data.orders ? response.data.data.orders : []);
            
          console.log('Orders data:', ordersData);
          
          // Add safety checks for shipping_address and billing_address on each order
          const processedOrders = ordersData.map(order => {
            // Convert any string shipping_address to an empty object to avoid render errors
            if (typeof order.shipping_address === 'string' || !order.shipping_address) {
              order.shipping_address = {};
            }
            
            // Convert any string billing_address to an empty object to avoid render errors
            if (typeof order.billing_address === 'string' || !order.billing_address) {
              order.billing_address = {};
            }
            
            return order;
          });
          
          setOrders(processedOrders);
        } else {
          console.error('Unexpected response format:', response);
          setError('Failed to load your orders. Please try again later.');
        }
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
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ReceiptIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Orders
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Alert 
            severity="info"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              },
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            Please log in to view your order history.
          </Alert>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              sx={{ 
                px: 4,
                py: 1.2,
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Go to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ReceiptIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Orders
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Loading your orders...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ReceiptIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Orders
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              },
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            {error}
          </Alert>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              size="large"
              sx={{ 
                px: 4,
                py: 1.2,
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ReceiptIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Orders
          </Typography>
        </Box>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed rgba(0,0,0,0.12)',
            bgcolor: 'rgba(248,249,250,0.7)'
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 70, color: 'primary.main', opacity: 0.6, mb: 3 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            You haven't placed any orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            Start exploring our collection of musical instruments and place your first order. Your order history will appear here.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{ 
              mt: 2,
              px: 4,
              py: 1.5,
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Browse Instruments
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ReceiptIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Orders
        </Typography>
      </Box>
      
      {orders.map((order) => (
        <Paper 
          key={order.id} 
          elevation={0} 
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
              borderColor: 'rgba(0,0,0,0.12)'
            }
          }}
        >
          {/* Order Header */}
          <Box 
            sx={{ 
              p: 2.5, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: expandedOrder === order.id ? '1px solid rgba(0,0,0,0.08)' : 'none',
              bgcolor: 'rgba(248,249,250,0.7)',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              cursor: 'pointer'
            }}
            onClick={() => handleOrderClick(order.id)}
          >
            <Box display="flex" alignItems="center">
              {order.status === 'completed' ? (
                <CheckCircleIcon sx={{ mr: 1.5, color: 'success.main', fontSize: 28 }} />
              ) : order.status === 'processing' ? (
                <LocalShippingIcon sx={{ mr: 1.5, color: 'info.main', fontSize: 28 }} />
              ) : order.status === 'pending' ? (
                <ScheduleIcon sx={{ mr: 1.5, color: 'warning.main', fontSize: 28 }} />
              ) : (
                <InventoryIcon sx={{ mr: 1.5, color: 'text.secondary', fontSize: 28 }} />
              )}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  Order #{order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {formatDate(order.created_at)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mt: { xs: 1, sm: 0 },
              ml: { xs: 0, sm: 'auto' },
              gap: 2
            }}>
              <Chip
                label={order.status.toUpperCase()}
                color={getStatusColor(order.status)}
                size="small"
                sx={{ 
                  fontWeight: 600, 
                  px: 1,
                  letterSpacing: '0.5px',
                  height: 28
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${parseFloat(order.total).toFixed(2)}
              </Typography>
              <ExpandMoreIcon 
                sx={{ 
                  color: 'text.secondary', 
                  fontSize: 24,
                  transform: expandedOrder === order.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }} 
              />
            </Box>
          </Box>
          
          {/* Order Details Expandable Section */}
          {expandedOrder === order.id && (
            <Box 
              sx={{ 
                p: 3, 
                bgcolor: 'white',
                borderTop: '1px solid rgba(0,0,0,0.08)' 
              }}
            >
            <Grid container spacing={4} sx={{ p: 1 }}>
              <Grid item xs={12} sm={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(248,249,250,0.5)',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Shipping Information
                    </Typography>
                  </Box>
                  
                  {order.shipping_address && typeof order.shipping_address === 'object' ? (
                    <Box sx={{ pl: 0.5 }}>
                      {order.shipping_address.name && (
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {order.shipping_address.name}
                        </Typography>
                      )}
                      {order.shipping_address.address && (
                        <Typography variant="body2" color="text.secondary">
                          {order.shipping_address.address}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {order.shipping_address.city || ''}
                        {order.shipping_address.city && order.shipping_address.state ? ', ' : ''}
                        {order.shipping_address.state || ''}
                        {(order.shipping_address.city || order.shipping_address.state) && order.shipping_address.zip_code ? ' ' : ''}
                        {order.shipping_address.zip_code || ''}
                      </Typography>
                      {order.shipping_address.country && (
                        <Typography variant="body2" color="text.secondary">
                          {order.shipping_address.country}
                        </Typography>
                      )}
                      {order.shipping_address.phone && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          <strong>Phone:</strong> {order.shipping_address.phone}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Address information unavailable
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(248,249,250,0.5)',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Payment Details
                    </Typography>
                  </Box>
                  
                  <Box sx={{ pl: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Method:</strong> {order.payment_method ? order.payment_method.replace('_', ' ').toUpperCase() : 'Unknown'}
                    </Typography>
                    
                    {order.payment_id && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Transaction ID:</strong> {order.payment_id}
                      </Typography>
                    )}
                    
                    {order.payment_status && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Status:</strong> 
                        <Chip 
                          size="small" 
                          label={order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          color={order.payment_status === 'paid' ? 'success' : 'default'}
                          sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                        />
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, px: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Order Items
                </Typography>
              </Box>
              
              <TableContainer 
                component={Paper} 
                variant="outlined" 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                }}
              >
                <Table size="medium">
                  <TableHead sx={{ bgcolor: 'rgba(248,249,250,0.8)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items && order.items.map((item) => (
                      <TableRow key={item.id || `item-${Math.random()}`} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.product ? (
                              <>
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    overflow: 'hidden',
                                    borderRadius: 1.5,
                                    mr: 2,
                                    flexShrink: 0,
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  {item.product.images && item.product.images.length > 0 ? (
                                    <img
                                      src={`http://localhost:8000/storage/${item.product.images[0]}`}
                                      alt={item.product.name}
                                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/products/main-image.jpeg';
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src="/images/products/main-image.jpeg"
                                      alt={item.product.name || 'Product'}
                                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                  )}
                                </Box>
                                <Link 
                                  to={`/products/${item.product.id}`}
                                  style={{ 
                                    textDecoration: 'none', 
                                    color: 'inherit'
                                  }}
                                >
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {item.product.name || 'Unknown Product'}
                                  </Typography>
                                </Link>
                              </>
                            ) : (
                              // Fall back to using product_name from order_items table if product relation is missing
                              <>
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    overflow: 'hidden',
                                    borderRadius: 1.5,
                                    mr: 2,
                                    flexShrink: 0,
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <img
                                    src="/images/products/main-image.jpeg"
                                    alt={item.product_name || 'Product'}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                  />
                                </Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {item.product_name || 'Unknown Product'}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ${parseFloat(item.price || 0).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={item.quantity || 0} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600, 
                              minWidth: '36px',
                              bgcolor: 'rgba(0,0,0,0.06)'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${((parseFloat(item.price || 0) * (item.quantity || 0))).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Display coupon discount if applicable */}
                    {order.coupon && (
                      <TableRow sx={{ bgcolor: 'rgba(248,249,250,0.4)' }}>
                        <TableCell colSpan={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Coupon Applied: 
                              <Chip 
                                label={order.coupon.code} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ ml: 1, height: 24 }}
                              />
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Discount:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                            -${order.coupon.type === 'percentage' 
                              ? ((order.coupon.discount / 100) * parseFloat(order.total)).toFixed(2)
                              : parseFloat(order.coupon.discount).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    
                    <TableRow sx={{ bgcolor: 'rgba(248,249,250,0.8)' }}>
                      <TableCell colSpan={3} align="right" sx={{ pr: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Order Total:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ${parseFloat(order.total).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Order Actions */}
              {order.status === 'pending' && (
                <Box 
                  sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ 
                      borderRadius: 6,
                      textTransform: 'none',
                      px: 2
                    }}
                    onClick={() => {
                      // Implement cancel order functionality
                      alert('Cancel order functionality will be implemented in the future');
                    }}
                  >
                    Cancel Order
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
          )}
      </Paper>
      ))}
    </Container>
  );
};

export default MyOrders;