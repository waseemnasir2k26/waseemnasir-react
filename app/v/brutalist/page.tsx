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
   BRUTALIST / SWISS  —  Waseem Nasir founder variant
   Route: /v/brutalist
   Self-contained. Touches no shared files.
   Palette: paper #FAFAF7 | ink #0A0A0A | red #E2231A
   ============================================================ */

const PAPER = "#FAFAF7";
const PAPER2 = "#EFEFEA";
const INK = "#0A0A0A";
const RED = "#E2231A";

const IMG = (f: string) => `/img/pro/${f}`;
const CTA = "https://skynetjoe.com/discovery-call";

/* ---- photos ---- */
const HERO =
  "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg"; // portrait
const ABOUT_IMG =
  "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"; // portrait
const EXTRA_PERSONALITY =
  "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg"; // portrait

const WORK_IMGS = [
  "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg", // landscape
  "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg", // portrait
  "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg", // landscape
  "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-phone-focus.jpg", // landscape
];

// 12 distinct contact-sheet images (personalities + travel + events)
const CONTACT_SHEET = [
  "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
  "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
  "PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
  "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
  "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
  "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
  "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  "LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
  "TRAVEL-2026-03-27-motorbike-helmet-backpack-mountain-road.jpg",
  "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
];

/* ---- data ---- */
const STATS = [
  { n: "180+", l: "WORKFLOWS BUILT" },
  { n: "40+", l: "SITES SHIPPED" },
  { n: "9", l: "COUNTRIES SERVED" },
  { n: "2019", l: "BUILDING SINCE", red: true },
];

const STACK = [
  "N8N",
  "NEXT.JS",
  "AEO",
  "STRIPE",
  "WHATSAPP BOTS",
  "META CAPI",
  "WORDPRESS",
  "GDPR",
  "AUTOMATION",
  "AI SYSTEMS",
];

const WORK = [
  {
    n: "01",
    title: "PHYSICAL THERAPY CLINIC",
    place: "MIAMI, US",
    body: "Next.js booking flow wired straight into Stripe. Patients pick a slot, pay, done — front desk stopped chasing no-shows.",
    tags: ["NEXT.JS", "STRIPE", "BOOKING"],
    img: WORK_IMGS[0],
    landscape: true,
  },
  {
    n: "02",
    title: "INBOX AUTOMATION ENGINE",
    place: "EUROPE",
    body: "A 47-step n8n workflow that reads, routes, and replies. Self-healing — when a node fails it retries and re-routes instead of dying silently.",
    tags: ["N8N", "47 STEPS", "SELF-HEALING"],
    img: WORK_IMGS[1],
    landscape: false,
  },
  {
    n: "03",
    title: "FREIGHT LEAD SYSTEM",
    place: "UNITED STATES",
    body: "Lead capture pushed server-side to Meta via CAPI. No more leads lost to ad-blockers or broken pixels — the data lands where it pays.",
    tags: ["META CAPI", "LEADS", "SERVER-SIDE"],
    img: WORK_IMGS[2],
    landscape: true,
  },
  {
    n: "04",
    title: "FAMILY TRIP PORTAL",
    place: "ITALY",
    body: "A WordPress portal built GDPR-tight — consent, data handling, the boring legal stuff done right so the client never thinks about it.",
    tags: ["WORDPRESS", "GDPR", "PORTAL"],
    img: WORK_IMGS[3],
    landscape: true,
  },
];

/* ---- motion presets ---- */
const spring = {
  type: "spring",
  stiffness: 130,
  damping: 18,
  mass: 0.85,
} as const;

function makeUp(reduce: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 36 },
    show: { opacity: 1, y: 0, transition: spring },
  };
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/* ================================================================
   PAGE
   ================================================================ */
