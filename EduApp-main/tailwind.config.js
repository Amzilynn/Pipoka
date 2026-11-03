/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'Cairo', 'sans-serif'],
        cairo: ['Cairo', 'Nunito', 'sans-serif'],
      },
      spacing: {
        '0.5': '0.125rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
      },
      colors: {
        primary: {
          DEFAULT: '#FFD93D',
          hover: '#F5C518',
        },
        accent: '#FF6B6B',
        success: '#6BCB77',
        info: '#74C7EC',
        warning: '#FF9A3C',
        magic: '#C77DFF',
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FFFBF0',
          sunken: '#F5F7F9',
        },
        text: {
          DEFAULT: '#2D3436',
          muted: '#636E72',
          subtle: '#B2BEC3',
        },
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '24px',
        xl: '40px',
        card: '32px',
        button: '50px',
      },
      boxShadow: {
        'custom-sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'custom-md': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'custom-lg': '0 16px 40px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
