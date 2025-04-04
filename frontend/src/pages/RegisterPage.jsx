import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { isValidEmail, validatePassword, isValidPhone } from '../utils/validators';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formValues.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formValues.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formValues.phone && !isValidPhone(formValues.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formValues.password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formValues.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
      }
    }
    
    if (!formValues.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (formValues.password !== formValues.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await register(formValues);
      
      // Redirect to home page after successful registration
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle validation errors from the API
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          apiErrors[key] = err.response.data.errors[key][0];
        });
        setFormErrors(apiErrors);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          sign in to your existing account
        </Link>
      </p>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {error && (
          <Alert 
            variant="error" 
            message={error} 
            className="mb-6" 
          />
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="name"
            label="Full Name"
            type="text"
            name="name"
            required
            value={formValues.name}
            onChange={handleChange}
            error={formErrors.name}
          />

          <Input
            id="email"
            label="Email address"
            type="email"
            name="email"
            required
            value={formValues.email}
            onChange={handleChange}
            error={formErrors.email}
          />

          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            error={formErrors.phone}
            helperText="Optional"
          />

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formValues.address}
              onChange={handleChange}
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">Optional</p>
          </div>

          <Input
            id="password"
            label="Password"
            type="password"
            name="password"
            required
            value={formValues.password}
            onChange={handleChange}
            error={formErrors.password}
            helperText="At least 8 characters with a mix of letters, numbers & symbols"
          />

          <Input
            id="password_confirmation"
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            required
            value={formValues.password_confirmation}
            onChange={handleChange}
            error={formErrors.password_confirmation}
          />

          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <Spinner size="sm" color="white" /> : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-xs text-gray-600">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
};

export default RegisterPage;