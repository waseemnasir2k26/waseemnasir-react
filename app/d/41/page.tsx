"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

/* ─── Design tokens ─────────────────────────────────────── */
const T = {
  bg: "#0A0C0E",
  surface: "#0F1614",
  text: "#E6F1EC",
  muted: "#6E8079",
  accent: "#34D399",
  accent2: "#5EEAD4",
};

/* ─── Terminal lines ─────────────────────────────────────── */
const BOOT_LINES = [
  { prefix: "SYS", text: "initialising skynetlabs runtime..." },
  { prefix: "ENV", text: "FOUNDER=waseem_nasir  STACK=n8n,next,openai" },
  { prefix: "DB ", text: "connecting to proof ledger..." },
  { prefix: "OK ", text: "180+ builds confirmed ✓" },
  { prefix: "OK ", text: "40+ clients across 9 countries ✓" },
  { prefix: "OK ", text: "uptime: 2019-present (continuous)" },
  { prefix: "RUN", text: "loading automation engine..." },
  { prefix: "OK ", text: "missed-lead handler: ARMED" },
  { prefix: "OK ", text: "dead-follow-up killer: ARMED" },
  { prefix: "OK ", text: "manual-ops eliminator: ARMED" },
  { prefix: ">>", text: "system ready. zero babysitting required." },
];

const PROOF_ROWS = [
  { key: "builds_shipped", val: "180+" },
  { key: "clients_served", val: "40+" },
  { key: "countries_worked_from", val: "9" },
  { key: "operating_since", val: "2019" },
  { key: "current_timezone", val: "bali / lahore (remote)" },
  { key: "github", val: "github.com/waseemnasir2k26" },
  { key: "stack", val: "n8n · next.js · openai · whatsapp · aeo" },
  { key: "status", val: "taking new projects" },
];

const SERVICES = [
  {
    id: "01",
    slug: "AI_AUTOMATION",
    title: "AI & Automation Systems",
    desc: "n8n workflows that eliminate entire job functions. Lead intake, follow-up sequences, CRM ops — wired once, runs forever.",
    tags: ["n8n", "OpenAI", "Zapier-killer"],
  },
  {
    id: "02",
    slug: "NEXT_BUILD",
    title: "Next.js Web Builds",
    desc: "Full-stack Next.js with AEO-optimised content architecture. Built to rank, convert, and load fast on first byte.",
    tags: ["Next.js 14", "TypeScript", "Edge"],
  },
  {
    id: "03",
    slug: "VOICE_BOT",
    title: "WhatsApp & Voice Bots",
    desc: "24/7 inbound bots that qualify leads, book calls, and handle objections. Works while you sleep across every timezone.",
    tags: ["WhatsApp API", "Twilio", "GPT-4"],
  },
  {
    id: "04",
    slug: "AEO_ENGINE",
    title: "AEO Citation Engine",
    desc: "Get cited by ChatGPT, Perplexity, and Bing AI. Schema, structured authority pages, off-site signals — the full stack.",
    tags: ["AEO", "Schema.org", "Authority"],
  },
];

const WORK_LOGS = [
  {
    client: "FreightOps",
    geo: "US",
    result: "AI voice receptionist handling 100% inbound after-hours",
    stack: "Twilio · OpenAI · n8n",
  },
  {
    client: "Inspire Health PT",
    geo: "CA",
    result: "$27 digital funnel live in 48h, Stripe confirmed",
    stack: "Next.js · Stripe · WP",
  },
  {
    client: "IdeaViaggi",
    geo: "IT",
    result: "Per-customer trip visibility via custom CTM gate",
    stack: "WP · REST API · PHP",
  },
  {
    client: "TakyCorp",
    geo: "FR",
    result: "Email automation recovered from 2× outages, now stable",
    stack: "Gmail API · n8n · OpenAI",
  },
];

/* ─── Typed terminal hook ────────────────────────────────── */
function useTerminal(lines: typeof BOOT_LINES, reducedMotion: boolean) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(lines.map((l) => `[${l.prefix}] ${l.text}`));
      return;
    }
    let lineIdx = 0;
    let charIdx = 0;
    let current = "";

    const tick = setInterval(() => {
      const line = lines[lineIdx];
      const full = `[${line.prefix}] ${line.text}`;

      if (charIdx < full.length) {
        current += full[charIdx];
        charIdx++;
        setDisplayed((prev) => {
          const next = [...prev];
          next[lineIdx] = current;
          return next;
        });
      } else {
        lineIdx++;
        charIdx = 0;
        current = "";
        if (lineIdx >= lines.length) {
          clearInterval(tick);
          return;
        }
        setDisplayed((prev) => [...prev, ""]);
      }
    }, 18);

    const blink = setInterval(() => setCursor((c) => !c), 530);
    return () => {
      clearInterval(tick);
      clearInterval(blink);
    };
  }, [lines, reducedMotion]);

  return { displayed, cursor };
}

