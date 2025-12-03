// ============================================
// components/Game/DiceTable.jsx - Bàn Xúc Sắc
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
        relative w-20 h-20 bg-gradient-to-br from-dragon-red via-red-600 to-red-900
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
          className="absolute w-3 h-3 bg-white rounded-full shadow-lg"
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
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Table surface */}
      <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-3xl p-8 shadow-2xl border-4 border-yellow-600">
        {/* Table pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)'
          }}></div>
        </div>

        {/* Dice container */}
        <div className={`
          relative flex gap-6 items-center justify-center
          ${isRolling ? 'animate-dice-shake' : ''}
        `}>
          {dice.map((value, idx) => (
            <Dice key={idx} value={value} isRolling={isRolling} />
          ))}
        </div>

        {/* Result display */}
        {showResult && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center animate-win-flash">
            <div className={`
              bg-gradient-to-r px-8 py-4 rounded-xl shadow-2xl border-2
              ${result === 'tai' 
                ? 'from-black via-gray-800 to-black border-white text-white' 
                : 'from-white via-gray-100 to-white border-black text-black'
              }
            `}>
              <p className="text-4xl font-display font-bold">
                {result === 'tai' ? 'TÀI' : 'XỈU'}
              </p>
              <p className="text-xl font-semibold mt-1">
                Tổng: {total}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Total display (during rolling) */}
      {!showResult && (
        <div className="mt-6 bg-casino-dark border-2 border-dragon-red/30 rounded-xl px-6 py-3">
          <p className="text-dragon-gold text-2xl font-display font-bold">
            Tổng: {total}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiceTable;
