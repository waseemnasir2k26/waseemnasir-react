"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

/* ============================================================
   /mentorship — 1:1 Claude Code & AI vibe-coding mentorship.
   Standalone route. Lives under the global dark RootLayout, so it
   matches whichever homepage variant ships. Self-contained.
   Real proof only — no fabricated testimonials or student counts.
   ============================================================ */

const CTA = "https://skynetjoe.com/discovery-call";
const EMAIL = "waseembali2k26@gmail.com";
const GITHUB = "https://github.com/waseemnasir2k26";
const AGENCY = "https://skynetjoe.com";
const IMG = (f: string) => `/img/pro/${f}`;

/* ---- palette (tuned to the global dark canvas) ---- */
const BG = "#0A0A0C";
const SURFACE = "#121218";
const SURFACE_2 = "#16161E";
const TEXT = "#ECEAF2";
const MUTED = "#8C8AA0";
const HAIRLINE = "rgba(236,234,242,0.08)";
const ACCENT = "#7C6CFF"; // electric violet
const ACCENT_SOFT = "rgba(124,108,255,0.14)";
const TICK = "#5EE6A8"; // checklist green

const MONO = "var(--font-mono, 'JetBrains Mono', monospace)";
const SERIF = "var(--font-serif, 'Fraunces', serif)";

/* ============================================================ */

const CURRICULUM = [
  {
    n: "01",
    title: "Set up Claude Code like a pro",
    body: "Install, configure, and wire it to your real projects. Permissions, MCP servers, the settings that actually matter. You leave session one with a working setup, not tabs of docs.",
  },
  {
    n: "02",
    title: "Prompt so the AI builds what you mean",
    body: "The gap between beginners and shippers is how you ask. Plan mode, scoping a feature, reading a diff, catching when the model is wrong before it costs you an hour.",
  },
  {
    n: "03",
    title: "Vibe-code a real thing, end to end",
    body: "Not a to-do tutorial. We pick something you actually want to exist and build it together — a landing page, a tool, a small app — until it runs.",
  },
  {
    n: "04",
    title: "Agents, skills & the workflow that scales",
    body: "Once one feature works, you learn to fan out: subagents, reusable skills, letting Claude Code do hours of work while you steer. This is where it stops feeling like magic and starts feeling like leverage.",
  },
  {
    n: "05",
    title: "Ship it where people can see it",
    body: "Git, deploy to Vercel or a host, a real URL. Most people never cross this line. You will, with me on the call.",
  },
  {
    n: "06",
    title: "Build the habit so you don't need me",
    body: "The goal isn't dependence. By the end you debug your own stuck moments, read your own errors, and keep shipping after the program ends.",
  },
];

const STEPS = [
  {
    k: "Live, screen-to-screen",
    title: "We build on the same screen",
    body: "Every session is a real working call — you drive, I guide. You watch how I actually use Claude Code, then you do it while I catch the mistakes in real time.",
    photo: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    alt: "Waseem working across two laptops on a real build",
  },
  {
    k: "Your project, not a sandbox",
    title: "You leave with something real",
    body: "We work on the thing you want to exist. No throwaway exercises — the app you ship is yours, deployed and on a URL you can share.",
    photo: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    alt: "Focused desk work session on a real project",
  },
  {
    k: "Between calls",
    title: "Async support so you never stay stuck",
    body: "Hit a wall on a Tuesday? Message me. I review your work, unblock you, and keep the momentum going between live sessions.",
    photo: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    alt: "Late-night coding session, hands on keyboard",
  },
];

interface Tier {
  name: string;
  tag: string;
  price: string;
  unit: string;
  blurb: string;
  features: string[];
  featured?: boolean;
  cta: string;
}

