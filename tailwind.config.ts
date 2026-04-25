/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← critical: use class, not media
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [],
}