// ============================================
// services/gameService.js - GAME API SERVICE
// ============================================
import api from './api';

const gameService = {
  /**
   * Get current game state
   * @returns {Promise} Current game state
   */
  getCurrentState: async () => {
    const response = await api.get('/api/game/current');
    return response.data;
  },

  /**
   * Get round result
   * @param {number} roundId - Round ID
   * @returns {Promise} Round result
   */
  getRoundResult: async (roundId) => {
    const response = await api.get(`/api/game/result/${roundId}`);
    return response.data;
  },

  /**
   * Get game history
   * @param {number} limit - Number of rounds to fetch
   * @returns {Promise} Game history
   */
  getHistory: async (limit = 20) => {
    const response = await api.get('/api/game/history', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Place bet (HTTP backup)
   * @param {Object} data - { side, amount }
   * @returns {Promise} Bet result
   */
  placeBet: async (data) => {
    const response = await api.post('/api/bet/place', data);
    return response.data;
  }
};

export default gameService;
