"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { Instrument_Serif } from "next/font/google";

/* ============================================================
   VARIANT: editorial-warm
   "Editorial Warm-Neutral" — the defining 2026 magazine look.
   Cream canvas · espresso text · oxblood accent · caramel secondary.
   Instrument Serif (display) + Inter (body) + JetBrains Mono (labels).

   SELF-CONTAINED — touches zero shared files, zero other variants.
   Light bg technique: `fixed inset-0 z-0` cream div covers global dark body.
   ============================================================ */

/* ─── Local font: Instrument Serif (not in global layout) ─── */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

/* ─── Palette ─── */
const CREAM = "#F4EADE";
const CREAM_SURFACE = "#F9F4EC";
const ESPRESSO = "#2B1D14";
const MUTED = "#7A6150";
const MUTED_LIGHT = "#BCA898";
const OXBLOOD = "#5A1A1A";
const CARAMEL = "#B07D4E";
const HAIRLINE = "rgba(43,29,20,0.10)";
const HAIRLINE_MED = "rgba(43,29,20,0.18)";

const IMG = (f: string) => `/img/pro/${f}`;
const CTA = "https://skynetjoe.com/discovery-call";

/* ─── Spring presets ─── */
const SP_GENTLE = {
  type: "spring" as const,
  stiffness: 68,
  damping: 19,
  mass: 0.8,
};
const SP_SNAPPY = { type: "spring" as const, stiffness: 110, damping: 17 };

/* ─── Real proof numbers only ─── */
const PROOF = [
  { n: "180+", l: "Workflows built" },
  { n: "40+", l: "Sites shipped" },
  { n: "9", l: "Countries served" },
  { n: "2019", l: "Building since" },
];

/* ─── Sticky-image scroll beats for About section ─── */
const STORY_BEATS = [
  {
    img: "PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    alt: "Waseem Nasir — warm portrait, wooden interior, soft smile",
    heading: "I engineer the boring, expensive problems out of a business.",
    body: "For six years I've built AI & automation systems for growing companies across nine countries — quiet machinery that captures the lead, sends the follow-up, books the call, and handles the manual ops nobody wants to touch.",
  },
  {
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    alt: "Waseem typing on a laptop at a sunlit Bali terrace cafe",
    heading: "No dashboards for the sake of dashboards.",
    body: "I sit with how your business actually runs. I map the flow, find exactly where leads, follow-ups and ops quietly leak — then I engineer the hole shut, permanently.",
  },
  {
    img: "PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
    alt: "Waseem smiling in a rice field with palms and mountains",
    heading: "Built from cafés, rooftops, and rice fields — shipped worldwide.",
    body: "Based in Bali. Working across nine countries. The timezone doesn't change the quality of the work or the speed of the reply.",
  },
];

/* ─── Work entries ─── */
const WORK = [
  {
    src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    alt: "Dual-laptop analytics dashboard at a cafe — PT clinic project",
    place: "Miami, USA",
    tag: "Healthcare",
    title: "PT clinic booking system",
    detail:
      "Next.js + Stripe: patients book, pay and receive their asset in a single flow. Zero manual steps, zero dropped bookings.",
  },
  {
    src: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    alt: "Waseem typing at a backlit keyboard in a night cafe — inbox automation project",
    place: "Europe",
    tag: "Automation",
    title: "47-step self-healing inbox engine",
    detail:
      "An n8n workflow that triages inbound email, drafts replies, escalates edge cases and recovers from its own failures. Zero dead follow-ups.",
  },
  {
    src: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    alt: "Waseem focused on phone at coworking desk — freight lead system",
    place: "United States",
    tag: "Growth",
    title: "Freight lead capture system",
    detail:
      "Meta CAPI-fed lead routing for a US freight operator. Every inquiry tracked end-to-end and piped directly to dispatch.",
  },
  {
    src: "WORK-packing-gift-basket-laptop-desk.jpg",
    alt: "Packing gift basket with laptop — Italy trip portal project",
    place: "Italy",
    tag: "Web · GDPR",
    title: "Family trip planning portal",
    detail:
      "WordPress GDPR-compliant trip-input system for an Italian family travel business — CPT, consent flows, multi-step forms, clean client dashboard.",
  },
];

/* ─── Photo wall items (masonry editorial) ─── */
const PHOTO_WALL = [
  {
    src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    alt: "Waseem arms spread at Nusa Penida sea cliffs",
    caption: "Nusa Penida",
    tall: true,
  },
  {
    src: "LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
    alt: "Waseem playing acoustic guitar and smiling in a white cafe",
    caption: "Bali, 2026",
    tall: false,
  },
  {
    src: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    alt: "Waseem in a tan knit sweater on a mountain ridge",
    caption: "KPK mountain ridge",
    tall: true,
  },
  {
    src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    alt: "Waseem smiling at a rooftop cafe with a dragonfruit smoothie",
    caption: "Rooftop build session",
    tall: false,
  },
  {
    src: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    alt: "Waseem in black prince coat on balcony rail with sunglasses",
    caption: "The operator",
    tall: true,
  },
  {
    src: "LIFESTYLE-2025-08-08-rattan-chair-headphones-pavilion-relaxed.jpg",
    alt: "Waseem in a rattan chair with headphones in a pavilion — relaxed",
    caption: "Between deploys",
    tall: false,
  },
  {
    src: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
    alt: "Waseem standing on a jungle bridge with sunglasses",
    caption: "Jungle, Bali",
    tall: false,
  },
];

/* ─── Mono label ─── */
function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[0.66rem] uppercase tracking-[0.26em]"
      style={{ color: CARAMEL }}
    >
      {children}
    </span>
  );
}

/* ─── Hairline rule ─── */
function Rule({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ background: HAIRLINE_MED, height: "1px" }}
      aria-hidden
    />
  );
}

/* ============================================================
   PAGE ROOT
   ============================================================ */
export default function EditorialWarm() {
  const reduce = !!useReducedMotion();

  return (
    <>
      {/* ── Cream canvas — kills global dark body + aurora ── */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: CREAM }}
        aria-hidden
      />
      {/* Subtle warm paper texture bloom */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 120% 60% at 80% -10%, rgba(176,125,78,0.08), transparent 60%), radial-gradient(ellipse 80% 50% at -10% 110%, rgba(90,26,26,0.04), transparent 55%)",
        }}
      />

      {/* skip link */}
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-20 rounded px-4 py-2 text-sm font-medium focus:translate-y-0"
        style={{ background: ESPRESSO, color: CREAM }}
      >
        Skip to content
      </a>

      <main
        id="main-content"
        className={`relative z-10 ${instrumentSerif.variable}`}
        style={{ color: ESPRESSO, overflowX: "clip" }}
      >
        <TopBar reduce={reduce} />
        <MastheadHero reduce={reduce} />
        <ProofBand />
        <AboutSticky reduce={reduce} />
        <WorkGrid reduce={reduce} />
        <ParallaxInterlude reduce={reduce} />
        <PhotoWall reduce={reduce} />
        <FinalCTA reduce={reduce} />
        <SiteFooter />
      </main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   TOP BAR — cream frosted, mono links
   ────────────────────────────────────────────────────────────── */
function TopBar({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SP_GENTLE, delay: 0.08 }}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "rgba(244,234,222,0.86)",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
        {/* Wordmark — Instrument Serif */}
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

        {/* Nav — mono, spaced */}
        <nav
          className="hidden items-center gap-9 sm:flex"
          aria-label="Primary navigation"
        >
          {(
            [
              ["#about", "About"],
              ["#work", "Work"],
              ["#gallery", "Gallery"],
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
          className="font-mono text-[0.64rem] uppercase tracking-[0.2em] transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            color: CREAM,
            background: OXBLOOD,
            padding: "0.55rem 1.25rem",
          }}
        >
          Book a call
        </Link>
      </div>
    </motion.header>
  );
}

/* ──────────────────────────────────────────────────────────────
   MASTHEAD HERO — magazine cover structure
   Left: oversized Instrument Serif name + dateline + intro
   Right: large portrait revealed via clip-path wipe on mount
   ────────────────────────────────────────────────────────────── */
