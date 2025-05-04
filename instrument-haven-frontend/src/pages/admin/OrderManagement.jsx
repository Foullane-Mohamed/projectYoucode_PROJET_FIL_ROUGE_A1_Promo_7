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
  Avatar,
  TextField,
  InputAdornment,
  Tooltip,
  Tabs,
  Tab,
  useTheme,
  alpha,
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
  
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status?.toLowerCase() || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
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
      const response = await api.admin.getOrders();
      console.log('Orders response:', response);
      
      const ordersData = response.data?.data?.orders || 
                      response.data?.orders || 
                      (Array.isArray(response.data) ? response.data : []);
      
      const processedOrders = ordersData.map(order => {
        if (!order.user && order.user_name) {
          order.user = {
            name: order.user_name,
            email: order.user_email || ''
          };
        }
        
        if (!order.user_email && order.user?.email) {
          order.user_email = order.user.email;
        } else if (order.user_email && order.user && !order.user.email) {
          order.user.email = order.user_email;
        }
        
        if (!order.items || !Array.isArray(order.items)) {
          order.items = [];
        }
        
        if (order.total === undefined || order.total === null) {
          if (order.items && order.items.length > 0) {
            order.total = order.items.reduce(
              (sum, item) => sum + (parseFloat(item.price || 0) * (item.quantity || 0)),
              0
            );
          } else {
            order.total = 0;
          }
        }
        
        return order;
      });
      
      setOrders(processedOrders);
      setSnackbar({
        open: true,
        message: 'Orders loaded successfully',
        severity: 'success'
      });
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setStatusFilter(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'][newValue]);
    setPage(0);
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.admin.updateOrder(orderId, { status: newStatus });
      console.log('Update order response:', response);
      
  
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      

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
      
      let errorMessage = 'Unknown error';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        errorMessage = Object.values(validationErrors)
          .flat()
          .join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: `Failed to update order status: ${errorMessage}`,
        severity: 'error'
      });
    }
  };

  const handleViewOrder = (order) => {
    console.log('Viewing order details:', order);
    console.log('Order email info:', {
      user_email: order.user_email,
      user_obj_email: order.user?.email
    });
    
    if (!order.items || order.items.length === 0) {
      const placeholderItem = {
        id: 1,
        product_id: 1,
        quantity: 1,
        price: order.total || 0,
        product: {
          id: 1,
          name: `Order Item (${order.id})`,
          images: []
        }
      };
      
      order = {
        ...order,
        items: [placeholderItem]
      };
    }
    
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
      case 'canceled':
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

      <Dialog 
        open={openOrderDetails} 
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          bgcolor: '#f8f9fa',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Order #{currentOrder?.id}
          </Typography>
          <IconButton onClick={handleCloseOrderDetails} size="small" sx={{ color: 'text.secondary' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {currentOrder && (
            <Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: '100%',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1a1a2e' }}>
                        Customer Information
                      </Typography>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {currentOrder.user_name || currentOrder.user?.name || 'Unknown'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Email
                        </Typography>
                        <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {currentOrder.user_email || currentOrder.user?.email || 'Not provided'}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Shipping Address
                        </Typography>
                        <Typography variant="body1">
                          {
                            typeof currentOrder.shipping_address === 'string' 
                              ? currentOrder.shipping_address 
                              : typeof currentOrder.shipping_address === 'object' && currentOrder.shipping_address 
                                ? Object.values(currentOrder.shipping_address).filter(Boolean).join(', ')
                                : 'Not provided'
                          }
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: '100%',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1a1a2e' }}>
                        Order Information
                      </Typography>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date(currentOrder.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Status
                        </Typography>
                        <Chip 
                          label={currentOrder.status?.charAt(0).toUpperCase() + currentOrder.status?.slice(1)} 
                          color={getStatusColor(currentOrder.status)} 
                          size="small"
                          sx={{ fontWeight: 500, borderRadius: 1 }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: currentOrder.coupon ? 1.5 : 0 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Payment Method
                        </Typography>
                        <Typography variant="body1">
                          {currentOrder.payment_method || 'Not specified'}
                        </Typography>
                      </Box>
                      
                      {currentOrder.coupon && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Coupon Applied
                          </Typography>
                          <Chip 
                            label={currentOrder.coupon.code}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ borderRadius: 1 }}
                          />
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ px: 3, pb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1a1a2e' }}>
                  Order Items
                </Typography>
                
                <TableContainer 
                  component={Paper} 
                  elevation={0}
                  sx={{ 
                    borderRadius: 2, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    mb: 3,
                    overflow: 'hidden'
                  }}
                >
                  <Table size="medium">
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentOrder.items && currentOrder.items.length > 0 ? (
                        currentOrder.items.map((item) => (
                          <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {item.product && (
                                  <>
                                    {item.product.images && item.product.images.length > 0 && (
                                      <Box
                                        sx={{
                                          width: 48,
                                          height: 48,
                                          overflow: 'hidden',
                                          borderRadius: 1.5,
                                          mr: 2,
                                          flexShrink: 0,
                                          border: '1px solid',
                                          borderColor: 'divider'
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
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.product.name}</Typography>
                                  </>
                                )}
                                {!item.product && (
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>Product #{item.product_id || 'Unknown'}</Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="right">${parseFloat(item.price || 0).toFixed(2)}</TableCell>
                            <TableCell align="right">{item.quantity || 1}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              No items available for this order
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    <TableBody>
                      <TableRow sx={{ '& td': { borderTop: '1px solid', borderColor: 'divider', py: 1.5 } }}>
                        <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>
                          Total:
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            ${parseFloat(currentOrder.total || 0).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1a1a2e' }}>
                    Update Order Status
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={currentOrder.status}
                          onChange={(e) => handleStatusChange(currentOrder.id, e.target.value)}
                          sx={{ 
                            borderRadius: 1.5,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: `${getStatusColor(currentOrder.status)}.main`,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: `${getStatusColor(currentOrder.status)}.main`,
                            }
                          }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="shipped">Shipped</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color={getStatusColor(currentOrder.status)}
                        onClick={() => handleStatusChange(currentOrder.id, currentOrder.status)}
                        sx={{ 
                          borderRadius: 1.5,
                          textTransform: 'none',
                          height: '100%'  
                        }}
                      >
                        Update Status
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseOrderDetails} 
            variant="outlined" 
            sx={{ borderRadius: 1.5, textTransform: 'none', px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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