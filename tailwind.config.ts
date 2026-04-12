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
        "wb-bg": "#050A14",
        "wb-bg-alt": "#080E1C",
        "wb-surface": "#0D1829",
        "wb-blue": "#1C58BC",
        "wb-blue-deep": "#032791",
        "wb-blue-soft": "#3A6EC7",
        "wb-teal": "#4A9B8E",
        "wb-teal-soft": "#7EB8B1",
        "wb-mauve": "#9C6487",
        "wb-cream": "#C4B9AA",
        "wb-sand": "#DDD5C8",
        "wb-text": "#EEF2F7",
        "wb-text-muted": "#8FA8C4"
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'sans-serif']
      },
      borderRadius: {
        card: "12px",
        "card-sm": "8px",
        "card-lg": "16px"
      },
      boxShadow: {
        "wb-card": "0 24px 60px rgba(0,0,0,0.18)",
        "wb-card-hover": "0 32px 72px rgba(0,0,0,0.28)",
        "wb-input-focus": "0 0 0 3px rgba(28,88,188,0.22)"
      }
    },
  },
  plugins: [],
};
export default config;
