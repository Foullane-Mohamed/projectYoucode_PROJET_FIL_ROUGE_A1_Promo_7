import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

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
    if (!user) {
      setWishlist([]);
      return [];
    }

    setLoading(true);
    try {
      const response = await api.wishlist.getAll();

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      const wishlistData = response.data?.data?.wishlist || [];

      const validItems = wishlistData.filter((item) => {
        const hasProduct = item.product || item.product_id;
        return hasProduct;
      });

      setWishlist(validItems);
      return validItems;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addToWishlist = async (productId) => {
    if (!user)
      return { success: false, message: "Please log in to add to wishlist" };

    try {
      setLoading(true);
      const response = await api.wishlist.add(productId);

      if (
        response.data?.status === "info" &&
        response.data?.message === "Product is already in wishlist"
      ) {
        return { success: true, message: "Product is already in wishlist" };
      }

      await fetchWishlist();

      return {
        success: true,
        message: response.data?.message || "Product added to wishlist",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error adding to wishlist",
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user)
      return { success: false, message: "Please log in to manage wishlist" };

    try {
      setLoading(true);
      const response = await api.wishlist.remove(productId);

      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => {
          const itemProductId =
            item.product_id || (item.product && item.product.id);
          return itemProductId !== productId;
        })
      );

      await fetchWishlist();

      return {
        success: true,
        message: response.data?.message || "Product removed from wishlist",
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Product not found in wishlist",
        };
      }

      return {
        success: false,
        message:
          error.response?.data?.message || "Error removing from wishlist",
      };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => {
      return (
        item.product_id === productId ||
        (item.product && item.product.id === productId)
      );
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
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
