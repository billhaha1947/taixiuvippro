// ============================================
// services/userService.js - USER API SERVICE
// ============================================
import api from './api';

const userService = {
  /**
   * Get user profile
   * @returns {Promise} User profile
   */
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  /**
   * Update avatar
   * @param {string} avatar - Avatar URL
   * @returns {Promise} Success message
   */
  updateAvatar: async (avatar) => {
    const response = await api.post('/api/user/avatar', { avatar });
    return response.data;
  },

  /**
   * Get bet history
   * @param {number} limit - Number of bets to fetch
   * @returns {Promise} Bet history
   */
  getBetHistory: async (limit = 20) => {
    const response = await api.get('/api/history/bet', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get leaderboard
   * @returns {Promise} Top 10 users
   */
  getLeaderboard: async () => {
    const response = await api.get('/api/history/leaderboard');
    return response.data;
  }
};

export default userService;
