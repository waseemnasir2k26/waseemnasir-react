"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/* ============================================================
   BRAND TOKENS — dark-luxe variant (self-contained, no shared edits)
   ============================================================ */
const BG = "#070707";
const SURFACE = "#0e0d0b";
const TEXT = "#F2ECDF";
const MUTED = "#9a9183";
const ACCENT = "#CBA968"; // champagne / bronze
const ACCENT2 = "#E8D6B0"; // pale gold
const HAIRLINE = "rgba(203,169,104,0.28)";

const IMG = (f: string) => `/img/pro/${f}`;
const CTA = "https://skynetjoe.com/discovery-call";

/* ---- Museum rail — 9 portrait-forward frames ---- */
const RAIL: { src: string; cap: string }[] = [
  {
    src: "CAFE-WORK-2025-03-30-glass-cafe-rattan-chair-cream-tee.jpg",
    cap: "I / The desk, anywhere",
  },
  {
    src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
    cap: "II / Above the clouds, still shipping",
  },
  {
    src: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    cap: "III / The operator",
  },
  {
    src: "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
    cap: "IV / Morning build",
  },
  {
    src: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    cap: "V / Off the grid",
  },
  {
    src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    cap: "VI / Quiet systems, loud results",
  },
  {
    src: "PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    cap: "VII / On the record",
  },
  {
    src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    cap: "VIII / Nine countries, counting",
  },
  {
    src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
    cap: "IX / No limits",
  },
];

/* ---- Case studies ---- */
const WORK: { src: string; place: string; title: string; detail: string }[] = [
  {
    src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    place: "Miami, USA",
    title: "Physical therapy clinic",
    detail:
      "Next.js + Stripe booking — patients book and pay in a single seamless flow.",
  },
  {
    src: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    place: "Europe",
    title: "Inbox automation engine",
    detail:
      "47-step n8n pipeline that self-heals, retries, and never drops a lead.",
  },
  {
    src: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    place: "United States",
    title: "Freight lead system",
    detail:
      "Meta CAPI wiring so every ad dollar is tracked cleanly to a booked load.",
  },
  {
    src: "WORK-packing-gift-basket-laptop-desk.jpg",
    place: "Italy",
    title: "Family trip portal",
    detail:
      "GDPR-clean WordPress build for a private travel concierge serving families.",
  },
];

/* ---- Real proof numbers only ---- */
const PROOF = [
  { n: "180+", l: "Workflows built" },
  { n: "40+", l: "Sites shipped" },
  { n: "9", l: "Countries served" },
  { n: "2019", l: "Building since" },
];

/* ============================================================
   PAGE
   ============================================================ */
export default function DarkLuxe() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Fixed brand bg — covers global dark body + aurora */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: BG }}
        aria-hidden
      />
      {/* Subtle bronze radial bloom */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 600px at 78% -8%, rgba(203,169,104,0.09), transparent 60%), radial-gradient(700px 500px at 8% 108%, rgba(232,214,176,0.04), transparent 55%)",
        }}
      />

      <main
        id="main-content"
        className="relative z-10 font-sans"
        style={{ color: TEXT }}
      >
        <TopBar reduce={!!reduce} />
        <Hero reduce={!!reduce} />
        <MarqueeStrip reduce={!!reduce} />
        <HorizontalGallery reduce={!!reduce} />
        <About reduce={!!reduce} />
        <WorkSection reduce={!!reduce} />
        <ProofStrip reduce={!!reduce} />
        <FullBleed reduce={!!reduce} />
        <CTASection reduce={!!reduce} />
        <Footer />
      </main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   TOP BAR
   ────────────────────────────────────────────────────────────── */