function MastheadHero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Pointer tilt on portrait
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ rx: cy * -6, ry: cx * 6 });
    },
    [reduce],
  );
  const handleMouseLeave = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);

  // Hero content fades as user scrolls out
  const heroFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Parallax on portrait
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const portraitYSpring = useSpring(portraitY, { stiffness: 55, damping: 20 });

  const headline = ["I make your", "busywork", "disappear."];

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden pt-[72px]"
      aria-label="Hero — masthead"
    >
      <motion.div
        style={{ opacity: reduce ? 1 : heroFade }}
        className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1440px] grid-cols-1 items-center gap-0 px-5 sm:px-10 lg:grid-cols-[1fr_1fr]"
      >
        {/* ── LEFT col: editorial copy ── */}
        <div className="flex flex-col justify-center py-16 pr-0 lg:pr-16 lg:py-0">
          {/* Dateline — mono uppercase */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SP_GENTLE, delay: 0.15 }}
            className="mb-10 flex items-center gap-4"
          >
            <div
              className="h-px w-12 shrink-0"
              style={{ background: CARAMEL }}
              aria-hidden
            />
            <MonoLabel>Est. 2019 · 9 Countries · 40+ Shipped</MonoLabel>
          </motion.div>

          {/* Oversized name — Instrument Serif, editorial masthead */}
          <div className="overflow-hidden" aria-label="Waseem Nasir">
            {["Waseem", "Nasir"].map((word, wi) => (
              <motion.div
                key={word}
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ ...SP_GENTLE, delay: 0.28 + wi * 0.11 }}
                className="overflow-hidden"
              >
                <span
                  aria-hidden
                  style={{
                    fontFamily: "var(--font-instrument)",
                    fontSize: "clamp(4.5rem, 13vw, 10rem)",
                    lineHeight: 0.88,
                    letterSpacing: "-0.03em",
                    color: ESPRESSO,
                    display: "block",
                  }}
                >
                  {word}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Subheadline — italic Instrument Serif */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SP_GENTLE, delay: 0.52 }}
            style={{
              fontFamily: "var(--font-instrument)",
              fontStyle: "italic",
              fontSize: "clamp(1.3rem, 2.8vw, 2.1rem)",
              color: OXBLOOD,
              marginTop: "clamp(1.25rem, 2vw, 2rem)",
              lineHeight: 1.15,
            }}
          >
            {headline.join(" ")}
          </motion.p>

          {/* Body */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SP_GENTLE, delay: 0.64 }}
            className="mt-6 max-w-[480px] leading-relaxed"
            style={{
              fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
              color: MUTED,
            }}
          >
            Independent founder building AI &amp; automation systems behind the
            scenes — missed leads, dead follow-ups, manual ops. I find the leak
            and engineer it shut.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SP_GENTLE, delay: 0.76 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-cream transition-all hover:opacity-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: OXBLOOD,
                color: CREAM,
              }}
            >
              Book a discovery call &rarr;
            </Link>
            <a
              href="#work"
              className="font-mono text-[0.62rem] uppercase tracking-[0.22em] transition-opacity hover:opacity-50"
              style={{
                color: MUTED,
                borderBottom: `1px solid ${HAIRLINE_MED}`,
                paddingBottom: "2px",
              }}
            >
              See the work &darr;
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT col: portrait with clip-path wipe ── */}
        <div className="relative flex items-center justify-center py-10 lg:py-0 lg:h-[calc(100svh-72px)]">
          <motion.div
            className="relative w-full max-w-[520px] lg:max-w-none lg:h-full lg:w-full"
            style={{
              aspectRatio: "4/5",
              transform: reduce
                ? undefined
                : `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Portrait container — clip-path wipe reveal */}
            <motion.div
              initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{
                duration: reduce ? 0 : 1.1,
                ease: [0.76, 0, 0.24, 1],
                delay: reduce ? 0 : 0.22,
              }}
              className="relative overflow-hidden"
              style={{
                height: "clamp(480px, 80svh, 820px)",
                border: `1px solid ${HAIRLINE_MED}`,
              }}
            >
              <motion.div
                style={{ y: reduce ? 0 : portraitYSpring }}
                className="absolute inset-0 scale-[1.1]"
              >
                <Image
                  src={IMG(
                    "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
                  )}
                  alt="Waseem Nasir — beige tracksuit, hands in pockets, glass-clad building backdrop"
                  fill
                  priority
                  sizes="(max-width:1024px) 90vw, 50vw"
                  className="object-cover object-[50%_18%]"
                />
              </motion.div>

              {/* Subtle warm vignette at base */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(244,234,222,0.22) 100%)",
                }}
              />
            </motion.div>

            {/* Floating caramel dateline chip — lower-left */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SP_GENTLE, delay: 1.1 }}
              className="absolute -bottom-5 -left-4 sm:-left-8 px-4 py-3"
              style={{
                background: CREAM_SURFACE,
                border: `1px solid ${HAIRLINE_MED}`,
                boxShadow: "0 12px 40px -12px rgba(43,29,20,0.16)",
              }}
            >
              <div
                className="font-mono text-[0.58rem] uppercase tracking-[0.22em]"
                style={{ color: MUTED }}
              >
                SkynetLabs · Bali
              </div>
              <div
                style={{
                  fontFamily: "var(--font-instrument)",
                  fontSize: "1rem",
                  color: ESPRESSO,
                  marginTop: "2px",
                }}
              >
                Founder &amp; builder
              </div>
            </motion.div>

            {/* Oxblood accent rule — top edge of portrait */}
            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.8,
                delay: 1.05,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="absolute inset-x-0 top-0 h-[3px] origin-left"
              style={{ background: OXBLOOD }}
              aria-hidden
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <div
          className="font-mono text-[0.55rem] uppercase tracking-[0.28em]"
          style={{ color: MUTED_LIGHT }}
        >
          Scroll
        </div>
        <motion.div
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 w-px"
          style={{
            background: `linear-gradient(to bottom, ${CARAMEL}, transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PROOF BAND — count-up style, mono numerals on cream surface
   Asymmetric: stats left-aligned in cols with vertical rules
   ────────────────────────────────────────────────────────────── */
function ProofBand() {
  return (
    <section
      className="border-y"
      style={{ borderColor: HAIRLINE_MED, background: CREAM_SURFACE }}
      aria-label="Track record"
    >
      <div className="mx-auto max-w-[1440px]">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0"
          style={
            {
              "--tw-divide-opacity": 1,
              borderColor: HAIRLINE,
            } as React.CSSProperties
          }
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
              {/* Large mono numeral */}
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
              {/* Caramel accent rule */}
              <div
                className="mt-3 mb-3 h-px w-8"
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
   ABOUT — STICKY IMAGE / SCROLLING TEXT SPLIT
   Desktop: left sticky portrait cross-fades between 3 beats,
            right column scrolls 3 story paragraphs.
   Mobile: stacked portrait then text.
   ────────────────────────────────────────────────────────────── */
function AboutSticky({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to active beat index (0, 1, 2)
  const [activeBeat, setActiveBeat] = useState(0);

  // We use useTransform to drive a side-effect via onChange
  const beatProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, STORY_BEATS.length - 0.01],
  );

  // Subscribe to progress changes — in an effect so the listener is registered
  // once and cleaned up (avoids an unbounded subscription leak per render).
  useEffect(() => {
    const unsub = beatProgress.on("change", (v) => {
      const idx = Math.min(Math.floor(v), STORY_BEATS.length - 1);
      setActiveBeat(idx);
    });
    return unsub;
  }, [beatProgress]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative"
      style={{ minHeight: `${STORY_BEATS.length * 100}svh` }}
      aria-label="About Waseem"
    >
      {/* Section label */}
      <div
        className="sticky top-0 z-10 hidden lg:block"
        style={{ height: 0, overflow: "visible" }}
      >
        <div className="absolute left-10 top-8">
          <MonoLabel>About</MonoLabel>
        </div>
      </div>

      {/* Desktop: two-col sticky layout */}
      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-[100svh] items-center">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_1fr] items-center gap-0 px-10">
            {/* LEFT: sticky portrait that cross-fades */}
            <div className="relative pr-14" style={{ height: "72svh" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBeat}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.55,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 overflow-hidden"
                  style={{ border: `1px solid ${HAIRLINE_MED}` }}
                >
                  <Image
                    src={IMG(STORY_BEATS[activeBeat].img)}
                    alt={STORY_BEATS[activeBeat].alt}
                    fill
                    sizes="45vw"
                    className="object-cover object-top"
                    style={{ filter: "saturate(0.95)" }}
                  />
                  {/* Subtle warm overlay at base */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 60%, rgba(244,234,222,0.28) 100%)",
                    }}
                  />
                  {/* Oxblood top rule */}
                  <div
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ background: OXBLOOD }}
                    aria-hidden
                  />
                </motion.div>
              </AnimatePresence>

              {/* Beat index indicator */}
              <div className="absolute bottom-4 right-4 flex gap-2" aria-hidden>
                {STORY_BEATS.map((_, i) => (
                  <div
                    key={i}
                    className="transition-all duration-400"
                    style={{
                      width: i === activeBeat ? "1.5rem" : "0.4rem",
                      height: "2px",
                      background: i === activeBeat ? OXBLOOD : MUTED_LIGHT,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: text changes with scroll (we show current beat) */}
            <div className="pl-14 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBeat}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -16 }}
                  transition={SP_GENTLE}
                >
                  <div
                    className="mb-6 font-mono text-[0.58rem] uppercase tracking-[0.28em]"
                    style={{ color: CARAMEL }}
                  >
                    {String(activeBeat + 1).padStart(2, "0")} /{" "}
                    {String(STORY_BEATS.length).padStart(2, "0")}
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-instrument)",
                      fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                      lineHeight: 1.1,
                      color: ESPRESSO,
                    }}
                  >
                    {STORY_BEATS[activeBeat].heading}
                  </h2>
                  <p
                    className="mt-6 leading-relaxed"
                    style={{
                      fontSize: "1.02rem",
                      color: MUTED,
                      maxWidth: "520px",
                    }}
                  >
                    {STORY_BEATS[activeBeat].body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Capability tags */}
              {activeBeat === 2 && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SP_GENTLE, delay: 0.2 }}
                  className="mt-9 flex flex-wrap gap-2"
                >
                  {[
                    "n8n",
                    "Next.js",
                    "AEO",
                    "Stripe",
                    "WhatsApp",
                    "Meta CAPI",
                    "WordPress",
                  ].map((t) => (
                    <span
                      key={t}
                      className="border font-mono text-[0.58rem] uppercase tracking-[0.16em] px-3 py-1.5"
                      style={{ borderColor: HAIRLINE_MED, color: MUTED }}
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>
              )}

              {activeBeat === 2 && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SP_GENTLE, delay: 0.35 }}
                  className="mt-8"
                >
                  <Link
                    href={CTA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.62rem] uppercase tracking-[0.2em] transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      color: OXBLOOD,
                      borderBottom: `1px solid ${OXBLOOD}`,
                      paddingBottom: "3px",
                    }}
                  >
                    Book a discovery call &rarr;
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        {/* Scroll height spacer — invisible, drives progress */}
        <div
          style={{
            height: `${STORY_BEATS.length * 100}svh`,
            marginTop: "-100svh",
          }}
          aria-hidden
        />
      </div>

      {/* Mobile: stacked cards */}
      <div className="lg:hidden px-5 py-20 sm:px-10">
        <MonoLabel>About</MonoLabel>
        {STORY_BEATS.map((beat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...SP_GENTLE, delay: i * 0.05 }}
            className="mt-14"
          >
            <div
              className="relative overflow-hidden mb-7"
              style={{
                aspectRatio: "4/3",
                border: `1px solid ${HAIRLINE_MED}`,
              }}
            >
              <Image
                src={IMG(beat.img)}
                alt={beat.alt}
                fill
                sizes="90vw"
                className="object-cover object-top"
              />
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ background: OXBLOOD }}
                aria-hidden
              />
            </div>
            <div
              className="mb-3 font-mono text-[0.58rem] uppercase tracking-[0.24em]"
              style={{ color: CARAMEL }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(1.5rem, 5vw, 2rem)",
                color: ESPRESSO,
                lineHeight: 1.12,
              }}
            >
              {beat.heading}
            </h2>
            <p
              className="mt-4 leading-relaxed"
              style={{ color: MUTED, fontSize: "0.97rem" }}
            >
              {beat.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   WORK GRID — asymmetric editorial layout
   Broken baseline: large card left, two stacked right (offset up)
   + second row: full-width feature card
   ────────────────────────────────────────────────────────────── */
function WorkGrid({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="work"
      className="border-t"
      style={{ borderColor: HAIRLINE_MED }}
      aria-label="Selected work"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 sm:py-32">
        {/* Header — asymmetric, label far left, heading offset */}
        <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-[max-content_1fr] lg:gap-16 lg:items-end">
          <div className="flex flex-col gap-3">
            <MonoLabel>Selected work</MonoLabel>
            <Rule className="w-10" />
          </div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                lineHeight: 1.0,
                color: ESPRESSO,
              }}
            >
              Real systems, <em style={{ color: OXBLOOD }}>quietly running.</em>
            </h2>
            <p
              className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.22em]"
              style={{ color: MUTED_LIGHT }}
            >
              Client names private &middot; Problems and outcomes real
            </p>
          </div>
        </div>

        {/* ── Row 1: asymmetric 2-col (5:3 ratio) ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[5fr_3fr] lg:items-start">
          {/* Card 0 — large */}
          <WorkCard w={WORK[0]} reduce={reduce} delay={0} large />
          {/* Cards 1 — right col, pushed down for broken baseline */}
          <div className="grid grid-cols-1 gap-5 lg:mt-[5rem]">
            <WorkCard w={WORK[1]} reduce={reduce} delay={0.07} />
          </div>
        </div>

        {/* ── Row 2: 3:5 reverse asymmetry ── */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[3fr_5fr] lg:items-start">
          <div className="grid grid-cols-1 gap-5 lg:mt-[-2rem]">
            <WorkCard w={WORK[2]} reduce={reduce} delay={0.06} />
          </div>
          <WorkCard w={WORK[3]} reduce={reduce} delay={0} large />
        </div>
      </div>
    </section>
  );
}

