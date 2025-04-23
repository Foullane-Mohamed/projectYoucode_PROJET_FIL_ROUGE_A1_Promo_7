import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
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
  Avatar,
  TextField,
  InputAdornment,
  Tooltip,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const [storageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');
  
  // Define counts for each status category
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status?.toLowerCase() || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;
    
    const matchesSearch = searchQuery === '' || 
      (order.id?.toString().includes(searchQuery) || 
       (order.user_name || order.user?.name || '')?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (order.order_number || '')?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
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
      
      // Handle different response formats according to API documentation
      const ordersData = response.data?.data?.orders || 
                      response.data?.orders || 
                      (Array.isArray(response.data) ? response.data : []);
      
      // Ensure each order has appropriate user data
      const processedOrders = ordersData.map(order => {
        // Create a proper user object if not present but user_name exists
        if (!order.user && order.user_name) {
          order.user = {
            name: order.user_name,
            email: order.user_email || ''
          };
        }
        return order;
      });
      
      setOrders(processedOrders);
      toast.success('Orders loaded successfully');
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders: ' + (error.response?.data?.message || 'Unknown error'));
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setStatusFilter(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'][newValue]);
    setPage(0);
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.admin.updateOrder(orderId, { status: newStatus });
      console.log('Update order response:', response);
      
      // Extract updated order from response according to API documentation
      const updatedOrder = response.data?.data?.order || response.data?.order || { id: orderId, status: newStatus };
      
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
      
      toast.success('Order status updated successfully!');
      setSnackbar({
        open: true,
        message: 'Order status updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error);
      
      // Extract detailed error information
      let errorMessage = 'Unknown error';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const validationErrors = error.response.data.errors;
        errorMessage = Object.values(validationErrors)
          .flat()
          .join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error('Failed to update order status: ' + errorMessage);
      setSnackbar({
        open: true,
        message: `Failed to update order status: ${errorMessage}`,
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
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'canceled': // Handle both spellings
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
          Order Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Manage your store orders and track status updates
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by order ID, customer name..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setStatusFilter('all')}
              sx={{ 
                borderRadius: 2,
                mr: 1,
                textTransform: 'none',
                fontWeight: 500,
                ...(statusFilter === 'all' && {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: theme.palette.primary.main,
                })
              }}
            >
              All ({orders.length})
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => setStatusFilter('pending')}
              sx={{ 
                borderRadius: 2,
                mr: 1,
                textTransform: 'none',
                fontWeight: 500,
                ...(statusFilter === 'pending' && {
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                })
              }}
            >
              Pending ({statusCounts.pending || 0})
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              minWidth: 100,
            }
          }}
        >
          <Tab label={`All Orders (${orders.length})`} />
          <Tab label={`Pending (${statusCounts.pending || 0})`} />
          <Tab label={`Processing (${statusCounts.processing || 0})`} />
          <Tab label={`Shipped (${statusCounts.shipped || 0})`} />
          <Tab label={`Delivered (${statusCounts.delivered || 0})`} />
          <Tab label={`Cancelled (${statusCounts.cancelled || 0})`} />
        </Tabs>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 30, 
                          height: 30, 
                          mr: 1.5, 
                          fontSize: '0.75rem',
                          bgcolor: `${theme.palette.primary.main}30`,
                          color: theme.palette.primary.main
                        }}
                      >
                        {(order.user_name?.[0] || order.user?.name?.[0] || 'U')}
                      </Avatar>
                      <Typography variant="body2">
                        {order.user_name || order.user?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>
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
                          borderRadius: 1,
                          fontSize: '0.875rem'
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton 
                        color="primary"
                        onClick={() => handleViewOrder(order)}
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredOrders.length}
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
                    <strong>Name:</strong> {currentOrder.user_name || currentOrder.user?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {currentOrder.user_email || currentOrder.user?.email || 'Not provided'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Shipping Address:</strong> {
                      typeof currentOrder.shipping_address === 'string' 
                        ? currentOrder.shipping_address 
                        : typeof currentOrder.shipping_address === 'object' && currentOrder.shipping_address 
                          ? Object.values(currentOrder.shipping_address).filter(Boolean).join(', ')
                          : 'Not provided'
                    }
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
                                      src={`${storageUrl}/${item.product.thumbnail || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '')}`}
                                      alt={item.product.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      onError={(e) => {
                                        e.target.src = '/placeholder.png';
                                      }}
                                    />
                                  </Box>
                                )}
                                <Typography variant="body2">{item.product.name}</Typography>
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">${parseFloat(item.price).toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${(parseFloat(item.price) * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle2">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">${parseFloat(currentOrder.total).toFixed(2)}</Typography>
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
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
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