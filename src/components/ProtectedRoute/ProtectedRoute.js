import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Wraps a page element and redirects to /login if there's no logged-in
// user. `state={{ from: location }}` lets the Login page send the user
// back to wherever they were trying to go once they sign in.
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // avoid a flash-redirect while session is checked

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
