"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
} from "framer-motion";

/* ============================================================
   BRAND TOKENS — gallery-exhibition variant
   Canvas: gallery white  |  Text: charcoal  |  Meta: warm taupe
   ============================================================ */
const CANVAS = "#FCFBF9"; // gallery white
const TEXT = "#1A1A1A"; // charcoal
const TAUPE = "#8A7968"; // warm taupe — captions / meta / plate labels
const RULE = "rgba(138,121,104,0.22)"; // hairline
const ACCENT = "#5C5043"; // deep taupe for interactive / emphasis
const WHITE = "#FFFFFF";

const IMG = (f: string) => `/img/pro/${f}`;
const CTA = "https://skynetjoe.com/discovery-call";

/* ============================================================
   PHOTO SELECTIONS  (22 total)
   ============================================================ */

/* Hero — full-bleed landscape */
const HERO_IMG = "SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg";

/* Intro section — supporting portrait */
const INTRO_IMG =
  "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg";

/* Masonry wall — 8 TRAVEL/LIFESTYLE images */
const MASONRY: {
  src: string;
  alt: string;
  plate: string;
  span?: "tall" | "wide" | "normal";
}[] = [
  {
    src: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    alt: "Waseem Nasir on a mountain ridge in Khyber Pakhtunkhwa, tan knit sweater",
    plate: "PLATE 01 · KPK HIGHLANDS · 2026",
    span: "tall",
  },
  {
    src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    alt: "Waseem arms spread at Nusa Penida cliffs, Bali",
    plate: "PLATE 02 · NUSA PENIDA · 2025",
    span: "normal",
  },
  {
    src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
    alt: "Waseem standing under neon 'no limits' sign, black outfit",
    plate: "PLATE 03 · CANGGU, BALI · 2026",
    span: "tall",
  },
  {
    src: "TRAVEL-2026-03-29-trail-selfie-backpack-mountain-sky.jpg",
    alt: "Waseem trail selfie with backpack against mountain sky",
    plate: "PLATE 04 · NORTHERN PAKISTAN · 2026",
    span: "wide",
  },
  {
    src: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
    alt: "Waseem standing on a jungle bridge with sunglasses",
    plate: "PLATE 05 · UBUD, BALI · 2026",
    span: "normal",
  },
  {
    src: "LIFESTYLE-2025-08-08-rattan-chair-headphones-pavilion-relaxed.jpg",
    alt: "Waseem relaxed in rattan chair with headphones in a pavilion",
    plate: "PLATE 06 · BALI · 2025",
    span: "normal",
  },
  {
    src: "TRAVEL-island-boat-thailand-hat-shades.jpg",
    alt: "Waseem on a boat in Thailand wearing hat and sunglasses",
    plate: "PLATE 07 · THAILAND · 2024",
    span: "tall",
  },
  {
    src: "TRAVEL-2026-05-24-heart-frame-viewpoint-seated-sunglasses.jpg",
    alt: "Waseem seated at scenic viewpoint, framed heart shape, sunglasses",
    plate: "PLATE 08 · BALI HIGHLANDS · 2026",
    span: "normal",
  },
];

