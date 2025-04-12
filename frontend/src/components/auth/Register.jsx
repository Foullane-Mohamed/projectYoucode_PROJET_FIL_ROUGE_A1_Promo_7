import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert, CircularProgress, Grid } from '@mui/material';
import { authService } from '../../services/api';
import { setAuthData } from '../../utils/auth';
import AuthLayout from './AuthLayout';

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
});

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccess('');
      
      const response = await authService.register(values);
      
      if (response.status === 'success') {
        // Save auth data
        setAuthData(response.data);
        setSuccess('Registration successful! Redirecting to dashboard...');
        
        // Redirect after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data?.errors) {
        // Format validation errors
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(validationErrors);
      } else {
        setError(
          err.response?.data?.message || 
          'An error occurred during registration. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create an Account">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}

      <Formik
        initialValues={{ 
          name: '', 
          email: '', 
          password: '', 
          password_confirmation: '',
          phone: '',
          address: ''
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Box mb={3}>
              <Field
                as={TextField}
                name="name"
                label="Full Name"
                fullWidth
                variant="outlined"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Box>

            <Box mb={3}>
              <Field
                as={TextField}
                name="email"
                label="Email Address"
                fullWidth
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box mb={3}>
                  <Field
                    as={TextField}
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    variant="outlined"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box mb={3}>
                  <Field
                    as={TextField}
                    name="password_confirmation"
                    type="password"
                    label="Confirm Password"
                    fullWidth
                    variant="outlined"
                    error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                    helperText={touched.password_confirmation && errors.password_confirmation}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box mb={3}>
              <Field
                as={TextField}
                name="phone"
                label="Phone Number (Optional)"
                fullWidth
                variant="outlined"
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
            </Box>

            <Box mb={4}>
              <Field
                as={TextField}
                name="address"
                label="Address (Optional)"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="mb-3 py-2 bg-primary-main hover:bg-primary-dark"
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-main hover:underline">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Register;