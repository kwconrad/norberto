import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        "geist-sans": "var(--font-geist-sans)",
        "instrument-serif": "var(--font-instrument-serif)",
      },
    },
  },
  plugins: [],
} satisfies Config;
