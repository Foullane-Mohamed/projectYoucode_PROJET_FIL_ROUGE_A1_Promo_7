import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { PRODUCT_IMAGES } from "../../components/common/constants";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const [storageUrl] = useState(
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage"
  );

  const getProductImageUrl = (product) => {
    if (product.image_url) {
      const normalizedPath = product.image_url.replace(/^\/+/, "");
      return `${storageUrl}/${normalizedPath}?t=${Date.now()}`;
    }

    if (product.images && product.images.length > 0) {
      if (product.images[0].startsWith('http')) {
        return product.images[0];
      }
      return `/images/products/${product.images[0]}`;
    }

    if (product.thumbnail) {
      return `/images/products/${product.thumbnail}`;
    }

    const index = Math.abs(product.id % PRODUCT_IMAGES.length) || 0;
    return PRODUCT_IMAGES[index];
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    
    const response = await api.admin.getProducts();
    
    const productsData =
      response.data?.data?.products ||
      response.data?.products ||
      (Array.isArray(response.data) ? response.data : []);

    setProducts(productsData);

    const categoriesResponse = await api.categories.getAll();
    
    const categoriesData =
      categoriesResponse.data?.data?.categories ||
      categoriesResponse.data?.categories ||
      (Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);

    setCategories(categoriesData);
    setLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setCurrentProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
    });
    setSelectedFiles([]);
    setFilePreview([]);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product) => {
    setDialogMode("edit");
    const categoryId = product.category_id
      ? product.category_id.toString()
      : "";
    setCurrentProduct({
      ...product,
      category_id: categoryId,
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

    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreview(previews);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value,
    });
  };

  const handleSaveProduct = async () => {
    if (!currentProduct.name) {
      toast.error("Product name is required");
      return;
    }
    if (!currentProduct.description) {
      toast.error("Product description is required");
      return;
    }
    if (!currentProduct.price) {
      toast.error("Product price is required");
      return;
    }
    if (!currentProduct.stock) {
      toast.error("Product stock is required");
      return;
    }
    if (!currentProduct.category_id) {
      toast.error("Product category is required");
      return;
    }

    const formData = new FormData();

    Object.keys(currentProduct).forEach((key) => {
      if (
        ![
          "image",
          "image_url",
          "images",
          "thumbnail",
          "specifications",
          "attributes",
        ].includes(key) &&
        typeof currentProduct[key] !== "object"
      ) {
        if (typeof currentProduct[key] === "boolean") {
          formData.append(key, currentProduct[key] ? "1" : "0");
        } else if (
          currentProduct[key] !== null &&
          currentProduct[key] !== undefined
        ) {
          formData.append(key, currentProduct[key]);
        }
      }
    });

    if (currentProduct.specifications) {
      formData.append(
        "specifications",
        JSON.stringify(currentProduct.specifications)
      );
    }

    if (currentProduct.attributes) {
      formData.append(
        "attributes",
        JSON.stringify(currentProduct.attributes)
      );
    }

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file, index) => {
        const fileName = file.name.toLowerCase().replace(/\s+/g, "-");
        formData.append(`images[${index}]`, file, fileName);
        formData.append(`image_names[${index}]`, fileName);
      });

      formData.append("use_local_storage", "true");
      formData.append("save_images", "true");
    }

    let response;
    if (dialogMode === "add") {
      response = await api.admin.createProduct(formData);
      toast.success("Product created successfully!");
      setSnackbar({
        open: true,
        message: "Product created successfully!",
        severity: "success",
      });
    } else {
      if (selectedFiles.length > 0) {
        formData.append("replace_images", "true");
        formData.append("use_local_storage", "true");
      } else {
        formData.append("keep_existing_images", "true");

        if (currentProduct.images && currentProduct.images.length > 0) {
          currentProduct.images.forEach((image, index) => {
            formData.append(`existing_images[${index}]`, image);
          });
        }
      }

      response = await api.admin.updateProduct(currentProduct.id, formData);
      toast.success("Product updated successfully!");
      setSnackbar({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });
    }

    fetchProducts();
    handleCloseDialog();
  };

  const handleDeleteProduct = async () => {
    const response = await api.admin.deleteProduct(productToDelete.id);

    setProducts(
      products.filter((product) => product.id !== productToDelete.id)
    );

    toast.success("Product deleted successfully!");
    setSnackbar({
      open: true,
      message: "Product deleted successfully!",
      severity: "success",
    });

    handleCloseDeleteDialog();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
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
                        overflow: "hidden",
                        borderRadius: 1,
                      }}
                    >
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          const index = Math.abs(product.id % PRODUCT_IMAGES.length) || 0;
                          e.target.src = PRODUCT_IMAGES[index];
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || "N/A"}</TableCell>
                  <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"
                      }
                      color={product.stock > 0 ? "success" : "error"}
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add" ? "Add New Product" : "Edit Product"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={currentProduct?.name || ""}
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
                  value={currentProduct?.description || ""}
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
                  value={currentProduct?.price || ""}
                  onChange={handleInputChange}
                  InputProps={{ startAdornment: "$" }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={currentProduct?.stock || ""}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category_id"
                    value={currentProduct?.category_id || ""}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    {categories.map((category) => (
                      <MenuItem
                        key={category.id}
                        value={category.id.toString()}
                      >
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
                  <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
                    {filePreview.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 100,
                          height: 100,
                          m: 1,
                          borderRadius: 1,
                          overflow: "hidden",
                          position: "relative"
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                {dialogMode === "edit" &&
                  currentProduct?.images &&
                  currentProduct.images.length > 0 && (
                    <>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ mt: 2 }}
                      >
                        Current Images
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {currentProduct.images.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 100,
                              height: 100,
                              m: 1,
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={
                                currentProduct.image_url
                                  ? `${storageUrl}/${currentProduct.image_url}?t=${Date.now()}`
                                  : `/images/products/${image}`
                              }
                              alt={`Current ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                const imgIndex =
                                  Math.abs(
                                    currentProduct.id % PRODUCT_IMAGES.length
                                  ) || 0;
                                e.target.src = PRODUCT_IMAGES[imgIndex];
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Note: Uploading new images will replace the current
                        ones.
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
            {dialogMode === "add" ? "Add Product" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.name}
            "? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;
