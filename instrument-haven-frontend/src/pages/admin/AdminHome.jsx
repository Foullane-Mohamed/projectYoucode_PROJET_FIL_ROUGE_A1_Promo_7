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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch product count
        const productsResponse = await api.get('/products');
        const products = productsResponse.data.data.length;
        
        // Fetch category count
        const categoriesResponse = await api.get('/categories');
        const categories = categoriesResponse.data.data.length;
        
        // Fetch order count (for admin)
        const ordersResponse = await api.get('/orders');
        const orders = ordersResponse.data.data.length;
        
        // Fetch user count
        // This endpoint would need to be created in your API
        const users = 42; // Placeholder, replace with actual API call
        
        setStats({
          products,
          categories,
          orders,
          users
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
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
            {stats.orders > 0 ? (
              <Typography>Order data will be displayed here</Typography>
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
            {stats.products > 0 ? (
              <Typography>Product data will be displayed here</Typography>
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