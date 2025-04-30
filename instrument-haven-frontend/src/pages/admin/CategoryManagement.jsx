import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { getCategoryImage } from '../../components/common/constants';
import { buildStorageUrl, addCacheBuster, isImagePath } from '../../utils/imageUtils';
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
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [storageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');
  
  // Function to construct correct image URL
  const getCategoryImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's not a valid image path, use the default image
    if (!isImagePath(imageUrl)) {
      console.warn('Invalid image path:', imageUrl);
      return null;
    }
    
    // Build the storage URL with proper formatting
    const url = buildStorageUrl(imageUrl, storageUrl);
    
    // Add cache buster to prevent browser caching
    return addCacheBuster(url);
  };
  
  // Pagination and filtering state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  // Category management state
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
    console.log('Storage URL for images:', storageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch on initial component mount

  const fetchCategories = async (currentPage = page, currentRowsPerPage = rowsPerPage, currentSearchTerm = searchTerm) => {
    console.log('Fetching categories...');
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
      } catch (adminApiError) {
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
        categoriesData = [];
      }
      
      // Log all image URLs to debug
      categoriesData.forEach(category => {
        if (category.image_url) {
          console.log('Category image URL:', category.name, category.image_url);
          console.log('Full image URL:', getCategoryImageUrl(category.image_url));
        }
      });
      
      // Set state with fetched data
      setCategories(categoriesData);
      
      // Update total items if pagination info is available
      if (paginationData && paginationData.total !== undefined) {
        setTotalItems(paginationData.total);
      } else {
        setTotalItems(categoriesData.length);
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
      description: ''
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
      [name]: value
    });
  };

  const handleSaveCategory = async () => {
    try {
      // Validate the form data
      if (!currentCategory?.name) {
        toast.error('Category name is required');
        return;
      }

      // Always use FormData for file uploads
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', currentCategory.name || '');
      formData.append('description', currentCategory.description || '');
      
      // Add ID for edit mode
      if (dialogMode === 'edit' && currentCategory.id) {
        formData.append('id', currentCategory.id);
      }
      
      // Check if we're uploading a new image
      if (currentCategory.image && currentCategory.image instanceof File) {
        console.log('Uploading image:', currentCategory.image.name, 'size:', currentCategory.image.size, 'bytes');
        formData.append('image', currentCategory.image);
      } else {
        console.log('No new image selected');
      }

      // Log all FormData entries for debugging
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? 
          `File: ${pair[1].name} (${pair[1].size} bytes)` : pair[1]));
      }

      let response;
      if (dialogMode === 'add') {
        console.log('Creating new category...');
        response = await api.admin.createCategory(formData);
        toast.success('Category created successfully!');
      } else {
        console.log('Updating category ID:', currentCategory.id);
        response = await api.admin.updateCategory(currentCategory.id, formData);
        toast.success('Category updated successfully!');
      }
      
      console.log('API response:', response);
      
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
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        overflow: 'hidden',
                        borderRadius: 1,
                        border: '1px solid #ddd',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={category.image_url 
                          ? `${storageUrl}/${category.image_url}` 
                          : '/images/categories/music-instruments.jpg'}
                        alt={category.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.onerror = null; // Prevent infinite error loop
                          e.target.src = '/images/categories/music-instruments.jpg';
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>

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
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
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
              {dialogMode === 'edit' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Image:
                  </Typography>
                  <Box
                    component="img"
                    src={currentCategory?.image_url
                      ? `${storageUrl}/${currentCategory.image_url}` 
                      : '/images/categories/music-instruments.jpg'}
                    alt="Category image"
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #ddd',
                    }}
                    onError={(e) => {
                      console.error('Dialog image failed to load:', e.target.src);
                      e.target.onerror = null; // Prevent infinite error loop
                      e.target.src = '/images/categories/music-instruments.jpg';
                    }}
                  />
                  {currentCategory?.image_url && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Image path: {currentCategory.image_url}
                    </Typography>
                  )}
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
            Are you sure you want to delete the category "{categoryToDelete?.name}"? This may affect products associated with this category.
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