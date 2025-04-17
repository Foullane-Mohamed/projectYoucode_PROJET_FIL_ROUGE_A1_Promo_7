import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.wishlist.getAll();
      setWishlist(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Please log in to add to wishlist' };
    
    try {
      await api.wishlist.add(productId);
      await fetchWishlist();
      return { success: true, message: 'Product added to wishlist' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error adding to wishlist' 
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return { success: false };
    
    try {
      await api.wishlist.remove(productId);
      await fetchWishlist();
      return { success: true, message: 'Product removed from wishlist' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error removing from wishlist' 
      };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};