const TIERS: Tier[] = [
  {
    name: "Kickstart",
    tag: "Single session",
    price: "$199",
    unit: "one 90-minute call",
    blurb:
      "Test the waters. Get set up and ship one small thing in 90 minutes.",
    features: [
      "Claude Code installed & configured with you",
      "Build + run one small project live",
      "A clear roadmap for what to learn next",
      "Recording of the session to keep",
    ],
    cta: "Book a Kickstart",
  },
  {
    name: "1-Month Sprint",
    tag: "Most flexible",
    price: "$800",
    unit: "per month",
    blurb: "Go from zero to shipping your first real app in four weeks.",
    features: [
      "4 weekly 1:1 live sessions (60–90 min)",
      "Async messaging support between calls",
      "Build & deploy one real project end-to-end",
      "Prompting, plan mode & reading diffs",
      "Session recordings + notes",
    ],
    cta: "Start the Sprint",
  },
  {
    name: "3-Month Mastery",
    tag: "Best value · most popular",
    price: "$2,000",
    unit: "for 3 months",
    blurb:
      "The full transformation — from beginner to genuinely self-sufficient builder.",
    features: [
      "12 weekly 1:1 live sessions",
      "Priority async support all week",
      "Ship a real product, not just a demo",
      "Agents, reusable skills & the workflow that scales",
      "Code reviews on everything you build",
      "Deploy, domains & going live",
      "Works out to ~$667/mo — save vs monthly",
    ],
    featured: true,
    cta: "Apply for Mastery",
  },
];

const FOR_YOU = [
  "You're a beginner or self-taught and want to actually build, not just watch tutorials",
  "You're a founder/marketer who wants to ship your own ideas without hiring a dev for everything",
  "You've tried AI coding tools and keep getting stuck or shipping nothing",
  "You learn faster with a real person catching your mistakes than with a course you never finish",
];

const NOT_YOU = [
  "You want someone to build it FOR you (that's my agency — different thing)",
  "You're a senior engineer looking for advanced architecture review",
  "You want a passive video course to binge and forget",
];

const FAQ = [
  {
    q: "Do I need to know how to code already?",
    a: "No. That's the point. This is built for beginners — if you can use a laptop and you're willing to show up and try, you can do this. We start from your actual level.",
  },
  {
    q: "What is “vibe-coding” exactly?",
    a: "Building software by describing what you want in plain language and steering an AI (Claude Code) that writes and edits the code with you — while you learn enough to read it, fix it, and ship it. You stay in control; the AI does the heavy lifting.",
  },
  {
    q: "What will I actually have at the end?",
    a: "A real project of your own, deployed to a live URL, plus the skill and the habit to keep building without me. Not a certificate — a thing that works.",
  },
  {
    q: "How are sessions run?",
    a: "Live video calls, screen-to-screen. You drive your own machine while I guide and catch mistakes in real time. Every session is recorded so you can rewatch.",
  },
  {
    q: "What if I'm not sure which tier fits?",
    a: "Book the free fit call. We talk for 15 minutes, I tell you honestly whether this is right for you and which track makes sense. No pressure.",
  },
  {
    q: "What tools do I need?",
    a: "A laptop (Mac, Windows, or Linux) and a Claude account. We set up Claude Code together on session one — nothing to figure out alone beforehand.",
  },
];

/* ---- small reveal wrapper ---- */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 70, damping: 18, delay }}
    >
      {children}
    </motion.div>
  );
}