/* Horizontal pinned rail — 8 exhibition plates */
const RAIL: { src: string; alt: string; plate: string; caption: string }[] = [
  {
    src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
    alt: "Waseem working on laptop at rooftop cafe above the clouds",
    plate: "I",
    caption: "Shipping above the clouds — Ubud, Bali",
  },
  {
    src: "PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
    alt: "Waseem smiling in rice field with palms and mountain backdrop",
    plate: "II",
    caption: "Between the fields — Tegallalang, Bali",
  },
  {
    src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    alt: "Waseem smiling at rooftop cafe with laptop and dragonfruit smoothie",
    plate: "III",
    caption: "Quiet systems, loud results — Seminyak",
  },
  {
    src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
    alt: "Waseem with backpack and sunglasses on hilltop overlooking city",
    plate: "IV",
    caption: "Nine countries, still counting — Pakistan",
  },
  {
    src: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    alt: "Waseem confident arms crossed with sunglasses, table pose",
    plate: "V",
    caption: "The operator — Bali, 2026",
  },
  {
    src: "CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg",
    alt: "Waseem candid on couch with laptop, brick wall cafe",
    plate: "VI",
    caption: "The work, everywhere — 2025",
  },
  {
    src: "TRAVEL-2025-05-31-broken-beach-arch-selfie-foliage.jpg",
    alt: "Waseem selfie at Broken Beach arch with foliage, Nusa Penida",
    plate: "VII",
    caption: "Broken Beach, Nusa Penida — 2025",
  },
  {
    src: "PORTRAIT-2026-05-24-profile-sunglasses-jungle-ridge.jpg",
    alt: "Waseem profile shot with sunglasses on jungle ridge",
    plate: "VIII",
    caption: "Edge of the jungle — Bali Highlands",
  },
];

/* Work editorial — 4 CAFE-WORK / WORK images */
const WORK: {
  src: string;
  alt: string;
  location: string;
  title: string;
  detail: string;
}[] = [
  {
    src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    alt: "Waseem with dual laptops showing analytics dashboard and coffee",
    location: "Miami, USA",
    title: "Physical therapy clinic",
    detail:
      "Next.js + Stripe booking — patients book and pay in a single seamless flow.",
  },
  {
    src: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    alt: "Waseem focused on phone at coworking desk, candid",
    location: "United States",
    title: "Freight lead system",
    detail:
      "Meta CAPI wiring so every ad dollar is tracked cleanly to a booked load.",
  },
  {
    src: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    alt: "Waseem typing at night cafe with backlit keyboard, candid",
    location: "Europe",
    title: "Inbox automation engine",
    detail:
      "47-step n8n pipeline that self-heals, retries, and never drops a lead.",
  },
  {
    src: "WORK-packing-gift-basket-laptop-desk.jpg",
    alt: "Waseem packing gift basket at desk with laptop",
    location: "Italy",
    title: "Family trip portal",
    detail:
      "GDPR-clean WordPress build for a private travel concierge serving families.",
  },
];

/* Real proof numbers */
const PROOF = [
  { n: 180, suffix: "+", label: "Workflows built" },
  { n: 40, suffix: "+", label: "Sites shipped" },
  { n: 9, suffix: "", label: "Countries served" },
  { n: 2019, suffix: "", label: "Building since" },
];

/* ============================================================
   COUNT-UP HOOK
   ============================================================ */
function useCountUp(target: number, duration = 1.6, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const raf = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setValue(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

/* ============================================================
   PAGE
   ============================================================ */
export default function GalleryExhibition() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Override global dark layout — gallery white canvas */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: CANVAS }}
        aria-hidden
      />

      {/* Scroll-progress rail — charcoal on gallery-white */}
      <ScrollRail />

      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-20 rounded bg-charcoal px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
        style={{ background: TEXT, color: WHITE }}
      >
        Skip to content
      </a>

      <main
        id="main-content"
        className="relative z-10"
        style={{ background: CANVAS, color: TEXT }}
      >
        <TopBar reduce={!!reduce} />
        <ExhibitionHero reduce={!!reduce} />
        <IntroSection reduce={!!reduce} />
        <ProofBand reduce={!!reduce} />
        <MasonryWall reduce={!!reduce} />
        <HorizontalRail reduce={!!reduce} />
        <WorkEditorial reduce={!!reduce} />
        <CTASection reduce={!!reduce} />
        <SiteFooter />
      </main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   SCROLL RAIL — thin charcoal progress bar, left edge
   ────────────────────────────────────────────────────────────── */
