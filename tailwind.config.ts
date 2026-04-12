import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rova:    ["Rova", "system-ui", "sans-serif"],
        lora:    ["Lora", "Georgia", "serif"],
        raleway: ["Raleway", "system-ui", "sans-serif"],
        sans:    ["Raleway", "system-ui", "sans-serif"],
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
          brown:    "var(--brew-walnut)",
          latte:    "var(--brew-accent)",
          steam:    "var(--brew-offwhite)",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card:       "0 1px 2px rgba(61,31,13,0.04), 0 4px 16px rgba(61,31,13,0.09)",
        "card-md":  "0 2px 6px rgba(61,31,13,0.06), 0 10px 28px rgba(61,31,13,0.12)",
        "card-lg":  "0 4px 12px rgba(61,31,13,0.08), 0 20px 48px rgba(61,31,13,0.16)",
        walnut:     "0 6px 24px rgba(61,31,13,0.30)",
        "walnut-sm":"0 3px 12px rgba(61,31,13,0.22)",
        glass:      "0 1px 2px rgba(61,31,13,0.04), 0 4px 16px rgba(61,31,13,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        phone:      "0 32px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3)",
        glow:       "0 0 0 3px rgba(61,31,13,0.10)",
      },
      keyframes: {
        swipe_left: {
          "0%":   { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(-160%) rotate(-22deg)", opacity: "0" },
        },
        swipe_right: {
          "0%":   { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(160%) rotate(22deg)", opacity: "0" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.93)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        popIn: {
          "0%":   { opacity: "0", transform: "scale(0.7)" },
          "70%":  { transform: "scale(1.06)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        swipe_left:    "swipe_left 0.32s ease-in forwards",
        swipe_right:   "swipe_right 0.32s ease-in forwards",
        "fade-in-up":  "fadeInUp 0.45s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":     "fadeIn 0.3s ease both",
        "slide-up":    "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in":    "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both",
        shimmer:       "shimmer 1.6s linear infinite",
        "pop-in":      "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;
