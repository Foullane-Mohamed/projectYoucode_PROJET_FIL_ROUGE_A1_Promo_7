import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [storageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // First try to get categories through admin API
      let response;
      try {
        response = await api.admin.getCategories();
      } catch (adminApiError) {
        console.warn('Admin API getCategories failed, trying regular API:', adminApiError);
        // Fall back to regular categories API if admin API fails
        response = await api.categories.getAll();
      }
      
      console.log('Categories response:', response);
      
      // Handle different response formats according to API documentation
      const categoriesData = response.data?.data?.categories || 
                         response.data?.categories || 
                         (Array.isArray(response.data) ? response.data : []);
      
      setCategories(categoriesData);
      
      // Filter parent categories (those with null parent_id)
      const parentCats = categoriesData.filter(cat => !cat.parent_id);
      setParentCategories(parentCats);
      
      toast.success('Categories loaded successfully');
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories: ' + (error.response?.data?.message || 'Unknown error'));
      setSnackbar({
        open: true,
        message: 'Failed to fetch categories. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setCurrentCategory({
      name: '',
      description: '',
      parent_id: null
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (category) => {
    setDialogMode('edit');
    setCurrentCategory({ ...category });
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value === "" ? null : value
    });
  };

  const handleSaveCategory = async () => {
    try {
      // Validate the form data
      if (!currentCategory?.name) {
        toast.error('Category name is required');
        return;
      }

      let formData;
      // Always use FormData for consistency with API
      formData = new FormData();
      formData.append('name', currentCategory.name);
      formData.append('description', currentCategory.description || '');
      
      // Handle parent_id (null or empty string means no parent)
      if (currentCategory.parent_id) {
        formData.append('parent_id', currentCategory.parent_id);
      } else {
        // Some APIs require explicit null for parent_id
        formData.append('parent_id', '');
      }
      
      // Check if we're uploading an image
      if (currentCategory.image && currentCategory.image instanceof File) {
        formData.append('image', currentCategory.image);
      }

      let response;
      if (dialogMode === 'add') {
        // Use the admin API for creating a new category
        response = await api.admin.createCategory(formData);
        console.log('Create category response:', response);
        
        toast.success('Category created successfully!');
        setSnackbar({
          open: true,
          message: 'Category created successfully!',
          severity: 'success'
        });
      } else {
        // Use the admin API for updating a category
        response = await api.admin.updateCategory(currentCategory.id, formData);
        console.log('Update category response:', response);
        
        toast.success('Category updated successfully!');
        setSnackbar({
          open: true,
          message: 'Category updated successfully!',
          severity: 'success'
        });
      }
      
      // Refresh the category list
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error.response?.data || error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to save category');
      }
      
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode === 'add' ? 'create' : 'update'} category: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteCategory = async () => {
    try {
      // Use the admin API for deleting a category
      const response = await api.admin.deleteCategory(categoryToDelete.id);
      console.log('Category deleted, response:', response);
      
      // Filter out the deleted category from the current list
      setCategories(categories.filter(category => category.id !== categoryToDelete.id));
      
      toast.success('Category deleted successfully!');
      setSnackbar({
        open: true,
        message: 'Category deleted successfully!',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting category:', error.response?.data || error);
      
      // Provide a more specific error message based on the response
      const errorMessage = error.response?.data?.message || 
                         'Failed to delete category. It may have associated products or subcategories.';
      
      toast.error(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
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

  // Find category name by id
  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'None';
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
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Parent Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.parent_id ? getCategoryName(category.parent_id) : 'None'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEditDialog(category)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleOpenDeleteDialog(category)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Category Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Category' : 'Edit Category'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              name="name"
              value={currentCategory?.name || ''}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={currentCategory?.description || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Parent Category</InputLabel>
              <Select
                name="parent_id"
                value={currentCategory?.parent_id || ''}
                onChange={handleInputChange}
                label="Parent Category"
              >
                <MenuItem value="">None</MenuItem>
                {parentCategories
                  .filter(cat => cat.id !== currentCategory?.id) // Prevent selecting self as parent
                  .map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            {/* Image upload field */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Category Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCurrentCategory({
                      ...currentCategory,
                      image: e.target.files[0]
                    });
                  }
                }}
              />
              {dialogMode === 'edit' && currentCategory?.image_url && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Image:
                  </Typography>
                  <Box
                    component="img"
                    src={`${storageUrl}/${currentCategory.image_url}`}
                    alt="Category image"
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      objectFit: 'cover',
                      borderRadius: 1 
                    }}
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            {dialogMode === 'add' ? 'Add Category' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{categoryToDelete?.name}"? This will also delete all subcategories and may affect products.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCategory} color="error">
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

export default CategoryManagement;