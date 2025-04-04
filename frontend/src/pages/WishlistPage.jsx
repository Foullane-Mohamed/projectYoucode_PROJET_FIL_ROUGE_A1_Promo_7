import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { formatCurrency } from '../utils/formatCurrency';
import { getImageUrl } from '../utils/helpers';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addNotification } = useUI();
  
  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
    addNotification({
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart.`,
      variant: 'success'
    });
  };
  
  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.id);
    addNotification({
      title: 'Removed from Wishlist',
      message: `${product.name} has been removed from your wishlist.`,
      variant: 'info'
    });
  };
  
  const handleClearWishlist = () => {
    clearWishlist();
    addNotification({
      title: 'Wishlist Cleared',
      message: 'All items have been removed from your wishlist.',
      variant: 'info'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Wishlist', path: '/wishlist' },
        ]} 
        className="mb-8"
      />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any products to your wishlist yet.
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Wishlist Items ({wishlist.length})
              </h2>
              <button
                className="text-sm text-red-600 hover:text-red-800"
                onClick={handleClearWishlist}
              >
                Clear Wishlist
              </button>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {wishlist.map((product) => (
                <li key={product.id} className="px-6 py-4">
                  <div className="flex flex-col sm:flex-row">
                    <Link to={`/products/${product.id}`} className="sm:w-1/4 mb-4 sm:mb-0">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-32 object-cover object-center rounded-md"
                      />
                    </Link>
                    
                    <div className="sm:w-3/4 sm:ml-6">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="mt-2 text-lg font-semibold text-gray-900">
                        {formatCurrency(product.price)}
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                        >
                          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(product)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Link to="/products">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;