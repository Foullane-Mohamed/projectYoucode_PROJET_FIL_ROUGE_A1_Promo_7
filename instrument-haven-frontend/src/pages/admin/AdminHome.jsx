import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  useTheme,
  Avatar,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as ArrowUpIcon,
  Autorenew as AutorenewIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// Mock chart data 
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const AdminHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  
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
        
        // Set the statistics with proper fallbacks
        setStats({
          products: dashboardData.total_products || 0,
          categories: dashboardData.total_categories || 0,
          orders: dashboardData.total_orders || 0,
          users: dashboardData.total_users || 0,
          totalSales: dashboardData.total_sales || 0,
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Welcome to your Instrument Haven Admin Dashboard
        </Typography>
      </Box>
      
      {/* Statistic Cards */}
      <Grid container spacing={3}>
        {/* Products Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.09)'
            }
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              bgcolor: 'primary.main' 
            }} />
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Products
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    {stats.products}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    boxShadow: '0 4px 12px rgba(255, 43, 82, 0.3)',
                    p: 1.5
                  }}
                >
                  <InventoryIcon />
                </Avatar>
              </Box>
              

            </CardContent>
          </Card>
        </Grid>

        {/* Categories Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.09)'
            }
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              bgcolor: '#6B46C1' 
            }} />
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Categories
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    {stats.categories}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: '#6B46C1', 
                    boxShadow: '0 4px 12px rgba(107, 70, 193, 0.3)',
                    p: 1.5
                  }}
                >
                  <CategoryIcon />
                </Avatar>
              </Box>
              

            </CardContent>
          </Card>
        </Grid>
        
        {/* Orders Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.09)'
            }
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              bgcolor: theme.palette.warning.main
            }} />
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Orders
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    {stats.orders}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.warning.main, 
                    boxShadow: `0 4px 12px ${theme.palette.warning.light}`,
                    p: 1.5
                  }}
                >
                  <CartIcon />
                </Avatar>
              </Box>
              

            </CardContent>
          </Card>
        </Grid>
        
        {/* Users Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.09)'
            }
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              bgcolor: theme.palette.info.main
            }} />
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    {stats.users}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.info.main, 
                    boxShadow: `0 4px 12px ${theme.palette.info.light}`,
                    p: 1.5
                  }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
              

            </CardContent>
          </Card>
        </Grid>
        
        {/* Revenue Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.09)'
            }
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              bgcolor: theme.palette.success.main 
            }} />
            
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    ${parseFloat(stats.totalSales || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.success.main, 
                    boxShadow: `0 4px 12px ${theme.palette.success.light}`,
                    p: 1.5
                  }}
                >
                  <MoneyIcon />
                </Avatar>
              </Box>
              

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome;