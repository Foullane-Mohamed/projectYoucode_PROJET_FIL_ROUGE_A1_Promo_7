// src/pages/admin/TagManagement.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [currentTag, setCurrentTag] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tags');
      setTags(response.data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch tags. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setCurrentTag({ name: '' });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (tag) => {
    setDialogMode('edit');
    setCurrentTag({ ...tag });
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (tag) => {
    setTagToDelete(tag);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTagToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTag({
      ...currentTag,
      [name]: value
    });
  };

  const handleSaveTag = async () => {
    try {
      let response;
      if (dialogMode === 'add') {
        response = await api.post('/tags', currentTag);
        setSnackbar({
          open: true,
          message: 'Tag created successfully!',
          severity: 'success'
        });
      } else {
        response = await api.put(`/tags/${currentTag.id}`, currentTag);
        setSnackbar({
          open: true,
          message: 'Tag updated successfully!',
          severity: 'success'
        });
      }
      
      // Refresh the tag list
      fetchTags();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tag:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode === 'add' ? 'create' : 'update'} tag. Please try again.`,
        severity: 'error'
      });
    }
  };

  const handleDeleteTag = async () => {
    try {
      await api.delete(`/tags/${tagToDelete.id}`);
      
      // Filter out the deleted tag from the current list
      setTags(tags.filter(tag => tag.id !== tagToDelete.id));
      
      setSnackbar({
        open: true,
        message: 'Tag deleted successfully!',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting tag:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete tag. The tag might be in use by products.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tag Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Tag
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.id}</TableCell>
                <TableCell>{tag.name}</TableCell>
                <TableCell>
                  <Chip label={tag.name} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEditDialog(tag)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleOpenDeleteDialog(tag)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tag Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Tag' : 'Edit Tag'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tag Name"
              name="name"
              value={currentTag?.name || ''}
              onChange={handleInputChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTag} variant="contained">
            {dialogMode === 'add' ? 'Add Tag' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the tag "{tagToDelete?.name}"? This may affect products that use this tag.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteTag} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TagManagement;