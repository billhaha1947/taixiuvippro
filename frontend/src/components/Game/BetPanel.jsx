// ============================================
// components/Game/BetPanel.jsx - RESPONSIVE OPTIMIZED
// ============================================
import React from 'react';
import { formatNumber } from '../../utils/formatters';

const BetPanel = ({ selectedSide, onSelectSide, bets, canBet, myBet }) => {
  return (
    <div className="flex gap-2 md:gap-6 justify-center items-center flex-wrap py-2 md:py-4">
      {/* TÀI - Cầu Đen */}
      <div className="bet-ball-wrapper relative">
        <button
          onClick={() => canBet && onSelectSide('tai')}
          disabled={!canBet || myBet}
          className={`
            relative w-28 h-28 md:w-48 md:h-48 rounded-full
            transition-all duration-300 transform
            ${selectedSide === 'tai' ? 'scale-110' : 'scale-100'}
            ${canBet && !myBet ? 'hover:scale-105 cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-70'}
            ${myBet?.side === 'tai' ? 'ring-2 md:ring-4 ring-dragon-gold animate-pulse-glow' : ''}
          `}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #2a2a2a, #000000)',
            boxShadow: selectedSide === 'tai' 
              ? '0 0 30px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.1)'
              : '0 0 15px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Shine effect */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-16 md:h-16 bg-white/20 rounded-full blur-xl"></div>
          
          {/* TÀI text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-2xl md:text-5xl font-display font-bold tracking-wider drop-shadow-2xl">
              TÀI
            </span>
            <span className="text-gray-300 text-xs md:text-sm font-semibold mt-0.5 md:mt-2">
              ≥ 11
            </span>
          </div>
        </button>

        {/* Bet amount display */}
        <div className="bet-amount-display absolute -bottom-8 md:-bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/80 border border-gray-600 rounded px-2 md:px-4 py-0.5 md:py-2 min-w-[80px] md:min-w-[120px]">
            <p className="text-gray-400 text-xs">Tổng cược</p>
            <p className="text-white font-display font-bold text-xs md:text-base">
              {formatNumber(bets?.tai?.amount || 0)}
            </p>
            <p className="text-gray-500 text-xs">
              {bets?.tai?.count || 0}
            </p>
          </div>
        </div>
      </div>

      {/* VS Separator */}
      <div className="text-dragon-gold text-xl md:text-3xl font-display font-bold animate-pulse-glow">
        VS
      </div>

      {/* XỈU - Cầu Trắng */}
      <div className="bet-ball-wrapper relative">
        <button
          onClick={() => canBet && onSelectSide('xiu')}
          disabled={!canBet || myBet}
          className={`
            relative w-28 h-28 md:w-48 md:h-48 rounded-full
            transition-all duration-300 transform
            ${selectedSide === 'xiu' ? 'scale-110' : 'scale-100'}
            ${canBet && !myBet ? 'hover:scale-105 cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-70'}
            ${myBet?.side === 'xiu' ? 'ring-2 md:ring-4 ring-dragon-gold animate-pulse-glow' : ''}
          `}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0)',
            boxShadow: selectedSide === 'xiu'
              ? '0 0 30px rgba(255, 255, 255, 0.9), inset 0 -3px 15px rgba(0, 0, 0, 0.1)'
              : '0 0 15px rgba(255, 255, 255, 0.7), inset 0 -3px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Shine effect */}
          <div className="absolute top-3 left-3 md:top-6 md:left-6 w-10 h-10 md:w-20 md:h-20 bg-white rounded-full blur-2xl opacity-60"></div>
          
          {/* XỈU text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-black text-2xl md:text-5xl font-display font-bold tracking-wider drop-shadow-lg">
              XỈU
            </span>
            <span className="text-gray-700 text-xs md:text-sm font-semibold mt-0.5 md:mt-2">
              &lt; 11
            </span>
          </div>
        </button>

        {/* Bet amount display */}
        <div className="bet-amount-display absolute -bottom-8 md:-bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/80 border border-gray-600 rounded px-2 md:px-4 py-0.5 md:py-2 min-w-[80px] md:min-w-[120px]">
            <p className="text-gray-400 text-xs">Tổng cược</p>
            <p className="text-white font-display font-bold text-xs md:text-base">
              {formatNumber(bets?.xiu?.amount || 0)}
            </p>
            <p className="text-gray-500 text-xs">
              {bets?.xiu?.count || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetPanel;
