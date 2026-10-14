import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pf: {
          bg: "#0B1020",
          strip: "#0E1426",
          surface: "#121A2E",
          raised: "#19223A",
          bubble: "#1E2844",
          line: "#1E2740",
          border: "#222C45",
          chip: "#2A3553",
          strong: "#2F3B5C",
          text: "#EEF1F7",
          soft: "#C5CCDB",
          body: "#B4BDD0",
          muted: "#A3ADC2",
          faint: "#8C96AD",
          accent: "#5B8CFF",
          live: "#FFB547",
          ok: "#3DDC97",
          "on-accent": "#16203A",
        },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        plex: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        "plex-mono": ["var(--font-plex-mono)", "monospace"],
      },
      keyframes: {
        "pf-wave": {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.55)" },
        },
      },
      animation: {
        "pf-wave": "pf-wave 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
