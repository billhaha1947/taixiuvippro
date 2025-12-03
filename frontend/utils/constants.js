// ============================================
// utils/constants.js - FRONTEND CONSTANTS
// ============================================

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

export const GAME_PHASES = {
  OPEN: 'open',
  LOCK: 'lock',
  ROLLING: 'rolling',
  RESULT: 'result'
};

export const CHIP_VALUES = [
  { value: 1000, label: '1K' },
  { value: 10000, label: '10K' },
  { value: 50000, label: '50K' },
  { value: 100000, label: '100K' },
  { value: 500000, label: '500K' },
  { value: 5000000, label: '5M' },
  { value: 10000000, label: '10M' },
  { value: 50000000, label: '50M' }
];

export const BET_SIDES = {
  TAI: 'tai',
  XIU: 'xiu'
};

export const CHAT_ROOMS = {
  TABLE: 'table',
  GLOBAL: 'global'
};

export const SOUND_EFFECTS = {
  DICE_ROLL: 'dice-roll',
  DICE_SLAM: 'dice-slam',
  CHIP_PLACE: 'chip-place',
  WIN: 'win',
  LOSE: 'lose',
  COUNTDOWN: 'countdown',
  BACKGROUND: 'background'
};

export const AVATAR_PLACEHOLDERS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
];

export const COLORS = {
  TAI_BLACK: '#000000',
  XIU_WHITE: '#ffffff',
  DRAGON_RED: '#ff0000',
  DRAGON_GOLD: '#ffd700',
  DRAGON_ORANGE: '#ff4500'
};
