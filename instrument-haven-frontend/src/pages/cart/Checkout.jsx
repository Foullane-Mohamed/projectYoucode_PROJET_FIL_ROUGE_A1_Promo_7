import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
} from '@mui/material';

const steps = ['Shipping Information', 'Payment Method', 'Review Order'];

const shippingValidationSchema = Yup.object({
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal code is required'),
  country: Yup.string().required('Country is required'),
  phone: Yup.string().required('Phone number is required'),
});

const paymentValidationSchema = Yup.object({
  paymentMethod: Yup.string().required('Payment method is required'),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit_card',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0 && !orderComplete) {
      navigate('/cart');
    }
    // Redirect if not logged in
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [cart, user, navigate, orderComplete]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingSubmit = (values) => {
    setShippingData(values);
    handleNext();
  };

  const handlePaymentSubmit = (values) => {
    setPaymentData(values);
    handleNext();
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: `${shippingData.address}, ${shippingData.city}, ${shippingData.state}, ${shippingData.postalCode}, ${shippingData.country}`,
        payment_method: paymentData.paymentMethod,
      };
      
      const response = await api.post('/orders', orderData);
      setOrderId(response.data.data.id);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper sx={{ p: 3 }}>
        {orderComplete ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography variant="body1" paragraph>
              Your order has been placed successfully. Your order number is #{orderId}.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We have emailed your order confirmation and will notify you when your order has been shipped.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Shipping Information
                </Typography>
                <Formik
                  initialValues={shippingData}
                  validationSchema={shippingValidationSchema}
                  onSubmit={handleShippingSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="address"
                            label="Address"
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="city"
                            label="City"
                            error={touched.city && Boolean(errors.city)}
                            helperText={touched.city && errors.city}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="state"
                            label="State/Province"
                            error={touched.state && Boolean(errors.state)}
                            helperText={touched.state && errors.state}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="postalCode"
                            label="Postal Code"
                            error={touched.postalCode && Boolean(errors.postalCode)}
                            helperText={touched.postalCode && errors.postalCode}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="country"
                            label="Country"
                            error={touched.country && Boolean(errors.country)}
                            helperText={touched.country && errors.country}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="phone"
                            label="Phone Number"
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                          type="button"
                          onClick={() => navigate('/cart')}
                          sx={{ mr: 1 }}
                        >
                          Back to Cart
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                        >
                          Continue
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            )}
            
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Method
                </Typography>
                <Formik
                  initialValues={paymentData}
                  validationSchema={paymentValidationSchema}
                  onSubmit={handlePaymentSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <FormControl component="fieldset" error={touched.paymentMethod && Boolean(errors.paymentMethod)}>
                        <FormLabel component="legend">Select Payment Method</FormLabel>
                        <Field as={RadioGroup} name="paymentMethod">
                          <FormControlLabel
                            value="credit_card"
                            control={<Radio />}
                            label="Credit Card"
                          />
                          <FormControlLabel
                            value="paypal"
                            control={<Radio />}
                            label="PayPal"
                          />
                          <FormControlLabel
                            value="bank_transfer"
                            control={<Radio />}
                            label="Bank Transfer"
                          />
                        </Field>
                        {touched.paymentMethod && errors.paymentMethod && (
                          <Typography variant="caption" color="error">
                            {errors.paymentMethod}
                          </Typography>
                        )}
                      </FormControl>
                      
                      <Alert severity="info" sx={{ mt: 3 }}>
                        This is a demo website. No real payment will be processed.
                      </Alert>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                          type="button"
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                        >
                          Continue
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            )}
            
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Shipping Information
                    </Typography>
                    <Typography variant="body2">
                      {`${shippingData.address}, ${shippingData.city}, ${shippingData.state}`}
                    </Typography>
                    <Typography variant="body2">
                      {`${shippingData.postalCode}, ${shippingData.country}`}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {shippingData.phone}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Payment Method
                    </Typography>
                    <Typography variant="body2">
                      {paymentData.paymentMethod === 'credit_card' && 'Credit Card'}
                      {paymentData.paymentMethod === 'paypal' && 'PayPal'}
                      {paymentData.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Items
                </Typography>
                
                {cart.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          flexShrink: 0,
                          borderRadius: 1,
                          overflow: 'hidden',
                          mr: 2,
                        }}
                      >
                        <img
                          src={
                            item.image
                              ? `${process.env.REACT_APP_API_URL}/storage/${item.image}`
                              : '/placeholder.png'
                          }
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Shipping:</Typography>
                    <Typography variant="body1">Free</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">${totalPrice.toFixed(2)}</Typography>
                  </Box>
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Place Order'}
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout;