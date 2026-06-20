"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { Instrument_Serif } from "next/font/google";

/* ============================================================
   VARIANT: web4-warm
   "web4guru-technique · warm-editorial reskin"
   Three stacked BG layers (base gradient + grid + vignette) +
   staggered hero reveal, pill badge, gradient-clip headline,
   floating particles, proof band, short services section.

   SELF-CONTAINED — touches zero shared files, zero other variants.
   Light-bg technique: style tag overrides dark body + cream main.
   ============================================================ */

/* ─── Local font: Instrument Serif ─── */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

/* ─── Palette (brand tokens, exact) ─── */
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

/* ─── Spring presets (match editorial-warm) ─── */
const SP_GENTLE = {
  type: "spring" as const,
  stiffness: 68,
  damping: 19,
  mass: 0.8,
};

/* ─── Proof numbers (real only) ─── */
const PROOF = [
  { n: "180+", l: "Workflows built" },
  { n: "40+", l: "Sites shipped" },
  { n: "9", l: "Countries" },
  { n: "2019", l: "Building since" },
];

/* ─── Services ─── */
const SERVICES = [
  {
    index: "01",
    title: "AI & Automation Systems",
    body: "Lead capture, follow-up sequences, inbox triage, onboarding flows — built on n8n, Make, and custom code. The boring operations, handled.",
  },
  {
    index: "02",
    title: "High-Performance Web",
    body: "Next.js sites and WordPress builds that rank, convert, and integrate natively with your CRM, payment layer, and ops stack.",
  },
  {
    index: "03",
    title: "Growth Infrastructure",
    body: "Meta CAPI, WhatsApp funnels, GHL pipelines. The plumbing that turns ad spend into trackable, recoverable revenue.",
  },
];

/* ─── Floating particle data (seeded, no random flicker on re-render) ─── */
const PARTICLES = [
  { x: "12%", y: "22%", size: 2.5, dur: 7.2, delay: 0 },
  { x: "82%", y: "14%", size: 1.8, dur: 9.1, delay: 1.2 },
  { x: "67%", y: "71%", size: 2.2, dur: 8.3, delay: 0.6 },
  { x: "28%", y: "61%", size: 1.5, dur: 10.4, delay: 2.1 },
  { x: "91%", y: "44%", size: 2.0, dur: 6.8, delay: 1.7 },
  { x: "44%", y: "88%", size: 1.6, dur: 11.2, delay: 0.3 },
  { x: "7%", y: "79%", size: 2.8, dur: 8.7, delay: 3.0 },
  { x: "57%", y: "31%", size: 1.4, dur: 9.9, delay: 1.4 },
  { x: "76%", y: "58%", size: 2.0, dur: 7.5, delay: 0.9 },
];

/* ============================================================
   PAGE ROOT
   ============================================================ */
export default function Web4Warm() {
  const reduce = !!useReducedMotion();

  return (
    <>
      {/* Override global dark body for this route */}
      <style>{`
        html, body { background: ${CREAM} !important; color-scheme: light !important; }
      `}</style>

      <main
        id="main-content"
        className={`relative z-10 ${instrumentSerif.variable}`}
        style={{ background: CREAM, color: ESPRESSO, overflowX: "clip" }}
      >
        <TopBar reduce={reduce} />
        <HeroSection reduce={reduce} />
        <ProofBand />
        <ServicesSection reduce={reduce} />
        <ClosingCTA reduce={reduce} />
        <PageFooter />
      </main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   TOP BAR
   ────────────────────────────────────────────────────────────── */
function TopBar({ reduce }: { reduce: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SP_GENTLE, delay: 0.06 }}
      className="fixed inset-x-0 top-0 z-50 transition-shadow duration-300"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: scrolled
          ? "rgba(244,234,222,0.92)"
          : "rgba(244,234,222,0.78)",
        borderBottom: `1px solid ${scrolled ? HAIRLINE_MED : HAIRLINE}`,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
        {/* Wordmark */}
        <span
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: "1.05rem",
            color: ESPRESSO,
            letterSpacing: "-0.01em",
          }}
        >
          Waseem Nasir
        </span>

        {/* Nav */}
        <nav
          className="hidden items-center gap-8 sm:flex"
          aria-label="Primary navigation"
        >
          {(
            [
              ["#services", "Services"],
              ["#proof", "Track record"],
            ] as [string, string][]
          ).map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[0.64rem] uppercase tracking-[0.24em] transition-opacity hover:opacity-50"
              style={{ color: MUTED }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.64rem] uppercase tracking-[0.2em] transition-all hover:opacity-80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            color: CREAM,
            background: OXBLOOD,
            padding: "0.5rem 1.15rem",
          }}
        >
          Book a call
        </Link>
      </div>
    </motion.header>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO SECTION — three-layer BG + staggered content + particles
   ────────────────────────────────────────────────────────────── */
function HeroSection({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Hero content fades as user scrolls away
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], ["0px", "32px"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-[72px]"
      aria-label="Hero — AI and automation founder"
    >
      {/* ── LAYER 1: Base warm gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            linear-gradient(
              175deg,
              ${CREAM_SURFACE} 0%,
              ${CREAM} 38%,
              rgba(244,234,222,0.97) 62%,
              rgba(240,228,214,1) 100%
            )
          `,
        }}
      />

      {/* ── LAYER 2: Grid texture (two repeating linear-gradients) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          opacity: 0.045,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              ${ESPRESSO} 0px,
              ${ESPRESSO} 1px,
              transparent 1px,
              transparent 64px
            ),
            repeating-linear-gradient(
              90deg,
              ${ESPRESSO} 0px,
              ${ESPRESSO} 1px,
              transparent 1px,
              transparent 64px
            )
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── LAYER 3: Radial + linear vignette mask ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(
              ellipse 80% 70% at 50% 50%,
              transparent 30%,
              rgba(43,29,20,0.055) 70%,
              rgba(43,29,20,0.12) 100%
            ),
            linear-gradient(
              180deg,
              rgba(43,29,20,0.04) 0%,
              transparent 18%,
              transparent 78%,
              rgba(43,29,20,0.06) 100%
            )
          `,
        }}
      />

      {/* ── Optional: warm caramel glow blob (low opacity) ── */}
      <div
        className="absolute pointer-events-none"
        aria-hidden
        style={{
          top: "15%",
          right: "8%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(176,125,78,0.07) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        aria-hidden
        style={{
          bottom: "10%",
          left: "4%",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(90,26,26,0.055) 0%, transparent 70%)`,
          filter: "blur(48px)",
        }}
      />

      {/* ── Floating particles ── */}
      {!reduce &&
        PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            aria-hidden
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              background: CARAMEL,
              opacity: 0.28,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.18, 0.35, 0.18],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* ── Hero content ── */}
      <motion.div
        style={{
          opacity: reduce ? 1 : heroFade,
          y: reduce ? 0 : heroY,
        }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-24 text-center sm:px-10"
      >
        {/* Pill badge */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.1,
          }}
          className="mb-10 inline-flex items-center gap-2.5 rounded-full border px-4 py-2"
          style={{
            borderColor: HAIRLINE_MED,
            background: CREAM_SURFACE,
          }}
        >
          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full"
              style={{ background: CARAMEL, opacity: 0.5 }}
              animate={
                reduce ? {} : { scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }
              }
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: CARAMEL }}
            />
          </span>
          <span
            className="font-mono text-[0.64rem] uppercase tracking-[0.18em]"
            style={{ color: MUTED }}
          >
            AI &amp; Automation Systems
          </span>
        </motion.div>

        {/* H1 — Instrument Serif, gradient-clip accent phrase */}
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.85,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.18,
          }}
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: ESPRESSO,
          }}
        >
          The busywork that&apos;s
          <br />
          draining your business?
          <br />
          <span
            style={{
              display: "inline-block",
              backgroundImage: `linear-gradient(110deg, ${OXBLOOD} 0%, ${CARAMEL} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              fontStyle: "italic",
            }}
          >
            It quietly disappears.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.33,
          }}
          className="mt-8 max-w-2xl leading-relaxed"
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.12rem)",
            color: MUTED,
          }}
        >
          Independent founder building AI &amp; automation systems for growing
          companies across nine countries — the quiet machinery that captures
          the lead, sends the follow-up, and books the call.
        </motion.p>

        {/* Dual CTA row */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.48,
          }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {/* Primary CTA */}
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl font-mono text-[0.66rem] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: OXBLOOD,
              color: CREAM,
              paddingTop: "1.25rem",
              paddingBottom: "1.25rem",
              paddingLeft: "2.25rem",
              paddingRight: "2.25rem",
              boxShadow: `0 8px 32px -8px rgba(90,26,26,0.35), 0 2px 8px -2px rgba(90,26,26,0.18)`,
            }}
          >
            Book a discovery call &rarr;
          </Link>

          {/* Secondary outline */}
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-xl border font-mono text-[0.66rem] uppercase tracking-[0.2em] transition-all hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderColor: HAIRLINE_MED,
              color: MUTED,
              background: CREAM_SURFACE,
              paddingTop: "1.25rem",
              paddingBottom: "1.25rem",
              paddingLeft: "2.25rem",
              paddingRight: "2.25rem",
            }}
          >
            See how it works
          </a>
        </motion.div>

        {/* Mono dateline — light context */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex items-center gap-3"
          aria-hidden
        >
          <div className="h-px w-8 shrink-0" style={{ background: CARAMEL }} />
          <span
            className="font-mono text-[0.6rem] uppercase tracking-[0.22em]"
            style={{ color: MUTED_LIGHT }}
          >
            Est. 2019 &middot; SkynetLabs &middot; Bali
          </span>
          <div className="h-px w-8 shrink-0" style={{ background: CARAMEL }} />
        </motion.div>
      </motion.div>

      {/* Scroll cue — bouncing chevron */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span
          className="font-mono text-[0.54rem] uppercase tracking-[0.28em]"
          style={{ color: MUTED_LIGHT }}
        >
          Scroll
        </span>
        <motion.svg
          width="14"
          height="9"
          viewBox="0 0 14 9"
          fill="none"
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: MUTED_LIGHT }}
        >
          <path
            d="M1 1L7 7L13 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PROOF BAND
   ────────────────────────────────────────────────────────────── */
