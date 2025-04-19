import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6">Something went wrong</Typography>
            <Typography variant="body2">
              We encountered an error while loading this content.
            </Typography>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'left' }}>
                Error: {this.state.error.toString()}
              </Typography>
            )}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mr: 2 }}
          >
            Refresh Page
          </Button>
          <Button 
            variant="outlined"
            onClick={() => {
              this.setState({ hasError: false });
              if (this.props.onReset) this.props.onReset();
            }}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;