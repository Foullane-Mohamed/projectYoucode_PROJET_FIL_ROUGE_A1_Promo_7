import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

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
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  alpha,
  Container,
  Fade,
  Paper,
  Stack,
} from '@mui/material';
// Import our custom emoji icons component
import { Box as EmojiIcon } from '@mui/material';
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
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  useEffect(() => {
    if (isTablet && !isMobile) {
      setCollapsed(true);
    } else if (isLargeScreen) {
      setCollapsed(false);
    }
  }, [isTablet, isMobile, isLargeScreen]);

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

  const handleProfileClick = () => {
    navigate('/admin/profile');
    handleUserMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <EmojiIcon sx={{ fontSize: '1.4rem' }}>📊</EmojiIcon>, path: '/admin' },
    { text: 'Products', icon: <EmojiIcon sx={{ fontSize: '1.4rem' }}>🎹</EmojiIcon>, path: '/admin/products' },
    { text: 'Categories', icon: <EmojiIcon sx={{ fontSize: '1.4rem' }}>📁</EmojiIcon>, path: '/admin/categories' },
    { text: 'Orders', icon: <EmojiIcon sx={{ fontSize: '1.4rem' }}>🛒</EmojiIcon>, path: '/admin/orders' },
    { text: 'Coupons', icon: <EmojiIcon sx={{ fontSize: '1.4rem' }}>🏷️</EmojiIcon>, path: '/admin/coupons' },
    { text: 'Users', icon: <EmojiIcon sx={{ fontSize: '1.4rem' }}>👥</EmojiIcon>, path: '/admin/users' },
  ];

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
          {isMobile && (
            <IconButton 
              onClick={handleDrawerToggle} 
              sx={{ 
                color: 'white',
                position: 'absolute',
                right: 8,
                top: 8,
                display: { sm: 'none' }
              }}
            >
              <EmojiIcon sx={{ fontSize: '1.4rem' }}>✖️</EmojiIcon>
            </IconButton>
          )}
          
          {!collapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiIcon sx={{ color: '#FF2B52', mr: 1, fontSize: '1.5rem' }}>🎵</EmojiIcon>
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  fontSize: { xs: '1rem', sm: '1.25rem' } 
                }}
              >
                InsHav
              </Typography>
            </Box>
          )}
          {collapsed && (
            <EmojiIcon sx={{ color: '#FF2B52', fontSize: { xs: 24, sm: 30 } }}>🎵</EmojiIcon>
          )}
          {!isMobile && (
            <IconButton onClick={toggleDrawerSize} sx={{ color: 'white' }}>
              <EmojiIcon sx={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: '0.3s', fontSize: '1.2rem' }}>‹</EmojiIcon>
            </IconButton>
          )}
        </Toolbar>

        <List sx={{ px: 0, py: 2, flexGrow: 1, overflowX: 'hidden' }}>
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
                  py: { xs: 1, sm: 1.2 },
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
                      noWrap: true,
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
              py: { xs: 1, sm: 1.2 },
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
              <EmojiIcon sx={{ fontSize: '1.4rem' }}>🚪</EmojiIcon>
            </ListItemIcon>
            {!collapsed && (
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{
                  color: '#f44336',
                  fontWeight: '500',
                  noWrap: true,
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
        <Toolbar sx={{ 
          height: { xs: 64, sm: 70 }, 
          px: { xs: 1, sm: 3 },
          minHeight: { xs: '64px !important', sm: '70px !important' }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <EmojiIcon sx={{ fontSize: '1.4rem' }}>☰</EmojiIcon>
          </IconButton>

          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold', 
              color: '#1a1a2e',
              fontSize: { sm: '1.1rem', md: '1.25rem' }
            }}>
            Admin Panel
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* User Menu */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Profile Menu">
              <IconButton 
                onClick={handleUserMenuOpen}
                sx={{ 
                  p: 0, 
                  border: '2px solid',
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  ml: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                <Avatar 
                  alt={user?.name || 'Admin'} 
                  src={user?.avatar || ''} 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 }
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
                  filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  minWidth: 240,
                  maxWidth: '90vw',
                  borderRadius: 3,
                  p: 0,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    width: 12,
                    height: 12,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    boxShadow: '-3px -3px 5px rgba(0,0,0,0.03)',
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
              TransitionComponent={Fade}
            >
              <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Header with background */}
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #FF2B52 0%, #FF6B87 100%)',
                  color: 'white',
                  position: 'relative',
                }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    opacity: 0.1,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E")',
                    backgroundSize: '24px 24px',
                  }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      alt={user?.name || 'Admin'} 
                      src={user?.avatar || ''} 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() || 'A'}
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="600"
                        sx={{ 
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          mb: 0.5,
                          fontSize: { xs: '1rem', sm: '1.15rem' }
                        }}
                      >
                        {user?.name || 'foullane mohamed'}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { xs: '0.75rem', sm: '0.85rem' }
                        }}
                      >
                        {user?.email || 'foullane@gmail.com'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Menu Items */}
                <Box sx={{ p: 1.5 }}>
                  <MenuItem 
                    onClick={handleProfileClick}
                    sx={{ 
                      py: 1.5, 
                      px: 2,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
                      <Avatar
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          mr: 2,
                          bgcolor: alpha('#6B46C1', 0.1),
                          color: '#6B46C1'
                        }}
                      >
                        <EmojiIcon fontSize="small" sx={{ lineHeight: 1 }}>👤</EmojiIcon>
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="body1" 
                          fontWeight="500"
                          sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
                        >
                          Profile
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                        >
                          Manage your profile settings
                        </Typography>
                      </Box>
                      <EmojiIcon 
                        sx={{ 
                          ml: 1, 
                          color: 'text.disabled',
                          fontSize: '1.1rem'
                        }} 
                      >›</EmojiIcon>
                    </Stack>
                  </MenuItem>

                  <Divider sx={{ my: 1.5 }} />
                  
                  <MenuItem 
                    onClick={handleLogout} 
                    sx={{ 
                      py: 1.5, 
                      px: 2,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha('#f44336', 0.08),
                      }
                    }}
                  >
                    <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
                      <Avatar
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          mr: 2,
                          bgcolor: alpha('#f44336', 0.1),
                          color: '#f44336'
                        }}
                      >
                        <EmojiIcon fontSize="small" sx={{ lineHeight: 1 }}>🚪</EmojiIcon>
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="body1" 
                          fontWeight="500"
                          color="error.main"
                          sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
                        >
                          Logout
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                        >
                          Sign out from your account
                        </Typography>
                      </Box>
                      <EmojiIcon 
                        sx={{ 
                          ml: 1, 
                          color: 'error.light',
                          fontSize: '1.1rem'
                        }} 
                      >›</EmojiIcon>
                    </Stack>
                  </MenuItem>
                </Box>
              </Paper>
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
  
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: '80%', 
              maxWidth: '280px',
              borderRadius: 0,
              bgcolor: '#1a1a2e',
            },
          }}
        >
          {drawer}
        </Drawer>

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
        <Toolbar sx={{ height: { xs: 64, sm: 70 }, minHeight: { xs: '64px !important', sm: '70px !important' } }} /> {/* Spacer for the AppBar */}
        <Container maxWidth="xl" sx={{ 
          flexGrow: 1, 
          mb: 4, 
          pt: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="coupons" element={<CouponManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="profile" element={<ProfileManagement />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;