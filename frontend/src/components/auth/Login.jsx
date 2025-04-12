import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { authService } from '../../services/api';
import { setAuthData } from '../../utils/auth';
import AuthLayout from './AuthLayout';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await authService.login(values);
      
      if (response.status === 'success') {
        // Save auth data and redirect
        setAuthData(response.data);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred during login. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign In">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
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

            <Box mb={4}>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="mb-3 py-2 bg-primary-main hover:bg-primary-dark"
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-main hover:underline">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Login;