import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rova: ["Rova", "system-ui", "sans-serif"],
        lora: ["Lora", "Georgia", "serif"],
        raleway: ["Raleway", "system-ui", "sans-serif"],
        sans: ["Raleway", "system-ui", "sans-serif"],
      },
      colors: {
        brew: {
          walnut:   "var(--brew-walnut)",
          body:     "var(--brew-body)",
          midbrown: "var(--brew-midbrown)",
          khaki:    "var(--brew-khaki)",
          accent:   "var(--brew-accent)",
          beige:    "var(--brew-beige)",
          cream:    "var(--brew-cream)",
          offwhite: "var(--brew-offwhite)",
          // legacy
          brown:    "var(--brew-walnut)",
          latte:    "var(--brew-accent)",
          steam:    "var(--brew-offwhite)",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card:  "0 2px 12px rgba(38,56,39,0.10)",
        phone: "0 32px 64px rgba(0,0,0,0.5)",
      },
      keyframes: {
        swipe_left: {
          "0%":   { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(-150%) rotate(-20deg)", opacity: "0" },
        },
        swipe_right: {
          "0%":   { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(150%) rotate(20deg)", opacity: "0" },
        },
      },
      animation: {
        swipe_left:  "swipe_left 0.32s ease-in forwards",
        swipe_right: "swipe_right 0.32s ease-in forwards",
      },
    },
  },
  plugins: [],
};

export default config;
