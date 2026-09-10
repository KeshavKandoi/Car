import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          DEFAULT: "#08090B", // studio black — near-black, not pure black, keeps depth in shadows
          panel: "#101216",
          line: "#1E2127",
        },
        carrera: {
          // pulled directly from the car paint itself, not a generic accent
          blue: "#4FA6E0",
          glow: "#8FD6FF",
        },
        ember: "#FF6A3D", // brake / heat accent — used sparingly, only in brake + engine chapters
        steel: {
          100: "#F2F3F5",
          300: "#C7CBD1",
          500: "#8A8F98",
          700: "#4B4F57",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.28em",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
