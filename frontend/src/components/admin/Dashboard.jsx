import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
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
  Button,
  Alert
} from '@mui/material';
import {
  PeopleOutline,
  ShoppingCartOutlined,
  Inventory2Outlined,
  AttachMoneyOutlined
} from '@mui/icons-material';
import api from '../../services/api';

const StatCard = ({ title, value, icon, color, isLoading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              padding: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          )}
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await api.get('/admin/dashboard/stats');
        if (statsResponse.data.status === 'success') {
          setStats(statsResponse.data.data);
        } else {
          setError('Failed to fetch dashboard statistics');
        }
        
        // Fetch recent orders
        const ordersResponse = await api.get('/orders?limit=5');
        if (ordersResponse.data.status === 'success') {
          setRecentOrders(ordersResponse.data.data);
        } else {
          setError('Failed to fetch recent orders');
        }
        
        // Fetch low stock products
        const productsResponse = await api.get('/products?stock=low&limit=5');
        if (productsResponse.data.status === 'success') {
          setLowStockProducts(productsResponse.data.data);
        } else {
          setError('Failed to fetch low stock products');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success.main';
      case 'processing':
        return 'info.main';
      case 'pending':
        return 'warning.main';
      case 'cancelled':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'error.main', label: 'Out of Stock' };
    if (stock < 5) return { color: 'warning.main', label: 'Very Low' };
    if (stock < 10) return { color: 'info.main', label: 'Low' };
    return { color: 'success.main', label: 'In Stock' };
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.users}
            icon={<PeopleOutline sx={{ color: 'primary.main' }} />}
            color="primary"
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.products}
            icon={<Inventory2Outlined sx={{ color: 'secondary.main' }} />}
            color="secondary"
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders"
            value={stats.orders}
            icon={<ShoppingCartOutlined sx={{ color: 'success.main' }} />}
            color="success"
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={formatCurrency(stats.revenue)}
            icon={<AttachMoneyOutlined sx={{ color: 'info.main' }} />}
            color="info"
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
      
      {/* Recent Orders */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Recent Orders
          </Typography>
          <Button 
            component={Link} 
            to="/admin/orders" 
            variant="outlined" 
            size="small"
          >
            View All
          </Button>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : recentOrders.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: `${getStatusColor(order.status)}15`,
                          color: getStatusColor(order.status),
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          display: 'inline-block',
                          textTransform: 'capitalize',
                        }}
                      >
                        {order.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        component={Link} 
                        to={`/admin/orders/${order.id}`}
                        size="small"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">No recent orders found</Typography>
          </Box>
        )}
      </Paper>
      
      {/* Low Stock Products */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Low Stock Products
          </Typography>
          <Button 
            component={Link} 
            to="/admin/products" 
            variant="outlined" 
            size="small"
          >
            View All Products
          </Button>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : lowStockProducts.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>#{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor: `${stockStatus.color}15`,
                            color: stockStatus.color,
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            display: 'inline-block',
                          }}
                        >
                          {stockStatus.label}
                        </Box>
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell align="right">
                        <Button 
                          component={Link} 
                          to={`/admin/products/edit/${product.id}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          Update Stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">No low stock products found</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;