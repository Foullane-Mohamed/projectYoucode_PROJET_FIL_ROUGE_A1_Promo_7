import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Import admin pages
import AdminHome from './AdminHome';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import OrderManagement from './OrderManagement';
import CouponManagement from './CouponManagement';
import UserManagement from './UserManagement';
import ProfileManagement from './profile/ProfileManagement';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Category as CategoryIcon,
  ShoppingCart as OrdersIcon,
  Discount as CouponIcon,
  People as UsersIcon,
  Logout as LogoutIcon,

  Person as PersonIcon,
  MusicNote,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const drawerWidth = 260;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDrawerSize = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };


  


  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Products', icon: <ProductsIcon />, path: '/admin/products' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Coupons', icon: <CouponIcon />, path: '/admin/coupons' },
    { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
  ];
  
  // Get active state for menu items
  const isActive = (itemPath) => {
    if (itemPath === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(itemPath);
  };

  const drawer = (
    <>
      <Box 
        sx={{ 
          bgcolor: '#1a1a2e', 
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: theme.spacing(0, 2),
            ...theme.mixins.toolbar,
            justifyContent: collapsed ? 'center' : 'space-between',
            minHeight: '70px !important',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {!collapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MusicNote sx={{ color: '#FF2B52', mr: 1 }} />
              <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'white' }}>
                INSTRUMENT HAVEN
              </Typography>
            </Box>
          )}
          {collapsed && (
            <MusicNote sx={{ color: '#FF2B52', fontSize: 30 }} />
          )}
          {!isMobile && (
            <IconButton onClick={toggleDrawerSize} sx={{ color: 'white' }}>
              <ChevronLeftIcon sx={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
            </IconButton>
          )}
        </Toolbar>

        <List sx={{ px: 0, py: 2, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding 
              sx={{ 
                display: 'block',
                mb: 0.5, 
                px: collapsed ? 0.5 : 2
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  borderRadius: '10px',
                  py: 1.2,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: alpha('#FF2B52', 0.25),
                    '&:hover': {
                      bgcolor: alpha('#FF2B52', 0.3),
                    },
                  },
                  '&:hover': { 
                    bgcolor: alpha('#FF2B52', 0.15),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'center',
                    color: isActive(item.path) ? '#FF2B52' : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? '600' : '400',
                      fontSize: '0.95rem',
                      color: isActive(item.path) ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      transition: 'all 0.2s ease',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: collapsed ? 1 : 2, mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: '10px',
              py: 1.2,
              justifyContent: collapsed ? 'center' : 'initial',
              '&:hover': {
                bgcolor: alpha('#f44336', 0.15),
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 0,
              mr: collapsed ? 0 : 2,
              justifyContent: 'center',
              color: '#f44336',
            }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{
                  color: '#f44336',
                  fontWeight: '500',
                }}
              />
            )}
          </ListItemButton>
        </Box>
      </Box>
    </>
  );
  
  const effectiveDrawerWidth = collapsed ? 70 : drawerWidth;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${effectiveDrawerWidth}px)` },
          ml: { sm: `${effectiveDrawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ height: 70, px: { xs: 1, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold', 
              color: '#1a1a2e' 
            }}>
            Admin Panel
          </Typography>

          <Box sx={{ flexGrow: 1 }} />



          {/* User Menu */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Account settings">
              <IconButton 
                onClick={handleUserMenuOpen}
                sx={{ 
                  p: 0, 
                  border: '2px solid',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  ml: 1
                }}
              >
                <Avatar 
                  alt={user?.name || 'Admin'} 
                  src={user?.avatar || ''} 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: 36,
                    height: 36
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
              id="menu-appbar"
              anchorEl={userMenuAnchor}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.name || 'Admin User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {user?.email || 'admin@example.com'}
                </Typography>
              </Box>

              <MenuItem component={Link} to="/admin/profile" onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
              <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: effectiveDrawerWidth }, 
          flexShrink: { sm: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 260,
              borderRadius: 0,
              bgcolor: '#1a1a2e',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: effectiveDrawerWidth,
              borderRadius: 0,
              borderRight: 'none',
              boxShadow: '4px 0 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          width: { sm: `calc(100% - ${effectiveDrawerWidth}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: '#f8f9fa',
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar sx={{ height: 70 }} /> {/* Spacer for the AppBar */}
        <Box sx={{ flexGrow: 1, mb: 4, pt: 2 }}>
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="coupons" element={<CouponManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="profile" element={<ProfileManagement />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;