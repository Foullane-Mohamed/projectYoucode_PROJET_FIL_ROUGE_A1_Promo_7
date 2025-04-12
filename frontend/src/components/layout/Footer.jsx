import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" className="bg-gray-100 pt-8 pb-4 mt-auto">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box className="flex items-center mb-4">
              <MusicNoteIcon className="text-primary-main" />
              <Typography 
                variant="h6" 
                component="div"
                className="ml-2 font-bold text-primary-main"
              >
                Instrument Haven
              </Typography>
            </Box>
            <Typography variant="body2" className="text-gray-600 mb-4">
              Your one-stop shop for quality musical instruments and accessories.
            </Typography>
            <Box className="flex space-x-2">
              <MuiLink href="#" color="inherit" className="text-gray-600 hover:text-primary-main">
                <FacebookIcon />
              </MuiLink>
              <MuiLink href="#" color="inherit" className="text-gray-600 hover:text-primary-main">
                <TwitterIcon />
              </MuiLink>
              <MuiLink href="#" color="inherit" className="text-gray-600 hover:text-primary-main">
                <InstagramIcon />
              </MuiLink>
              <MuiLink href="#" color="inherit" className="text-gray-600 hover:text-primary-main">
                <YouTubeIcon />
              </MuiLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="mb-4 font-bold">
              Shop
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-primary-main">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary-main">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-gray-600 hover:text-primary-main">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-gray-600 hover:text-primary-main">
                  Deals & Discounts
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="mb-4 font-bold">
              Customer Service
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-main">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-main">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-primary-main">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-600 hover:text-primary-main">
                  Warranty Information
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="mb-4 font-bold">
              My Account
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary-main">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-primary-main">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary-main">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary-main">
                  My Profile
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
        
        <Box className="border-t border-gray-200 mt-8 pt-4 text-center">
          <Typography variant="body2" className="text-gray-600">
            © {currentYear} Instrument Haven. All rights reserved.
          </Typography>
          <Box className="flex justify-center mt-2 space-x-4">
            <Link to="/terms" className="text-gray-600 hover:text-primary-main text-sm">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-primary-main text-sm">
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;