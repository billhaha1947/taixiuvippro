// ============================================
// components/Auth/AuthModal.jsx
// ============================================
import React, { useState } from 'react';
import { X } from 'lucide-react';

const AuthModal = ({ onLogin, onRegister, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await onRegister(formData.username, formData.password, formData.email);
      } else {
        await onLogin(formData.username, formData.password);
      }
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-casino-dark via-casino-black to-casino-dark border-2 border-dragon-red/30 rounded-2xl shadow-neon-red max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-dragon-red via-dragon-orange to-dragon-gold mb-2">
            DRAGON FIRE
          </h1>
          <p className="text-dragon-gold text-xl font-display">CASINO VIP</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-casino-surface border border-dragon-red/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dragon-red focus:shadow-neon-red transition"
              placeholder="Nhập tên đăng nhập"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          {/* Email (only for register) */}
          {isRegister && (
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Email (tùy chọn)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-casino-surface border border-dragon-red/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dragon-red focus:shadow-neon-red transition"
                placeholder="email@example.com"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-casino-surface border border-dragon-red/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dragon-red focus:shadow-neon-red transition"
              placeholder="Nhập mật khẩu"
              required
              minLength={6}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-dragon-red to-dragon-orange hover:from-dragon-orange hover:to-dragon-red text-white font-display font-bold py-4 rounded-lg shadow-neon-red hover:shadow-neon-gold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Đang xử lý...' : (isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP')}
          </button>
        </form>

        {/* Toggle register/login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-dragon-gold hover:text-dragon-orange transition"
          >
            {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>🎲 Game chỉ sử dụng xu ảo</p>
          <p>Không liên quan đến tiền thật</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
