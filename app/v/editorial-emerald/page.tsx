"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

/* ============================================================
   editorial-emerald — refined editorial founder site
   Self-contained variant. Palette + type defined locally.
   ============================================================ */

const BG = "#F4F3EE"; // soft off-white paper
const INK = "#16191A"; // deep ink
const EMERALD = "#0F5132"; // rich forest accent
const GOLD = "#C9A24B"; // thin warm secondary
const SURFACE = "#EAE8DF"; // slightly deeper paper for cards
const MUTED = "#6B6F6A"; // muted text

const IMG = "/img/pro/";

const CTA = "https://skynetjoe.com/discovery-call";
const EMAIL = "mailto:waseembali2k26@gmail.com";
const GITHUB = "https://github.com/waseemnasir2k26";
const SITE = "https://skynetjoe.com";

const HERO = "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg";

/* image wall — masonry life & work mix */
const WALL: { src: string; o: "p" | "l" | "s"; alt: string }[] = [
  {
    src: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    o: "p",
    alt: "Working from a Bali terrace cafe",
  },
  {
    src: "PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    o: "p",
    alt: "Portrait, navy polo",
  },
  {
    src: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    o: "p",
    alt: "With a client, thumbs up",
  },
  {
    src: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    o: "p",
    alt: "On a mountain ridge",
  },
  {
    src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    o: "l",
    alt: "Dual-laptop analytics setup",
  },
  {
    src: "LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
    o: "p",
    alt: "Acoustic guitar in a white cafe",
  },
  {
    src: "PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    o: "p",
    alt: "Portrait, black kurta",
  },
  {
    src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    o: "p",
    alt: "Arms spread on Nusa Penida cliffs",
  },
  {
    src: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
    o: "l",
    alt: "Night coworking with the team",
  },
  {
    src: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
    o: "l",
    alt: "Garden cafe, laptop, smiling",
  },
  {
    src: "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
    o: "l",
    alt: "Headshot against a travertine wall",
  },
  {
    src: "SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg",
    o: "l",
    alt: "Green valley hills panorama",
  },
];

const PROOF = [
  { n: "180+", l: "workflows built" },
  { n: "40+", l: "sites shipped" },
  { n: "9", l: "countries served" },
  { n: "2019", l: "building since" },
];

const SERVICES = [
  {
    k: "01",
    t: "Lead capture that never sleeps",
    d: "Forms, chat and CAPI pipelines that catch every inquiry and route it before it goes cold.",
  },
  {
    k: "02",
    t: "Follow-up that runs itself",
    d: "Self-healing n8n sequences that nudge, qualify and book — so no warm lead dies in an inbox.",
  },
  {
    k: "03",
    t: "Manual ops, engineered away",
    d: "The repetitive admin behind your business, quietly automated end to end.",
  },
  {
    k: "04",
    t: "Sites that close",
    d: "Fast Next.js builds with booking and payments wired in from the first line of code.",
  },
];

const WORK = [
  {
    place: "Miami, US",
    title: "Physical therapy clinic",
    desc: "Next.js site with Stripe-powered booking — patients self-schedule and pay before they arrive.",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    tag: "Next.js · Stripe",
  },
  {
    place: "Europe",
    title: "Inbox automation engine",
    desc: "A 47-step self-healing n8n workflow that triages, drafts and routes mail without a human babysitter.",
    img: "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
    tag: "n8n · self-healing",
  },
  {
    place: "United States",
    title: "Freight lead system",
    desc: "Meta CAPI feeding a clean lead pipeline — every form fill tracked, matched and followed up.",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    tag: "Meta CAPI · pipeline",
  },
  {
    place: "Italy",
    title: "Family trip portal",
    desc: "A GDPR-compliant WordPress portal where families plan and submit trips with consent handled cleanly.",
    img: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
    tag: "WordPress · GDPR",
  },
];

