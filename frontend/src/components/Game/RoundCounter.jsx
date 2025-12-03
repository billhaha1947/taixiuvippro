// ============================================
// components/Game/RoundCounter.jsx - Số Vòng
// ============================================
import React from 'react';
import { Hash } from 'lucide-react';

const RoundCounter = ({ roundNumber }) => {
  return (
    <div className="bg-gradient-to-r from-casino-black via-casino-dark to-casino-black border-2 border-dragon-gold rounded-2xl px-8 py-4 shadow-neon-gold">
      <div className="flex items-center gap-3">
        <Hash size={32} className="text-dragon-gold animate-pulse-glow" />
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase">Vòng</p>
          <p className="text-dragon-gold font-display font-bold text-3xl">
            {roundNumber.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoundCounter;
