// ============================================
// services/chatService.js - CHAT API SERVICE
// ============================================
import api from './api';

const chatService = {
  /**
   * Get chat history
   * @param {string} room - 'table' or 'global'
   * @param {number} limit - Number of messages to fetch
   * @returns {Promise} Chat messages
   */
  getHistory: async (room, limit = 50) => {
    const response = await api.get(`/api/chat/${room}`, {
      params: { limit }
    });
    return response.data;
  }
};

export default chatService;
