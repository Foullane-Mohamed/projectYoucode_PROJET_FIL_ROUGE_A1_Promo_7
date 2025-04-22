import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';

// Step components
import ShippingForm from './ShippingForm';
import PaymentMethod from './PaymentMethod';
import OrderReview from './OrderReview';
import OrderConfirmation from './confirmations/OrderConfirmation';

const steps = ['Shipping Information', 'Payment Method', 'Review Order', 'Confirm Order'];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart, totalItems, clearCart } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  
  const [paymentData, setPaymentData] = useState({
    method: 'cash_on_delivery',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderData, setOrderData] = useState(null);
  
  // Calculate total price from cart items
  useEffect(() => {
    if (cart && cart.items) {
      const total = cart.items.reduce((sum, item) => {
        const itemPrice = item.price || (item.product ? item.product.price : 0);
        return sum + (itemPrice * item.quantity);
      }, 0);
      setTotalPrice(total);
    }
  }, [cart]);
  
  useEffect(() => {
    // Redirect if cart is empty
    if (cart.items.length === 0) {
      navigate('/cart');
    }
    
    // Redirect if not logged in
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [cart, user, navigate]);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleShippingSubmit = (data) => {
    setShippingData(data);
    handleNext();
  };
  
  const handlePaymentSubmit = (data) => {
    setPaymentData(data);
    handleNext();
  };
  
  const handleApplyCoupon = async (code) => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.cart.applyCoupon({ code });
      setCouponData(response.data.data);
      
      // Calculate discount
      let discount = 0;
      if (response.data.data.type === 'percentage') {
        discount = (totalPrice * response.data.data.discount) / 100;
      } else {
        discount = response.data.data.discount;
      }
      
      setDiscountAmount(discount);
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError(err.response?.data?.message || 'Invalid coupon code.');
      setCouponData(null);
      setDiscountAmount(0);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveCoupon = async () => {
    setLoading(true);
    
    try {
      await api.cart.removeCoupon();
      setCouponData(null);
      setCouponCode('');
      setDiscountAmount(0);
    } catch (err) {
      console.error('Error removing coupon:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const prepareOrderData = () => {
    // Format addresses according to backend requirements
    const fullName = `${shippingData.firstName} ${shippingData.lastName}`;
    
    // Prepare shipping address in the format backend expects
    const shippingAddressData = {
      name: fullName,
      address: shippingData.address,
      city: shippingData.city,
      state: shippingData.state,
      zip_code: shippingData.zipCode,
      country: shippingData.country,
      phone: shippingData.phone
    };
    
    // For this implementation, use same address for billing
    const billingAddressData = { ...shippingAddressData };
    
    // Prepare order data matching backend validation requirements
    return {
      items: cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      shipping_address: shippingAddressData,
      billing_address: billingAddressData,
      payment_method: paymentData.method,
      payment_id: 'COD-' + Date.now(), // Generate a payment ID for cash on delivery
      coupon_code: couponData?.code || null
    };
  };

  const handleShowOrderConfirmation = () => {
    const data = prepareOrderData();
    setOrderData(data);
    setActiveStep(3); // Move to confirmation step
  };

  // No longer needed as we use the stepper navigation
  
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.orders.create(orderData);
      
      // Clear cart
      clearCart();
      
      // Don't navigate - the OrderConfirmation component will handle redirect
      return true; // Return success status
    } catch (err) {
      console.error('Error placing order:', err);
      const errorMessage = err.response?.data?.message || 'Failed to place order. Please try again.';
      
      // Show specific validation errors if available
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        setError(validationErrors.join(', '));
      } else {
        setError(errorMessage);
      }
      
      // Scroll to the top to show the error
      window.scrollTo(0, 0);
      return false; // Return failure status
    } finally {
      setLoading(false);
      // No need to close dialog as we're using a page now
    }
  };
  
  if (cart.items.length === 0) {
    return null; // Will redirect in useEffect
  }
  
  // Calculate final price
  const finalPrice = Math.max(totalPrice - discountAmount, 0);
  
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
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Validation error</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        {loading && activeStep === steps.length - 1 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeStep === 0 && (
              <ShippingForm
                initialValues={shippingData}
                onSubmit={handleShippingSubmit}
                onCancel={() => navigate('/cart')}
              />
            )}
            
            {activeStep === 1 && (
              <PaymentMethod
                selectedMethod={paymentData.method}
                setSelectedMethod={(method) => setPaymentData({ ...paymentData, method })}
                onNext={handlePaymentSubmit}
                onBack={handleBack}
              />
            )}
            
            {activeStep === 2 && (
              <OrderReview
                cart={cart}
                shippingData={shippingData}
                paymentData={paymentData}
                totalItems={totalItems}
                subtotal={totalPrice || 0}
                discount={discountAmount}
                total={finalPrice || 0}
                couponCode={couponCode}
                couponData={couponData}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onCouponCodeChange={(e) => setCouponCode(e.target.value)}
                onBack={handleBack}
                onPlaceOrder={handleShowOrderConfirmation}
                loading={loading}
              />
            )}
            
            {activeStep === 3 && orderData && (
              <OrderConfirmation
                orderData={orderData}
                cart={cart}
                shippingData={shippingData}
                paymentData={paymentData}
                totalPrice={totalPrice || 0}
                discountAmount={discountAmount}
                finalPrice={finalPrice || 0}
                onBack={handleBack}
                onConfirm={handlePlaceOrder}
                loading={loading}
              />
            )}
          </>
        )}
      </Paper>

      {/* No dialog needed as we're using a full page for confirmation */}
    </Container>
  );
};

export default Checkout;