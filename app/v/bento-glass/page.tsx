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
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";

/* ============================================================
   BENTO-GLASS VARIANT — self-contained, no shared-file edits
   Palette: deep slate canvas · frost text · cool indigo accent
   Signature: asymmetric bento photo grid — the page centrepiece
   Photos used (17 distinct):
     Hero portrait:  PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg
     Bento large:    PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg
     Bento work 1:   CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg
     Bento work 2:   CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg
     Bento travel:   TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg
     Bento rooftop:  CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg
     Bento lifestyle:LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg
     Marquee 1:      TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg
     Marquee 2:      CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg
     Marquee 3:      TRAVEL-2025-05-31-broken-beach-arch-selfie-foliage.jpg
     Marquee 4:      TRAVEL-google-office-sign-cream-outfit.jpg
     Process 1:      CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg
     Process 2:      WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg
     Process 3:      CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg
     Full-bleed:     SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg
     About inset:    PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg
     Bento map cell: TRAVEL-sentosa-sign-hedge-cream-set.jpg
   ============================================================ */

/* ── palette tokens ── */
const BG = "#14171C";
const SURFACE = "#1C2029";
const SURFACE_HI = "#222835";
const FROST = "#F5F7FA";
const MUTED = "#7A849A";
const ACCENT = "#5B6CFF"; // cool indigo — used sparingly
const ACCENT_DIM = "rgba(91,108,255,0.18)";
const HAIRLINE = "rgba(91,108,255,0.14)";
const GLASS_BG = "rgba(28,32,41,0.72)";
const GLASS_BORDER = "rgba(255,255,255,0.07)";

/* ── constants ── */
const IMG = (f: string) => `/img/pro/${f}`;
const CTA = "https://skynetjoe.com/discovery-call";

/* ── proof numbers (real only) ── */
const PROOF = [
  { n: 180, suffix: "+", label: "Workflows built" },
  { n: 40, suffix: "+", label: "Sites shipped" },
  { n: 9, suffix: "", label: "Countries served" },
  { n: 2019, suffix: "", label: "Building since" },
] as const;

/* ── process steps ── */
const PROCESS: {
  n: string;
  title: string;
  body: string;
  src: string;
  alt: string;
}[] = [
  {
    n: "01",
    title: "Audit the leak",
    body: "One 30-min call. I map every manual touch-point, missed follow-up, and broken handoff. You leave with a written diagnosis — free, no obligation.",
    src: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    alt: "Waseem working from a Bali terrace, auditing client systems",
  },
  {
    n: "02",
    title: "Engineer the fix",
    body: "n8n pipelines, Next.js builds, WhatsApp bots, Stripe flows — I pick the right tool, not the fashionable one. Delivered in weeks, not quarters.",
    src: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    alt: "Waseem at coworking desk, deep in build mode",
  },
  {
    n: "03",
    title: "Ship and step back",
    body: "Self-healing systems that run without you watching. I hand off documentation, set monitoring, then get out of the way so you can focus on actual growth.",
    src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    alt: "Waseem on rooftop cafe, smiling after a clean ship",
  },
];

/* ── marquee photo strip ── */
const MARQUEE_PHOTOS: { src: string; alt: string }[] = [
  {
    src: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    alt: "Mountain ridge, Pakistan",
  },
  {
    src: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
    alt: "Rooftop cafe session, Bali",
  },
  {
    src: "TRAVEL-2025-05-31-broken-beach-arch-selfie-foliage.jpg",
    alt: "Broken beach arch, Nusa Penida",
  },
  {
    src: "TRAVEL-google-office-sign-cream-outfit.jpg",
    alt: "Google office visit",
  },
  {
    src: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    alt: "Mountain ridge, Pakistan",
  },
  {
    src: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
    alt: "Rooftop cafe session, Bali",
  },
  {
    src: "TRAVEL-2025-05-31-broken-beach-arch-selfie-foliage.jpg",
    alt: "Broken beach arch, Nusa Penida",
  },
  {
    src: "TRAVEL-google-office-sign-cream-outfit.jpg",
    alt: "Google office visit",
  },
];

