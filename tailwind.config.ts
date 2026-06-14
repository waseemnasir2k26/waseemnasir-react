import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        ink2: "#0F0F12",
        line: "rgba(255,255,255,0.08)",
        chalk: "#EDEDED",
        mute: "#8A8A92",
        accent: "#6D5EF6",
        accent2: "#A78BFA",
        amber: "#F5B544",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        display: [
          "clamp(2.7rem, 7vw + 1rem, 5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.035em" },
        ],
        "h2-fluid": [
          "clamp(2rem, 4vw + 0.5rem, 3.75rem)",
          { lineHeight: "1.03", letterSpacing: "-0.025em" },
        ],
        lead: ["clamp(1.05rem, 1vw + 0.9rem, 1.3rem)", { lineHeight: "1.6" }],
      },
      maxWidth: { shell: "1200px" },
    },
  },
  plugins: [],
};
export default config;
