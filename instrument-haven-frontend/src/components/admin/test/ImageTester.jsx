import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress
} from '@mui/material';

/**
 * Image Tester Component
 * 
 * This component is used to test image URLs and troubleshoot image loading issues.
 * It lets you:
 * 1. Test different base URLs for image loading
 * 2. Test both relative and absolute paths
 * 3. See what URL transformations are happening
 * 4. Debug image loading failures
 */
const ImageTester = () => {
  const [storageUrl, setStorageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');
  const [imagePath, setImagePath] = useState('categories/example.jpg');
  const [testUrls, setTestUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  
  // Function to create test URLs with different formatting
  const generateTestUrls = () => {
    // Clean storageUrl (remove trailing slash if exists)
    const cleanStorageUrl = storageUrl.endsWith('/') 
      ? storageUrl.slice(0, -1) 
      : storageUrl;
      
    // Clean imagePath (add leading slash if missing)
    const cleanImagePath = imagePath.startsWith('/') 
      ? imagePath 
      : '/' + imagePath;
    
    // Generate different URL combinations for testing
    const urls = [
      // Direct concatenation
      `${storageUrl}${imagePath}`,
      // With slash handling
      `${cleanStorageUrl}${cleanImagePath}`,
      // Double slash test
      `${storageUrl}/${imagePath}`,
      // With subdirectory
      `${cleanStorageUrl}/categories${imagePath.includes('categories') ? imagePath.replace('categories', '') : cleanImagePath}`,
      // Just path relative to public
      `/storage/${imagePath}`
    ];
    
    setTestUrls(urls);
  };
  
  // Update test URLs when inputs change
  useEffect(() => {
    generateTestUrls();
  }, [storageUrl, imagePath]);
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Image URL Tester
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Storage Base URL
        </Typography>
        <TextField
          fullWidth
          value={storageUrl}
          onChange={(e) => setStorageUrl(e.target.value)}
          placeholder="http://localhost:8000/storage"
          helperText="Base URL for storage (from .env VITE_STORAGE_URL)"
          sx={{ mb: 2 }}
        />
        
        <Typography variant="subtitle1" gutterBottom>
          Image Path
        </Typography>
        <TextField
          fullWidth
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
          placeholder="categories/example.jpg"
          helperText="Relative path to the image (e.g. from the Laravel storage/app/public folder)"
        />
      </Box>
      
      <Button 
        variant="contained" 
        onClick={generateTestUrls}
        sx={{ mb: 3 }}
      >
        Generate Test URLs
      </Button>
      
      <Typography variant="h6" gutterBottom>
        Test Results
      </Typography>
      
      {testUrls.map((url, index) => (
        <Box key={index} sx={{ mb: 4, border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Test URL {index + 1}:
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              bgcolor: '#f5f5f5', 
              p: 1, 
              borderRadius: 1,
              fontFamily: 'monospace',
              mb: 2,
              wordBreak: 'break-all'
            }}
          >
            {url}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Image Preview:
            </Typography>
            <Box
              component="img"
              src={url}
              alt={`Test ${index + 1}`}
              sx={{ 
                maxWidth: '100%', 
                height: 'auto',
                maxHeight: '200px',
                border: '1px dashed #ccc'
              }}
              onError={(e) => {
                console.error(`Image failed to load: ${url}`);
                e.target.onerror = null; // Prevent infinite error loop
                e.target.src = '/images/categories/music-instruments.jpg'; // Default fallback
                e.target.style.border = '2px solid red'; // Visual error indicator
              }}
              onLoad={(e) => {
                console.log(`Image loaded successfully: ${url}`);
                e.target.style.border = '2px solid green'; // Visual success indicator
              }}
            />
          </Box>
          
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
            Image status will be logged to console
          </Typography>
        </Box>
      ))}
      
      <Typography variant="h6" gutterBottom>
        Upload Test
      </Typography>
      <Box>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              // Here you could implement a test upload if needed
              console.log('File selected:', e.target.files[0].name);
              // Display preview
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = document.getElementById('upload-preview');
                img.src = event.target.result;
              };
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
        <Box sx={{ mt: 2 }}>
          <img 
            id="upload-preview" 
            alt="Upload preview" 
            style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginTop: '10px' }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ImageTester;