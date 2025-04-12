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

// Dashboard placeholder
const Dashboard = () => (
  <Box className="flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
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
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <Box component="main" className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
          
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;