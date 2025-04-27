import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { WishlistContext } from '../../context/WishlistContext';
import { testEndpoint, testWishlistEndpoints, testCORS } from '../../utils/apiDebug';
import { validateWishlist } from '../../utils/debug';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';

const WishlistDiagnostic = () => {
  const { user } = useContext(AuthContext);
  const { wishlist, loading, fetchWishlist } = useContext(WishlistContext);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [corsResult, setCorsResult] = useState(null);
  const [endpointResult, setEndpointResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [validatedWishlist, setValidatedWishlist] = useState([]);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  
  useEffect(() => {
    if (wishlist) {
      const validated = validateWishlist(wishlist);
      setValidatedWishlist(validated);
    }
  }, [wishlist]);
  
  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      // Test CORS setup
      const corsTestResult = await testCORS(`${API_URL}/wishlist`);
      setCorsResult(corsTestResult);
      
      // Test all wishlist endpoints
      const endpointsResult = await testWishlistEndpoints(API_URL, token);
      setEndpointResult(endpointsResult);
      
      // Set overall diagnostic result
      setDiagnosticResult({
        timestamp: new Date().toISOString(),
        success: corsTestResult.success && endpointsResult.get.success,
        message: 'Diagnostic completed'
      });
    } catch (error) {
      console.error('Error running diagnostics:', error);
      setDiagnosticResult({
        timestamp: new Date().toISOString(),
        success: false,
        message: 'Error running diagnostics',
        error: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const refreshWishlist = async () => {
    try {
      await fetchWishlist();
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BugReportIcon sx={{ fontSize: 28, mr: 1, color: 'warning.main' }} />
          <Typography variant="h5">Wishlist Diagnostic Tool</Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Diagnostic Mode</AlertTitle>
          This page helps troubleshoot issues with the wishlist feature. 
          Use the buttons below to test the API connections and data flow.
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<BugReportIcon />}
            onClick={runDiagnostics}
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run Diagnostics'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshWishlist}
            disabled={loading || isRunning}
          >
            Refresh Wishlist
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Authentication Status */}
        <Typography variant="h6" gutterBottom>Authentication Status</Typography>
        <Box sx={{ mb: 3 }}>
          {user ? (
            <Alert severity="success">
              <AlertTitle>Authenticated</AlertTitle>
              Logged in as {user.email || user.name}
            </Alert>
          ) : (
            <Alert severity="warning">
              <AlertTitle>Not Authenticated</AlertTitle>
              You need to log in to use the wishlist feature
            </Alert>
          )}
        </Box>
        
        {/* API Configuration */}
        <Typography variant="h6" gutterBottom>API Configuration</Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            API URL: <code>{API_URL}</code>
          </Typography>
          <Typography variant="body1">
            Wishlist Endpoint: <code>{`${API_URL}/wishlist`}</code>
          </Typography>
        </Box>
        
        {/* Diagnostic Results */}
        {isRunning && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="body1">Running diagnostic tests...</Typography>
          </Box>
        )}
        
        {diagnosticResult && !isRunning && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Diagnostic Results</Typography>
            <Alert severity={diagnosticResult.success ? 'success' : 'error'}>
              <AlertTitle>
                {diagnosticResult.success ? 'All Tests Passed' : 'Tests Failed'}
              </AlertTitle>
              {diagnosticResult.message}
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Timestamp: {new Date(diagnosticResult.timestamp).toLocaleString()}
              </Typography>
            </Alert>
            
            {/* CORS Results */}
            {corsResult && (
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {corsResult.success ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <ErrorIcon color="error" sx={{ mr: 1 }} />
                    )}
                    <Typography>CORS Configuration</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    <strong>Recommendation:</strong> {corsResult.recommendation}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Simple Request:</strong> {corsResult.simpleRequest.success ? 'Success' : 'Failed'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Credentialed Request:</strong> {corsResult.credentialedRequest.success ? 'Success' : 'Failed'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
            
            {/* Endpoint Results */}
            {endpointResult && (
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {endpointResult.get.success ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <ErrorIcon color="error" sx={{ mr: 1 }} />
                    )}
                    <Typography>Endpoint Tests</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    <strong>GET /wishlist:</strong> {endpointResult.get.success ? 'Success' : 'Failed'}
                    {endpointResult.get.status && ` (Status: ${endpointResult.get.status})`}
                    {endpointResult.get.responseTime && ` (Response Time: ${endpointResult.get.responseTime}ms)`}
                  </Typography>
                  
                  {endpointResult.post && (
                    <Typography variant="body2" paragraph>
                      <strong>POST /wishlist:</strong> {endpointResult.post.success ? 'Success' : 'Failed'}
                      {endpointResult.post.status && ` (Status: ${endpointResult.post.status})`}
                    </Typography>
                  )}
                  
                  {endpointResult.delete && (
                    <Typography variant="body2">
                      <strong>DELETE /wishlist/{'{id}'}:</strong> {endpointResult.delete.success ? 'Success' : 'Failed'}
                      {endpointResult.delete.status && ` (Status: ${endpointResult.delete.status})`}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        )}
        
        {/* Wishlist Data */}
        <Typography variant="h6" gutterBottom>Wishlist Data</Typography>
        <Box sx={{ mb: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography>Loading wishlist data...</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                Raw Items Count: {wishlist?.length || 0}
              </Typography>
              <Typography variant="body1" paragraph>
                Valid Items Count: {validatedWishlist.length}
              </Typography>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Wishlist Items</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {validatedWishlist.length > 0 ? (
                    <List dense>
                      {validatedWishlist.map((item, index) => {
                        const product = item.product || item;
                        const productId = item.product_id || (product && product.id);
                        
                        return (
                          <ListItem key={index}>
                            <ListItemText
                              primary={product ? product.name : `Item #${index + 1}`}
                              secondary={
                                <>
                                  <Typography variant="caption" component="span" display="block">
                                    ID: {productId || 'Unknown'}
                                  </Typography>
                                  <Typography variant="caption" component="span" display="block">
                                    Thumbnail: {product && product.thumbnail ? 'Yes' : 'No'}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Typography color="text.secondary">No valid items found in wishlist</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default WishlistDiagnostic;
