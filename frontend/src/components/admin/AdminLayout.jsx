import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Collapse
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle,
  LocalOffer as CouponIcon,
  Payment as PaymentIcon,
  ExpandLess,
  ExpandMore,
  Person as ContactIcon
} from '@mui/icons-material';
import { authService } from '../../services/api';
import { clearAuthData, getUser } from '../../utils/auth';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const AppBarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const DrawerStyled = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState({});
  const user = getUser();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const handleMenuToggle = (menu) => {
    setMenuOpen({...menuOpen, [menu]: !menuOpen[menu]});
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <DashboardIcon />,
      exact: true
    },
    {
      title: 'Categories',
      path: '/admin/categories',
      icon: <CategoryIcon />,
      submenu: [
        { title: 'All Categories', path: '/admin/categories' },
        { title: 'Add Category', path: '/admin/categories/create' },
        { title: 'Subcategories', path: '/admin/subcategories' }
      ]
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: <InventoryIcon />,
      submenu: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Add Product', path: '/admin/products/create' }
      ]
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: <PeopleIcon />,
      submenu: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Add User', path: '/admin/users/create' },
        { title: 'Roles', path: '/admin/roles' }
      ]
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCartIcon />
    },
    {
      title: 'Payments',
      path: '/admin/payments',
      icon: <PaymentIcon />
    },
    {
      title: 'Coupons',
      path: '/admin/coupons',
      icon: <CouponIcon />
    },
    {
      title: 'Contact Messages',
      path: '/admin/contacts',
      icon: <ContactIcon />
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: <SettingsIcon />
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed" open={open} className="bg-primary-main">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Instrument Haven Admin
          </Typography>
          
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                {user?.name?.charAt(0) || 'A'}
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
              <MenuItem onClick={() => { handleClose(); navigate('/admin/profile'); }}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled variant="permanent" open={open}>
        <DrawerHeader className="bg-primary-main text-white flex justify-between">
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, marginLeft: 2 }}>
            Admin Panel
          </Typography>
          <IconButton color="inherit" onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.path}>
              {item.submenu ? (
                <>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        backgroundColor: isActive(item.path) ? 'rgba(0, 102, 204, 0.1)' : 'transparent',
                      }}
                      onClick={() => handleMenuToggle(item.title)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: isActive(item.path) ? 'primary.main' : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        sx={{ 
                          opacity: open ? 1 : 0,
                          color: isActive(item.path) ? 'primary.main' : 'inherit',
                        }} 
                      />
                      {open && (menuOpen[item.title] ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open && menuOpen[item.title]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.submenu.map((subitem) => (
                        <ListItemButton 
                          key={subitem.path}
                          component={Link}
                          to={subitem.path}
                          sx={{ 
                            pl: 4,
                            backgroundColor: location.pathname === subitem.path ? 'rgba(0, 102, 204, 0.1)' : 'transparent',
                          }}
                        >
                          <ListItemText 
                            primary={subitem.title} 
                            sx={{
                              color: location.pathname === subitem.path ? 'primary.main' : 'inherit',
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      backgroundColor: (item.exact ? location.pathname === item.path : isActive(item.path)) 
                        ? 'rgba(0, 102, 204, 0.1)' 
                        : 'transparent',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: (item.exact ? location.pathname === item.path : isActive(item.path)) 
                          ? 'primary.main' 
                          : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title} 
                      sx={{ 
                        opacity: open ? 1 : 0,
                        color: (item.exact ? location.pathname === item.path : isActive(item.path)) 
                          ? 'primary.main' 
                          : 'inherit',
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'error.main',
                }}
              >
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                sx={{ 
                  opacity: open ? 1 : 0,
                  color: 'error.main',
                }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </DrawerStyled>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;