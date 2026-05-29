/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
          800: "#312E81",
          900: "#1E1B4B"
        },
        accent: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95"
        },
        "cyan-accent": {
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2"
        },
        "slate-custom": {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A"
        }
      },
      maxWidth: { app: "1400px" },
      boxShadow: {
        "sm-soft": "0 2px 8px rgba(15, 23, 42, 0.05)",
        "md-soft": "0 8px 24px rgba(15, 23, 42, 0.08)",
        "lg-soft": "0 16px 40px rgba(15, 23, 42, 0.12)",
        "elevation-1": "0 4px 14px rgba(79, 70, 229, 0.2)",
        "elevation-2": "0 8px 28px rgba(79, 70, 229, 0.28)"
      },
      borderRadius: { card: "20px" },
      transitionDuration: { DEFAULT: "200ms" }
    }
  },
  plugins: []
};
