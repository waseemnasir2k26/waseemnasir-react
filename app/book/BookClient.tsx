"use client";

import Link from "next/link";
import Script from "next/script";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";

/* ============================================================
   ROUTE: /book
   On-site booking path — embeds the Calendly scheduler directly
   instead of sending every CTA offsite to skynetjoe.com.
   Matches the "blueprint" design system (the live root): near-white
   canvas, jade-teal accent, ink-jade depth band.
   SELF-CONTAINED — touches zero shared files, zero other variants.
   ============================================================ */

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const body = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

/* ─── Tokens (identical to blueprint) ─── */
const C = {
  canvas: "#FBFCFD",
  surface: "#F4F8F7",
  card: "#FFFFFF",
  ink: "#0E1B1A",
  body: "#3C4744",
  mute: "#5B6764",
  hairline: "#E2EAE8",
  accent: "#117E73",
  accentDeep: "#0A3D38",
  accentTint: "#E2F1EE",
  pillInk: "#0C5F57",
  live: "#15A06B",
  onDeep: "#EAF4F1",
};
const SHADOW = {
  sm: "0 1px 2px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  md: "0 8px 24px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
};
const EASE = [0.16, 1, 0.3, 1] as const;
const CALENDLY_URL =
  "https://calendly.com/skynetlabs/schedule-a-free-consultation";
const EMAIL = "mailto:waseem@skynetjoe.com";

function Mono({
  children,
  color = C.mute,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        color,
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </span>
  );
}

/* Fade-up wrapper — opacity stays 1 at rest so static/print/screenshot
   never shows a blank band if IntersectionObserver hasn't fired yet. */
function Reveal({
  children,
  delay = 0,
  y = 20,
  reduce,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 1, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const BULLETS = [
  {
    t: "30 minutes, no pitch deck",
    d: "We walk through what your team does by hand every day and where it's actually costing you time or money.",
  },
  {
    t: "Honest fit-check",
    d: "If automation isn't worth building for you yet, I'll tell you that on the call instead of quoting anyway.",
  },
  {
    t: "You leave with a plan",
    d: "Even if you never hire me, you get a clear picture of what to fix first and roughly what it would take.",
  },
];

export default function BookClient() {
  const reduce = useReducedMotion() ?? false;

  return (
    <>
      {/*
        NOTE: widget.js (lazyOnload) scans the DOM for .calendly-inline-widget
        exactly once, on first load of this page. All current links to /book
        are plain <a> tags (full page load), so this works. Do NOT link to
        /book via next/link client-side navigation without also calling
        window.Calendly?.initInlineWidget({...}) on mount, or the embed will
        render as an empty box.
      */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <main
        id="main-content"
        className={`bk-root relative ${display.variable} ${body.variable} ${mono.variable}`}
        style={{
          background: C.canvas,
          color: C.body,
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          overflowX: "clip",
        }}
      >
        {/* ── Slim header ── */}
        <header
          className="sticky top-0 z-40"
          style={{
            height: 64,
            background: "rgba(251,252,253,0.86)",
            backdropFilter: "blur(16px) saturate(170%)",
            WebkitBackdropFilter: "blur(16px) saturate(170%)",
            borderBottom: `1px solid ${C.hairline}`,
          }}
        >
          <div className="mx-auto flex h-full max-w-[1000px] items-center justify-between px-5 sm:px-6">
            <Link href="/" className="flex flex-col leading-none">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: C.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                Waseem Nasir
              </span>
              <span
                className="font-mono"
                style={{
                  color: C.mute,
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  marginTop: 3,
                }}
              >
                FOUNDER · SKYNETLABS
              </span>
            </Link>
            <a
              href={EMAIL}
              className="hidden sm:inline-flex items-center rounded-full font-semibold"
              style={{
                background: C.card,
                color: C.accent,
                border: `1px solid ${C.hairline}`,
                fontSize: "0.85rem",
                padding: "0.5rem 1.1rem",
              }}
            >
              Email instead
            </a>
          </div>
        </header>

        {/* ── Hero + embed ── */}
        <section className="relative w-full overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: "45%",
              background:
                "radial-gradient(60% 80% at 78% 8%, rgba(17,126,115,0.07), transparent 60%), radial-gradient(40% 60% at 20% 0%, rgba(226,241,238,0.6), transparent 65%)",
            }}
          />
          <div className="relative mx-auto max-w-[900px] px-5 py-14 sm:px-6 sm:py-20">
            <Reveal reduce={reduce} className="mb-5">
              <Mono color={C.accent}>Book a call</Mono>
            </Reveal>
            <Reveal reduce={reduce} delay={0.06}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.024em",
                  color: C.ink,
                  maxWidth: "18ch",
                }}
              >
                Book a free 30-minute automation audit.
              </h1>
            </Reveal>
            <Reveal reduce={reduce} delay={0.12}>
              <p
                className="mt-5 max-w-[52ch]"
                style={{ color: C.body, fontSize: "1.05rem", lineHeight: 1.6 }}
              >
                Pick a time below. No sales script — we look at what your
                business does by hand, find where it leaks time or money, and
                decide together if automation is worth building.
              </p>
            </Reveal>

            <Reveal reduce={reduce} delay={0.16} className="mt-10">
              <div
                className="grid gap-5 sm:grid-cols-3"
                style={{ marginBottom: "2.5rem" }}
              >
                {BULLETS.map((b) => (
                  <div
                    key={b.t}
                    className="rounded-2xl p-5"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.hairline}`,
                      boxShadow: SHADOW.sm,
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "0.98rem",
                        color: C.ink,
                      }}
                    >
                      {b.t}
                    </h2>
                    <p
                      className="mt-2"
                      style={{
                        color: C.mute,
                        fontSize: "0.88rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {b.d}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal reduce={reduce} delay={0.2}>
              {/* Fixed min-height reserves the layout slot before Calendly's
                  script paints the iframe — prevents CLS on load. */}
              <div
                className="calendly-inline-widget rounded-2xl overflow-hidden"
                data-url={CALENDLY_URL}
                style={{
                  minWidth: 320,
                  minHeight: 700,
                  height: 700,
                  border: `1px solid ${C.hairline}`,
                  boxShadow: SHADOW.md,
                  background: C.card,
                }}
              />
            </Reveal>

            <Reveal reduce={reduce} delay={0.24} className="mt-8">
              <p
                className="text-center"
                style={{ color: C.mute, fontSize: "0.9rem" }}
              >
                Calendly not loading?{" "}
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bk-link"
                  style={{ color: C.accent, fontWeight: 600 }}
                >
                  Open the booking calendar directly
                </a>
                , or prefer email?{" "}
                <a
                  href={EMAIL}
                  className="bk-link"
                  style={{ color: C.accent, fontWeight: 600 }}
                >
                  Email waseem@skynetjoe.com
                </a>{" "}
                and I&apos;ll reply with times.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="relative overflow-hidden"
          style={{
            background: C.surface,
            borderTop: `2px solid ${C.accentDeep}`,
          }}
        >
          <div className="relative mx-auto max-w-[900px] px-5 py-12 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <Mono color={C.pillInk}>Built by SkynetLabs</Mono>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href="https://www.waseemnasir.com"
                  className="bk-link"
                  style={{
                    fontFamily: "var(--font-mono, ui-monospace), monospace",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.mute,
                    textDecoration: "none",
                  }}
                >
                  waseemnasir.com
                </a>
                <Mono color={C.mute} className="!tracking-[0.06em]">
                  © 2026 Waseem Nasir
                </Mono>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        .bk-link {
          text-decoration: none;
        }
        .bk-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
