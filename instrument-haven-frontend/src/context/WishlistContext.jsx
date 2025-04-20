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
      // Per API documentation, the wishlist is in response.data.data.wishlist
      const wishlistData = response.data?.data?.wishlist || [];
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Please log in to add to wishlist' };
    
    try {
      const response = await api.wishlist.add(productId);
      // Handle the case where product is already in wishlist (returns 200 with info status)
      if (response.data?.status === 'info' && response.data?.message === 'Product is already in wishlist') {
        return { success: true, message: 'Product is already in wishlist' };
      }
      
      await fetchWishlist();
      return { 
        success: true, 
        message: response.data?.message || 'Product added to wishlist' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error adding to wishlist' 
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Please log in to manage wishlist' };
    
    try {
      const response = await api.wishlist.remove(productId);
      await fetchWishlist();
      return { 
        success: true, 
        message: response.data?.message || 'Product removed from wishlist' 
      };
    } catch (error) {
      // Handle 404 case specifically per API documentation
      if (error.response?.status === 404) {
        return { 
          success: false, 
          message: 'Product not found in wishlist' 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error removing from wishlist' 
      };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => {
      // Handle both direct product_id and nested product.id structures
      return item.product_id === productId || (item.product && item.product.id === productId);
    });
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