function WorkCard({
  w,
  reduce,
  delay,
  large,
}: {
  w: (typeof WORK)[0];
  reduce: boolean;
  delay: number;
  large?: boolean;
}) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SP_GENTLE, delay }}
      className="group relative overflow-hidden"
      style={{
        background: CREAM_SURFACE,
        border: `1px solid ${HAIRLINE_MED}`,
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: large ? "16/9" : "4/3" }}
      >
        <Image
          src={IMG(w.src)}
          alt={w.alt}
          fill
          sizes="(max-width:768px) 90vw, (max-width:1200px) 55vw, 45vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ filter: "saturate(0.9)" }}
        />
        {/* Warm overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, transparent 42%, rgba(43,29,20,0.35) 100%)",
          }}
        />
        {/* Place + tag badges */}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.2em]"
            style={{ color: "rgba(244,234,222,0.9)" }}
          >
            {w.place}
          </span>
          <span
            className="px-3 py-1 font-mono text-[0.56rem] uppercase tracking-[0.16em]"
            style={{ background: OXBLOOD, color: CREAM }}
          >
            {w.tag}
          </span>
        </div>
        {/* Oxblood top edge */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: OXBLOOD }}
          aria-hidden
        />
      </div>

      {/* Copy */}
      <div className={large ? "p-8 sm:p-10" : "p-6 sm:p-8"}>
        <div
          className="mb-4 h-px"
          style={{ background: HAIRLINE_MED, width: "2rem" }}
          aria-hidden
        />
        <h3
          style={{
            fontFamily: "var(--font-instrument)",
            fontSize: large
              ? "clamp(1.3rem, 2.4vw, 1.9rem)"
              : "clamp(1.1rem, 1.8vw, 1.4rem)",
            lineHeight: 1.15,
            color: ESPRESSO,
          }}
        >
          {w.title}
        </h3>
        <p
          className="mt-3 leading-relaxed"
          style={{ fontSize: "0.9rem", color: MUTED }}
        >
          {w.detail}
        </p>
      </div>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────────
   PARALLAX INTERLUDE — full-bleed SCENERY/TRAVEL photo
   Warm-toned overlay so cream palette carries through
   ────────────────────────────────────────────────────────────── */
function ParallaxInterlude({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const ySpring = useSpring(yRaw, { stiffness: 50, damping: 20 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "75svh" }}
      aria-label="Interlude — life in motion"
    >
      {/* Background photo with parallax */}
      <motion.div
        className="absolute inset-0 scale-[1.12]"
        style={{ y: reduce ? 0 : ySpring }}
      >
        <Image
          src={IMG("TRAVEL-2026-03-29-trail-selfie-backpack-mountain-sky.jpg")}
          alt="Waseem on a mountain trail with a backpack — wide sky behind"
          fill
          sizes="100vw"
          className="object-cover object-[50%_35%]"
          style={{ filter: "saturate(0.88) brightness(0.82)" }}
        />
      </motion.div>

      {/* Warm cream gradient overlay — left heavy so text reads */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(100deg, rgba(43,29,20,0.80) 0%, rgba(43,29,20,0.52) 45%, rgba(43,29,20,0.18) 100%)",
        }}
      />

      {/* Quote / statement */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col items-start justify-center px-8 sm:px-16 lg:px-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={SP_GENTLE}
        >
          <MonoLabel>
            <span style={{ color: "rgba(244,234,222,0.45)" }}>The method</span>
          </MonoLabel>
          <blockquote>
            <p
              style={{
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
                fontSize: "clamp(1.8rem, 4.5vw, 3.6rem)",
                lineHeight: 1.1,
                color: CREAM,
                maxWidth: "18ch",
                marginTop: "1.25rem",
              }}
            >
              &ldquo;The best automation is the kind you forget is even
              running.&rdquo;
            </p>
            <footer
              className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.3em]"
              style={{ color: "rgba(176,125,78,0.85)" }}
            >
              &mdash; Waseem Nasir, SkynetLabs
            </footer>
          </blockquote>
        </motion.div>

        {/* Secondary geography note */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ ...SP_GENTLE, delay: 0.22 }}
          className="mt-10 flex items-center gap-4"
        >
          <div
            className="h-px w-10"
            style={{ background: CARAMEL }}
            aria-hidden
          />
          <span
            className="font-mono text-[0.6rem] uppercase tracking-[0.24em]"
            style={{ color: "rgba(244,234,222,0.5)" }}
          >
            Bali · Pakistan · Singapore · Europe · + 5 more countries
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PHOTO WALL — editorial masonry-style grid
   7 curated LIFESTYLE/TRAVEL shots
   B&W → color on hover (filter transition)
   ────────────────────────────────────────────────────────────── */
