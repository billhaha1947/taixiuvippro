// ============================================
// sockets/chatSocket.js - CHAT SOCKET HANDLER
// ============================================
const { verifyToken } = require('../utils/jwt');
const pool = require('../config/database');

const messageTimestamps = new Map();
const MESSAGE_COOLDOWN = 2000; // 2 seconds

module.exports = (io, socket) => {
  socket.on('send_chat', async ({ room, message, token }) => {
    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        socket.emit('chat_error', { message: 'Invalid token' });
        return;
      }

      // Validate room
      if (!['table', 'global'].includes(room)) {
        socket.emit('chat_error', { message: 'Invalid room' });
        return;
      }

      // Anti-spam check
      const lastMessage = messageTimestamps.get(decoded.userId);
      const now = Date.now();
      if (lastMessage && now - lastMessage < MESSAGE_COOLDOWN) {
        socket.emit('chat_error', { message: 'Please wait before sending another message' });
        return;
      }

      const user = await pool.query(
        'SELECT username, banned FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (user.rows.length === 0 || user.rows[0].banned) {
        socket.emit('chat_error', { message: 'Cannot send message' });
        return;
      }

      // Validate message
      const trimmedMessage = message.trim();
      if (trimmedMessage.length === 0) {
        socket.emit('chat_error', { message: 'Message cannot be empty' });
        return;
      }

      if (trimmedMessage.length > 200) {
        socket.emit('chat_error', { message: 'Message too long (max 200 characters)' });
        return;
      }

      // Save to database
      await pool.query(
        'INSERT INTO chats (user_id, room, message) VALUES ($1, $2, $3)',
        [decoded.userId, room, trimmedMessage]
      );

      messageTimestamps.set(decoded.userId, now);

      const chatMessage = {
        username: user.rows[0].username,
        message: trimmedMessage,
        timestamp: new Date().toISOString(),
        room
      };

      // Broadcast message
      if (room === 'global') {
        io.emit('chat_message', chatMessage);
      } else {
        io.to('game').emit('chat_message', chatMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      socket.emit('chat_error', { message: 'Failed to send message' });
    }
  });
};
