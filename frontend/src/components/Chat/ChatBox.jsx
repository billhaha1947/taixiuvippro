// ============================================
// components/Chat/ChatBox.jsx - Chat Component
// ============================================
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Users } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { CHAT_ROOMS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const ChatBox = ({ isOpen, onClose }) => {
  const [room, setRoom] = useState(CHAT_ROOMS.TABLE);
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat(room);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-dragon-red to-dragon-orange text-white p-4 rounded-full shadow-neon-red hover:scale-110 transition-transform z-40"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-gradient-to-br from-casino-dark to-casino-black border-2 border-dragon-red/30 rounded-2xl shadow-neon-red flex flex-col z-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-dragon-red to-dragon-orange p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <h3 className="font-display font-bold">CHAT</h3>
        </div>
        <button onClick={onClose} className="hover:scale-110 transition">
          <X size={20} />
        </button>
      </div>

      {/* Room tabs */}
      <div className="flex border-b border-dragon-red/30">
        <button
          onClick={() => setRoom(CHAT_ROOMS.TABLE)}
          className={`flex-1 py-3 font-semibold transition ${
            room === CHAT_ROOMS.TABLE
              ? 'bg-dragon-red/20 text-dragon-gold border-b-2 border-dragon-gold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Bàn Cược
        </button>
        <button
          onClick={() => setRoom(CHAT_ROOMS.GLOBAL)}
          className={`flex-1 py-3 font-semibold transition flex items-center justify-center gap-2 ${
            room === CHAT_ROOMS.GLOBAL
              ? 'bg-dragon-red/20 text-dragon-gold border-b-2 border-dragon-gold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users size={16} />
          Toàn Server
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-casino-surface rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-dragon-gold font-semibold text-sm">
                {msg.username}
              </span>
              <span className="text-gray-500 text-xs">
                {formatDate(msg.timestamp)}
              </span>
            </div>
            <p className="text-white text-sm">{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-dragon-red/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            maxLength={200}
            className="flex-1 bg-casino-surface border border-dragon-red/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-dragon-red"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-gradient-to-r from-dragon-red to-dragon-orange text-white p-2 rounded-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
