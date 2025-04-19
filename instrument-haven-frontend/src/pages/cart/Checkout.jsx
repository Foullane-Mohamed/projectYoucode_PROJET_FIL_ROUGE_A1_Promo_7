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

const steps = ['Shipping Information', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart, totalPrice, totalItems, clearCart } = useContext(CartContext);
  
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
    method: 'credit_card',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
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
  
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Format shipping address
      const shippingAddress = `${shippingData.firstName} ${shippingData.lastName}
${shippingData.address}
${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}
${shippingData.country}
${shippingData.phone}`;
      
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        payment_method: paymentData.method,
        coupon_code: couponData?.code || null
      };
      
      // Add payment details if using credit card
      if (paymentData.method === 'credit_card' && paymentData.card_number) {
        orderData.payment_details = {
          card_number: paymentData.card_number,
          card_name: paymentData.card_name,
          card_expiry: paymentData.card_expiry,
          card_cvc: paymentData.card_cvc
        };
      }
      
      const response = await api.orders.create(orderData);
      
      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-success', { state: { order: response.data.data } });
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      // Scroll to the top to show the error
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };
  
  if (cart.length === 0) {
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
          {error}
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
                subtotal={totalPrice}
                discount={discountAmount}
                total={finalPrice}
                couponCode={couponCode}
                couponData={couponData}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onCouponCodeChange={(e) => setCouponCode(e.target.value)}
                onBack={handleBack}
                onPlaceOrder={handlePlaceOrder}
                loading={loading}
              />
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout;