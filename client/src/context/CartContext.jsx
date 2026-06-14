import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch Cart from REST endpoint
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      setTotalPrice(0);
      return;
    }
    try {
      setLoading(true);
      const response = await api.get("/api/cart");
      if (response.data?.success && response.data?.cart) {
        setCartItems(response.data.cart.items || []);
        setTotalPrice(response.data.cart.totalPrice || 0);
      }
    } catch (err) {
      console.error("Error fetching shopping cart", err);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize cart with authentication sessions
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
      setTotalPrice(0);
    }
  }, [token]);

  // Add Item to Cart
  const addToCart = async (productId, quantity = 1) => {
    if (!token) return { success: false, message: "Please log in to add items." };
    try {
      setLoading(true);
      const response = await api.post("/api/cart", { productId, quantity });
      if (response.data?.success) {
        setCartItems(response.data.cart.items || []);
        setTotalPrice(response.data.cart.totalPrice || 0);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Failed to add item to cart." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Something went wrong."
      };
    } finally {
      setLoading(false);
    }
  };

  // Modify Quantity
  const updateQuantity = async (productId, quantity) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      setLoading(true);
      const response = await api.put(`/api/cart/${productId}`, { quantity });
      if (response.data?.success) {
        setCartItems(response.data.cart.items || []);
        setTotalPrice(response.data.cart.totalPrice || 0);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Failed to update item quantity." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Something went wrong."
      };
    } finally {
      setLoading(false);
    }
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      setLoading(true);
      const response = await api.delete(`/api/cart/${productId}`);
      if (response.data?.success) {
        setCartItems(response.data.cart.items || []);
        setTotalPrice(response.data.cart.totalPrice || 0);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Failed to remove item." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Something went wrong."
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset/Flush Cart
  const clearCart = async () => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      setLoading(true);
      const response = await api.delete("/api/cart/clear");
      if (response.data?.success) {
        setCartItems([]);
        setTotalPrice(0);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Failed to clear cart." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Something went wrong."
      };
    } finally {
      setLoading(false);
    }
  };

  // Count item instances (quantities aggregated) for cart badge
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    cartItems,
    totalPrice,
    loading,
    cartCount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to consume cart state
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be consumed inside a CartProvider");
  }
  return context;
}
