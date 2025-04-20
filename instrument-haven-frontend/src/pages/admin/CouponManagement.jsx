import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import CouponForm from './components/CouponForm';
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
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [openCouponForm, setOpenCouponForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [couponToDelete, setCouponToDelete] = useState(null);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCoupons();
  }, [page, rowsPerPage, searchQuery]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        per_page: rowsPerPage,
        search: searchQuery || undefined
      };
      
      const response = await api.admin.getCoupons(params);
      console.log('Coupons response:', response);
      
      // Handle different response formats according to API documentation
      const couponsData = response.data?.data?.coupons || 
                       response.data?.coupons || 
                       response.data?.data || 
                       [];
      
      // Get total count for pagination
      const totalCount = response.data?.meta?.total ||
                      response.data?.pagination?.total ||
                      couponsData.length;
      
      setCoupons(couponsData);
      setTotalCoupons(totalCount);
      toast.success('Coupons loaded successfully');
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons: ' + (error.response?.data?.message || 'Unknown error'));
      setSnackbar({
        open: true,
        message: 'Failed to fetch coupons. Please try again.',
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleCreateCoupon = () => {
    setCurrentCoupon(null);
    setOpenCouponForm(true);
  };

  const handleEditCoupon = (coupon) => {
    // Format dates for the form
    const formattedCoupon = {
      ...coupon,
      starts_at: coupon.starts_at ? new Date(coupon.starts_at) : null,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at) : null,
    };
    
    setCurrentCoupon(formattedCoupon);
    setOpenCouponForm(true);
  };

  const handleOpenDeleteDialog = (coupon) => {
    setCouponToDelete(coupon);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCouponToDelete(null);
  };

  const handleDeleteCoupon = async () => {
    try {
      const response = await api.admin.deleteCoupon(couponToDelete.id);
      console.log('Delete coupon response:', response);
      
      toast.success('Coupon deleted successfully!');
      setSnackbar({
        open: true,
        message: 'Coupon deleted successfully!',
        severity: 'success'
      });
      
      fetchCoupons();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon: ' + (error.response?.data?.message || 'Unknown error'));
      setSnackbar({
        open: true,
        message: 'Failed to delete coupon. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSubmitCoupon = async (values) => {
    try {
      // Format dates for API
      const formattedCoupon = {
        ...values,
        // Format dates as YYYY-MM-DD for backend compatibility
        starts_at: values.starts_at ? values.starts_at.toISOString().split('T')[0] : null,
        expires_at: values.expires_at ? values.expires_at.toISOString().split('T')[0] : null,
      };

      let response;
      if (currentCoupon) {
        // Update existing coupon
        response = await api.admin.updateCoupon(currentCoupon.id, formattedCoupon);
        console.log('Update coupon response:', response);
        toast.success('Coupon updated successfully!');
        setSnackbar({
          open: true,
          message: 'Coupon updated successfully!',
          severity: 'success'
        });
      } else {
        // Create new coupon
        response = await api.admin.createCoupon(formattedCoupon);
        console.log('Create coupon response:', response);
        toast.success('Coupon created successfully!');
        setSnackbar({
          open: true,
          message: 'Coupon created successfully!',
          severity: 'success'
        });
      }
      
      // Refresh the coupon list
      fetchCoupons();
      return true; // Return success
    } catch (error) {
      console.error('Error saving coupon:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || `Failed to ${currentCoupon ? 'update' : 'create'} coupon`);
      }
      
      setSnackbar({
        open: true,
        message: `Failed to ${currentCoupon ? 'update' : 'create'} coupon. Please try again.`,
        severity: 'error'
      });
      return false; // Return failure
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Coupon Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCoupon}
        >
          Add Coupon
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search coupons..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: 300, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ ml: 'auto' }}
          >
            Filter
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Min. Purchase</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No coupons found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <Chip label={coupon.code} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </TableCell>
                  <TableCell>
                    {coupon.type === 'percentage'
                      ? `${coupon.discount}%`
                      : `$${parseFloat(coupon.discount).toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {coupon.min_purchase
                      ? `$${parseFloat(coupon.min_purchase).toFixed(2)}`
                      : 'None'}
                  </TableCell>
                  <TableCell>{formatDate(coupon.starts_at)}</TableCell>
                  <TableCell>{formatDate(coupon.expires_at)}</TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.is_active ? 'Active' : 'Inactive'}
                      color={coupon.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditCoupon(coupon)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(coupon)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCoupons}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Coupon Form Dialog */}
      <CouponForm
        open={openCouponForm}
        onClose={() => setOpenCouponForm(false)}
        onSubmit={handleSubmitCoupon}
        initialValues={currentCoupon}
        isEdit={Boolean(currentCoupon)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the coupon "{couponToDelete?.code}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCoupon} color="error">
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

export default CouponManagement;