import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { formatCurrency } from '../utils/formatCurrency';
import { getImageUrl } from '../utils/helpers';

const CartPage = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon, coupon } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();
  
  // Calculate subtotal, discount, and total
  const subtotal = cart?.items?.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;
  
  const discount = coupon ? (coupon.type === 'percentage' 
    ? (subtotal * coupon.discount / 100) 
    : coupon.discount) : 0;
  
  const total = Math.max(0, subtotal - discount);
  
  const handleCheckout = () => {
    if (isAuthenticated()) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };
  
  const handleQuantityChange = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
    } catch (err) {
      console.error('Error updating cart item:', err);
    }
  };
  
  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      console.error('Error removing cart item:', err);
    }
  };
  
  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };
  
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setCouponLoading(true);
    setCouponError(null);
    
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };
  
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponError(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Cart', path: '/cart' },
        ]} 
        className="mb-8"
      />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error" message={error} />
      ) : cart?.items?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items ({cart?.items?.length || 0})</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {cart?.items?.map((item) => (
                  <li key={item.product_id} className="px-6 py-4 flex items-center">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={getImageUrl(item.product?.image)}
                        alt={item.product?.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            <Link to={`/products/${item.product_id}`} className="hover:text-indigo-600">
                              {item.product?.name || 'Product'}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Price: {formatCurrency(item.product?.price || 0)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-base font-medium text-gray-900">
                            {formatCurrency((item.product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="p-1 text-gray-400 hover:text-gray-700"
                            onClick={() => handleQuantityChange(item.product_id, Math.max(1, item.quantity - 1))}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          <span className="mx-2 text-gray-700">{item.quantity}</span>
                          
                          <button
                            type="button"
                            className="p-1 text-gray-400 hover:text-gray-700"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product?.stock || 0)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveItem(item.product_id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {coupon && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">
                      Discount ({coupon.type === 'percentage' ? `${coupon.discount}%` : 'Fixed'})
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800 text-xs"
                        onClick={handleRemoveCoupon}
                      >
                        Remove
                      </button>
                    </span>
                    <span className="text-green-600 font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(total)}</span>
                </div>
                
                {/* Coupon form */}
                <div className="mt-4">
                  <form onSubmit={handleApplyCoupon}>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponLoading || !!coupon}
                      />
                      <button
                        type="submit"
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors duration-200"
                        disabled={couponLoading || !!coupon}
                      >
                        {couponLoading ? <Spinner size="sm" color="secondary" /> : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-1 text-sm text-red-600">{couponError}</p>
                    )}
                  </form>
                </div>
                
                {/* Checkout button */}
                <div className="mt-6">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleCheckout}
                    disabled={cart?.items?.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="mt-4 text-center">
                    <Link to="/products" className="text-sm text-indigo-600 hover:text-indigo-800">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;