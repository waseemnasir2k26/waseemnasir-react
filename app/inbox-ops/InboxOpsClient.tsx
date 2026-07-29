"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";

/* ============================================================
   ROUTE: /inbox-ops
   Landing target for LinkedIn pinned-comment links starting
   2026-07-30. Matches the "blueprint" design system (the live
   root): near-white canvas, jade-teal accent, ink-jade depth band.
   SELF-CONTAINED — touches zero shared files, zero other variants.
   ============================================================ */

/* ─── Fonts (self-hosted at build via next/font/google) ─── */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const body = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

/* ─── Tokens (identical to blueprint) ─── */
const C = {
  canvas: "#FBFCFD",
  surface: "#F4F8F7",
  card: "#FFFFFF",
  ink: "#0E1B1A",
  body: "#3C4744",
  mute: "#5B6764",
  hairline: "#E2EAE8",
  accent: "#117E73",
  accentDeep: "#0A3D38",
  accentTint: "#E2F1EE",
  pillInk: "#0C5F57",
  live: "#15A06B",
  onDeep: "#EAF4F1",
};
const SHADOW = {
  sm: "0 1px 2px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  md: "0 8px 24px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  lg: "0 24px 48px rgba(8,40,38,0.10), 0 0 0 1px rgba(8,40,38,0.05)",
};
const EASE = [0.16, 1, 0.3, 1] as const;
const LINKEDIN_DM = "https://www.linkedin.com/in/waseemnasir2k26";
const EMAIL = "mailto:waseem@skynetjoe.com";

/* ─── Reusable bits (self-contained duplicates of the blueprint idiom) ─── */
function Mono({
  children,
  color = C.mute,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`font-mono uppercase ${className}`}
      style={{
        color,
        fontSize: "0.72rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </span>
  );
}

/* Fade-up wrapper — opacity stays 1 at rest so static/print/screenshot
   never shows a blank band if IntersectionObserver hasn't fired yet. */
function Reveal({
  children,
  delay = 0,
  y = 20,
  reduce,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  reduce: boolean;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      initial={reduce ? false : { opacity: 1, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
    >
      {children}
    </M>
  );
}

function PrimaryCTA({ className = "" }: { className?: string }) {
  return (
    <Link
      href={LINKEDIN_DM}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90 ${className}`}
      style={{
        background: C.accent,
        color: "#fff",
        fontSize: "0.95rem",
        padding: "0.85rem 1.7rem",
        boxShadow: SHADOW.md,
      }}
    >
      DM me &ldquo;inbox&rdquo; on LinkedIn
    </Link>
  );
}

function SecondaryCTA({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <a
      href={EMAIL}
      className={`inline-flex items-center rounded-full font-semibold ${className}`}
      style={{
        background: onDark ? "rgba(234,244,241,0.12)" : C.card,
        color: onDark ? "#FFFFFF" : C.accent,
        border: `1px solid ${onDark ? "rgba(234,244,241,0.28)" : C.hairline}`,
        fontSize: "0.95rem",
        padding: "0.8rem 1.6rem",
      }}
    >
      Email waseem@skynetjoe.com
    </a>
  );
}

/* ─── The 9-step map ─── */
const STEPS = [
  {
    n: "01",
    t: "Inbox census",
    d: "For seven days, count everything that arrives: by type, by sender, by what happened to it. You cannot automate a mailbox you have never measured, and owners consistently guess wrong about their own top category.",
  },
  {
    n: "02",
    t: "Decision taxonomy",
    d: "A named list of the decisions the business actually makes about email: answer, route, schedule, pay, escalate, ignore. Written in the client's own vocabulary. This taxonomy is the real intellectual property of the whole system.",
  },
  {
    n: "03",
    t: "Kill list",
    d: "Before any AI touches anything, auto-archive and unsubscribe everything that never needed a human: notification noise, newsletters, machine-generated receipts. The cheapest win, and it makes every later step more accurate.",
  },
  {
    n: "04",
    t: "Routing spine",
    d: 'Every email type in the taxonomy gets exactly one owner and one label. One, not two. "Whoever sees it first" is not a routing rule, it is the mechanism by which threads die quietly.',
  },
  {
    n: "05",
    t: "AI classifier",
    d: "Now, and only now, the AI arrives. A language model reads every inbound thread, applies the taxonomy, and scores urgency. The output is just labels. A good classifier disappears into the furniture.",
  },
  {
    n: "06",
    t: "Draft layer, never auto-send",
    d: "For routine request types, the system writes a reply and saves it as a draft. A human reads it, edits it, and presses send. The system has no send capability at all, by architecture, not by policy. This is the single most important design decision in the map.",
    emphasize: true,
  },
  {
    n: "07",
    t: "Escalation lanes",
    d: "Named VIP senders, money above a threshold, legal language, genuinely angry tone: those interrupt a human immediately. Everything else waits calmly in the queue until the next review window.",
  },
  {
    n: "08",
    t: "Daily digest",
    d: "One structured brief replaces two hundred pings. Each morning the owner gets a single summary: what arrived, what was drafted, what is waiting on a decision, what got escalated.",
  },
  {
    n: "09",
    t: "Drift review",
    d: "Every week, review the misclassified threads and every draft the human rewrote heavily. Feed the corrections back into the classifier and the taxonomy. This is why it is a monthly system, not a script that rots in six months.",
  },
];

const REPLACES = [
  {
    t: "The sorter",
    d: "Decides what each message actually is.",
  },
  {
    t: "The router",
    d: "Decides who owns it.",
  },
  {
    t: "The answerer",
    d: "Types the same handful of replies on loop.",
  },
  {
    t: "The chaser",
    d: "Bumps the threads nobody answered.",
  },
];

const FAQS = [
  {
    q: "Does the AI send email?",
    a: "No. It has no send capability. It classifies, labels, routes, and drafts. A human sends everything.",
  },
  {
    q: "What happens when it misclassifies?",
    a: "Misclassifications get flagged in the weekly drift review and fed back as corrections. Guard rules also flag threads that appear already settled so they are never re-answered.",
  },
  {
    q: "What does it cost?",
    a: "$2,750 for setup, $395 per month for run and tune. One mailbox, targeting a three-week go-live.",
  },
  {
    q: "What is it built on?",
    a: "Workflow automation tooling and a language model classifier. The stack is deliberately boring. The taxonomy and the trust gates are the product.",
  },
];

export default function InboxOpsClient() {
  const reduce = !!useReducedMotion();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { background: ${C.canvas} !important; color-scheme: light !important; }
        .io-root { font-synthesis: none; }
        @keyframes ioPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .io-pulse { animation: ioPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .io-pulse{ animation:none } }
        .io-link { position: relative; }
        .io-link::after { content:""; position:absolute; left:0; bottom:-3px; height:1px; width:100%;
          background:${C.accent}; transform:scaleX(0); transform-origin:left; transition:transform .16s ease; }
        .io-link:hover::after { transform:scaleX(1); }
        .io-step { transition: transform .22s ease-out, box-shadow .22s ease-out, border-left-color .2s ease-out; border-left: 3px solid transparent; }
        @media (hover:hover) and (pointer:fine){
          .io-step:hover { transform: translateY(-3px); box-shadow:${SHADOW.md}; border-left-color: ${C.accent}; }
        }
        :focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; border-radius: 4px; }
        .io-faq-chev { transition: transform .18s ease-out; display:inline-block; }
        .io-faq[open] .io-faq-chev { transform: rotate(45deg); }
        @media (prefers-reduced-motion: reduce){ .io-faq-chev { transition:none; } }
      `,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <main
        id="main-content"
        className={`io-root relative ${display.variable} ${body.variable} ${mono.variable}`}
        style={{
          background: C.canvas,
          color: C.body,
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          overflowX: "clip",
        }}
      >
        {/* ── Slim header ── */}
        <header
          className="sticky top-0 z-40"
          style={{
            height: 64,
            background: "rgba(251,252,253,0.86)",
            backdropFilter: "blur(16px) saturate(170%)",
            WebkitBackdropFilter: "blur(16px) saturate(170%)",
            borderBottom: `1px solid ${C.hairline}`,
          }}
        >
          <div className="mx-auto flex h-full max-w-[1000px] items-center justify-between px-5 sm:px-6">
            <Link href="/" className="flex flex-col leading-none">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: C.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                Waseem Nasir
              </span>
              <span
                className="font-mono"
                style={{
                  color: C.mute,
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  marginTop: 3,
                }}
              >
                FOUNDER · SKYNETLABS
              </span>
            </Link>
            <div className="hidden sm:block">
              <PrimaryCTA />
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section
          className="relative w-full overflow-hidden"
          style={{ paddingTop: 0 }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: "55%",
              background:
                "radial-gradient(60% 80% at 78% 8%, rgba(17,126,115,0.07), transparent 60%), radial-gradient(40% 60% at 20% 0%, rgba(226,241,238,0.6), transparent 65%)",
            }}
          />
          <div className="relative mx-auto max-w-[820px] px-5 py-14 sm:px-6 sm:py-20">
            <Reveal reduce={reduce} className="mb-5">
              <Mono color={C.accent}>Inbox Ops Autopilot</Mono>
            </Reveal>
            <Reveal reduce={reduce} delay={0.06}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.026em",
                  color: C.ink,
                  maxWidth: "20ch",
                }}
              >
                Your mailbox, sorted, drafted, and waiting for one decision.
              </h1>
            </Reveal>
            <Reveal reduce={reduce} delay={0.12}>
              <p
                className="mt-6"
                style={{
                  fontSize: "clamp(1.0625rem,1.4vw,1.1875rem)",
                  lineHeight: 1.62,
                  color: C.body,
                  maxWidth: "58ch",
                }}
              >
                Inbox Ops Autopilot replaces the inbox-operator role, the
                sorting, routing, and repetitive replying nobody put on the org
                chart, with a system. It reads every inbound email, classifies
                it, routes it to one owner, and drafts replies for routine
                requests. It never sends anything on its own. A human is on the
                send button, always.
              </p>
            </Reveal>
            <Reveal
              reduce={reduce}
              delay={0.18}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <PrimaryCTA />
              <SecondaryCTA />
            </Reveal>
          </div>
        </section>

        {/* ── Pricing band ── */}
        <section
          style={{
            borderTop: `1px solid ${C.hairline}`,
            borderBottom: `1px solid ${C.hairline}`,
            background: C.surface,
          }}
        >
          <div className="mx-auto max-w-[820px] px-5 py-8 sm:px-6">
            <Reveal
              reduce={reduce}
              className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.9rem",
                      color: C.accentDeep,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    $2,750
                  </div>
                  <Mono color={C.mute}>Setup</Mono>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.9rem",
                      color: C.accentDeep,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    $395<span style={{ fontSize: "1rem" }}>/mo</span>
                  </div>
                  <Mono color={C.mute}>Run &amp; tune</Mono>
                </div>
              </div>
              <div className="max-w-[30ch] text-left sm:text-right">
                <Mono color={C.pillInk} className="!tracking-[0.06em]">
                  One mailbox · target three-week go-live
                </Mono>
                <p
                  className="mt-1"
                  style={{ color: C.mute, fontSize: "0.8rem", lineHeight: 1.4 }}
                >
                  The first build took longer while the trust gates were earned.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── The 9-step map ── */}
        <section className="mx-auto max-w-[820px] px-5 py-20 sm:px-6 sm:py-24">
          <Reveal reduce={reduce} className="mb-12 flex items-center gap-3">
            <Mono color={C.accent}>The 9-step map</Mono>
            <div
              style={{ height: 1, flex: 1, background: C.hairline }}
              aria-hidden
            />
          </Reveal>
          <div className="flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <Reveal
                as="article"
                reduce={reduce}
                delay={Math.min(i * 0.03, 0.3)}
                key={s.n}
              >
                <div
                  className="io-step flex flex-col gap-2 sm:flex-row sm:gap-6"
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${s.emphasize ? "rgba(17,126,115,0.3)" : C.hairline}`,
                    background: s.emphasize ? C.accentTint : C.card,
                    boxShadow: s.emphasize ? SHADOW.md : SHADOW.sm,
                    padding: "1.5rem 1.6rem",
                  }}
                >
                  <div className="shrink-0 sm:w-16">
                    <Mono color={s.emphasize ? C.pillInk : C.mute}>{s.n}</Mono>
                    {s.emphasize && (
                      <div className="mt-1">
                        <Mono color={C.accentDeep} className="!text-[0.6rem]">
                          Trust step
                        </Mono>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "1.15rem",
                        color: C.ink,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {s.t}
                    </h3>
                    <p
                      className="mt-2"
                      style={{
                        color: C.body,
                        fontSize: "0.97rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {s.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── What this replaces ── */}
        <section
          style={{
            background: C.surface,
            borderTop: `1px solid ${C.hairline}`,
            borderBottom: `1px solid ${C.hairline}`,
          }}
        >
          <div className="mx-auto max-w-[820px] px-5 py-20 sm:px-6 sm:py-24">
            <Reveal reduce={reduce} className="mb-4">
              <Mono color={C.accent}>What this replaces</Mono>
            </Reveal>
            <Reveal reduce={reduce} delay={0.04}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.024em",
                  color: C.ink,
                  maxWidth: "24ch",
                }}
              >
                Four informal roles, rarely four separate hires.
              </h2>
              <p
                className="mt-4"
                style={{
                  color: C.body,
                  fontSize: "1.0625rem",
                  lineHeight: 1.6,
                  maxWidth: "56ch",
                }}
              >
                An inbox-heavy small business is typically paying for four
                roles, usually as fractions of everyone&apos;s day, including
                the founder&apos;s. The nine steps absorb the sorter, the
                router, most of the answerer, and the chaser&apos;s memory,
                while leaving every actual decision, and every send, with a
                human.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {REPLACES.map((r, i) => (
                <Reveal
                  as="div"
                  reduce={reduce}
                  delay={0.06 + i * 0.04}
                  key={r.t}
                >
                  <div
                    style={{
                      borderRadius: 14,
                      border: `1px solid ${C.hairline}`,
                      background: C.card,
                      boxShadow: SHADOW.sm,
                      padding: "1.25rem 1.4rem",
                    }}
                  >
                    <Mono color={C.pillInk}>{r.t}</Mono>
                    <p
                      className="mt-2"
                      style={{
                        color: C.body,
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {r.d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Honesty block ── */}
        <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 sm:py-20">
          <Reveal reduce={reduce}>
            <div
              style={{
                borderRadius: 16,
                border: `1px solid ${C.hairline}`,
                borderLeft: `3px solid ${C.accent}`,
                background: C.surface,
                padding: "1.75rem 2rem",
              }}
            >
              <Mono color={C.accent}>One caution on numbers</Mono>
              <p
                className="mt-3"
                style={{
                  color: C.body,
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  maxWidth: "58ch",
                }}
              >
                This space is full of invented numbers. Surveys like the SBE
                Council&apos;s find owners reporting around five hours a week
                saved with AI tools, and that figure is self-reported, which
                means treat it as sentiment, not measurement. I do not promise
                hour counts. I show mechanisms and let clients measure their own
                before and after.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── FAQ ── */}
        <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 sm:py-20">
          <Reveal reduce={reduce} className="mb-10 flex items-center gap-3">
            <Mono color={C.accent}>Questions</Mono>
            <div
              style={{ height: 1, flex: 1, background: C.hairline }}
              aria-hidden
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-3">
            {FAQS.map((f, i) => (
              <Reveal as="div" reduce={reduce} delay={i * 0.04} key={f.q}>
                <details
                  className="io-faq group"
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${C.hairline}`,
                    background: C.card,
                    boxShadow: SHADOW.sm,
                  }}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden"
                    style={{
                      color: C.ink,
                      fontWeight: 600,
                      fontSize: "1.02rem",
                      lineHeight: 1.35,
                    }}
                  >
                    <h3 style={{ fontSize: "inherit", fontWeight: "inherit" }}>
                      {f.q}
                    </h3>
                    <span
                      className="io-faq-chev shrink-0 font-mono"
                      style={{ color: C.accent, fontSize: "0.9rem" }}
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p
                    className="px-6 pb-6"
                    style={{
                      color: C.body,
                      fontSize: "0.98rem",
                      lineHeight: 1.62,
                      maxWidth: "62ch",
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Ink-jade closing band ── */}
        <section style={{ background: C.accentDeep }}>
          <div className="mx-auto max-w-[820px] px-5 py-20 sm:px-6 sm:py-24 text-center">
            <Reveal reduce={reduce}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.9rem,4vw,2.75rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.026em",
                  color: "#FFFFFF",
                }}
              >
                The map is free.
              </h2>
              <p
                className="mt-4"
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  color: C.onDeep,
                  maxWidth: "50ch",
                }}
              >
                The execution, the trust gates, and the weekly tuning are the
                business.
              </p>
            </Reveal>
            <Reveal
              reduce={reduce}
              delay={0.08}
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
            >
              <PrimaryCTA />
              <SecondaryCTA onDark />
            </Reveal>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="relative overflow-hidden"
          style={{
            background: C.surface,
            borderTop: `2px solid ${C.accentDeep}`,
          }}
        >
          <div className="relative mx-auto max-w-[820px] px-5 py-12 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <Mono color={C.pillInk}>Built by SkynetLabs</Mono>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href="https://www.waseemnasir.com"
                  className="io-link"
                  style={{
                    fontFamily: "var(--font-mono, ui-monospace), monospace",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.mute,
                    textDecoration: "none",
                  }}
                >
                  waseemnasir.com
                </a>
                <Mono color={C.mute} className="!tracking-[0.06em]">
                  © 2026 Waseem Nasir
                </Mono>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
