import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import authService from '../api/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { validatePassword } from '../utils/validators';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState({
    password: '',
    password_confirmation: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      const response = await authService.resetPassword(token, formValues);
      
      if (response.status === 'success') {
        setSuccess(true);
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      
      // Handle validation errors from the API
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          apiErrors[key] = err.response.data.errors[key][0];
        });
        setFormErrors(apiErrors);
      } else {
        setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <Alert 
              variant="success" 
              title="Password reset successful"
              message="Your password has been reset successfully. You will be redirected to the login page shortly."
              className="mb-6" 
              dismissible={false}
            />
          ) : (
            <>
              {error && (
                <Alert 
                  variant="error" 
                  message={error} 
                  className="mb-6" 
                />
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                  id="password"
                  label="New Password"
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
                  label="Confirm New Password"
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
                    {loading ? <Spinner size="sm" color="white" /> : 'Reset Password'}
                  </Button>
                </div>
              </form>
            </>
          )}
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;