export default function EditorialEmerald() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduce ? "0%" : "18%"],
  );
  const heroScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduce ? 1 : 1.08],
  );

  const spring = {
    type: "spring" as const,
    stiffness: 90,
    damping: 18,
    mass: 0.9,
  };

  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: spring },
  };
  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const label = "font-mono uppercase tracking-[0.28em] text-[11px]";

  return (
    <>
      {/* brand background covers the dark global body + aurora */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: BG }}
        aria-hidden="true"
      />

      <main
        id="main-content"
        className="relative z-10"
        style={{ background: BG, color: INK }}
      >
        {/* ===================== NAV ===================== */}
        <header className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-7 md:px-10">
          <span className="font-serif text-lg" style={{ color: INK }}>
            Waseem&nbsp;Nasir
          </span>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              ["Work", "#work"],
              ["About", "#about"],
              ["Life", "#wall"],
            ].map(([t, h]) => (
              <a
                key={t}
                href={h}
                className="font-mono text-[12px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
                style={{ color: MUTED }}
              >
                {t}
              </a>
            ))}
          </nav>
          <a
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
            style={{ background: EMERALD, color: BG }}
          >
            Book a call
          </a>
        </header>

        {/* ===================== HERO ===================== */}
        <section
          ref={heroRef}
          className="mx-auto max-w-[1240px] px-6 pb-10 pt-8 md:px-10 md:pt-12"
        >
          <div className="grid items-end gap-10 md:grid-cols-12">
            <motion.div
              className="md:col-span-7"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.div
                variants={rise}
                className="mb-7 flex items-center gap-3"
              >
                <span className={label} style={{ color: EMERALD }}>
                  Independent founder
                </span>
                <span className="h-px w-12" style={{ background: GOLD }} />
                <span className={label} style={{ color: MUTED }}>
                  Bali · worldwide
                </span>
              </motion.div>

              <motion.h1
                variants={rise}
                className="font-serif font-light leading-[0.96] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2.6rem,7vw,5.4rem)", color: INK }}
              >
                I make your{" "}
                <span className="italic" style={{ color: EMERALD }}>
                  busywork
                </span>{" "}
                disappear.
              </motion.h1>

              <motion.p
                variants={rise}
                className="mt-7 max-w-xl text-[17px] leading-[1.7]"
                style={{ color: MUTED }}
              >
                Founder who builds quiet AI &amp; automation systems behind the
                scenes — missed leads, dead follow-ups, manual ops. I find the
                leak and engineer it shut.
              </motion.p>

              <motion.div
                variants={rise}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a
                  href={CTA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
                  style={{ background: EMERALD, color: BG }}
                >
                  Book a 30-min call
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href={EMAIL}
                  className="font-mono text-[12px] uppercase tracking-[0.16em] underline-offset-4 hover:underline"
                  style={{ color: INK }}
                >
                  Email instead
                </a>
              </motion.div>
            </motion.div>

            {/* hero portrait — portrait orientation */}
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0, y: reduce ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
            >
              <div
                className="relative overflow-hidden rounded-[4px]"
                style={{ aspectRatio: "3/4", border: `1px solid ${INK}14` }}
              >
                <motion.div
                  style={{ y: heroY, scale: heroScale }}
                  className="absolute inset-0"
                >
                  <Image
                    src={`${IMG}${HERO}`}
                    alt="Waseem Nasir working from a rooftop cafe overlooking mountains"
                    fill
                    priority
                    sizes="(max-width:768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </motion.div>
                <span
                  className="absolute bottom-4 left-4 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur"
                  style={{ background: `${BG}D9`, color: EMERALD }}
                >
                  On the desk, somewhere quiet
                </span>
              </div>
            </motion.div>
          </div>

          {/* proof strip */}
          <motion.div
            className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] md:grid-cols-4"
            style={{ background: `${INK}12` }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {PROOF.map((p) => (
              <motion.div
                key={p.l}
                variants={rise}
                className="px-6 py-7"
                style={{ background: BG }}
              >
                <div className="font-serif text-4xl" style={{ color: EMERALD }}>
                  {p.n}
                </div>
                <div
                  className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: MUTED }}
                >
                  {p.l}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===================== EMERALD DIVIDER ===================== */}
        <Divider label="What I quietly handle" tone="dark" />

        {/* ===================== SERVICES ===================== */}
        <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-10 md:py-28">
          <motion.div
            className="grid gap-x-12 gap-y-12 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {SERVICES.map((s) => (
              <motion.div
                key={s.k}
                variants={rise}
                className="group border-t pt-6"
                style={{ borderColor: `${INK}1f` }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: GOLD }}
                  >
                    {s.k}
                  </span>
                  <h3
                    className="font-serif text-2xl leading-tight md:text-[28px]"
                    style={{ color: INK }}
                  >
                    {s.t}
                  </h3>
                </div>
                <p
                  className="mt-3 max-w-md pl-9 text-[15.5px] leading-[1.7]"
                  style={{ color: MUTED }}
                >
                  {s.d}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===================== ABOUT SPREAD ===================== */}
        <section
          id="about"
          className="mx-auto max-w-[1240px] px-6 pb-24 md:px-10 md:pb-32"
        >
          <div className="grid items-center gap-12 md:grid-cols-12">
            <motion.div
              className="order-2 md:order-1 md:col-span-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.span
                variants={rise}
                className={label}
                style={{ color: EMERALD }}
              >
                The person behind it
              </motion.span>
              <motion.h2
                variants={rise}
                className="mt-4 font-serif font-light leading-[1.05]"
                style={{ fontSize: "clamp(2rem,4vw,3.2rem)", color: INK }}
              >
                Quiet systems,
                <br />
                <span className="italic" style={{ color: EMERALD }}>
                  loud results.
                </span>
              </motion.h2>
              <motion.p
                variants={rise}
                className="mt-6 text-[16px] leading-[1.75]"
                style={{ color: MUTED }}
              >
                I&apos;ve been building since 2019 — first sites, then the
                automation that makes them actually run a business. I work alone
                and on purpose: one founder, full ownership, no handoffs.
              </motion.p>
              <motion.p
                variants={rise}
                className="mt-4 text-[16px] leading-[1.75]"
                style={{ color: MUTED }}
              >
                Based in Bali, working across nine countries. The best work I do
                is the kind you never notice — the follow-up that fired, the
                lead that got caught, the hour you got back.
              </motion.p>
              <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
                {["n8n", "Next.js", "AEO", "Stripe", "WhatsApp bots"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]"
                      style={{
                        border: `1px solid ${EMERALD}40`,
                        color: EMERALD,
                      }}
                    >
                      {t}
                    </span>
                  ),
                )}
              </motion.div>
            </motion.div>

            {/* editorial stacked spread */}
            <motion.div
              className="order-1 grid grid-cols-5 gap-4 md:order-2 md:col-span-7"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={rise} className="col-span-3">
                <Frame
                  src="PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                  ratio="3/4"
                  alt="Portrait on a balcony rail"
                />
              </motion.div>
              <motion.div variants={rise} className="col-span-2 mt-12">
                <Frame
                  src="CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg"
                  ratio="3/4"
                  alt="Rooftop cafe with laptop and smoothie"
                />
              </motion.div>
              <motion.div variants={rise} className="col-span-5 -mt-6">
                <Frame
                  src="CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg"
                  ratio="16/9"
                  alt="On a couch with a laptop, brick wall cafe"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===================== EMERALD DIVIDER ===================== */}
        <Divider label="Selected work — names kept private" tone="dark" />

        {/* ===================== WORK ===================== */}
        <section
          id="work"
          className="mx-auto max-w-[1240px] px-6 py-20 md:px-10 md:py-28"
        >
          <motion.div
            className="grid gap-10 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {WORK.map((w) => (
              <motion.article
                key={w.title}
                variants={rise}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={spring}
                className="overflow-hidden rounded-[4px]"
                style={{ background: SURFACE, border: `1px solid ${INK}12` }}
              >
                <div className="relative" style={{ aspectRatio: "16/10" }}>
                  <Image
                    src={`${IMG}${w.img}`}
                    alt={w.title}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span
                    className="absolute right-3 top-3 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur"
                    style={{ background: `${INK}CC`, color: GOLD }}
                  >
                    {w.tag}
                  </span>
                </div>
                <div className="p-7">
                  <div
                    className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: EMERALD }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: GOLD }}
                    />
                    {w.place}
                  </div>
                  <h3
                    className="mt-3 font-serif text-[26px] leading-tight"
                    style={{ color: INK }}
                  >
                    {w.title}
                  </h3>
                  <p
                    className="mt-2.5 text-[15px] leading-[1.7]"
                    style={{ color: MUTED }}
                  >
                    {w.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* ===================== IMAGE WALL ===================== */}
        <section
          id="wall"
          className="mx-auto max-w-[1240px] px-6 pb-24 md:px-10 md:pb-32"
        >
          <div className="mb-10 flex items-end justify-between">
            <h2
              className="font-serif font-light"
              style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: INK }}
            >
              Life &amp; work
            </h2>
            <span className={label} style={{ color: MUTED }}>
              Bali · Lahore · 9 countries
            </span>
          </div>
          <motion.div
            className="columns-2 gap-4 md:columns-3 [&>*]:mb-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {WALL.map((w) => (
              <motion.div
                key={w.src}
                variants={rise}
                className="break-inside-avoid"
              >
                <Frame
                  src={w.src}
                  ratio={w.o === "p" ? "3/4" : w.o === "s" ? "1/1" : "4/3"}
                  alt={w.alt}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===================== CTA ===================== */}
        <section
          className="relative overflow-hidden"
          style={{ background: EMERALD, color: BG }}
        >
          <div className="mx-auto max-w-[1240px] px-6 py-24 text-center md:px-10 md:py-32">
            <motion.span
              className="font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: GOLD }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={spring}
            >
              One step
            </motion.span>
            <motion.h2
              className="mx-auto mt-5 max-w-3xl font-serif font-light leading-[1.04]"
              style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={spring}
            >
              Let&apos;s find the leak in your
              <span className="italic" style={{ color: GOLD }}>
                {" "}
                operations
              </span>{" "}
              — and shut it.
            </motion.h2>
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-5"
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.08 }}
            >
              <a
                href={CTA}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full px-8 py-4 font-mono text-[12px] uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
                style={{ background: BG, color: EMERALD }}
              >
                Book a 30-min call
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href={EMAIL}
                className="font-mono text-[12px] uppercase tracking-[0.16em] underline-offset-4 hover:underline"
                style={{ color: BG }}
              >
                waseembali2k26@gmail.com
              </a>
            </motion.div>
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="mx-auto max-w-[1240px] px-6 py-12 md:px-10">
          <div
            className="flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row"
            style={{ borderColor: `${INK}1f` }}
          >
            <span className="font-serif text-base" style={{ color: INK }}>
              Waseem Nasir · SkynetLabs
            </span>
            <div
              className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: MUTED }}
            >
              <a href={GITHUB} className="hover:opacity-60">
                GitHub
              </a>
              <a href={SITE} className="hover:opacity-60">
                skynetjoe.com
              </a>
              <a href={EMAIL} className="hover:opacity-60">
                Email
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ---------- helpers ---------- */

function Frame({
  src,
  ratio,
  alt,
}: {
  src: string;
  ratio: string;
  alt: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[4px]"
      style={{ aspectRatio: ratio, border: `1px solid ${INK}14` }}
    >
      <Image
        src={`${IMG}${src}`}
        alt={alt}
        fill
        sizes="(max-width:768px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 hover:scale-[1.04]"
      />
    </div>
  );
}

function Divider({ label, tone }: { label: string; tone: "dark" }) {
  return (
    <div style={{ background: tone === "dark" ? EMERALD : SURFACE }}>
      <div className="mx-auto flex max-w-[1240px] items-center gap-5 px-6 py-5 md:px-10">
        <span className="h-px flex-1" style={{ background: `${BG}40` }} />
        <span
          className="font-mono text-[11px] uppercase tracking-[0.28em]"
          style={{ color: BG }}
        >
          {label}
        </span>
        <span className="h-px flex-1" style={{ background: `${BG}40` }} />
      </div>
    </div>
  );
}
