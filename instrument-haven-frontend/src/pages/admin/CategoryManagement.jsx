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
      // Use the categories API
      const response = await api.categories.getAll();
      console.log('Categories response:', response);
      
      // Handle different response formats
      const categoriesData = Array.isArray(response.data) ? 
        response.data : 
        (response.data && Array.isArray(response.data.data)) ? 
          response.data.data : 
          (response.data && response.data.categories) ? 
            response.data.categories : [];
      
      setCategories(categoriesData);
      
      // Filter parent categories (those with null parent_id)
      const parentCats = categoriesData.filter(cat => !cat.parent_id);
      setParentCategories(parentCats);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      let response;
      if (dialogMode === 'add') {
        // Use the admin API for creating a new category
        response = await api.admin.createCategory(currentCategory);
        console.log('Create category response:', response);
        
        setSnackbar({
          open: true,
          message: 'Category created successfully!',
          severity: 'success'
        });
      } else {
        // Use the admin API for updating a category
        response = await api.admin.updateCategory(currentCategory.id, currentCategory);
        console.log('Update category response:', response);
        
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
      await api.admin.deleteCategory(categoryToDelete.id);
      console.log('Category deleted, id:', categoryToDelete.id);
      
      // Filter out the deleted category from the current list
      setCategories(categories.filter(category => category.id !== categoryToDelete.id));
      
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
            <FormControl fullWidth>
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