// ============================================
// components/Game/ChipSelector.jsx - FIXED RESPONSIVE
// ============================================
import React from 'react';
import { CHIP_VALUES } from '../../utils/constants';

const Chip = ({ value, label, selected, onClick }) => {
  // Color based on value
  const getChipColor = (val) => {
    if (val >= 10000000) return 'from-purple-600 to-purple-800 border-purple-400';
    if (val >= 5000000) return 'from-pink-600 to-pink-800 border-pink-400';
    if (val >= 500000) return 'from-yellow-500 to-yellow-700 border-yellow-300';
    if (val >= 100000) return 'from-green-500 to-green-700 border-green-300';
    if (val >= 50000) return 'from-blue-500 to-blue-700 border-blue-300';
    if (val >= 10000) return 'from-red-500 to-red-700 border-red-300';
    return 'from-gray-500 to-gray-700 border-gray-300';
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-12 h-12 md:w-20 md:h-20 rounded-full
        bg-gradient-to-br ${getChipColor(value)}
        border-2 md:border-4 shadow-xl
        transform transition-all duration-200
        ${selected ? 'scale-110 shadow-2xl ring-2 md:ring-4 ring-dragon-gold' : 'hover:scale-105'}
        flex items-center justify-center
      `}
      style={{
        boxShadow: selected 
          ? '0 0 30px rgba(255, 215, 0, 0.8)' 
          : '0 5px 15px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Inner circle */}
      <div className="absolute inset-1 md:inset-2 border border-white/30 rounded-full"></div>
      
      {/* Value */}
      <span className="text-white font-display font-bold text-xs md:text-lg drop-shadow-lg z-10">
        {label}
      </span>

      {/* Shine effect */}
      <div className="absolute top-1 left-1 md:top-2 md:left-2 w-4 h-4 md:w-6 md:h-6 bg-white/40 rounded-full blur-md"></div>
    </button>
  );
};

const ChipSelector = ({ selectedAmount, onSelectAmount }) => {
  return (
    <div className="bg-gradient-to-r from-casino-black via-casino-dark to-casino-black border-2 border-dragon-red/30 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-neon-red">
      <h3 className="text-dragon-gold font-display font-bold text-center mb-2 md:mb-4 text-sm md:text-lg">
        CHỌN MỨC CƯỢC
      </h3>
      
      <div className="chip-grid flex flex-wrap gap-2 md:gap-3 justify-center items-center">
        {CHIP_VALUES.map((chip) => (
          <Chip
            key={chip.value}
            value={chip.value}
            label={chip.label}
            selected={selectedAmount === chip.value}
            onClick={() => onSelectAmount(chip.value)}
          />
        ))}
      </div>

      {/* Current selection */}
      {selectedAmount > 0 && (
        <div className="mt-3 md:mt-4 text-center">
          <p className="text-gray-400 text-xs md:text-sm">Đã chọn:</p>
          <p className="text-dragon-gold font-display font-bold text-lg md:text-2xl">
            {selectedAmount.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChipSelector;
