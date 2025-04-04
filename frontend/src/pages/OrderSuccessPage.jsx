import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderService } from '../api/orders';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/helpers';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (id) {
          const response = await orderService.getOrderById(id);
          
          if (response.status === 'success') {
            setOrder(response.data);
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please check your order history.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" message={error} />
        <div className="mt-6 text-center">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your order has been placed successfully.
          </p>
          
          {order && (
            <div className="mb-8 text-left">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Order Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Order Number:</span> #{order.id}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Date:</span> {formatDate(order.created_at)}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Status:</span>{' '}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Payment Method:</span> {order.payment_method?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Total:</span> {formatCurrency(order.total || 0)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Shipping Information</h2>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
                </div>
                
                {order.products && order.products.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Order Items</h2>
                    <ul className="divide-y divide-gray-200">
                      {order.products.map((product) => (
                        <li key={product.id} className="py-3 flex justify-between">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">
                              {product.pivot.quantity} x {product.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(product.pivot.price * product.pivot.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/products">
              <Button variant="outline" fullWidth>
                Continue Shopping
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="primary" fullWidth>
                View My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;