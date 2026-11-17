"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { MENTORSHIP_FIVERR_URL } from "@/components/site";
import { FAQ } from "./faq-data";
import { C, SHADOW, TYPE, IMG, CTA } from "@/lib/design";
import {
  Section,
  Eyebrow,
  H1,
  H2,
  H3,
  Button,
  Photo,
} from "@/components/ui/system";

/* ============================================================
   /mentorship — 1:1 Claude Code & AI vibe-coding mentorship.
   Rendered inside BlogShell (app/mentorship/page.tsx), so it shares the
   site nav, footer, fonts and tokens (lib/design.ts) with every other page.
   Section tones alternate canvas / surface; hairlines, not boxes.
   Real proof only — no fabricated testimonials or student counts.
   ============================================================ */

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
    photo: "dual-laptop-dashboard-cafe.webp",
    alt: "Waseem Nasir at a dual-laptop setup with a dashboard open and a coffee beside him",
  },
  {
    k: "Your project, not a sandbox",
    title: "You leave with something real",
    body: "We work on the thing you want to exist. No throwaway exercises — the app you ship is yours, deployed and on a URL you can share.",
    photo: "lake-dock-laptop.webp",
    alt: "Waseem Nasir working on a laptop on a floating dock with a lake and mountain behind him",
  },
  {
    k: "Between calls",
    title: "Async support so you never stay stuck",
    body: "Hit a wall on a Tuesday? Message me. I review your work, unblock you, and keep the momentum going between live sessions.",
    photo: "night-cafe-rattan-laptop.webp",
    alt: "Waseem Nasir at a laptop in a rattan-furnished cafe in the evening",
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
  fiverrCta: string;
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
    fiverrCta: "Get Kickstart on Fiverr — $199",
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
    fiverrCta: "Get the Sprint on Fiverr — $800",
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
    fiverrCta: "Get Mastery on Fiverr — $2,000",
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



/* Reveal: opacity is 1 at rest (only position animates) so a static render,
   print, or a missed IntersectionObserver never leaves a blank band. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 1, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const CHECK = (color: string) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="mt-1 shrink-0"
    aria-hidden
  >
    <path
      d="M3.5 8.5l3 3 6-7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EMPATHY = [
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
];

const STATS = [
  ["180+", "automations built"],
  ["40+", "sites shipped"],
  ["9", "countries served"],
  ["2018", "in practice since"],
];

export default function MentorshipClient() {
  return (
    <>
      {/* ── hero ── */}
      <Section innerClassName="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>1:1 Mentorship · Live · Beginner-friendly</Eyebrow>
          </Reveal>
          <Reveal delay={0.05} className="mt-6">
            <H1>
              Learn to build real software by{" "}
              <span style={{ color: C.accent }}>vibe-coding</span> with Claude
              Code.
            </H1>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <p style={{ ...TYPE.lead, maxWidth: "52ch" }}>
              No computer-science degree. No years of tutorials. In private
              1-on-1 sessions, I teach you to describe what you want, steer the
              AI that writes the code, and actually ship it — the same workflow
              I use to run a software agency every day.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-9">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={CTA}>Book a free 30-min fit call</Button>
              <Link
                href="#pricing"
                className="bp-link font-semibold"
                style={{ color: C.ink, fontSize: "0.95rem" }}
              >
                See pricing &amp; tracks
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <p style={{ ...TYPE.small, color: C.mute, maxWidth: "52ch" }}>
              Taught by a founder who&apos;s shipped 40+ sites &amp; 180+
              automations across 9 countries — building in Claude Code daily.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <figure className="m-0">
            <Photo
              src={IMG("bali-rooftop-smile.webp")}
              alt="Waseem Nasir smiling at a cafe table in Bali, wearing glasses and a striped open shirt"
              ratio="4 / 5"
              priority
              sizes="(max-width:1024px) 92vw, 460px"
              position="center 40%"
            />
            <figcaption
              className="mt-4 font-mono"
              style={{ color: C.mute, fontSize: "0.78rem" }}
            >
              $ claude — let&apos;s build something real
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* ── empathy ── */}
      <Section tone="surface" innerClassName="!py-14 sm:!py-16">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-12">
          {EMPATHY.map((c, i) => (
            <Reveal key={c.h} delay={i * 0.05}>
              <h2 style={TYPE.h3}>{c.h}</h2>
              <p className="mt-3" style={TYPE.small}>
                {c.p}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── curriculum ── */}
      <Section innerClassName="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Eyebrow>What you&apos;ll learn</Eyebrow>
            <div className="mt-5">
              <H2>
                From &quot;I don&apos;t know where to start&quot; to shipping on
                a live URL.
              </H2>
            </div>
          </div>
        </Reveal>
        <ol className="m-0 list-none p-0">
          {CURRICULUM.map((m) => (
            <li key={m.n}>
              <Reveal>
                <div
                  className="grid grid-cols-[2.75rem_1fr] gap-x-2 py-8"
                  style={{ borderTop: `1px solid ${C.hairline}` }}
                >
                  <span
                    className="font-mono"
                    style={{
                      color: C.accent,
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      paddingTop: 5,
                    }}
                  >
                    {m.n}
                  </span>
                  <div>
                    <H3>{m.title}</H3>
                    <p className="mt-2.5" style={TYPE.body}>
                      {m.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── how it works ── */}
      <Section tone="surface">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
          <div className="mt-5">
            <H2 style={{ maxWidth: "20ch" }}>
              Real calls. Real project. Real URL at the end.
            </H2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <Photo
                src={IMG(s.photo)}
                alt={s.alt}
                ratio="4 / 3"
                sizes="(max-width:768px) 92vw, 380px"
                position="center 45%"
                shadow={false}
              />
              <div className="mt-6">
                <span
                  className="font-mono"
                  style={{
                    color: C.accent,
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} · {s.k}
                </span>
                <div className="mt-3">
                  <H3>{s.title}</H3>
                </div>
                <p className="mt-3" style={TYPE.small}>
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── pricing ── */}
      <Section id="pricing">
        <Reveal>
          <Eyebrow>Pricing &amp; tracks</Eyebrow>
          <div className="mt-5">
            <H2>Pick the depth that fits you.</H2>
          </div>
          <p className="mt-5" style={{ ...TYPE.lead, maxWidth: "56ch" }}>
            Every track starts with a free 30-minute fit call so we both know
            it&apos;s right before you commit. Spots are limited — I only take a
            handful of 1:1 students at a time.
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => {
            const f = !!t.featured;
            const ink = f ? "#FFFFFF" : C.ink;
            const text = f ? C.onDeep : C.body;
            return (
              <Reveal key={t.name} delay={i * 0.06} className="h-full">
                <div
                  className="flex h-full flex-col p-7 sm:p-8"
                  style={{
                    borderRadius: 24,
                    background: f ? C.accentDeep : C.card,
                    boxShadow: f
                      ? SHADOW.lg
                      : `0 0 0 1px ${C.hairline}, ${SHADOW.sm}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="font-mono uppercase"
                      style={{
                        color: f ? C.accentTint : C.mute,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {t.tag}
                    </span>
                    {f && (
                      <span
                        className="rounded-full px-2.5 py-1 font-mono uppercase"
                        style={{
                          background: "rgba(226,241,238,0.14)",
                          color: C.accentTint,
                          fontSize: "0.62rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        ★ Popular
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5" style={{ ...TYPE.h3, color: ink }}>
                    {t.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "2.75rem",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                        color: ink,
                      }}
                    >
                      {t.price}
                    </span>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: f ? C.onDeep : C.mute,
                      }}
                    >
                      {t.unit}
                    </span>
                  </div>

                  <p
                    className="mt-4"
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: text,
                    }}
                  >
                    {t.blurb}
                  </p>

                  <ul
                    className="m-0 mt-7 flex-1 list-none space-y-3.5 px-0 pb-0 pt-7"
                    style={{
                      borderTop: `1px solid ${
                        f ? "rgba(226,241,238,0.18)" : C.hairline
                      }`,
                    }}
                  >
                    {t.features.map((x) => (
                      <li
                        key={x}
                        className="flex gap-3"
                        style={{
                          fontSize: "0.93rem",
                          lineHeight: 1.5,
                          color: text,
                        }}
                      >
                        {CHECK(f ? C.accentTint : C.accent)}
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-9">
                    {MENTORSHIP_FIVERR_URL ? (
                      <Button
                        href={MENTORSHIP_FIVERR_URL}
                        external
                        variant={f ? "onDeep" : "outline"}
                        className="w-full"
                      >
                        {t.fiverrCta}
                      </Button>
                    ) : (
                      <Button
                        href={CTA}
                        variant={f ? "onDeep" : "outline"}
                        className="w-full"
                      >
                        Book the free fit call
                      </Button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p
            className="mt-10 text-center"
            style={{ ...TYPE.small, color: C.mute }}
          >
            Prices in USD. Payment plans available on the 3-month track — ask on
            your fit call.
          </p>
          {MENTORSHIP_FIVERR_URL && (
            <p
              className="mt-2 text-center"
              style={{ ...TYPE.small, color: C.mute }}
            >
              Checkout, payment protection and refunds are handled by Fiverr.
            </p>
          )}
        </Reveal>
      </Section>

      {/* ── who it's for ── */}
      <Section
        tone="surface"
        innerClassName="grid gap-14 lg:grid-cols-2 lg:gap-24"
      >
        <Reveal>
          <h2 style={TYPE.h3}>This is for you if…</h2>
          <ul className="m-0 mt-6 list-none p-0">
            {FOR_YOU.map((f) => (
              <li
                key={f}
                className="flex gap-3 py-4"
                style={{ ...TYPE.body, borderTop: `1px solid ${C.hairline}` }}
              >
                {CHECK(C.accent)}
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 style={TYPE.h3}>It&apos;s not for you if…</h2>
          <ul className="m-0 mt-6 list-none p-0">
            {NOT_YOU.map((f) => (
              <li
                key={f}
                className="flex gap-3 py-4"
                style={{ ...TYPE.body, borderTop: `1px solid ${C.hairline}` }}
              >
                <span
                  className="mt-0.5 shrink-0 font-mono"
                  style={{ color: C.mute, width: 16, textAlign: "center" }}
                  aria-hidden
                >
                  –
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* ── about ── */}
      <Section innerClassName="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <Photo
            src={IMG("founder-stool-navy-polo.webp")}
            alt="Waseem Nasir seated on a stool in a navy polo, smiling, in a bright cafe interior"
            ratio="4 / 5"
            sizes="(max-width:1024px) 92vw, 440px"
            position="center 30%"
          />
        </Reveal>
        <Reveal delay={0.06}>
          <Eyebrow>Who&apos;s teaching</Eyebrow>
          <div className="mt-5">
            <H2>
              I don&apos;t just talk about this — I build in it every day.
            </H2>
          </div>
          <p className="mt-6" style={{ ...TYPE.body, maxWidth: "56ch" }}>
            I&apos;m Waseem — founder of SkynetLabs. I run a real software &amp;
            automation agency where Claude Code does the heavy lifting on client
            work: websites, AI workflows, automations. I&apos;ve shipped 40+
            sites and 180+ automations for clients across 9 countries, in
            practice since 2018.
          </p>
          <p className="mt-4" style={{ ...TYPE.body, maxWidth: "56ch" }}>
            I&apos;m not a course-seller who learned this last week. I teach you
            the exact workflow I use to ship paid work — so you skip the months
            I spent figuring it out the hard way.
          </p>
          <dl
            className="m-0 mt-10 grid grid-cols-2 gap-y-8 pt-8 sm:grid-cols-4"
            style={{ borderTop: `1px solid ${C.hairline}` }}
          >
            {STATS.map(([v, l]) => (
              <div key={l}>
                <dt
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "2rem",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: C.ink,
                  }}
                >
                  {v}
                </dt>
                <dd
                  className="m-0 mt-2"
                  style={{ fontSize: "0.82rem", color: C.mute }}
                >
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* ── FAQ ── */}
      <Section
        tone="surface"
        innerClassName="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
      >
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <Eyebrow>Questions</Eyebrow>
            <div className="mt-5">
              <H2>The honest answers.</H2>
            </div>
          </div>
        </Reveal>
        <div style={{ borderBottom: `1px solid ${C.hairline}` }}>
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group"
              style={{ borderTop: `1px solid ${C.hairline}` }}
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                  color: C.ink,
                }}
              >
                {item.q}
                <span
                  className="shrink-0 text-2xl leading-none transition-transform duration-200 group-open:rotate-45"
                  style={{ color: C.accent }}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="pb-7" style={{ ...TYPE.body, maxWidth: "62ch" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* ── final CTA ── */}
      <Section tone="deep" innerClassName="text-center">
        <Reveal>
          <h2
            className="mx-auto"
            style={{ ...TYPE.h2, color: "#FFFFFF", maxWidth: "20ch" }}
          >
            Stop watching. Start shipping.
          </h2>
          <p
            className="mx-auto mt-6"
            style={{ ...TYPE.lead, color: C.onDeep, maxWidth: "50ch" }}
          >
            Book a free 30-minute fit call. We&apos;ll talk about what you want
            to build, and I&apos;ll tell you honestly if this is right for you.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href={CTA} variant="onDeep">
              Book your free fit call
            </Button>
          </div>
          <p
            className="mt-6"
            style={{ ...TYPE.small, color: "rgba(234,244,241,0.78)" }}
          >
            Limited 1:1 spots · no pressure · honest fit-check
          </p>
        </Reveal>
      </Section>
    </>
  );
}
