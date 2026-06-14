import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

export default function ProtectedRoute({ children, adminRequired = false }) {
  const { user, token, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner while determining session authenticity
    return <Loader fullPage={true} message="Verifying session..." id="protected-route-loader" />;
  }

  if (!token || !user) {
    // Save current location for redirection after login completes
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminRequired && !isAdmin) {
    // User is signed in but doesn't possess administrator permissions
    return <Navigate to="/" replace />;
  }

  return children;
}
