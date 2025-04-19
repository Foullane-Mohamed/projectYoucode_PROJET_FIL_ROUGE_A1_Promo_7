import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ListItemText,
  Divider,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ShoppingCart, 
  Favorite,
  AccountCircle,
  Search as SearchIcon,
} from '@mui/icons-material';

const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  
  // Debug user state
  useEffect(() => {
    console.log('Header - Current user state:', user);
  }, [user]);
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    { title: 'Categories', path: '/categories' },
  ];

  const userMenuItems = user ? [
    { title: 'Profile', path: '/profile' },
    { title: 'My Orders', path: '/my-orders' },
    ...(isAdmin() ? [{ title: 'Admin Dashboard', path: '/admin' }] : []),
    { title: 'Logout', onClick: handleLogout }
  ] : [
    { title: 'Login', path: '/login' },
    { title: 'Register', path: '/register' }
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Instrument Haven
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={handleDrawerToggle}
              >
                <List>
                  {navItems.map((item) => (
                    <ListItem 
                      key={item.title} 
                      component={Link} 
                      to={item.path}
                    >
                      <ListItemText primary={item.title} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </Box>
            </Drawer>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Instrument Haven
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.title}
                component={Link}
                to={item.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          {/* Search Button */}
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              size="large" 
              aria-label="search" 
              color="inherit" 
              component={Link} 
              to="/search"
            >
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Wishlist Button */}
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              size="large" 
              aria-label="wishlist" 
              color="inherit" 
              component={Link} 
              to="/wishlist"
            >
              <Favorite />
            </IconButton>
          </Box>

          {/* Cart Button */}
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              size="large" 
              aria-label="cart" 
              color="inherit" 
              component={Link} 
              to="/cart"
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {user ? (
                  <Avatar alt={user.name} src="/static/images/avatar/2.jpg" />
                ) : (
                  <AccountCircle fontSize="large" />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
              {userMenuItems.map((item) => (
                <MenuItem
                  key={item.title}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (item.onClick) item.onClick();
                  }}
                  component={item.path ? Link : 'li'}
                  to={item.path}
                >
                  <Typography textAlign="center">{item.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;