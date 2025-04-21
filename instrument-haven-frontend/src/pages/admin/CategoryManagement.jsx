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
  TablePagination,
  InputAdornment,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
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
  
  // Pagination and filtering state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  // Simplified state without additional filters
  const [orderBy] = useState('id');
  const [direction] = useState('asc');
  // Track if categories have been loaded
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch on initial component mount

  const fetchCategories = async (currentPage = page, currentRowsPerPage = rowsPerPage, currentSearchTerm = searchTerm) => {
    setLoading(true);
    try {
      // Build params for API request
      const params = {
        page: currentPage + 1, // API uses 1-based pagination
        per_page: currentRowsPerPage,
        order_by: orderBy,
        direction: direction
      };
      
      // Add search param if there's a search term
      if (currentSearchTerm && currentSearchTerm.trim()) {
        params.search = currentSearchTerm.trim();
      }
      
      // First try to get categories through admin API
      let response;
      try {
        response = await api.admin.getCategories(params);
        
        // Log the successful response for debugging
        console.log('Categories API response:', response);
        
      } catch (adminApiError) {
        console.warn('Admin API getCategories failed, trying regular API:', adminApiError);
        // Fall back to regular categories API if admin API fails
        response = await api.categories.getAll(params);
      }
      
      // Extract data based on API response format
      let categoriesData = [];
      let paginationData = null;
      
      // Handle different response formats from API
      if (response.data?.data?.categories) {
        if (Array.isArray(response.data.data.categories)) {
          // Not paginated
          categoriesData = response.data.data.categories;
        } else if (response.data.data.categories.data) {
          // Laravel paginated format
          categoriesData = response.data.data.categories.data;
          paginationData = response.data.data.categories;
        } else {
          console.warn('Unexpected categories format:', response.data.data.categories);
        }
      } else if (response.data?.categories) {
        if (Array.isArray(response.data.categories)) {
          categoriesData = response.data.categories;
        } else if (response.data.categories.data) {
          categoriesData = response.data.categories.data;
          paginationData = response.data.categories;
        } else {
          console.warn('Unexpected categories format:', response.data.categories);
        }
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else {
        console.warn('Unexpected response format:', response.data);
      }
      
      // Safety check - ensure we have an array
      if (!Array.isArray(categoriesData)) {
        console.warn('Categories data is not an array, defaulting to empty array');
        categoriesData = [];
      }
      
      // Set state with fetched data
      setCategories(categoriesData);
      
      // Update total items if pagination info is available
      if (paginationData && paginationData.total !== undefined) {
        setTotalItems(paginationData.total);
      } else {
        setTotalItems(categoriesData.length);
      }
      
      // Get all categories for parent dropdown (not paginated)
      try {
        const allCatsResponse = await api.categories.getAll();
        let allCats = [];
        
        if (allCatsResponse.data?.data?.categories) {
          allCats = Array.isArray(allCatsResponse.data.data.categories) 
            ? allCatsResponse.data.data.categories 
            : (allCatsResponse.data.data.categories.data || []);
        } else if (allCatsResponse.data?.categories) {
          allCats = Array.isArray(allCatsResponse.data.categories)
            ? allCatsResponse.data.categories
            : (allCatsResponse.data.categories.data || []);
        } else if (Array.isArray(allCatsResponse.data)) {
          allCats = allCatsResponse.data;
        }
        
        // Filter parent categories (those with null parent_id)
        const parentCats = allCats.filter(cat => !cat.parent_id);
        setParentCategories(parentCats);
      } catch (error) {
        console.warn('Could not fetch parent categories:', error);
        // Don't fail the whole operation if we can't get parent categories
      }
      
      // Show a toast message only if it's the first successful load (not on pagination/search)
      if (!categoriesLoaded) {
        toast.success('Categories loaded successfully');
        setCategoriesLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // More specific error message to help debugging
      const errorDetail = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to fetch categories: ${errorDetail}`);
      
      setSnackbar({
        open: true,
        message: `Failed to fetch categories. Please try again. (${errorDetail})`,
        severity: 'error'
      });
      
      // Don't clear categories on error to prevent blank screen after failed update
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
  
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchCategories(newPage, rowsPerPage, searchTerm);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
    fetchCategories(0, newRowsPerPage, searchTerm);
  };
  
  // Search handler with debounce
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    // Debounce search to prevent too many API calls
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    window.searchTimeout = setTimeout(() => {
      setPage(0); // Reset to first page when searching
      fetchCategories(0, rowsPerPage, value);
    }, 500); // Wait 500ms after user stops typing
  };
  
  // We removed filter changes handler as it's no longer needed

  // Find category name by id
  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'None';
  };

  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <CircularProgress color="error" size={60} />
        <Typography sx={{ mt: 2 }}>Loading categories...</Typography>
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
          color="error"
          sx={{ borderRadius: '25px', backgroundColor: '#ff445a', '&:hover': { backgroundColor: '#e03a4f' } }}
        >
          Add Category
        </Button>
      </Box>
      
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
              Search Categories
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by name or description"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: '25px' }
              }}
            />
          </Box>
        </Box>
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
            {categories.length > 0 ? (
              categories.map((category) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                      <CircularProgress color="error" size={40} />
                      <Typography variant="body2" sx={{ mt: 2 }}>Loading categories...</Typography>
                    </Box>
                  ) : 'No categories found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Pagination Component */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ overflow: 'visible' }} // Prevent any overflow issues with the fixed footer
        />
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