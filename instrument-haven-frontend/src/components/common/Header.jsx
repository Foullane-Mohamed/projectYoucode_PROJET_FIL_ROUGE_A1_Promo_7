import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem, 
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Fade,
  Paper,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ShoppingCart, 
  Favorite,
  AccountCircle,
  Search as SearchIcon,
  Home,
  Category,
  MusicNote,
  KeyboardArrowDown,
  Close,
  Instagram,
  Facebook,
  Twitter,
  Person,
  ShoppingBag,
  Dashboard,
  ExitToApp,
  Login
} from '@mui/icons-material';

const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close drawer when navigating
  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
    }
  };

  const toggleSearchBox = () => {
    setSearchOpen(!searchOpen);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null);
  };

  // Only show nav items if not an admin
  const navItems = isAdmin() ? [] : [
    { title: 'Home', path: '/', icon: <Home /> },
    { 
      title: 'Categories', 
      path: '/categories', 
      icon: <Category />,
      submenu: true
    },
    { title: 'Products', path: '/products', icon: <MusicNote /> },
    { title: 'Contact', path: '/contact', icon: <MusicNote /> },
  ];

  const categoryItems = [
    { title: 'String Instruments', path: '/categories/1' },
    { title: 'Percussion', path: '/categories/2' },
    { title: 'Wind Instruments', path: '/categories/3' },
    { title: 'Keyboards', path: '/categories/4' },
    { title: 'Electric Guitars', path: '/categories/5' },
    { title: 'All Categories', path: '/categories' },
  ];

  const userMenuItems = user ? [
    { title: 'Profile', path: '/profile', icon: <Person /> },
    { title: 'My Orders', path: '/my-orders', icon: <ShoppingBag /> },
    ...(isAdmin() ? [{ title: 'Admin Dashboard', path: '/admin', icon: <Dashboard /> }] : []),
    { title: 'Logout', onClick: handleLogout, icon: <ExitToApp /> }
  ] : [
    { title: 'Login', path: '/login', icon: <Login /> },
    { title: 'Register', path: '/register', icon: <Person /> }
  ];

  return (
    <>
      {/* Main Header */}
      <AppBar 
        position="sticky" 
        elevation={isScrolled ? 4 : 0} 
        sx={{
          bgcolor: '#1a1a2e',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
          borderBottom: isScrolled ? 'none' : '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: isScrolled ? 70 : 80, transition: 'height 0.3s ease' }}>
            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleDrawerToggle}
                color="primary"
                edge="start"
                sx={{ color: '#ffffff' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo */}
            <Box 
              component={Link} 
              to="/" 
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: 4
              }}
            >
              <MusicNote 
                sx={{ 
                  color: '#ffffff', 
                  fontSize: { xs: 28, md: 32 }, 
                  mr: 1,
                  transition: 'all 0.3s ease',
                  transform: isScrolled ? 'scale(0.9)' : 'scale(1)'
                }} 
              />
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: '.1rem',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: { xs: '1.2rem', md: isScrolled ? '1.3rem' : '1.5rem' },
                  transition: 'all 0.3s ease',
                  fontFamily: '"Poppins", sans-serif',
                  display: { xs: 'flex', md: 'flex' },
                }}
              >
                INSTRUMENT HAVEN
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              {navItems.map((item) => {
                if (item.submenu) {
                  return (
                    <Box key={item.title} sx={{ position: 'relative' }}>
                      <Button
                        onClick={handleCategoryMenuOpen}
                        sx={{ 
                          my: 2, 
                          mx: 1,
                          px: 2,
                          color: '#ffffff', 
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          '&:hover': { 
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: 'primary.main',
                          },
                          ...(location.pathname.startsWith(item.path) && {
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          })
                        }}
                      >
                        {item.title}
                        <KeyboardArrowDown sx={{ ml: 0.5, fontSize: '1rem' }} />
                      </Button>
                      <Menu
                        anchorEl={categoryMenuAnchor}
                        open={Boolean(categoryMenuAnchor)}
                        onClose={handleCategoryMenuClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                          elevation: 3,
                          sx: {
                            mt: 1.5,
                            borderRadius: '10px',
                            minWidth: 200,
                            overflow: 'visible',
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
                          },
                        }}
                      >
                        {categoryItems.map((category) => (
                          <MenuItem 
                            key={category.title} 
                            component={Link} 
                            to={category.path}
                            onClick={handleCategoryMenuClose}
                            sx={{ 
                              py: 1.5,
                              '&:hover': { 
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                color: 'primary.main',
                              } 
                            }}
                          >
                            <ListItemText primary={category.title} />
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  );
                }
                
                return (
                  <Button
                    key={item.title}
                    component={Link}
                    to={item.path}
                    sx={{ 
                      my: 2, 
                      mx: 1,
                      px: 2,
                      color: '#ffffff', 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main',
                      },
                      ...(location.pathname === item.path && {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      })
                    }}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Search Button */}
              <Box sx={{ position: 'relative' }}>
                <IconButton 
                  color="primary" 
                  onClick={toggleSearchBox}
                  aria-label="search"
                  sx={{ 
                    mx: { xs: 0.5, md: 1 },
                    color: '#ffffff',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>

                {/* Animated Search Box */}
                {searchOpen && (
                  <Paper
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      mt: 1,
                      zIndex: 1200,
                      width: { xs: 280, sm: 350 },
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      p: 1,
                      animation: 'fadeIn 0.3s ease-in-out',
                      '@keyframes fadeIn': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(-20px)'
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        }
                      }
                    }}
                  >
                    <TextField
                      autoFocus
                      placeholder="Search for instruments..."
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              size="small" 
                              onClick={toggleSearchBox}
                              aria-label="close search"
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          }
                        }
                      }}
                    />
                  </Paper>
                )}
              </Box>

              {/* Only show shop icons if not an admin */}
              {!isAdmin() && (
                <>
                  {/* Wishlist Button */}
                  <IconButton 
                    aria-label="wishlist" 
                    component={Link} 
                    to="/wishlist"
                    sx={{ 
                      mx: { xs: 0.5, md: 1 },
                      color: location.pathname === '/wishlist' ? 'primary.main' : '#ffffff',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main' 
                      },
                    }}
                  >
                    <Favorite />
                  </IconButton>

                  {/* Cart Button */}
                  <IconButton 
                    aria-label="cart" 
                    component={Link} 
                    to="/cart"
                    sx={{ 
                      mx: { xs: 0.5, md: 1 },
                      color: location.pathname === '/cart' ? 'primary.main' : '#ffffff',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main' 
                      },
                    }}
                  >
                    <Badge 
                      badgeContent={totalItems} 
                      color="error"
                      sx={{ 
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          minWidth: '18px',
                          height: '18px',
                          padding: '0 4px',
                        } 
                      }}
                    >
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </>
              )}

              {/* User Menu */}
              <Box sx={{ ml: { xs: 0.5, md: 1.5 } }}>
                <Tooltip title={user ? 'Account settings' : 'Login/Register'}>
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {user ? (
                      <Avatar 
                        alt={user.name}
                        src={user.avatar || ''} 
                        sx={{ 
                          width: 36, 
                          height: 36,
                          border: '2px solid',
                          borderColor: 'primary.light',
                        }} 
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    ) : (
                      <AccountCircle 
                        fontSize="medium" 
                        sx={{ 
                          color: 'primary.main',
                          width: 32,
                          height: 32, 
                        }} 
                      />
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: '45px',
                    '& .MuiPaper-root': {
                      borderRadius: '12px',
                      minWidth: 180,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      overflow: 'visible',
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
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {user && (
                    <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  )}
                  
                  {userMenuItems.map((item) => (
                    <MenuItem
                      key={item.title}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (item.onClick) item.onClick();
                      }}
                      component={item.path ? Link : 'li'}
                      to={item.path}
                      sx={{ 
                        py: 1.25, 
                        px: 2,
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        } 
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: item.title === 'Logout' ? 'error.main' : 'primary.main' }}>
                        {item.icon}
                      </ListItemIcon>
                      <Typography 
                        textAlign="left" 
                        sx={{ 
                          fontWeight: 500,
                          color: item.title === 'Logout' ? 'error.main' : 'inherit'
                        }}
                      >
                        {item.title}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 320,
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        {/* Drawer Header */}
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MusicNote sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
              INSTRUMENT HAVEN
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        
        {/* Drawer Content */}
        <List sx={{ pt: 1 }}>
          {user && (
            <Box sx={{ px: 3, py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    mr: 2,
                    bgcolor: 'primary.main' 
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
            </Box>
          )}

          {/* Navigation Items */}
          {navItems.map((item) => (
            <ListItem 
              key={item.title} 
              component={Link} 
              to={item.path}
              disablePadding
            >
              <ListItemText 
                primary={
                  <Button
                    startIcon={item.icon}
                    sx={{ 
                      py: 1.5, 
                      px: 3, 
                      justifyContent: 'flex-start', 
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      fontWeight: 500,
                      width: '100%',
                      textAlign: 'left',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                      ...(location.pathname === item.path && {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      })
                    }}
                  >
                    {item.title}
                  </Button>
                }
              />
            </ListItem>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Account Items */}
          {userMenuItems.map((item) => (
            <ListItem 
              key={item.title} 
              component={item.path ? Link : 'div'}
              to={item.path}
              onClick={item.onClick}
              disablePadding
            >
              <ListItemText 
                primary={
                  <Button
                    startIcon={item.icon}
                    sx={{ 
                      py: 1.5, 
                      px: 3, 
                      justifyContent: 'flex-start', 
                      color: item.title === 'Logout' ? 'error.main' : 'text.primary',
                      fontWeight: 500,
                      width: '100%',
                      textAlign: 'left',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      }
                    }}
                  >
                    {item.title}
                  </Button>
                }
              />
            </ListItem>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Social Icons */}
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton sx={{ color: '#1877F2' }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: '#E4405F' }}>
              <Instagram />
            </IconButton>
            <IconButton sx={{ color: '#1DA1F2' }}>
              <Twitter />
            </IconButton>
          </Box>
        </List>
      </Drawer>
    </>
  );
};

export default Header;