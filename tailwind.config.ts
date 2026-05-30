import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          900: "#05070A",
          800: "#0A0E14",
          700: "#0F141B",
          card: "#0C1117",
          elev: "#10161E",
        },
        line: "#1A2230",
        ink: {
          100: "#E6F1F7",
          200: "#A9B6C4",
          300: "#6B7A8C",
          400: "#475263",
        },
        brand: {
          DEFAULT: "#22E1D9",
          cyan: "#22E1D9",
          teal: "#0AB3A7",
          deep: "#066F6A",
          glow: "rgba(34,225,217,0.35)",
        },
        good: "#3DDC97",
        bad: "#FF5C7A",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,225,217,0.18), 0 8px 30px -10px rgba(34,225,217,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -16px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(135deg, #22E1D9 0%, #0AB3A7 100%)",
        "grid-faint":
          "linear-gradient(rgba(34,225,217,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,225,217,0.05) 1px, transparent 1px)",
      },
      borderRadius: {
        xl2: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
