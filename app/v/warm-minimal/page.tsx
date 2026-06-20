"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Instrument_Serif } from "next/font/google";

/* ============================================================
   VARIANT: warm-minimal
   "Simple-Deep / Editorial-Minimal" — restraint as differentiator.
   Cream canvas · espresso text · single oxblood accent · caramel mono.
   Staggered fade-up entrance. Animated underline CTA. No grid, no
   particles, no heavy vignette. One barely-there warm glow.

   SELF-CONTAINED — touches zero shared files, zero other variants.
   Light bg technique: fixed inset-0 z-0 cream div + html/body override,
   mirroring app/v/editorial-warm/page.tsx exactly.
   ============================================================ */

/* ─── Local font: Instrument Serif (not in global layout) ─── */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

/* ─── Palette — exact brand tokens ─── */
const CREAM = "#F4EADE";
const CREAM_SURFACE = "#F9F4EC";
const ESPRESSO = "#2B1D14";
const MUTED = "#7A6150";
const MUTED_LIGHT = "#BCA898";
const OXBLOOD = "#5A1A1A";
const CARAMEL = "#B07D4E";
const HAIRLINE = "rgba(43,29,20,0.10)";
const HAIRLINE_MED = "rgba(43,29,20,0.18)";

const CTA = "https://skynetjoe.com/discovery-call";

/* ─── Spring — deliberate slow spring, premium feel ─── */
const SP = {
  type: "spring" as const,
  stiffness: 55,
  damping: 18,
  mass: 0.9,
};

/* ─── Stagger delays ─── */
const DELAYS = {
  eyebrow: 0.12,
  rule: 0.22,
  h1line1: 0.32,
  h1line2: 0.44,
  sub: 0.58,
  proof: 0.7,
  cta: 0.82,
};

/* ─── Proof numbers — real only ─── */
const PROOF = [
  { n: "180+", l: "workflows" },
  { n: "40+", l: "sites" },
  { n: "9", l: "countries" },
];

/* ──────────────────────────────────────────────────────────────
   CTA LINK — text-link style with animated underline on hover
   ────────────────────────────────────────────────────────────── */
