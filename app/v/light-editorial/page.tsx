"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/* ============================================================
   VARIANT: light-editorial
   Warm cream editorial canvas (#F7F4EF) — Fraunces serif display,
   Inter grotesk body, JetBrains mono labels. Electric coral accent (#FF4D2E).
   Magazine rhythm, large photos, generous whitespace, calm confidence.
   SELF-CONTAINED — no shared theme tokens touched.
   ============================================================ */

/* ---- palette ---- */
const BG = "#F7F4EF";
const SURFACE = "#FBFAF7";
const TEXT = "#14110D";
const MUTED = "#6B6358";
const ACCENT = "#FF4D2E";
const ACCENT2 = "#1C1A16";
const BORDER = "rgba(20,17,13,0.10)";
const BORDER_STRONG = "rgba(20,17,13,0.18)";

/* ---- image helper ---- */
const IMG = (f: string) => `/img/pro/${f}`;

/* ---- spring presets ---- */
const sp = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.9,
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/* ---- shared: mono label ---- */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono uppercase tracking-[0.18em]"
      style={{ fontSize: "0.68rem", color: ACCENT }}
    >
      {children}
    </span>
  );
}

/* ---- coral dot for wordmark ---- */
function Dot() {
  return <span style={{ color: ACCENT }}>.</span>;
}

/* ============================================================ */

export default function LightEditorialPage() {
  const reduce = !!useReducedMotion();

  return (
    <>
      {/* Brand bg — covers global dark body + aurora layer */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: BG }}
        aria-hidden
      />

      <div className="relative z-10" style={{ color: TEXT }}>
        <main
          id="main-content"
          className="font-sans antialiased"
          style={{ overflowX: "clip" }}
        >
          <Nav />
          <Hero reduce={reduce} />
          <StatStrip />
          <FullBleedBand reduce={reduce} />
          <Approach />
          <SelectedWork />
          <AboutSection reduce={reduce} />
          <Gallery />
          <CTASection />
          <Footer />
        </main>
      </div>
    </>
  );
}

/* ─────────────────────────────── NAV ─────────────────────────────── */
function Nav() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(247,244,239,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* wordmark */}
        <a
          href="/v/light-editorial"
          className="font-serif text-lg font-light tracking-tight"
          style={{ color: TEXT }}
        >
          waseem
          <Dot />
          nasir
        </a>

        {/* nav links */}
        <nav
          className="hidden items-center gap-8 text-sm sm:flex"
          style={{ color: MUTED }}
        >
          {[
            ["#work", "Work"],
            ["#about", "About"],
            ["#approach", "Approach"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="relative transition-colors hover:text-[#14110D]"
              style={{ color: MUTED }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA pill */}
        <a
          href="https://skynetjoe.com/discovery-call"
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{
            background: ACCENT2,
            boxShadow: "0 4px 18px -6px rgba(20,17,13,0.35)",
            transition:
              "transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s",
          }}
        >
          Book a call
          <span
            aria-hidden
            style={{
              display: "inline-block",
              transition: "transform 0.3s cubic-bezier(0.2,0.8,0.2,1)",
            }}
          >
            →
          </span>
        </a>
      </div>
    </header>
  );
}

