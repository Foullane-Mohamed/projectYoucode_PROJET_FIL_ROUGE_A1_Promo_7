import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  LocationOn, 
  Phone, 
  Email, 
  LocalShipping, 
  Refresh, 
  Security, 
  CreditCard,
  AccessTime
} from '@mui/icons-material';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      backgroundImage: 'linear-gradient(to bottom, #f8f9fa, white 400px)', 
      pb: 10,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255, 43, 82, 0.08), rgba(255, 43, 82, 0.01))',
        top: '-50px',
        left: '-100px',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255, 43, 82, 0.05), rgba(255, 43, 82, 0.02))',
        bottom: '100px',
        right: '-50px',
        zIndex: 0
      }} />

      {/* Header section with enhanced styling */}
      <Container maxWidth="lg" sx={{ py: 5, position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          textAlign: 'center', 
          position: 'relative',
          mb: 6,
          pb: 4
        }}>
          <Typography variant="h3" component="h1" align="center" sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(120deg, #FF2B52, #f76e87)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            textAlign: 'center',
            width: '100%'
          }}>
            Contact Us
          </Typography>
          <Box sx={{
            width: '70px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #FF2B52, transparent)',
            margin: '0 auto',
            mt: 3
          }} />
        </Box>
        
        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Card sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
              height: '100%',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '10px',
                background: 'linear-gradient(90deg, #FF2B52, #ff6b89)'
              }
            }}>
              <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{
                  px: 4,
                  pt: 4,
                  pb: 3,
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <Typography variant="h5" gutterBottom sx={{
                    fontWeight: 700,
                    color: '#333',
                    position: 'relative',
                    mb: 1
                  }}>
                    Contact Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Get in touch with our team for any inquiries
                  </Typography>
                </Box>
                
                {/* Contact Items */}
                <Box sx={{ p: 4, pt: 3, flex: 1 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 4,
                    p: 2,
                    borderRadius: '12px',
                    background: alpha('#FF2B52', 0.03),
                    border: '1px solid ' + alpha('#FF2B52', 0.08),
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateX(5px)' }
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      mr: 2,
                      background: alpha('#FF2B52', 0.1)
                    }}>
                      <LocationOn sx={{ color: '#FF2B52', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#444' }}>
                        Our Location
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Agadir International Airport, Morocco
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 4,
                    p: 2,
                    borderRadius: '12px',
                    background: alpha('#FF2B52', 0.03),
                    border: '1px solid ' + alpha('#FF2B52', 0.08),
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateX(5px)' }
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      mr: 2,
                      background: alpha('#FF2B52', 0.1)
                    }}>
                      <Phone sx={{ color: '#FF2B52', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#444' }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +212 647932975
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 4,
                    p: 2,
                    borderRadius: '12px',
                    background: alpha('#FF2B52', 0.03),
                    border: '1px solid ' + alpha('#FF2B52', 0.08),
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateX(5px)' }
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      mr: 2,
                      background: alpha('#FF2B52', 0.1)
                    }}>
                      <Email sx={{ color: '#FF2B52', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#444' }}>
                        Email Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        mohamedfoullane4@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Business Hours */}
                <Box sx={{ 
                  p: 4, 
                  pt: 1, 
                  mt: 'auto', 
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.005), rgba(0,0,0,0.02))'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#444' }}>
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ fontSize: 20, color: '#FF2B52' }} />
                      Business Hours
                    </Box>
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        py: 0.5,
                        fontWeight: 500,
                        color: '#555'
                      }}>
                        <Box component="span" sx={{ 
                          display: 'inline-block', 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          bgcolor: '#FF2B52', 
                          mr: 1,
                          opacity: 0.7
                        }} />
                        Monday - Friday:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ py: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                        9:00 AM - 6:00 PM
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        py: 0.5,
                        fontWeight: 500,
                        color: '#555'
                      }}>
                        <Box component="span" sx={{ 
                          display: 'inline-block', 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          bgcolor: '#FF2B52', 
                          mr: 1,
                          opacity: 0.7
                        }} />
                        Saturday:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ py: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                        10:00 AM - 4:00 PM
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        py: 0.5,
                        fontWeight: 500,
                        color: '#555'
                      }}>
                        <Box component="span" sx={{ 
                          display: 'inline-block', 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          bgcolor: '#FF2B52', 
                          mr: 1,
                          opacity: 0.7
                        }} />
                        Sunday:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ py: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                        Closed
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Card sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
              height: '100%',
              position: 'relative'
            }}>
              <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: isMobile ? '300px' : '100%' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.0682401621134!2d-9.598982899999999!3d30.354378999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3c82e0f1de049%3A0x5be7a68e72f2c60a!2sAgadir%20International%20Airport!5e0!3m2!1sen!2sma!4v1714302760272!5m2!1sen!2sma" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
                
                {/* Map Overlay */}
                <Box sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  maxWidth: 280,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  zIndex: 10,
                  display: { xs: 'none', md: 'block' }
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                    Instrument Haven
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Your Music, Our Passion
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Agadir International Airport, Morocco
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <LocationOn sx={{ color: '#FF2B52', fontSize: 18, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                      30.3543790°N, -9.5989829°E
                    </Typography>
                  </Box>
                </Box>
                
                {/* Map Controls */}
                <Box sx={{
                  position: 'absolute',
                  right: 20,
                  bottom: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  zIndex: 10
                }}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '20px', color: '#555' }}>+</Typography>
                  </Box>
                  
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '22px', color: '#555', lineHeight: 1, mt: '-4px' }}>−</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;