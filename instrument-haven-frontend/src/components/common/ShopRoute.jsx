import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ShopRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is logged in and is an admin, redirect to admin dashboard
  if (user && isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, allow access to the shop
  return children;
};

export default ShopRoute;