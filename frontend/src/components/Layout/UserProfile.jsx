// ============================================
// components/Layout/UserProfile.jsx - WITH LOGOUT DROPDOWN
// ============================================
import React, { useState, useRef, useEffect } from 'react';
import { Coins, LogOut, User, TrendingUp, Settings, ChevronDown } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

const UserProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  if (!user) return null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Generate avatar với CSS
  const getAvatarColor = (username) => {
    const colors = [
      'from-red-500 to-red-700',
      'from-blue-500 to-blue-700',
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-yellow-500 to-yellow-700',
      'from-pink-500 to-pink-700',
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      onLogout();
    }
  };

  return (
    <div className="user-profile-container absolute top-20 left-4 z-10" ref={dropdownRef}>
      {/* Profile Card - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-gradient-to-br from-casino-dark to-casino-black 
          border-2 border-dragon-red/30 rounded-xl shadow-neon-red p-4
          transition-all duration-200 hover:border-dragon-gold/50
          ${isOpen ? 'border-dragon-gold/70 shadow-neon-gold' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {/* Avatar - CSS only */}
          <div className={`w-12 h-12 rounded-full border-2 border-dragon-gold bg-gradient-to-br ${getAvatarColor(user.username)} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-xl">
              {user.username[0].toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <p className="text-white font-semibold text-sm">{user.username}</p>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
            <div className="flex items-center gap-1 text-dragon-gold">
              <Coins size={16} className="animate-pulse-glow" />
              <span className="font-display font-bold">{formatNumber(user.coins)}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mt-2 bg-gradient-to-br from-casino-dark to-casino-black border-2 border-dragon-red/30 rounded-xl shadow-neon-red overflow-hidden animate-fade-in">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-dragon-red/20">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <User size={14} />
              <span>Tài khoản</span>
            </div>
            <p className="text-white font-display font-bold">{user.username}</p>
            {user.email && (
              <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
            )}
          </div>

          {/* Coins Section */}
          <div className="px-4 py-3 border-b border-dragon-red/20 bg-dragon-gold/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-dragon-gold animate-pulse-glow" />
                <span className="text-gray-300 text-sm">Số dư</span>
              </div>
              <span className="text-dragon-gold font-display font-bold text-lg">
                {formatNumber(user.coins)}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Statistics */}
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Open statistics modal
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:bg-casino-surface hover:text-dragon-gold transition-all group"
            >
              <TrendingUp size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Thống kê</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Open settings modal
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:bg-casino-surface hover:text-dragon-gold transition-all group"
            >
              <Settings size={18} className="group-hover:rotate-90 transition-transform" />
              <span className="text-sm font-medium">Cài đặt</span>
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-dragon-red/20"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}

      {/* Add animation CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
