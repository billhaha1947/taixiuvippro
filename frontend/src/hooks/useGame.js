// ============================================
// hooks/useGame.js - GAME HOOK
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { GAME_PHASES } from '../utils/constants';

export const useGame = () => {
  const { gameState, placeBet: socketPlaceBet, on, off } = useWebSocket();
  
  const [selectedSide, setSelectedSide] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [myBet, setMyBet] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    // Listen for bet confirmation
    const handleBetPlaced = (data) => {
      setMyBet(data.bet);
      // Visual feedback only
      console.log('[Game] Bet placed:', data.bet);
    };

    // Listen for bet errors
    const handleBetError = (error) => {
      console.error('Bet error:', error);
      alert(error.message || 'Failed to place bet');
    };

    // Listen for user updates (coins change)
    const handleUserUpdate = (data) => {
      console.log('[Game] User updated:', data);
    };

    on('bet_placed', handleBetPlaced);
    on('bet_error', handleBetError);
    on('user_update', handleUserUpdate);

    return () => {
      off('bet_placed', handleBetPlaced);
      off('bet_error', handleBetError);
      off('user_update', handleUserUpdate);
    };
  }, [on, off]);

  useEffect(() => {
    if (!gameState) return;

    // Handle phase changes
    if (gameState.phase === GAME_PHASES.ROLLING) {
      console.log('[Game] Rolling dice...');
    }

    if (gameState.phase === GAME_PHASES.RESULT) {
      console.log('[Game] Result:', gameState.result);
      setLastResult(gameState.result);

      // Check if user won
      if (myBet && myBet.side === gameState.result) {
        console.log('[Game] You won!');
      } else if (myBet) {
        console.log('[Game] You lost!');
      }
    }

    // Reset bet when new round starts
    if (gameState.phase === GAME_PHASES.OPEN && myBet) {
      setMyBet(null);
      setSelectedSide(null);
      setBetAmount(0);
    }

    // Countdown alert when timer is low
    if (gameState.phase === GAME_PHASES.OPEN && gameState.timer === 5) {
      console.log('[Game] 5 seconds left!');
    }
  }, [gameState, myBet]);

  const selectSide = useCallback((side) => {
    if (gameState?.phase !== GAME_PHASES.OPEN) return;
    setSelectedSide(side);
  }, [gameState]);

  const selectAmount = useCallback((amount) => {
    setBetAmount(amount);
  }, []);

  const addToBet = useCallback((amount) => {
    setBetAmount(prev => prev + amount);
  }, []);

  const confirmBet = useCallback(() => {
    if (!selectedSide || betAmount <= 0) {
      alert('Please select side and amount');
      return;
    }

    if (gameState?.phase !== GAME_PHASES.OPEN) {
      alert('Betting is closed');
      return;
    }

    socketPlaceBet(selectedSide, betAmount);
  }, [selectedSide, betAmount, gameState, socketPlaceBet]);

  const cancelBet = useCallback(() => {
    setSelectedSide(null);
    setBetAmount(0);
  }, []);

  const allIn = useCallback((userCoins) => {
    if (userCoins > 0) {
      setBetAmount(userCoins);
    }
  }, []);

  const canBet = gameState?.phase === GAME_PHASES.OPEN && !myBet;

  return {
    gameState,
    selectedSide,
    betAmount,
    myBet,
    lastResult,
    canBet,
    selectSide,
    selectAmount,
    addToBet,
    confirmBet,
    cancelBet,
    allIn
  };
};
