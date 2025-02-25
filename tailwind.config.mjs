/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray': {
          900: '#121826', // Main background
          800: '#1e293b', // Card background
          700: '#334155', // Input background
          600: '#475569', // Border
          500: '#64748b', // Placeholder
          400: '#94a3b8', // Secondary text
          300: '#cbd5e1', // Primary text
          200: '#e2e8f0',
          100: '#f1f5f9',
        },
        'indigo': {
          700: '#4338ca', // Hover
          600: '#4f46e5', // Primary
          500: '#6366f1', // Focus
          400: '#818cf8', // Headings
        },
      },
    },
  },
  plugins: [],
};
