import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#c9a84c",
        "gold-light": "#e0c068",
        "gold-dark": "#a8873a",
        "near-black": "#0a0a0a",
        "panel-bg": "#111111",
        "panel-border": "#222222",
        "panel-hover": "#1a1a1a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(10px) scale(0.95)" },
        },
      },
      animation: {
        pulse: "pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.25s ease-out forwards",
        "fade-out": "fade-out 0.25s ease-in forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