/* ============================================================
   COUNT-UP HOOK
   ============================================================ */
function useCountUp(target: number, inView: boolean, duration = 1.4) {
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) {
      setVal(target);
      return;
    }
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration, reduce]);

  return val;
}

/* ============================================================
   PAGE ROOT
   ============================================================ */
export default function BentoGlass() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Skip link — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900"
      >
        Skip to main content
      </a>

      {/* Scroll-progress rail */}
      <ScrollRail />

      {/* Fixed deep-slate canvas */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: BG }}
        aria-hidden
      />
      {/* Subtle indigo bloom — top-right only */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(800px 600px at 90% -10%, rgba(91,108,255,0.07), transparent 60%)",
        }}
      />

      <main
        id="main-content"
        className="relative z-10"
        style={{ color: FROST, fontFamily: "var(--font-sans, sans-serif)" }}
      >
        <TopBar reduce={!!reduce} />
        <Hero reduce={!!reduce} />
        <BentoGrid reduce={!!reduce} />
        <ProofBand reduce={!!reduce} />
        <ProcessSection reduce={!!reduce} />
        <FullBleedInterlude reduce={!!reduce} />
        <CTASection reduce={!!reduce} />
        <SiteFooter />
      </main>
    </>
  );
}

/* ============================================================
   SCROLL RAIL
   ============================================================ */
function ScrollRail() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  if (reduce) return null;
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background: `linear-gradient(90deg, ${ACCENT}, rgba(91,108,255,0.4))`,
      }}
      aria-hidden
    />
  );
}

/* ============================================================
   TOP BAR
   ============================================================ */
