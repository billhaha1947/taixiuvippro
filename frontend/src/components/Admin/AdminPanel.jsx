// ============================================
// components/Admin/AdminPanel.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Ban, 
  Check,
  Shield,
  Eye,
  EyeOff,
  Edit,
  RefreshCw
} from 'lucide-react';
import adminService from '../../services/adminService';
import { formatNumber } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

const AdminPanel = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [winrate, setWinrate] = useState(45);
  const [loading, setLoading] = useState(false);

  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editCoins, setEditCoins] = useState('');
  const [resetPassword, setResetPassword] = useState({ userId: null, newPassword: '' });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, winrateData] = await Promise.all([
        adminService.getStatistics(),
        adminService.getUsers(),
        adminService.getWinrate()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setWinrate(winrateData.winrate);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await adminService.unbanUser(userId);
        toast.success('User unbanned');
      } else {
        await adminService.banUser(userId);
        toast.success('User banned');
      }
      loadData();
    } catch (error) {
      toast.error('Failed to ban/unban user');
    }
  };

  const handleUpdateCoins = async () => {
    if (!editingUser || !editCoins) return;
    try {
      await adminService.updateCoins(editingUser, parseInt(editCoins));
      toast.success('Coins updated');
      setEditingUser(null);
      setEditCoins('');
      loadData();
    } catch (error) {
      toast.error('Failed to update coins');
    }
  };

  const handleResetPassword = async () => {
    if (!resetPassword.userId || !resetPassword.newPassword) return;
    try {
      await adminService.resetPassword(resetPassword.userId, resetPassword.newPassword);
      toast.success('Password reset successfully');
      setResetPassword({ userId: null, newPassword: '' });
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleUpdateWinrate = async () => {
    try {
      await adminService.updateWinrate(winrate);
      toast.success(`Winrate updated to ${winrate}%`);
    } catch (error) {
      toast.error('Failed to update winrate');
    }
  };

  if (!isOpen) return null;

  // Check if current user is admin
  if (!currentUser?.isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-casino-dark border-2 border-red-500 rounded-2xl p-8 text-center">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-display font-bold text-red-500 mb-2">
            ACCESS DENIED
          </h2>
          <p className="text-gray-400 mb-6">You don't have admin permissions</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-casino-dark to-casino-black border-2 border-dragon-gold rounded-2xl shadow-neon-gold">
          {/* Header */}
          <div className="bg-gradient-to-r from-dragon-gold via-dragon-orange to-dragon-red p-6 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={32} className="text-black" />
              <h1 className="text-3xl font-display font-bold text-black">ADMIN PANEL</h1>
            </div>
            <button
              onClick={onClose}
              className="bg-black/20 hover:bg-black/40 text-black px-4 py-2 rounded-lg transition"
            >
              CLOSE
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-dragon-gold/30">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-6 py-4 font-display font-bold transition ${
                activeTab === 'stats'
                  ? 'bg-dragon-gold/20 text-dragon-gold border-b-2 border-dragon-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={20} />
              STATISTICS
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-4 font-display font-bold transition ${
                activeTab === 'users'
                  ? 'bg-dragon-gold/20 text-dragon-gold border-b-2 border-dragon-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={20} />
              USERS
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-4 font-display font-bold transition ${
                activeTab === 'settings'
                  ? 'bg-dragon-gold/20 text-dragon-gold border-b-2 border-dragon-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={20} />
              SETTINGS
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <>
                {/* Statistics Tab */}
                {activeTab === 'stats' && stats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-casino-surface border-2 border-blue-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Users size={24} className="text-blue-400" />
                          <h3 className="text-gray-400 font-semibold">Total Users</h3>
                        </div>
                        <p className="text-4xl font-display font-bold text-blue-400">
                          {stats.totalUsers}
                        </p>
                      </div>

                      <div className="bg-casino-surface border-2 border-green-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp size={24} className="text-green-400" />
                          <h3 className="text-gray-400 font-semibold">Total Rounds</h3>
                        </div>
                        <p className="text-4xl font-display font-bold text-green-400">
                          {stats.totalRounds}
                        </p>
                      </div>

                      <div className="bg-casino-surface border-2 border-purple-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign size={24} className="text-purple-400" />
                          <h3 className="text-gray-400 font-semibold">Total Bets</h3>
                        </div>
                        <p className="text-4xl font-display font-bold text-purple-400">
                          {stats.totalBets}
                        </p>
                      </div>

                      <div className="bg-casino-surface border-2 border-dragon-gold/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign size={24} className="text-dragon-gold" />
                          <h3 className="text-gray-400 font-semibold">Total Coins</h3>
                        </div>
                        <p className="text-4xl font-display font-bold text-dragon-gold">
                          {formatNumber(stats.totalCoins)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`bg-casino-surface border-2 rounded-xl p-4 ${
                          user.banned ? 'border-red-500/30' : 'border-dragon-red/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {/* User info */}
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-xl ${
                              user.banned ? 'bg-red-500/20 text-red-400' : 'bg-dragon-gold/20 text-dragon-gold'
                            }`}>
                              {user.username[0].toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{user.username}</h3>
                              <p className="text-gray-400 text-sm">{user.email || 'No email'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-dragon-gold font-display font-bold">
                                  {formatNumber(user.coins)} coins
                                </span>
                                {user.banned && (
                                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-semibold">
                                    BANNED
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {/* Edit Coins */}
                            {editingUser === user.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editCoins}
                                  onChange={(e) => setEditCoins(e.target.value)}
                                  placeholder="New coins"
                                  className="bg-casino-black border border-dragon-gold rounded px-3 py-2 text-white w-32"
                                />
                                <button
                                  onClick={handleUpdateCoins}
                                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingUser(null);
                                    setEditCoins('');
                                  }}
                                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingUser(user.id);
                                  setEditCoins(user.coins.toString());
                                }}
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                                title="Edit Coins"
                              >
                                <Edit size={20} />
                              </button>
                            )}

                            {/* Ban/Unban */}
                            <button
                              onClick={() => handleBanUser(user.id, user.banned)}
                              className={`p-2 rounded transition ${
                                user.banned
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                              title={user.banned ? 'Unban User' : 'Ban User'}
                            >
                              {user.banned ? <Check size={20} /> : <Ban size={20} />}
                            </button>

                            {/* Reset Password */}
                            <button
                              onClick={() => setResetPassword({ userId: user.id, newPassword: '' })}
                              className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition"
                              title="Reset Password"
                            >
                              <RefreshCw size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    {/* Winrate Control */}
                    <div className="bg-casino-surface border-2 border-dragon-gold/30 rounded-xl p-6">
                      <h3 className="text-dragon-gold font-display font-bold text-xl mb-4">
                        WINRATE CONTROL
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Điều chỉnh tỷ lệ thắng của người chơi (0% = nhà cái luôn thắng, 100% = người chơi luôn thắng)
                      </p>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={winrate}
                          onChange={(e) => setWinrate(parseInt(e.target.value))}
                          className="flex-1 h-2 bg-casino-dark rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #ff0000 0%, #ffd700 ${winrate}%, #1a1a1a ${winrate}%, #1a1a1a 100%)`
                          }}
                        />
                        <span className="text-dragon-gold font-display font-bold text-3xl w-20 text-center">
                          {winrate}%
                        </span>
                        <button
                          onClick={handleUpdateWinrate}
                          className="bg-gradient-to-r from-dragon-red to-dragon-orange text-white font-display font-bold px-6 py-3 rounded-lg hover:scale-105 transition"
                        >
                          UPDATE
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Reset Password Modal */}
        {resetPassword.userId && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-10">
            <div className="bg-casino-dark border-2 border-dragon-gold rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-dragon-gold font-display font-bold text-xl mb-4">
                RESET PASSWORD
              </h3>
              <input
                type="text"
                value={resetPassword.newPassword}
                onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                placeholder="New password (min 6 characters)"
                className="w-full bg-casino-black border border-dragon-gold rounded px-4 py-3 text-white mb-4"
                minLength={6}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleResetPassword}
                  disabled={resetPassword.newPassword.length < 6}
                  className="flex-1 bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600 transition disabled:opacity-50"
                >
                  RESET
                </button>
                <button
                  onClick={() => setResetPassword({ userId: null, newPassword: '' })}
                  className="flex-1 bg-gray-500 text-white font-bold py-3 rounded hover:bg-gray-600 transition"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
