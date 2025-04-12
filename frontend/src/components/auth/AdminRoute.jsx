import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../utils/auth';

const AdminRoute = ({ children }) => {
  // Check if user is authenticated and has admin role
  if (!isAuthenticated() || !isAdmin()) {
    // Redirect to login if not authenticated or to dashboard if not admin
    return <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />;
  }
  
  // If user is authenticated and has admin role, render the children
  return children;
};

export default AdminRoute;