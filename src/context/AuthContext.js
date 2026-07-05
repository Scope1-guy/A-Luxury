import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

// createContext gives us a "box" that any component in the tree can read
// from, without passing props down manually through every level (avoiding
// prop-drilling through Header, ProtectedRoute, Profile, etc).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check sessionStorage (via authService) for an existing
  // session so a refresh doesn't log the user out unexpectedly.
  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  async function login(email, password) {
    const result = await authService.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  }

  async function register(formData) {
    const result = await authService.register(formData);
    if (result.success) setUser(result.user);
    return result;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components write `const { user } = useAuth()` instead of
// importing useContext + AuthContext everywhere.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
