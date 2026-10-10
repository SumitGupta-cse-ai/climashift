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
        lamy: {
          50: "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          DEFAULT: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
          700: "#A16207",
          800: "#854D0E",
          900: "#713F12",
        },
        cs: {
          bg: {
            DEFAULT: "#F8FAFC",
            dark: "#080D1A",
          },
          surface: {
            DEFAULT: "#FFFFFF",
            dark: "#0F172A",
          },
          elevated: {
            DEFAULT: "#F1F5F9",
            dark: "#1E293B",
          },
          border: {
            DEFAULT: "#E2E8F0",
            dark: "#334155",
          },
          green: {
            DEFAULT: "#10B981",
            light: "#ECFDF5",
            soft: "#064E3B",
            hover: "#059669",
            dark: "#10B981",
          },
          text: {
            primary: "#0F172A",
            secondary: "#475569",
            darkPrimary: "#F8FAFC",
            darkSecondary: "#94A3B8",
          },
          safe: "#10B981",
          caution: "#F59E0B",
          restricted: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: [
          "'Inter'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Noto Sans Devanagari'",
          "system-ui",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
        elevated: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        tactile: "0 4px 12px 0 rgba(15, 23, 42, 0.08), 0 1px 3px 0 rgba(15, 23, 42, 0.04)",
        lamy: "0 4px 14px -2px rgba(250, 204, 21, 0.35)",
        lamyGlow: "0 0 20px -2px rgba(250, 204, 21, 0.4)",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        '2xl': "16px",
        '3xl': "20px",
      }
    },
  },
  plugins: [],
};
export default config;
