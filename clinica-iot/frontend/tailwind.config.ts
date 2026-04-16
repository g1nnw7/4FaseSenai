/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff88',
          dim: '#00cc6a',
          dark: '#004d29',
          glow: '#00ff8833',
        },
        dark: {
          950: '#030805',
          900: '#060f09',
          800: '#0a1a0e',
          700: '#0f2614',
          600: '#153319',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 20px #00ff8855, 0 0 40px #00ff8822',
        'neon-sm': '0 0 10px #00ff8844',
        'neon-lg': '0 0 40px #00ff8866, 0 0 80px #00ff8822',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 10px #00ff8844' },
          '50%': { boxShadow: '0 0 25px #00ff8877, 0 0 50px #00ff8833' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};