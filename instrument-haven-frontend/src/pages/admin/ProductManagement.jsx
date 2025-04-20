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

  useEffect(() => {
    fetchProducts();
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
    setCurrentProduct({ 
      ...product
    });
    setSelectedFiles([]);
    setFilePreview([]);
    setOpenDialog(true);
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
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Append text fields
      formData.append('name', currentProduct.name);
      formData.append('description', currentProduct.description);
      formData.append('price', currentProduct.price);
      formData.append('stock', currentProduct.stock);
      formData.append('category_id', currentProduct.category_id);
      
      if (currentProduct.brand) {
        formData.append('brand', currentProduct.brand);
      }
      
      // Handle sale price and on_sale status
      if (currentProduct.sale_price) {
        formData.append('sale_price', currentProduct.sale_price);
        formData.append('on_sale', currentProduct.on_sale ? '1' : '0');
      }
      

      
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
        selectedFiles.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }
      
      let response;
      // Use the admin API for product operations
      if (dialogMode === 'add') {
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
                        src={
                          product.thumbnail
                            ? `${storageUrl}/${product.thumbnail}`
                            : (product.images && product.images.length > 0
                              ? `${storageUrl}/${product.images[0]}`
                              : '/placeholder.png')
                        }
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
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
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
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
                            src={`${storageUrl}/${image}`}
                            alt={`Current ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/placeholder.png';
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