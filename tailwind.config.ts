import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        banana: "#FFD500",
        overall: "#165DAB",
        sky: "#87CEEB",
        orange: "#FF9E00",
        ink: "#333333",
        cream: "#FFFBEA",
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "sans-serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        playful: ["var(--font-baloo)", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 50px rgba(22, 93, 171, 0.14)",
        button: "0 8px 0 #0F4785",
      },
    },
  },
  plugins: [],
};

export default config;
