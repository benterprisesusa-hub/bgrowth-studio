/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--color-brand-500) / <alpha-value>)',
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          200: 'rgb(var(--color-brand-200) / <alpha-value>)',
          300: 'rgb(var(--color-brand-300) / <alpha-value>)',
          400: 'rgb(var(--color-brand-400) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)',
          600: 'rgb(var(--color-brand-600) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)',
          800: 'rgb(var(--color-brand-800) / <alpha-value>)',
          900: 'rgb(var(--color-brand-900) / <alpha-value>)',
        },
        navy: {
          DEFAULT: '#0B1D3A',
          50: '#F2F4F8',
          100: '#E3E7EF',
          200: '#B9C3D6',
          300: '#8C9BBB',
          400: '#5C6E93',
          500: '#374A72',
          600: '#243A61',
          700: '#172B4D',
          800: '#101E3A',
          900: '#0B1D3A',
        },
        success: {
          DEFAULT: '#16A34A',
          bg: '#EAF7EF',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 29, 58, 0.04), 0 4px 16px rgba(11, 29, 58, 0.06)',
        cardHover: '0 2px 4px rgba(11, 29, 58, 0.06), 0 8px 24px rgba(11, 29, 58, 0.08)',
      },
    },
  },
  plugins: [],
};