/* ─────────────────────────────── HERO ─────────────────────────────── */
function Hero({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const scaleImg = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduce ? 1 : 1.07],
  );
  const yChip = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <section ref={ref} className="relative px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        {/* ── LEFT: editorial copy ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative pt-2"
        >
          {/* eyebrow */}
          <motion.div variants={rise} className="flex items-center gap-3">
            <Label>Independent founder · SkynetLabs · since 2019</Label>
          </motion.div>

          {/* headline */}
          <motion.h1
            variants={rise}
            className="serif-display mt-5 font-serif font-light leading-[0.95] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(2.7rem, 7.5vw, 5.6rem)",
              color: TEXT,
            }}
          >
            I make your{" "}
            <em className="not-italic" style={{ color: ACCENT }}>
              busywork
            </em>
            <br />
            disappear.
          </motion.h1>

          {/* sub */}
          <motion.p
            variants={rise}
            className="mt-6 max-w-lg text-[1.05rem] leading-relaxed"
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
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
              style={{
                background: ACCENT,
                boxShadow: "0 8px 32px -8px rgba(255,77,46,0.55)",
                transition:
                  "transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 14px 40px -10px rgba(255,77,46,0.65)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px -8px rgba(255,77,46,0.55)";
              }}
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
              className="rounded-full border px-7 py-3.5 text-sm font-medium transition-colors hover:border-[#14110D]"
              style={{ borderColor: BORDER_STRONG, color: MUTED }}
            >
              See the work
            </a>
          </motion.div>

          {/* location chip */}
          <motion.div
            variants={rise}
            className="mt-10 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: BORDER, color: MUTED, fontSize: "0.8rem" }}
          >
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: ACCENT }}
            />
            <span
              className="font-mono uppercase tracking-widest"
              style={{ fontSize: "0.65rem" }}
            >
              Bali · Worldwide
            </span>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: portrait with parallax ── */}
        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={sp}
            className="relative overflow-hidden rounded-[2rem]"
            style={{
              aspectRatio: "4/5",
              boxShadow: "0 32px 80px -20px rgba(20,17,13,0.22)",
            }}
          >
            <motion.div
              style={{ y: yImg, scale: scaleImg }}
              className="absolute inset-[-8%] h-[116%] w-[116%]"
            >
              <Image
                src={IMG(
                  "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                )}
                alt="Waseem Nasir typing on a laptop at a sunlit Bali terrace cafe"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 85vw, 38vw"
              />
            </motion.div>
            {/* subtle gradient foot */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  "linear-gradient(to top, rgba(247,244,239,0.35), transparent)",
              }}
              aria-hidden
            />
          </motion.div>

          {/* floating stat chip */}
          <motion.div
            style={{
              y: yChip,
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 12px 36px -10px rgba(20,17,13,0.14)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.3 }}
            className="absolute -bottom-5 -right-4 rounded-2xl px-4 py-3 sm:-right-8"
          >
            <div
              className="font-mono text-[0.6rem] uppercase tracking-[0.18em]"
              style={{ color: MUTED }}
            >
              47-step n8n engine
            </div>
            <div
              className="mt-0.5 text-sm font-semibold"
              style={{ color: TEXT }}
            >
              self-healing inbox
            </div>
          </motion.div>

          {/* year badge top-left */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.45 }}
            className="absolute -left-4 top-8 rounded-full px-3 py-1.5 sm:-left-8"
            style={{
              background: ACCENT,
              color: "#fff",
              fontSize: "0.7rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Est. 2019
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── STAT STRIP ─────────────────────────────── */
function StatStrip() {
  const stats = [
    { n: "180+", l: "workflows built" },
    { n: "40+", l: "sites shipped" },
    { n: "9", l: "countries served" },
    { n: "2019", l: "building since" },
  ];
  return (
    <section
      style={{
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={stagger}
        className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            variants={rise}
            className="flex flex-col justify-center px-6 py-10 sm:px-10"
            style={{
              borderRight:
                i < stats.length - 1 ? `1px solid ${BORDER}` : undefined,
            }}
          >
            <div
              className="serif-num font-serif font-light leading-none"
              style={{ fontSize: "clamp(2.2rem,5vw,3.5rem)", color: TEXT }}
            >
              {s.n}
            </div>
            <div
              className="mt-2 font-mono uppercase tracking-[0.14em]"
              style={{ fontSize: "0.64rem", color: MUTED }}
            >
              {s.l}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────── FULL-BLEED BAND ─────────────────────────────── */
function FullBleedBand({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  return (
    <section
      ref={ref}
      className="relative my-20 overflow-hidden"
      style={{ height: "60vh", minHeight: 380 }}
    >
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-[-8%] h-[116%] w-[116%]"
      >
        <Image
          src={IMG(
            "CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg",
          )}
          alt="Waseem working on a laptop on a couch in a brick-wall cafe"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      {/* dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,17,13,0.82) 0%, rgba(20,17,13,0.55) 60%, rgba(20,17,13,0.72) 100%)",
        }}
        aria-hidden
      />
      {/* quote text */}
      <div className="relative flex h-full flex-col items-start justify-center px-8 sm:px-16 lg:px-24">
        <Label>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>the method</span>
        </Label>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={sp}
          className="serif-display mt-5 max-w-3xl font-serif font-light leading-[1.05] tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.4rem)" }}
        >
          I find where leads, follow-ups and ops quietly{" "}
          <em className="not-italic" style={{ color: ACCENT }}>
            leak
          </em>{" "}
          — then engineer the hole shut, permanently.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...sp, delay: 0.3 }}
          className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Bali · serving 9 countries since 2019
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── APPROACH ─────────────────────────────── */
function Approach() {
  const items = [
    {
      n: "01",
      t: "Find the leak",
      d: "I map how your leads, follow-ups and daily ops actually flow — and exactly where they silently fall through the cracks.",
    },
    {
      n: "02",
      t: "Engineer it shut",
      d: "n8n flows, Next.js systems, Stripe, WhatsApp, Meta CAPI — I build whatever the leak needs, properly, no shortcuts.",
    },
    {
      n: "03",
      t: "Make it self-healing",
      d: "The system monitors itself, recovers from its own errors and stays in the background where it belongs.",
    },
    {
      n: "04",
      t: "Return your hours",
      d: "Busywork gone. You stop babysitting the process and focus on the work that actually grows the business.",
    },
  ];

  return (
    <section id="approach" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
        >
          <motion.div variants={rise}>
            <Label>Approach</Label>
          </motion.div>
          <motion.h2
            variants={rise}
            className="serif-display mt-4 font-serif font-light leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", color: TEXT }}
          >
            Four leaks engineered shut.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="mt-14 grid gap-px sm:grid-cols-2"
          style={{ border: `1px solid ${BORDER}` }}
        >
          {items.map((it, i) => (
            <motion.div
              key={it.n}
              variants={rise}
              className="group relative p-8 sm:p-10"
              style={{
                background: SURFACE,
                borderRight: i % 2 === 0 ? `1px solid ${BORDER}` : undefined,
                borderBottom: i < 2 ? `1px solid ${BORDER}` : undefined,
              }}
            >
              {/* hover fill */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `rgba(255,77,46,0.03)` }}
                aria-hidden
              />
              <div
                className="font-mono text-[0.64rem] uppercase tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                {it.n}
              </div>
              <h3
                className="serif-display mt-3 font-serif text-[1.5rem] font-light leading-tight tracking-[-0.01em]"
                style={{ color: TEXT }}
              >
                {it.t}
              </h3>
              <p
                className="mt-4 text-[0.95rem] leading-relaxed"
                style={{ color: MUTED }}
              >
                {it.d}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── SELECTED WORK ─────────────────────────────── */
type WorkItem = {
  img: string;
  imgW: number;
  imgH: number;
  alt: string;
  tag: string;
  title: string;
  desc: string;
  region: string;
};

const WORKS: WorkItem[] = [
  {
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    imgW: 1700,
    imgH: 956,
    alt: "Dual-laptop analytics dashboard at a cafe — PT clinic project",
    tag: "Healthcare · Miami",
    title: "PT clinic booking & downloads",
    desc: "Next.js + Stripe self-serve booking system and gated PDF downloads for a Miami physical-therapy clinic. Patient books, pays and gets the asset — zero manual steps.",
    region: "Miami, US",
  },
  {
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    imgW: 956,
    imgH: 1700,
    alt: "Waseem typing on a backlit keyboard at a night cafe — inbox automation project",
    tag: "Automation · Europe",
    title: "47-step self-healing inbox engine",
    desc: "An n8n workflow that triages inbound email, drafts replies, escalates edge cases and recovers from its own failures — zero dead follow-ups, no babysitting.",
    region: "Europe",
  },
  {
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    imgW: 1700,
    imgH: 956,
    alt: "Waseem focused on phone at a coworking desk — freight lead system project",
    tag: "Growth · US",
    title: "Freight lead capture system",
    desc: "Meta CAPI-fed lead capture and routing for a US freight operator. Every inquiry tracked end-to-end, qualified and piped directly to dispatch.",
    region: "United States",
  },
  {
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    imgW: 956,
    imgH: 1700,
    alt: "Waseem with a client giving a thumbs up in a cafe — Italy trip portal project",
    tag: "Web · GDPR · Italy",
    title: "Family trip planning portal",
    desc: "WordPress GDPR-compliant trip-input system for an Italian family travel business — custom CPT, consent flows, multi-step forms and a clean client dashboard.",
    region: "Italy",
  },
];

function SelectedWork() {
  return (
    <section id="work" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mb-14"
        >
          <motion.div variants={rise}>
            <Label>Selected work</Label>
          </motion.div>
          <motion.h2
            variants={rise}
            className="serif-display mt-4 font-serif font-light leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", color: TEXT }}
          >
            Real systems, quietly running.
          </motion.h2>
          <motion.p
            variants={rise}
            className="mt-4 max-w-lg text-[0.95rem] leading-relaxed"
            style={{ color: MUTED }}
          >
            Client names are private. The problems and outcomes are real.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid gap-5 sm:grid-cols-2"
        >
          {WORKS.map((w) => (
            <WorkCard key={w.title} w={w} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WorkCard({ w }: { w: WorkItem }) {
  return (
    <motion.article
      variants={rise}
      whileHover={{ y: -5 }}
      transition={sp}
      className="group overflow-hidden rounded-2xl"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 4px 24px -8px rgba(20,17,13,0.08)",
      }}
    >
      {/* image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={IMG(w.img)}
          alt={w.alt}
          width={w.imgW}
          height={w.imgH}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 90vw, 45vw"
        />
        {/* tag badge */}
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white"
          style={{ background: ACCENT2 }}
        >
          {w.tag}
        </span>
      </div>

      {/* copy */}
      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="serif-display font-serif text-[1.2rem] font-light leading-snug tracking-[-0.01em]"
            style={{ color: TEXT }}
          >
            {w.title}
          </h3>
          <span
            className="mt-1 shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.14em]"
            style={{ color: MUTED }}
          >
            {w.region}
          </span>
        </div>
        <p
          className="mt-3 text-[0.9rem] leading-relaxed"
          style={{ color: MUTED }}
        >
          {w.desc}
        </p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────── ABOUT ─────────────────────────────── */
function AboutSection({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yPortrait = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduce ? 0 : -40],
  );
  const yBack = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  const tech = [
    "n8n",
    "Next.js",
    "AEO",
    "Stripe",
    "WhatsApp",
    "Meta CAPI",
    "WordPress",
    "GDPR",
  ];

  return (
    <section id="about" ref={ref} className="px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        {/* ── collage of photos ── */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          {/* back portrait */}
          <motion.div
            style={{
              y: yBack,
              aspectRatio: "3/4",
              boxShadow: "0 24px 60px -16px rgba(20,17,13,0.16)",
            }}
            className="relative ml-[15%] overflow-hidden rounded-2xl"
          >
            <Image
              src={IMG(
                "PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
              )}
              alt="Waseem Nasir in a black kurta, soft smile, wooden interior"
              width={956}
              height={1700}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 70vw, 30vw"
            />
          </motion.div>

          {/* front portrait — overlapping */}
          <motion.div
            style={{
              y: yPortrait,
              boxShadow: "0 20px 50px -12px rgba(20,17,13,0.22)",
              border: `4px solid ${BG}`,
            }}
            className="absolute -bottom-8 -left-4 w-[52%] overflow-hidden rounded-2xl sm:-left-8"
          >
            <Image
              src={IMG(
                "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
              )}
              alt="Waseem smiling with headphones near a neon tea sign"
              width={956}
              height={1700}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 40vw, 18vw"
            />
          </motion.div>

          {/* coral est. tag */}
          <div
            className="absolute -right-4 bottom-24 rounded-full px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white sm:-right-8"
            style={{ background: ACCENT }}
          >
            Bali · Worldwide
          </div>
        </div>

        {/* ── copy ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.div variants={rise}>
            <Label>About</Label>
          </motion.div>
          <motion.h2
            variants={rise}
            className="serif-display mt-4 font-serif font-light leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: TEXT }}
          >
            One founder.
            <br />
            <em className="not-italic" style={{ color: ACCENT }}>
              Whole systems.
            </em>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 text-[0.97rem] leading-relaxed"
            style={{ color: MUTED }}
          >
            I&apos;m Waseem — based in Bali, working worldwide since 2019. I
            don&apos;t sell dashboards or buzzwords. I sit with how your
            business actually runs, find where leads, follow-ups and ops quietly
            leak, and engineer the leak shut.
          </motion.p>

          <motion.p
            variants={rise}
            className="mt-4 text-[0.97rem] leading-relaxed"
            style={{ color: MUTED }}
          >
            The result is automation you don&apos;t have to think about: it runs
            in the background, recovers from its own errors, and gives you back
            the hours you were spending on busywork. 180+ workflows built across
            9 countries prove the method works.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-2">
            {tech.map((t) => (
              <span
                key={t}
                className="rounded-full border px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em]"
                style={{ borderColor: BORDER_STRONG, color: MUTED }}
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.a
            variants={rise}
            href="https://skynetjoe.com/discovery-call"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: ACCENT }}
          >
            Book a 30-min discovery call
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── GALLERY ─────────────────────────────── */
type GalleryItem = {
  img: string;
  imgW: number;
  imgH: number;
  alt: string;
  span?: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    img: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    imgW: 956,
    imgH: 1700,
    alt: "Waseem arms spread at Nusa Penida sea cliffs",
    span: "row-span-2",
  },
  {
    img: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
    imgW: 1700,
    imgH: 956,
    alt: "Waseem smiling at a rooftop cafe with a rainbow mug",
  },
  {
    img: "LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
    imgW: 956,
    imgH: 1700,
    alt: "Waseem playing acoustic guitar and smiling in a white cafe",
    span: "row-span-2",
  },
  {
    img: "TRAVEL-2026-03-27-motorbike-helmet-backpack-mountain-road.jpg",
    imgW: 956,
    imgH: 1700,
    alt: "Waseem in a motorbike helmet on a mountain road with a backpack",
  },
  {
    img: "SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg",
    imgW: 1700,
    imgH: 956,
    alt: "Panoramic view of green valley hills with clouds in Bali",
  },
  {
    img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    imgW: 956,
    imgH: 1700,
    alt: "Waseem smiling at a rooftop cafe with a dragonfruit smoothie and laptop",
  },
];

function Gallery() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between">
          <Label>Life &amp; work</Label>
          <span
            className="font-mono text-[0.62rem] uppercase tracking-[0.14em]"
            style={{ color: MUTED }}
          >
            Bali · mountains · cafes
          </span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid auto-rows-[160px] grid-cols-3 gap-3 sm:auto-rows-[200px] lg:auto-rows-[240px]"
        >
          {GALLERY_ITEMS.map((g) => (
            <motion.div
              key={g.img}
              variants={rise}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`group relative overflow-hidden rounded-xl ${g.span ?? ""}`}
              style={{
                border: `1px solid ${BORDER}`,
                boxShadow: "0 4px 20px -6px rgba(20,17,13,0.08)",
              }}
            >
              <Image
                src={IMG(g.img)}
                alt={g.alt}
                width={g.imgW}
                height={g.imgH}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 25vw, 22vw"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── CTA ─────────────────────────────── */
function CTASection() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={sp}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] px-8 py-20 text-center sm:px-16 sm:py-24"
        style={{
          background: ACCENT2,
          boxShadow: "0 40px 100px -30px rgba(20,17,13,0.35)",
        }}
      >
        {/* coral glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 110%, rgba(255,77,46,0.35), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative">
          <Label>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Next step</span>
          </Label>

          <h2
            className="serif-display mx-auto mt-5 max-w-2xl font-serif font-light leading-[1.02] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}
          >
            Let&apos;s find your leak and
            <br />
            <em className="not-italic" style={{ color: ACCENT }}>
              engineer it shut.
            </em>
          </h2>

          <p
            className="mx-auto mt-6 max-w-lg text-[0.97rem] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            One 30-minute call. We&apos;ll map where your busywork lives and
            what it&apos;d take to make it disappear — no pitch, no pressure.
          </p>

          <a
            href="https://skynetjoe.com/discovery-call"
            className="group mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold"
            style={{
              background: ACCENT,
              color: "#fff",
              boxShadow: "0 8px 32px -6px rgba(255,77,46,0.55)",
              transition:
                "transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 14px 40px -8px rgba(255,77,46,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "0 8px 32px -6px rgba(255,77,46,0.55)";
            }}
          >
            Book a 30-min call
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>

          <div
            className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            or email{" "}
            <a
              href="mailto:waseembali2k26@gmail.com"
              className="transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              waseembali2k26@gmail.com
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────── FOOTER ─────────────────────────────── */
function Footer() {
  const links = [
    ["https://skynetjoe.com/discovery-call", "Book a call"],
    ["mailto:waseembali2k26@gmail.com", "Email"],
    ["https://github.com/waseemnasir2k26", "GitHub"],
    ["https://skynetjoe.com", "skynetjoe.com"],
  ];

  return (
    <footer
      className="px-5 py-12 sm:px-8"
      style={{ borderTop: `1px solid ${BORDER}` }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div
            className="font-serif text-lg font-light"
            style={{ color: TEXT }}
          >
            waseem
            <Dot />
            nasir
          </div>
          <div
            className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.15em]"
            style={{ color: MUTED }}
          >
            Bali · worldwide · building since 2019
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm transition-colors hover:text-[#14110D]"
              style={{ color: MUTED }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
