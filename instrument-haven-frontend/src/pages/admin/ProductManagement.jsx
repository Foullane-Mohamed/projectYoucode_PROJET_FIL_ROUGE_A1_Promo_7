import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { PRODUCT_IMAGES } from '../../components/common/constants';
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
  TablePagination,
  IconButton,
  Chip,
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
  Grid,
  Input,
  Snackbar,
  Alert,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [storageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');

  // Get product image with fallback - using local images
  const getProductImage = (product) => {
    if (product.thumbnail) {
      return `/images/products/${product.thumbnail}`;
    } else if (product.images && product.images.length > 0) {
      return `/images/products/${product.images[0]}`;
    }
    
    // Use placeholder image as fallback
    const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
    return PRODUCT_IMAGES[index];
  };
  
  // Function to get product image URL with enhanced path handling
  const getProductImageUrl = (product) => {
    // Debug the image properties for this product
    console.log(`Product ID: ${product.id}, Image URL: ${product.image_url}, Images: ${JSON.stringify(product.images)}, Thumbnail: ${product.thumbnail}`);
    
    // Check for direct image_url first (new format)
    if (product.image_url) {
      // Normalize path - ensure it doesn't have double slashes
      const normalizedPath = product.image_url.replace(/^\/+/, '');
      // Add cache-busting parameter to ensure fresh image
      return `${storageUrl}/${normalizedPath}?t=${Date.now()}`;
    }
    
    // Next check for the thumbnail or first image in the images array (old format)
    if (product.thumbnail) {
      return `/images/products/${product.thumbnail}`;
    } else if (product.images && product.images.length > 0) {
      return `/images/products/${product.images[0]}`;
    }
    
    // Use fallback placeholder image based on product ID
    const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
    return PRODUCT_IMAGES[index];
  };

  useEffect(() => {
    fetchProducts();
    
    // Clean console logs after a few seconds
    const timer = setTimeout(() => {
      console.clear();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Use the admin API to get all products
      const response = await api.admin.getProducts();
      console.log('Products response:', response);
      
      // Handle different response formats based on API documentation
      const productsData = response.data?.data?.products || 
                        response.data?.products || 
                        (Array.isArray(response.data) ? response.data : []);
      
      setProducts(productsData);
      
      // Fetch categories for the form
      const categoriesResponse = await api.categories.getAll();
      console.log('Categories response:', categoriesResponse);
      
      // Handle different response formats based on API documentation
      const categoriesData = categoriesResponse.data?.data?.categories || 
                          categoriesResponse.data?.categories || 
                          (Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
      
      setCategories(categoriesData);

    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products: ' + (error.response?.data?.message || 'Unknown error'));
      setSnackbar({
        open: true,
        message: 'Failed to fetch products. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setCurrentProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: ''
    });
    setSelectedFiles([]);
    setFilePreview([]);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product) => {
    setDialogMode('edit');
    // Convert all category_id to string to match with <Select> value format
    const categoryId = product.category_id ? product.category_id.toString() : '';
    setCurrentProduct({ 
      ...product,
      category_id: categoryId
    });
    setSelectedFiles([]);
    setFilePreview([]);
    setOpenDialog(true);
    console.log('Opening edit dialog with category_id:', categoryId);
  };

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreview(previews);
    
    // Log file information for debugging
    files.forEach(file => {
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };



  const handleSaveProduct = async () => {
    try {
      console.log('Current product data:', currentProduct); // Debug log

      // Validate required fields
      if (!currentProduct.name) {
        toast.error('Product name is required');
        return;
      }
      if (!currentProduct.description) {
        toast.error('Product description is required');
        return;
      }
      if (!currentProduct.price) {
        toast.error('Product price is required');
        return;
      }
      if (!currentProduct.stock) {
        toast.error('Product stock is required');
        return;
      }
      if (!currentProduct.category_id) {
        toast.error('Product category is required');
        return;
      }

      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add all fields from current product
      Object.keys(currentProduct).forEach(key => {
        // Skip complex objects and image-related fields as we'll handle them separately
        if (!['image', 'image_url', 'images', 'thumbnail', 'specifications', 'attributes'].includes(key) && 
            typeof currentProduct[key] !== 'object') {
          // For boolean values, convert to 1 or 0
          if (typeof currentProduct[key] === 'boolean') {
            formData.append(key, currentProduct[key] ? '1' : '0');
          } else if (currentProduct[key] !== null && currentProduct[key] !== undefined) {
            formData.append(key, currentProduct[key]);
          }
        }
      });
      
      // Debug log - check what's being added to formData
      console.log('Category ID being sent:', currentProduct.category_id);
      
      // Handle special fields and objects separately
      // Append specifications if available
      if (currentProduct.specifications) {
        formData.append('specifications', JSON.stringify(currentProduct.specifications));
      }
      
      // Append attributes if available
      if (currentProduct.attributes) {
        formData.append('attributes', JSON.stringify(currentProduct.attributes));
      }
      
      // Append images if there are any
      if (selectedFiles.length > 0) {
        // Log the files being appended
        console.log('Appending files to FormData:');
        
        selectedFiles.forEach((file, index) => {
          // Use a consistent naming convention for files
          const fileName = file.name.toLowerCase().replace(/\s+/g, '-');
          console.log(`Appending file[${index}]:`, fileName);
          
          // Append with explicit file name to preserve the original file name
          formData.append(`images[${index}]`, file, fileName);
          
          // Also save the original filename for reference
          formData.append(`image_names[${index}]`, fileName);
        });
        
        // Add a flag to copy files to the public directory
        formData.append('use_local_storage', 'true');
      }
      
      let response;
      // Use the admin API for product operations
      if (dialogMode === 'add') {
        // Output the FormData content for debugging
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        response = await api.admin.createProduct(formData);
        toast.success('Product created successfully!');
        setSnackbar({
          open: true,
          message: 'Product created successfully!',
          severity: 'success'
        });
      } else {
        // For edit mode
        if (selectedFiles.length > 0) {
          // Option to replace all existing images
          formData.append('replace_images', 'true');
          // Add a flag for local storage in edit mode as well
          formData.append('use_local_storage', 'true');
        } else {
          // If no new images, we want to keep existing filenames
          formData.append('keep_existing_images', 'true');
          
          // Include existing image names if available
          if (currentProduct.images && currentProduct.images.length > 0) {
            currentProduct.images.forEach((image, index) => {
              formData.append(`existing_images[${index}]`, image);
            });
          }
        }
        
        // Use the admin API for product update
        response = await api.admin.updateProduct(currentProduct.id, formData);
        toast.success('Product updated successfully!');
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success'
        });
      }
      
      console.log('Product saved response:', response);
      // Refresh the product list
      fetchProducts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error);
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to save product');
      }
      
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode === 'add' ? 'create' : 'update'} product: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      // Use the admin API for product deletion
      const response = await api.admin.deleteProduct(productToDelete.id);
      console.log('Delete product response:', response);
      
      // Filter out the deleted product from the current list
      setProducts(products.filter(product => product.id !== productToDelete.id));
      
      toast.success('Product deleted successfully!');
      setSnackbar({
        open: true,
        message: 'Product deleted successfully!',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
      setSnackbar({
        open: true,
        message: `Failed to delete product: ${error.response?.data?.message || 'Unknown error'}`,
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
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        overflow: 'hidden',
                        borderRadius: 1,
                      }}
                    >
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite error loop
                          const index = Math.abs((product.id % PRODUCT_IMAGES.length)) || 0;
                          e.target.src = PRODUCT_IMAGES[index];
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || 'N/A'}</TableCell>
                  <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      color={product.stock > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(product)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Product' : 'Edit Product'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={currentProduct?.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={currentProduct?.description || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={currentProduct?.price || ''}
                  onChange={handleInputChange}
                  InputProps={{ startAdornment: '$' }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={currentProduct?.stock || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category_id"
                    value={currentProduct?.category_id || ''}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Product Images
                </Typography>
                <Input
                  type="file"
                  inputProps={{ multiple: true }}
                  onChange={handleFileChange}
                />
                {filePreview.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                    {filePreview.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 100,
                          height: 100,
                          m: 1,
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                {dialogMode === 'edit' && currentProduct?.images && currentProduct.images.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Current Images
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {currentProduct.images.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 100,
                            height: 100,
                            m: 1,
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                        <img
                            src={product.image_url ? `${storageUrl}/${product.image_url}?t=${Date.now()}` : `/images/products/${image}`}
                            alt={`Current ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite error loop
                              const imgIndex = Math.abs((currentProduct.id % PRODUCT_IMAGES.length)) || 0;
                              e.target.src = PRODUCT_IMAGES[imgIndex];
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Note: Uploading new images will replace the current ones.
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {dialogMode === 'add' ? 'Add Product' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error">
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

export default ProductManagement;