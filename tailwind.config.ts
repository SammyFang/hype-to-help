import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        rally: {
          navy: "#101A3D",
          blue: "#1F6FEB",
          red: "#E83A4F",
          gold: "#FFB703",
          ice: "#F4F8FF",
          ink: "#0F172A"
        }
      },
      boxShadow: {
        "rally-card": "0 22px 60px rgba(16, 26, 61, 0.14)",
        "rally-glow": "0 18px 42px rgba(31, 111, 235, 0.2)"
      },
      backgroundImage: {
        "rally-grid":
          "linear-gradient(rgba(31,111,235,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(31,111,235,0.1) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
