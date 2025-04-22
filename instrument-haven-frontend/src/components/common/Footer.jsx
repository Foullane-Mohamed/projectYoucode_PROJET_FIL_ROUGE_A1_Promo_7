import { useState } from 'react';
import { Box, Container, Grid, Typography, Link, Divider, TextField, Button, IconButton, useTheme, useMediaQuery, Paper, InputAdornment, Chip } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  YouTube, 
  Pinterest, 
  LocationOn, 
  Phone, 
  Email, 
  MusicNote, 
  Send, 
  KeyboardArrowUp, 
  CreditCard,
  Security,
  LocalShipping,
  Autorenew
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Footer = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Check if we're in the admin section
  const isAdmin = location.pathname.startsWith('/admin');

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Don't render footer for admin pages
  if (isAdmin) {
    return null;
  }

  // Footer links
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const customerService = [
    { name: 'My Account', path: '/profile' },
    { name: 'Track Order', path: '/my-orders' },
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Return Policy', path: '/returns' },
    { name: 'FAQs', path: '/faq' }
  ];

  const paymentMethods = [
    'Visa', 'MasterCard', 'PayPal', 'Apple Pay', 'Google Pay'
  ];

  return (
    <>
      {/* Features Section */}
      <Box 
        sx={{ 
          bgcolor: '#f7f9fc',
          py: 4,
          borderTop: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  px: 2,
                  py: 2
                }}
              >
                <LocalShipping sx={{ fontSize: 44, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On all orders over $100
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  px: 2,
                  py: 2
                }}
              >
                <Autorenew sx={{ fontSize: 44, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  30-Day Returns
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hassle-free return policy
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  px: 2,
                  py: 2
                }}
              >
                <Security sx={{ fontSize: 44, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Secure Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100% secure checkout
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  px: 2,
                  py: 2
                }}
              >
                <CreditCard sx={{ fontSize: 44, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Multiple Payment Options
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Credit cards, PayPal & more
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Footer */}
      <Box
        sx={{
          bgcolor: '#1a1a2e',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <MusicNote sx={{ fontSize: 36, color: theme.palette.primary.main, mr: 1 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '1px'
                  }}
                >
                  INSTRUMENT HAVEN
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                Your one-stop shop for all musical instruments. Whether you're a beginner or a professional, we have instruments that will suit your needs and ignite your passion for music.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <LocationOn sx={{ color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    123 Music Street, Harmony City, HC 12345
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Phone sx={{ color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    +1 (123) 456-7890
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Email sx={{ color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    info@instrumenthaven.com
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  aria-label="Facebook" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: theme.palette.primary.main 
                    } 
                  }}
                >
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="Twitter" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: theme.palette.primary.main 
                    } 
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="Instagram" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: theme.palette.primary.main 
                    } 
                  }}
                >
                  <Instagram fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="YouTube" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: theme.palette.primary.main 
                    } 
                  }}
                >
                  <YouTube fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="Pinterest" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: theme.palette.primary.main 
                    } 
                  }}
                >
                  <Pinterest fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
            
            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: -8,
                    width: 40,
                    height: 2,
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {quickLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    component={RouterLink} 
                    to={link.path} 
                    underline="none"
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)', 
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        color: theme.palette.primary.main,
                        transform: 'translateX(5px)',
                      },
                      display: 'inline-block',
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>
            
            {/* Customer Service */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: -8,
                    width: 40,
                    height: 2,
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                Customer Service
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {customerService.map((link) => (
                  <Link 
                    key={link.name} 
                    component={RouterLink} 
                    to={link.path} 
                    underline="none"
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)', 
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        color: theme.palette.primary.main,
                        transform: 'translateX(5px)',
                      },
                      display: 'inline-block',
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>
            
            {/* Opening Hours */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: -8,
                    width: 40,
                    height: 2,
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                Opening Hours
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Monday - Friday:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                    9:00 AM - 8:00 PM
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Saturday:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                    10:00 AM - 6:00 PM
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Sunday:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                    Closed
                  </Typography>
                </Box>
              </Box>
              
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  mt: 4,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: -8,
                    width: 40,
                    height: 2,
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                Payment Methods
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {paymentMethods.map((method) => (
                  <Chip 
                    key={method}
                    label={method}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontWeight: 500,
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.15)' 
                      } 
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom Bar */}
      <Box
        sx={{
          bgcolor: '#141428',
          color: 'rgba(255,255,255,0.7)',
          py: 3,
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid 
            container 
            alignItems="center" 
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="body2" textAlign={{ xs: 'center', md: 'left' }}>
                © {new Date().getFullYear()} Instrument Haven. All rights reserved.
              </Typography>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-end' },
                gap: 2
              }}
            >
              <Link 
                underline="hover"
                component={RouterLink}
                to="/privacy"
                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}
              >
                Privacy Policy
              </Link>
              <Link 
                underline="hover"
                component={RouterLink}
                to="/terms"
                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}
              >
                Terms of Service
              </Link>
              <Link 
                underline="hover"
                component={RouterLink}
                to="/sitemap"
                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}
              >
                Sitemap
              </Link>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll to Top Button */}
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'absolute',
            right: 20,
            top: -25,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            width: 50,
            height: 50,
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      </Box>
    </>
  );
};

export default Footer;