function BookButton({
  label,
  variant = "solid",
  className = "",
}: {
  label: string;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const solid = variant === "solid";
  return (
    <Link
      href={CTA}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C] ${className}`}
      style={
        solid
          ? {
              background: ACCENT,
              color: "#0A0A0C",
              boxShadow: "0 18px 50px -20px rgba(124,108,255,0.7)",
            }
          : {
              background: "transparent",
              color: TEXT,
              border: `1px solid ${HAIRLINE}`,
            }
      }
    >
      {label}
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] uppercase"
      style={{ color: ACCENT, fontFamily: MONO, letterSpacing: "0.22em" }}
    >
      <span
        className="inline-block h-px w-6"
        style={{ background: ACCENT }}
        aria-hidden
      />
      {children}
    </span>
  );
}

export default function MentorshipClient() {
  return (
    <>
      {/* skip-link target uses global layout's skip-link */}
      <main
        id="main-content"
        className="relative z-10"
        style={{ background: BG, color: TEXT }}
      >
        {/* ── nav ── */}
        <nav
          className="sticky top-0 z-50 backdrop-blur-md"
          style={{
            background: "rgba(10,10,12,0.72)",
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 rounded"
              style={{ color: TEXT }}
            >
              Waseem Nasir
            </Link>
            <BookButton
              label="Book a free fit call"
              className="!px-5 !py-2.5"
            />
          </div>
        </nav>

        {/* ── hero ── */}
        <header className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(900px 520px at 15% -10%, rgba(124,108,255,0.16), transparent 60%)",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
            <div>
              <Reveal>
                <Kicker>1:1 Mentorship · Live · Beginner-friendly</Kicker>
              </Reveal>
              <Reveal delay={0.06}>
                <h1
                  className="mt-6 text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.04]"
                  style={{ fontFamily: SERIF, color: TEXT }}
                >
                  Learn to build real software by{" "}
                  <span style={{ color: ACCENT }}>vibe-coding</span> with Claude
                  Code.
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p
                  className="mt-6 max-w-xl text-[1.05rem] leading-relaxed"
                  style={{ color: MUTED }}
                >
                  No computer-science degree. No years of tutorials. In private
                  1-on-1 sessions, I teach you to describe what you want, steer
                  the AI that writes the code, and actually ship it — the same
                  workflow I use to run a software agency every day.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <BookButton label="Book a free 15-min fit call" />
                  <Link
                    href="#pricing"
                    className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 rounded px-2 py-1"
                    style={{ color: TEXT }}
                  >
                    See pricing & tracks
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <p
                  className="mt-6 text-xs"
                  style={{ color: MUTED, fontFamily: MONO }}
                >
                  Taught by a founder who&apos;s shipped 40+ sites & 180+
                  automations across 9 countries — building in Claude Code
                  daily.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div
                className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl"
                style={{ border: `1px solid ${HAIRLINE}`, background: SURFACE }}
              >
                <Image
                  src={IMG(
                    "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                  )}
                  alt="Waseem Nasir building on a laptop at a cafe"
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 45vw"
                  className="object-cover"
                  style={{ objectPosition: "center 20%" }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(10,10,12,0.85) 100%)",
                  }}
                />
                <div
                  className="absolute bottom-4 left-4 rounded-lg px-3 py-2 text-[11px]"
                  style={{
                    background: "rgba(10,10,12,0.7)",
                    color: TICK,
                    fontFamily: MONO,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                >
                  $ claude — let&apos;s build something real
                </div>
              </div>
            </Reveal>
          </div>
        </header>

        {/* ── empathy strip ── */}
        <section
          className="border-y"
          style={{ borderColor: HAIRLINE, background: SURFACE }}
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
            {[
              {
                h: "You don't need to be “technical”",
                p: "If you can explain what you want clearly, you can build it. I teach you the rest.",
              },
              {
                h: "Stop collecting tutorials",
                p: "You've watched enough. This is hands-on-keyboard, shipping real things, with feedback.",
              },
              {
                h: "Get unstuck fast",
                p: "The thing that kills beginners is staying stuck for days. With me on the call, that doesn't happen.",
              },
            ].map((c, i) => (
              <Reveal key={c.h} delay={i * 0.06}>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: TEXT, fontFamily: SERIF }}
                >
                  {c.h}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: MUTED }}
                >
                  {c.p}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── curriculum ── */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <Kicker>What you&apos;ll learn</Kicker>
            <h2
              className="mt-5 max-w-2xl text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-tight"
              style={{ fontFamily: SERIF, color: TEXT }}
            >
              From &quot;I don&apos;t know where to start&quot; to shipping on a
              live URL.
            </h2>
          </Reveal>
          <div
            className="mt-14 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: HAIRLINE }}
          >
            {CURRICULUM.map((m, i) => (
              <Reveal key={m.n} delay={(i % 3) * 0.05}>
                <div className="h-full p-7" style={{ background: SURFACE_2 }}>
                  <span
                    className="text-xs"
                    style={{
                      color: ACCENT,
                      fontFamily: MONO,
                      letterSpacing: "0.2em",
                    }}
                  >
                    {m.n}
                  </span>
                  <h3
                    className="mt-4 text-lg font-semibold leading-snug"
                    style={{ color: TEXT }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: MUTED }}
                  >
                    {m.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── how it works ── */}
        <section
          className="border-y"
          style={{ borderColor: HAIRLINE, background: SURFACE }}
        >
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal>
              <Kicker>How it works</Kicker>
              <h2
                className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-semibold"
                style={{ fontFamily: SERIF, color: TEXT }}
              >
                Real calls. Real project. Real URL at the end.
              </h2>
            </Reveal>
            <div className="mt-14 space-y-16">
              {STEPS.map((s, i) => (
                <Reveal key={s.title}>
                  <div
                    className={`grid items-center gap-8 lg:grid-cols-2 ${
                      i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                    }`}
                  >
                    <div
                      className="relative aspect-[16/10] overflow-hidden rounded-xl"
                      style={{ border: `1px solid ${HAIRLINE}` }}
                    >
                      <Image
                        src={IMG(s.photo)}
                        alt={s.alt}
                        fill
                        sizes="(max-width:1024px) 100vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span
                        className="text-xs"
                        style={{
                          color: ACCENT,
                          fontFamily: MONO,
                          letterSpacing: "0.18em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")} · {s.k}
                      </span>
                      <h3
                        className="mt-3 text-2xl font-semibold"
                        style={{ color: TEXT, fontFamily: SERIF }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="mt-3 max-w-md text-sm leading-relaxed"
                        style={{ color: MUTED }}
                      >
                        {s.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── pricing ── */}
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <Kicker>Pricing & tracks</Kicker>
            <h2
              className="mt-5 text-[clamp(1.9rem,4vw,2.9rem)] font-semibold"
              style={{ fontFamily: SERIF, color: TEXT }}
            >
              Pick the depth that fits you.
            </h2>
            <p
              className="mt-4 max-w-xl text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              Every track starts with a free 15-minute fit call so we both know
              it&apos;s right before you commit. Spots are limited — I only take
              a handful of 1:1 students at a time.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.07}>
                <div
                  className="flex h-full flex-col rounded-2xl p-7"
                  style={{
                    background: t.featured ? SURFACE_2 : SURFACE,
                    border: t.featured
                      ? `1px solid ${ACCENT}`
                      : `1px solid ${HAIRLINE}`,
                    boxShadow: t.featured
                      ? "0 30px 80px -40px rgba(124,108,255,0.55)"
                      : "none",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] uppercase"
                      style={{
                        color: t.featured ? ACCENT : MUTED,
                        fontFamily: MONO,
                        letterSpacing: "0.16em",
                      }}
                    >
                      {t.tag}
                    </span>
                    {t.featured && (
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
                        style={{
                          background: ACCENT_SOFT,
                          color: ACCENT,
                          fontFamily: MONO,
                        }}
                      >
                        ★ Popular
                      </span>
                    )}
                  </div>

                  <h3
                    className="mt-4 text-xl font-semibold"
                    style={{ color: TEXT, fontFamily: SERIF }}
                  >
                    {t.name}
                  </h3>

                  <div className="mt-4 flex items-end gap-2">
                    <span
                      className="text-4xl font-semibold"
                      style={{ color: TEXT }}
                    >
                      {t.price}
                    </span>
                    <span className="pb-1 text-xs" style={{ color: MUTED }}>
                      {t.unit}
                    </span>
                  </div>

                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: MUTED }}
                  >
                    {t.blurb}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {t.features.map((f) => (
                      <li
                        key={f}
                        className="flex gap-3 text-sm"
                        style={{ color: TEXT }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="mt-0.5 shrink-0"
                          aria-hidden
                        >
                          <path
                            d="M3.5 8.5l3 3 6-7"
                            stroke={TICK}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span style={{ color: MUTED }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <BookButton
                      label={t.cta}
                      variant={t.featured ? "solid" : "ghost"}
                      className="w-full"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p
              className="mt-8 text-center text-xs"
              style={{ color: MUTED, fontFamily: MONO }}
            >
              Prices in USD. Payment plans available on the 3-month track — ask
              on your fit call.
            </p>
          </Reveal>
        </section>

        {/* ── who it's for ── */}
        <section
          className="border-y"
          style={{ borderColor: HAIRLINE, background: SURFACE }}
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 lg:grid-cols-2">
            <Reveal>
              <h3
                className="text-xl font-semibold"
                style={{ color: TEXT, fontFamily: SERIF }}
              >
                This is for you if…
              </h3>
              <ul className="mt-6 space-y-4">
                {FOR_YOU.map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed">
                    <span style={{ color: TICK, fontFamily: MONO }} aria-hidden>
                      +
                    </span>
                    <span style={{ color: MUTED }}>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <h3
                className="text-xl font-semibold"
                style={{ color: TEXT, fontFamily: SERIF }}
              >
                It&apos;s not for you if…
              </h3>
              <ul className="mt-6 space-y-4">
                {NOT_YOU.map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      style={{ color: MUTED, fontFamily: MONO }}
                      aria-hidden
                    >
                      –
                    </span>
                    <span style={{ color: MUTED }}>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── about ── */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-2xl"
                style={{ border: `1px solid ${HAIRLINE}` }}
              >
                <Image
                  src={IMG(
                    "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                  )}
                  alt="Portrait of Waseem Nasir"
                  fill
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <Kicker>Who&apos;s teaching</Kicker>
              <h2
                className="mt-5 text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-tight"
                style={{ fontFamily: SERIF, color: TEXT }}
              >
                I don&apos;t just talk about this — I build in it every day.
              </h2>
              <p
                className="mt-5 text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                I&apos;m Waseem — founder of SkynetLabs. I run a real software &
                automation agency where Claude Code does the heavy lifting on
                client work: websites, AI workflows, automations. I&apos;ve
                shipped 40+ sites and 180+ automations for clients across 9
                countries, in practice since 2019.
              </p>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                I&apos;m not a course-seller who learned this last week. I teach
                you the exact workflow I use to ship paid work — so you skip the
                months I spent figuring it out the hard way.
              </p>
              <div
                className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t pt-6"
                style={{ borderColor: HAIRLINE }}
              >
                {[
                  ["180+", "automations built"],
                  ["40+", "sites shipped"],
                  ["9", "countries served"],
                  ["2019", "in practice since"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div
                      className="text-2xl font-semibold"
                      style={{ color: TEXT, fontFamily: SERIF }}
                    >
                      {v}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: MUTED, fontFamily: MONO }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          className="border-y"
          style={{ borderColor: HAIRLINE, background: SURFACE }}
        >
          <div className="mx-auto max-w-3xl px-6 py-24">
            <Reveal>
              <Kicker>Questions</Kicker>
              <h2
                className="mt-5 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold"
                style={{ fontFamily: SERIF, color: TEXT }}
              >
                The honest answers.
              </h2>
            </Reveal>
            <div className="mt-12 divide-y" style={{ borderColor: HAIRLINE }}>
              {FAQ.map((item, i) => (
                <Reveal key={item.q} delay={(i % 3) * 0.04}>
                  <details
                    className="group py-5"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium focus-visible:outline-none focus-visible:ring-2 rounded"
                      style={{ color: TEXT }}
                    >
                      {item.q}
                      <span
                        className="shrink-0 text-lg transition-transform group-open:rotate-45"
                        style={{ color: ACCENT }}
                        aria-hidden
                      >
                        +
                      </span>
                    </summary>
                    <p
                      className="mt-3 text-sm leading-relaxed"
                      style={{ color: MUTED }}
                    >
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── final CTA ── */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(800px 500px at 50% 120%, rgba(124,108,255,0.2), transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
            <Reveal>
              <h2
                className="text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-tight"
                style={{ fontFamily: SERIF, color: TEXT }}
              >
                Stop watching. Start shipping.
              </h2>
              <p
                className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
                style={{ color: MUTED }}
              >
                Book a free 15-minute fit call. We&apos;ll talk about what you
                want to build, and I&apos;ll tell you honestly if this is right
                for you.
              </p>
              <div className="mt-9 flex justify-center">
                <BookButton label="Book your free fit call" />
              </div>
              <p
                className="mt-5 text-xs"
                style={{ color: MUTED, fontFamily: MONO }}
              >
                Limited 1:1 spots · no pressure · honest fit-check
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── footer ── */}
        <footer
          className="border-t"
          style={{ borderColor: HAIRLINE, background: BG }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/"
                className="text-sm font-semibold"
                style={{ color: TEXT }}
              >
                Waseem Nasir
              </Link>
              <p
                className="mt-1 text-xs"
                style={{ color: MUTED, fontFamily: MONO }}
              >
                1:1 Claude Code & AI vibe-coding mentorship
              </p>
            </div>
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-xs"
              style={{ color: MUTED }}
            >
              <a
                href={`mailto:${EMAIL}`}
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 rounded"
                style={{ color: MUTED }}
              >
                {EMAIL}
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 rounded"
                style={{ color: MUTED }}
              >
                GitHub
              </a>
              <a
                href={AGENCY}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus-visible:outline-none focus-visible:ring-2 rounded"
                style={{ color: MUTED }}
              >
                skynetjoe.com
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