function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-50 w-[2px] origin-top"
      style={{
        scaleY,
        height: "100vh",
        background: TEXT,
        transformOrigin: "top",
      }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   TOP BAR — minimal, gallery-white bg
   ────────────────────────────────────────────────────────────── */
function TopBar({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "rgba(252,251,249,0.88)",
        borderBottom: `1px solid ${RULE}`,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
        {/* Wordmark */}
        <span
          className="font-mono text-[11px] tracking-[0.32em] uppercase"
          style={{ color: TAUPE }}
        >
          Waseem&nbsp;Nasir
        </span>

        {/* Nav links */}
        <nav
          className="hidden items-center gap-9 sm:flex"
          aria-label="Primary navigation"
        >
          {(["Exhibition", "About", "Work"] as const).map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="font-mono text-[10px] tracking-[0.28em] uppercase transition-opacity hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              style={{ color: TAUPE }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Single CTA */}
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] tracking-[0.24em] uppercase transition-all hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          style={{
            color: TEXT,
            borderBottom: `1px solid ${TEXT}`,
            paddingBottom: "2px",
          }}
        >
          Book a call
        </Link>
      </div>
    </motion.header>
  );
}

/* ──────────────────────────────────────────────────────────────
   EXHIBITION HERO — full-bleed valley landscape + serif name
   Clip-path wipe reveal. Parallax on scroll. Headline never opacity:0.
   ────────────────────────────────────────────────────────────── */
function ExhibitionHero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yImgSpring = useSpring(yImg, { stiffness: 72, damping: 22 });
  const overlayFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
      aria-label="Exhibition hero"
    >
      {/* Full-bleed landscape parallax */}
      <motion.div
        className="absolute inset-0 scale-[1.1]"
        style={{ y: reduce ? 0 : yImgSpring }}
      >
        <Image
          src={IMG(HERO_IMG)}
          alt="Bali green valley panorama — Waseem's base of operations"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "saturate(0.9) brightness(0.72)" }}
        />
      </motion.div>

      {/* Gradient — ensures text legibility bottom and top */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(26,26,26,0.42) 0%, transparent 22%, transparent 52%, rgba(26,26,26,0.82) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity: reduce ? 1 : overlayFade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-20 pt-28 sm:px-14 sm:pb-28"
      >
        {/* Mono dateline — plate label style */}
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 20,
            delay: 0.2,
          }}
          className="mb-6 inline-flex items-center gap-4 font-mono text-[10px] tracking-[0.38em] uppercase"
          style={{ color: "rgba(252,251,249,0.65)" }}
        >
          <span
            className="inline-block h-px w-10"
            style={{ background: "rgba(252,251,249,0.4)" }}
            aria-hidden
          />
          Founder · AI Automation · Est.&nbsp;2019
        </motion.span>

        {/* Name — Instrument Serif display — NEVER opacity:0 for LCP */}
        <h1
          className="font-serif font-light leading-[0.92]"
          style={{
            fontSize: "clamp(3.4rem, 10vw, 8.5rem)",
            color: CANVAS,
            letterSpacing: "-0.01em",
          }}
        >
          {["Waseem", "Nasir"].map((word, i) => (
            <motion.span
              key={word}
              initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{
                duration: 0.9,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.38 + i * 0.18,
              }}
              className="block"
            >
              {i === 1 ? <em style={{ fontStyle: "italic" }}>{word}</em> : word}
            </motion.span>
          ))}
        </h1>

        {/* Mono descriptor */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.88,
          }}
          className="mt-8 max-w-md font-mono text-[13px] leading-loose tracking-[0.06em]"
          style={{ color: "rgba(252,251,249,0.6)" }}
        >
          Building AI &amp; automation systems that quietly solve real business
          problems — across nine countries, from cafés and rooftops.
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 1.05,
          }}
          className="mt-10 flex items-center gap-8"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-[0.28em] uppercase transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              color: CANVAS,
              borderBottom: `1px solid rgba(252,251,249,0.55)`,
              paddingBottom: "3px",
            }}
          >
            Book a discovery call →
          </Link>
          <a
            href="#exhibition"
            className="font-mono text-[10px] tracking-[0.28em] uppercase transition-opacity hover:opacity-50"
            style={{ color: "rgba(252,251,249,0.45)" }}
          >
            Enter the exhibition ↓
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade into canvas */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        aria-hidden
        style={{
          background: `linear-gradient(to bottom, transparent, ${CANVAS})`,
        }}
      />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   INTRO SECTION — who Waseem is, one supporting portrait
   ────────────────────────────────────────────────────────────── */
