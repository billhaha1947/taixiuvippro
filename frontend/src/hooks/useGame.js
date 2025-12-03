// ============================================
// hooks/useGame.js - GAME HOOK
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { GAME_PHASES } from '../utils/constants';
import soundManager from '../utils/soundManager';

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
      soundManager.play('chip-place');
    };

    // Listen for bet errors
    const handleBetError = (error) => {
      console.error('Bet error:', error);
      alert(error.message || 'Failed to place bet');
    };

    // Listen for user updates (coins change)
    const handleUserUpdate = (data) => {
      // Update user coins in parent component
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
      soundManager.play('dice-roll');
    }

    if (gameState.phase === GAME_PHASES.RESULT) {
      soundManager.stop('dice-roll');
      soundManager.play('dice-slam');
      setLastResult(gameState.result);

      // Check if user won
      if (myBet && myBet.side === gameState.result) {
        setTimeout(() => {
          soundManager.play('win');
        }, 500);
      } else if (myBet) {
        setTimeout(() => {
          soundManager.play('lose');
        }, 500);
      }
    }

    // Reset bet when new round starts
    if (gameState.phase === GAME_PHASES.OPEN && myBet) {
      setMyBet(null);
      setSelectedSide(null);
      setBetAmount(0);
    }

    // Play countdown sound when timer is low
    if (gameState.phase === GAME_PHASES.OPEN && gameState.timer === 5) {
      soundManager.play('countdown');
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
