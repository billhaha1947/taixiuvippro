// ============================================
// services/gameService.js - GAME LOOP & LOGIC
// ============================================
const pool = require('../config/database');
const diceService = require('./diceService');
const { GAME_PHASES, TIMERS } = require('../config/constants');

class GameService {
  constructor() {
    this.currentRound = null;
    this.gameState = {
      phase: GAME_PHASES.OPEN,
      timer: TIMERS.OPEN_DURATION,
      roundNumber: 1,
      dice: [1, 1, 1],
      total: 3,
      result: null,
      bets: {
        tai: { count: 0, amount: 0 },
        xiu: { count: 0, amount: 0 }
      }
    };
    this.io = null;
  }

  async startNewRound() {
    this.gameState.phase = GAME_PHASES.OPEN;
    this.gameState.timer = TIMERS.OPEN_DURATION;
    this.gameState.result = null;
    this.gameState.bets = {
      tai: { count: 0, amount: 0 },
      xiu: { count: 0, amount: 0 }
    };

    // Create new round in database
    const result = await pool.query(
      'INSERT INTO rounds (dice1, dice2, dice3, total, result) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [0, 0, 0, 0, 'tai'] // Placeholder values
    );
    
    this.currentRound = result.rows[0].id;
    console.log(`🎲 New round started: #${this.currentRound}`);
  }

  async lockBets() {
    this.gameState.phase = GAME_PHASES.LOCK;
    this.gameState.timer = TIMERS.LOCK_DURATION;
    console.log('🔒 Bets locked');
  }

  async rollDice() {
    this.gameState.phase = GAME_PHASES.ROLLING;
    this.gameState.timer = TIMERS.ROLLING_DURATION;

    // Lấy thông tin cược để quyết định kết quả
    const winrate = await diceService.getWinrate();
    
    // Logic: Quyết định người chơi thắng hay thua dựa vào winrate
    const shouldPlayerWin = Math.random() * 100 < winrate;
    
    // Lấy tổng số cược mỗi bên
    const { tai, xiu } = this.gameState.bets;
    
    let targetResult;
    if (tai.amount === 0 && xiu.amount === 0) {
      // Không có cược nào, roll random
      targetResult = null;
    } else if (shouldPlayerWin) {
      // Người chơi thắng -> cho kết quả về phía có nhiều cược hơn
      targetResult = tai.amount > xiu.amount ? 'tai' : 'xiu';
    } else {
      // Nhà cái thắng -> cho kết quả về phía có ít cược hơn
      targetResult = tai.amount > xiu.amount ? 'xiu' : 'tai';
    }

    // Roll dice với target result
    const diceResult = await diceService.rollWeightedDice(targetResult);
    
    this.gameState.dice = [diceResult.dice1, diceResult.dice2, diceResult.dice3];
    this.gameState.total = diceResult.total;
    this.gameState.result = diceResult.result;

    // Update round in database
    await pool.query(
      'UPDATE rounds SET dice1 = $1, dice2 = $2, dice3 = $3, total = $4, result = $5 WHERE id = $6',
      [diceResult.dice1, diceResult.dice2, diceResult.dice3, diceResult.total, diceResult.result, this.currentRound]
    );

    console.log(`🎲 Dice rolled: [${diceResult.dice1}, ${diceResult.dice2}, ${diceResult.dice3}] = ${diceResult.total} (${diceResult.result})`);
  }

  async showResult() {
    this.gameState.phase = GAME_PHASES.RESULT;
    this.gameState.timer = TIMERS.RESULT_DURATION;

    // Process all bets for this round
    await this.processBets();
    
    console.log('📊 Result shown');
  }

  async processBets() {
    try {
      const bets = await pool.query(
        'SELECT * FROM bets WHERE round_id = $1 AND win IS NULL',
        [this.currentRound]
      );

      for (const bet of bets.rows) {
        const win = bet.side === this.gameState.result;
        const payout = win ? bet.amount * 2 : 0; // 1:1 payout

        // Update bet
        await pool.query(
          'UPDATE bets SET win = $1, payout = $2 WHERE id = $3',
          [win, payout, bet.id]
        );

        // Update user coins
        if (win) {
          await pool.query(
            'UPDATE users SET coins = coins + $1 WHERE id = $2',
            [payout, bet.user_id]
          );
        }
      }

      console.log(`💰 Processed ${bets.rows.length} bets`);
    } catch (error) {
      console.error('Error processing bets:', error);
    }
  }

  async placeBet(userId, side, amount) {
    if (this.gameState.phase !== GAME_PHASES.OPEN) {
      throw new Error('Betting is closed');
    }

    // Check user has enough coins
    const user = await pool.query('SELECT coins FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      throw new Error('User not found');
    }
    if (user.rows[0].coins < amount) {
      throw new Error('Insufficient coins');
    }

    // Deduct coins
    await pool.query(
      'UPDATE users SET coins = coins - $1 WHERE id = $2',
      [amount, userId]
    );

    // Create bet
    const result = await pool.query(
      'INSERT INTO bets (user_id, round_id, side, amount) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, this.currentRound, side, amount]
    );

    // Update bet statistics
    this.gameState.bets[side].count++;
    this.gameState.bets[side].amount += amount;

    return result.rows[0];
  }

  getState() {
    return this.gameState;
  }
}

const gameService = new GameService();

// Game loop
function initGameLoop(io) {
  gameService.io = io;
  
  // Start first round
  gameService.startNewRound();

  // Main game loop
  setInterval(async () => {
    gameService.gameState.timer--;

    if (gameService.gameState.timer <= 0) {
      switch (gameService.gameState.phase) {
        case GAME_PHASES.OPEN:
          await gameService.lockBets();
          break;
        case GAME_PHASES.LOCK:
          await gameService.rollDice();
          break;
        case GAME_PHASES.ROLLING:
          await gameService.showResult();
          break;
        case GAME_PHASES.RESULT:
          gameService.gameState.roundNumber++;
          await gameService.startNewRound();
          break;
      }
    }

    // Broadcast game state
    io.emit('game_state', gameService.getState());
  }, 1000);
}

module.exports = { gameService, initGameLoop };