function IntroSection({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 py-32 sm:px-14 lg:grid-cols-[1fr_1.1fr] lg:py-44"
      aria-label="About"
    >
      {/* Portrait column */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
        className="relative"
      >
        {/* Clip-path wipe reveal on the image container */}
        <motion.div
          initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/4" }}
        >
          <Image
            src={IMG(INTRO_IMG)}
            alt="Waseem Nasir — confident pose, black prince coat, balcony rail, sunglasses"
            fill
            sizes="(max-width:1024px) 90vw, 44vw"
            className="object-cover object-top"
          />
          {/* Plate label overlay */}
          <div
            className="absolute inset-x-0 bottom-0 p-5"
            style={{
              background:
                "linear-gradient(to top, rgba(26,26,26,0.72) 0%, transparent 100%)",
            }}
          >
            <span
              className="font-mono text-[9px] tracking-[0.36em] uppercase"
              style={{ color: "rgba(252,251,249,0.65)" }}
            >
              Waseem Nasir · Founder, SkynetLabs · Bali, 2026
            </span>
          </div>
        </motion.div>

        {/* Thin rule accent below image */}
        <div
          className="mt-4 h-px w-12"
          style={{ background: TAUPE }}
          aria-hidden
        />
      </motion.div>

      {/* Copy column */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.16 }}
        className="lg:pb-8"
      >
        <span
          className="font-mono text-[10px] tracking-[0.36em] uppercase"
          style={{ color: TAUPE }}
        >
          The Founder
        </span>

        <h2
          className="mt-6 font-serif font-light leading-[1.05]"
          style={{
            fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
            color: TEXT,
          }}
        >
          I engineer the boring,
          <br />
          <em style={{ fontStyle: "italic" }}>expensive problems</em>
          <br />
          out of a business.
        </h2>

        <p
          className="mt-7 max-w-[460px] text-[16px] leading-[1.8]"
          style={{ color: TAUPE }}
        >
          For six years I&apos;ve built AI &amp; automation systems for growing
          companies across nine countries — quiet machinery that captures the
          lead, sends the follow-up, books the call, and handles the manual ops
          nobody wants to touch.
        </p>

        <p
          className="mt-5 max-w-[460px] text-[16px] leading-[1.8]"
          style={{ color: TAUPE }}
        >
          No dashboards for the sake of dashboards. No fabricated case studies.
          I find the leak and engineer it shut.
        </p>

        {/* Capability list */}
        <ul
          className="mt-9 space-y-3 border-t"
          style={{ borderColor: RULE }}
          aria-label="Core capabilities"
        >
          {[
            "n8n self-healing workflows",
            "Next.js + Stripe builds",
            "AEO / answer-engine optimisation",
            "WhatsApp &amp; inbox automation",
          ].map((cap, i) => (
            <li
              key={i}
              className="flex items-center gap-4 border-b py-3 font-mono text-[12px] tracking-[0.1em]"
              style={{ borderColor: RULE, color: TEXT }}
            >
              <span
                className="shrink-0 font-mono text-[9px] tracking-[0.3em]"
                style={{ color: TAUPE }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span dangerouslySetInnerHTML={{ __html: cap }} />
            </li>
          ))}
        </ul>

        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.24em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          style={{
            color: TEXT,
            borderBottom: `1px solid ${TEXT}`,
            paddingBottom: "3px",
          }}
        >
          Book a discovery call →
        </Link>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   PROOF BAND — count-up mono numerals, ruled dividers
   ────────────────────────────────────────────────────────────── */
function ProofBand({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      className="border-y"
      style={{ borderColor: RULE }}
      aria-label="Track record"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
        {PROOF.map((p, i) => (
          <ProofCell
            key={p.label}
            target={p.n}
            suffix={p.suffix}
            label={p.label}
            delay={i * 0.12}
            active={inView}
            reduce={!!reduce}
            last={i === PROOF.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function ProofCell({
  target,
  suffix,
  label,
  delay,
  active,
  reduce,
  last,
}: {
  target: number;
  suffix: string;
  label: string;
  delay: number;
  active: boolean;
  reduce: boolean;
  last: boolean;
}) {
  const val = useCountUp(target, 1.8, active && !reduce);
  const display = reduce ? target : val;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 70, damping: 17, delay }}
      className="flex flex-col items-center gap-3 py-14 text-center"
      style={{
        borderRight: last ? "none" : `1px solid ${RULE}`,
      }}
    >
      <span
        className="font-mono font-light leading-none tabular-nums"
        style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)", color: TEXT }}
        aria-label={`${target}${suffix} ${label}`}
      >
        {display}
        {suffix}
      </span>
      <div className="h-px w-6" style={{ background: TAUPE }} aria-hidden />
      <span
        className="font-mono text-[10px] tracking-[0.3em] uppercase"
        style={{ color: TAUPE }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MASONRY WALL — 3-col CSS masonry, TRAVEL/LIFESTYLE photos
   B/W → color on hover. Clip-path wipe stagger on enter.
   ────────────────────────────────────────────────────────────── */
function MasonryWall({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="exhibition"
      className="border-t px-5 py-24 sm:px-14 sm:py-36"
      style={{ borderColor: RULE }}
      aria-label="Exhibition wall"
    >
      {/* Section header */}
      <div className="mx-auto mb-16 flex max-w-[1440px] items-end justify-between">
        <div>
          <span
            className="font-mono text-[10px] tracking-[0.38em] uppercase"
            style={{ color: TAUPE }}
          >
            Exhibition
          </span>
          <h2
            className="mt-3 font-serif font-light leading-none"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              color: TEXT,
            }}
          >
            A Life in <em style={{ fontStyle: "italic" }}>Motion</em>
          </h2>
        </div>
        <span
          className="hidden font-mono text-[9px] tracking-[0.36em] uppercase sm:block"
          style={{ color: TAUPE }}
        >
          Nine countries · Still counting
        </span>
      </div>

      {/* Masonry grid — CSS columns */}
      <div
        ref={ref}
        className="mx-auto max-w-[1440px] columns-1 sm:columns-2 lg:columns-3 [column-gap:20px]"
      >
        {MASONRY.map((photo, i) => (
          <MasonryCard
            key={photo.src}
            photo={photo}
            index={i}
            inView={inView}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  );
}

function MasonryCard({
  photo,
  index,
  inView,
  reduce,
}: {
  photo: (typeof MASONRY)[number];
  index: number;
  inView: boolean;
  reduce: boolean;
}) {
  // Determine aspect ratio from span type
  const aspectMap = {
    tall: "3/4.2",
    wide: "16/9",
    normal: "3/4",
  };
  const aspect = aspectMap[photo.span ?? "normal"];

  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 62,
        damping: 18,
        delay: index * 0.08,
      }}
      className="group relative mb-5 overflow-hidden"
      style={{
        breakInside: "avoid",
        aspectRatio: aspect,
        borderRadius: "1px",
      }}
    >
      {/* Image with B/W → color transition */}
      <Image
        src={IMG(photo.src)}
        alt={photo.alt}
        fill
        sizes="(max-width:640px) 100vw, (max-width:1024px) 45vw, 30vw"
        className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
        style={{
          filter: reduce ? "none" : "grayscale(100%) brightness(0.95)",
          transition: reduce ? "none" : "filter 0.6s ease, transform 0.7s ease",
        }}
        onMouseEnter={(e) => {
          if (!reduce)
            (e.currentTarget as HTMLImageElement).style.filter =
              "grayscale(0%) brightness(1)";
        }}
        onMouseLeave={(e) => {
          if (!reduce)
            (e.currentTarget as HTMLImageElement).style.filter =
              "grayscale(100%) brightness(0.95)";
        }}
      />

      {/* Bottom scrim */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,26,0.68) 0%, transparent 100%)",
        }}
      />

      {/* Museum plate label */}
      <figcaption
        className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4"
        aria-label={photo.plate}
      >
        <span
          className="font-mono text-[8px] tracking-[0.36em] uppercase"
          style={{ color: "rgba(252,251,249,0.75)" }}
        >
          {photo.plate}
        </span>
      </figcaption>
    </motion.figure>
  );
}

/* ──────────────────────────────────────────────────────────────
   HORIZONTAL PINNED RAIL — exhibition plates
   Desktop: sticky section, vertical scroll drives x translation
   Mobile / reduced-motion: vertical stacked fallback
   ────────────────────────────────────────────────────────────── */
function HorizontalRail({ reduce }: { reduce: boolean }) {
  return (
    <section aria-label="The exhibition rail">
      {/* Desktop sticky pin */}
      <DesktopRail reduce={reduce} />
      {/* Mobile / reduced-motion vertical fallback */}
      <MobileRailFallback reduce={reduce} />
    </section>
  );
}

function DesktopRail({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Pan to -82% so last card is fully in view
  const xRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-82%"]);
  const xSpring = useSpring(xRaw, { stiffness: 52, damping: 22, mass: 0.8 });

  return (
    /* 500vh tall — enough scroll to traverse all 8 plates */
    <div
      ref={ref}
      className={`relative h-[500vh] ${reduce ? "hidden" : "hidden md:block"}`}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Section label */}
        <div
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-14 py-5"
          style={{ borderBottom: `1px solid ${RULE}` }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.38em] uppercase"
            style={{ color: TAUPE }}
          >
            The Rail · 8 Plates
          </span>
          <span
            className="font-mono text-[9px] tracking-[0.28em] uppercase"
            style={{ color: TAUPE }}
          >
            Scroll → to advance
          </span>
        </div>

        {/* Horizontally translating rail */}
        <motion.div
          style={{ x: xSpring, willChange: "transform" }}
          className="flex h-full items-center gap-7 pt-16 pl-14"
        >
          {RAIL.map((frame, i) => (
            <ExhibitionPlate key={frame.src} frame={frame} index={i} />
          ))}

          {/* Closing text card */}
          <div
            className="flex shrink-0 flex-col justify-center gap-5 pr-14"
            style={{ minWidth: "28vw" }}
          >
            <span
              className="font-mono text-[9px] tracking-[0.4em] uppercase"
              style={{ color: TAUPE }}
            >
              End of Rail
            </span>
            <h3
              className="font-serif font-light leading-[1.1]"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
                color: TEXT,
              }}
            >
              Built from cafés, rooftops &amp; rice fields —
              <em style={{ fontStyle: "italic" }}> shipped worldwide.</em>
            </h3>
            <div
              className="h-px w-10"
              style={{ background: TAUPE }}
              aria-hidden
            />
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.28em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              style={{ color: TEXT }}
            >
              Book a discovery call →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ExhibitionPlate({
  frame,
  index,
}: {
  frame: (typeof RAIL)[number];
  index: number;
}) {
  return (
    <figure
      className="group relative shrink-0 overflow-hidden"
      style={{
        width: "22vw",
        height: "72vh",
        border: `1px solid ${RULE}`,
        background: "#f0ede8",
      }}
    >
      <Image
        src={IMG(frame.src)}
        alt={frame.alt}
        fill
        sizes="22vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* Bottom scrim for caption */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, transparent 55%, rgba(26,26,26,0.78) 100%)",
        }}
      />

      {/* Top plate number */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: TAUPE, opacity: 0.5 }}
        aria-hidden
      />
      <span
        className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.36em]"
        style={{ color: "rgba(252,251,249,0.7)" }}
        aria-hidden
      >
        PLATE&nbsp;{frame.plate}
      </span>

      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <span
          className="block font-mono text-[9px] tracking-[0.28em] uppercase leading-relaxed"
          style={{ color: "rgba(252,251,249,0.65)" }}
        >
          {frame.caption}
        </span>
      </figcaption>

      {/* Thin bottom rule */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: TAUPE, opacity: 0.3 }}
        aria-hidden
      />
    </figure>
  );
}

