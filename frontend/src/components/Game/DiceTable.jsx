// ============================================
// components/Game/DiceTable.jsx - FIXED
// ============================================
import React from 'react';
import { GAME_PHASES } from '../../utils/constants';

const Dice = ({ value, isRolling }) => {
  // Dice face dots positions
  const getDotPositions = (val) => {
    const positions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
    };
    return positions[val] || [];
  };

  return (
    <div
      className={`
        relative w-16 h-16 md:w-20 md:h-20 
        bg-gradient-to-br from-dragon-red via-red-600 to-red-900
        rounded-xl shadow-2xl border-2 border-red-800
        ${isRolling ? 'animate-dice-spin' : ''}
        transition-all duration-300
      `}
      style={{
        boxShadow: '0 8px 20px rgba(255, 0, 0, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Dots */}
      {getDotPositions(value).map((pos, idx) => (
        <div
          key={idx}
          className="absolute w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-lg"
          style={{
            left: `${pos[0]}%`,
            top: `${pos[1]}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

const DiceTable = ({ dice, gamePhase, total, result }) => {
  const isRolling = gamePhase === GAME_PHASES.ROLLING;
  const showResult = gamePhase === GAME_PHASES.RESULT;

  return (
    <div className="relative flex flex-col items-center justify-center py-4 md:py-8">
      {/* Table surface */}
      <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border-2 md:border-4 border-yellow-600">
        {/* Table pattern */}
        <div className="absolute inset-0 opacity-10 rounded-2xl md:rounded-3xl overflow-hidden">
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)'
          }}></div>
        </div>

        {/* Dice container */}
        <div className={`
          dice-container relative flex gap-3 md:gap-6 items-center justify-center
          ${isRolling ? 'animate-dice-shake' : ''}
        `}>
          {dice.map((value, idx) => (
            <Dice key={idx} value={value} isRolling={isRolling} />
          ))}
        </div>

        {/* Result display - CHỈ HIỆN KHI RESULT PHASE */}
        {showResult && (
          <div className="absolute -bottom-12 md:-bottom-16 left-1/2 transform -translate-x-1/2 text-center animate-win-flash z-10">
            <div className={`
              bg-gradient-to-r px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl shadow-2xl border-2
              ${result === 'tai' 
                ? 'from-black via-gray-800 to-black border-white text-white' 
                : 'from-white via-gray-100 to-white border-black text-black'
              }
            `}>
              <p className="text-xl md:text-4xl font-display font-bold">
                {result === 'tai' ? 'TÀI' : 'XỈU'}
              </p>
              <p className="text-base md:text-xl font-semibold mt-1">
                Tổng: {total}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Total display - CHỈ HIỆN KHI KHÔNG ROLLING VÀ KHÔNG SHOWING RESULT */}
      {!isRolling && !showResult && (
        <div className="mt-4 md:mt-6 bg-casino-dark border-2 border-dragon-red/30 rounded-lg md:rounded-xl px-4 md:px-6 py-2 md:py-3">
          <p className="text-dragon-gold text-lg md:text-2xl font-display font-bold">
            Tổng: {total}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiceTable;
