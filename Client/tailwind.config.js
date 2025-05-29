// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgGreen: "#013220",
        brand: "#1db954",
        secondary: "#191414",
      },
      fontSize: {
        xxl: "2rem",
      },
      spacing: {
        128: "32rem",
      },
    },
  },
  plugins: [],
}
