/**
 * API debugging utilities
 */
import axios from 'axios';

/**
 * Test an API endpoint to check if it's working correctly
 * @param {string} url - The full URL to test
 * @param {Object} options - Additional options (headers, auth, etc)
 * @returns {Promise} - Promise with response or error information
 */
export const testEndpoint = async (url, options = {}) => {
  const startTime = Date.now();
  let responseTime;
  
  try {
    console.log(`Testing endpoint: ${url}`);
    console.group('Request Details');
    console.log('Headers:', options.headers || 'Default headers');
    console.log('Method:', options.method || 'GET');
    console.groupEnd();
    
    const response = await axios({
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      withCredentials: options.withCredentials !== undefined ? options.withCredentials : true,
      timeout: options.timeout || 10000,
    });
    
    responseTime = Date.now() - startTime;
    
    console.group('Response Details');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Response Time:', responseTime + 'ms');
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    console.groupEnd();
    
    return {
      success: true,
      status: response.status,
      responseTime,
      data: response.data,
      message: 'Endpoint test successful'
    };
  } catch (error) {
    responseTime = Date.now() - startTime;
    
    console.group('Error Details');
    console.error('Status:', error.response?.status || 'No response');
    console.error('Response Time:', responseTime + 'ms');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Headers:', error.response.headers);
    }
    
    console.groupEnd();
    
    return {
      success: false,
      status: error.response?.status || 0,
      responseTime,
      message: error.message,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Check CORS configuration by testing an API endpoint
 * @param {string} url - The URL to test for CORS issues
 * @returns {Promise} - Promise with the test results
 */
export const testCORS = async (url) => {
  console.log(`Testing CORS for: ${url}`);
  
  try {
    // First, try without credentials to see if the endpoint allows basic requests
    const noCredentialsResult = await testEndpoint(url, { withCredentials: false });
    
    // Then try with credentials (which triggers preflight for CORS)
    const withCredentialsResult = await testEndpoint(url, { withCredentials: true });
    
    console.group('CORS Test Results');
    console.log('Simple Request (no credentials):', noCredentialsResult.success ? 'Success' : 'Failed');
    console.log('Credentialed Request:', withCredentialsResult.success ? 'Success' : 'Failed');
    console.groupEnd();
    
    return {
      success: noCredentialsResult.success || withCredentialsResult.success,
      simpleRequest: noCredentialsResult,
      credentialedRequest: withCredentialsResult,
      recommendation: getCORSRecommendation(noCredentialsResult, withCredentialsResult)
    };
  } catch (error) {
    console.error('CORS test failed:', error);
    return {
      success: false,
      message: 'CORS test failed with an unexpected error',
      error: error.message
    };
  }
};

/**
 * Generate CORS configuration recommendations based on test results
 * @param {Object} simpleRequest - Results from the simple request test
 * @param {Object} credentialedRequest - Results from the credentialed request test
 * @returns {string} - Recommendation text
 */
const getCORSRecommendation = (simpleRequest, credentialedRequest) => {
  if (simpleRequest.success && credentialedRequest.success) {
    return 'CORS is correctly configured for both simple and credentialed requests.';
  }
  
  if (simpleRequest.success && !credentialedRequest.success) {
    return 'The API allows simple requests but not credentialed requests. ' +
      'The server may need to add Access-Control-Allow-Credentials: true header and ' +
      'specify the exact origin instead of a wildcard (*) in Access-Control-Allow-Origin.';
  }
  
  if (!simpleRequest.success && !credentialedRequest.success) {
    return 'CORS is not properly configured. The server needs to add the appropriate ' +
      'Access-Control-Allow-Origin header. Check the server CORS configuration.';
  }
  
  return 'Unusual CORS behavior detected. Credentialed requests work but simple requests fail.';
};

/**
 * Test endpoints specifically for a wishlist feature
 * @param {string} baseUrl - The API base URL
 * @param {string} token - Authorization token (if available)
 * @returns {Promise} - Promise with all wishlist endpoint test results
 */
export const testWishlistEndpoints = async (baseUrl, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  console.group('Wishlist Endpoints Test');
  
  // Test GET /wishlist endpoint
  const getEndpoint = `${baseUrl}/wishlist`;
  const getResult = await testEndpoint(getEndpoint, { headers });
  
  if (token) {
    // Only test these if we have authentication
    // Test POST /wishlist endpoint with a sample product
    const postEndpoint = `${baseUrl}/wishlist`;
    const postResult = await testEndpoint(postEndpoint, { 
      method: 'POST', 
      headers: { ...headers, 'Content-Type': 'application/json' },
      data: { product_id: 1 } // Sample product ID
    });
    
    // Test DELETE /wishlist/{id} endpoint
    const deleteEndpoint = `${baseUrl}/wishlist/1`; // Sample product ID
    const deleteResult = await testEndpoint(deleteEndpoint, { 
      method: 'DELETE', 
      headers 
    });
    
    console.groupEnd();
    
    return {
      get: getResult,
      post: postResult,
      delete: deleteResult
    };
  }
  
  console.groupEnd();
  
  return {
    get: getResult,
    message: 'Only tested GET endpoint because no authentication token was provided'
  };
};