function ProofBand() {
  return (
    <section
      id="proof"
      className="border-y"
      style={{ borderColor: HAIRLINE_MED, background: CREAM_SURFACE }}
      aria-label="Track record"
    >
      <div className="mx-auto max-w-[1440px]">
        <div
          className="grid grid-cols-2 divide-x divide-y lg:grid-cols-4 lg:divide-y-0"
          style={{ borderColor: HAIRLINE } as React.CSSProperties}
        >
          {PROOF.map((p, i) => (
            <motion.div
              key={p.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...SP_GENTLE, delay: i * 0.08 }}
              className="flex flex-col px-8 py-10 sm:px-12 sm:py-14"
              style={{ borderColor: HAIRLINE }}
            >
              <span
                className="font-mono leading-none"
                style={{
                  fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
                  color: ESPRESSO,
                  letterSpacing: "-0.04em",
                }}
              >
                {p.n}
              </span>
              <div
                className="mb-3 mt-3 h-px w-8"
                style={{ background: CARAMEL }}
                aria-hidden
              />
              <span
                className="font-mono text-[0.62rem] uppercase tracking-[0.24em]"
                style={{ color: MUTED }}
              >
                {p.l}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   SERVICES SECTION
   ────────────────────────────────────────────────────────────── */
function ServicesSection({ reduce }: { reduce: boolean }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="border-t"
      style={{ borderColor: HAIRLINE_MED }}
      aria-label="Services"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 sm:py-32">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span
              className="font-mono text-[0.64rem] uppercase tracking-[0.24em]"
              style={{ color: CARAMEL }}
            >
              What I build
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                lineHeight: 1.0,
                color: ESPRESSO,
              }}
            >
              Systems that run{" "}
              <em style={{ color: OXBLOOD }}>while you sleep.</em>
            </h2>
          </div>
          <p
            className="max-w-[380px] leading-relaxed"
            style={{ fontSize: "0.97rem", color: MUTED }}
          >
            No dashboards for the sake of dashboards. Every system is mapped to
            a real leak in your ops — then engineered shut.
          </p>
        </div>

        {/* Service rows — accordion-style hover depth */}
        <div
          className="flex flex-col"
          style={{ borderTop: `1px solid ${HAIRLINE_MED}` }}
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.index}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...SP_GENTLE, delay: i * 0.07 }}
              className="group relative cursor-default"
              style={{ borderBottom: `1px solid ${HAIRLINE_MED}` }}
              onMouseEnter={() => !reduce && setActive(i)}
              onMouseLeave={() => !reduce && setActive(null)}
            >
              {/* Background fill on hover */}
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    key="bg"
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ background: CREAM_SURFACE }}
                    aria-hidden
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 grid grid-cols-1 gap-4 px-0 py-8 lg:grid-cols-[80px_1fr_1fr] lg:items-center lg:gap-10 lg:py-10">
                {/* Index */}
                <span
                  className="font-mono text-[0.62rem] uppercase tracking-[0.24em]"
                  style={{ color: MUTED_LIGHT }}
                >
                  {s.index}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
                    color: active === i ? ESPRESSO : ESPRESSO,
                    lineHeight: 1.1,
                    transition: "color 0.2s",
                  }}
                >
                  {s.title}
                </h3>

                {/* Body */}
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "0.95rem", color: MUTED }}
                >
                  {s.body}
                </p>
              </div>

              {/* Oxblood left rule on hover */}
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    key="rule"
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1] }}
                    style={{ background: OXBLOOD }}
                    aria-hidden
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA link below services */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ ...SP_GENTLE, delay: 0.25 }}
          className="mt-14"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.64rem] uppercase tracking-[0.2em] transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2"
            style={{
              color: OXBLOOD,
              borderBottom: `1px solid ${OXBLOOD}`,
              paddingBottom: "3px",
            }}
          >
            Book a 30-min discovery call &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   CLOSING CTA — centred, understated
   ────────────────────────────────────────────────────────────── */
