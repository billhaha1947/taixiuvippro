// ============================================
// components/History/BetHistoryModal.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { X, History, TrendingUp, TrendingDown } from 'lucide-react';
import userService from '../../services/userService';
import { formatNumber, formatDate, formatBetSide } from '../../utils/formatters';

const BetHistoryModal = ({ isOpen, onClose }) => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    totalWagered: 0,
    totalWon: 0,
    netProfit: 0
  });

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await userService.getBetHistory(50);
      setBets(data);
      calculateStats(data);
    } catch (error) {
      console.error('Failed to load bet history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (betData) => {
    const totalBets = betData.length;
    const wins = betData.filter(b => b.win).length;
    const losses = totalBets - wins;
    const totalWagered = betData.reduce((sum, b) => sum + b.amount, 0);
    const totalWon = betData.reduce((sum, b) => sum + (b.payout || 0), 0);
    const netProfit = totalWon - totalWagered;

    setStats({
      totalBets,
      wins,
      losses,
      totalWagered,
      totalWon,
      netProfit,
      winRate: totalBets > 0 ? ((wins / totalBets) * 100).toFixed(1) : 0
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-casino-dark to-casino-black border-2 border-dragon-red/30 rounded-2xl shadow-neon-red max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-dragon-red to-dragon-orange p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History size={28} />
            <h2 className="text-2xl font-display font-bold">LỊCH SỬ CƯỢC</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:scale-110 transition"
          >
            <X size={28} />
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Bets */}
          <div className="bg-casino-surface border border-dragon-red/30 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Tổng số cược</p>
            <p className="text-dragon-gold font-display font-bold text-2xl">{stats.totalBets}</p>
          </div>

          {/* Win Rate */}
          <div className="bg-casino-surface border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Tỷ lệ thắng</p>
            <p className="text-green-400 font-display font-bold text-2xl">{stats.winRate}%</p>
            <p className="text-gray-500 text-xs">{stats.wins} thắng / {stats.losses} thua</p>
          </div>

          {/* Total Wagered */}
          <div className="bg-casino-surface border border-blue-500/30 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Tổng cược</p>
            <p className="text-blue-400 font-display font-bold text-xl">{formatNumber(stats.totalWagered)}</p>
          </div>

          {/* Net Profit */}
          <div className={`bg-casino-surface border rounded-xl p-4 text-center ${
            stats.netProfit >= 0 ? 'border-green-500/30' : 'border-red-500/30'
          }`}>
            <p className="text-gray-400 text-sm mb-1">Lãi/Lỗ</p>
            <p className={`font-display font-bold text-xl flex items-center justify-center gap-1 ${
              stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.netProfit >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {formatNumber(Math.abs(stats.netProfit))}
            </p>
          </div>
        </div>

        {/* Bet List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-12">
              <History size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Chưa có lịch sử cược</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className={`bg-casino-surface border-2 rounded-xl p-4 transition-all hover:scale-[1.02] ${
                    bet.win
                      ? 'border-green-500/30 hover:border-green-500/50'
                      : 'border-red-500/30 hover:border-red-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Left side - Bet info */}
                    <div className="flex items-center gap-4">
                      {/* Win/Loss indicator */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        bet.win ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {bet.win ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                      </div>

                      {/* Bet details */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-display font-bold text-lg px-3 py-1 rounded-lg ${
                            bet.side === 'tai'
                              ? 'bg-black text-white'
                              : 'bg-white text-black'
                          }`}>
                            {formatBetSide(bet.side)}
                          </span>
                          <span className="text-gray-400">
                            Vòng #{bet.round_id}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            Xúc sắc: <span className="text-white font-semibold">
                              [{bet.dice1}, {bet.dice2}, {bet.dice3}] = {bet.total}
                            </span>
                          </span>
                          <span className="text-gray-400">
                            Kết quả: <span className={`font-semibold ${
                              bet.round_result === 'tai' ? 'text-black bg-white px-2 rounded' : 'text-white bg-black px-2 rounded'
                            }`}>
                              {formatBetSide(bet.round_result)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Amount and time */}
                    <div className="text-right">
                      <div className="mb-1">
                        <span className="text-gray-400 text-sm">Cược: </span>
                        <span className="text-blue-400 font-display font-bold">
                          {formatNumber(bet.amount)}
                        </span>
                      </div>
                      {bet.win && (
                        <div className="mb-1">
                          <span className="text-gray-400 text-sm">Thắng: </span>
                          <span className="text-green-400 font-display font-bold">
                            +{formatNumber(bet.payout)}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs">
                        {formatDate(bet.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-dragon-red/30 p-4 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-dragon-red to-dragon-orange text-white font-display font-bold px-8 py-3 rounded-xl hover:scale-105 transition"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetHistoryModal;