function TopBar({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background:
          "linear-gradient(180deg, rgba(7,7,7,0.88) 0%, rgba(7,7,7,0.0) 100%)",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
        {/* Wordmark */}
        <span
          className="font-serif text-[14px] tracking-[0.22em]"
          style={{ color: ACCENT2, letterSpacing: "0.22em" }}
        >
          WASEEM&nbsp;NASIR
        </span>

        {/* Nav */}
        <nav
          className="hidden items-center gap-9 sm:flex"
          aria-label="Primary navigation"
        >
          {(["Gallery", "About", "Work"] as const).map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-[11px] tracking-[0.26em] transition-opacity hover:opacity-60"
              style={{ color: MUTED }}
            >
              {label.toUpperCase()}
            </a>
          ))}
        </nav>

        {/* CTA pill */}
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-5 py-2 text-[11px] tracking-[0.2em] transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
          style={{
            border: `1px solid ${ACCENT}`,
            color: ACCENT2,
          }}
        >
          BOOK A CALL
        </Link>
      </div>
    </motion.header>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO — full-bleed portrait, per-word serif rise
   ────────────────────────────────────────────────────────────── */
function Hero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yImgSpring = useSpring(yImg, { stiffness: 80, damping: 22 });
  const fadeOut = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const headline = ["I", "make", "your", "busywork", "disappear."];

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Hero"
    >
      {/* Portrait — parallaxes upward on scroll */}
      <motion.div
        className="absolute inset-0"
        style={{ y: reduce ? 0 : yImgSpring }}
      >
        <Image
          src={IMG(
            "PORTRAIT-2026-05-18-prince-coat-sunglasses-phone-table.jpg",
          )}
          alt="Waseem Nasir, independent founder — dark prince coat, phone in hand"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_28%]"
          style={{ filter: "saturate(0.88) contrast(1.05)" }}
        />
      </motion.div>

      {/* Gradient wash — left legibility + right vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, rgba(7,7,7,0.94) 0%, rgba(7,7,7,0.62) 36%, rgba(7,7,7,0.16) 68%, rgba(7,7,7,0.52) 100%), linear-gradient(180deg, rgba(7,7,7,0.5) 0%, transparent 18%, transparent 62%, rgba(7,7,7,0.9) 100%)",
        }}
      />

      {/* Content fades as user scrolls past */}
      <motion.div
        style={{ opacity: reduce ? 1 : fadeOut }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-20 pt-32 sm:px-10 sm:pb-28"
      >
        {/* Eyebrow */}
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 18,
            delay: 0.2,
          }}
          className="mb-7 inline-flex w-fit items-center gap-4 text-[10px] tracking-[0.32em]"
          style={{ color: ACCENT }}
        >
          <span
            className="inline-block h-px w-10"
            style={{ background: ACCENT }}
            aria-hidden
          />
          INDEPENDENT FOUNDER &middot; BALI &middot; SINCE&nbsp;2019
        </motion.span>

        {/* Per-word headline rise */}
        <h1
          className="font-serif font-light leading-[0.95]"
          style={{ fontSize: "clamp(2.7rem, 8.5vw, 7rem)", color: TEXT }}
        >
          {headline.map((word, i) => (
            <motion.span
              key={word + i}
              initial={reduce ? false : { opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 68,
                damping: 16,
                delay: 0.34 + i * 0.09,
              }}
              className="mr-[0.26em] inline-block"
              style={
                i === 4 ? { color: ACCENT2, fontStyle: "italic" } : undefined
              }
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sub */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.82,
          }}
          className="mt-7 max-w-[520px] text-[15px] leading-relaxed sm:text-base"
          style={{ color: MUTED }}
        >
          A founder who builds quiet AI &amp; automation systems behind the
          scenes — missed leads, dead follow-ups, manual ops. I find the leak
          and engineer it shut.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.98,
          }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-8 py-3.5 text-[12px] font-medium tracking-[0.14em] transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: ACCENT, color: "#130e04" }}
          >
            BOOK A 30-MIN CALL&nbsp;&rarr;
          </Link>
          <a
            href="#gallery"
            className="text-[11px] tracking-[0.26em] transition-opacity hover:opacity-60"
            style={{ color: ACCENT2 }}
          >
            SCROLL THE GALLERY&nbsp;&darr;
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   MARQUEE STRIP — infinite serif italic tech loop
   ────────────────────────────────────────────────────────────── */
