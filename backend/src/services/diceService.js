// ============================================
// services/diceService.js - WEIGHTED DICE LOGIC
// ============================================
const pool = require('../config/database');

class DiceService {
  async getWinrate() {
    const result = await pool.query(
      'SELECT value FROM game_settings WHERE key = $1',
      ['winrate']
    );
    return parseInt(result.rows[0]?.value || 45);
  }

  async setWinrate(winrate) {
    await pool.query(
      'UPDATE game_settings SET value = $1, updated_at = NOW() WHERE key = $2',
      [winrate.toString(), 'winrate']
    );
  }

  // Roll dice với trọng số dựa vào winrate và target result
  async rollWeightedDice(targetResult = null) {
    if (!targetResult) {
      return this.rollPureDice();
    }

    let dice1, dice2, dice3, total;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      dice1 = Math.floor(Math.random() * 6) + 1;
      dice2 = Math.floor(Math.random() * 6) + 1;
      dice3 = Math.floor(Math.random() * 6) + 1;
      total = dice1 + dice2 + dice3;
      attempts++;

      const result = total >= 11 ? 'tai' : 'xiu';
      
      if (result === targetResult) {
        break;
      }
    } while (attempts < maxAttempts);

    const result = total >= 11 ? 'tai' : 'xiu';

    return { dice1, dice2, dice3, total, result };
  }

  // Roll dice thuần túy random (không có trọng số)
  rollPureDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2 + dice3;
    const result = total >= 11 ? 'tai' : 'xiu';
    
    return { dice1, dice2, dice3, total, result };
  }
}

module.exports = new DiceService();