function TopBar({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.08 }}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background:
          "linear-gradient(180deg, rgba(20,23,28,0.92) 0%, rgba(20,23,28,0.0) 100%)",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
        {/* Wordmark */}
        <span
          className="font-mono text-[12px] tracking-[0.28em] uppercase"
          style={{ color: FROST, letterSpacing: "0.28em" }}
        >
          Waseem<span style={{ color: ACCENT }}>.</span>
        </span>

        {/* Nav */}
        <nav
          className="hidden items-center gap-8 sm:flex"
          aria-label="Primary navigation"
        >
          {(["Bento", "Process", "Work"] as const).map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-[11px] tracking-[0.22em] transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              style={{ color: MUTED, textTransform: "uppercase" }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA pill */}
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-5 py-2 text-[11px] tracking-[0.18em] uppercase transition-all hover:opacity-90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          style={{
            background: ACCENT,
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Book a call
        </Link>
      </div>
    </motion.header>
  );
}

/* ============================================================
   HERO — split layout, pointer-tilt portrait
   ============================================================ */
function Hero({ reduce }: { reduce: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const words = ["I make your", "busywork", "disappear."];

  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div className="mx-auto flex min-h-[100svh] max-w-[1440px] flex-col items-center justify-center px-5 pt-24 pb-16 sm:px-10 lg:flex-row lg:items-center lg:gap-16">
        {/* Copy — left */}
        <div className="flex-1 min-w-0">
          {/* Eyebrow */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 20,
              delay: 0.15,
            }}
            className="mb-7 flex items-center gap-3"
          >
            <span
              className="inline-block h-px w-8"
              style={{ background: ACCENT }}
              aria-hidden
            />
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: ACCENT }}
            >
              Independent founder · Bali · Since 2019
            </span>
          </motion.div>

          {/* Headline — visible immediately, no opacity:0 on LCP text */}
          <h1
            style={{
              fontSize: "clamp(2.6rem, 7.5vw, 6.2rem)",
              lineHeight: 0.95,
              color: FROST,
              fontWeight: 300,
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 16,
                  delay: 0.28 + i * 0.1,
                }}
                className="block"
                style={i === 1 ? { color: ACCENT } : undefined}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Sub */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              delay: 0.68,
            }}
            className="mt-8 max-w-[480px] text-[16px] leading-relaxed"
            style={{ color: MUTED }}
          >
            AI &amp; automation systems for growing companies — quiet machinery
            that captures leads, sends follow-ups, and handles manual ops so you
            never touch them again.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              delay: 0.84,
            }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full px-8 py-3.5 text-[12px] font-semibold tracking-[0.14em] uppercase transition-all hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              style={{ background: ACCENT, color: "#fff" }}
            >
              Book a 30-min call&nbsp;&rarr;
            </Link>
            <a
              href="#bento"
              className="text-[11px] tracking-[0.22em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
              style={{ color: MUTED }}
            >
              See the work&nbsp;&darr;
            </a>
          </motion.div>
        </div>

        {/* Portrait — pointer-tilt, perspective transform */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 65,
            damping: 18,
            delay: 0.2,
          }}
          className="relative mt-12 w-full max-w-[340px] shrink-0 lg:mt-0 lg:max-w-[420px]"
          style={{ perspective: 900 }}
        >
          <motion.div
            style={{
              aspectRatio: "3/4",
              borderRadius: "2px",
              border: `1px solid ${GLASS_BORDER}`,
              boxShadow: `0 40px 100px -30px rgba(0,0,0,0.8), 0 0 0 1px ${HAIRLINE}`,
              ...(reduce
                ? {}
                : { rotateX, rotateY, transformStyle: "preserve-3d" as const }),
            }}
            className="relative overflow-hidden"
          >
            <Image
              src={IMG(
                "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
              )}
              alt="Waseem Nasir — confident founder portrait, balcony rail, dark prince coat and sunglasses"
              fill
              priority
              sizes="(max-width:1024px) 80vw, 420px"
              className="object-cover object-top"
              style={{ filter: "saturate(0.92) contrast(1.04)" }}
            />
            {/* Subtle indigo corner accent */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              aria-hidden
              style={{
                height: "40%",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(20,23,28,0.7) 100%)",
              }}
            />
            {/* Mono label bottom-left */}
            <div className="absolute bottom-5 left-5">
              <span
                className="font-mono text-[9px] tracking-[0.3em] uppercase"
                style={{ color: ACCENT }}
              >
                Founder · SkynetLabs
              </span>
            </div>
            {/* Indigo top accent line */}
            <div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{ background: ACCENT, opacity: 0.7 }}
              aria-hidden
            />
          </motion.div>

          {/* Floating inset stat */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
              delay: 0.9,
            }}
            className="absolute -bottom-6 -left-8 hidden sm:block"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: GLASS_BG,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: "2px",
              padding: "14px 20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="font-mono text-[22px] font-light"
              style={{ color: ACCENT }}
            >
              180+
            </div>
            <div
              className="mt-0.5 text-[9px] tracking-[0.24em] uppercase"
              style={{ color: MUTED }}
            >
              Workflows built
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   BENTO GRID — THE CENTREPIECE
   Asymmetric modular cells of varied sizes:
     Row A (3 cols): [Large hero portrait — 2 rows tall] [Work cell A] [Stat 180+]
     Row B:          [Large hero portrait continues]      [Work cell B] [Stat 9 countries]
     Row C (3 cols): [Marquee strip cell — full width]
     Row D (3 cols): [CTA cell]  [Landscape travel cell]  [Country photo]
   ============================================================ */
