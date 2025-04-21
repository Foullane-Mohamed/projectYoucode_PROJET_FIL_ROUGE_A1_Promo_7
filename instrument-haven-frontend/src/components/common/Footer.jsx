import { Box, Container, Grid, Typography, Link, Divider, useTheme, useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';

// Define drawer width to match the admin sidebar
const drawerWidth = 240;

const Footer = () => {
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Check if we're in the admin section
  const isAdmin = location.pathname.startsWith('/admin');

  // Don't render footer for admin pages
  if (isAdmin) {
    return null;
  }
  // Regular footer for other pages
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Instrument Haven
            </Typography>
            <Typography variant="body2">
              Your one-stop shop for all musical instruments. Whether you're a beginner or a professional, we have instruments that will suit your needs.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block" underline="hover">
              Home
            </Link>
            <Link href="/products" color="inherit" display="block" underline="hover">
              Products
            </Link>
            <Link href="/categories" color="inherit" display="block" underline="hover">
              Categories
            </Link>
            <Link href="/contact" color="inherit" display="block" underline="hover">
              Contact Us
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2">
              Address: 123 Music Street, Harmony City
            </Typography>
            <Typography variant="body2">
              Email: info@instrumenthaven.com
            </Typography>
            <Typography variant="body2">
              Phone: +1 (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Instrument Haven. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;