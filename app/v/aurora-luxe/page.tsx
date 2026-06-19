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
  type Variants,
} from "framer-motion";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

/* ----------------------------------------------------------------------------
   VARIANT: aurora-luxe
   Deep forest-ink base (#0A130E) + emerald → teal → warm-gold jewel gradient.
   Same structural mechanic as gradient-glass: glassmorphism + gradient blooms
   + spring motion + horizontal-scroll WorkGallery.
   FONTS: Fraunces (display serif) · Hanken Grotesk (body sans) · JetBrains Mono (labels)
   NO Inter · NO pink/violet/electric-blue.
---------------------------------------------------------------------------- */

/* ── Fonts ── */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* ── Palette ── */
const BG = "#0A130E";
const BG_CTA = "#0C1610";
const SURFACE = "rgba(255,255,255,0.05)";
const SURFACE_HI = "rgba(255,255,255,0.08)";
const TEXT = "#F2F4EF";
const MUTED = "#B8C2B6";
const EMERALD = "#0B5D3B";
const TEAL = "#0E7C66";
const GOLD = "#C9A24B";
const GOLD_LIGHT = "#E2C47A";
const GRAD = `linear-gradient(100deg,${EMERALD} 0%,${TEAL} 48%,${GOLD} 100%)`;
const GRAD_SOFT = `linear-gradient(100deg,${EMERALD},${TEAL} 55%,${GOLD})`;

const IMG_PATH = (f: string) => `/img/pro/${f}`;

/* ── Spring presets ── */
const SP = { type: "spring", stiffness: 115, damping: 18, mass: 0.85 } as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 110, damping: 20 },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

/* ── Shared components ── */
function Bloom({ style }: { style: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        borderRadius: "9999px",
        filter: "blur(90px)",
        pointerEvents: "none",
        willChange: "transform",
        ...style,
      }}
    />
  );
}

function GradText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        backgroundImage: GRAD,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        fontFamily: "var(--font-fraunces)",
      }}
    >
      {children}
    </span>
  );
}

const glassCard: React.CSSProperties = {
  background: SURFACE,
  border: `1px solid rgba(201,162,75,0.16)`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -40px rgba(0,0,0,0.85)",
};

const glassCardHi: React.CSSProperties = {
  ...glassCard,
  background: SURFACE_HI,
  border: `1px solid rgba(201,162,75,0.24)`,
};

/* ============================================================
   PAGE
   ============================================================ */
export default function AuroraLuxePage() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Brand background — covers the global dark body from layout.tsx */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: BG }}
        aria-hidden
      />

      <div
        className={`relative z-10 ${fraunces.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}
        style={{
          color: TEXT,
          fontFamily: "var(--font-hanken), system-ui, sans-serif",
        }}
      >
        <main id="main-content" style={{ overflowX: "clip" }}>
          <Nav />
          <Hero reduce={!!reduce} />
          <Marquee reduce={!!reduce} />
          <Proof />
          <WorkGallery reduce={!!reduce} />
          <About />
          <LifeStrip />
          <Process />
          <CTA />
          <Footer />
        </main>
      </div>
    </>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  return (
    <header className="sticky top-0 z-50 px-5 pt-4 sm:px-8">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3"
        style={glassCard}
      >
        <Link
          href="/v/aurora-luxe"
          className="text-sm font-semibold tracking-tight"
          style={{
            color: TEXT,
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          waseem<GradText>.</GradText>nasir
        </Link>

        <div
          className="hidden items-center gap-8 text-sm sm:flex"
          style={{ color: MUTED }}
        >
          <a href="#work" className="transition-colors hover:text-white">
            Work
          </a>
          <a href="#about" className="transition-colors hover:text-white">
            About
          </a>
          <a href="#process" className="transition-colors hover:text-white">
            Process
          </a>
        </div>

        <a
          href="https://skynetjoe.com/discovery-call"
          className="rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.04] active:scale-95"
          style={{ background: GRAD, color: "#0A130E" }}
        >
          Book a call
        </a>
      </nav>
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const rawChipY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const yPortrait = useSpring(rawY, { stiffness: 80, damping: 20 });
  const yChip = useSpring(rawChipY, { stiffness: 80, damping: 20 });

  return (
    <section ref={ref} className="relative px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
      {/* gradient blooms — jewel palette */}
      <Bloom
        style={{
          width: 560,
          height: 560,
          background: EMERALD,
          opacity: 0.42,
          top: -140,
          left: -100,
        }}
      />
      <Bloom
        style={{
          width: 500,
          height: 500,
          background: GOLD,
          opacity: 0.22,
          top: 100,
          right: -120,
        }}
      />
      <Bloom
        style={{
          width: 440,
          height: 440,
          background: TEAL,
          opacity: 0.32,
          bottom: -160,
          left: "38%",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        {/* LEFT: copy */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative"
        >
          {/* eyebrow badge */}
          <motion.span
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
            style={{
              ...glassCard,
              color: MUTED,
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: GRAD,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Independent founder · SkynetLabs · since 2019
          </motion.span>

          {/* headline */}
          <motion.h1
            variants={rise}
            className="mt-6 font-light leading-[0.97] tracking-tight"
            style={{
              fontSize: "clamp(2.9rem,7.5vw + 0.5rem,5.2rem)",
              color: TEXT,
              fontFamily: "var(--font-fraunces)",
            }}
          >
            I make your <br />
            <GradText>busywork disappear.</GradText>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: MUTED }}
          >
            A founder who builds quiet AI &amp; automation systems behind the
            scenes — missed leads, dead follow-ups, manual ops. I find the leak
            and engineer it shut.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={rise}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="https://skynetjoe.com/discovery-call"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-transform hover:scale-[1.04] active:scale-95"
              style={{ background: GRAD, color: "#0A130E" }}
            >
              Book a 30-min call
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#work"
              className="rounded-full px-6 py-3.5 text-base font-medium transition-colors hover:text-white"
              style={{ ...glassCard, color: MUTED }}
            >
              See the work
            </a>
          </motion.div>

          {/* mono stats */}
          <motion.div
            variants={rise}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm"
            style={{
              color: MUTED,
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            {[
              ["180+", "workflows"],
              ["40+", "sites"],
              ["9", "countries"],
            ].map(([n, l]) => (
              <span key={l}>
                <span style={{ color: TEXT }}>{n}</span> {l}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT: jewel-ring portrait */}
        <motion.div
          style={{ y: yPortrait }}
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SP}
          className="relative mx-auto w-full max-w-[340px] lg:max-w-[380px]"
        >
          {/* gold-emerald gradient ring border */}
          <div
            className="relative rounded-[2rem] p-[3px]"
            style={{
              background: GRAD,
              boxShadow: `0 48px 140px -48px ${EMERALD}88`,
            }}
          >
            <div
              className="relative overflow-hidden rounded-[1.85rem]"
              style={{ background: BG }}
            >
              <Image
                src={IMG_PATH(
                  "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                )}
                alt="Waseem Nasir working on a laptop at a Bali terrace cafe"
                width={956}
                height={1275}
                priority
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 85vw, 380px"
              />
            </div>
          </div>

          {/* floating stat chip */}
          <motion.div
            style={{ y: yChip }}
            className="absolute -bottom-5 -left-5 z-10"
          >
            <div className="rounded-2xl px-4 py-3" style={glassCardHi}>
              <div
                className="text-xs"
                style={{
                  color: GOLD_LIGHT,
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                47-step n8n engine
              </div>
              <div
                className="mt-0.5 text-sm font-semibold"
                style={{ color: TEXT }}
              >
                self-healing inbox
              </div>
            </div>
          </motion.div>

          {/* second chip top-right */}
          <div
            className="absolute -right-4 top-8 z-10 rounded-2xl px-3 py-2.5"
            style={glassCardHi}
          >
            <div
              className="text-xs"
              style={{
                color: GOLD_LIGHT,
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              Bali → worldwide
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   MARQUEE
   ============================================================ */
function Marquee({ reduce }: { reduce: boolean }) {
  const items = [
    "n8n",
    "Next.js 14",
    "AEO",
    "Stripe",
    "WhatsApp bots",
    "Meta CAPI",
    "WordPress",
    "self-healing flows",
    "Framer",
    "TypeScript",
  ];
  const row = [...items, ...items];

  return (
    <section
      className="relative overflow-hidden border-y py-4"
      style={{ borderColor: `rgba(201,162,75,0.14)` }}
      aria-hidden
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap text-sm"
        style={{
          color: MUTED,
          fontFamily: "var(--font-jetbrains), monospace",
        }}
        animate={reduce ? false : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-10">
            {it}
            <span style={{ color: TEAL }}>◆</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================================================
   PROOF — 4 real stat cards
   ============================================================ */
function Proof() {
  const stats = [
    { n: "180+", l: "workflows built" },
    { n: "40+", l: "sites shipped" },
    { n: "9", l: "countries served" },
    { n: "2019", l: "building since" },
  ];

  return (
    <section className="px-5 py-16 sm:px-8">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.l}
            variants={rise}
            whileHover={{ y: -4 }}
            transition={SP}
            className="rounded-2xl p-6"
            style={glassCard}
          >
            <div
              className="text-4xl font-light sm:text-5xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              <GradText>{s.n}</GradText>
            </div>
            <div className="mt-2 text-sm leading-snug" style={{ color: MUTED }}>
              {s.l}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================================================
   WORK GALLERY — horizontal scroll (pinned section)
   ============================================================ */
type Work = {
  img: string;
  w: number;
  h: number;
  alt: string;
  tag: string;
  title: string;
  desc: string;
  region: string;
};

const WORKS: Work[] = [
  {
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    w: 1700,
    h: 956,
    alt: "Dual-laptop analytics dashboard setup at a cafe",
    tag: "Healthcare",
    title: "PT clinic booking",
    desc: "Next.js + Stripe self-serve booking & paid downloads for a Miami physical-therapy clinic.",
    region: "Miami, US",
  },
  {
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    w: 956,
    h: 1275,
    alt: "Waseem typing on a backlit keyboard at a night cafe",
    tag: "Automation",
    title: "Self-healing inbox",
    desc: "A 47-step n8n workflow that triages, replies and recovers from its own failures — zero dead follow-ups.",
    region: "Europe",
  },
  {
    img: "CAFE-WORK-2026-06-01-rooftop-laptop-orange-juice-foreground.jpg",
    w: 956,
    h: 1275,
    alt: "Rooftop cafe laptop session with orange juice",
    tag: "Growth",
    title: "Freight lead system",
    desc: "Meta CAPI-fed lead capture & routing for a US freight operator — every inquiry tracked end-to-end.",
    region: "United States",
  },
  {
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    w: 956,
    h: 1275,
    alt: "Waseem with a client giving a thumbs up at a cafe",
    tag: "Web · GDPR",
    title: "Family trip portal",
    desc: "A WordPress, GDPR-compliant trip-planning portal for an Italian travel family business.",
    region: "Italy",
  },
  {
    img: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
    w: 956,
    h: 1275,
    alt: "Rooftop cafe with laptop, mountain view and clouds",
    tag: "AEO",
    title: "Answer-engine presence",
    desc: "Schema, entity & content engineering so businesses get cited by AI search, not buried.",
    region: "Worldwide",
  },
  {
    img: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
    w: 1700,
    h: 956,
    alt: "Night coworking session with a team of laptops",
    tag: "Ops",
    title: "Manual-ops teardown",
    desc: "Mapped a team&apos;s repetitive busywork and replaced it with quiet, monitored automations.",
    region: "Worldwide",
  },
];

function WorkGallery({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);
  const x = useSpring(rawX, { stiffness: 60, damping: 22, mass: 1 });

  return (
    <section id="work" ref={ref} style={{ height: reduce ? "auto" : "320vh" }}>
      <div
        className={
          reduce
            ? "px-5 py-16 sm:px-8"
            : "sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-5 sm:px-8"
        }
      >
        <Bloom
          style={{
            width: 640,
            height: 640,
            background: TEAL,
            opacity: 0.18,
            top: "20%",
            left: "28%",
          }}
        />
        <Bloom
          style={{
            width: 380,
            height: 380,
            background: GOLD,
            opacity: 0.14,
            bottom: "10%",
            right: "5%",
          }}
        />

        {/* section header */}
        <div className="relative mx-auto mb-8 flex w-full max-w-6xl items-end justify-between">
          <div>
            <div
              className="text-xs uppercase tracking-[0.25em]"
              style={{
                color: TEAL,
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              Selected work
            </div>
            <h2
              className="mt-2 font-light"
              style={{
                fontSize: "clamp(1.9rem,4vw + 0.5rem,3.5rem)",
                fontFamily: "var(--font-fraunces)",
              }}
            >
              Real systems, <GradText>quietly running</GradText>
            </h2>
          </div>
          {!reduce && (
            <div
              className="hidden text-xs sm:block"
              style={{
                color: MUTED,
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              scroll ↓ to pan →
            </div>
          )}
        </div>

        {/* reduced-motion: 3-col static grid */}
        {reduce ? (
          <div className="relative mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WORKS.map((w) => (
              <WorkCard key={w.title} w={w} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-visible">
            <motion.div
              style={{ x }}
              className="flex w-max gap-6 pl-[max(1.25rem,calc((100vw-72rem)/2))]"
            >
              {WORKS.map((w) => (
                <div
                  key={w.title}
                  className="w-[78vw] sm:w-[44vw] lg:w-[30rem] flex-shrink-0"
                >
                  <WorkCard w={w} />
                </div>
              ))}
              <div className="w-24 flex-shrink-0" aria-hidden />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function WorkCard({ w }: { w: Work }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={SP}
      className="group h-full overflow-hidden rounded-3xl"
      style={glassCard}
    >
      {/* image */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={IMG_PATH(w.img)}
          alt={w.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 78vw, 30rem"
        />
        {/* bottom-fade overlay */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg,rgba(10,19,14,0) 30%,rgba(10,19,14,0.88) 100%)",
          }}
        />
        {/* tag pill */}
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: GRAD_SOFT, color: "#0A130E" }}
        >
          {w.tag}
        </span>
      </div>

      {/* copy */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-xl font-normal leading-snug"
            style={{
              color: TEXT,
              fontFamily: "var(--font-fraunces)",
            }}
          >
            {w.title}
          </h3>
          <span
            className="shrink-0 text-xs leading-none"
            style={{
              color: GOLD_LIGHT,
              marginTop: "0.2rem",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            {w.region}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
          {w.desc}
        </p>
      </div>
    </motion.article>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */
function About() {
  const gallery = [
    {
      f: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
      alt: "Waseem arms crossed, sunglasses, confident pose at table",
      cls: "row-span-2",
      w: 956,
      h: 1700,
    },
    {
      f: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
      alt: "Waseem arms spread on the Nusa Penida cliffs",
      cls: "",
      w: 956,
      h: 1700,
    },
    {
      f: "LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
      alt: "Waseem smiling with an acoustic guitar in a white cafe",
      cls: "",
      w: 956,
      h: 1700,
    },
    {
      f: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
      alt: "Waseem on a mountain ridge in a tan knit sweater",
      cls: "row-span-2",
      w: 956,
      h: 1700,
    },
  ];

  return (
    <section id="about" className="relative px-5 py-24 sm:px-8">
      <Bloom
        style={{
          width: 480,
          height: 480,
          background: EMERALD,
          opacity: 0.22,
          top: 0,
          right: -140,
        }}
      />
      <Bloom
        style={{
          width: 360,
          height: 360,
          background: GOLD,
          opacity: 0.12,
          bottom: 0,
          left: -80,
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        {/* copy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.div
            variants={rise}
            className="text-xs uppercase tracking-[0.25em]"
            style={{
              color: TEAL,
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            About
          </motion.div>
          <motion.h2
            variants={rise}
            className="mt-3 font-light leading-tight"
            style={{
              fontSize: "clamp(2rem,4vw + 0.5rem,3.5rem)",
              fontFamily: "var(--font-fraunces)",
            }}
          >
            One founder. <GradText>Whole systems.</GradText>
          </motion.h2>
          <motion.p
            variants={rise}
            className="mt-6 text-lg leading-relaxed"
            style={{ color: MUTED }}
          >
            I&apos;m Waseem — based in Bali, working worldwide since 2019. I
            don&apos;t sell dashboards or buzzwords. I sit with how your
            business actually runs, find where leads, follow-ups and ops quietly
            leak, and engineer the leak shut.
          </motion.p>
          <motion.p
            variants={rise}
            className="mt-4 text-lg leading-relaxed"
            style={{ color: MUTED }}
          >
            The result is automation you don&apos;t have to think about: it runs
            in the background, recovers from its own errors, and gives you back
            the hours you were spending on busywork.
          </motion.p>

          {/* skill chips */}
          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
            {[
              "n8n",
              "Next.js 14",
              "AEO",
              "Stripe",
              "WhatsApp",
              "Meta CAPI",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full px-4 py-2 text-xs"
                style={{
                  ...glassCard,
                  color: MUTED,
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* jewel-glass photo bento */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={SP}
          className="grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[165px]"
        >
          {gallery.map((g) => (
            <div
              key={g.f}
              className={`relative overflow-hidden rounded-2xl ${g.cls}`}
              style={{
                ...glassCard,
                ...(g.cls === "row-span-2"
                  ? { padding: 2, background: GRAD }
                  : {}),
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-[inherit]"
                style={g.cls === "row-span-2" ? { background: BG } : {}}
              >
                <Image
                  src={IMG_PATH(g.f)}
                  alt={g.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 22rem"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   LIFE STRIP — 2-image full-bleed accent strip (extra photos)
   ============================================================ */
function LifeStrip() {
  return (
    <section className="relative overflow-hidden px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl gap-4">
        {/* wide landscape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={SP}
          className="relative h-52 flex-[2] overflow-hidden rounded-3xl sm:h-64"
          style={glassCard}
        >
          <Image
            src={IMG_PATH(
              "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
            )}
            alt="Waseem smiling at a rooftop cafe with a laptop and rainbow mug"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 65vw, 50rem"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(120deg,rgba(10,19,14,0.55) 0%,transparent 60%)",
            }}
          />
          <span
            className="absolute bottom-4 left-5 text-xs uppercase tracking-widest"
            style={{
              color: TEXT,
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            Bali · rooftop office
          </span>
        </motion.div>

        {/* portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...SP, delay: 0.07 }}
          className="relative h-52 flex-1 overflow-hidden rounded-3xl sm:h-64"
          style={glassCard}
        >
          <Image
            src={IMG_PATH(
              "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
            )}
            alt="Waseem standing in front of a neon 'no limit' sign in black outfit"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 30vw, 22rem"
          />
        </motion.div>

        {/* event networking proof */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...SP, delay: 0.14 }}
          className="relative hidden h-52 flex-1 overflow-hidden rounded-3xl sm:block sm:h-64"
          style={glassCard}
        >
          <Image
            src={IMG_PATH(
              "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
            )}
            alt="Waseem at a Bali coworking group meetup"
            fill
            className="object-cover"
            sizes="22rem"
          />
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg,transparent 40%,rgba(10,19,14,0.75) 100%)",
            }}
          />
          <span
            className="absolute bottom-4 left-4 text-xs uppercase tracking-widest"
            style={{
              color: TEXT,
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            Community · Bali
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   PROCESS
   ============================================================ */
function Process() {
  const steps = [
    {
      n: "01",
      t: "Find the leak",
      d: "I map how leads, follow-ups and ops actually flow — and where they quietly fall through the cracks.",
    },
    {
      n: "02",
      t: "Engineer it shut",
      d: "I build the system: n8n flows, Next.js front-ends, Stripe, WhatsApp — whatever the leak demands.",
    },
    {
      n: "03",
      t: "Make it self-healing",
      d: "It runs in the background, monitors itself, recovers from errors, and stays completely out of your way.",
    },
  ];

  return (
    <section id="process" className="relative px-5 py-24 sm:px-8">
      <Bloom
        style={{
          width: 500,
          height: 500,
          background: TEAL,
          opacity: 0.14,
          bottom: -80,
          right: -80,
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SP}
        >
          <div
            className="text-xs uppercase tracking-[0.25em]"
            style={{
              color: GOLD_LIGHT,
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            How it works
          </div>
          <h2
            className="mt-3 font-light"
            style={{
              fontSize: "clamp(2rem,4vw + 0.5rem,3.5rem)",
              fontFamily: "var(--font-fraunces)",
            }}
          >
            How the <GradText>busywork disappears</GradText>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {steps.map((s) => (
            <motion.div
              key={s.n}
              variants={rise}
              whileHover={{ y: -5 }}
              transition={SP}
              className="relative overflow-hidden rounded-3xl p-7"
              style={glassCard}
            >
              {/* giant gradient outline number */}
              <div
                className="absolute -right-5 -top-6 select-none text-8xl font-light opacity-[0.18]"
                aria-hidden
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                <GradText>{s.n}</GradText>
              </div>
              {/* gradient rule */}
              <div
                className="mb-5 h-[3px] w-14 rounded-full"
                style={{ background: GRAD }}
              />
              <h3
                className="text-2xl font-normal leading-snug"
                style={{
                  color: TEXT,
                  fontFamily: "var(--font-fraunces)",
                }}
              >
                {s.t}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                {s.d}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA
   ============================================================ */
function CTA() {
  return (
    <section className="relative px-5 py-24 sm:px-8">
      <div className="relative mx-auto max-w-5xl">
        {/* gold-emerald gradient-bordered panel */}
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-[2px]"
          style={{ background: GRAD }}
        >
          <div
            className="relative overflow-hidden rounded-[2.4rem] px-8 py-16 text-center sm:px-16 sm:py-24"
            style={{ background: BG_CTA }}
          >
            <Bloom
              style={{
                width: 460,
                height: 460,
                background: EMERALD,
                opacity: 0.36,
                top: -130,
                left: "25%",
              }}
            />
            <Bloom
              style={{
                width: 380,
                height: 380,
                background: TEAL,
                opacity: 0.24,
                bottom: -130,
                right: -60,
              }}
            />
            <Bloom
              style={{
                width: 280,
                height: 280,
                background: GOLD,
                opacity: 0.18,
                bottom: -60,
                left: -40,
              }}
            />

            <div className="relative">
              <div
                className="mx-auto mb-4 text-xs uppercase tracking-[0.25em]"
                style={{
                  color: GOLD_LIGHT,
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                Ready to start
              </div>
              <h2
                className="mx-auto max-w-3xl font-light leading-[1.02]"
                style={{
                  fontSize: "clamp(2.4rem,5vw + 0.5rem,4.2rem)",
                  fontFamily: "var(--font-fraunces)",
                }}
              >
                Let&apos;s find your leak and{" "}
                <GradText>engineer it shut.</GradText>
              </h2>
              <p
                className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
                style={{ color: MUTED }}
              >
                One 30-minute call. We&apos;ll map where your busywork lives and
                what it&apos;d take to make it disappear.
              </p>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-transform hover:scale-[1.04] active:scale-95"
                style={{ background: GRAD, color: "#0A130E" }}
              >
                Book a 30-min call →
              </a>
              <div
                className="mt-5 text-sm"
                style={{
                  color: MUTED,
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                or email{" "}
                <a
                  href="mailto:waseembali2k26@gmail.com"
                  className="transition-colors hover:text-white"
                  style={{ color: MUTED }}
                >
                  waseembali2k26@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer
      className="border-t px-5 py-12 sm:px-8"
      style={{ borderColor: `rgba(201,162,75,0.14)` }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div
            className="text-sm font-semibold"
            style={{
              color: TEXT,
              fontFamily: "var(--font-jetbrains), monospace",
            }}
          >
            waseem<GradText>.</GradText>nasir
          </div>
          <div className="mt-1 text-sm" style={{ color: MUTED }}>
            Bali · worldwide · building since 2019
          </div>
        </div>

        <nav
          className="flex flex-wrap gap-x-7 gap-y-2 text-sm"
          style={{ color: MUTED }}
          aria-label="Footer navigation"
        >
          <a
            href="https://skynetjoe.com/discovery-call"
            className="transition-colors hover:text-white"
          >
            Book a call
          </a>
          <a
            href="https://github.com/waseemnasir2k26"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://skynetjoe.com"
            className="transition-colors hover:text-white"
          >
            skynetjoe.com
          </a>
          <a
            href="mailto:waseembali2k26@gmail.com"
            className="transition-colors hover:text-white"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