function BentoGrid({ reduce }: { reduce: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="bento"
      className="relative px-4 py-16 sm:px-8 sm:py-24"
      aria-label="Photo grid and stats"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section label */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="mb-8 flex items-center gap-4"
        >
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: ACCENT }}
          >
            The Work · The Life · The Numbers
          </span>
          <div
            className="h-px flex-1 max-w-[80px]"
            style={{ background: HAIRLINE }}
            aria-hidden
          />
        </motion.div>

        {/* BENTO GRID */}
        <div
          ref={gridRef}
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridAutoRows: "minmax(120px, auto)",
          }}
        >
          {/* CELL 1 — Large hero portrait, spans rows 1-3, cols 1-4 */}
          <BentoCell
            col="1 / 5"
            row="1 / 4"
            delay={0}
            reduce={reduce}
            className="relative overflow-hidden"
          >
            <Image
              src={IMG(
                "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
              )}
              alt="Waseem Nasir — arms crossed, confident founder pose with sunglasses"
              fill
              sizes="(max-width:640px) 90vw, 33vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,23,28,0.1) 50%, rgba(20,23,28,0.72) 100%)",
              }}
            />
            <div className="absolute bottom-5 left-5 right-5">
              <span
                className="font-mono text-[9px] tracking-[0.3em] uppercase"
                style={{ color: ACCENT }}
              >
                Waseem Nasir
              </span>
              <p
                className="mt-1 text-[13px] font-light leading-tight"
                style={{ color: FROST }}
              >
                Founder · AI &amp; Web Automation
              </p>
            </div>
          </BentoCell>

          {/* CELL 2 — Work photo A, cols 5-9, row 1 */}
          <BentoCell
            col="5 / 9"
            row="1 / 2"
            delay={0.06}
            reduce={reduce}
            className="relative overflow-hidden"
            style={{ minHeight: 200 }}
          >
            <Image
              src={IMG(
                "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
              )}
              alt="Waseem with dual laptops showing analytics dashboard — deep work session"
              fill
              sizes="(max-width:640px) 90vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,23,28,0.0) 40%, rgba(20,23,28,0.78) 100%)",
              }}
            />
            <div className="absolute bottom-4 left-4">
              <span
                className="font-mono text-[8px] tracking-[0.24em] uppercase"
                style={{ color: MUTED }}
              >
                Deep work
              </span>
            </div>
          </BentoCell>

          {/* CELL 3 — Stat: 180+ workflows, col 9-13, row 1 */}
          <BentoCell
            col="9 / 13"
            row="1 / 2"
            delay={0.1}
            reduce={reduce}
            className="flex flex-col items-center justify-center text-center"
            style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30` }}
            isGlass
          >
            <CountUpStat
              n={180}
              suffix="+"
              label="Workflows built"
              reduce={reduce}
              large
            />
          </BentoCell>

          {/* CELL 4 — Work photo B, cols 5-9, row 2 */}
          <BentoCell
            col="5 / 9"
            row="2 / 3"
            delay={0.08}
            reduce={reduce}
            className="relative overflow-hidden"
          >
            <Image
              src={IMG(
                "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
              )}
              alt="Waseem typing on backlit keyboard at a night cafe — candid build session"
              fill
              sizes="(max-width:640px) 90vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "linear-gradient(0deg, rgba(20,23,28,0.6) 0%, transparent 60%)",
              }}
            />
            <div className="absolute bottom-4 left-4">
              <span
                className="font-mono text-[8px] tracking-[0.24em] uppercase"
                style={{ color: MUTED }}
              >
                Night sessions
              </span>
            </div>
          </BentoCell>

          {/* CELL 5 — Stat: 9 countries, col 9-13, row 2 */}
          <BentoCell
            col="9 / 13"
            row="2 / 3"
            delay={0.14}
            reduce={reduce}
            className="relative overflow-hidden"
          >
            <Image
              src={IMG("TRAVEL-sentosa-sign-hedge-cream-set.jpg")}
              alt="Waseem at Sentosa sign, Singapore — one of 9 countries served"
              fill
              sizes="(max-width:640px) 90vw, 16vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={{ filter: "saturate(0.9) brightness(0.72)" }}
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                background: "rgba(20,23,28,0.52)",
                backdropFilter: "blur(0px)",
              }}
            >
              <CountUpStat
                n={9}
                suffix=""
                label="Countries served"
                reduce={reduce}
                large
              />
            </div>
          </BentoCell>

          {/* CELL 6 — Rooftop landscape, cols 1-5, row 4 */}
          <BentoCell
            col="1 / 5"
            row="4 / 5"
            delay={0.12}
            reduce={reduce}
            className="relative overflow-hidden"
          >
            <Image
              src={IMG(
                "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
              )}
              alt="Waseem on rooftop cafe with laptop, mountain and clouds behind"
              fill
              sizes="(max-width:640px) 90vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={{ filter: "saturate(0.9)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,23,28,0) 40%, rgba(20,23,28,0.7) 100%)",
              }}
            />
            <div className="absolute bottom-4 left-4">
              <span
                className="font-mono text-[8px] tracking-[0.24em] uppercase"
                style={{ color: FROST, opacity: 0.7 }}
              >
                Rooftop · above the clouds
              </span>
            </div>
          </BentoCell>

          {/* CELL 7 — Marquee photo strip, cols 5-9, rows 3-4 */}
          <BentoCell
            col="5 / 9"
            row="3 / 5"
            delay={0.16}
            reduce={reduce}
            className="relative overflow-hidden flex flex-col justify-between"
            style={{ background: SURFACE_HI }}
          >
            <div className="absolute inset-0" aria-hidden>
              <BentoMarqueeStrip reduce={reduce} />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(0deg, rgba(20,23,28,0.55) 0%, transparent 40%, transparent 60%, rgba(20,23,28,0.55) 100%)",
              }}
              aria-hidden
            />
            <div className="relative z-10 p-5">
              <span
                className="font-mono text-[9px] tracking-[0.28em] uppercase"
                style={{ color: ACCENT }}
              >
                A life in motion
              </span>
            </div>
            <div className="relative z-10 p-5">
              <p
                className="text-[13px] font-light leading-snug"
                style={{ color: FROST }}
              >
                Built from cafés, rooftops &amp; rice fields
                <span style={{ color: ACCENT }}> — shipped worldwide.</span>
              </p>
            </div>
          </BentoCell>

          {/* CELL 8 — Lifestyle/neon sign, cols 9-13, rows 3-4 */}
          <BentoCell
            col="9 / 13"
            row="3 / 5"
            delay={0.2}
            reduce={reduce}
            className="relative overflow-hidden"
          >
            <Image
              src={IMG(
                "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
              )}
              alt="Waseem standing under neon 'No Limits' quote sign in all-black outfit"
              fill
              sizes="(max-width:640px) 90vw, 16vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ filter: "saturate(1.05) contrast(1.02)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,23,28,0.15) 50%, rgba(20,23,28,0.72) 100%)",
              }}
            />
            <div className="absolute bottom-4 left-4">
              <span
                className="font-mono text-[8px] tracking-[0.22em] uppercase"
                style={{ color: ACCENT }}
              >
                No limits
              </span>
            </div>
          </BentoCell>

          {/* CELL 9 — CTA glass cell, cols 1-5, row 5 */}
          <BentoCell
            col="1 / 5"
            row="5 / 6"
            delay={0.18}
            reduce={reduce}
            className="flex flex-col justify-between"
            isGlass
            style={{
              background: GLASS_BG,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${GLASS_BORDER}`,
            }}
          >
            <span
              className="font-mono text-[9px] tracking-[0.28em] uppercase"
              style={{ color: ACCENT }}
            >
              Ready to start?
            </span>
            <div>
              <p
                className="mb-5 text-[15px] font-light leading-snug"
                style={{ color: FROST }}
              >
                Let&apos;s find your biggest time-sink and engineer it away.
              </p>
              <Link
                href={CTA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase transition-all hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                style={{ background: ACCENT, color: "#fff" }}
              >
                Book a discovery call&nbsp;&rarr;
              </Link>
            </div>
          </BentoCell>

          {/* CELL 10 — Stat: 40+ sites, cols 5-9, row 5 */}
          <BentoCell
            col="5 / 9"
            row="5 / 6"
            delay={0.22}
            reduce={reduce}
            className="flex flex-col items-center justify-center text-center"
            style={{ background: SURFACE }}
          >
            <CountUpStat
              n={40}
              suffix="+"
              label="Sites shipped"
              reduce={reduce}
              large
            />
          </BentoCell>

          {/* CELL 11 — Travel photo, cols 9-13, row 5 */}
          <BentoCell
            col="9 / 13"
            row="5 / 6"
            delay={0.24}
            reduce={reduce}
            className="relative overflow-hidden"
          >
            <Image
              src={IMG("TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg")}
              alt="Waseem with arms spread wide on Nusa Penida cliffs — nine countries and counting"
              fill
              sizes="(max-width:640px) 90vw, 16vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={{ filter: "saturate(0.88) brightness(0.82)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,23,28,0) 50%, rgba(20,23,28,0.72) 100%)",
              }}
            />
            <div className="absolute bottom-4 left-4">
              <span
                className="font-mono text-[8px] tracking-[0.24em] uppercase"
                style={{ color: FROST, opacity: 0.8 }}
              >
                Nusa Penida · nine countries
              </span>
            </div>
          </BentoCell>
        </div>
      </div>
    </section>
  );
}

