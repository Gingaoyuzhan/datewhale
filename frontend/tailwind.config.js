/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 使用 class 策略切换主题
  theme: {
    extend: {
      colors: {
        // 主题感知颜色 - 使用 CSS 变量
        theme: {
          bg: {
            primary: 'var(--bg-primary)',
            secondary: 'var(--bg-secondary)',
            tertiary: 'var(--bg-tertiary)',
            panel: 'var(--bg-panel)',
            card: 'var(--bg-card)',
            hover: 'var(--bg-hover)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
            dim: 'var(--text-dim)',
          },
          border: {
            primary: 'var(--border-primary)',
            secondary: 'var(--border-secondary)',
            accent: 'var(--border-accent)',
          },
          accent: {
            primary: 'var(--accent-primary)',
            secondary: 'var(--accent-secondary)',
          },
        },
        // 保留原有颜色定义
        light: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        primary: {
          50: '#faf5ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        nebula: {
          500: '#7c3aed',
          400: '#8b5cf6',
          300: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px var(--accent-glow)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px var(--accent-glow)' },
        },
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'theme-glow': 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
}
