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
      try {
        const response = await api.get('/my-orders');
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography variant="subtitle1">
                Order #{order.id} - {new Date(order.created_at).toLocaleDateString()}
              </Typography>
              <Box>
                <Chip
                  label={order.status}
                  color={
                    order.status === 'completed'
                      ? 'success'
                      : order.status === 'cancelled'
                      ? 'error'
                      : 'primary'
                  }
                  size="small"
                />
                <Typography variant="subtitle1" sx={{ ml: 2, display: 'inline' }}>
                  ${order.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom>
              Shipping Address:
            </Typography>
            <Typography variant="body2" paragraph>
              {order.shipping_address}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Payment Method:
            </Typography>
            <Typography variant="body2" paragraph>
              {order.payment_method}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Order Items:
            </Typography>
            <TableContainer component={Paper} variant="outlined">
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
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              overflow: 'hidden',
                              borderRadius: 1,
                              mr: 1,
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={
                                item.product.images && item.product.images.length > 0
                                  ? `${process.env.REACT_APP_API_URL}/storage/${item.product.images[0]}`
                                  : '/placeholder.png'
                              }
                              alt={item.product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {item.product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default MyOrders;