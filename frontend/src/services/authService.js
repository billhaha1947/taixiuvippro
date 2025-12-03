// ============================================
// services/authService.js - AUTH API SERVICE
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
    return response.data;
  },

  /**
   * Login user
   * @param {Object} data - { username, password }
   * @returns {Promise} User and token
   */
  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
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
   * Get current user from token
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Decode JWT (simple decode, not verification)
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
      console.error('Failed to decode token:', error);
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
  }
};

export default authService;
