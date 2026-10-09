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
        cs: {
          bg: {
            DEFAULT: "#F7F8FA",
            dark: "#07111C",
          },
          surface: {
            DEFAULT: "#FFFFFF",
            dark: "#0D1B2A",
          },
          elevated: {
            DEFAULT: "#F9FAFB",
            dark: "#122235",
          },
          border: {
            DEFAULT: "#E4E7EC",
            dark: "#26384C",
          },
          green: {
            DEFAULT: "#16B878",
            light: "#E9F8F2",
            soft: "#0E3A31",
            hover: "#139e67",
            dark: "#16B878",
          },
          text: {
            primary: "#171A1F",
            secondary: "#667085",
            darkPrimary: "#F5F7FA",
            darkSecondary: "#A7B2C1",
          },
          safe: "#18A66A",
          caution: "#D99A24",
          restricted: "#D94A4A",
          info: "#2F80ED",
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
        subtle: "0 1px 2px 0 rgba(16, 24, 40, 0.04)",
        card: "0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px -1px rgba(16, 24, 40, 0.05)",
        elevated: "0 4px 6px -1px rgba(16, 24, 40, 0.06), 0 2px 4px -2px rgba(16, 24, 40, 0.04)",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "14px",
      }
    },
  },
  plugins: [],
};
export default config;
