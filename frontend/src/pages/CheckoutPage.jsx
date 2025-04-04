import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/orders';
import Breadcrumb from '../components/common/Breadcrumb';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { formatCurrency } from '../utils/formatCurrency';

const CheckoutPage = () => {
  const { cart, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  
  // Form state
  const [formValues, setFormValues] = useState({
    shipping_address: user?.address || '',
    billing_address: user?.address || '',
    same_as_shipping: true,
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await orderService.getActivePaymentMethods();
        if (response.status === 'success') {
          setPaymentMethods(response.data);
          if (response.data.length > 0) {
            setSelectedPaymentMethod(response.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('Failed to load payment methods. Please try again later.');
      }
    };
    
    fetchPaymentMethods();
  }, []);
  
  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (!cart || cart.items?.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart, navigate]);
  
  // Calculate totals
  const subtotal = cart?.items?.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;
  
  const discount = coupon ? (coupon.type === 'percentage' 
    ? (subtotal * coupon.discount / 100) 
    : coupon.discount) : 0;
  
  const total = Math.max(0, subtotal - discount);
  
  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormValues({
        ...formValues,
        [name]: checked
      });
      
      // If checked, copy shipping address to billing address
      if (name === 'same_as_shipping' && checked) {
        setFormValues(prev => ({
          ...prev,
          billing_address: prev.shipping_address,
          [name]: checked
        }));
      }
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
      
      // If shipping address changes and same_as_shipping is checked, update billing address
      if (name === 'shipping_address' && formValues.same_as_shipping) {
        setFormValues(prev => ({
          ...prev,
          billing_address: value,
          [name]: value
        }));
      }
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(Number(e.target.value));
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.shipping_address.trim()) {
      errors.shipping_address = 'Shipping address is required';
    }
    
    if (!formValues.billing_address.trim()) {
      errors.billing_address = 'Billing address is required';
    }
    
    if (!selectedPaymentMethod) {
      errors.payment_method = 'Please select a payment method';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const orderData = {
        payment_method_id: selectedPaymentMethod,
        shipping_address: formValues.shipping_address,
        billing_address: formValues.billing_address,
        coupon_code: coupon?.code
      };
      
      const response = await orderService.createOrder(orderData);
      
      if (response.status === 'success') {
        // Clear cart and redirect to success page
        clearCart();
        navigate(`/order-success/${response.data.id}`);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Cart', path: '/cart' },
          { label: 'Checkout', path: '/checkout' },
        ]} 
        className="mb-8"
      />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {error && (
        <Alert variant="error" message={error} className="mb-6" />
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout form */}
        <div className="lg:w-2/3">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <Input
                  id="name"
                  label="Full Name"
                  name="name"
                  value={user?.name || ''}
                  disabled
                  helperText="This information is from your profile"
                />
              </div>
              
              <div className="mb-4">
                <Input
                  id="email"
                  label="Email Address"
                  name="email"
                  value={user?.email || ''}
                  disabled
                  helperText="We'll send the order confirmation to this email"
                />
              </div>
              
              <div className="mb-4">
                <Input
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={user?.phone || ''}
                  disabled
                  helperText="We'll contact you on this number for delivery"
                />
              </div>
              
              <div>
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  rows="3"
                  className={`block w-full px-4 py-2 mt-1 text-gray-900 bg-white border ${
                    formErrors.shipping_address ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                  value={formValues.shipping_address}
                  onChange={handleInputChange}
                  required
                ></textarea>
                {formErrors.shipping_address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.shipping_address}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Billing Information */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Billing Information</h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="same_as_shipping"
                    checked={formValues.same_as_shipping}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Same as shipping address
                  </span>
                </label>
              </div>
              
              {!formValues.same_as_shipping && (
                <div>
                  <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="billing_address"
                    name="billing_address"
                    rows="3"
                    className={`block w-full px-4 py-2 mt-1 text-gray-900 bg-white border ${
                      formErrors.billing_address ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    value={formValues.billing_address}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                  {formErrors.billing_address && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.billing_address}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            </div>
            
            <div className="px-6 py-4">
              {paymentMethods.length === 0 ? (
                <p className="text-gray-500">No payment methods available</p>
              ) : (
                <div>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={handlePaymentMethodChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {method.name}
                        </span>
                      </label>
                      {method.description && (
                        <p className="mt-1 ml-6 text-xs text-gray-500">{method.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {formErrors.payment_method && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.payment_method}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm sticky top-20">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            
            <div className="px-6 py-4">
              {/* Order items */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Items ({cart?.items?.length || 0})
                </h3>
                
                <ul className="divide-y divide-gray-200">
                  {cart?.items?.map((item) => (
                    <li key={item.product_id} className="py-3 flex justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">
                          {item.quantity} x {item.product?.name || 'Product'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency((item.product?.price || 0) * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price details */}
              <div className="mb-6">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {coupon && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">
                      Discount ({coupon.type === 'percentage' ? `${coupon.discount}%` : 'Fixed'})
                    </span>
                    <span className="text-green-600 font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(total)}</span>
                </div>
              </div>
              
              {/* Place order button */}
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading || !selectedPaymentMethod || cart?.items?.length === 0}
              >
                {loading ? <Spinner size="sm" color="white" /> : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;