function MarqueeStrip({ reduce }: { reduce: boolean }) {
  const items = [
    "n8n",
    "Next.js",
    "AEO",
    "Stripe",
    "WhatsApp bots",
    "Meta CAPI",
    "WordPress",
    "Self-healing workflows",
    "AI automations",
  ];
  const row = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden border-y py-5"
      style={{ borderColor: HAIRLINE, background: SURFACE }}
      aria-hidden
    >
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={reduce ? {} : { x: ["0%", "-33.33%"] }}
        transition={
          reduce ? {} : { duration: 32, ease: "linear", repeat: Infinity }
        }
      >
        {row.map((t, i) => (
          <span
            key={i}
            className="font-serif italic"
            style={{
              fontSize: "clamp(1.05rem, 2.2vw, 1.6rem)",
              color: i % 2 === 0 ? ACCENT : MUTED,
            }}
          >
            {t}
            <span
              className="ml-12 not-italic"
              style={{ color: HAIRLINE }}
              aria-hidden
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   HORIZONTAL GALLERY — sticky museum rail
   Vertical scroll → horizontal x translation (spring-smoothed)
   Mobile / reduced-motion: vertical flex fallback
   ────────────────────────────────────────────────────────────── */
function HorizontalGallery({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // end at -85% so the last card is fully visible
  const xRaw = useTransform(scrollYProgress, [0, 1], ["2%", "-85%"]);
  const xSpring = useSpring(xRaw, { stiffness: 58, damping: 22, mass: 0.7 });

  return (
    <section id="gallery" aria-label="Photo gallery">
      {/* ── Desktop / motion: sticky horizontal scroll ── */}
      <div ref={ref} className="relative hidden h-[420vh] md:block">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          {/* Section header */}
          <div
            className="flex items-end justify-between px-10 pb-6 pt-24"
            style={{ borderBottom: `1px solid ${HAIRLINE}` }}
          >
            <h2
              className="font-serif font-light leading-none"
              style={{
                fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                color: TEXT,
              }}
            >
              The{" "}
              <span style={{ color: ACCENT2, fontStyle: "italic" }}>
                Gallery
              </span>
            </h2>
            <span
              className="text-[10px] tracking-[0.3em]"
              style={{ color: MUTED }}
            >
              SCROLL &rarr; A LIFE IN MOTION
            </span>
          </div>

          {/* Rail */}
          <motion.div
            style={{ x: reduce ? 0 : xSpring }}
            className="flex h-full items-center gap-8 px-10"
          >
            {RAIL.map((frame, i) => (
              <figure
                key={frame.src}
                className="group relative shrink-0 overflow-hidden"
                style={{
                  width: "23vw",
                  height: "64vh",
                  border: `1px solid ${HAIRLINE}`,
                  background: SURFACE,
                  boxShadow: "0 32px 80px -40px rgba(0,0,0,0.95)",
                }}
              >
                <Image
                  src={IMG(frame.src)}
                  alt={frame.cap}
                  fill
                  sizes="23vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  style={{ filter: "saturate(0.9) brightness(0.95)" }}
                />
                {/* Bottom scrim */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 52%, rgba(7,7,7,0.9) 100%)",
                  }}
                />
                {/* Gold top rule */}
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: ACCENT, opacity: 0.5 }}
                  aria-hidden
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-4">
                  <span
                    className="font-mono text-[9px] tracking-[0.24em]"
                    style={{ color: ACCENT }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-right font-serif text-[12px] italic leading-tight"
                    style={{ color: ACCENT2, maxWidth: "70%" }}
                  >
                    {frame.cap}
                  </span>
                </figcaption>
              </figure>
            ))}

            {/* End story card */}
            <div
              className="flex shrink-0 flex-col justify-center gap-5 pl-4"
              style={{ width: "26vw" }}
            >
              <span
                className="font-serif font-light leading-[1.1]"
                style={{
                  fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
                  color: TEXT,
                }}
              >
                Built from cafés, rooftops &amp; rice fields —
                <span style={{ color: ACCENT }}> shipped worldwide.</span>
              </span>
              <div
                className="h-px w-10"
                style={{ background: ACCENT }}
                aria-hidden
              />
              <a
                href="#about"
                className="text-[11px] tracking-[0.26em] transition-opacity hover:opacity-60"
                style={{ color: MUTED }}
              >
                READ THE STORY &darr;
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile / reduced-motion: vertical grid fallback ── */}
      <div className="px-5 py-20 md:hidden">
        <h2
          className="mb-10 font-serif font-light leading-none"
          style={{ fontSize: "clamp(2rem, 8vw, 3rem)", color: TEXT }}
        >
          The{" "}
          <span style={{ color: ACCENT2, fontStyle: "italic" }}>Gallery</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {RAIL.map((frame, i) => (
            <figure
              key={frame.src}
              className="relative overflow-hidden"
              style={{
                aspectRatio: "3/4",
                border: `1px solid ${HAIRLINE}`,
                background: SURFACE,
              }}
            >
              <Image
                src={IMG(frame.src)}
                alt={frame.cap}
                fill
                sizes="45vw"
                className="object-cover"
                style={{ filter: "saturate(0.9)" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(7,7,7,0.85) 100%)",
                }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                <span
                  className="font-mono text-[8px] tracking-[0.2em]"
                  style={{ color: ACCENT }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-serif text-[10px] italic"
                  style={{ color: ACCENT2 }}
                >
                  {frame.cap.split("/")[0].trim()}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   ABOUT
   ────────────────────────────────────────────────────────────── */
function About({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="about"
      className="relative border-t"
      style={{ borderColor: HAIRLINE }}
      aria-label="About"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-10 sm:py-40">
        <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
          {/* Portrait stack */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 68, damping: 18 }}
            className="relative"
          >
            {/* Primary portrait */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "4/5",
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <Image
                src={IMG(
                  "PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
                )}
                alt="Waseem Nasir — warm portrait, wood interior"
                fill
                sizes="(max-width:1024px) 90vw, 42vw"
                className="object-cover"
              />
              {/* Gold top rule */}
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: ACCENT, opacity: 0.6 }}
                aria-hidden
              />
            </div>

            {/* Inset: Bali terrace */}
            <div
              className="absolute -bottom-8 -right-4 overflow-hidden sm:-right-10"
              style={{
                width: "42%",
                aspectRatio: "1/1",
                border: `1px solid ${ACCENT}`,
                boxShadow: "0 20px 60px -28px rgba(0,0,0,0.95)",
              }}
            >
              <Image
                src={IMG(
                  "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                )}
                alt="Waseem working from a Bali terrace cafe"
                fill
                sizes="(max-width:640px) 38vw, 18vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              type: "spring",
              stiffness: 68,
              damping: 18,
              delay: 0.12,
            }}
            className="pb-12 lg:pb-0"
          >
            <span
              className="text-[10px] tracking-[0.32em]"
              style={{ color: ACCENT }}
            >
              ABOUT
            </span>
            <h2
              className="mt-5 font-serif font-light leading-[1.06]"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.1rem)",
                color: TEXT,
              }}
            >
              I&apos;m Waseem — I engineer the boring, expensive problems out of
              a business.
            </h2>
            <p
              className="mt-6 max-w-xl text-[15px] leading-relaxed"
              style={{ color: MUTED }}
            >
              For six years I&apos;ve built AI &amp; automation systems for
              growing companies across nine countries — quiet machinery that
              captures the lead, sends the follow-up, books the call, and
              handles the manual ops nobody wants to touch. No dashboards for
              the sake of dashboards. I find the leak and I engineer it shut.
            </p>

            {/* Capability grid */}
            <ul
              className="mt-9 grid gap-px sm:grid-cols-2"
              style={{ background: HAIRLINE }}
            >
              {[
                "n8n self-healing workflows",
                "Next.js + Stripe builds",
                "AEO / answer-engine reach",
                "WhatsApp &amp; inbox automation",
              ].map((s) => (
                <li
                  key={s}
                  className="px-5 py-4 text-[13px] tracking-wide"
                  style={{ background: SURFACE, color: TEXT }}
                  dangerouslySetInnerHTML={{
                    __html: `<span style="color:${ACCENT}">— </span>${s}`,
                  }}
                />
              ))}
            </ul>

            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block text-[12px] tracking-[0.2em] transition-opacity hover:opacity-70"
              style={{
                color: ACCENT2,
                borderBottom: `1px solid ${ACCENT}`,
                paddingBottom: "3px",
              }}
            >
              LET&apos;S FIND YOUR LEAK&nbsp;&rarr;
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   WORK — 4 case study cards
   ────────────────────────────────────────────────────────────── */
function WorkSection({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="work"
      className="relative border-t"
      style={{ borderColor: HAIRLINE }}
      aria-label="Selected work"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-28 sm:px-10 sm:py-36">
        {/* Header */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <h2
            className="font-serif font-light leading-none"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.4rem)", color: TEXT }}
          >
            Selected{" "}
            <span style={{ color: ACCENT2, fontStyle: "italic" }}>Work</span>
          </h2>
          <span
            className="text-[10px] tracking-[0.3em]"
            style={{ color: MUTED }}
          >
            NAMES PRIVATE · SYSTEMS REAL
          </span>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {WORK.map((w, i) => (
            <motion.article
              key={w.title}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 68,
                damping: 18,
                delay: i * 0.07,
              }}
              className="group relative overflow-hidden"
              style={{
                border: `1px solid ${HAIRLINE}`,
                background: SURFACE,
              }}
            >
              {/* Image */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={IMG(w.src)}
                  alt={w.title}
                  fill
                  sizes="(max-width:640px) 90vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  style={{ filter: "saturate(0.88) brightness(0.9)" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 38%, rgba(7,7,7,0.84) 100%)",
                  }}
                />
                <span
                  className="absolute left-4 top-4 font-mono text-[9px] tracking-[0.24em]"
                  style={{ color: ACCENT2 }}
                >
                  {w.place}
                </span>
              </div>

              {/* Copy */}
              <div className="p-7">
                {/* Gold rule */}
                <div
                  className="mb-5 h-px w-8"
                  style={{ background: ACCENT }}
                  aria-hidden
                />
                <h3
                  className="font-serif font-light leading-tight"
                  style={{
                    fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
                    color: TEXT,
                  }}
                >
                  {w.title}
                </h3>
                <p
                  className="mt-3 text-[14px] leading-relaxed"
                  style={{ color: MUTED }}
                >
                  {w.detail}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PROOF STRIP — large pale-gold numerals
   ────────────────────────────────────────────────────────────── */
function ProofStrip({ reduce }: { reduce: boolean }) {
  return (
    <section
      className="border-y"
      style={{ borderColor: HAIRLINE, background: SURFACE }}
      aria-label="Track record"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-12 px-5 py-20 sm:px-10 lg:grid-cols-4">
        {PROOF.map((p, i) => (
          <motion.div
            key={p.l}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 78,
              damping: 17,
              delay: i * 0.09,
            }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span
              className="font-serif font-light leading-none"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", color: ACCENT2 }}
            >
              {p.n}
            </span>
            <div
              className="h-px w-6"
              style={{ background: ACCENT }}
              aria-hidden
            />
            <span
              className="text-[10px] tracking-[0.26em]"
              style={{ color: MUTED }}
            >
              {p.l.toUpperCase()}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FULL-BLEED — Bali valley scenery parallax + quote
   ────────────────────────────────────────────────────────────── */
function FullBleed({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const ySpring = useSpring(yRaw, { stiffness: 58, damping: 22 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "80svh" }}
      aria-label="About Waseem"
    >
      <motion.div
        className="absolute inset-0 scale-[1.12]"
        style={{ y: reduce ? 0 : ySpring }}
      >
        <Image
          src={IMG("SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg")}
          alt="Bali green valley — where Waseem works and ships"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.82) brightness(0.58)" }}
        />
      </motion.div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{ background: "rgba(7,7,7,0.46)" }}
      />

      {/* Quote */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1050px] flex-col items-center justify-center px-6 text-center">
        <motion.blockquote
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 68, damping: 18 }}
        >
          <p
            className="font-serif font-light italic leading-[1.18]"
            style={{ fontSize: "clamp(1.6rem, 4.2vw, 3.2rem)", color: TEXT }}
          >
            &ldquo;The best automation is the kind you forget is even
            running.&rdquo;
          </p>
          <footer
            className="mt-6 text-[10px] tracking-[0.32em]"
            style={{ color: ACCENT }}
          >
            &mdash; WASEEM NASIR, SKYNETLABS
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   CTA SECTION
   ────────────────────────────────────────────────────────────── */
function CTASection({ reduce }: { reduce: boolean }) {
  return (
    <section
      className="relative px-5 py-36 sm:px-10 sm:py-48"
      aria-label="Book a call"
    >
      {/* Subtle bronze rule above */}
      <div
        className="mx-auto mb-16 max-w-[1440px] h-px"
        style={{ background: HAIRLINE }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1060px] text-center">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 68, damping: 18 }}
          className="font-serif font-light leading-[1.02]"
          style={{ fontSize: "clamp(2.2rem, 7.5vw, 5.8rem)", color: TEXT }}
        >
          Let&apos;s make your
          <br />
          <span style={{ color: ACCENT2, fontStyle: "italic" }}>
            busywork disappear.
          </span>
        </motion.h2>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 78,
            damping: 18,
            delay: 0.12,
          }}
          className="mt-14"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-12 py-5 text-[13px] font-medium tracking-[0.16em] transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: ACCENT, color: "#130e04" }}
          >
            BOOK A 30-MIN CALL&nbsp;&rarr;
          </Link>

          <p
            className="mt-8 text-[11px] tracking-[0.2em]"
            style={{ color: MUTED }}
          >
            OR EMAIL{" "}
            <a
              href="mailto:waseembali2k26@gmail.com"
              className="underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
              style={{ color: ACCENT2 }}
            >
              waseembali2k26@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER
   ────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="border-t px-5 py-12 sm:px-10"
      style={{ borderColor: HAIRLINE }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <span
          className="font-serif text-[13px] tracking-[0.22em]"
          style={{ color: ACCENT2 }}
        >
          WASEEM&nbsp;NASIR
        </span>

        <nav
          className="flex flex-wrap gap-8 text-[11px] tracking-[0.22em]"
          aria-label="Footer navigation"
        >
          <a
            href="https://github.com/waseemnasir2k26"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            style={{ color: MUTED }}
          >
            GITHUB
          </a>
          <a
            href="https://skynetjoe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            style={{ color: MUTED }}
          >
            SKYNETJOE.COM
          </a>
          <a
            href="mailto:waseembali2k26@gmail.com"
            className="transition-opacity hover:opacity-60"
            style={{ color: MUTED }}
          >
            EMAIL
          </a>
        </nav>

        <span
          className="text-[10px] tracking-[0.18em]"
          style={{ color: MUTED }}
        >
          &copy; 2026&nbsp;&middot;&nbsp;BUILT IN BALI
        </span>
      </div>
    </footer>
  );
}
