import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        brew: {
          brown:  "#4A2C17",
          latte:  "#C9A87C",
          cream:  "#F5EFE6",
          steam:  "#EAE0D5",
        },
      },
    },
  },
  plugins: [],
};

export default config;
