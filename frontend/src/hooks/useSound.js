// ============================================
// hooks/useSound.js - SOUND HOOK (CSS Animation Only)
// ============================================
import { useState, useCallback } from 'react';

// Sound manager chỉ log, không play thật
export const useSound = () => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  const play = useCallback((soundName) => {
    if (!muted) {
      console.log(`[Sound] Playing: ${soundName}`);
      // Trigger CSS animations instead
      document.body.classList.add(`sound-${soundName}`);
      setTimeout(() => {
        document.body.classList.remove(`sound-${soundName}`);
      }, 300);
    }
  }, [muted]);

  const stop = useCallback((soundName) => {
    console.log(`[Sound] Stopped: ${soundName}`);
  }, []);

  const setVolume = useCallback((vol) => {
    setVolumeState(vol);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
    return !muted;
  }, [muted]);

  const mute = useCallback(() => {
    setMuted(true);
  }, []);

  const unmute = useCallback(() => {
    setMuted(false);
  }, []);

  return {
    muted,
    volume,
    play,
    stop,
    setVolume,
    toggleMute,
    mute,
    unmute
  };
};
