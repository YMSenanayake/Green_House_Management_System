/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#ffc727",
        // primary: "#4fbf8b",
        dark: "#111111"
      },

      container: {
        center: true,
        padding: {
          default: "1rem",
          sm: "3rem"
        }, 

      }
    },
  },
  plugins: [],
}