function PhotoWall({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="gallery"
      className="border-t"
      style={{ borderColor: HAIRLINE_MED }}
      aria-label="Photo gallery — life and work"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 sm:py-32">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <MonoLabel>Life &amp; work</MonoLabel>
            <h2
              className="mt-4"
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                color: ESPRESSO,
                lineHeight: 1.05,
              }}
            >
              Built from cafés,{" "}
              <em style={{ color: OXBLOOD }}>rooftops &amp; rice fields.</em>
            </h2>
          </div>
          <span
            className="hidden sm:block font-mono text-[0.6rem] uppercase tracking-[0.22em] text-right"
            style={{ color: MUTED_LIGHT }}
          >
            Hover to reveal colour
          </span>
        </div>

        {/* Asymmetric editorial grid — 3 columns, variable row heights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {PHOTO_WALL.map((photo, i) => (
            <motion.figure
              key={photo.src}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...SP_GENTLE, delay: (i % 3) * 0.06 }}
              className="group relative overflow-hidden"
              style={{
                gridRow: photo.tall ? "span 2" : "span 1",
                aspectRatio: photo.tall ? "3/4" : "4/3",
                border: `1px solid ${HAIRLINE_MED}`,
              }}
            >
              <Image
                src={IMG(photo.src)}
                alt={photo.alt}
                fill
                sizes="(max-width:640px) 45vw, 30vw"
                className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
                style={{
                  filter: reduce ? "none" : "grayscale(0.65) saturate(0.7)",
                  transition: "filter 0.6s ease, transform 0.7s ease",
                }}
                onMouseEnter={(e) => {
                  if (!reduce)
                    e.currentTarget.style.filter =
                      "grayscale(0) saturate(1.05)";
                }}
                onMouseLeave={(e) => {
                  if (!reduce)
                    e.currentTarget.style.filter =
                      "grayscale(0.65) saturate(0.7)";
                }}
              />

              {/* Warm vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(43,29,20,0.55) 100%)",
                }}
              />

              {/* Caption */}
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-3 sm:px-4 sm:pb-4">
                <span
                  className="font-mono text-[0.56rem] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(244,234,222,0.75)" }}
                >
                  {photo.caption}
                </span>
                <span
                  className="font-mono text-[0.5rem] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(176,125,78,0.7)" }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </figcaption>

              {/* Oxblood top rule */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: OXBLOOD }}
                aria-hidden
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FINAL CTA — editorial centre, single button
   ────────────────────────────────────────────────────────────── */
