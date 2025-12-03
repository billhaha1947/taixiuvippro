// ============================================
// routes/chat.routes.js - CHAT ENDPOINTS
// ============================================
const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

// Get chat history
router.get('/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    if (!['table', 'global'].includes(room)) {
      return res.status(400).json({ error: 'Invalid room' });
    }
    
    const result = await pool.query(
      `SELECT c.id, c.message, c.created_at, u.username
       FROM chats c
       JOIN users u ON c.user_id = u.id
       WHERE c.room = $1
       ORDER BY c.created_at DESC
       LIMIT $2`,
      [room, limit]
    );
    
    res.json(result.rows.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

module.exports = router;
