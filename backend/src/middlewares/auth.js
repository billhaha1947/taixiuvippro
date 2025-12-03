// ============================================
// middlewares/auth.js - AUTHENTICATION MIDDLEWARE
// ============================================
const { verifyToken } = require('../utils/jwt');
const pool = require('../config/database');

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await pool.query(
      'SELECT id, username, email, coins, avatar, is_admin, banned FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.rows[0].banned) {
      return res.status(403).json({ error: 'User is banned' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

async function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
