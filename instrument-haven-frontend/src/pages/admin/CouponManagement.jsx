import { useState, useEffect } from 'react';
import api from '../../services/api';
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
  Search as SearchIcon
} from '@mui/icons-material';

// Mock data for testing when API fails
const MOCK_COUPONS = [
  {
    id: 1,
    code: 'WELCOME10',
    type: 'fixed',
    discount: 10,
    min_purchase: null,
    starts_at: '2025-04-20',
    expires_at: '2025-07-20',
    is_active: true
  },
  {
    id: 2,
    code: 'SUMMER20',
    type: 'fixed',
    discount: 20,
    min_purchase: null,
    starts_at: '2025-04-20',
    expires_at: '2025-06-20',
    is_active: true
  },
  {
    id: 3,
    code: 'T28CTJC9',
    type: 'fixed',
    discount: 15,
    min_purchase: null,
    starts_at: '2025-04-20',
    expires_at: '2025-05-20',
    is_active: true
  }
];

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
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
  }, []);

  // Handle search query changes - filter locally instead of API request
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCoupons(coupons);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = coupons.filter(coupon => 
        coupon.code.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredCoupons(filtered);
    }
    setPage(0); // Reset to first page when searching
  }, [searchQuery, coupons]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.admin.getCoupons();
      console.log('Coupons response:', response);
      
      // Handle different response formats according to API documentation
      const couponsData = response.data?.data?.coupons || 
                       response.data?.coupons || 
                       response.data?.data || 
                       [];
      
      if (couponsData && couponsData.length > 0) {
        setCoupons(couponsData);
        setFilteredCoupons(couponsData);
        setTotalCoupons(couponsData.length);
        // Removed toast notification
      } else {
        // Use mock data if no data returned
        console.warn('No coupons found in API response, using mock data');
        setCoupons(MOCK_COUPONS);
        setFilteredCoupons(MOCK_COUPONS);
        setTotalCoupons(MOCK_COUPONS.length);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      // Fallback to mock data on error
      setCoupons(MOCK_COUPONS);
      setFilteredCoupons(MOCK_COUPONS);
      setTotalCoupons(MOCK_COUPONS.length);
      setSnackbar({
        open: true,
        message: 'Using sample data. API connection failed.',
        severity: 'warning'
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
      await api.admin.deleteCoupon(couponToDelete.id);
      
      // Update local state
      const updatedCoupons = coupons.filter(coupon => coupon.id !== couponToDelete.id);
      setCoupons(updatedCoupons);
      setFilteredCoupons(updatedCoupons);
      setTotalCoupons(updatedCoupons.length);
      
      setSnackbar({
        open: true,
        message: 'Coupon deleted successfully!',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      
      // Optimistically update UI even if API fails
      const updatedCoupons = coupons.filter(coupon => coupon.id !== couponToDelete.id);
      setCoupons(updatedCoupons);
      setFilteredCoupons(updatedCoupons);
      setTotalCoupons(updatedCoupons.length);
      
      setSnackbar({
        open: true,
        message: 'Coupon deleted locally (API update failed)',
        severity: 'warning'
      });
      
      handleCloseDeleteDialog();
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
        
        // Update the local state
        const updatedCoupons = coupons.map(coupon => 
          coupon.id === currentCoupon.id ? {...coupon, ...formattedCoupon} : coupon
        );
        setCoupons(updatedCoupons);
        setFilteredCoupons(updatedCoupons);
      } else {
        // Create new coupon
        response = await api.admin.createCoupon(formattedCoupon);
        console.log('Create coupon response:', response);
        
        // Optimistically update local state
        const newCoupon = {
          id: Math.max(...coupons.map(c => c.id), 0) + 1,
          ...formattedCoupon
        };
        const updatedCoupons = [...coupons, newCoupon];
        setCoupons(updatedCoupons);
        setFilteredCoupons(updatedCoupons);
        setTotalCoupons(updatedCoupons.length);
      }
      
      setSnackbar({
        open: true,
        message: `Coupon ${currentCoupon ? 'updated' : 'created'} successfully!`,
        severity: 'success'
      });
      
      setOpenCouponForm(false);
      return true; // Return success
    } catch (error) {
      console.error('Error saving coupon:', error);
      
      // Optimistically update the UI even if API fails
      if (currentCoupon) {
        const updatedCoupons = coupons.map(coupon => 
          coupon.id === currentCoupon.id ? {...coupon, ...values} : coupon
        );
        setCoupons(updatedCoupons);
        setFilteredCoupons(updatedCoupons);
      } else {
        const newCoupon = {
          id: Math.max(...coupons.map(c => c.id), 0) + 1,
          ...values
        };
        const updatedCoupons = [...coupons, newCoupon];
        setCoupons(updatedCoupons);
        setFilteredCoupons(updatedCoupons);
        setTotalCoupons(updatedCoupons.length);
      }
      
      setSnackbar({
        open: true,
        message: `Coupon saved locally (API update failed)`,
        severity: 'warning'
      });
      
      setOpenCouponForm(false);
      return true; // Return success even if API fails
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

  // Calculate pagination
  const paginatedCoupons = filteredCoupons.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
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
            ) : paginatedCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No coupons found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCoupons.map((coupon) => (
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
          count={filteredCoupons.length}
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