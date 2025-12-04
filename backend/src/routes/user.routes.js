// ============================================
// routes/user.routes.js - USER ENDPOINTS (FIXED)
// ============================================
const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

// Get profile
router.get('/profile', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, coins, avatar, is_admin, created_at FROM users WHERE id = $1',
      //                                              ↑ THÊM is_admin
      [req.user.id]
    );
    
    const user = result.rows[0];
    
    // Convert is_admin to isAdmin (camelCase for frontend)
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      coins: user.coins,
      avatar: user.avatar,
      isAdmin: user.is_admin,  // ← Convert snake_case to camelCase
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update avatar
router.post('/avatar', async (req, res) => {
  try {
    const { avatar } = req.body;
    await pool.query(
      'UPDATE users SET avatar = $1, updated_at = NOW() WHERE id = $2',
      [avatar, req.user.id]
    );
    res.json({ message: 'Avatar updated', avatar });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

module.exports = router;