function CTALink({ reduce }: { reduce: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={CTA}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book a discovery call with Waseem Nasir"
      onMouseEnter={() => !reduce && setHovered(true)}
      onMouseLeave={() => !reduce && setHovered(false)}
      onFocus={() => !reduce && setHovered(true)}
      onBlur={() => !reduce && setHovered(false)}
      className="relative inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: OXBLOOD,
        textDecoration: "none",
        paddingBottom: "4px",
      }}
    >
      <span>Book a discovery call</span>
      {/* Arrow — slides right on hover */}
      <motion.span
        animate={reduce ? {} : { x: hovered ? 4 : 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        aria-hidden
        style={{ display: "inline-block" }}
      >
        &rarr;
      </motion.span>
      {/* Animated underline */}
      <motion.span
        initial={false}
        animate={reduce ? {} : { scaleX: hovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        aria-hidden
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: "1px",
          background: OXBLOOD,
          transformOrigin: "left center",
          display: "block",
          opacity: 0.7,
        }}
      />
      {/* Static baseline hairline (visible always, underline animates over it) */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: "1px",
          background: HAIRLINE_MED,
          display: "block",
        }}
      />
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────
   PAGE ROOT
   ────────────────────────────────────────────────────────────── */
export default function WarmMinimal() {
  const reduce = !!useReducedMotion();

  /* Suppress scroll progress bar that global layout mounts */
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
    if (bar) bar.style.display = "none";
    return () => {
      if (bar) bar.style.display = "";
    };
  }, []);

  return (
    <>
      {/* Override global dark body for this cream route */}
      <style>{`
        html, body {
          background: ${CREAM} !important;
          color-scheme: light !important;
        }
        /* Suppress global grain/aurora overlays */
        body > .aurora,
        body > [aria-hidden].aurora {
          display: none !important;
        }
      `}</style>

      {/* Fixed cream canvas — sits above global dark body */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: CREAM,
          /* One barely-there warm bloom — top-right corner, extremely subtle */
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 78% 8%, rgba(176,125,78,0.07), transparent 65%)",
        }}
      />

      <main
        id="main-content"
        className={instrumentSerif.variable}
        style={{
          position: "relative",
          zIndex: 10,
          color: ESPRESSO,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Hero reduce={reduce} />
        <MinimalFooter reduce={reduce} />
      </main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO — centred editorial column, staggered fade-up
   ────────────────────────────────────────────────────────────── */
function Hero({ reduce }: { reduce: boolean }) {
  /* Shared entrance variant */
  const fadeUp = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 18 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { ...SP, delay },
  });

  return (
    <section
      aria-label="Hero — Waseem Nasir"
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "clamp(5rem, 10svh, 8rem) clamp(1.5rem, 6vw, 5rem)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          /* Left-aligned — editorial, not centered. Reads premium and confident. */
        }}
      >
        {/* ── Eyebrow — mono uppercase caramel ── */}
        <motion.div {...fadeUp(DELAYS.eyebrow)}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: CARAMEL,
              display: "block",
            }}
          >
            AI &amp; Automation &middot; Building since 2019
          </span>
        </motion.div>

        {/* ── Hairline rule — draws in left-to-right ── */}
        <motion.div
          initial={reduce ? false : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            scaleX: {
              duration: reduce ? 0 : 0.9,
              delay: DELAYS.rule,
              ease: [0.76, 0, 0.24, 1],
            },
            opacity: { duration: 0.01, delay: DELAYS.rule },
          }}
          aria-hidden
          style={{
            height: "1px",
            width: "clamp(2.5rem, 6vw, 5rem)",
            background: CARAMEL,
            transformOrigin: "left center",
            marginTop: "1.5rem",
            marginBottom: "2rem",
          }}
        />

        {/* ── H1 — Instrument Serif, two lines, tight leading ── */}
        <h1
          aria-label="I make your busywork disappear."
          style={{ margin: 0, padding: 0 }}
        >
          {/* Line 1 — regular weight espresso */}
          <motion.span {...fadeUp(DELAYS.h1line1)} style={{ display: "block" }}>
            <span
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(3rem, 8.5vw, 6.5rem)",
                lineHeight: 0.93,
                letterSpacing: "-0.025em",
                color: ESPRESSO,
                display: "block",
              }}
            >
              I make your
            </span>
          </motion.span>

          {/* Line 2 — "busywork" normal + "disappear." italic oxblood — ONE accent */}
          <motion.span
            {...fadeUp(DELAYS.h1line2)}
            style={{ display: "block", marginTop: "0.08em" }}
          >
            <span
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(3rem, 8.5vw, 6.5rem)",
                lineHeight: 0.93,
                letterSpacing: "-0.025em",
                color: ESPRESSO,
                display: "block",
              }}
            >
              busywork{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: OXBLOOD,
                  /* Inherits fontFamily — Instrument Serif italic */
                }}
              >
                disappear.
              </em>
            </span>
          </motion.span>
        </h1>

        {/* ── Subline — Inter, muted, calm ── */}
        <motion.p
          {...fadeUp(DELAYS.sub)}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.95rem, 1.8vw, 1.08rem)",
            lineHeight: 1.65,
            color: MUTED,
            maxWidth: "480px",
            marginTop: "clamp(1.5rem, 3vw, 2.25rem)",
          }}
        >
          Independent founder building AI &amp; automation behind the scenes —
          the kind that captures leads, sends follow-ups, and clears your plate
          while you sleep.
        </motion.p>

        {/* ── Proof row — one quiet line ── */}
        <motion.div
          {...fadeUp(DELAYS.proof)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0 1.75rem",
            marginTop: "clamp(1.25rem, 2.5vw, 1.75rem)",
          }}
        >
          {PROOF.map((p, i) => (
            <span
              key={p.l}
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "0.35rem",
              }}
            >
              {i > 0 && (
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: "1px",
                    height: "0.7em",
                    background: HAIRLINE_MED,
                    marginRight: "1.75rem",
                    position: "relative",
                    top: "1px",
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  letterSpacing: "-0.02em",
                  color: ESPRESSO,
                  fontWeight: 500,
                }}
              >
                {p.n}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: MUTED_LIGHT,
                }}
              >
                {p.l}
              </span>
            </span>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          {...fadeUp(DELAYS.cta)}
          style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}
        >
          <CTALink reduce={reduce} />

          {/* Secondary quiet link */}
          <div style={{ marginTop: "1.1rem" }}>
            <a
              href="https://skynetjoe.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: MUTED_LIGHT,
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = MUTED)}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED_LIGHT)}
            >
              skynetjoe.com &rarr;
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER — minimal, one row, no chrome
   ────────────────────────────────────────────────────────────── */
function MinimalFooter({ reduce }: { reduce: boolean }) {
  return (
    <motion.footer
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...SP, delay: 1.05 }}
      style={{
        borderTop: `1px solid ${HAIRLINE}`,
        padding: "1.5rem clamp(1.5rem, 6vw, 5rem)",
      }}
      aria-label="Site footer"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {/* Wordmark */}
        <span
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: "0.95rem",
            color: ESPRESSO,
            letterSpacing: "-0.01em",
          }}
        >
          Waseem Nasir
        </span>

        {/* Location + mono label */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: MUTED_LIGHT,
          }}
        >
          SkynetLabs &middot; Bali &middot; &copy; 2026
        </span>
      </div>
    </motion.footer>
  );
}
