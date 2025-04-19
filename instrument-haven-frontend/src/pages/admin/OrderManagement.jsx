import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Use the admin API to fetch orders
      const response = await api.admin.getOrders();
      console.log('Orders response:', response);
      
      // Handle different response formats
      const ordersData = Array.isArray(response.data) ? 
        response.data : 
        (response.data && Array.isArray(response.data.data)) ? 
          response.data.data : 
          (response.data && response.data.orders) ? 
            response.data.orders : [];
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch orders. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Use the admin API to update order status
      const response = await api.admin.updateOrder(orderId, { status: newStatus });
      console.log('Update order response:', response);
      
      // Update orders in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Also update current order if details dialog is open
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({
          ...currentOrder,
          status: newStatus
        });
      }
      
      setSnackbar({
        open: true,
        message: 'Order status updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error);
      setSnackbar({
        open: true,
        message: `Failed to update order status: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setOpenOrderDetails(true);
  };

  const handleCloseOrderDetails = () => {
    setOpenOrderDetails(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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

  if (loading) {
    return (
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
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Order Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total?.toFixed(2)}</TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        size="small"
                        sx={{
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: `${getStatusColor(order.status)}.main`,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: `${getStatusColor(order.status)}.main`,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: `${getStatusColor(order.status)}.main`,
                          },
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary"
                      onClick={() => handleViewOrder(order)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog 
        open={openOrderDetails} 
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order #{currentOrder?.id}
        </DialogTitle>
        <DialogContent>
          {currentOrder && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Customer Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {currentOrder.user?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {currentOrder.user?.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Shipping Address:</strong> {currentOrder.shipping_address}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Order Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {new Date(currentOrder.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong>{' '}
                    <Chip 
                      label={currentOrder.status} 
                      color={getStatusColor(currentOrder.status)} 
                      size="small" 
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Payment Method:</strong> {currentOrder.payment_method}
                  </Typography>
                  {currentOrder.coupon && (
                    <Typography variant="body2">
                      <strong>Coupon Applied:</strong> {currentOrder.coupon.code}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrder.items && currentOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.product && (
                              <>
                                {item.product.images && item.product.images.length > 0 && (
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
                                      src={`${process.env.REACT_APP_API_URL}/storage/${item.product.images[0]}`}
                                      alt={item.product.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  </Box>
                                )}
                                <Typography variant="body2">{item.product.name}</Typography>
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle2">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">${currentOrder.total.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Update Order Status
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={currentOrder.status}
                    onChange={(e) => handleStatusChange(currentOrder.id, e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderManagement;