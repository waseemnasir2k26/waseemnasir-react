"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionValue,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";

/* ─── Local display font: Bricolage Grotesque (not in global layout).
   JetBrains Mono + Inter come from the global layout as --font-mono / --font-sans. ─── */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

/* ============================================================
   BRAND TOKENS — cinema-horizontal variant (fully self-contained)
   ============================================================ */
const BG = "#0C0C0E";
const SURFACE = "#141416";
const TEXT = "#EDEAE3";
const MUTED = "#7A7672";
const ACCENT = "#FF8A3D"; // signal amber — used sparingly (<5% surface)
const HAIRLINE = "rgba(255,138,61,0.18)";
const HAIRLINE_SUBTLE = "rgba(237,234,227,0.07)";

/* ---- Spring presets (self-contained mirror of components/motion.ts) ---- */
const SPRING_SOFT = {
  type: "spring",
  stiffness: 90,
  damping: 18,
  mass: 0.9,
} as const;
const SPRING_DRIFT = {
  type: "spring",
  stiffness: 58,
  damping: 22,
  mass: 0.7,
} as const;
const SPRING_SNAP = { type: "spring", stiffness: 300, damping: 26 } as const;

const IMG = (f: string) => `/img/pro/${f}`;
const CTA = "https://skynetjoe.com/discovery-call";

/* ============================================================
   HORIZONTAL TRACK DATA
   6 landscape panels (1700x956) + 2 portrait widescreen panels
   Ordered for cinematic narrative arc:
   build → ship → systems → travel → night → ops → summit → culture
   ============================================================ */
const TRACK: {
  src: string;
  caption: string;
  stat?: string;
  orientation: "landscape" | "portrait";
}[] = [
  {
    src: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
    caption: "THE BUILD",
    stat: "Morning. Every morning.",
    orientation: "landscape",
  },
  {
    src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    caption: "THE SYSTEMS",
    stat: "180+ workflows running",
    orientation: "landscape",
  },
  {
    src: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    caption: "THE OPS",
    stat: "40+ sites shipped",
    orientation: "landscape",
  },
  {
    src: "TRAVEL-2026-03-29-trail-selfie-backpack-mountain-sky.jpg",
    caption: "THE RANGE",
    stat: "9 countries served",
    orientation: "landscape",
  },
  {
    src: "CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg",
    caption: "THE DEPTH",
    stat: "Deep work, anywhere",
    orientation: "landscape",
  },
  {
    src: "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
    caption: "THE NIGHT SHIFT",
    stat: "Your timezone, my problem",
    orientation: "landscape",
  },
  {
    src: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
    caption: "THE SHIP",
    stat: "Since 2019",
    orientation: "landscape",
  },
  {
    src: "SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg",
    caption: "THE HORIZON",
    stat: "Always building forward",
    orientation: "landscape",
  },
];

/* ============================================================
   MARQUEE STRIP PHOTOS — portrait crops shown as small landscape windows
   ============================================================ */
const MARQUEE_PHOTOS = [
  {
    src: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    alt: "Waseem — balcony, prince coat",
  },
  {
    src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    alt: "Waseem — Nusa Penida cliffs",
  },
  {
    src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
    alt: "Working above the clouds",
  },
  {
    src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
    alt: "No limits neon sign",
  },
  {
    src: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
    alt: "Waseem — jungle bridge",
  },
  {
    src: "PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    alt: "Waseem — wood interior portrait",
  },
];

/* ============================================================
   REAL PROOF NUMBERS ONLY
   ============================================================ */
const PROOF = [
  { value: 180, suffix: "+", label: "Workflows built" },
  { value: 40, suffix: "+", label: "Sites shipped" },
  { value: 9, suffix: "", label: "Countries served" },
  { value: 2019, suffix: "", label: "Building since" },
];

/* ============================================================
   ROOT PAGE
   ============================================================ */
export default function CinemaHorizontal() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Skip link — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Full-bleed canvas — never transparent to global layout */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: BG }}
        aria-hidden
      />

      {/* Amber bloom — extremely restrained, top-right corner only */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(800px 500px at 92% -10%, rgba(255,138,61,0.06), transparent 60%)",
        }}
      />

      <main
        id="main-content"
        className={`${bricolage.variable} relative z-10`}
        style={{
          color: TEXT,
          fontFamily: "var(--font-sans, Inter, sans-serif)",
        }}
      >
        <TopNav reduce={!!reduce} />
        <Hero reduce={!!reduce} />
        <HorizontalPin reduce={!!reduce} />
        <ProofBand reduce={!!reduce} />
        <AboutSection reduce={!!reduce} />
        <MarqueePhotoStrip reduce={!!reduce} />
        <CTASection reduce={!!reduce} />
        <FooterSection />
      </main>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   TOP NAV
   ────────────────────────────────────────────────────────────── */
function TopNav({ reduce }: { reduce: boolean }) {
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_SOFT, delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: `linear-gradient(180deg, rgba(12,12,14,0.92) 0%, rgba(12,12,14,0) 100%)`,
        borderBottom: `1px solid ${HAIRLINE_SUBTLE}`,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
        {/* Wordmark */}
        <span
          className="text-[11px] tracking-[0.28em] uppercase"
          style={{
            color: TEXT,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          Waseem&nbsp;Nasir
        </span>

        {/* Nav anchors — hidden mobile */}
        <nav
          className="hidden items-center gap-8 sm:flex"
          aria-label="Primary navigation"
        >
          {(["Work", "About", "Contact"] as const).map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-[10px] tracking-[0.28em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              style={{
                color: MUTED,
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA — the one CTA */}
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.22em] uppercase transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-4 py-2"
          style={{
            border: `1px solid ${ACCENT}`,
            color: ACCENT,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          Book a Call
        </Link>
      </div>
    </motion.header>
  );
}

/* ──────────────────────────────────────────────────────────────
   HERO
   Full-bleed portrait with:
   - pointer-tilt parallax (rotateX/rotateY spring on mouse move)
   - per-word clip-mask translateY reveal on load
   - mono kicker
   - Amber accent on ONE word only
   - LCP portrait is never opacity:0 — uses a solid placeholder bg
   ────────────────────────────────────────────────────────────── */
function Hero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  /* Scroll parallax — portrait drifts upward */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yImgSpring = useSpring(yImg, SPRING_DRIFT);
  const contentFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  /* Pointer tilt */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [6, -6]),
    SPRING_SNAP,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
    SPRING_SNAP,
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [reduce, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const headline = ["I", "engineer", "your", "chaos", "into", "clarity."];

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden"
      aria-label="Hero — Waseem Nasir, founder of SkynetLabs"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Portrait — parallax container */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: reduce ? 0 : yImgSpring,
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformPerspective: 1200,
        }}
      >
        {/* LCP image — priority, never hidden, opaque placeholder bg */}
        <div className="absolute inset-0" style={{ background: "#1a1a1c" }} />
        <Image
          src={IMG(
            "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
          )}
          alt="Waseem Nasir — founder of SkynetLabs, black prince coat, balcony"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_20%]"
          style={{ filter: "saturate(0.9) contrast(1.06)" }}
        />
      </motion.div>

      {/* Multi-layer gradient — text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: [
            "linear-gradient(105deg, rgba(12,12,14,0.97) 0%, rgba(12,12,14,0.72) 38%, rgba(12,12,14,0.18) 65%, rgba(12,12,14,0.5) 100%)",
            "linear-gradient(180deg, rgba(12,12,14,0.55) 0%, transparent 22%, transparent 58%, rgba(12,12,14,0.95) 100%)",
          ].join(", "),
        }}
      />

      {/* Content — fades as you scroll past hero */}
      <motion.div
        style={{ opacity: reduce ? 1 : contentFade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-20 pt-28 sm:px-10 sm:pb-28"
      >
        {/* Kicker */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SOFT, delay: 0.2 }}
          className="mb-6 flex items-center gap-3"
          aria-label="Role descriptor"
        >
          {/* Amber hairline */}
          <span
            className="block h-px w-8 shrink-0"
            style={{ background: ACCENT }}
            aria-hidden
          />
          <span
            className="text-[9px] tracking-[0.38em] uppercase"
            style={{
              color: ACCENT,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            Founder&nbsp;&middot;&nbsp;SkynetLabs&nbsp;&middot;&nbsp;Est.&nbsp;2019
          </span>
        </motion.div>

        {/* Headline — per-word clip-mask translateY reveal */}
        <h1
          className="overflow-hidden font-light leading-[0.95]"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 6.8rem)",
            color: TEXT,
            fontFamily:
              "var(--font-bricolage, 'Bricolage Grotesque', sans-serif)",
          }}
        >
          {headline.map((word, i) => (
            <span
              key={word + i}
              className="inline-block overflow-hidden mr-[0.22em]"
              aria-hidden={false}
            >
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  type: "spring",
                  stiffness: 64,
                  damping: 15,
                  delay: 0.32 + i * 0.1,
                }}
                style={
                  i === 5
                    ? { color: ACCENT }
                    : i === 3
                      ? { fontStyle: "italic" }
                      : undefined
                }
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Sub-copy */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SOFT, delay: 0.96 }}
          className="mt-7 max-w-[480px] leading-relaxed"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", color: MUTED }}
        >
          Six years building AI automations, self-healing n8n workflows, and
          Next.js systems for companies across nine countries. I find the leak.
          I engineer it shut.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SOFT, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[11px] font-medium tracking-[0.16em] uppercase transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{
              background: ACCENT,
              color: "#1a0d00",
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            Book a discovery call
            <span aria-hidden>→</span>
          </Link>
          <a
            href="#work"
            className="text-[10px] tracking-[0.28em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
            style={{
              color: MUTED,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            Scroll the work ↓
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll progress amber hairline at bottom */}
      <ScrollProgressRail reduce={reduce} />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   SCROLL PROGRESS RAIL — 1px amber line at bottom of hero
   ────────────────────────────────────────────────────────────── */
function ScrollProgressRail({ reduce }: { reduce: boolean }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 h-[2px] origin-left"
      style={{
        scaleX: reduce ? 0 : scaleX,
        background: ACCENT,
      }}
      aria-hidden
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   HORIZONTAL PIN — SIGNATURE MOVE

   Desktop:
   - Outer div: height = 300vh (pin trigger) + panel count * 100vh
   - Inner: sticky, full viewport height, overflow hidden
   - Track: motion.div with useTransform x from 0 → -(trackWidth - 100vw)
   - Velocity-skew: useVelocity on scrollY → skewX clamp ±8deg
   - Last panel viewport-centers before flow releases

   Mobile (≤767px): Vertical stack, no sticky, no horizontal translate
   ────────────────────────────────────────────────────────────── */
function HorizontalPin({ reduce }: { reduce: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="work" aria-label="Work — photo track" className="relative">
      {/* Section header — always visible above the pin zone */}
      <div
        className="mx-auto flex max-w-[1440px] items-end justify-between px-5 py-14 sm:px-10"
        style={{ borderBottom: `1px solid ${HAIRLINE_SUBTLE}` }}
      >
        <div>
          <span
            className="block text-[9px] tracking-[0.36em] uppercase mb-3"
            style={{
              color: ACCENT,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            Work / Field
          </span>
          <h2
            className="font-light leading-none"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              color: TEXT,
              fontFamily:
                "var(--font-bricolage, 'Bricolage Grotesque', sans-serif)",
            }}
          >
            A founder{" "}
            <em style={{ fontStyle: "italic", color: TEXT }}>in motion</em>
          </h2>
        </div>
        <span
          className="hidden text-[9px] tracking-[0.28em] uppercase sm:block"
          style={{
            color: MUTED,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          {isMobile ? "Scroll ↓" : "Scroll → to advance"}
        </span>
      </div>

      {/* The pin mechanism — hidden on mobile, shown on desktop */}
      {!isMobile && !reduce ? <DesktopHorizontalTrack /> : <MobilePhotoStack />}
    </section>
  );
}

function DesktopHorizontalTrack() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  /* Measure the REAL distance the track must travel (scrollWidth − viewport),
     so the EndCard lands viewport-centered regardless of vw/gap/padding math. */
  const [shift, setShift] = useState(0);
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setShift(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  const xSpring = useSpring(xRaw, SPRING_DRIFT);

  /* Velocity-skew for cinematic feel — clamped tight so photos lean, not shear */
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const skewRaw = useTransform(
    scrollVelocity,
    [-2000, 0, 2000],
    [3.5, 0, -3.5],
  );
  const skewSpring = useSpring(skewRaw, { stiffness: 120, damping: 28 });

  // Pin height: enough to scroll through all panels
  // 300vh base + panels * 80vh per panel gives good pacing
  const pinHeight = `${300 + TRACK.length * 80}vh`;

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: pinHeight }}
      aria-label="Horizontal photo track — scroll to advance"
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ willChange: "transform" }}
      >
        {/* Velocity-skew wrapper */}
        <motion.div style={{ skewX: skewSpring }} className="h-full">
          {/* The scrolling track */}
          <motion.div
            ref={trackRef}
            style={{ x: xSpring, willChange: "transform" }}
            className="flex h-full items-stretch gap-6 px-10 py-8"
          >
            {TRACK.map((panel, i) => (
              <TrackPanel key={panel.src} panel={panel} index={i} />
            ))}

            {/* End card — viewport-centers before vertical flow releases */}
            <EndCard />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function TrackPanel({
  panel,
  index,
}: {
  panel: (typeof TRACK)[0];
  index: number;
}) {
  return (
    <figure
      className="group relative shrink-0 overflow-hidden"
      style={{
        width: "70vw",
        minWidth: "70vw",
        border: `1px solid ${HAIRLINE_SUBTLE}`,
        background: SURFACE,
        boxShadow: "0 40px 100px -50px rgba(0,0,0,0.98)",
      }}
      aria-label={`${panel.caption} — ${panel.stat ?? ""}`}
    >
      <Image
        src={IMG(panel.src)}
        alt={`${panel.caption}: ${panel.stat ?? "Waseem Nasir at work"}`}
        fill
        sizes="70vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{ filter: "saturate(0.88) contrast(1.04) brightness(0.92)" }}
      />

      {/* Cinematic scrim — bottom heavy */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: [
            "linear-gradient(180deg, transparent 40%, rgba(12,12,14,0.92) 100%)",
            "linear-gradient(90deg, rgba(12,12,14,0.28) 0%, transparent 25%, transparent 75%, rgba(12,12,14,0.28) 100%)",
          ].join(", "),
        }}
      />

      {/* Amber top hairline */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: ACCENT, opacity: 0.4 }}
        aria-hidden
      />

      {/* Panel index — mono top-left */}
      <span
        className="absolute left-5 top-5 text-[9px] tracking-[0.4em] uppercase"
        style={{
          color: ACCENT,
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          opacity: 0.7,
        }}
      >
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(TRACK.length).padStart(2, "0")}
      </span>

      {/* Caption block — bottom-left */}
      <figcaption className="absolute bottom-0 inset-x-0 px-6 pb-7 flex flex-col gap-2">
        <span
          className="text-[9px] tracking-[0.36em] uppercase"
          style={{
            color: ACCENT,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          {panel.caption}
        </span>
        {panel.stat && (
          <span
            className="text-[13px] tracking-[0.06em]"
            style={{
              color: TEXT,
              opacity: 0.7,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            {panel.stat}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function EndCard() {
  return (
    <div
      className="flex shrink-0 flex-col justify-center px-4"
      style={{ width: "38vw", minWidth: "38vw" }}
    >
      <div
        className="h-px w-12 mb-8"
        style={{ background: ACCENT }}
        aria-hidden
      />
      <p
        className="font-light leading-[1.08]"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
          color: TEXT,
          fontFamily:
            "var(--font-bricolage, 'Bricolage Grotesque', sans-serif)",
        }}
      >
        Built from rooftops, ridgelines &amp; cafés —
        <br />
        <span style={{ color: ACCENT }}>shipped</span> worldwide.
      </p>
      <p
        className="mt-6 text-[13px] tracking-[0.04em] leading-relaxed"
        style={{ color: MUTED, maxWidth: "26ch" }}
      >
        Nine countries. Six years. The work speaks.
      </p>
    </div>
  );
}

function MobilePhotoStack() {
  return (
    <div className="px-5 py-12 flex flex-col gap-6">
      {TRACK.map((panel, i) => (
        <figure
          key={panel.src}
          className="relative overflow-hidden"
          style={{
            aspectRatio: "16/10",
            border: `1px solid ${HAIRLINE_SUBTLE}`,
          }}
          aria-label={`${panel.caption} — ${panel.stat ?? ""}`}
        >
          <Image
            src={IMG(panel.src)}
            alt={`${panel.caption}: ${panel.stat ?? "Waseem Nasir"}`}
            fill
            sizes="90vw"
            className="object-cover"
            style={{ filter: "saturate(0.88) brightness(0.9)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, rgba(12,12,14,0.9) 100%)",
            }}
          />
          <figcaption className="absolute bottom-0 inset-x-0 px-4 pb-4 flex flex-col gap-1">
            <span
              className="text-[8px] tracking-[0.36em] uppercase"
              style={{
                color: ACCENT,
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              }}
            >
              {String(i + 1).padStart(2, "0")} — {panel.caption}
            </span>
            {panel.stat && (
              <span
                className="text-[11px]"
                style={{
                  color: TEXT,
                  opacity: 0.65,
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                {panel.stat}
              </span>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   PROOF BAND — count-up on in-view, mono numerals
   ────────────────────────────────────────────────────────────── */
function ProofBand({ reduce }: { reduce: boolean }) {
  return (
    <section
      aria-label="Track record"
      style={{
        background: SURFACE,
        borderTop: `1px solid ${HAIRLINE_SUBTLE}`,
        borderBottom: `1px solid ${HAIRLINE_SUBTLE}`,
      }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-0 px-5 lg:grid-cols-4">
        {PROOF.map((p, i) => (
          <ProofStat
            key={p.label}
            stat={p}
            index={i}
            reduce={reduce}
            last={i === PROOF.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function ProofStat({
  stat,
  index,
  reduce,
  last,
}: {
  stat: (typeof PROOF)[0];
  index: number;
  reduce: boolean;
  last: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduce || stat.value >= 1900) {
      // Years (e.g. "since 2019") never count up — avoids flashing a false year.
      setCount(stat.value);
      return;
    }
    const start = stat.value > 100 ? stat.value - 40 : 0;
    const duration = stat.value > 1000 ? 1400 : 900;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (stat.value - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, reduce, stat.value]);

  const isRightEdge = [1, 3].includes(index);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center gap-4 py-14 px-4 text-center"
      style={{
        borderRight: !isRightEdge ? `1px solid ${HAIRLINE_SUBTLE}` : undefined,
        borderBottom: index < 2 ? `1px solid ${HAIRLINE_SUBTLE}` : undefined,
      }}
    >
      <span
        className="font-light leading-none tabular-nums"
        style={{
          fontSize: "clamp(2.6rem, 6.5vw, 4.5rem)",
          color: TEXT,
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        }}
      >
        {count}
        <span style={{ color: ACCENT }}>{stat.suffix}</span>
      </span>

      {/* Amber tick */}
      <span
        className="block h-px w-5"
        style={{ background: ACCENT }}
        aria-hidden
      />

      <span
        className="text-[9px] tracking-[0.28em] uppercase"
        style={{
          color: MUTED,
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        }}
      >
        {stat.label}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   ABOUT — sticky portrait + scrolling text beats
   ────────────────────────────────────────────────────────────── */
function AboutSection({ reduce }: { reduce: boolean }) {
  const BEATS = [
    {
      kicker: "The origin",
      body: "Started in 2019, building automations before most people knew what n8n was. Tested ideas on real clients from day one.",
    },
    {
      kicker: "The method",
      body: "I map your ops, find every place humans are doing what software should. Then I wire it: n8n, AI, Stripe, WhatsApp — whatever closes the gap.",
    },
    {
      kicker: "The reach",
      body: "Clinics in Miami. Freight brokers in Texas. Travel portals in Italy. Inbox automation engines in Europe. Nine countries because problems don't respect borders.",
    },
    {
      kicker: "The philosophy",
      body: "The best automation is the kind you forget is running. If you notice it, I haven't finished.",
    },
  ];

  return (
    <section
      id="about"
      aria-label="About Waseem Nasir"
      style={{ borderTop: `1px solid ${HAIRLINE_SUBTLE}` }}
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
        {/* Section label */}
        <div className="py-14">
          <span
            className="text-[9px] tracking-[0.36em] uppercase"
            style={{
              color: ACCENT,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            About
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 pb-28">
          {/* Left — sticky portrait */}
          <div className="relative">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={SPRING_SOFT}
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4/5",
                  border: `1px solid ${HAIRLINE_SUBTLE}`,
                  background: SURFACE,
                }}
              >
                <Image
                  src={IMG(
                    "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                  )}
                  alt="Waseem Nasir — confident founder pose, arms crossed, sunglasses"
                  fill
                  sizes="(max-width:1024px) 90vw, 44vw"
                  className="object-cover object-top"
                  style={{ filter: "saturate(0.88) contrast(1.04)" }}
                />
                {/* Amber top rule */}
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: ACCENT, opacity: 0.5 }}
                  aria-hidden
                />
                {/* Name plate */}
                <div
                  className="absolute bottom-0 inset-x-0 px-5 py-4"
                  style={{
                    background: "rgba(12,12,14,0.82)",
                    borderTop: `1px solid ${HAIRLINE_SUBTLE}`,
                  }}
                >
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase"
                    style={{
                      color: MUTED,
                      fontFamily:
                        "var(--font-mono, 'JetBrains Mono', monospace)",
                    }}
                  >
                    Waseem Nasir — Founder, SkynetLabs
                  </p>
                </div>
              </motion.div>

              {/* Inset — second photo, offset */}
              <motion.div
                initial={reduce ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ ...SPRING_SOFT, delay: 0.18 }}
                className="absolute -bottom-10 -right-2 overflow-hidden sm:-right-8"
                style={{
                  width: "44%",
                  aspectRatio: "4/5",
                  border: `1px solid ${ACCENT}`,
                  boxShadow: "0 20px 60px -24px rgba(0,0,0,0.98)",
                }}
              >
                <Image
                  src={IMG(
                    "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                  )}
                  alt="Waseem working from a Bali terrace — laptop, latte, sunglasses"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>

          {/* Right — scrolling text beats */}
          <div className="flex flex-col justify-center gap-0 pt-4 lg:pt-20">
            {BEATS.map((beat, i) => (
              <motion.div
                key={beat.kicker}
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ ...SPRING_SOFT, delay: i * 0.06 }}
                className="py-10"
                style={{
                  borderBottom:
                    i < BEATS.length - 1
                      ? `1px solid ${HAIRLINE_SUBTLE}`
                      : undefined,
                }}
              >
                <span
                  className="block text-[8px] tracking-[0.38em] uppercase mb-4"
                  style={{
                    color: ACCENT,
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} — {beat.kicker}
                </span>
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                    color: TEXT,
                    opacity: 0.85,
                  }}
                >
                  {beat.body}
                </p>
              </motion.div>
            ))}

            {/* Capabilities */}
            <motion.ul
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING_SOFT, delay: 0.24 }}
              className="mt-6 grid grid-cols-2 gap-px"
              style={{ background: HAIRLINE_SUBTLE }}
              aria-label="Capabilities"
            >
              {[
                "n8n self-healing pipelines",
                "Next.js + Stripe builds",
                "WhatsApp & inbox bots",
                "AEO / answer-engine",
                "Meta CAPI wiring",
                "WordPress custom builds",
              ].map((cap) => (
                <li
                  key={cap}
                  className="px-4 py-3 text-[12px] tracking-wide"
                  style={{ background: SURFACE, color: MUTED }}
                >
                  <span style={{ color: ACCENT }} aria-hidden>
                    /{" "}
                  </span>
                  {cap}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   MARQUEE PHOTO STRIP — velocity-skew infinite ticker
   Photos shown as small landscape windows (object-cover on portrait crops)
   ────────────────────────────────────────────────────────────── */
function MarqueePhotoStrip({ reduce }: { reduce: boolean }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useTransform(velocity, [-1500, 0, 1500], [5, 0, -5]);
  const skewSpring = useSpring(skew, { stiffness: 100, damping: 28 });

  const row = [...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS];

  return (
    <section
      aria-label="Photo strip — Waseem Nasir"
      className="overflow-hidden py-8"
      style={{
        borderTop: `1px solid ${HAIRLINE_SUBTLE}`,
        borderBottom: `1px solid ${HAIRLINE_SUBTLE}`,
        background: SURFACE,
      }}
    >
      <motion.div
        style={{ skewX: reduce ? 0 : skewSpring }}
        className="flex gap-4"
      >
        <motion.div
          className="flex shrink-0 gap-4"
          animate={reduce ? {} : { x: ["0%", "-33.333%"] }}
          transition={
            reduce ? {} : { duration: 28, ease: "linear", repeat: Infinity }
          }
          style={{ willChange: "transform" }}
        >
          {row.map((photo, i) => (
            <div
              key={`${photo.src}-${i}`}
              className="relative shrink-0 overflow-hidden"
              style={{
                width: 260,
                height: 174,
                border: `1px solid ${HAIRLINE_SUBTLE}`,
              }}
            >
              <Image
                src={IMG(photo.src)}
                alt={photo.alt}
                fill
                sizes="260px"
                className="object-cover"
                style={{ filter: "saturate(0.82) brightness(0.88)" }}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   CTA SECTION — single CTA, full-bleed photo bg
   ────────────────────────────────────────────────────────────── */
function CTASection({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const yBgSpring = useSpring(yBg, SPRING_DRIFT);

  return (
    <section
      id="contact"
      ref={ref}
      aria-label="Book a discovery call"
      className="relative overflow-hidden"
      style={{ minHeight: "80svh" }}
    >
      {/* Parallax bg photo */}
      <motion.div
        className="absolute inset-0 scale-[1.1]"
        style={{ y: reduce ? 0 : yBgSpring }}
      >
        <Image
          src={IMG(
            "PORTRAIT-2025-08-14-sunglasses-headphones-clifftop-ocean-view.jpg",
          )}
          alt="Waseem Nasir — clifftop ocean view, headphones, sunglasses"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.78) brightness(0.45)" }}
        />
      </motion.div>

      {/* Dark gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(12,12,14,0.75) 0%, rgba(12,12,14,0.55) 50%, rgba(12,12,14,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[900px] flex-col items-center justify-center min-h-[80svh] px-5 py-28 text-center">
        {/* Amber hairline */}
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 h-px w-16 origin-left"
          style={{ background: ACCENT }}
          aria-hidden
        />

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING_SOFT, delay: 0.1 }}
          className="font-light leading-[1.02]"
          style={{
            fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
            color: TEXT,
            fontFamily:
              "var(--font-bricolage, 'Bricolage Grotesque', sans-serif)",
          }}
        >
          Ready to plug the
          <br />
          <span style={{ fontStyle: "italic", color: TEXT }}>leak</span>{" "}
          <span style={{ color: ACCENT }}>in your ops?</span>
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING_SOFT, delay: 0.22 }}
          className="mt-7 max-w-[480px] leading-relaxed"
          style={{ fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: MUTED }}
        >
          30 minutes. No pitch deck. You walk away knowing exactly where your
          ops are bleeding time and money.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING_SOFT, delay: 0.34 }}
          className="mt-12 flex flex-col items-center gap-5"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              background: ACCENT,
              color: "#1a0d00",
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            Book a discovery call
            <span aria-hidden>→</span>
          </Link>

          <a
            href="mailto:waseembali2k26@gmail.com"
            className="text-[10px] tracking-[0.22em] uppercase underline-offset-4 transition-opacity hover:opacity-60 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
            style={{
              color: MUTED,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            }}
          >
            or email directly
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   FOOTER
   ────────────────────────────────────────────────────────────── */
function FooterSection() {
  return (
    <footer
      className="px-5 py-12 sm:px-10"
      style={{
        borderTop: `1px solid ${HAIRLINE_SUBTLE}`,
        background: SURFACE,
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        {/* Wordmark */}
        <span
          className="text-[11px] tracking-[0.28em] uppercase"
          style={{
            color: TEXT,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          Waseem&nbsp;Nasir
        </span>

        {/* Links */}
        <nav className="flex flex-wrap gap-7" aria-label="Footer navigation">
          {[
            { label: "Email", href: "mailto:waseembali2k26@gmail.com" },
            { label: "GitHub", href: "https://github.com/waseemnasir2k26" },
            { label: "SkynetJoe.com", href: "https://skynetjoe.com" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[10px] tracking-[0.24em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
              style={{
                color: MUTED,
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Tagline */}
        <span
          className="text-[9px] tracking-[0.2em] uppercase"
          style={{
            color: MUTED,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          &copy; 2026 · Built in Bali
        </span>
      </div>
    </footer>
  );
}
