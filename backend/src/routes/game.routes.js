// ============================================
// routes/game.routes.js - GAME ENDPOINTS
// ============================================
const express = require('express');
const { gameService } = require('../services/gameService');
const pool = require('../config/database');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get current game state (public)
router.get('/current', (req, res) => {
  res.json(gameService.getState());
});

// Get round result
router.get('/result/:roundId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rounds WHERE id = $1',
      [req.params.roundId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Round not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get result' });
  }
});

// Get game history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await pool.query(
      'SELECT * FROM rounds ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get history' });
  }
});

module.exports = router;
