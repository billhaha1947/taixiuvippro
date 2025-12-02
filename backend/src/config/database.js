// ============================================
// config/database.js - POSTGRESQL CONNECTION
// ============================================
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

// Initialize tables
const initDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE,
        coins BIGINT DEFAULT 10000,
        avatar VARCHAR(255) DEFAULT '/avatars/default.png',
        is_admin BOOLEAN DEFAULT FALSE,
        banned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Rounds table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rounds (
        id SERIAL PRIMARY KEY,
        dice1 INTEGER NOT NULL CHECK (dice1 BETWEEN 1 AND 6),
        dice2 INTEGER NOT NULL CHECK (dice2 BETWEEN 1 AND 6),
        dice3 INTEGER NOT NULL CHECK (dice3 BETWEEN 1 AND 6),
        total INTEGER NOT NULL,
        result VARCHAR(10) NOT NULL CHECK (result IN ('tai', 'xiu')),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Bets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        round_id INTEGER REFERENCES rounds(id) ON DELETE CASCADE,
        side VARCHAR(10) NOT NULL CHECK (side IN ('tai', 'xiu')),
        amount BIGINT NOT NULL CHECK (amount > 0),
        win BOOLEAN,
        payout BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Chats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        round_id INTEGER,
        room VARCHAR(20) NOT NULL CHECK (room IN ('table', 'global')),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Game settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert default winrate
    await pool.query(`
      INSERT INTO game_settings (key, value)
      VALUES ('winrate', '45')
      ON CONFLICT (key) DO NOTHING
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

initDatabase();

module.exports = pool;
