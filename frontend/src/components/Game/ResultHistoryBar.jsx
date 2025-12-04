// ============================================
// components/Game/ResultHistoryBar.jsx - RESPONSIVE OPTIMIZED
// ============================================
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import gameService from '../../services/gameService';

const ResultHistoryBar = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  // Listen for new game results
  useEffect(() => {
    const handleNewResult = (event) => {
      const result = event.detail;
      addResult(result);
    };

    window.addEventListener('newGameResult', handleNewResult);
    
    return () => {
      window.removeEventListener('newGameResult', handleNewResult);
    };
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await gameService.getHistory(12); // Lấy 10 vòng gần nhất
      // Reverse để mới nhất ở bên phải
      setHistory(data.reverse());
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Thêm kết quả mới vào history
  const addResult = (result) => {
    setHistory(prev => {
      const newHistory = [...prev, result];
      // Chỉ giữ 10 kết quả gần nhất
      if (newHistory.length > 10) {
        newHistory.shift(); // Xóa phần tử đầu tiên (cũ nhất)
      }
      return newHistory;
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-2 md:mb-6">
      <div className="bg-gradient-to-r from-casino-black via-casino-dark to-casino-black border-2 border-dragon-red/30 rounded-lg md:rounded-xl p-2 md:p-4 shadow-neon-red">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5 md:mb-3">
          <h3 className="text-dragon-gold font-display font-bold text-xs md:text-sm">
            LỊCH SỬ 10 VÒNG GẦN NHẤT
          </h3>
          <button
            onClick={loadHistory}
            disabled={loading}
            className="text-gray-400 hover:text-dragon-gold transition p-1 rounded hover:bg-casino-surface disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw size={14} className={`md:w-4 md:h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* History balls */}
        <div className="flex gap-1 md:gap-2 items-center justify-center flex-wrap min-h-[32px] md:min-h-[48px]">
          {loading ? (
            <div className="text-gray-500 text-xs md:text-sm">Đang tải...</div>
          ) : history.length === 0 ? (
            <div className="text-gray-500 text-xs md:text-sm">Chưa có lịch sử</div>
          ) : (
            history.map((round, index) => (
              <div
                key={round.id || index}
                className="relative group"
              >
                {/* Ball - Thêm history-ball class */}
                <div
                  className={`
                    history-ball w-6 h-6 md:w-10 md:h-10 rounded-full
                    flex items-center justify-center
                    font-display font-bold text-xs md:text-sm
                    border md:border-2 shadow-lg
                    transition-all duration-200 hover:scale-125 cursor-pointer
                    ${round.result === 'tai'
                      ? 'bg-gradient-to-br from-gray-800 to-black text-white border-gray-600'
                      : 'bg-gradient-to-br from-white to-gray-100 text-black border-gray-300'
                    }
                  `}
                  style={{
                    boxShadow: round.result === 'tai'
                      ? '0 3px 10px rgba(0,0,0,0.6), inset 0 1px 4px rgba(255,255,255,0.15)'
                      : '0 3px 10px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {round.result === 'tai' ? 'T' : 'X'}
                </div>

                {/* Tooltip on hover - Hide on mobile */}
                <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                  <div className="bg-black/95 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-dragon-gold/30">
                    <p className="font-bold text-dragon-gold">Vòng #{round.id}</p>
                    <p className="font-semibold">
                      {round.result === 'tai' ? 'TÀI' : 'XỈU'}
                    </p>
                    <p className="text-gray-300">
                      Tổng: <span className="font-bold text-white">{round.total}</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      [{round.dice1}, {round.dice2}, {round.dice3}]
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                    <div className="border-4 border-transparent border-t-black/95"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        {history.length > 0 && (
          <div className="mt-1.5 md:mt-3 flex justify-center gap-2 md:gap-4 text-xs border-t border-dragon-red/20 pt-1.5 md:pt-2">
            <div className="flex items-center gap-1 md:gap-1.5">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-600 shadow-sm"></div>
              <span className="text-gray-400">TÀI:</span>
              <span className="text-white font-bold font-display">
                {history.filter(r => r.result === 'tai').length}
              </span>
            </div>
            <div className="w-px h-3 md:h-4 bg-dragon-red/30"></div>
            <div className="flex items-center gap-1 md:gap-1.5">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-white to-gray-100 border border-gray-300 shadow-sm"></div>
              <span className="text-gray-400">XỈU:</span>
              <span className="text-white font-bold font-display">
                {history.filter(r => r.result === 'xiu').length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultHistoryBar;
