/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-instrument)", "ui-serif", "Georgia", "Times New Roman", "serif"],
      },
      colors: {
        // Marginal Revolution green and a tint/shade scale built around it.
        mr: {
          50: "#ecfbf6",
          100: "#d2f6ea",
          200: "#a5ecd6",
          300: "#6ddebe",
          400: "#2fd2a8",
          500: "#00c79f",
          600: "#00a684",
          700: "#00836a",
          800: "#0a6553",
          900: "#0b4c3f",
        },
        ink: {
          DEFAULT: "#16191d",
          soft: "#3a3f46",
          muted: "#6b727c",
          faint: "#9aa1aa",
        },
        paper: {
          DEFAULT: "#fbfaf7",
          card: "#ffffff",
          line: "#e6e4de",
          soft: "#f3f1eb",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        search: "0 1px 2px rgba(22, 25, 29, 0.04), 0 8px 24px -12px rgba(22, 25, 29, 0.18)",
        "search-focus": "0 0 0 4px rgba(0, 199, 159, 0.22), 0 8px 24px -12px rgba(0, 199, 159, 0.35)",
        card: "0 1px 2px rgba(22, 25, 29, 0.03)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-up": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
