import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const AdminHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  
  // Helper function to get color based on order status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch dashboard statistics from the admin API
        const dashboardResponse = await api.admin.getDashboard();
        console.log('Dashboard response:', dashboardResponse);

        // Extract data from the response, handling both potential formats
        const dashboardData = dashboardResponse.data?.data || dashboardResponse.data || {};
        
        // Try to fetch recent orders if not included in dashboard data
        let recentOrders = dashboardData.recentOrders || [];
        if (!recentOrders.length) {
          try {
            const ordersResponse = await api.admin.getOrders({ limit: 5 });
            console.log('Recent orders response:', ordersResponse);
            recentOrders = ordersResponse.data?.data?.orders || 
                          ordersResponse.data?.orders || 
                          (Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
          } catch (orderError) {
            console.warn('Could not fetch recent orders:', orderError);
          }
        }
        
        // Try to fetch top products if not included in dashboard data
        let topProducts = dashboardData.topProducts || [];
        if (!topProducts.length) {
          try {
            const productsResponse = await api.products.getAll({ limit: 5, sort: 'popular' });
            console.log('Top products response:', productsResponse);
            topProducts = productsResponse.data?.data?.products || 
                         productsResponse.data?.products || 
                         (Array.isArray(productsResponse.data) ? productsResponse.data : []);
          } catch (productError) {
            console.warn('Could not fetch top products:', productError);
          }
        }
        
        // Set the statistics with proper fallbacks
        setStats({
          products: dashboardData.productCount || 0,
          categories: dashboardData.categoryCount || 0,
          orders: dashboardData.orderCount || 0,
          users: dashboardData.userCount || 0,
          recentOrders: recentOrders,
          topProducts: topProducts
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Try to fetch individual stats if dashboard endpoint fails
        try {
          const products = await api.products.getAll();
          const categories = await api.categories.getAll();
          const productCount = products.data?.data?.total || products.data?.meta?.total || 0;
          const categoryCount = categories.data?.data?.categories?.length || categories.data?.categories?.length || 0;
          
          setStats(prev => ({
            ...prev,
            products: productCount,
            categories: categoryCount
          }));
        } catch (fallbackError) {
          console.error('Fallback stats fetching failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/admin/products"
            sx={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, bgcolor: 'primary.light', p: 1, borderRadius: 1 }}>
                <InventoryIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" component="div">
                  {stats.products}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Products
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/admin/categories"
            sx={{ 
              textDecoration: 'none', 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, bgcolor: 'success.light', p: 1, borderRadius: 1 }}>
                <CategoryIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" component="div">
                  {stats.categories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/admin/orders"
            sx={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, bgcolor: 'warning.light', p: 1, borderRadius: 1 }}>
                <CartIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" component="div">
                  {stats.orders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Orders
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            component={Link} 
            to="/admin/users"
            sx={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, bgcolor: 'info.light', p: 1, borderRadius: 1 }}>
                <PeopleIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" component="div">
                  {stats.users}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip 
                              label={order.status} 
                              size="small"
                              color={getStatusColor(order.status)}
                            />
                          </TableCell>
                          <TableCell align="right">${order.total?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    component={Link} 
                    to="/admin/orders" 
                    size="small"
                    color="primary"
                  >
                    View All Orders
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent orders to display.
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Products
            </Typography>
            {stats.topProducts && stats.topProducts.length > 0 ? (
              <Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Sales</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">${product.price?.toFixed(2)}</TableCell>
                          <TableCell align="right">{product.sales_count || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    component={Link} 
                    to="/admin/products" 
                    size="small"
                    color="primary"
                  >
                    View All Products
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No product data to display.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome;