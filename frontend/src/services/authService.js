// ============================================
// services/authService.js - FIXED WITH isAdmin
// ============================================
import api from './api';

const authService = {
  /**
   * Register new user
   * @param {Object} data - { username, password, email }
   * @returns {Promise} User and token
   */
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    // Save user to localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Login user
   * @param {Object} data - { username, password }
   * @returns {Promise} User and token
   */
  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    // Save user to localStorage (including isAdmin)
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Change password
   * @param {Object} data - { oldPassword, newPassword }
   * @returns {Promise} Success message
   */
  changePassword: async (data) => {
    const response = await api.post('/api/auth/change-password', data);
    return response.data;
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      
      // Fallback: Try to decode from token
      const token = localStorage.getItem('token');
      if (!token) return null;

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Save token to localStorage
   * @param {string} token
   */
  saveToken: (token) => {
    localStorage.setItem('token', token);
  },

  /**
   * Get token from localStorage
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Update user in localStorage
   * @param {Object} userData - Updated user data
   */
  updateStoredUser: (userData) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }
};

export default authService;
