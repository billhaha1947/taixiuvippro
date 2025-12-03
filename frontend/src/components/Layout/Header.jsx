// ============================================
// components/Layout/Header.jsx
// ============================================
import React from 'react';
import { ArrowLeft, HelpCircle, Settings, Bell, Menu, Volume2, VolumeX, History, Shield } from 'lucide-react';

const Header = ({ user, onToggleSound, isSoundMuted, onOpenHistory, onOpenAdmin }) => {
  return (
    <header className="bg-gradient-to-r from-casino-black via-casino-dark to-casino-black border-b-2 border-dragon-red/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left icons */}
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-dragon-red transition p-2 rounded-lg hover:bg-casino-surface">
            <ArrowLeft size={20} />
          </button>
          <button className="text-gray-400 hover:text-dragon-red transition p-2 rounded-lg hover:bg-casino-surface">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Center logo */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-dragon-red via-dragon-orange to-dragon-gold">
            DRAGON FIRE
          </h1>
          <p className="text-dragon-gold text-xs md:text-sm font-display">CASINO VIP</p>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSound}
            className="text-gray-400 hover:text-dragon-red transition p-2 rounded-lg hover:bg-casino-surface"
            title="Toggle Sound"
          >
            {isSoundMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button 
            onClick={onOpenHistory}
            className="text-gray-400 hover:text-dragon-gold transition p-2 rounded-lg hover:bg-casino-surface"
            title="Bet History"
          >
            <History size={20} />
          </button>
          {user?.isAdmin && (
            <button 
              onClick={onOpenAdmin}
              className="text-gray-400 hover:text-dragon-gold transition p-2 rounded-lg hover:bg-casino-surface"
              title="Admin Panel"
            >
              <Shield size={20} />
            </button>
          )}
          <button className="text-gray-400 hover:text-dragon-red transition p-2 rounded-lg hover:bg-casino-surface relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-dragon-red rounded-full animate-pulse"></span>
          </button>
          <button className="text-gray-400 hover:text-dragon-red transition p-2 rounded-lg hover:bg-casino-surface">
            <Settings size={20} />
          </button>
          <button className="text-gray-400 hover:text-dragon-red transition p-2 rounded-lg hover:bg-casino-surface">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
