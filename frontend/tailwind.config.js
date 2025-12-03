/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dragon-red': '#ff0000',
        'dragon-gold': '#ffd700',
        'dragon-orange': '#ff4500',
        'casino-black': '#0a0a0a',
        'casino-dark': '#1a1a1a',
        'casino-surface': '#2a2a2a',
        'tai-black': '#000000',
        'xiu-white': '#ffffff',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(255, 0, 0, 0.8)',
        'neon-gold': '0 0 20px rgba(255, 215, 0, 0.8)',
        'neon-white': '0 0 20px rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'dice-shake': 'dice-shake 0.5s ease-in-out infinite',
        'dice-spin': 'dice-spin 2s linear',
        'win-flash': 'win-flash 0.5s ease-in-out 3',
        'coin-count': 'coin-count 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 20px currentColor)' },
        },
        'dice-shake': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg) translateX(-5px)' },
          '75%': { transform: 'rotate(10deg) translateX(5px)' },
        },
        'dice-spin': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'rotateX(720deg) rotateY(720deg)' },
        },
        'win-flash': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        'coin-count': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