export default function BrutalistVariant() {
  const reduce = useReducedMotion();
  const up = makeUp(!!reduce);

  /* hero parallax */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(
    heroScroll,
    [0, 1],
    ["0%", reduce ? "0%" : "22%"],
  );

  return (
    <>
      {/* ── brand background — covers dark body + aurora ── */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: PAPER }}
        aria-hidden
      />

      <main
        id="main-content"
        className="relative z-10 font-sans"
        style={{ background: PAPER, color: INK }}
      >
        {/* ═══════════════════ TOP NAV ═══════════════════ */}
        <header
          className="sticky top-0 z-50 flex items-stretch justify-between border-b-2"
          style={{ borderColor: INK, background: PAPER }}
        >
          {/* name */}
          <div className="flex items-center px-4 py-3 md:px-6">
            <span className="font-sans text-[13px] font-black uppercase tracking-tight">
              WASEEM NASIR
            </span>
          </div>

          {/* tag — hidden on mobile */}
          <div
            className="hidden items-center border-l-2 border-r-2 px-4 font-mono text-[11px] uppercase tracking-[0.22em] lg:flex"
            style={{ borderColor: INK }}
          >
            SKYNETLABS · EST.&nbsp;2019
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* nav links — desktop only */}
          <nav
            className="hidden items-center gap-0 font-mono text-[11px] uppercase tracking-[0.18em] lg:flex"
            aria-label="Primary navigation"
          >
            {["WORK", "ABOUT", "CONTACT"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="flex h-full items-center border-l-2 px-5 transition-colors hover:bg-[#0A0A0A] hover:text-[#FAFAF7]"
                style={{ borderColor: INK }}
              >
                {l}
              </a>
            ))}
          </nav>

          {/* CTA — hard red block */}
          <a
            href={CTA}
            className="flex items-center border-l-2 px-5 py-3 text-[13px] font-black uppercase tracking-tight transition-opacity hover:opacity-90"
            style={{ borderColor: INK, background: RED, color: PAPER }}
          >
            BOOK A CALL&nbsp;↗
          </a>
        </header>

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section
          ref={heroRef}
          id="hero"
          className="relative grid grid-cols-1 border-b-2 lg:grid-cols-12"
          style={{ borderColor: INK, minHeight: "min(90vh,900px)" }}
        >
          {/* LEFT: TYPE */}
          <div
            className="col-span-1 flex flex-col justify-between border-b-2 px-4 py-10 lg:col-span-7 lg:border-b-0 lg:border-r-2 lg:px-10 lg:py-14"
            style={{ borderColor: INK }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.55, delay: 0.05 }}
              className="mb-8 font-mono text-[11px] uppercase tracking-[0.26em]"
              style={{ color: RED }}
            >
              [ INDEPENDENT FOUNDER · AI + AUTOMATION ]
            </motion.p>

            {/* oversized headline */}
            <motion.h1
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="font-sans font-black uppercase leading-[0.82] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.8rem,9.5vw,8.8rem)" }}
            >
              {["I MAKE", "YOUR", "BUSY-WORK"].map((line) => (
                <motion.span key={line} variants={up} className="block">
                  {line}
                </motion.span>
              ))}
              <motion.span
                variants={up}
                className="block"
                style={{ color: RED }}
              >
                DISAPPEAR.
              </motion.span>
            </motion.h1>

            {/* sub + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.45 }}
              className="mt-10 max-w-xl border-t-2 pt-6"
              style={{ borderColor: INK }}
            >
              <p className="text-[15px] leading-relaxed md:text-[17px]">
                Founder who builds quiet AI &amp; automation systems behind the
                scenes — missed leads, dead follow-ups, manual ops. I find the
                leak and engineer it shut.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={CTA}
                  className="inline-flex items-center border-2 px-7 py-3.5 text-[14px] font-black uppercase tracking-tight transition-transform hover:-translate-y-0.5"
                  style={{ borderColor: INK, background: INK, color: PAPER }}
                >
                  BOOK A 30-MIN CALL&nbsp;↗
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="inline-flex items-center border-2 px-6 py-3.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:bg-[#0A0A0A] hover:text-[#FAFAF7]"
                  style={{ borderColor: INK }}
                >
                  GITHUB
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: RED-DUOTONE HERO PHOTO */}
          <div className="relative col-span-1 overflow-hidden lg:col-span-5">
            <motion.div
              style={{ y: heroImgY }}
              className="absolute inset-[-10%] h-[120%]"
            >
              <Image
                src={IMG(HERO)}
                alt="Waseem Nasir working from a cafe in an olive track jacket"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-top"
                style={{ filter: "grayscale(1) contrast(1.18)" }}
              />
              {/* red duotone */}
              <div
                className="absolute inset-0"
                style={{
                  background: RED,
                  mixBlendMode: "multiply",
                  opacity: 0.68,
                }}
                aria-hidden
              />
              {/* bottom fade */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.5) 100%)",
                }}
                aria-hidden
              />
            </motion.div>

            {/* location tag */}
            <div className="relative flex h-[58vh] min-h-[380px] items-end p-5 lg:h-full lg:min-h-0">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: PAPER }}
              >
                ↳ BALI&nbsp;· WORKS WORLDWIDE
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════ MARQUEE ═══════════════════ */}
        <Marquee items={STACK} reduce={!!reduce} />

        {/* ═══════════════════ STATS BAND ═══════════════════ */}
        <section
          className="grid grid-cols-2 border-b-2 lg:grid-cols-4"
          style={{ borderColor: INK }}
          aria-label="Track record"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.l}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={up}
              className="px-4 py-9 md:px-7 md:py-11"
              style={{
                background: s.red ? RED : PAPER,
                color: s.red ? PAPER : INK,
                /* right border on all but last in each breakpoint row */
                borderRight: i < 3 ? `2px solid ${INK}` : undefined,
                borderBottom: i < 2 ? `2px solid ${INK}` : undefined,
              }}
            >
              <div
                className="font-sans font-black tracking-tighter"
                style={{
                  fontSize: "clamp(2.4rem,6vw,4.8rem)",
                  lineHeight: 0.88,
                }}
              >
                {s.n}
              </div>
              <div className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.22em]">
                {s.l}
              </div>
            </motion.div>
          ))}
        </section>

        {/* ═══════════════════ ABOUT ═══════════════════ */}
        <section
          id="about"
          className="grid grid-cols-1 border-b-2 lg:grid-cols-12"
          style={{ borderColor: INK }}
        >
          {/* photo column */}
          <div
            className="col-span-1 border-b-2 lg:col-span-5 lg:border-b-0 lg:border-r-2"
            style={{ borderColor: INK }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[540px]">
              <Image
                src={IMG(ABOUT_IMG)}
                alt="Waseem Nasir — arms crossed, confident"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
                style={{ filter: "grayscale(1) contrast(1.1)" }}
              />
              {/* thin red border accent bottom-left */}
              <div
                className="absolute bottom-0 left-0 h-1 w-1/3"
                style={{ background: RED }}
                aria-hidden
              />
            </div>
          </div>

          {/* copy column */}
          <div className="col-span-1 flex flex-col justify-center px-4 py-12 lg:col-span-7 lg:px-12 lg:py-16">
            <SectionTag n="A" label="WHO" reduce={!!reduce} />

            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={up}
              className="mt-6 font-sans font-black uppercase leading-[0.88] tracking-[-0.025em]"
              style={{ fontSize: "clamp(1.9rem,4.2vw,3.6rem)" }}
            >
              I DON&apos;T SELL SOFTWARE.
              <span style={{ color: RED }}> I REMOVE FRICTION.</span>
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="mt-7 max-w-2xl space-y-5 text-[15px] leading-relaxed md:text-[16px]"
            >
              <motion.p variants={up}>
                I&apos;m an independent founder running SkynetLabs. Building
                since 2019, I&apos;ve shipped systems across 9 countries —
                clinics, freight operators, travel agencies, inboxes drowning in
                manual work.
              </motion.p>
              <motion.p variants={up}>
                The pattern is always the same: a quiet leak somewhere in the
                pipeline costing time and revenue. Missed leads. Follow-ups that
                die. Ops nobody has time to fix. I find it, then I engineer it
                shut — with n8n, Next.js, AEO, Stripe, and WhatsApp bots.
              </motion.p>
              <motion.p
                variants={up}
                className="font-mono text-[12px] uppercase tracking-[0.2em]"
                style={{ color: RED }}
              >
                ↳ NO BUZZWORDS. JUST SYSTEMS THAT RUN WHILE YOU SLEEP.
              </motion.p>
            </motion.div>

            {/* personality photo — smaller, anchored */}
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={spring}
              className="mt-10 border-2"
              style={{ borderColor: INK, maxWidth: 220 }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={IMG(EXTRA_PERSONALITY)}
                  alt="Waseem Nasir — rooftop cafe, mountains in background"
                  fill
                  sizes="220px"
                  className="object-cover"
                  style={{ filter: "grayscale(1) contrast(1.08)" }}
                />
              </div>
              <p
                className="px-2 py-1.5 font-mono text-[9px] uppercase tracking-widest"
                style={{ background: PAPER2 }}
              >
                ↳ BALI ROOFTOP · 2026
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ SELECTED WORK ═══════════════════ */}
        <section id="work" className="border-b-2" style={{ borderColor: INK }}>
          {/* section header */}
          <div
            className="flex flex-col gap-4 border-b-2 px-4 py-9 sm:flex-row sm:items-end sm:justify-between lg:px-10"
            style={{ borderColor: INK }}
          >
            <div>
              <SectionTag n="B" label="SELECTED WORK" reduce={!!reduce} />
              <h2
                className="mt-4 font-sans font-black uppercase leading-[0.82] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem,6.5vw,5.2rem)" }}
              >
                THE RECEIPTS
              </h2>
            </div>
            <span
              className="font-mono text-[11px] uppercase tracking-widest"
              style={{ color: RED }}
            >
              [ CLIENT NAMES PRIVATE ]
            </span>
          </div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {WORK.map((w, i) => (
              <WorkCard key={w.n} w={w} i={i} up={up} reduce={!!reduce} />
            ))}
          </div>
        </section>

        {/* ═══════════════════ CONTACT SHEET ═══════════════════ */}
        <section
          id="gallery"
          className="border-b-2"
          style={{ borderColor: INK }}
        >
          <div
            className="border-b-2 px-4 py-9 lg:px-10"
            style={{ borderColor: INK }}
          >
            <SectionTag n="C" label="CONTACT SHEET" reduce={!!reduce} />
            <h2
              className="mt-4 font-sans font-black uppercase leading-[0.84] tracking-[-0.025em]"
              style={{ fontSize: "clamp(1.9rem,5.5vw,4.4rem)" }}
            >
              FROM THE FIELD
            </h2>
          </div>

          {/* grid: 2 col mobile / 3 col md / 4 col lg */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {CONTACT_SHEET.map((f, i) => (
              <GalleryCell key={f} f={f} i={i} up={up} reduce={!!reduce} />
            ))}
          </motion.div>
        </section>

        {/* ═══════════════════ BIG CTA ═══════════════════ */}
        <section
          id="contact"
          className="relative overflow-hidden px-4 py-16 md:py-24 lg:px-10"
          style={{ background: INK, color: PAPER }}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer}
          >
            <motion.p
              variants={up}
              className="mb-7 font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: RED }}
            >
              [ FIND THE LEAK · ENGINEER IT SHUT ]
            </motion.p>

            <motion.h2
              variants={up}
              className="font-sans font-black uppercase leading-[0.82] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.6rem,10vw,9.2rem)" }}
            >
              LET&apos;S KILL
              <br />
              THE&nbsp;
              <span style={{ color: RED }}>BUSYWORK.</span>
            </motion.h2>

            <motion.div
              variants={up}
              className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <a
                href={CTA}
                className="inline-flex items-center px-8 py-4 text-[14px] font-black uppercase tracking-tight transition-transform hover:-translate-y-0.5"
                style={{ background: RED, color: PAPER }}
              >
                BOOK A 30-MIN CALL&nbsp;↗
              </a>
              <a
                href="mailto:waseembali2k26@gmail.com"
                className="inline-flex items-center border-2 px-8 py-4 font-mono text-[12px] uppercase tracking-widest transition-colors hover:bg-[#FAFAF7] hover:text-[#0A0A0A]"
                style={{ borderColor: PAPER }}
              >
                waseembali2k26@gmail.com
              </a>
            </motion.div>
          </motion.div>

          {/* decorative large number */}
          <div
            className="pointer-events-none absolute right-0 top-0 select-none font-sans font-black leading-none tracking-tighter opacity-[0.04]"
            style={{ fontSize: "clamp(8rem,22vw,20rem)", color: PAPER }}
            aria-hidden
          >
            ✺
          </div>
        </section>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer
          className="grid grid-cols-1 border-t-2 md:grid-cols-3"
          style={{ borderColor: INK, background: PAPER }}
        >
          <div
            className="border-b-2 p-6 md:border-b-0 md:border-r-2"
            style={{ borderColor: INK }}
          >
            <div className="font-sans text-[14px] font-black uppercase tracking-tight">
              WASEEM NASIR
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em]">
              SKYNETLABS · SINCE&nbsp;2019
            </div>
          </div>

          <div
            className="flex flex-col gap-1.5 border-b-2 p-6 md:border-b-0 md:border-r-2"
            style={{ borderColor: INK }}
          >
            {[
              ["GITHUB", "https://github.com/waseemnasir2k26"],
              ["SKYNETJOE.COM", "https://skynetjoe.com"],
              ["EMAIL", "mailto:waseembali2k26@gmail.com"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[12px] uppercase tracking-[0.18em] transition-colors hover:text-[#E2231A]"
              >
                ↳&nbsp;{label}
              </a>
            ))}
          </div>

          <div className="p-6 font-mono text-[11px] uppercase tracking-[0.2em] leading-loose">
            BALI · WORKS WORLDWIDE
            <br />
            &copy;&nbsp;2026&nbsp;— ALL RIGHTS RESERVED
          </div>
        </footer>
      </main>
    </>
  );
}

