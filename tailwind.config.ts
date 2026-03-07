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
      }
    }
  },
  plugins: []
};

export default config;
