// ============================================
// routes/bet.routes.js - BET ENDPOINTS
// ============================================
const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middlewares/auth');
const { gameService } = require('../services/gameService');

const router = express.Router();

router.use(authMiddleware);

// Place bet (HTTP endpoint - backup for socket)
router.post('/place', async (req, res) => {
  try {
    const { side, amount } = req.body;

    if (!side || !amount) {
      return res.status(400).json({ error: 'Side and amount required' });
    }

    if (!['tai', 'xiu'].includes(side)) {
      return res.status(400).json({ error: 'Invalid side' });
    }

    if (amount < 1000) {
      return res.status(400).json({ error: 'Minimum bet is 1,000 coins' });
    }

    const bet = await gameService.placeBet(req.user.id, side, amount);
    
    const user = await pool.query('SELECT coins FROM users WHERE id = $1', [req.user.id]);
    
    res.json({
      bet,
      coins: user.rows[0].coins
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
