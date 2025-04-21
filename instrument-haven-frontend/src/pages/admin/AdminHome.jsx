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
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const AdminHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    totalSales: 0,
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
        const dashboardData = dashboardResponse.data?.data?.statistics || dashboardResponse.data?.statistics || {};
        console.log('Dashboard data:', dashboardData);
        
        // Try to fetch recent orders
        let recentOrders = dashboardData.recent_orders || [];
        if (!recentOrders.length && !dashboardData.recent_orders) {
          try {
            const ordersResponse = await api.admin.getOrders({ limit: 5 });
            console.log('Recent orders response:', ordersResponse);
            recentOrders = ordersResponse.data?.data?.orders || 
                          ordersResponse.data?.orders || 
                          [];
          } catch (orderError) {
            console.warn('Could not fetch recent orders:', orderError);
          }
        }
        
        // Try to fetch top products
        let topProducts = dashboardData.top_selling_products || [];
        if (!topProducts.length && !dashboardData.top_selling_products) {
          try {
            const productsResponse = await api.products.getAll({ limit: 5, sort: 'popular' });
            console.log('Top products response:', productsResponse);
            topProducts = productsResponse.data?.data?.products || 
                         productsResponse.data?.products || 
                         [];
          } catch (productError) {
            console.warn('Could not fetch top products:', productError);
          }
        }
        
        // Set the statistics with proper fallbacks
        setStats({
          products: dashboardData.total_products || 0,
          categories: dashboardData.total_categories || 0,
          orders: dashboardData.total_orders || 0,
          users: dashboardData.total_users || 0,
          totalSales: dashboardData.total_sales || 0,
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Welcome to your Instrument Haven Admin Dashboard
        </Typography>
      </Box>
      
      {/* Statistic Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card 
            component={Link} 
            to="/admin/products"
            sx={{ 
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              height: '100%',
              position: 'relative',
              background: 'linear-gradient(45deg, #ffffff 50%, #fff7f8 100%)',
              '&:hover': { 
                transform: 'translateY(-5px)', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.10)'
              },
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                backgroundColor: 'primary.main'
              }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', height: '100%', p: 3 }}>
              <Box 
                sx={{ 
                  mr: 3, 
                  bgcolor: 'primary.main', 
                  p: 2, 
                  borderRadius: 2,
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 10px rgba(255, 43, 82, 0.3)'
                }}
              >
                <InventoryIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.products}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Products
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} lg={2}>
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
        
        <Grid item xs={12} sm={6} md={3} lg={2}>
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
        
        <Grid item xs={12} sm={6} md={3} lg={2}>
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

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Card 
            sx={{ 
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2, bgcolor: 'error.light', p: 1, borderRadius: 1 }}>
                <MoneyIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h5" component="div">
                  ${parseFloat(stats.totalSales || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sales
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Orders and Products Tables */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              pb: 1, 
              mb: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              Recent Orders
            </Typography>
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TableContainer sx={{ flexGrow: 1 }}>
                  <Table size="small" sx={{ '& .MuiTableCell-head': { fontWeight: 'bold' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip 
                              label={order.status} 
                              size="small"
                              color={getStatusColor(order.status)}
                            />
                          </TableCell>
                          <TableCell align="right">${parseFloat(order.total || 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button 
                    component={Link} 
                    to="/admin/orders" 
                    variant="outlined"
                    color="primary"
                    sx={{ 
                      borderRadius: '20px',
                      px: 3,
                      py: 0.8,
                      fontWeight: 'medium',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }
                    }}
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
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 'bold', 
              pb: 1, 
              mb: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              Top Products
            </Typography>
            {stats.topProducts && stats.topProducts.length > 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TableContainer sx={{ flexGrow: 1 }}>
                  <Table size="small" sx={{ '& .MuiTableCell-head': { fontWeight: 'bold' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Sales</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.topProducts.map((product) => (
                        <TableRow key={product.id || product.product_id}>
                          <TableCell>{product.name || product.product_name}</TableCell>
                          <TableCell align="right">
                            ${typeof product.price === 'number' ? product.price.toFixed(2) : 
                               (typeof product.revenue === 'number' ? (product.revenue / (product.total_sold || 1)).toFixed(2) : '0.00')}
                          </TableCell>
                          <TableCell align="right">{product.sales_count || product.total_sold || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button 
                    component={Link} 
                    to="/admin/products" 
                    variant="outlined"
                    color="primary"
                    sx={{ 
                      borderRadius: '20px',
                      px: 3,
                      py: 0.8,
                      fontWeight: 'medium',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }
                    }}
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