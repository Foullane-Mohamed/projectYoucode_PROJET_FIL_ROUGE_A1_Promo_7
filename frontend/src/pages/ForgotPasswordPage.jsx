import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../api/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { isValidEmail } from '../utils/validators';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(null);
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.status === 'success') {
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
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
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <Alert 
              variant="success" 
              title="Email sent"
              message="If an account exists with this email, you will receive password reset instructions shortly."
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
                  id="email"
                  label="Email address"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                />

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" color="white" /> : 'Send reset link'}
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

export default ForgotPasswordPage;