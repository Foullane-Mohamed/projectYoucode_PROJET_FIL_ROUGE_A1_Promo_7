import React from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import { 
  MusicNote as MusicNoteIcon, 
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon 
} from '@mui/icons-material';
import '../../styles/featuresRow.css';

const FeaturesRow = () => {
  return (
    <Box className="features-row-container">
      <Container maxWidth="lg">
        <Box className="features-row-header">
          <Typography variant="h3" component="h2" className="features-row-title">
            Why Choose Us
          </Typography>
          <Typography variant="subtitle1" className="features-row-subtitle">
            We offer premium instruments and exceptional service for musicians of all levels
          </Typography>
        </Box>
        
        <Box className="features-row">
          <Box className="feature-item quality">
            <Box className="feature-icon-container">
              <MusicNoteIcon className="feature-icon" />
            </Box>
            <Typography variant="h6" className="feature-name">
              Quality Instruments
            </Typography>
            <Typography variant="body2" className="feature-desc">
              Exceptional quality and sound
            </Typography>
          </Box>
          
          <Box className="feature-item delivery">
            <Box className="feature-icon-container">
              <ShippingIcon className="feature-icon" />
            </Box>
            <Typography variant="h6" className="feature-name">
              Fast Delivery
            </Typography>
            <Typography variant="body2" className="feature-desc">
              Free shipping on orders over $100
            </Typography>
          </Box>
          
          <Box className="feature-item payment">
            <Box className="feature-icon-container">
              <SecurityIcon className="feature-icon" />
            </Box>
            <Typography variant="h6" className="feature-name">
              Secure Payment
            </Typography>
            <Typography variant="body2" className="feature-desc">
              Safe and guaranteed transactions
            </Typography>
          </Box>
          
          <Box className="feature-item support">
            <Box className="feature-icon-container">
              <SupportIcon className="feature-icon" />
            </Box>
            <Typography variant="h6" className="feature-name">
              Expert Support
            </Typography>
            <Typography variant="body2" className="feature-desc">
              Personalized assistance
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesRow;