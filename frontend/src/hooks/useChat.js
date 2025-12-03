// ============================================
// hooks/useChat.js- CHAT HOOK
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import chatService from '../services/chatService';
import { CHAT_ROOMS } from '../utils/constants';

export const useChat = (room = CHAT_ROOMS.TABLE) => {
  const { sendChat: socketSendChat, on, off } = useWebSocket();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [room]);

  useEffect(() => {
    // Listen for new chat messages
    const handleChatMessage = (message) => {
      if (message.room === room) {
        setMessages(prev => [...prev, message]);
      }
    };

    // Listen for chat errors
    const handleChatError = (error) => {
      console.error('Chat error:', error);
    };

    on('chat_message', handleChatMessage);
    on('chat_error', handleChatError);

    return () => {
      off('chat_message', handleChatMessage);
      off('chat_error', handleChatError);
    };
  }, [room, on, off]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await chatService.getHistory(room);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = useCallback((message) => {
    if (!message || message.trim().length === 0) return;
    if (message.length > 200) {
      alert('Message too long (max 200 characters)');
      return;
    }
    socketSendChat(room, message.trim());
  }, [room, socketSendChat]);

  return {
    messages,
    loading,
    sendMessage
  };
};
