/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-bg': '#111522',
        'retro-panel': '#20243A',
        'retro-panel-light': '#2C324E',
        'retro-border': '#3B4268',
        'retro-dark': '#0B0D17',
        'neon-lime': '#C8FF70',
        'lavender': '#B8A5FF',
        'amber': '#FFC857',
        'danger-red': '#FF657A',
        'cream': '#F5F0DF',
        'cream-muted': '#BDB6A2',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        vt323: ['"VT323"', 'monospace'],
        mono: ['"Space Mono"', 'monospace', 'Courier New', 'Courier'],
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px #000000',
        'pixel': '4px 4px 0px 0px #000000',
        'pixel-lg': '6px 6px 0px 0px #000000',
        'pixel-lime': '4px 4px 0px 0px #C8FF70',
        'pixel-amber': '4px 4px 0px 0px #FFC857',
        'pixel-danger': '4px 4px 0px 0px #FF657A',
        'pixel-lavender': '4px 4px 0px 0px #B8A5FF',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

