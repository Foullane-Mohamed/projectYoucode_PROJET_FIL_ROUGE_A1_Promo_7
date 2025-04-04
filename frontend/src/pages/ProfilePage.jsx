import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/common/Breadcrumb';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { isValidEmail, isValidPhone } from '../utils/validators';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize form values when user data is available
  useEffect(() => {
    if (user) {
      setFormValues(prevValues => ({
        ...prevValues,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);
  
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
    
    // Clear success/error message when user starts typing
    if (success || error) {
      setSuccess(false);
      setError(null);
    }
  };
  
  const validateProfileForm = () => {
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!formValues.current_password) {
      errors.current_password = 'Current password is required';
    }
    
    if (!formValues.password) {
      errors.password = 'New password is required';
    } else if (formValues.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formValues.password_confirmation) {
      errors.password_confirmation = 'Please confirm your new password';
    } else if (formValues.password !== formValues.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const profileData = {
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        address: formValues.address
      };
      
      await updateProfile(profileData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Profile update error:', err);
      
      // Handle validation errors from the API
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          apiErrors[key] = err.response.data.errors[key][0];
        });
        setFormErrors(apiErrors);
      } else {
        setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const passwordData = {
        current_password: formValues.current_password,
        password: formValues.password,
        password_confirmation: formValues.password_confirmation
      };
      
      await updateProfile(passwordData);
      
      // Clear password fields on success
      setFormValues({
        ...formValues,
        current_password: '',
        password: '',
        password_confirmation: ''
      });
      
      setSuccess('Password updated successfully');
    } catch (err) {
      console.error('Password update error:', err);
      
      // Handle validation errors from the API
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          apiErrors[key] = err.response.data.errors[key][0];
        });
        setFormErrors(apiErrors);
      } else {
        setError(err.response?.data?.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Profile', path: '/profile' },
        ]} 
        className="mb-8"
      />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Side navigation */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <nav className="divide-y divide-gray-200">
              <button
                className={`w-full text-left px-6 py-4 ${
                  activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile
                </div>
              </button>
              
              <button
                className={`w-full text-left px-6 py-4 ${
                  activeTab === 'password' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('password')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Change Password
                </div>
              </button>
              
              <Link
                to="/orders"
                className="block px-6 py-4 text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  Orders
                </div>
              </Link>
              
              <Link
                to="/wishlist"
                className="block px-6 py-4 text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Wishlist
                </div>
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {success && (
              <Alert 
                variant="success" 
                message={success} 
                className="m-6" 
              />
            )}
            
            {error && (
              <Alert 
                variant="error" 
                message={error} 
                className="m-6" 
              />
            )}
            
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 gap-6">
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
                      label="Email Address"
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
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? <Spinner size="sm" color="white" /> : 'Update Profile'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'password' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      id="current_password"
                      label="Current Password"
                      type="password"
                      name="current_password"
                      required
                      value={formValues.current_password}
                      onChange={handleChange}
                      error={formErrors.current_password}
                    />
                    
                    <Input
                      id="password"
                      label="New Password"
                      type="password"
                      name="password"
                      required
                      value={formValues.password}
                      onChange={handleChange}
                      error={formErrors.password}
                      helperText="At least 8 characters"
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
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? <Spinner size="sm" color="white" /> : 'Update Password'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;