import { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../api/cart';
import { useAuth } from './AuthContext';

// Create context
const CartContext = createContext(null);

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const { isAuthenticated } = useAuth();

  // Initialize cart
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      // For non-authenticated users, try to load cart from localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    }
  }, [isAuthenticated]);

  // Fetch cart from API
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      if (response.status === 'success') {
        setCart(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated()) {
        // Add to server cart for authenticated users
        const response = await cartService.addToCart(productId, quantity);
        if (response.status === 'success') {
          fetchCart(); // Refresh cart
        }
        return response;
      } else {
        // Add to local cart for non-authenticated users
        const newCart = { ...cart };
        const existingItem = newCart.items.find(item => item.product_id === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          // Note: This is simplified, you would need product details
          newCart.items.push({ 
            product_id: productId, 
            quantity,
            // Ideally fetch product details here
          });
        }
        
        // Recalculate total (simplified)
        // In a real app, you'd need product prices
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add item to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated()) {
        // Update server cart for authenticated users
        const response = await cartService.updateCartItem(productId, quantity);
        if (response.status === 'success') {
          fetchCart(); // Refresh cart
        }
        return response;
      } else {
        // Update local cart for non-authenticated users
        const newCart = { ...cart };
        const itemIndex = newCart.items.findIndex(item => item.product_id === productId);
        
        if (itemIndex !== -1) {
          if (quantity <= 0) {
            // Remove item if quantity is zero or negative
            newCart.items.splice(itemIndex, 1);
          } else {
            // Update quantity
            newCart.items[itemIndex].quantity = quantity;
          }
          
          // Recalculate total (simplified)
          setCart(newCart);
          localStorage.setItem('cart', JSON.stringify(newCart));
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update cart item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated()) {
        // Remove from server cart for authenticated users
        const response = await cartService.removeFromCart(productId);
        if (response.status === 'success') {
          fetchCart(); // Refresh cart
        }
        return response;
      } else {
        // Remove from local cart for non-authenticated users
        const newCart = { ...cart };
        newCart.items = newCart.items.filter(item => item.product_id !== productId);
        
        // Recalculate total (simplified)
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove item from cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated()) {
        // Clear server cart for authenticated users
        const response = await cartService.clearCart();
        if (response.status === 'success') {
          setCart({ items: [], total: 0 });
        }
        return response;
      } else {
        // Clear local cart for non-authenticated users
        setCart({ items: [], total: 0 });
        localStorage.removeItem('cart');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to clear cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Apply coupon to cart
  const applyCoupon = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.validateCoupon(code);
      if (response.status === 'success') {
        setCoupon(response.data);
      }
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid coupon code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove coupon from cart
  const removeCoupon = () => {
    setCoupon(null);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        coupon,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        getCartItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;