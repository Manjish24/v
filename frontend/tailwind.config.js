/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        imd: {
          dark: "#0a192f",
          navy: "#0f294a",
          blue: "#1e3a8a",
          teal: "#0284c7",
          cyan: "#06b6d4",
          amber: "#f59e0b",
          gold: "#d97706",
          light: "#f8fafc",
          surface: "#f1f5f9"
        }
      }
    }
  },
  plugins: []
};
