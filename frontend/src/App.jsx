import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminRoute from './components/auth/AdminRoute';

// Admin Components
import {
  AdminLayout,
  Dashboard as AdminDashboard,
  CategoryList,
  ProductList,
  UserList,
  OrderList
} from './components/admin';

// Auth utilities
import { isAuthenticated } from './utils/auth';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      light: '#4da6ff',
      main: '#0066cc',
      dark: '#004c99',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Home placeholder
const Home = () => (
  <Box className="flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-4">Welcome to Instrument Haven</h1>
    <p className="text-center max-w-lg">
      Your one-stop shop for quality musical instruments. Browse our collection and find the perfect instrument for your musical journey.
    </p>
  </Box>
);

// Customer Dashboard placeholder
const CustomerDashboard = () => (
  <Box className="flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
    <p className="text-center max-w-lg">
      Welcome to your dashboard. This is a placeholder page. In a complete implementation, this would show personalized content and recommendations.
    </p>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <CategoryList />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <ProductList />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <UserList />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <OrderList />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          
          {/* Public and Customer Routes */}
          <Route 
            path="/" 
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <Box component="main" className="flex-grow">
                  <Home />
                </Box>
                <Footer />
              </div>
            } 
          />
          <Route 
            path="/login" 
            element={
              <div className="flex flex-col min-h-screen">
                <Login />
              </div>
            } 
          />
          <Route 
            path="/register" 
            element={
              <div className="flex flex-col min-h-screen">
                <Register />
              </div>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <Box component="main" className="flex-grow">
                    <CustomerDashboard />
                  </Box>
                  <Footer />
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}


export default App;