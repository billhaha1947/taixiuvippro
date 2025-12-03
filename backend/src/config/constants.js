// ============================================
// config/constants.js - GAME CONSTANTS
// ============================================

module.exports = {
  GAME_PHASES: {
    OPEN: 'open',      // Đang mở cửa - cho đặt cược
    LOCK: 'lock',      // Khóa cược - chờ lắc
    ROLLING: 'rolling', // Đang lắc xúc sắc
    RESULT: 'result'   // Hiển thị kết quả
  },
  
  TIMERS: {
    OPEN_DURATION: 30,      // 30 giây mở cược (thay đổi từ 15)
    LOCK_DURATION: 10,      // 10 giây khóa cược (thay đổi từ 5)
    ROLLING_DURATION: 3,    // 3 giây animation xúc sắc
    RESULT_DURATION: 2      // 2 giây hiển thị kết quả
  },
  
  PAYOUT_RATE: 1, // 1:1 payout
  MIN_BET: 1000,
  MAX_BET: 50000000,
  DEFAULT_COINS: 10000,
  DEFAULT_WINRATE: 45 // % thắng của người chơi
};
