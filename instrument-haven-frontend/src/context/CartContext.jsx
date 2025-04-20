import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], subtotal: 0, discount: 0, coupon: null, total: 0 });
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart items when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // If user is not logged in, use local storage cart
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);
          calculateTotals(parsedCart);
        } catch (error) {
          console.error('Error parsing stored cart data:', error);
          localStorage.removeItem('cart');
          setCart({ items: [], subtotal: 0, discount: 0, coupon: null, total: 0 });
        }
      }
    }
  }, [user]);

  // Save cart to localStorage if user is not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    // Calculate total items for cart badge
    let items = 0;
    cart.items.forEach(item => {
      items += item.quantity;
    });
    setTotalItems(items);
  }, [cart, user]);

  // Calculate cart totals
  const calculateTotals = (cartData) => {
    const items = cartData.items || [];
    let count = 0;
    items.forEach(item => {
      count += item.quantity;
    });
    setTotalItems(count);
  };

  // Fetch cart from API
  const fetchCart = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.cart.getItems();
      const cartData = response.data?.data?.cart || response.data?.cart || { items: [], subtotal: 0, discount: 0, coupon: null, total: 0 };
      setCart(cartData);
      calculateTotals(cartData);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart items');
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        // If user is logged in, use API
        const response = await api.cart.addItem(product.id, quantity);
        const cartData = response.data?.data?.cart || response.data?.cart;
        setCart(cartData);
        calculateTotals(cartData);
        toast.success('Product added to cart');
      } else {
        // If user is not logged in, handle cart locally
        setCart(prevCart => {
          const prevItems = prevCart.items || [];
          const existingItemIndex = prevItems.findIndex(item => item.product_id === product.id);
          
          let newItems;
          if (existingItemIndex >= 0) {
            // Update existing item
            newItems = [...prevItems];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity
            };
          } else {
            // Add new item
            newItems = [...prevItems, { 
              id: Date.now(), // Temporary ID for local cart
              product_id: product.id, 
              product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                thumbnail: product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : null),
                price: product.price,
                sale_price: product.sale_price,
                on_sale: product.on_sale || false
              },
              quantity,
              price: product.sale_price || product.price,
              total: (product.sale_price || product.price) * quantity
            }];
          }
          
          // Calculate subtotal
          const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
          
          toast.success('Product added to cart');
          return {
            ...prevCart,
            items: newItems,
            subtotal,
            total: subtotal - (prevCart.discount || 0)
          };
        });
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart');
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        // If user is logged in, use API
        const response = await api.cart.removeItem(itemId);
        const cartData = response.data?.data?.cart || response.data?.cart;
        setCart(cartData);
        calculateTotals(cartData);
        toast.success('Item removed from cart');
      } else {
        // If user is not logged in, handle cart locally
        setCart(prevCart => {
          const newItems = (prevCart.items || []).filter(item => item.id !== itemId);
          const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
          
          toast.success('Item removed from cart');
          return {
            ...prevCart,
            items: newItems,
            subtotal,
            total: subtotal - (prevCart.discount || 0)
          };
        });
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart');
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        // If user is logged in, use API
        const response = await api.cart.updateItem(itemId, quantity);
        const cartData = response.data?.data?.cart || response.data?.cart;
        setCart(cartData);
        calculateTotals(cartData);
        toast.success('Cart updated');
      } else {
        // If user is not logged in, handle cart locally
        setCart(prevCart => {
          const newItems = (prevCart.items || []).map(item => {
            if (item.id === itemId) {
              const newTotal = item.price * quantity;
              return { ...item, quantity, total: newTotal };
            }
            return item;
          });
          
          const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
          
          return {
            ...prevCart,
            items: newItems,
            subtotal,
            total: subtotal - (prevCart.discount || 0)
          };
        });
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      setError('Failed to update cart');
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  // Apply coupon
  const applyCoupon = async (code) => {
    if (!user) {
      toast.error('Please log in to apply coupon');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.cart.applyCoupon(code);
      const cartData = response.data?.data?.cart || response.data?.cart;
      setCart(cartData);
      calculateTotals(cartData);
      toast.success('Coupon applied successfully');
      return true;
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError(err.response?.data?.message || 'Failed to apply coupon');
      toast.error(err.response?.data?.message || 'Failed to apply coupon');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove coupon
  const removeCoupon = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.cart.removeCoupon();
      const cartData = response.data?.data?.cart || response.data?.cart;
      setCart(cartData);
      calculateTotals(cartData);
      toast.success('Coupon removed');
    } catch (err) {
      console.error('Error removing coupon:', err);
      setError('Failed to remove coupon');
      toast.error('Failed to remove coupon');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart({ items: [], subtotal: 0, discount: 0, coupon: null, total: 0 });
    localStorage.removeItem('cart');
  };

  // Sync local cart with server when user logs in
  const syncCartWithServer = async () => {
    if (!user) return;
    
    const localCart = JSON.parse(localStorage.getItem('cart') || '{ "items": [] }');
    if (localCart.items && localCart.items.length > 0) {
      setLoading(true);
      try {
        // Add each local cart item to server
        for (const item of localCart.items) {
          if (item.product && item.product_id) {
            await api.cart.addItem(item.product_id, item.quantity);
          }
        }
        // Clear local cart
        localStorage.removeItem('cart');
        // Fetch updated cart from server
        await fetchCart();
        toast.success('Cart synced with your account');
      } catch (err) {
        console.error('Error syncing cart with server:', err);
        toast.error('Failed to sync cart with your account');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        syncCartWithServer,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};