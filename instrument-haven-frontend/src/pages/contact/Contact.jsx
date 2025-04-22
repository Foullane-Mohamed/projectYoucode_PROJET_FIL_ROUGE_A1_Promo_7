import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LocationOn, Phone, Email, Send } from '@mui/icons-material';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
});

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setError('');
    setEmailSent(false);
    
    try {
      // Use our API service to send the contact form
      await api.contact.send(values);
      
      setFormSubmitted(true);
      setEmailSent(true);
      resetForm();
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error sending contact form:', err);
      setError(err.response?.data?.message || 'Failed to send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
        Have questions about our products or services? Reach out to us and we'll get back to you as soon as possible.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Get In Touch
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3 }}>
              <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1">Our Location</Typography>
                <Typography variant="body2" color="text.secondary">
                  123 Music Street, Harmony City
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3 }}>
              <Phone sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1">Phone Number</Typography>
                <Typography variant="body2" color="text.secondary">
                  +1 (123) 456-7890
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3 }}>
              <Email sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1">Email Address</Typography>
                <Typography variant="body2" color="text.secondary">
                  info@instrumenthaven.com
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Business Hours
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body2">Monday - Friday:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">9:00 AM - 6:00 PM</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Saturday:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">10:00 AM - 4:00 PM</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Sunday:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Closed</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            {formSubmitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="subtitle2">
                  Your message has been sent successfully to our team at mohamedfoullane@gmail.com!
                </Typography>
                <Typography variant="body2">
                  We'll review your inquiry and get back to you as soon as possible.
                </Typography>
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Formik
              initialValues={{
                name: '',
                email: '',
                subject: '',
                message: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="name"
                        label="Your Name"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="subject"
                        label="Subject"
                        error={touched.subject && Boolean(errors.subject)}
                        helperText={touched.subject && errors.subject}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="message"
                        label="Message"
                        multiline
                        rows={6}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {/* Send Message button removed */}
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;