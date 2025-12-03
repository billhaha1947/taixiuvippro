// ============================================
// routes/admin.routes.js - ADMIN ENDPOINTS
// ============================================
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const diceService = require('../services/diceService');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, coins, banned, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Ban user
router.post('/users/:id/ban', async (req, res) => {
  try {
    await pool.query('UPDATE users SET banned = TRUE WHERE id = $1', [req.params.id]);
    res.json({ message: 'User banned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Unban user
router.post('/users/:id/unban', async (req, res) => {
  try {
    await pool.query('UPDATE users SET banned = FALSE WHERE id = $1', [req.params.id]);
    res.json({ message: 'User unbanned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

// Update user coins
router.put('/users/:id/coins', async (req, res) => {
  try {
    const { coins } = req.body;
    
    if (typeof coins !== 'number' || coins < 0) {
      return res.status(400).json({ error: 'Invalid coins amount' });
    }
    
    await pool.query('UPDATE users SET coins = $1 WHERE id = $2', [coins, req.params.id]);
    res.json({ message: 'Coins updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coins' });
  }
});

// Get winrate
router.get('/winrate', async (req, res) => {
  try {
    const winrate = await diceService.getWinrate();
    res.json({ winrate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get winrate' });
  }
});

// Update winrate
router.put('/winrate', async (req, res) => {
  try {
    const { winrate } = req.body;
    
    if (typeof winrate !== 'number' || winrate < 0 || winrate > 100) {
      return res.status(400).json({ error: 'Winrate must be between 0-100' });
    }
    
    await diceService.setWinrate(winrate);
    res.json({ message: 'Winrate updated', winrate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update winrate' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    
    if (!userId || !newPassword) {
      return res.status(400).json({ error: 'User ID and new password required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    );
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const totalRounds = await pool.query('SELECT COUNT(*) FROM rounds');
    const totalBets = await pool.query('SELECT COUNT(*) FROM bets');
    const totalCoins = await pool.query('SELECT SUM(coins) FROM users');
    
    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalRounds: parseInt(totalRounds.rows[0].count),
      totalBets: parseInt(totalBets.rows[0].count),
      totalCoins: parseInt(totalCoins.rows[0].sum || 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;