function ClosingCTA({ reduce }: { reduce: boolean }) {
  return (
    <section
      className="border-t"
      style={{ borderColor: HAIRLINE_MED, background: CREAM_SURFACE }}
      aria-label="Book a discovery call"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-32 sm:px-10 sm:py-44 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={SP_GENTLE}
        >
          <span
            className="font-mono text-[0.62rem] uppercase tracking-[0.26em]"
            style={{ color: CARAMEL }}
          >
            Ready to begin?
          </span>

          <h2
            className="mx-auto mt-6"
            style={{
              fontFamily: "var(--font-instrument)",
              fontSize: "clamp(2.4rem, 6.5vw, 5.2rem)",
              lineHeight: 0.96,
              color: ESPRESSO,
              maxWidth: "18ch",
            }}
          >
            One call.{" "}
            <em style={{ color: OXBLOOD }}>We&apos;ll find the leak.</em>
          </h2>

          <p
            className="mx-auto mt-8 leading-relaxed"
            style={{ fontSize: "1.02rem", color: MUTED, maxWidth: "440px" }}
          >
            30 minutes. We map where your busywork lives, what it&apos;s costing
            you, and what it would take to make it disappear — no pitch, no
            pressure.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4">
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl font-mono text-[0.66rem] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: OXBLOOD,
                color: CREAM,
                paddingTop: "1.25rem",
                paddingBottom: "1.25rem",
                paddingLeft: "2.5rem",
                paddingRight: "2.5rem",
                boxShadow: `0 8px 32px -8px rgba(90,26,26,0.30)`,
              }}
            >
              Book a discovery call &rarr;
            </Link>

            <a
              href="mailto:waseembali2k26@gmail.com"
              className="font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
              style={{ color: MUTED_LIGHT }}
            >
              or email waseembali2k26@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER
   ────────────────────────────────────────────────────────────── */
function PageFooter() {
  return (
    <footer
      className="border-t px-5 py-10 sm:px-10"
      style={{ borderColor: HAIRLINE_MED }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <span
            style={{
              fontFamily: "var(--font-instrument)",
              fontSize: "1.05rem",
              color: ESPRESSO,
            }}
          >
            Waseem Nasir
          </span>
          <div
            className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.2em]"
            style={{ color: MUTED_LIGHT }}
          >
            SkynetLabs &middot; Bali &middot; Building since 2019
          </div>
        </div>

        <nav
          className="flex flex-wrap items-center gap-6"
          aria-label="Footer navigation"
        >
          {(
            [
              ["https://skynetjoe.com", "skynetjoe.com"],
              [CTA, "Book a call"],
              ["mailto:waseembali2k26@gmail.com", "Email"],
            ] as [string, string][]
          ).map(([href, label]) => (
            <a
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-mono text-[0.6rem] uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
              style={{ color: MUTED }}
            >
              {label}
            </a>
          ))}
        </nav>

        <span
          className="font-mono text-[0.56rem] uppercase tracking-[0.16em]"
          style={{ color: MUTED_LIGHT }}
        >
          &copy; 2026
        </span>
      </div>
    </footer>
  );
}
