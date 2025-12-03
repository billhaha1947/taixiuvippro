// ============================================
// sockets/gameSocket.js - GAME SOCKET HANDLER
// ============================================
const { gameService } = require('../services/gameService');
const { verifyToken } = require('../utils/jwt');
const pool = require('../config/database');

module.exports = (io, socket) => {
  let userId = null;

  socket.on('join_game', async (token) => {
    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }

      userId = decoded.userId;
      
      const user = await pool.query(
        'SELECT id, username, coins, banned FROM users WHERE id = $1',
        [userId]
      );

      if (user.rows.length === 0 || user.rows[0].banned) {
        socket.emit('error', { message: 'Cannot join game' });
        return;
      }

      socket.join('game');
      socket.emit('game_state', gameService.getState());
      socket.emit('user_update', {
        coins: user.rows[0].coins
      });

      console.log(`User ${user.rows[0].username} joined game`);
    } catch (error) {
      console.error('Join game error:', error);
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  socket.on('place_bet', async ({ side, amount, token }) => {
    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        socket.emit('bet_error', { message: 'Invalid token' });
        return;
      }

      if (!['tai', 'xiu'].includes(side)) {
        socket.emit('bet_error', { message: 'Invalid side' });
        return;
      }

      if (typeof amount !== 'number' || amount < 1000) {
        socket.emit('bet_error', { message: 'Minimum bet is 1,000 coins' });
        return;
      }

      const bet = await gameService.placeBet(decoded.userId, side, amount);
      
      const user = await pool.query('SELECT coins FROM users WHERE id = $1', [decoded.userId]);
      
      socket.emit('bet_placed', {
        bet,
        coins: user.rows[0].coins
      });

      // Broadcast updated game state to all players
      io.to('game').emit('game_state', gameService.getState());
    } catch (error) {
      console.error('Place bet error:', error);
      socket.emit('bet_error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    if (userId) {
      console.log(`User ${userId} disconnected from game`);
    }
  });
};
