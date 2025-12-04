// ============================================
// components/Game/GameArena.jsx - HOÀN CHỈNH VỚI HISTORY BAR + RESPONSIVE
// ============================================
import React from 'react';
import DiceTable from './DiceTable';
import BetPanel from './BetPanel';
import ChipSelector from './ChipSelector';
import ActionButtons from './ActionButtons';
import Timer from './Timer';
import RoundCounter from './RoundCounter';
import ResultHistoryBar from './ResultHistoryBar';

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
  // Loading state - khi chưa có gameState
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dragon-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dragon-gold font-display text-lg md:text-xl">Đang kết nối...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dragon-red/5 via-transparent to-dragon-orange/5"></div>
      <div className="absolute top-0 left-0 w-48 md:w-96 h-48 md:h-96 bg-dragon-red/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-dragon-orange/10 rounded-full blur-3xl"></div>

      {/* Content - Thêm game-arena class cho responsive */}
      <div className="game-arena relative z-10 max-w-7xl mx-auto px-1 md:px-4 py-2 md:py-8">
        {/* Top bar - Timer and Round - Thêm top-bar-container class */}
        <div className="top-bar-container flex flex-col md:flex-row justify-between items-center mb-2 md:mb-8 gap-1 md:gap-4">
          {/* Round Counter - Left on desktop, top on mobile */}
          <div className="order-2 md:order-1">
            <div className="round-counter">
              <RoundCounter roundNumber={gameState.roundNumber} />
            </div>
          </div>
          
          {/* Timer - Center on both */}
          <div className="order-1 md:order-2">
            <div className="timer-display">
              <Timer timer={gameState.timer} phase={gameState.phase} />
            </div>
          </div>
          
          {/* Spacer for balance on desktop */}
          <div className="w-24 md:w-48 order-3 hidden md:block"></div>
        </div>

        {/* Main game area */}
        <div className="space-y-2 md:space-y-6">
          {/* Dice table */}
          <DiceTable
            dice={gameState.dice}
            gamePhase={gameState.phase}
            total={gameState.total}
            result={gameState.result}
          />

          {/* ========== HISTORY BAR - ĐÚNG VỊ TRÍ NHƯ HÌNH + RESPONSIVE CLASS ========== */}
          <div className="history-bar-container">
            <ResultHistoryBar />
          </div>

          {/* Bet panel with black/white balls - Thêm bet-ball-container class */}
          <div className="bet-ball-container">
            <BetPanel
              selectedSide={selectedSide}
              onSelectSide={onSelectSide}
              bets={gameState.bets}
              canBet={canBet}
              myBet={myBet}
            />
          </div>

          {/* Chip selector - Thêm chip-selector class */}
          <div className="chip-selector">
            <ChipSelector
              selectedAmount={betAmount}
              onSelectAmount={onSelectAmount}
            />
          </div>

          {/* Action buttons - Thêm action-buttons class */}
          <div className="action-buttons">
            <ActionButtons
              onAllIn={() => onAllIn(user.coins)}
              onConfirm={onConfirm}
              onCancel={onCancel}
              disabled={!canBet}
              hasSelection={selectedSide && betAmount > 0}
            />
          </div>

          {/* Current bet info - Thêm my-bet-info class */}
          {myBet && (
            <div className="my-bet-info text-center bg-dragon-gold/10 border border-dragon-gold rounded-lg md:rounded-xl px-2 md:px-6 py-1 md:py-3 max-w-md mx-auto animate-pulse-glow">
              <p className="text-dragon-gold font-display font-bold text-xs md:text-lg">
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
