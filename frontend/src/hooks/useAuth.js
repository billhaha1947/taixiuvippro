// ============================================
// hooks/useAuth.js - AUTH HOOK (FIXED)
// ============================================
import { useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        // Fetch user profile from server to verify token
        const profile = await userService.getProfile();
        setUser(profile);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      // Token invalid or expired, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login({ username, password });
      authService.saveToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, email) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register({ username, password, email });
      authService.saveToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };
};
