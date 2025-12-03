// ============================================
// utils/formatters.js - FORMAT UTILITIES
// ============================================

/**
 * Format number to K/M notation
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export const formatNumberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format time to MM:SS
 * @param {number} seconds - Seconds
 * @returns {string} Formatted time
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return d.toLocaleDateString('vi-VN');
};

/**
 * Format bet side to Vietnamese
 * @param {string} side - 'tai' or 'xiu'
 * @returns {string} Vietnamese name
 */
export const formatBetSide = (side) => {
  return side === 'tai' ? 'TÀI' : 'XỈU';
};

/**
 * Format game phase to Vietnamese
 * @param {string} phase - Game phase
 * @returns {string} Vietnamese name
 */
export const formatGamePhase = (phase) => {
  const phases = {
    'open': 'Đang mở cửa',
    'lock': 'Khóa cược',
    'rolling': 'Đang lắc',
    'result': 'Kết quả'
  };
  return phases[phase] || phase;
};
