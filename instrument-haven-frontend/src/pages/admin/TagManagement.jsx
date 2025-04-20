// src/pages/admin/TagManagement.jsx
import { Typography, Box, Paper, Alert } from '@mui/material';

const TagManagement = () => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tag Management
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Tags functionality is not available in the backend.
        </Alert>
        <Typography variant="body1">
          The tags feature has been disabled because it is not supported in the current backend implementation.
          If you need to use tags, please implement the necessary backend endpoints first.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TagManagement;