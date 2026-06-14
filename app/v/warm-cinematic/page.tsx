"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  BRAND TOKENS — warm cinematic dark (local, isolated)              */
/* ------------------------------------------------------------------ */
const BG = "#14110D"; // deep warm charcoal
const SURFACE = "#1C1813"; // raised warm panel
const TEXT = "#F2ECE1"; // cream
const MUTED = "#A89C86"; // warm taupe
const ACCENT = "#E8B14C"; // amber-gold
const ACCENT2 = "#C9572B"; // ember / burnt sienna
const HAIRLINE = "rgba(232,177,76,0.22)";

const IMG = (f: string) => `/img/pro/${f}`;

/* ------------------------------------------------------------------ */
/*  HORIZONTAL PANEL DATA — the cinematic spine                       */
/* ------------------------------------------------------------------ */
type Panel = {
  file: string;
  index: string;
  kicker: string;
  title: string;
  body: string;
  meta: string;
};

const PANELS: Panel[] = [
  {
    file: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
    index: "01",
    kicker: "The studio of one",
    title: "Built quietly,\nfrom anywhere.",
    body: "No team to hand it off to. The person who scopes your problem is the person who ships the fix.",
    meta: "Bali · works worldwide",
  },
  {
    file: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    index: "02",
    kicker: "Physical therapy clinic · Miami",
    title: "Booking that\nnever sleeps.",
    body: "Next.js site with Stripe checkout so patients self-book and pay before they arrive — front desk freed.",
    meta: "Next.js · Stripe",
  },
  {
    file: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    index: "03",
    kicker: "Inbox automation engine · Europe",
    title: "47 steps that\nheal themselves.",
    body: "A self-healing n8n pipeline that triages, routes and recovers — the inbox runs without a human watching it.",
    meta: "n8n · 47-step self-healing",
  },
  {
    file: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    index: "04",
    kicker: "Freight lead system · US",
    title: "No lead left\nin the dark.",
    body: "Meta CAPI wired to a clean follow-up engine, so every inbound is captured, scored and chased — automatically.",
    meta: "Meta CAPI · lead ops",
  },
  {
    file: "PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    index: "05",
    kicker: "Family trip portal · Italy",
    title: "Calm software,\ndone right.",
    body: "A WordPress trip portal built GDPR-clean — privacy handled at the foundation, not bolted on after.",
    meta: "WordPress · GDPR",
  },
];

/* ------------------------------------------------------------------ */
/*  GALLERY (full-bleed personality strip)                            */
/* ------------------------------------------------------------------ */
const GALLERY = [
  "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
  "TRAVEL-2026-03-27-motorbike-helmet-backpack-mountain-road.jpg",
  "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
  "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  "SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg",
  "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
];

const PROOF = [
  { n: "180+", l: "workflows built" },
  { n: "40+", l: "sites shipped" },
  { n: "9", l: "countries served" },
  { n: "2019", l: "building since" },
];

const CTA = "https://skynetjoe.com/discovery-call";

/* ================================================================== */
/*  HORIZONTAL SPINE (desktop) — vertical wheel drives X              */
/* ================================================================== */
function HorizontalSpine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
      }
      setVh(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const x = useSpring(rawX, { stiffness: 90, damping: 26, mass: 0.5 });

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      style={{ height: scrollRange > 0 ? scrollRange + vh : "500vh" }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* progress rail */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-px"
          style={{ background: HAIRLINE }}
        >
          <motion.div
            className="h-full origin-left"
            style={{ background: ACCENT, scaleX: scrollYProgress }}
          />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex h-full w-max items-stretch"
        >
          <IntroCard />
          {PANELS.map((p, i) => (
            <SpinePanel
              key={p.file}
              panel={p}
              progress={scrollYProgress}
              idx={i}
            />
          ))}
          <OutroCard />
        </motion.div>

        {/* scroll hint */}
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: MUTED }}
        >
          scroll →
        </div>
      </div>
    </section>
  );
}

function IntroCard() {
  return (
    <div
      className="flex h-full w-[78vw] shrink-0 flex-col justify-center px-[7vw]"
      style={{ background: BG }}
    >
      <span
        className="mb-6 font-mono text-[11px] uppercase tracking-[0.45em]"
        style={{ color: ACCENT }}
      >
        / selected work
      </span>
      <h2
        className="font-serif text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-[0.98]"
        style={{ color: TEXT }}
      >
        Find the leak.
        <br />
        <span style={{ color: ACCENT }}>Engineer it shut.</span>
      </h2>
      <p
        className="mt-8 max-w-md font-sans text-base leading-relaxed"
        style={{ color: MUTED }}
      >
        Real systems, real businesses. Names stay private — the engineering
        speaks for itself.
      </p>
      <div
        className="mt-10 h-px w-40"
        style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
      />
    </div>
  );
}

function SpinePanel({
  panel,
  progress,
  idx,
}: {
  panel: Panel;
  progress: MotionValue<number>;
  idx: number;
}) {
  // gentle parallax on the image inside each panel
  const span = 1 / (PANELS.length + 1);
  const start = idx * span * 0.7;
  const imgX = useTransform(progress, [start, start + span], ["-6%", "6%"]);

  return (
    <article
      className="relative flex h-full w-[88vw] shrink-0 overflow-hidden md:w-[68vw]"
      style={{ background: SURFACE }}
    >
      <motion.div style={{ x: imgX }} className="absolute inset-0 scale-110">
        <Image
          src={IMG(panel.file)}
          alt={panel.kicker}
          fill
          sizes="70vw"
          className="object-cover"
          style={{ filter: "saturate(0.92) contrast(1.05) brightness(0.82)" }}
          priority={idx === 0}
        />
      </motion.div>

      {/* cinematic warm grade overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, ${BG} 0%, rgba(20,17,13,0.55) 42%, rgba(20,17,13,0.12) 100%)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 18% 90%, rgba(201,87,43,0.20), transparent 55%)",
          mixBlendMode: "screen",
        }}
        aria-hidden
      />

      {/* content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-end p-8 md:p-14">
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-[12px] tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            {panel.index}
          </span>
          <span className="h-px w-10" style={{ background: HAIRLINE }} />
          <span
            className="font-mono text-[11px] uppercase tracking-[0.32em]"
            style={{ color: MUTED }}
          >
            {panel.kicker}
          </span>
        </div>

        <h3
          className="mt-5 max-w-xl whitespace-pre-line font-serif text-[clamp(2rem,4.4vw,4rem)] font-light leading-[1.02]"
          style={{ color: TEXT }}
        >
          {panel.title}
        </h3>

        <p
          className="mt-5 max-w-md font-sans text-[15px] leading-relaxed"
          style={{ color: "rgba(242,236,225,0.82)" }}
        >
          {panel.body}
        </p>

        <div
          className="mt-7 inline-flex w-fit items-center gap-3 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{
            borderColor: HAIRLINE,
            color: ACCENT,
            background: "rgba(20,17,13,0.4)",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
          {panel.meta}
        </div>
      </div>
    </article>
  );
}

function OutroCard() {
  return (
    <div
      className="flex h-full w-[72vw] shrink-0 flex-col items-start justify-center px-[7vw]"
      style={{ background: BG }}
    >
      <span
        className="mb-6 font-mono text-[11px] uppercase tracking-[0.45em]"
        style={{ color: ACCENT }}
      >
        / end of reel
      </span>
      <h2
        className="font-serif text-[clamp(2.4rem,5.5vw,5rem)] font-light leading-[1]"
        style={{ color: TEXT }}
      >
        Your busywork
        <br />
        is next.
      </h2>
      <Link
        href={CTA}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-10 inline-flex items-center gap-4 rounded-full px-8 py-4 font-sans text-base font-medium transition-transform duration-300 hover:scale-[1.03]"
        style={{ background: ACCENT, color: BG }}
      >
        Book a 30-min call
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}

/* ================================================================== */
/*  VERTICAL FALLBACK (mobile + reduced motion)                       */
/* ================================================================== */
function VerticalSpine() {
  return (
    <section aria-label="Selected work" className="px-5 py-20">
      <span
        className="mb-4 block font-mono text-[11px] uppercase tracking-[0.4em]"
        style={{ color: ACCENT }}
      >
        / selected work
      </span>
      <h2
        className="mb-12 font-serif text-[clamp(2.2rem,9vw,3.2rem)] font-light leading-[1]"
        style={{ color: TEXT }}
      >
        Find the leak. <span style={{ color: ACCENT }}>Engineer it shut.</span>
      </h2>

      <div className="flex flex-col gap-8">
        {PANELS.map((p) => (
          <article
            key={p.file}
            className="relative overflow-hidden rounded-2xl"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={IMG(p.file)}
                alt={p.kicker}
                fill
                sizes="100vw"
                className="object-cover"
                style={{
                  filter: "saturate(0.92) contrast(1.05) brightness(0.8)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, ${BG} 4%, rgba(20,17,13,0.2) 60%, transparent)`,
                }}
                aria-hidden
              />
            </div>
            <div className="relative -mt-24 p-6">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[12px] tracking-[0.3em]"
                  style={{ color: ACCENT }}
                >
                  {p.index}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: MUTED }}
                >
                  {p.kicker}
                </span>
              </div>
              <h3
                className="mt-3 whitespace-pre-line font-serif text-3xl font-light leading-tight"
                style={{ color: TEXT }}
              >
                {p.title}
              </h3>
              <p
                className="mt-3 font-sans text-sm leading-relaxed"
                style={{ color: "rgba(242,236,225,0.82)" }}
              >
                {p.body}
              </p>
              <div
                className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ borderColor: HAIRLINE, color: ACCENT }}
              >
                {p.meta}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  HERO                                                              */
/* ================================================================== */
function Hero({ reduced }: { reduced: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <header
      ref={ref}
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden"
    >
      <motion.div
        style={reduced ? undefined : { y: yImg }}
        className="absolute inset-0"
      >
        <Image
          src={IMG(
            "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
          )}
          alt="Waseem Nasir working at a rooftop cafe at night"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.9) contrast(1.08) brightness(0.7)" }}
        />
      </motion.div>

      {/* warm cinematic grade */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0.18) 35%, ${BG} 96%)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 80% 10%, rgba(232,177,76,0.16), transparent 60%)",
          mixBlendMode: "screen",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-10 md:pb-24">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="flex items-center gap-4"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{
              borderColor: HAIRLINE,
              color: ACCENT,
              background: "rgba(20,17,13,0.35)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT }}
            />
            Waseem Nasir · SkynetLabs
          </span>
        </motion.div>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.08 }}
          className="mt-7 max-w-4xl font-serif text-[clamp(2.8rem,8.5vw,7rem)] font-light leading-[0.95]"
          style={{ color: TEXT }}
        >
          I make your
          <br />
          busywork{" "}
          <span className="italic" style={{ color: ACCENT }}>
            disappear.
          </span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.16 }}
          className="mt-8 max-w-2xl font-sans text-[clamp(1rem,2vw,1.25rem)] leading-relaxed"
          style={{ color: "rgba(242,236,225,0.86)" }}
        >
          A founder who builds quiet AI &amp; automation systems behind the
          scenes — missed leads, dead follow-ups, manual ops. I find the leak
          and engineer it shut.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.24 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full px-7 py-4 font-sans text-base font-medium transition-transform duration-300 hover:scale-[1.03]"
            style={{ background: ACCENT, color: BG }}
          >
            Book a 30-min call
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <span
            className="font-mono text-[12px] tracking-[0.2em]"
            style={{ color: MUTED }}
          >
            Bali · building since 2019
          </span>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        style={reduced ? undefined : { opacity: fade }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em]"
      >
        <span style={{ color: MUTED }}>scroll</span>
      </motion.div>
    </header>
  );
}

