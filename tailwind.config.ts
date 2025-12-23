import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Fizmo custom colors - matching Figma design
        fizmo: {
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7', // Main purple
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
          pink: {
            400: '#f472b6',
            500: '#ec4899', // Main pink
            600: '#db2777',
          },
          cyan: {
            400: '#22d3ee',
            500: '#06b6d4',
          },
          dark: {
            950: '#0a0e27', // Deepest background (from Figma)
            900: '#0f172a', // Dark background
            850: '#1a1f3a', // Card backgrounds (from Figma)
            800: '#1e293b', // Lighter dark
            700: '#334155',
          }
        },
      },
      backgroundImage: {
        'gradient-fizmo': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'gradient-fizmo-button': 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
      },
      boxShadow: {
        'purple-glow': '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.15)',
        'purple-glow-lg': '0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.2)',
        'card-purple': '0 8px 32px 0 rgba(168, 85, 247, 0.2)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
