/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple:  '#7B61FF',
          purple2: '#6244FF',
          mint:    '#00F5A0',
          yellow:  '#F9FF38',
          cyan:    '#00E5FF',
          pink:    '#FF4DCA',
          navy:    '#1D1D2E',
          gray:    '#676775',
          lavender:'#F8F9FF',
        },
        dash: {
          bg:           '#F9FAFB',
          card:         '#FFFFFF',
          primary:      '#E9340D',
          'primary-h':  '#C42B08',
          text:         '#161617',
          muted:        '#584C4C',
          accent:       '#BEE4B3',
          border:       '#E5E7EB',
          sidebar:      '#FFFFFF',
          'sidebar-h':  '#F3F4F6',
          'tag-bg':     '#FFF3F0',
          'tag-text':   '#E9340D',
        },
      },
      fontFamily: {
        sans:  ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl':  '16px',
        '3xl':  '24px',
        '4xl':  '32px',
      },
      boxShadow: {
        'card':    '0 20px 40px rgba(123,97,255,0.10)',
        'card-lg': '0 32px 64px rgba(123,97,255,0.18)',
        'glow':    '0 0 40px rgba(123,97,255,0.45)',
        'mint':    '0 0 30px rgba(0,245,160,0.40)',
        'yellow':  '0 0 30px rgba(249,255,56,0.50)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg,#7B61FF 0%,#00E5FF 100%)',
        'gradient-hero':  'linear-gradient(135deg,#F8F9FF 0%,#EDE9FF 100%)',
        'gradient-ai':    'linear-gradient(135deg,#00E5FF 0%,#7B61FF 60%,#FF4DCA 100%)',
        'gradient-mint':  'linear-gradient(135deg,#00F5A0 0%,#00E5FF 100%)',
        'gradient-dark':  'linear-gradient(135deg,#1D1D2E 0%,#2D1B69 100%)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':   'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float':       'float 4s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'draw-line':   'drawLine 2s ease forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(123,97,255,0.4)' },
          '50%':     { boxShadow: '0 0 50px rgba(123,97,255,0.8)' },
        },
        drawLine: {
          from: { strokeDashoffset: '1000' },
          to:   { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
