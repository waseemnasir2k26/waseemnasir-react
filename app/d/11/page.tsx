"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";

// ─── Scramble hook ──────────────────────────────────────────────────────────
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=|";

function useScramble(
  target: string,
  trigger: boolean,
  reduced: boolean | null,
) {
  const [display, setDisplay] = useState(reduced ? target : "");
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!trigger) return;
    if (reduced) {
      setDisplay(target);
      return;
    }

    let iteration = 0;
    const totalFrames = target.length * 5;

    function tick() {
      iteration++;
      const progress = iteration / totalFrames;
      const lockedCount = Math.floor(progress * target.length);

      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < lockedCount) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      if (iteration < totalFrames) {
        frameRef.current = setTimeout(tick, 30);
      } else {
        setDisplay(target);
      }
    }

    tick();
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [trigger, target, reduced]);

  return display;
}

// ─── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(end: number, trigger: boolean, reduced: boolean | null) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (reduced) {
      setVal(end);
      return;
    }
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, end, reduced]);
  return val;
}

// ─── Intersection trigger ────────────────────────────────────────────────────
function useInView(
  threshold = 0.2,
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Scramble heading component ─────────────────────────────────────────────
function ScrambleHeading({
  as: Tag = "h2",
  text,
  className = "",
  reduced,
}: {
  as?: keyof JSX.IntrinsicElements;
  text: string;
  className?: string;
  reduced: boolean | null;
}) {
  const [ref, inView] = useInView(0.1);
  const display = useScramble(text, inView, reduced);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setShowCaret((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    // @ts-expect-error polymorphic tag
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {display}
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "0.9em",
            background: "#C6F432",
            marginLeft: "2px",
            verticalAlign: "middle",
            opacity: showCaret ? 1 : 0,
            transition: "opacity 0.05s",
          }}
        />
      </span>
    </Tag>
  );
}

// ─── Stat block ─────────────────────────────────────────────────────────────
function StatBlock({
  value,
  suffix,
  label,
  trigger,
  reduced,
}: {
  value: number;
  suffix: string;
  label: string;
  trigger: boolean;
  reduced: boolean | null;
}) {
  const count = useCountUp(value, trigger, reduced);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 500,
          color: "#C6F432",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {count}
        {suffix}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem",
          color: "#5A6360",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Scanline accent ────────────────────────────────────────────────────────
function ScanlineText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      className="scanline-host"
    >
      {children}
    </span>
  );
}

// ─── Services data ──────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "01",
    name: "AI Automation Systems",
    desc: "n8n workflows that replace manual ops: lead capture, follow-up sequences, ops pipelines that run unsupervised.",
    tag: "n8n · webhook · ops",
  },
  {
    id: "02",
    name: "Voice & WhatsApp Bots",
    desc: "Inbound call handlers and WhatsApp agents that qualify leads, book calls, and escalate — 24 h coverage, zero headcount.",
    tag: "voice AI · WA API · bots",
  },
  {
    id: "03",
    name: "Next.js Product Builds",
    desc: "Full-stack web apps: server components, edge APIs, real-time data layers. Ship from spec to production in days, not sprints.",
    tag: "Next.js · TypeScript · edge",
  },
  {
    id: "04",
    name: "AEO & Answer Engine Visibility",
    desc: "Structure your content so AI search (Perplexity, ChatGPT, SGE) surfaces your brand in response zero — before the link click.",
    tag: "AEO · structured data · LLM",
  },
];