function FinalCTA({ reduce }: { reduce: boolean }) {
  return (
    <section
      className="border-t"
      style={{ borderColor: HAIRLINE_MED }}
      aria-label="Book a discovery call"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-32 sm:px-10 sm:py-44">
        {/* Offset layout — heading slightly left of center */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          {/* Left: heading */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={SP_GENTLE}
          >
            <MonoLabel>Ready to begin?</MonoLabel>
            <h2
              className="mt-6"
              style={{
                fontFamily: "var(--font-instrument)",
                fontSize: "clamp(2.4rem, 6.5vw, 5.2rem)",
                lineHeight: 0.96,
                color: ESPRESSO,
              }}
            >
              Let&apos;s make your
              <br />
              <em style={{ color: OXBLOOD }}>busywork disappear.</em>
            </h2>

            {/* Photo portrait inset — reinforces warmth */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...SP_GENTLE, delay: 0.18 }}
              className="relative mt-10 overflow-hidden"
              style={{
                width: "clamp(180px, 28vw, 300px)",
                aspectRatio: "4/3",
                border: `1px solid ${HAIRLINE_MED}`,
              }}
            >
              <Image
                src={IMG(
                  "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
                )}
                alt="Waseem in an olive track jacket at a cafe with a coffee and laptop"
                fill
                sizes="300px"
                className="object-cover"
                style={{ filter: "saturate(0.88)" }}
              />
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ background: OXBLOOD }}
                aria-hidden
              />
            </motion.div>
          </motion.div>

          {/* Right: CTA block */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SP_GENTLE, delay: 0.14 }}
            className="flex flex-col justify-end"
          >
            <p
              className="max-w-[380px] leading-relaxed"
              style={{ fontSize: "1.02rem", color: MUTED }}
            >
              One 30-minute call. We&apos;ll map where your busywork lives and
              what it would take to make it disappear — no pitch, no pressure.
            </p>

            <div className="mt-10">
              <Link
                href={CTA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 font-mono text-[0.66rem] uppercase tracking-[0.2em] transition-all hover:opacity-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2"
                style={{
                  background: OXBLOOD,
                  color: CREAM,
                }}
              >
                Book a discovery call &rarr;
              </Link>
            </div>

            {/* Email fallback */}
            <p
              className="mt-7 font-mono text-[0.6rem] uppercase tracking-[0.18em]"
              style={{ color: MUTED_LIGHT }}
            >
              Or email{" "}
              <a
                href="mailto:waseembali2k26@gmail.com"
                className="transition-opacity hover:opacity-60"
                style={{
                  color: CARAMEL,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                waseembali2k26@gmail.com
              </a>
            </p>

            {/* Agency link */}
            <p
              className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em]"
              style={{ color: MUTED_LIGHT }}
            >
              Agency:{" "}
              <a
                href="https://skynetjoe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
                style={{
                  color: CARAMEL,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                skynetjoe.com
              </a>
            </p>

            {/* Proof reminder */}
            <div
              className="mt-10 border-t pt-8"
              style={{ borderColor: HAIRLINE }}
            >
              <div className="grid grid-cols-2 gap-5">
                {PROOF.slice(0, 2).map((p) => (
                  <div key={p.l}>
                    <div
                      className="font-mono leading-none"
                      style={{
                        fontSize: "1.6rem",
                        color: ESPRESSO,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {p.n}
                    </div>
                    <div
                      className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.2em]"
                      style={{ color: MUTED }}
                    >
                      {p.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER
   ────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer
      className="border-t px-5 py-10 sm:px-10"
      style={{ borderColor: HAIRLINE_MED }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        {/* Wordmark */}
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

        {/* Links */}
        <nav
          className="flex flex-wrap items-center gap-6"
          aria-label="Footer navigation"
        >
          {(
            [
              ["https://github.com/waseemnasir2k26", "GitHub"],
              ["https://skynetjoe.com", "skynetjoe.com"],
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

        {/* Copyright */}
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
