import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check state on load
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = localStorage.getItem("shopez_token");
        const storedUserJson = localStorage.getItem("shopez_user");
        
        if (storedToken && storedUserJson) {
          const parsedUser = JSON.parse(storedUserJson);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAdmin(!!parsedUser.isAdmin);
          
          // Verify & sync profile in the background
          const response = await api.get("/api/users/profile", {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data?.success) {
            const freshUser = response.data.user;
            setUser(freshUser);
            setIsAdmin(!!freshUser.isAdmin);
            localStorage.setItem("shopez_user", JSON.stringify(freshUser));
          }
        }
      } catch (err) {
        console.error("Failed to verify user profile token", err);
      } finally {
        setLoading(false);
      }
    }
    loadStoredAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/api/users/login", { email, password });
      if (response.data?.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        
        localStorage.setItem("shopez_token", receivedToken);
        localStorage.setItem("shopez_user", JSON.stringify(receivedUser));
        
        setToken(receivedToken);
        setUser(receivedUser);
        setIsAdmin(!!receivedUser.isAdmin);
        return { success: true };
      }
      return { success: false, message: response.data?.message || "Invalid credentials." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Something went wrong during login."
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      const response = await api.post("/api/users/register", { name, email, password, phone });
      if (response.data?.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        
        localStorage.setItem("shopez_token", receivedToken);
        localStorage.setItem("shopez_user", JSON.stringify(receivedUser));
        
        setToken(receivedToken);
        setUser(receivedUser);
        setIsAdmin(!!receivedUser.isAdmin);
        return { success: true };
      }
      return { success: false, message: response.data?.message || "Registration failed." };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Something went wrong during registration."
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("shopez_token");
    localStorage.removeItem("shopez_user");
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  // Direct state sync (e.g. after updating profile)
  const updateLocalUser = (updatedUser) => {
    localStorage.setItem("shopez_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsAdmin(!!updatedUser.isAdmin);
  };

  const value = {
    user,
    token,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateLocalUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume auth state
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed inside an AuthProvider");
  }
  return context;
}
