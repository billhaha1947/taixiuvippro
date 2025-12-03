// ============================================
// components/Game/GameArena.jsx - Container Chính
// ============================================
import React from 'react';
import DiceTable from './DiceTable';
import BetPanel from './BetPanel';
import ChipSelector from './ChipSelector';
import ActionButtons from './ActionButtons';
import Timer from './Timer';
import RoundCounter from './RoundCounter';

const GameArena = ({ 
  gameState,
  selectedSide,
  betAmount,
  myBet,
  user,
  onSelectSide,
  onSelectAmount,
  onConfirm,
  onCancel,
  onAllIn,
  canBet
}) => {
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dragon-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dragon-gold font-display">Đang kết nối...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dragon-red/5 via-transparent to-dragon-orange/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-dragon-red/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-dragon-orange/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Top bar - Timer and Round */}
        <div className="flex justify-between items-center mb-8">
          <RoundCounter roundNumber={gameState.roundNumber} />
          <Timer timer={gameState.timer} phase={gameState.phase} />
          <div className="w-48"></div> {/* Spacer for balance */}
        </div>

        {/* Main game area */}
        <div className="space-y-8">
          {/* Dice table */}
          <DiceTable
            dice={gameState.dice}
            gamePhase={gameState.phase}
            total={gameState.total}
            result={gameState.result}
          />

          {/* Bet panel with black/white balls */}
          <BetPanel
            selectedSide={selectedSide}
            onSelectSide={onSelectSide}
            bets={gameState.bets}
            canBet={canBet}
            myBet={myBet}
          />

          {/* Chip selector */}
          <ChipSelector
            selectedAmount={betAmount}
            onSelectAmount={onSelectAmount}
          />

          {/* Action buttons */}
          <ActionButtons
            onAllIn={() => onAllIn(user.coins)}
            onConfirm={onConfirm}
            onCancel={onCancel}
            disabled={!canBet}
            hasSelection={selectedSide && betAmount > 0}
          />

          {/* Current bet info */}
          {myBet && (
            <div className="text-center bg-dragon-gold/10 border border-dragon-gold rounded-xl px-6 py-3 max-w-md mx-auto">
              <p className="text-dragon-gold font-display font-bold text-lg">
                Đã đặt {myBet.amount.toLocaleString()} vào {myBet.side === 'tai' ? 'TÀI' : 'XỈU'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameArena;