/* ================================================================
   SUB-COMPONENTS (sibling scope, not exported)
   ================================================================ */

/* ---- Section tag pill ---- */
function SectionTag({
  n,
  label,
  reduce,
}: {
  n: string;
  label: string;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: reduce ? 0 : -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="flex items-center gap-3"
    >
      <span
        className="flex h-7 w-7 items-center justify-center font-mono text-[12px] font-bold"
        style={{ background: RED, color: PAPER }}
      >
        {n}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.26em]">
        {label}
      </span>
    </motion.div>
  );
}

/* ---- Infinite marquee ---- */
function Marquee({ items, reduce }: { items: string[]; reduce: boolean }) {
  const row = [...items, ...items, ...items];
  return (
    <div
      className="overflow-hidden border-b-2 py-3.5"
      style={{ borderColor: INK, background: INK }}
      aria-hidden
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-33.333%"] }}
        transition={
          reduce
            ? undefined
            : { duration: 26, ease: "linear", repeat: Infinity }
        }
      >
        {row.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-10 font-sans text-[14px] font-black uppercase tracking-tight"
            style={{ color: PAPER }}
          >
            {t}
            <span style={{ color: RED }}>✺</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ---- Work card ---- */
type WorkItem = {
  n: string;
  title: string;
  place: string;
  body: string;
  tags: string[];
  img: string;
  landscape: boolean;
};

function WorkCard({
  w,
  i,
  up,
  reduce,
}: {
  w: WorkItem;
  i: number;
  up: Variants;
  reduce: boolean;
}) {
  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={up}
      className="group relative flex flex-col border-t-2 lg:flex-row"
      style={{
        borderColor: INK,
        borderRight: i % 2 === 0 ? `2px solid ${INK}` : undefined,
      }}
    >
      {/* photo */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:w-[42%]"
        style={{ borderRight: `2px solid ${INK}` }}
      >
        <Image
          src={IMG(w.img)}
          alt={w.title}
          fill
          sizes="(max-width: 1024px) 100vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ filter: "grayscale(1) contrast(1.12)" }}
        />
        {/* numbered red badge */}
        <span
          className="absolute left-0 top-0 px-3 py-1.5 font-mono text-[12px] font-black"
          style={{ background: RED, color: PAPER }}
        >
          {w.n}
        </span>
      </div>

      {/* copy */}
      <div className="flex flex-1 flex-col justify-between p-5 lg:p-7">
        <div>
          <h3 className="font-sans text-[18px] font-black uppercase leading-tight tracking-tight md:text-[21px]">
            {w.title}
          </h3>
          <p
            className="mt-1 font-mono text-[11px] uppercase tracking-widest"
            style={{ color: RED }}
          >
            {w.place}
          </p>
          <p className="mt-4 text-[14px] leading-relaxed md:text-[15px]">
            {w.body}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {w.tags.map((t) => (
            <span
              key={t}
              className="border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
              style={{ borderColor: INK }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/* ---- Gallery cell ---- */
function GalleryCell({
  f,
  i,
  up,
  reduce,
}: {
  f: string;
  i: number;
  up: Variants;
  reduce: boolean;
}) {
  // border-right on all but last column (4 col layout = index % 4 !== 3)
  // use CSS outline trick so it doesn't collapse grid — apply border via inline style per cell
  return (
    <motion.div
      variants={up}
      className="group relative aspect-square overflow-hidden border-b-2 border-r-2"
      style={{ borderColor: INK, background: PAPER2 }}
    >
      <Image
        src={IMG(f)}
        alt="Waseem Nasir"
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        style={{ filter: "grayscale(1) contrast(1.07)" }}
      />
      {/* frame number */}
      <span
        className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: PAPER, mixBlendMode: "difference" }}
      >
        {String(i + 1).padStart(2, "0")}
      </span>
    </motion.div>
  );
}
