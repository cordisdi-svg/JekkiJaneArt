import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        indikazka: ['IndiKazka', 'sans-serif'],
        abibas: ['Abibas', 'sans-serif'],
        fontatica: ['Fontatica4F', 'sans-serif'],
        negrita: ['NegritaPro', 'sans-serif'],
        froh: ['FROH', 'sans-serif'],
        ravenholm: ['RavenholmBold', 'sans-serif'],
        comfortaa: ['Comfortaa', 'sans-serif'],
        'comfortaa-light': ['Comfortaa-Light', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        'bg-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'bg-scale': 'bg-scale 10s ease-in-out infinite',
      }
    }
  },
  plugins: []
};

export default config;
