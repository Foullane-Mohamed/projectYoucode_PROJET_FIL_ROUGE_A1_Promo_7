import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const couponValidationSchema = Yup.object({
  code: Yup.string()
    .required('Coupon code is required')
    .matches(/^[A-Z0-9_-]{3,15}$/, 'Code must be uppercase, 3-15 characters, only letters, numbers, _ and -'),
  type: Yup.string().required('Type is required').oneOf(['percentage', 'fixed'], 'Invalid type'),
  discount: Yup.number()
    .required('Discount amount is required')
    .when('type', {
      is: 'percentage',
      then: schema => schema.min(1, 'Minimum 1%').max(100, 'Maximum 100%'),
      otherwise: schema => schema.min(1, 'Minimum $1')
    }),
  min_purchase: Yup.number().nullable().min(0, 'Minimum purchase cannot be negative'),
  max_discount: Yup.number().nullable().min(0, 'Maximum discount cannot be negative'),
  starts_at: Yup.date().nullable(),
  expires_at: Yup.date().nullable()
    .when('starts_at', {
      is: val => val instanceof Date && !isNaN(val),
      then: schema => schema.min(Yup.ref('starts_at'), 'Expiry date cannot be before start date')
    }),
  max_uses: Yup.number().nullable().integer('Must be a whole number').min(1, 'At least 1 use required'),
  is_active: Yup.boolean(),
});

const generateCouponCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const CouponForm = ({ open, onClose, onSubmit, initialValues, isEdit }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues || {
      code: '',
      type: 'percentage',
      discount: '',
      min_purchase: '',
      max_discount: '',
      starts_at: null,
      expires_at: null,
      max_uses: '',
      is_active: true,
    },
    validationSchema: couponValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSubmit(values);
        onClose();
      } catch (error) {
        console.error('Error submitting coupon:', error);
      } finally {
        setLoading(false);
      }
    },
    enableReinitialize: true,
  });

  const handleGenerateCode = () => {
    formik.setFieldValue('code', generateCouponCode());
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEdit ? 'Edit Coupon' : 'Create New Coupon'}
        <IconButton edge="end" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coupon Code"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleGenerateCode} edge="end">
                        <RefreshIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <InputLabel>Discount Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Discount Type"
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
                {formik.touched.type && formik.errors.type && (
                  <FormHelperText>{formik.errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formik.values.type === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
                name="discount"
                type="number"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {formik.values.type === 'percentage' ? '%' : '$'}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Purchase"
                name="min_purchase"
                type="number"
                value={formik.values.min_purchase}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.min_purchase && Boolean(formik.errors.min_purchase)}
                helperText={formik.touched.min_purchase && formik.errors.min_purchase}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {formik.values.type === 'percentage' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Discount"
                  name="max_discount"
                  type="number"
                  value={formik.values.max_discount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.max_discount && Boolean(formik.errors.max_discount)}
                  helperText={formik.touched.max_discount && formik.errors.max_discount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Uses"
                name="max_uses"
                type="number"
                value={formik.values.max_uses}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.max_uses && Boolean(formik.errors.max_uses)}
                helperText={formik.touched.max_uses && formik.errors.max_uses}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formik.values.starts_at}
                onChange={(date) => formik.setFieldValue('starts_at', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.starts_at && Boolean(formik.errors.starts_at),
                    helperText: formik.touched.starts_at && formik.errors.starts_at,
                    onBlur: () => formik.setFieldTouched('starts_at', true),
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expiry Date"
                value={formik.values.expires_at}
                onChange={(date) => formik.setFieldValue('expires_at', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.expires_at && Boolean(formik.errors.expires_at),
                    helperText: formik.touched.expires_at && formik.errors.expires_at,
                    onBlur: () => formik.setFieldTouched('expires_at', true),
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.is_active}
                    onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                    name="is_active"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !formik.isValid}
          >
            {isEdit ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CouponForm;