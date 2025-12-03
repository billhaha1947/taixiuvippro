// ============================================
// routes/history.routes.js - HISTORY ENDPOINTS
// ============================================
const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

// Get user bet history
router.get('/bet', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await pool.query(
      `SELECT b.*, r.dice1, r.dice2, r.dice3, r.total, r.result as round_result
       FROM bets b
       JOIN rounds r ON b.round_id = r.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC
       LIMIT $2`,
      [req.user.id, limit]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bet history' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT username, coins, avatar
       FROM users
       WHERE banned = FALSE
       ORDER BY coins DESC
       LIMIT 10`
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

module.exports = router;
