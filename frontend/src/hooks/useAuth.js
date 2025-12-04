// ============================================
// hooks/useAuth.js - FIXED WITH localStorage
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
      if (!token) {
        setLoading(false);
        return;
      }

      // Try to get user from localStorage first (faster)
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        console.log('✅ User loaded from localStorage:', storedUser);
      }

      // Then fetch fresh data from server to verify token and update
      try {
        const profile = await userService.getProfile();
        console.log('✅ User profile from server:', profile);
        
        // Update both state and localStorage
        setUser(profile);
        authService.updateStoredUser(profile);
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
        // Token invalid or expired, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(err);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
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
      
      console.log('✅ Login successful:', data.user);
      setUser(data.user);
      
      return data;
    } catch (err) {
      console.error('❌ Login failed:', err);
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
      
      console.log('✅ Register successful:', data.user);
      setUser(data.user);
      
      return data;
    } catch (err) {
      console.error('❌ Register failed:', err);
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
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    authService.updateStoredUser(newUser);
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
