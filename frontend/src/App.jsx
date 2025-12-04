// ============================================
// App.jsx - MAIN APPLICATION WITH LOGOUT
// ============================================
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';

// Components
import AuthModal from './components/Auth/AuthModal';
import Header from './components/Layout/Header';
import UserProfile from './components/Layout/UserProfile';
import GameArena from './components/Game/GameArena';
import ChatBox from './components/Chat/ChatBox';
import BetHistoryModal from './components/History/BetHistoryModal';
import AdminPanel from './components/Admin/AdminPanel';

function App() {
  const { user, loading, login, register, logout, updateUser, isAuthenticated } = useAuth();
  const { connected } = useWebSocket();
  const { muted, toggleMute } = useSound();
  const {
    gameState,
    selectedSide,
    betAmount,
    myBet,
    canBet,
    selectSide,
    selectAmount,
    confirmBet,
    cancelBet,
    allIn
  } = useGame();

  const [showChat, setShowChat] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Update showAuth based on authentication status
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuth(true);
    } else if (isAuthenticated) {
      setShowAuth(false);
    }
  }, [isAuthenticated, loading]);

  const handleLogin = async (username, password) => {
    try {
      const data = await login(username, password);
      setShowAuth(false);
      toast.success(`Chào mừng ${data.user.username}!`);
    } catch (error) {
      toast.error(error.toString());
      throw error;
    }
  };

  const handleRegister = async (username, password, email) => {
    try {
      const data = await register(username, password, email);
      setShowAuth(false);
      toast.success(`Đăng ký thành công! Chào mừng ${data.user.username}!`);
    } catch (error) {
      toast.error(error.toString());
      throw error;
    }
  };

  // ========== LOGOUT HANDLER ==========
  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công!');
  };

  const handleConfirmBet = () => {
    try {
      confirmBet();
      toast.success(`Đã đặt ${betAmount.toLocaleString()} vào ${selectedSide === 'tai' ? 'TÀI' : 'XỈU'}`);
    } catch (error) {
      toast.error('Không thể đặt cược: ' + error.toString());
    }
  };

  const handleCancelBet = () => {
    cancelBet();
    toast.success('Đã hủy cược');
  };

  const handleAllIn = (coins) => {
    if (coins <= 0) {
      toast.error('Bạn không có đủ xu!');
      return;
    }
    allIn(coins);
    toast.success('Đã chọn tất cả xu!');
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-casino-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dragon-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dragon-gold font-display text-xl">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (showAuth || !isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-casino-black flex items-center justify-center">
          <AuthModal
            onLogin={handleLogin}
            onRegister={handleRegister}
            onClose={() => {}} // Can't close without login
          />
        </div>
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-casino-black">
      {/* Header */}
      <Header 
        user={user}
        onToggleSound={toggleMute}
        isSoundMuted={muted}
        onOpenHistory={() => setShowHistory(true)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* User Profile - PASS LOGOUT HANDLER */}
      <UserProfile 
        user={user} 
        onLogout={handleLogout}
      />

      {/* Connection status */}
      {!connected && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          ⚠️ Mất kết nối server
        </div>
      )}

      {/* Main game area */}
      <GameArena
        gameState={gameState}
        selectedSide={selectedSide}
        betAmount={betAmount}
        myBet={myBet}
        user={user}
        onSelectSide={selectSide}
        onSelectAmount={selectAmount}
        onConfirm={handleConfirmBet}
        onCancel={handleCancelBet}
        onAllIn={handleAllIn}
        canBet={canBet}
      />

      {/* Chat */}
      <ChatBox
        isOpen={showChat}
        onClose={() => setShowChat(!showChat)}
      />

      {/* Bet History Modal */}
      <BetHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        currentUser={user}
      />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #ff0000',
          },
          success: {
            iconTheme: {
              primary: '#ffd700',
              secondary: '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff0000',
              secondary: '#1a1a1a',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
