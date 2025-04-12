import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider 
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ShoppingCart,
  Home,
  Logout,
  Login,
  PersonAdd,
  MusicNote
} from '@mui/icons-material';
import { authService } from '../../services/api';
import { isAuthenticated, getUser, clearAuthData } from '../../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const authenticated = isAuthenticated();
  const user = getUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuthData();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Just clear local data if API call fails
      clearAuthData();
      navigate('/login');
    }
    handleClose();
  };

  return (
    <AppBar position="static" className="bg-primary-main">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Link to="/" className="flex items-center text-white mr-auto">
          <MusicNote />
          <Typography variant="h6" component="div" className="ml-2">
            Instrument Haven
          </Typography>
        </Link>

        {/* Desktop navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          
          {authenticated ? (
            <>
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCart />
              </IconButton>
              
              <IconButton color="inherit" onClick={handleMenu}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/orders'); }}>
                  My Orders
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box p={2} className="bg-primary-main text-white">
            <Typography variant="h6">Instrument Haven</Typography>
            {authenticated && (
              <Typography variant="body2">Welcome, {user?.name}</Typography>
            )}
          </Box>
          
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            
            {authenticated ? (
              <>
                <ListItem button component={Link} to="/profile">
                  <ListItemIcon><AccountCircle /></ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                
                <ListItem button component={Link} to="/cart">
                  <ListItemIcon><ShoppingCart /></ListItemIcon>
                  <ListItemText primary="Cart" />
                </ListItem>
                
                <ListItem button component={Link} to="/orders">
                  <ListItemText primary="My Orders" />
                </ListItem>
                
                <Divider />
                
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon><Logout /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemIcon><Login /></ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                
                <ListItem button component={Link} to="/register">
                  <ListItemIcon><PersonAdd /></ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;