// ============================================
// components/Game/ActionButtons.jsx
// ============================================
import React from 'react';
import { Coins, Check, X } from 'lucide-react';

const ActionButtons = ({ 
  onAllIn, 
  onConfirm, 
  onCancel, 
  disabled,
  hasSelection 
}) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      {/* ALL-IN Button */}
      <button
        onClick={onAllIn}
        disabled={disabled}
        className="
          group relative px-8 py-4 rounded-xl font-display font-bold text-lg
          bg-gradient-to-r from-purple-600 to-purple-800
          hover:from-purple-500 hover:to-purple-700
          border-2 border-purple-400
          text-white shadow-xl
          transform transition-all duration-200
          hover:scale-105 hover:shadow-2xl
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          flex items-center gap-2
        "
        style={{
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
        }}
      >
        <Coins className="group-hover:animate-pulse-glow" size={24} />
        <span>TẤT TAY</span>
      </button>

      {/* CONFIRM Button */}
      <button
        onClick={onConfirm}
        disabled={disabled || !hasSelection}
        className="
          group relative px-12 py-4 rounded-xl font-display font-bold text-xl
          bg-gradient-to-r from-dragon-red to-dragon-orange
          hover:from-dragon-orange hover:to-dragon-red
          border-2 border-dragon-gold
          text-white shadow-xl
          transform transition-all duration-200
          hover:scale-110 hover:shadow-2xl
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          flex items-center gap-2
        "
        style={{
          boxShadow: disabled || !hasSelection 
            ? 'none' 
            : '0 0 30px rgba(255, 0, 0, 0.8)'
        }}
      >
        <Check className="group-hover:animate-pulse-glow" size={28} />
        <span>ĐẶT CƯỢC</span>
      </button>

      {/* CANCEL Button */}
      <button
        onClick={onCancel}
        disabled={disabled || !hasSelection}
        className="
          group relative px-8 py-4 rounded-xl font-display font-bold text-lg
          bg-gradient-to-r from-gray-600 to-gray-800
          hover:from-gray-500 hover:to-gray-700
          border-2 border-gray-400
          text-white shadow-xl
          transform transition-all duration-200
          hover:scale-105 hover:shadow-2xl
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          flex items-center gap-2
        "
      >
        <X size={24} />
        <span>HỦY</span>
      </button>
    </div>
  );
};

export default ActionButtons;
