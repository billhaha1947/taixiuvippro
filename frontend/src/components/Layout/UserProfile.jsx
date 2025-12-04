// ============================================
// components/Layout/UserProfile.jsx - SIMPLE VERSION
// ============================================
import React from 'react';
import { Coins } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

const UserProfile = ({ user }) => {
  if (!user) return null;

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

  return (
    <div className="user-profile-container absolute top-20 left-4 bg-gradient-to-br from-casino-dark to-casino-black border-2 border-dragon-red/30 rounded-xl shadow-neon-red p-4 z-10">
      <div className="flex items-center gap-3">
        {/* Avatar - CSS only */}
        <div className={`w-12 h-12 rounded-full border-2 border-dragon-gold bg-gradient-to-br ${getAvatarColor(user.username)} flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-xl">
            {user.username[0].toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div>
          <p className="text-white font-semibold text-sm">{user.username}</p>
          <div className="flex items-center gap-1 text-dragon-gold">
            <Coins size={16} className="animate-pulse-glow" />
            <span className="font-display font-bold">{formatNumber(user.coins)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
