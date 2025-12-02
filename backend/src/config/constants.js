// ============================================
// config/constants.js - GAME CONSTANTS
// ============================================

module.exports = {
  GAME_PHASES: {
    OPEN: 'open',      // 15 seconds - cho đặt cược
    LOCK: 'lock',      // 5 seconds - khóa cược
    ROLLING: 'rolling', // 3 seconds - tung xúc sắc
    RESULT: 'result'   // 2 seconds - hiển thị kết quả
  },
  
  TIMERS: {
    OPEN_DURATION: 15,
    LOCK_DURATION: 5,
    ROLLING_DURATION: 3,
    RESULT_DURATION: 2
  },
  
  PAYOUT_RATE: 1, // 1:1 payout
  MIN_BET: 1000,
  MAX_BET: 50000000,
  DEFAULT_COINS: 10000,
  DEFAULT_WINRATE: 45 // % thắng của người chơi
};
