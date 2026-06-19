import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08080A",
        ink2: "#0E0E12",
        surface: "#121119",
        line: "rgba(255,255,255,0.08)",
        chalk: "#EDEDED",
        mute: "#8A8A92",
        accent: "#7B6CFF",
        accent2: "#B7AAFF",
        gold: "#F4C062",
        goldsoft: "#7A6A3E",
        amber: "#F5B544",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        mega: [
          "clamp(3.1rem, 8.5vw + 1rem, 7rem)",
          { lineHeight: "0.92", letterSpacing: "-0.045em" },
        ],
        display: [
          "clamp(2.7rem, 7vw + 1rem, 5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.04em" },
        ],
        "h2-fluid": [
          "clamp(2.1rem, 4vw + 0.5rem, 3.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em" },
        ],
        "h3-fluid": [
          "clamp(1.25rem, 1.2vw + 0.95rem, 1.6rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em" },
        ],
        lead: [
          "clamp(1.08rem, 1vw + 0.92rem, 1.35rem)",
          { lineHeight: "1.62" },
        ],
        label: ["0.7rem", { lineHeight: "1", letterSpacing: "0.2em" }],
      },
      maxWidth: { shell: "1200px" },
    },
  },
  plugins: [],
};
export default config;
