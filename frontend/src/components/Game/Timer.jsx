// ============================================
// components/Game/Timer.jsx - Đồng Hồ Đếm Ngược
// ============================================
import React from 'react';
import { Clock } from 'lucide-react';
import { GAME_PHASES } from '../../utils/constants';

const Timer = ({ timer, phase }) => {
  const isLowTime = timer <= 5;
  const isOpen = phase === GAME_PHASES.OPEN;
  const isLock = phase === GAME_PHASES.LOCK;
  const isRolling = phase === GAME_PHASES.ROLLING;

  const getPhaseText = () => {
    switch (phase) {
      case GAME_PHASES.OPEN:
        return 'ĐANG MỞ CƯỢC';
      case GAME_PHASES.LOCK:
        return 'KHÓA CƯỢC';
      case GAME_PHASES.ROLLING:
        return 'ĐANG LẮC XÚC SẮC';
      case GAME_PHASES.RESULT:
        return 'KẾT QUẢ';
      default:
        return '';
    }
  };

  const getColor = () => {
    if (isRolling) return 'text-purple-400';
    if (isLock) return 'text-orange-400';
    if (isLowTime) return 'text-dragon-red';
    return 'text-dragon-gold';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Phase text */}
      <div className="bg-gradient-to-r from-casino-black via-casino-dark to-casino-black border-2 border-dragon-red/30 rounded-xl px-6 py-2">
        <p className={`font-display font-bold text-lg ${getColor()} animate-pulse-glow`}>
          {getPhaseText()}
        </p>
      </div>

      {/* Timer circle */}
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className={`
            absolute inset-0 rounded-full
            ${isLowTime ? 'animate-pulse-glow' : ''}
          `}
          style={{
            boxShadow: isLowTime 
              ? '0 0 40px rgba(255, 0, 0, 0.8)' 
              : '0 0 20px rgba(255, 215, 0, 0.5)'
          }}
        ></div>

        {/* Timer container */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-casino-dark to-casino-black rounded-full border-4 border-dragon-gold flex items-center justify-center">
          {/* Inner circle */}
          <div className="absolute inset-3 border-2 border-dragon-red/30 rounded-full"></div>

          {/* Timer value */}
          <div className="text-center z-10">
            <Clock 
              size={24} 
              className={`mx-auto mb-1 ${getColor()}`}
            />
            <span className={`
              text-5xl font-display font-bold ${getColor()}
              ${isLowTime ? 'animate-pulse' : ''}
            `}>
              {timer}
            </span>
            <p className="text-gray-400 text-xs mt-1">giây</p>
          </div>

          {/* Progress ring (optional) */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="58"
              fill="none"
              stroke={isLowTime ? '#ff0000' : '#ffd700'}
              strokeWidth="3"
              strokeDasharray={`${(timer / 25) * 365} 365`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Timer;
