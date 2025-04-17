// src/pages/admin/CouponManagement.jsx
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
  FormControlLabel,
  Switch,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
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

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch coupons. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setCurrentCoupon({
      code: '',
      discount: '',
      type: 'percentage',
      starts_at: null,
      expires_at: null,
      is_active: true,
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (coupon) => {
    setDialogMode('edit');
    setCurrentCoupon({ 
      ...coupon,
      starts_at: coupon.starts_at ? new Date(coupon.starts_at) : null,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at) : null,
    });
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (coupon) => {
    setCouponToDelete(coupon);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCouponToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrentCoupon({
      ...currentCoupon,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (name, date) => {
    setCurrentCoupon({
      ...currentCoupon,
      [name]: date
    });
  };

  const handleSaveCoupon = async () => {
    try {
      // Format dates for API
      const formattedCoupon = {
        ...currentCoupon,
        starts_at: currentCoupon.starts_at ? currentCoupon.starts_at.toISOString() : null,
        expires_at: currentCoupon.expires_at ? currentCoupon.expires_at.toISOString() : null,
      };

      let response;
      if (dialogMode === 'add') {
        response = await api.post('/coupons', formattedCoupon);
        setSnackbar({
          open: true,
          message: 'Coupon created successfully!',
          severity: 'success'
        });
      } else {
        response = await api.put(`/coupons/${currentCoupon.id}`, formattedCoupon);
        setSnackbar({
          open: true,
          message: 'Coupon updated successfully!',
          severity: 'success'
        });
      }
      
      // Refresh the coupon list
      fetchCoupons();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving coupon:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode === 'add' ? 'create' : 'update'} coupon. Please try again.`,
        severity: 'error'
      });
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      await api.delete(`/coupons/${couponToDelete.id}`);
      
      // Filter out the deleted coupon from the current list
      setCoupons(coupons.filter(coupon => coupon.id !== couponToDelete.id));
      
      setSnackbar({
        open: true,
        message: 'Coupon deleted successfully!',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete coupon. Please try again.',
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
          Coupon Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Coupon
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.id}</TableCell>
                <TableCell>
                  <Chip label={coupon.code} variant="outlined" />
                </TableCell>
                <TableCell>{coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}</TableCell>
                <TableCell>
                  {coupon.type === 'percentage'
                    ? `${coupon.discount}%`
                    : `$${coupon.discount.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {coupon.starts_at
                    ? new Date(coupon.starts_at).toLocaleDateString()
                    : 'Always'}
                </TableCell>
                <TableCell>
                  {coupon.expires_at
                    ? new Date(coupon.expires_at).toLocaleDateString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={coupon.is_active ? 'Active' : 'Inactive'}
                    color={coupon.is_active ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEditDialog(coupon)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleOpenDeleteDialog(coupon)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Coupon Form Dialog */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'add' ? 'Add New Coupon' : 'Edit Coupon'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Coupon Code"
                    name="code"
                    value={currentCoupon?.code || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      name="type"
                      value={currentCoupon?.type || 'percentage'}
                      onChange={handleInputChange}
                      label="Discount Type"
                    >
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                      <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Discount ${currentCoupon?.type === 'percentage' ? '(%)' : '($)'}`}
                    name="discount"
                    type="number"
                    value={currentCoupon?.discount || ''}
                    onChange={handleInputChange}
                    required
                    inputProps={{
                      min: 0,
                      ...(currentCoupon?.type === 'percentage' ? { max: 100 } : {}),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentCoupon?.is_active || false}
                        onChange={handleInputChange}
                        name="is_active"
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Valid From (Optional)"
                    value={currentCoupon?.starts_at}
                    onChange={(date) => handleDateChange('starts_at', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Valid Until (Optional)"
                    value={currentCoupon?.expires_at}
                    onChange={(date) => handleDateChange('expires_at', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveCoupon} variant="contained">
              {dialogMode === 'add' ? 'Add Coupon' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the coupon "{couponToDelete?.code}"? This may affect orders that use this coupon.
          </Typography>
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