function MobileRailFallback({ reduce }: { reduce: boolean }) {
  return (
    <div
      className={`border-t px-5 py-20 ${reduce ? "block" : "block md:hidden"}`}
      style={{ borderColor: RULE }}
    >
      {/* Header */}
      <div className="mb-10">
        <span
          className="font-mono text-[10px] tracking-[0.36em] uppercase"
          style={{ color: TAUPE }}
        >
          The Rail
        </span>
        <h2
          className="mt-3 font-serif font-light leading-none"
          style={{ fontSize: "clamp(2rem, 7vw, 3rem)", color: TEXT }}
        >
          Eight <em style={{ fontStyle: "italic" }}>Plates</em>
        </h2>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-2 gap-4">
        {RAIL.map((frame, i) => (
          <figure
            key={frame.src}
            className="relative overflow-hidden"
            style={{ aspectRatio: "3/4", border: `1px solid ${RULE}` }}
          >
            <Image
              src={IMG(frame.src)}
              alt={frame.alt}
              fill
              sizes="46vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "linear-gradient(to top, rgba(26,26,26,0.72) 0%, transparent 55%)",
              }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-3">
              <span
                className="font-mono text-[8px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(252,251,249,0.7)" }}
              >
                {frame.plate}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   WORK EDITORIAL — 4 case studies with CAFE-WORK / WORK photos
   ────────────────────────────────────────────────────────────── */
function WorkEditorial({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="work"
      className="border-t px-5 py-24 sm:px-14 sm:py-36"
      style={{ borderColor: RULE }}
      aria-label="Selected work"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-16 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span
              className="font-mono text-[10px] tracking-[0.36em] uppercase"
              style={{ color: TAUPE }}
            >
              The Work
            </span>
            <h2
              className="mt-3 font-serif font-light leading-none"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: TEXT }}
            >
              What I <em style={{ fontStyle: "italic" }}>Build</em>
            </h2>
          </div>
          <span
            className="hidden font-mono text-[9px] tracking-[0.3em] uppercase sm:block"
            style={{ color: TAUPE }}
          >
            Names private · Systems real
          </span>
        </div>

        {/* 2×2 grid */}
        <div className="grid gap-8 sm:grid-cols-2">
          {WORK.map((w, i) => (
            <WorkCard key={w.title} w={w} index={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({
  w,
  index,
  reduce,
}: {
  w: (typeof WORK)[number];
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 62,
        damping: 18,
        delay: index * 0.09,
      }}
      className="group"
      style={{ border: `1px solid ${RULE}` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={IMG(w.src)}
          alt={w.alt}
          fill
          sizes="(max-width:640px) 90vw, 45vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "linear-gradient(to bottom, transparent 42%, rgba(252,251,249,0.88) 100%)",
          }}
        />
        {/* Location mono label */}
        <span
          className="absolute left-4 top-4 font-mono text-[9px] tracking-[0.3em] uppercase"
          style={{
            color: TAUPE,
            background: "rgba(252,251,249,0.85)",
            padding: "3px 7px",
          }}
        >
          {w.location}
        </span>
      </div>

      {/* Copy */}
      <div className="p-7">
        <div
          className="mb-5 h-px w-8"
          style={{ background: TAUPE }}
          aria-hidden
        />
        <h3
          className="font-serif font-light leading-tight"
          style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.75rem)", color: TEXT }}
        >
          {w.title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.75]" style={{ color: TAUPE }}>
          {w.detail}
        </p>
      </div>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────────
   FULL-BLEED PARALLAX INTERLUDE
   (between work and CTA — one big scenery moment)
   ────────────────────────────────────────────────────────────── */
function ParallaxInterlude({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const ySpring = useSpring(yRaw, { stiffness: 55, damping: 22 });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "50svh" }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 scale-[1.12]"
        style={{ y: reduce ? 0 : ySpring }}
      >
        <Image
          src={IMG("TRAVEL-2026-03-29-trail-selfie-backpack-mountain-sky.jpg")}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "saturate(0.75) brightness(0.55)" }}
        />
      </motion.div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(26,26,26,0.35)" }}
      />
      {/* Fade edges into canvas */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${CANVAS}, transparent)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${CANVAS}, transparent)`,
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   CTA SECTION
   ────────────────────────────────────────────────────────────── */
function CTASection({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <>
      <ParallaxInterlude reduce={reduce} />
      <section
        ref={ref}
        className="border-t px-5 py-36 sm:px-14 sm:py-52"
        style={{ borderColor: RULE }}
        aria-label="Book a call"
      >
        <div className="mx-auto max-w-[980px] text-center">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="font-mono text-[10px] tracking-[0.38em] uppercase"
            style={{ color: TAUPE }}
          >
            One conversation is all it takes
          </motion.span>

          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              type: "spring",
              stiffness: 68,
              damping: 18,
              delay: 0.1,
            }}
            className="mt-6 font-serif font-light leading-[1.0]"
            style={{ fontSize: "clamp(2.6rem, 8vw, 6.4rem)", color: TEXT }}
          >
            Let&apos;s make your
            <br />
            <em style={{ fontStyle: "italic" }}>busywork disappear.</em>
          </motion.h2>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              type: "spring",
              stiffness: 78,
              damping: 18,
              delay: 0.22,
            }}
            className="mt-14 flex flex-col items-center gap-5"
          >
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border px-10 py-4 font-mono text-[12px] tracking-[0.22em] uppercase transition-all hover:bg-[#1A1A1A] hover:text-[#FCFBF9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current active:scale-[0.98]"
              style={{ borderColor: TEXT, color: TEXT }}
            >
              Book a discovery call →
            </Link>

            <p
              className="font-mono text-[10px] tracking-[0.22em] uppercase"
              style={{ color: TAUPE }}
            >
              or email{" "}
              <a
                href="mailto:waseembali2k26@gmail.com"
                className="transition-opacity hover:opacity-60 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1"
                style={{ color: TEXT }}
              >
                waseembali2k26@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER
   ────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer
      className="border-t px-5 py-10 sm:px-14"
      style={{ borderColor: RULE }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <span
          className="font-mono text-[11px] tracking-[0.3em] uppercase"
          style={{ color: TAUPE }}
        >
          Waseem&nbsp;Nasir
        </span>

        <nav className="flex flex-wrap gap-8" aria-label="Footer navigation">
          {[
            {
              href: "https://github.com/waseemnasir2k26",
              label: "GitHub",
            },
            { href: "https://skynetjoe.com", label: "SkynetJoe.com" },
            { href: "mailto:waseembali2k26@gmail.com", label: "Email" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="font-mono text-[10px] tracking-[0.24em] uppercase transition-opacity hover:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
              style={{ color: TAUPE }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <span
          className="font-mono text-[9px] tracking-[0.22em] uppercase"
          style={{ color: TAUPE }}
        >
          &copy; 2026 · Gallery Exhibition
        </span>
      </div>
    </footer>
  );
}
