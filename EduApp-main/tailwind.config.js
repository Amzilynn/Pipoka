/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'Nunito', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        bublii: {
          learn: '#2A6FB5',
          communicate: '#E84545',
          move: '#6DD58F',
          grow: '#F5A623',
          sand: '#F4E8D8',
          ink: '#2D3748',
          'ink-soft': '#6B7A8C',
          canvas: '#F4E8D8',
          card: '#FFFFFF',
        },
        module: {
          learn: '#2A6FB5',
          communicate: '#E84545',
          move: '#6DD58F',
          grow: '#F5A623',
        },
        primary: {
          DEFAULT: '#2A6FB5',
          hover: '#1e5a96',
        },
        accent: '#E84545',
        success: '#6DD58F',
        warning: '#F5A623',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '32px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
}
