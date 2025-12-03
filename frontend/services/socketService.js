// ============================================
// services/socketService.js - SOCKET.IO CLIENT
// ============================================
import { io } from 'socket.io-client';
import { WS_URL } from '../utils/constants';
import authService from './authService';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Connect to socket server
   */
  connect() {
    if (this.socket?.connected) {
      console.log('[Socket] Already connected');
      return;
    }

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
      this.joinGame();
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('[Socket] Disconnected manually');
    }
  }

  /**
   * Join game room
   */
  joinGame() {
    const token = authService.getToken();
    if (token && this.socket) {
      this.socket.emit('join_game', token);
      console.log('[Socket] Joined game');
    }
  }

  /**
   * Place a bet
   * @param {string} side - 'tai' or 'xiu'
   * @param {number} amount - Bet amount
   */
  placeBet(side, amount) {
    const token = authService.getToken();
    if (this.socket && token) {
      this.socket.emit('place_bet', { side, amount, token });
      console.log(`[Socket] Placed bet: ${side} - ${amount}`);
    }
  }

  /**
   * Send chat message
   * @param {string} room - 'table' or 'global'
   * @param {string} message - Message content
   */
  sendChat(room, message) {
    const token = authService.getToken();
    if (this.socket && token) {
      this.socket.emit('send_chat', { room, message, token });
      console.log(`[Socket] Sent chat to ${room}:`, message);
    }
  }

  /**
   * Listen to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;
