// ============================================
// hooks/useWebSocket.js - WEBSOCKET HOOK
// ============================================
import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    // Connect to socket
    socketService.connect();

    // Listen to connection status
    socketService.on('connect', () => {
      setConnected(true);
    });

    socketService.on('disconnect', () => {
      setConnected(false);
    });

    // Listen to game state updates
    socketService.on('game_state', (state) => {
      setGameState(state);
    });

    // Cleanup on unmount
    return () => {
      socketService.removeAllListeners('connect');
      socketService.removeAllListeners('disconnect');
      socketService.removeAllListeners('game_state');
    };
  }, []);

  const placeBet = useCallback((side, amount) => {
    socketService.placeBet(side, amount);
  }, []);

  const sendChat = useCallback((room, message) => {
    socketService.sendChat(room, message);
  }, []);

  const on = useCallback((event, callback) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketService.off(event, callback);
  }, []);

  return {
    connected,
    gameState,
    placeBet,
    sendChat,
    on,
    off
  };
};
