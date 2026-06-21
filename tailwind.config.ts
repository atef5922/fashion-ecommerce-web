import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        surface: "hsl(var(--surface))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        luxury: {
          ivory: "#f7f3ee",
          stone: "#d8cec1",
          ink: "#171717",
          clay: "#a77d62",
          burgundy: "#5d1f2e",
          olive: "#4e5a45",
          dark: "#0b0b0c",
          "dark-surface": "#111214",
          "dark-card": "#18181b",
          "dark-border": "#27272a",
          "dark-text": "#fafafa",
          "dark-secondary": "#d4d4d8",
          "dark-muted": "#a1a1aa",
          gold: "#c8a97e"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "\"Playfair Display\"", "Georgia", "serif"]
      },
      fontSize: {
        eyebrow: ["0.68rem", { lineHeight: "1.35", letterSpacing: "0.22em", fontWeight: "750" }],
        "body-sm": ["var(--type-small)", { lineHeight: "1.7" }],
        body: ["var(--type-body)", { lineHeight: "1.75" }],
        card: ["var(--type-card)", { lineHeight: "1.06" }],
        section: ["var(--type-section)", { lineHeight: "0.96" }],
        page: ["var(--type-page)", { lineHeight: "0.9" }],
        hero: ["var(--type-hero)", { lineHeight: "0.82" }]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(23, 23, 23, 0.08)"
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 22s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