// ─── Work entries ────────────────────────────────────────────────────────────
const WORK = [
  {
    id: "WK-001",
    title: "FreightOps AI Receptionist",
    tags: ["voice AI", "US + SG", "dual-geo"],
    status: "SHIPPED",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    note: "Handles inbound trucker calls, books loads, routes to dispatch.",
  },
  {
    id: "WK-002",
    title: "Inspire Health $27 Funnel",
    tags: ["Stripe", "WP", "automation"],
    status: "LIVE",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    note: "Full PT booking funnel — Stripe, WP plugin, Zocdoc chat, 6 bugs closed v1.4.3.",
  },
  {
    id: "WK-003",
    title: "IdeaViaggi Trip-Input System",
    tags: ["CPT", "REST", "PHP"],
    status: "DEPLOYED",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    note: "Custom WordPress trip portal with per-customer destination gating.",
  },
  {
    id: "WK-004",
    title: "TakyCorp Email Automation",
    tags: ["Gmail API", "OpenAI", "cron"],
    status: "RUNNING",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    note: "Auto-classify + reply engine for high-volume transactional email.",
  },
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function TerminalDrift() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [heroRef, heroInView] = useInView(0.05);
  const heroHeadline = useScramble(
    "Deploying calm into chaotic ops.",
    heroInView,
    reduced,
  );
  const [showCaret, setShowCaret] = useState(true);

  const [statsRef, statsInView] = useInView(0.3);
  const [aboutRef, aboutInView] = useInView(0.2);
  const aboutText = useScramble("Waseem Nasir", aboutInView, reduced);

  useEffect(() => {
    const t = setInterval(() => setShowCaret((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .root-11 {
          font-family: 'Inter', sans-serif;
          background: #0B0D0C;
          color: #E8EDEA;
          -webkit-font-smoothing: antialiased;
        }

        .root-11 *, .root-11 *::before, .root-11 *::after {
          box-sizing: border-box;
        }

        .root-11 .display-font {
          font-family: 'Space Grotesk', sans-serif;
        }

        .root-11 .mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .root-11 .rail-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #5A6360;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          user-select: none;
        }

        .root-11 .scanline-host::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(11, 13, 12, 0.18) 3px,
            rgba(11, 13, 12, 0.18) 4px
          );
          pointer-events: none;
        }

        .root-11 .acid-line {
          height: 1px;
          background: #C6F432;
          width: 100%;
        }

        .root-11 .teal-line {
          height: 1px;
          background: #3DF0C0;
          width: 40px;
        }

        .root-11 .surface-card {
          background: #16191A;
          border: 1px solid #1E2422;
        }

        .root-11 .accent-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C6F432;
          display: inline-block;
          flex-shrink: 0;
        }

        .root-11 .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #C6F432;
          color: #0B0D0C;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 14px 28px;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border: none;
          cursor: pointer;
        }

        .root-11 .cta-btn:hover {
          background: #E8EDEA;
        }

        .root-11 .cta-btn:focus-visible {
          outline: 2px solid #3DF0C0;
          outline-offset: 3px;
        }

        .root-11 .ghost-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #E8EDEA;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 24px;
          text-decoration: none;
          border: 1px solid #2A302E;
          transition: border-color 0.15s, color 0.15s;
        }

        .root-11 .ghost-btn:hover {
          border-color: #3DF0C0;
          color: #3DF0C0;
        }

        .root-11 .ghost-btn:focus-visible {
          outline: 2px solid #3DF0C0;
          outline-offset: 3px;
        }

        .root-11 .work-card {
          background: #16191A;
          border: 1px solid #1E2422;
          transition: border-color 0.2s;
          overflow: hidden;
        }

        .root-11 .work-card:hover {
          border-color: #C6F432;
        }

        .root-11 .status-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 3px 8px;
          border: 1px solid #C6F432;
          color: #C6F432;
        }

        .root-11 .service-row {
          border-top: 1px solid #1E2422;
          transition: border-color 0.15s;
        }

        .root-11 .service-row:hover {
          border-color: #C6F432;
        }

        .root-11 .service-row:last-child {
          border-bottom: 1px solid #1E2422;
        }

        .root-11 .progress-rail {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #C6F432;
          transform-origin: left;
          z-index: 9999;
        }

        .root-11 a:focus-visible {
          outline: 2px solid #3DF0C0;
          outline-offset: 2px;
        }

        .root-11 img {
          display: block;
        }

        @media (max-width: 768px) {
          .root-11 .hero-grid {
            flex-direction: column;
          }
          .root-11 .left-rail {
            display: none;
          }
          .root-11 .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .root-11 .work-grid {
            grid-template-columns: 1fr !important;
          }
          .root-11 .about-grid {
            flex-direction: column;
          }
        }
      `}</style>

      <div
        className="root-11"
        style={{ position: "relative", minHeight: "100vh", zIndex: 2 }}
      >
        {/* Scroll progress rail */}
        <motion.div
          className="root-11 progress-rail"
          style={{ scaleX }}
          aria-hidden="true"
        />

        {/* Skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
          onFocus={(e) => {
            e.currentTarget.style.left = "16px";
            e.currentTarget.style.top = "16px";
            e.currentTarget.style.width = "auto";
            e.currentTarget.style.height = "auto";
          }}
          onBlur={(e) => {
            e.currentTarget.style.left = "-9999px";
          }}
        >
          Skip to main content
        </a>

        {/* ─── NAV ──────────────────────────────────────────────────────── */}
        <nav
          aria-label="Site navigation"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(11,13,12,0.92)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #1E2422",
            padding: "0 clamp(16px, 4vw, 48px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "52px",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: "0.75rem",
              color: "#5A6360",
              letterSpacing: "0.1em",
            }}
          >
            <span style={{ color: "#C6F432" }}>▸</span> skynetlabs
          </span>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {["work", "services", "about"].map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="mono"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#5A6360",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8EDEA")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6360")}
              >
                {s}
              </a>
            ))}
            <a
              href="https://skynetjoe.com/discovery-call"
              className="cta-btn"
              style={{ padding: "8px 18px", fontSize: "0.65rem" }}
            >
              book call
            </a>
          </div>
        </nav>

        <main id="main-content">
          {/* ─── HERO ──────────────────────────────────────────────────── */}
          <section
            ref={heroRef}
            aria-labelledby="hero-h1"
            style={{
              minHeight: "100vh",
              display: "flex",
              padding: "0 clamp(16px, 4vw, 48px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Left rail */}
            <div
              className="left-rail"
              style={{
                width: "48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                paddingTop: "80px",
                paddingBottom: "80px",
                flexShrink: 0,
              }}
            >
              <span className="rail-label">terminal-drift</span>
              <div
                className="teal-line"
                style={{ width: "1px", height: "80px" }}
              />
              <span className="rail-label">design-11</span>
            </div>

            {/* Main hero content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "80px",
                paddingBottom: "80px",
                paddingLeft: "32px",
                maxWidth: "900px",
              }}
            >
              {/* System log pre-line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "32px",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.65rem",
                    color: "#5A6360",
                    letterSpacing: "0.1em",
                  }}
                >
                  SYS-LOG <span style={{ color: "#3DF0C0" }}>2026-06-15</span>{" "}
                  &nbsp;
                  <span style={{ color: "#C6F432" }}>●</span> ACTIVE
                </span>
              </motion.div>

              {/* H1 */}
              <h1
                id="hero-h1"
                className="display-font"
                aria-label="Deploying calm into chaotic ops."
                style={{
                  fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#E8EDEA",
                  margin: 0,
                  marginBottom: "24px",
                }}
              >
                <span aria-hidden="true">
                  {heroHeadline}
                  <span
                    style={{
                      display: "inline-block",
                      width: "3px",
                      height: "0.85em",
                      background: "#C6F432",
                      marginLeft: "4px",
                      verticalAlign: "middle",
                      opacity: showCaret ? 1 : 0,
                      transition: "opacity 0.05s",
                    }}
                  />
                </span>
              </h1>

              {/* Subhead */}
              <motion.p
                className="mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  fontSize: "0.82rem",
                  color: "#5A6360",
                  marginBottom: "48px",
                  lineHeight: 1.6,
                  letterSpacing: "0.02em",
                }}
              >
                <ScanlineText>
                  <span style={{ color: "#3DF0C0" }}>//</span> 180+ builds · 40+
                  clients · 9 countries · status: shipping since 2019
                </ScanlineText>
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="cta-btn"
                >
                  <span>▸ book 30 min call</span>
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-btn"
                >
                  github →
                </a>
              </motion.div>

              {/* Bottom metadata strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                style={{
                  marginTop: "64px",
                  paddingTop: "24px",
                  borderTop: "1px solid #1E2422",
                  display: "flex",
                  gap: "32px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { key: "base", val: "Bali / Lahore" },
                  { key: "stack", val: "n8n · Next.js · voice AI" },
                  { key: "available", val: "now" },
                ].map(({ key, val }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.6rem",
                        color: "#5A6360",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {key}
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: "0.75rem", color: "#E8EDEA" }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — hero image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                width: "clamp(200px, 28vw, 380px)",
                alignSelf: "center",
                flexShrink: 0,
                marginLeft: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
              aria-hidden="true"
            >
              <img
                src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                alt="Waseem Nasir — founder SkynetLabs"
                style={{
                  width: "100%",
                  aspectRatio: "956/1700",
                  objectFit: "cover",
                  objectPosition: "center top",
                  filter: "grayscale(20%)",
                }}
              />
              <div className="acid-line" />
            </motion.div>
          </section>

          {/* ─── PROOF / STATS ─────────────────────────────────────────── */}
          <section
            id="proof"
            ref={statsRef}
            aria-labelledby="stats-heading"
            style={{
              padding: "80px clamp(16px, 4vw, 48px)",
              borderTop: "1px solid #1E2422",
              borderBottom: "1px solid #1E2422",
            }}
          >
            <h2
              id="stats-heading"
              className="display-font"
              style={{ position: "absolute", left: "-9999px" }}
            >
              Proof numbers
            </h2>
            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "32px",
              }}
            >
              <StatBlock
                value={180}
                suffix="+"
                label="builds shipped"
                trigger={statsInView}
                reduced={reduced}
              />
              <StatBlock
                value={40}
                suffix="+"
                label="clients served"
                trigger={statsInView}
                reduced={reduced}
              />
              <StatBlock
                value={9}
                suffix=""
                label="countries worked from"
                trigger={statsInView}
                reduced={reduced}
              />
              <StatBlock
                value={2019}
                suffix=""
                label="operating since"
                trigger={statsInView}
                reduced={reduced}
              />
            </div>
          </section>

          {/* ─── SERVICES ──────────────────────────────────────────────── */}
          <section
            id="services"
            aria-labelledby="services-heading"
            style={{ padding: "100px clamp(16px, 4vw, 48px)" }}
          >
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
              {/* Section label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "48px",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.6rem",
                    color: "#5A6360",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  01 / services
                </span>
                <div className="acid-line" style={{ flex: 1 }} />
              </div>

              <ScrambleHeading
                as="h2"
                text="What gets built."
                className="display-font"
                reduced={reduced}
                aria-label="What gets built"
              />
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "#E8EDEA",
                  marginBottom: "64px",
                }}
              />

              {SERVICES.map((svc, i) => (
                <motion.div
                  key={svc.id}
                  className="service-row"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{
                    padding: "28px 0",
                    display: "grid",
                    gridTemplateColumns: "60px 1fr auto",
                    gap: "24px",
                    alignItems: "start",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.65rem",
                      color: "#5A6360",
                      letterSpacing: "0.1em",
                      paddingTop: "4px",
                    }}
                  >
                    {svc.id}
                  </span>
                  <div>
                    <div
                      className="display-font"
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "#E8EDEA",
                        marginBottom: "8px",
                      }}
                    >
                      {svc.name}
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#5A6360",
                        lineHeight: 1.6,
                        margin: 0,
                        maxWidth: "520px",
                      }}
                    >
                      {svc.desc}
                    </p>
                  </div>
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.6rem",
                      color: "#3DF0C0",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                      paddingTop: "4px",
                      textAlign: "right",
                    }}
                  >
                    {svc.tag}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ─── WORK ──────────────────────────────────────────────────── */}
          <section
            id="work"
            aria-labelledby="work-heading"
            style={{
              padding: "100px clamp(16px, 4vw, 48px)",
              background: "#16191A",
            }}
          >
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "48px",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.6rem",
                    color: "#5A6360",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  02 / selected work
                </span>
                <div className="acid-line" style={{ flex: 1 }} />
              </div>

              <ScrambleHeading
                as="h2"
                text="System logs."
                className="display-font"
                reduced={reduced}
              />
              <div style={{ marginBottom: "56px" }} />

              <div
                className="work-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "2px",
                }}
              >
                {WORK.map((w, i) => (
                  <motion.article
                    key={w.id}
                    className="work-card"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    aria-label={w.title}
                  >
                    <div style={{ overflow: "hidden", aspectRatio: "16/9" }}>
                      <img
                        src={`/img/pro/${w.img}`}
                        alt={w.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "grayscale(30%) brightness(0.75)",
                          transition: "transform 0.5s, filter 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.04)";
                          e.currentTarget.style.filter =
                            "grayscale(0%) brightness(0.9)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.filter =
                            "grayscale(30%) brightness(0.75)";
                        }}
                      />
                    </div>
                    <div style={{ padding: "20px 24px 24px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          className="mono"
                          style={{
                            fontSize: "0.6rem",
                            color: "#5A6360",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {w.id}
                        </span>
                        <span className="status-badge">{w.status}</span>
                      </div>
                      <h3
                        className="display-font"
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#E8EDEA",
                          margin: "0 0 8px",
                        }}
                      >
                        {w.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "#5A6360",
                          margin: "0 0 14px",
                          lineHeight: 1.5,
                        }}
                      >
                        {w.note}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {w.tags.map((t) => (
                          <span
                            key={t}
                            className="mono"
                            style={{
                              fontSize: "0.58rem",
                              color: "#3DF0C0",
                              letterSpacing: "0.08em",
                              border: "1px solid #1E2422",
                              padding: "2px 8px",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* ─── VOICE / PHILOSOPHY ────────────────────────────────────── */}
          <section
            aria-labelledby="voice-heading"
            style={{
              padding: "100px clamp(16px, 4vw, 48px)",
              borderTop: "1px solid #1E2422",
            }}
          >
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "64px",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.6rem",
                    color: "#5A6360",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  03 / protocol
                </span>
                <div className="acid-line" style={{ flex: 1 }} />
              </div>

              {[
                {
                  id: "P-01",
                  heading: "Speed is a design decision.",
                  body: "Every missed lead and dropped follow-up is a system gap, not a people problem. The fix is architectural.",
                },
                {
                  id: "P-02",
                  heading: "Automation ships or it doesn't exist.",
                  body: "No pitch decks about potential. One shipped workflow that runs at 2 AM beats a roadmap.",
                },
                {
                  id: "P-03",
                  heading: "Calm ops compound.",
                  body: "The goal is a system that reports green without being watched. That's the actual product.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr",
                    gap: "20px",
                    paddingBottom: "40px",
                    marginBottom: "40px",
                    borderBottom: i < 2 ? "1px solid #1E2422" : "none",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.6rem",
                      color: "#5A6360",
                      letterSpacing: "0.1em",
                      paddingTop: "6px",
                    }}
                  >
                    {item.id}
                  </span>
                  <div>
                    <h3
                      id={i === 0 ? "voice-heading" : undefined}
                      className="display-font"
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#E8EDEA",
                        margin: "0 0 10px",
                      }}
                    >
                      {item.heading}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#5A6360",
                        margin: 0,
                        lineHeight: 1.65,
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ─── ABOUT ─────────────────────────────────────────────────── */}
          <section
            id="about"
            aria-labelledby="about-heading"
            style={{
              padding: "100px clamp(16px, 4vw, 48px)",
              background: "#16191A",
              borderTop: "1px solid #1E2422",
            }}
          >
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "64px",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.6rem",
                    color: "#5A6360",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  04 / operator
                </span>
                <div className="acid-line" style={{ flex: 1 }} />
              </div>

              <div
                ref={aboutRef}
                className="about-grid"
                style={{
                  display: "flex",
                  gap: "64px",
                  alignItems: "flex-start",
                }}
              >
                {/* Photos — 2 stacked */}
                <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
                  <div style={{ width: "clamp(120px, 16vw, 220px)" }}>
                    <img
                      src="/img/pro/PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg"
                      alt="Waseem in Bali rice fields"
                      style={{
                        width: "100%",
                        aspectRatio: "956/1700",
                        objectFit: "cover",
                        objectPosition: "center top",
                        marginBottom: "12px",
                      }}
                    />
                    <img
                      src="/img/pro/CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg"
                      alt="Waseem working at garden cafe"
                      style={{
                        width: "100%",
                        aspectRatio: "1700/956",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "clamp(120px, 16vw, 220px)",
                      paddingTop: "40px",
                    }}
                  >
                    <img
                      src="/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg"
                      alt="Waseem on hilltop overlooking city"
                      style={{
                        width: "100%",
                        aspectRatio: "956/1700",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                    />
                  </div>
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <h2
                    id="about-heading"
                    className="display-font"
                    aria-label="Waseem Nasir"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: "-0.03em",
                      color: "#E8EDEA",
                      margin: "0 0 8px",
                    }}
                  >
                    <span aria-hidden="true">{aboutText}</span>
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "32px",
                    }}
                  >
                    <div className="teal-line" />
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.65rem",
                        color: "#3DF0C0",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Founder · SkynetLabs
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#5A6360",
                      lineHeight: 1.7,
                      marginBottom: "24px",
                    }}
                  >
                    Independent since 2019. Builds AI + automation
                    infrastructure for operators who need systems that work
                    without babysitting. Clients are founders, agencies, and
                    small ops teams — mostly referred.
                  </p>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#5A6360",
                      lineHeight: 1.7,
                      marginBottom: "40px",
                    }}
                  >
                    Stack is whatever ships fastest: n8n for orchestration,
                    Next.js for product surfaces, WhatsApp + voice APIs for the
                    inbound layer. Based between Bali and Lahore. Remote-only.
                  </p>

                  {/* Attribute rows */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {[
                      {
                        label: "active stack",
                        val: "n8n · Next.js · OpenAI · WA API · Vapi",
                      },
                      { label: "operating since", val: "2019" },
                      { label: "current base", val: "Bali, Indonesia" },
                      { label: "github", val: "github.com/waseemnasir2k26" },
                    ].map(({ label, val }) => (
                      <div
                        key={label}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "140px 1fr",
                          gap: "16px",
                          paddingBottom: "16px",
                          borderBottom: "1px solid #1E2422",
                        }}
                      >
                        <span
                          className="mono"
                          style={{
                            fontSize: "0.6rem",
                            color: "#5A6360",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          className="mono"
                          style={{ fontSize: "0.75rem", color: "#E8EDEA" }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional photos row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginTop: "48px",
                }}
              >
                {[
                  {
                    file: "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
                    alt: "Waseem blue hour cafe Bali",
                    ratio: "1700/956",
                  },
                  {
                    file: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                    alt: "Waseem working at Bali rice terrace",
                    ratio: "1700/956",
                  },
                  {
                    file: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                    alt: "Bali coworking meetup",
                    ratio: "1700/956",
                  },
                  {
                    file: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                    alt: "Waseem rooftop laptop dragonfruit",
                    ratio: "1700/956",
                  },
                ].map(({ file, alt, ratio }) => (
                  <img
                    key={file}
                    src={`/img/pro/${file}`}
                    alt={alt}
                    style={{
                      width: "100%",
                      aspectRatio: ratio,
                      objectFit: "cover",
                      filter: "grayscale(15%)",
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ─── CONTACT / CTA ─────────────────────────────────────────── */}
          <section
            id="contact"
            aria-labelledby="contact-heading"
            style={{
              padding: "120px clamp(16px, 4vw, 48px)",
              borderTop: "1px solid #1E2422",
            }}
          >
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "56px",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: "0.6rem",
                    color: "#5A6360",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  05 / contact
                </span>
                <div className="acid-line" style={{ flex: 1 }} />
              </div>

              <ScrambleHeading
                as="h2"
                text="Ready to ship?"
                className="display-font"
                reduced={reduced}
              />
              <div
                className="display-font"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  color: "#E8EDEA",
                  marginBottom: "24px",
                }}
              />

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#5A6360",
                  lineHeight: 1.7,
                  marginBottom: "48px",
                  maxWidth: "480px",
                }}
              >
                30 minutes. Describe the broken workflow, the missed lead, the
                thing your team manually repeats every day. Leave with a clear
                implementation path — booked or not.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "56px",
                }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="cta-btn"
                  style={{ fontSize: "0.82rem", padding: "16px 32px" }}
                >
                  <span>▸ book discovery call — free, 30 min</span>
                </a>
              </div>

              {/* System status block */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "#16191A",
                  border: "1px solid #1E2422",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  {
                    k: "operator",
                    v: "Waseem Nasir / SkynetLabs",
                    c: "#E8EDEA",
                  },
                  { k: "response_time", v: "< 24 h", c: "#C6F432" },
                  { k: "remote", v: "true", c: "#3DF0C0" },
                  { k: "availability", v: "open", c: "#C6F432" },
                ].map(({ k, v, c }) => (
                  <div key={k} style={{ display: "flex", gap: "16px" }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.7rem",
                        color: "#5A6360",
                        minWidth: "140px",
                      }}
                    >
                      {k}:
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: "0.7rem", color: c }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

        {/* ─── FOOTER ────────────────────────────────────────────────────── */}
        <footer
          role="contentinfo"
          style={{
            borderTop: "1px solid #1E2422",
            padding: "32px clamp(16px, 4vw, 48px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: "0.62rem",
              color: "#5A6360",
              letterSpacing: "0.1em",
            }}
          >
            <span style={{ color: "#C6F432" }}>▸</span> skynetlabs · design-11
            terminal-drift · 2019–2026
          </span>
          <div style={{ display: "flex", gap: "24px" }}>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="mono"
              style={{
                fontSize: "0.62rem",
                color: "#5A6360",
                textDecoration: "none",
                letterSpacing: "0.1em",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C6F432")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6360")}
            >
              book call ↗
            </a>
            <a
              href="https://github.com/waseemnasir2k26"
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{
                fontSize: "0.62rem",
                color: "#5A6360",
                textDecoration: "none",
                letterSpacing: "0.1em",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C6F432")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6360")}
            >
              github ↗
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
