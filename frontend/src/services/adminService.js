// ============================================
// services/adminService.js - ADMIN API SERVICE
// ============================================
import api from './api';

const adminService = {
  /**
   * Get all users
   * @returns {Promise} Users list
   */
  getUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  /**
   * Ban user
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  banUser: async (userId) => {
    const response = await api.post(`/api/admin/users/${userId}/ban`);
    return response.data;
  },

  /**
   * Unban user
   * @param {number} userId - User ID
   * @returns {Promise} Success message
   */
  unbanUser: async (userId) => {
    const response = await api.post(`/api/admin/users/${userId}/unban`);
    return response.data;
  },

  /**
   * Update user coins
   * @param {number} userId - User ID
   * @param {number} coins - New coins amount
   * @returns {Promise} Success message
   */
  updateCoins: async (userId, coins) => {
    const response = await api.put(`/api/admin/users/${userId}/coins`, { coins });
    return response.data;
  },

  /**
   * Get winrate
   * @returns {Promise} Current winrate
   */
  getWinrate: async () => {
    const response = await api.get('/api/admin/winrate');
    return response.data;
  },

  /**
   * Update winrate
   * @param {number} winrate - New winrate (0-100)
   * @returns {Promise} Success message
   */
  updateWinrate: async (winrate) => {
    const response = await api.put('/api/admin/winrate', { winrate });
    return response.data;
  },

  /**
   * Reset user password
   * @param {number} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise} Success message
   */
  resetPassword: async (userId, newPassword) => {
    const response = await api.post('/api/admin/reset-password', {
      userId,
      newPassword
    });
    return response.data;
  },

  /**
   * Get statistics
   * @returns {Promise} System statistics
   */
  getStatistics: async () => {
    const response = await api.get('/api/admin/statistics');
    return response.data;
  }
};

export default adminService;