/* ─── Aurora pulse ───────────────────────────────────────── */
function AuroraPulse({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 50% at 60% 40%, rgba(52,211,153,0.06) 0%, transparent 70%),
                     radial-gradient(ellipse 40% 60% at 20% 80%, rgba(94,234,212,0.04) 0%, transparent 60%)`,
      }}
      animate={
        reducedMotion
          ? {}
          : {
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.04, 1],
            }
      }
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Scanline grain overlay ─────────────────────────────── */
const SCANLINE_CSS = `
.d41-scanlines::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.04) 2px,
    rgba(0,0,0,0.04) 4px
  );
  pointer-events: none;
  z-index: 2;
  border-radius: inherit;
}
`;

/* ─── Glass terminal panel ───────────────────────────────── */
function GlassTerminal({
  displayed,
  cursor,
  reducedMotion,
}: {
  displayed: string[];
  cursor: boolean;
  reducedMotion: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [displayed]);

  return (
    <div
      className="d41-scanlines"
      style={{
        position: "relative",
        background: "rgba(15,22,20,0.72)",
        backdropFilter: "blur(18px) saturate(1.4)",
        WebkitBackdropFilter: "blur(18px) saturate(1.4)",
        border: "1px solid rgba(52,211,153,0.18)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px rgba(52,211,153,0.08), 0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(52,211,153,0.12), 0 0 60px rgba(52,211,153,0.06)",
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          borderBottom: "1px solid rgba(52,211,153,0.1)",
          background: "rgba(52,211,153,0.04)",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ef4444",
            opacity: 0.8,
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#f59e0b",
            opacity: 0.8,
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#34D399",
            opacity: 0.8,
          }}
        />
        <span
          style={{
            marginLeft: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: T.muted,
            letterSpacing: "0.04em",
          }}
        >
          skynetlabs — runtime
        </span>
      </div>

      {/* Terminal body */}
      <div
        style={{
          padding: "20px 20px 24px",
          minHeight: 340,
          maxHeight: 420,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {displayed.map((line, i) => {
          const isLast = i === displayed.length - 1;
          const isOk = line.includes("[OK ");
          const isArrow = line.startsWith("[>>]");
          return (
            <div
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12.5,
                lineHeight: 1.7,
                color: isArrow ? T.accent : isOk ? T.accent2 : T.text,
                opacity: isArrow || isOk ? 1 : 0.85,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {line}
              {isLast && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: "1em",
                    background: T.accent,
                    marginLeft: 2,
                    verticalAlign: "text-bottom",
                    opacity: cursor ? 1 : 0,
                    transition: reducedMotion ? "none" : "opacity 0.1s",
                  }}
                />
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Emerald backlight bleed */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: 40,
          background: "rgba(52,211,153,0.12)",
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
}

/* ─── Count-up hook ──────────────────────────────────────── */
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const raf = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

/* ─── Stat block ─────────────────────────────────────────── */
function StatBlock({
  value,
  suffix,
  label,
  delay,
  reducedMotion,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  reducedMotion: boolean;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count = useCountUp(value, 1400, reducedMotion ? true : inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      style={{
        background: "rgba(15,22,20,0.7)",
        border: "1px solid rgba(52,211,153,0.14)",
        borderRadius: 10,
        padding: "24px 28px",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 42,
          fontWeight: 700,
          color: T.accent,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {reducedMotion ? value : count}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: T.muted,
          marginTop: 8,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function D41ObsidianGlassTerminal() {
  const reducedMotion = useReducedMotion() ?? false;
  const { displayed, cursor } = useTerminal(BOOT_LINES, reducedMotion);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .root-41 {
          font-family: 'Inter', sans-serif;
          color: ${T.text};
          background: ${T.bg};
        }
        .root-41 *,
        .root-41 *::before,
        .root-41 *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .root-41 :focus-visible {
          outline: 2px solid ${T.accent};
          outline-offset: 3px;
          border-radius: 4px;
        }
        .root-41 a { color: inherit; text-decoration: none; }
        .root-41 img { display: block; }

        .d41-scroll-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: ${T.accent};
          z-index: 999;
          transform-origin: left;
          box-shadow: 0 0 8px ${T.accent};
        }

        ${SCANLINE_CSS}

        .d41-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${T.accent};
          color: #0A0C0E;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          padding: 14px 28px;
          border-radius: 6px;
          transition: filter 0.2s, transform 0.15s;
          letter-spacing: 0.03em;
        }
        .d41-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .d41-btn:active { transform: translateY(0); }

        .d41-ghost-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(52,211,153,0.4);
          color: ${T.accent};
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 14px 28px;
          border-radius: 6px;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.03em;
        }
        .d41-ghost-btn:hover {
          background: rgba(52,211,153,0.08);
          border-color: rgba(52,211,153,0.7);
        }

        .d41-service-card {
          background: rgba(15,22,20,0.6);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 10px;
          padding: 28px;
          transition: border-color 0.2s, background 0.2s;
          backdrop-filter: blur(8px);
        }
        .d41-service-card:hover {
          border-color: rgba(52,211,153,0.35);
          background: rgba(15,22,20,0.85);
        }

        .d41-work-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0;
          border-bottom: 1px solid rgba(52,211,153,0.08);
          padding: 18px 0;
          transition: background 0.15s;
        }
        .d41-work-row:hover {
          background: rgba(52,211,153,0.03);
        }

        @media (max-width: 900px) {
          .d41-hero-split { flex-direction: column !important; }
          .d41-hero-text { max-width: 100% !important; }
          .d41-hero-term { width: 100% !important; }
          .d41-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .d41-services-grid { grid-template-columns: 1fr 1fr !important; }
          .d41-about-split { flex-direction: column-reverse !important; }
          .d41-work-row { grid-template-columns: 1fr !important; gap: 6px !important; }
          .d41-proof-col { flex-direction: column !important; }
        }
        @media (max-width: 600px) {
          .d41-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .d41-services-grid { grid-template-columns: 1fr !important; }
          .d41-work-row-geo { display: none !important; }
        }
      `}</style>

      <div
        className="root-41"
        style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}
      >
        {/* Scroll progress rail */}
        <motion.div
          className="d41-scroll-bar"
          style={{ width: progressWidth }}
          aria-hidden
        />

        {/* Skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: -9999,
            top: 8,
            zIndex: 1000,
            padding: "8px 16px",
            background: T.accent,
            color: "#0A0C0E",
            borderRadius: 4,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          }}
          onFocus={(e) => {
            e.currentTarget.style.left = "8px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.left = "-9999px";
          }}
        >
          skip to content
        </a>

        {/* ── NAV ─────────────────────────────────────────── */}
        <nav
          aria-label="Main navigation"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(10,12,14,0.88)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(52,211,153,0.1)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: T.accent,
                letterSpacing: "0.06em",
              }}
            >
              ~/skynetlabs
            </span>
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {["work", "services", "about"].map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: T.muted,
                    letterSpacing: "0.05em",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
                >
                  {s}
                </a>
              ))}
              <a
                href="https://skynetjoe.com/discovery-call"
                className="d41-btn"
                style={{ padding: "8px 18px", fontSize: 12 }}
              >
                $ book_call
              </a>
            </div>
          </div>
        </nav>

        <main id="main-content">
          {/* ── HERO ────────────────────────────────────────── */}
          <section
            style={{
              position: "relative",
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              padding: "80px 24px",
            }}
          >
            <AuroraPulse reducedMotion={reducedMotion} />

            {/* Subtle grid */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)
                `,
                backgroundSize: "64px 64px",
                zIndex: 0,
              }}
            />

            <div
              className="d41-hero-split"
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: 1200,
                margin: "0 auto",
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 64,
              }}
            >
              {/* Left: statement */}
              <div
                className="d41-hero-text"
                style={{ flex: "0 0 auto", maxWidth: 520 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: T.accent,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: T.accent,
                      boxShadow: `0 0 8px ${T.accent}`,
                      animation: reducedMotion
                        ? "none"
                        : "d41-pulse 2s infinite",
                    }}
                  />
                  available for projects
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(32px, 4.5vw, 58px)",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    color: T.text,
                    marginBottom: 24,
                  }}
                >
                  <span style={{ color: T.muted, fontWeight: 500 }}>
                    {"// "}
                  </span>
                  shipped 40+ automations.{" "}
                  <span
                    style={{
                      color: T.accent,
                      display: "block",
                      marginTop: 4,
                    }}
                  >
                    zero babysitting required.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 17,
                    color: T.muted,
                    lineHeight: 1.65,
                    marginBottom: 36,
                    maxWidth: 440,
                  }}
                >
                  180+ builds. 9 countries. Uptime since 2019.
                  <br />
                  AI systems that kill busywork — not ones that add to it.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="d41-btn"
                  >
                    $ ./book_call.sh
                  </a>
                  <a href="#work" className="d41-ghost-btn">
                    cat work.log
                  </a>
                </motion.div>
              </div>

              {/* Right: glass terminal */}
              <motion.div
                className="d41-hero-term"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ flex: 1, minWidth: 0 }}
              >
                <GlassTerminal
                  displayed={displayed}
                  cursor={cursor}
                  reducedMotion={reducedMotion}
                />
              </motion.div>
            </div>
          </section>

          {/* ── STATS ───────────────────────────────────────── */}
          <section
            aria-label="Proof metrics"
            style={{
              padding: "80px 24px",
              background: `linear-gradient(180deg, ${T.bg} 0%, ${T.surface} 100%)`,
              borderTop: "1px solid rgba(52,211,153,0.08)",
            }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: T.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 40,
                }}
              >
                // proof.json — verified first-party
              </div>

              <div
                className="d41-stats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                  marginBottom: 56,
                }}
              >
                <StatBlock
                  value={180}
                  suffix="+"
                  label="builds_shipped"
                  delay={0}
                  reducedMotion={reducedMotion}
                />
                <StatBlock
                  value={40}
                  suffix="+"
                  label="clients_served"
                  delay={0.1}
                  reducedMotion={reducedMotion}
                />
                <StatBlock
                  value={9}
                  suffix=""
                  label="countries_worked"
                  delay={0.2}
                  reducedMotion={reducedMotion}
                />
                <StatBlock
                  value={2019}
                  suffix=""
                  label="operating_since"
                  delay={0.3}
                  reducedMotion={reducedMotion}
                />
              </div>

              {/* Monospace key-value proof rows */}
              <div
                style={{
                  background: "rgba(15,22,20,0.6)",
                  border: "1px solid rgba(52,211,153,0.12)",
                  borderRadius: 10,
                  overflow: "hidden",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    padding: "10px 20px",
                    background: "rgba(52,211,153,0.05)",
                    borderBottom: "1px solid rgba(52,211,153,0.1)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: T.muted,
                    letterSpacing: "0.05em",
                  }}
                >
                  waseem@skynetlabs:~$ cat proof.env
                </div>
                {PROOF_ROWS.map((row, i) => (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: "flex",
                      gap: 0,
                      padding: "12px 20px",
                      borderBottom:
                        i < PROOF_ROWS.length - 1
                          ? "1px solid rgba(52,211,153,0.06)"
                          : "none",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: T.accent2, minWidth: 220 }}>
                      {row.key}
                    </span>
                    <span style={{ color: T.muted, marginRight: 8 }}>=</span>
                    <span style={{ color: T.text }}>{row.val}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SERVICES ────────────────────────────────────── */}
          <section
            id="services"
            aria-label="Services"
            style={{ padding: "100px 24px", background: T.bg }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ marginBottom: 56 }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: T.muted,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  // services.config
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "-0.02em",
                    maxWidth: 560,
                    lineHeight: 1.15,
                  }}
                >
                  systems that run while you don't.
                </h2>
              </motion.div>

              <div
                className="d41-services-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                {SERVICES.map((svc, i) => (
                  <motion.div
                    key={svc.id}
                    className="d41-service-card"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: T.accent,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {svc.id} / {svc.slug}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 12,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {svc.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 14.5,
                        color: T.muted,
                        lineHeight: 1.65,
                        marginBottom: 20,
                      }}
                    >
                      {svc.desc}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {svc.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10.5,
                            color: T.accent2,
                            background: "rgba(94,234,212,0.08)",
                            border: "1px solid rgba(94,234,212,0.18)",
                            padding: "3px 10px",
                            borderRadius: 4,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── WORK LOG ────────────────────────────────────── */}
          <section
            id="work"
            aria-label="Selected work"
            style={{
              padding: "100px 24px",
              background: T.surface,
              borderTop: "1px solid rgba(52,211,153,0.08)",
            }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ marginBottom: 48 }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: T.muted,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  // work.log — selected entries
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(26px, 3vw, 40px)",
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "-0.02em",
                  }}
                >
                  build record. no fluff.
                </h2>
              </motion.div>

              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 0,
                  borderBottom: "1px solid rgba(52,211,153,0.2)",
                  paddingBottom: 10,
                  marginBottom: 0,
                }}
              >
                {["client / geo", "result", "stack"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10.5,
                      color: T.accent,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {WORK_LOGS.map((w, i) => (
                <motion.div
                  key={i}
                  className="d41-work-row"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        color: T.text,
                      }}
                    >
                      {w.client}
                    </span>
                    <span
                      className="d41-work-row-geo"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: T.muted,
                        marginLeft: 10,
                        letterSpacing: "0.08em",
                      }}
                    >
                      [{w.geo}]
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: T.muted,
                      lineHeight: 1.5,
                      paddingRight: 20,
                    }}
                  >
                    {w.result}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11.5,
                      color: T.accent2,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {w.stack}
                  </div>
                </motion.div>
              ))}

              {/* Photo strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                  marginTop: 64,
                }}
              >
                {[
                  {
                    src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
                    alt: "Waseem working on analytics dashboard at cafe",
                  },
                  {
                    src: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                    alt: "Waseem with client, thumbs up",
                  },
                  {
                    src: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
                    alt: "Waseem typing at night cafe",
                  },
                  {
                    src: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                    alt: "Waseem focused on phone at rice terrace",
                  },
                ].map((img, i) => (
                  <motion.div
                    key={img.src}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      aspectRatio: "4/3",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid rgba(52,211,153,0.1)",
                      position: "relative",
                    }}
                  >
                    <img
                      src={`/img/pro/${img.src}`}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "saturate(0.9) brightness(0.85)",
                        transition: "filter 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.filter =
                          "saturate(1.05) brightness(1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.filter =
                          "saturate(0.9) brightness(0.85)")
                      }
                    />
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, transparent 50%, rgba(10,12,14,0.6) 100%)",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── ABOUT ───────────────────────────────────────── */}
          <section
            id="about"
            aria-label="About Waseem"
            style={{ padding: "100px 24px", background: T.bg }}
          >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div
                className="d41-about-split"
                style={{ display: "flex", gap: 80, alignItems: "center" }}
              >
                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  style={{ flex: 1 }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: T.muted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}
                  >
                    // whoami
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "clamp(26px, 3vw, 40px)",
                      fontWeight: 700,
                      color: T.text,
                      letterSpacing: "-0.02em",
                      marginBottom: 24,
                      lineHeight: 1.2,
                    }}
                  >
                    Waseem Nasir.
                    <br />
                    <span
                      style={{
                        color: T.muted,
                        fontWeight: 500,
                        fontSize: "0.8em",
                      }}
                    >
                      founder / builder / independent.
                    </span>
                  </h2>

                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 16,
                      color: T.muted,
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    I run SkynetLabs solo. No agency markup, no account
                    managers. You talk directly to the person building your
                    system.
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 16,
                      color: T.muted,
                      lineHeight: 1.75,
                      marginBottom: 20,
                    }}
                  >
                    Since 2019 I've shipped 180+ builds across n8n automation,
                    Next.js products, AI voice bots, and AEO content engines —
                    for clients in healthcare, logistics, travel, and
                    professional services across 9 countries.
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 16,
                      color: T.muted,
                      lineHeight: 1.75,
                      marginBottom: 36,
                    }}
                  >
                    Currently working remote from Bali and Lahore.
                    Stack-agnostic, async-first, precision-obsessed.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                    }}
                  >
                    <a
                      href="https://github.com/waseemnasir2k26"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: T.muted,
                        borderBottom: `1px solid rgba(110,128,121,0.4)`,
                        paddingBottom: 2,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = T.accent2)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = T.muted)
                      }
                    >
                      github.com/waseemnasir2k26
                    </a>
                  </div>
                </motion.div>

                {/* Photos grid */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  style={{
                    flex: "0 0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    width: 420,
                  }}
                >
                  {[
                    {
                      src: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                      alt: "Waseem arms crossed, confident",
                    },
                    {
                      src: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                      alt: "Waseem typing at Bali terrace",
                    },
                    {
                      src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                      alt: "Waseem at hilltop with city vista",
                    },
                    {
                      src: "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
                      alt: "Waseem portrait in front of glass building",
                    },
                  ].map((img, i) => (
                    <div
                      key={img.src}
                      style={{
                        aspectRatio: i % 2 === 0 ? "4/5" : "4/5",
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid rgba(52,211,153,0.1)",
                        position: "relative",
                      }}
                    >
                      <img
                        src={`/img/pro/${img.src}`}
                        alt={img.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "saturate(0.85) brightness(0.88)",
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── PHOTO STRIP (travel + lifestyle) ────────────── */}
          <section
            aria-label="Behind the build"
            style={{
              padding: "0 0 100px",
              background: T.bg,
              overflow: "hidden",
            }}
          >
            <div
              style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: T.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                // location.history — 9 countries, 1 builder
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 10,
                }}
              >
                {[
                  {
                    src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                    alt: "Waseem at Nusa Penida cliffs",
                  },
                  {
                    src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                    alt: "Waseem working at rooftop cafe with mountain view",
                  },
                  {
                    src: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
                    alt: "Waseem on jungle bridge",
                  },
                  {
                    src: "TRAVEL-google-office-sign-cream-outfit.jpg",
                    alt: "Waseem at Google office sign",
                  },
                  {
                    src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                    alt: "Waseem standing at neon limit quote sign",
                  },
                ].map((img, i) => (
                  <motion.div
                    key={img.src}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      aspectRatio: "3/4",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid rgba(52,211,153,0.1)",
                    }}
                  >
                    <img
                      src={`/img/pro/${img.src}`}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "saturate(0.8) brightness(0.82)",
                        transition: "filter 0.3s, transform 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter =
                          "saturate(1) brightness(0.95)";
                        e.currentTarget.style.transform = "scale(1.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter =
                          "saturate(0.8) brightness(0.82)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────── */}
          <section
            aria-label="Book a call"
            style={{
              padding: "100px 24px",
              background: T.surface,
              borderTop: "1px solid rgba(52,211,153,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Aurora behind CTA */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 60% 70% at 50% 50%, rgba(52,211,153,0.06) 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: 700,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: T.accent,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                $ ./start_project.sh
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(30px, 4vw, 52px)",
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  marginBottom: 20,
                }}
              >
                ready to cut the busywork?
              </motion.h2>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 17,
                  color: T.muted,
                  lineHeight: 1.65,
                  marginBottom: 40,
                }}
              >
                30 minutes. No deck. We map your biggest bottleneck and I tell
                you exactly how to automate it — or if you shouldn't.
              </p>

              <motion.a
                href="https://skynetjoe.com/discovery-call"
                className="d41-btn"
                whileHover={reducedMotion ? {} : { scale: 1.03 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                style={{
                  fontSize: 15,
                  padding: "16px 40px",
                  display: "inline-flex",
                }}
              >
                $ book 30-min call →
              </motion.a>

              <div
                style={{
                  marginTop: 32,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: T.muted,
                  letterSpacing: "0.06em",
                }}
              >
                async-first · remote-native · no retainers required
              </div>
            </div>
          </section>

          {/* ── FINAL PHOTO ─────────────────────────────────── */}
          <section
            aria-label="Field shot"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 0,
              height: 420,
            }}
          >
            {[
              {
                src: "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
                alt: "Waseem at blue hour cafe with laptop",
              },
              {
                src: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                alt: "Bali coworking meetup event",
              },
              {
                src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                alt: "Waseem smiling at rooftop cafe with dragonfruit",
              },
            ].map((img) => (
              <div
                key={img.src}
                style={{ overflow: "hidden", position: "relative" }}
              >
                <img
                  src={`/img/pro/${img.src}`}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "saturate(0.75) brightness(0.75)",
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10,12,14,0.35)",
                  }}
                />
              </div>
            ))}
          </section>
        </main>

        {/* ── FOOTER ──────────────────────────────────────── */}
        <footer
          aria-label="Footer"
          style={{
            background: T.bg,
            borderTop: "1px solid rgba(52,211,153,0.08)",
            padding: "40px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: T.muted,
              }}
            >
              <span style={{ color: T.accent }}>waseem@skynetlabs</span>
              {" · "}
              <a
                href="https://skynetjoe.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: T.muted, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.accent2)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
              >
                skynetjoe.com
              </a>
              {" · "}
              <a
                href="https://github.com/waseemnasir2k26"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: T.muted, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.accent2)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
              >
                github
              </a>
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: T.muted,
                letterSpacing: "0.04em",
              }}
            >
              // © 2019–2026 SkynetLabs. built with obsidian glass.
            </div>
          </div>
        </footer>

        {/* Pulse keyframe */}
        <style>{`
          @keyframes d41-pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 8px ${T.accent}; }
            50% { opacity: 0.4; box-shadow: 0 0 3px ${T.accent}; }
          }
        `}</style>
      </div>
    </>
  );
}