/* ── Reusable bento cell wrapper ── */
interface BentoCellProps {
  col: string;
  row: string;
  delay: number;
  reduce: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isGlass?: boolean;
}

function BentoCell({
  col,
  row,
  delay,
  reduce,
  children,
  className = "",
  style = {},
  isGlass = false,
}: BentoCellProps) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 20,
        delay,
      }}
      whileHover={
        reduce
          ? {}
          : {
              y: -4,
              boxShadow: isGlass
                ? `0 20px 60px -20px rgba(91,108,255,0.3), 0 0 0 1px rgba(91,108,255,0.2)`
                : `0 20px 60px -20px rgba(0,0,0,0.7)`,
              transition: { type: "spring", stiffness: 300, damping: 25 },
            }
      }
      className={`group relative ${className}`}
      style={{
        gridColumn: col,
        gridRow: row,
        borderRadius: "2px",
        overflow: "hidden",
        background: SURFACE,
        border: `1px solid ${GLASS_BORDER}`,
        padding: isGlass ? "20px" : undefined,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Bento marquee strip (vertical scroll inside cell) ── */
function BentoMarqueeStrip({ reduce }: { reduce: boolean }) {
  const yMotion = useMotionValue(0);

  // One original set = MARQUEE_PHOTOS.length × (150px image + 8px gap-2).
  const SET_HEIGHT = MARQUEE_PHOTOS.length * (150 + 8);
  useAnimationFrame(() => {
    if (reduce) return;
    const current = yMotion.get();
    let next = current - 0.4;
    // Wrap (don't hard-zero) exactly at one set so the duplicate tail hides the seam.
    if (next <= -SET_HEIGHT) next += SET_HEIGHT;
    yMotion.set(next);
  });

  return (
    <motion.div
      style={{ y: reduce ? 0 : yMotion, willChange: "transform" }}
      className="flex flex-col gap-2 p-2"
      aria-hidden
    >
      {[...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS].map((p, i) => (
        <div
          key={i}
          className="relative shrink-0 overflow-hidden"
          style={{ height: 150, borderRadius: "1px" }}
        >
          <Image
            src={IMG(p.src)}
            alt={p.alt}
            fill
            sizes="20vw"
            className="object-cover"
            style={{ filter: "saturate(0.85) brightness(0.9)" }}
          />
        </div>
      ))}
    </motion.div>
  );
}

/* ── Count-up stat component ── */
interface CountUpStatProps {
  n: number;
  suffix: string;
  label: string;
  reduce: boolean;
  large?: boolean;
}

function CountUpStat({ n, suffix, label, reduce, large }: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const val = useCountUp(n, inView);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <span
        className="font-mono font-light leading-none tabular-nums"
        style={{
          fontSize: large ? "clamp(2rem, 4vw, 3.2rem)" : "2rem",
          color: ACCENT,
        }}
      >
        {val}
        {suffix}
      </span>
      <div
        className="h-px w-8"
        style={{ background: ACCENT, opacity: 0.4 }}
        aria-hidden
      />
      <span
        className="font-mono text-[9px] tracking-[0.26em] uppercase"
        style={{ color: MUTED }}
      >
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   PROOF BAND — second emphasis moment, distinct from bento stats
   ============================================================ */
function ProofBand({ reduce }: { reduce: boolean }) {
  return (
    <section
      className="border-y"
      style={{ borderColor: HAIRLINE, background: SURFACE }}
      aria-label="Track record summary"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {PROOF.map((p, i) => (
            <motion.div
              key={p.label}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 20,
                delay: i * 0.06,
              }}
              className="flex items-baseline gap-3"
            >
              <span
                className="font-mono font-light tabular-nums"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  color: FROST,
                }}
              >
                {p.n}
                {p.suffix}
              </span>
              <span
                className="font-mono text-[10px] tracking-[0.22em] uppercase"
                style={{ color: MUTED }}
              >
                {p.label}
              </span>
            </motion.div>
          ))}
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-mono text-[11px] tracking-[0.22em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
            style={{ color: ACCENT }}
          >
            See how →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROCESS / HOW I WORK — sticky stacking cards with photos
   ============================================================ */
function ProcessSection({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="process"
      className="relative px-4 py-24 sm:px-8 sm:py-32"
      aria-label="How I work"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="mb-16 flex items-end justify-between"
        >
          <div>
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: ACCENT }}
            >
              Process
            </span>
            <h2
              className="mt-3 font-light leading-[1.05]"
              style={{
                fontSize: "clamp(1.8rem, 4.5vw, 3.4rem)",
                color: FROST,
              }}
            >
              How I work
            </h2>
          </div>
          <span
            className="hidden font-mono text-[10px] tracking-[0.24em] uppercase sm:block"
            style={{ color: MUTED }}
          >
            Names private · Systems real
          </span>
        </motion.div>

        {/* Sticky stacking cards */}
        <div className="space-y-6">
          {PROCESS.map((step, i) => (
            <ProcessCard key={step.n} step={step} index={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
  reduce,
}: {
  step: (typeof PROCESS)[number];
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, index * -20]);
  const ySpring = useSpring(y, { stiffness: 60, damping: 22 });

  return (
    <motion.article
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 72,
        damping: 20,
        delay: index * 0.08,
      }}
      style={{
        y: reduce ? 0 : ySpring,
        position: "sticky",
        top: `${96 + index * 16}px`,
        zIndex: 10 + index,
      }}
    >
      <div
        className="grid overflow-hidden lg:grid-cols-[1fr_1.4fr]"
        style={{
          background: SURFACE_HI,
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: "2px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Photo */}
        <div
          className="relative overflow-hidden"
          style={{ minHeight: 260, aspectRatio: "16/9" }}
        >
          <Image
            src={IMG(step.src)}
            alt={step.alt}
            fill
            sizes="(max-width:1024px) 90vw, 42vw"
            className="object-cover"
            style={{ filter: "saturate(0.88) brightness(0.88)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "linear-gradient(90deg, rgba(20,23,28,0) 60%, rgba(20,23,28,0.72) 100%), linear-gradient(180deg, rgba(20,23,28,0) 60%, rgba(20,23,28,0.5) 100%)",
            }}
          />
          {/* Step number badge */}
          <div
            className="absolute left-5 top-5 font-mono text-[10px] tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            {step.n}
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div
            className="mb-4 h-px w-10"
            style={{ background: ACCENT, opacity: 0.6 }}
            aria-hidden
          />
          <h3
            className="font-light leading-tight"
            style={{
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              color: FROST,
            }}
          >
            {step.title}
          </h3>
          <p
            className="mt-4 text-[15px] leading-relaxed"
            style={{ color: MUTED }}
          >
            {step.body}
          </p>
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-fit items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
            style={{ color: ACCENT }}
          >
            Start here&nbsp;&rarr;
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   FULL-BLEED PARALLAX INTERLUDE — travel/scenery
   ============================================================ */
function FullBleedInterlude({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const ySpring = useSpring(yRaw, { stiffness: 50, damping: 22 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "75svh", marginTop: 80 }}
      aria-label="Bali scenery interlude"
    >
      <motion.div
        className="absolute inset-0 scale-[1.14]"
        style={{ y: reduce ? 0 : ySpring }}
      >
        <Image
          src={IMG("SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg")}
          alt="Bali green valley panorama with cloud-covered hills — where Waseem builds and ships"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.8) brightness(0.55)" }}
        />
      </motion.div>

      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(20,23,28,0.4) 0%, rgba(20,23,28,0.1) 40%, rgba(20,23,28,0.6) 100%)",
        }}
      />

      {/* Inset quote + about portrait */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center gap-12 px-6 sm:px-10">
        {/* Quote */}
        <motion.blockquote
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 68, damping: 18 }}
          className="flex-1"
        >
          <p
            className="font-light italic leading-[1.2]"
            style={{
              fontSize: "clamp(1.5rem, 3.8vw, 2.8rem)",
              color: FROST,
            }}
          >
            &ldquo;The best automation is the kind you forget is even
            running.&rdquo;
          </p>
          <footer
            className="mt-5 font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: ACCENT }}
          >
            &mdash; Waseem Nasir, SkynetLabs
          </footer>
        </motion.blockquote>

        {/* About photo — glass-framed inset */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 65,
            damping: 18,
            delay: 0.12,
          }}
          className="hidden shrink-0 overflow-hidden lg:block"
          style={{
            width: 220,
            aspectRatio: "3/4",
            border: `1px solid ${GLASS_BORDER}`,
            borderRadius: "2px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          <div className="relative h-full w-full">
            <Image
              src={IMG(
                "PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
              )}
              alt="Waseem smiling in a rice field — palms and mountain behind, Bali"
              fill
              sizes="220px"
              className="object-cover object-top"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA SECTION — single target, final
   ============================================================ */
function CTASection({ reduce }: { reduce: boolean }) {
  return (
    <section
      className="relative px-5 py-36 sm:px-10 sm:py-48"
      aria-label="Book a discovery call"
    >
      <div
        className="mx-auto mb-20 h-px max-w-[1440px]"
        style={{ background: HAIRLINE }}
        aria-hidden
      />

      <div className="mx-auto max-w-[960px] text-center">
        <motion.span
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: ACCENT }}
        >
          Ready to start?
        </motion.span>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 72,
            damping: 18,
            delay: 0.12,
          }}
          className="mt-6 font-light leading-[1.02]"
          style={{ fontSize: "clamp(2.2rem, 7vw, 5.4rem)", color: FROST }}
        >
          Let&apos;s make your
          <br />
          <span style={{ color: ACCENT }}>busywork disappear.</span>
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.22,
          }}
          className="mx-auto mt-8 max-w-[480px] text-[16px] leading-relaxed"
          style={{ color: MUTED }}
        >
          One free 30-minute call. I map your biggest leak and explain how to
          seal it — no pitch deck, no retainer pressure.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.32,
          }}
          className="mt-12"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-12 py-5 text-[13px] font-semibold tracking-[0.16em] uppercase transition-all hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: ACCENT, color: "#fff" }}
          >
            Book a discovery call&nbsp;&rarr;
          </Link>

          <p
            className="mt-7 font-mono text-[11px] tracking-[0.2em] uppercase"
            style={{ color: MUTED }}
          >
            Or email&nbsp;
            <a
              href="mailto:waseembali2k26@gmail.com"
              className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
              style={{ color: FROST }}
            >
              waseembali2k26@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function SiteFooter() {
  return (
    <footer
      className="border-t px-5 py-12 sm:px-10"
      style={{ borderColor: HAIRLINE }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <span
          className="font-mono text-[12px] tracking-[0.28em] uppercase"
          style={{ color: FROST }}
        >
          Waseem<span style={{ color: ACCENT }}>.</span>
        </span>

        <nav className="flex flex-wrap gap-8" aria-label="Footer navigation">
          {[
            {
              href: "mailto:waseembali2k26@gmail.com",
              label: "Email",
              external: false,
            },
            {
              href: "https://github.com/waseemnasir2k26",
              label: "GitHub",
              external: true,
            },
            {
              href: "https://skynetjoe.com",
              label: "SkynetJoe.com",
              external: true,
            },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="font-mono text-[11px] tracking-[0.22em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
              style={{ color: MUTED }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <span
          className="font-mono text-[10px] tracking-[0.18em] uppercase"
          style={{ color: MUTED }}
        >
          &copy; 2026&nbsp;&middot;&nbsp;Built in Bali
        </span>
      </div>
    </footer>
  );
}