/* ================================================================== */
/*  PROOF STRIP                                                       */
/* ================================================================== */
function Proof() {
  return (
    <section
      className="border-y px-5 py-14 md:py-20"
      style={{ borderColor: HAIRLINE, background: SURFACE }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        {PROOF.map((p, i) => (
          <motion.div
            key={p.l}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col"
          >
            <span
              className="font-serif text-[clamp(2.4rem,6vw,4rem)] font-light leading-none"
              style={{ color: ACCENT }}
            >
              {p.n}
            </span>
            <span
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em]"
              style={{ color: MUTED }}
            >
              {p.l}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  ABOUT — portrait + statement                                     */
/* ================================================================== */
function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32"
    >
      <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl"
          style={{ border: `1px solid ${HAIRLINE}` }}
        >
          <Image
            src={IMG("PORTRAIT-stool-portrait-navy-polo-framed-art.jpg")}
            alt="Portrait of Waseem Nasir"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            style={{ filter: "saturate(0.92) contrast(1.05) brightness(0.9)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 20% 90%, rgba(201,87,43,0.18), transparent 60%)",
              mixBlendMode: "screen",
            }}
            aria-hidden
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="font-mono text-[11px] uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            / the operator
          </span>
          <h2
            className="mt-5 font-serif text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.05]"
            style={{ color: TEXT }}
          >
            One founder. Quiet systems. Real outcomes.
          </h2>
          <p
            className="mt-6 font-sans text-base leading-relaxed"
            style={{ color: "rgba(242,236,225,0.82)" }}
          >
            I&apos;m Waseem — an independent founder who builds AI and
            automation for growing businesses. n8n, Next.js, AEO, Stripe,
            WhatsApp bots: the plumbing that turns a leaky operation into one
            that runs itself.
          </p>
          <p
            className="mt-4 font-sans text-base leading-relaxed"
            style={{ color: MUTED }}
          >
            Based in Bali, working across nine countries since 2019. No agency
            layers, no hand-offs — you talk to the person who builds it.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "n8n",
              "Next.js",
              "AEO",
              "Stripe",
              "WhatsApp bots",
              "Meta CAPI",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em]"
                style={{
                  borderColor: HAIRLINE,
                  color: "rgba(242,236,225,0.78)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  GALLERY STRIP (full-bleed personality marquee)                   */
/* ================================================================== */
function Gallery() {
  return (
    <section
      aria-label="Off the clock"
      className="overflow-hidden py-20"
      style={{ background: BG }}
    >
      <div className="mx-auto mb-10 max-w-6xl px-5 md:px-10">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.4em]"
          style={{ color: ACCENT }}
        >
          / off the clock
        </span>
        <h2
          className="mt-4 font-serif text-[clamp(1.8rem,4vw,3rem)] font-light"
          style={{ color: TEXT }}
        >
          Same person, different timezone.
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto px-5 pb-4 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GALLERY.map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: (i % 4) * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative h-[44vw] max-h-[420px] min-h-[260px] w-[68vw] shrink-0 overflow-hidden rounded-xl md:w-[28vw]"
            style={{ border: `1px solid ${HAIRLINE}` }}
          >
            <Image
              src={IMG(f)}
              alt="Waseem Nasir"
              fill
              sizes="(max-width: 768px) 68vw, 28vw"
              className="object-cover"
              style={{
                filter: "saturate(0.95) contrast(1.04) brightness(0.88)",
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FINAL CTA                                                         */
/* ================================================================== */
function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="relative h-[80vh] min-h-[520px] w-full">
        <Image
          src={IMG(
            "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
          )}
          alt="Waseem Nasir working late at a beach cafe"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.9) contrast(1.08) brightness(0.55)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${BG} 0%, rgba(20,17,13,0.4) 40%, ${BG} 100%)`,
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 50%, rgba(232,177,76,0.14), transparent 65%)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-serif text-[clamp(2.4rem,7vw,5.5rem)] font-light leading-[0.98]"
            style={{ color: TEXT }}
          >
            Let&apos;s find your leak.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl font-sans text-base leading-relaxed"
            style={{ color: "rgba(242,236,225,0.82)" }}
          >
            Thirty minutes. We map where your time is leaking and what it would
            take to engineer it shut. No pitch theatre.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-3 rounded-full px-8 py-4 font-sans text-base font-medium transition-transform duration-300 hover:scale-[1.04]"
              style={{ background: ACCENT, color: BG }}
            >
              Book a 30-min call
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* footer */}
      <footer
        className="border-t px-5 py-10 md:px-10"
        style={{ borderColor: HAIRLINE, background: BG }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <span
            className="font-serif text-xl font-light"
            style={{ color: TEXT }}
          >
            Waseem Nasir
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] tracking-[0.1em]">
            <a
              href="mailto:waseembali2k26@gmail.com"
              style={{ color: MUTED }}
              className="hover:opacity-80"
            >
              waseembali2k26@gmail.com
            </a>
            <a
              href="https://github.com/waseemnasir2k26"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: MUTED }}
              className="hover:opacity-80"
            >
              github.com/waseemnasir2k26
            </a>
            <a
              href="https://skynetjoe.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: MUTED }}
              className="hover:opacity-80"
            >
              skynetjoe.com
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}

/* ================================================================== */
/*  NAV                                                               */
/* ================================================================== */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Site navigation"
      className="fixed left-0 right-0 top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? `rgba(20,17,13,0.92)` : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${HAIRLINE}`
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
        {/* wordmark */}
        <span
          className="font-serif text-lg font-light tracking-wide"
          style={{ color: TEXT }}
        >
          Waseem Nasir
        </span>

        {/* desktop links */}
        <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.22em] md:flex">
          {[
            { label: "Work", href: "#work" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{ color: MUTED }}
              className="transition-colors duration-200 hover:opacity-100"
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = TEXT)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = MUTED)
              }
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={CTA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-sm font-medium transition-transform duration-300 hover:scale-[1.04]"
          style={{ background: ACCENT, color: BG }}
        >
          Book a call
          <span aria-hidden>→</span>
        </Link>
      </div>
    </nav>
  );
}

/* ================================================================== */
/*  PAGE                                                              */
/* ================================================================== */
export default function WarmCinematicPage() {
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // horizontal spine only on desktop + when motion allowed; else vertical
  const useHorizontal = isDesktop === true && !reduced;

  return (
    <main id="main-content" className="relative">
      {/* brand background covers global dark body + aurora */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: BG }}
        aria-hidden
      />

      <div className="relative z-10" style={{ color: TEXT }}>
        <Nav />
        <Hero reduced={reduced} />
        <Proof />
        {isDesktop === null ? null : useHorizontal ? (
          <HorizontalSpine />
        ) : (
          <VerticalSpine />
        )}
        <About />
        <Gallery />
        <FinalCTA />
      </div>
    </main>
  );
}
