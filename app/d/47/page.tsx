"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  animate,
  useMotionValue,
} from "framer-motion";

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,600;0,900;1,900&family=Archivo+Narrow:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap";

const P = {
  bg: "#EFEBE3",
  surface: "#FFFFFF",
  text: "#111110",
  muted: "#7C776C",
  accent: "#E5341C",
  accent2: "#1A1A1A",
  rule: "#111110",
};

const IMAGES = {
  hero: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  work1:
    "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  work2:
    "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  work3: "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  work4:
    "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  work5:
    "/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
  about1: "/img/pro/PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
  about2: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  about3:
    "/img/pro/LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
  event: "/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
  travel:
    "/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  portrait: "/img/pro/PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
  cafe1:
    "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  cafe2:
    "/img/pro/CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
};

const SERVICES = [
  {
    no: "01",
    title: "AI Automation",
    body: "n8n workflows eliminating manual ops — lead routing, follow-up sequences, data pipelines.",
  },
  {
    no: "02",
    title: "Voice & Chat Bots",
    body: "WhatsApp + voice receptionists that handle inbound 24/7. No missed leads.",
  },
  {
    no: "03",
    title: "AEO Systems",
    body: "Answer Engine Optimisation — structured so AI platforms cite your business first.",
  },
  {
    no: "04",
    title: "Next.js Builds",
    body: "Production-grade web systems. Full-stack, deployed, maintained by one operator.",
  },
];

const WORKS = [
  {
    no: "A",
    label: "FreightOps",
    desc: "AI voice receptionist + Meta ad system. US & Singapore dual-geo launch.",
    tag: "Voice AI",
    year: "2026",
  },
  {
    no: "B",
    label: "Inspire Health PT",
    desc: "$27 funnel, Stripe checkout, mobile-first clinic site. 6 bugs shipped v1.4.3.",
    tag: "Funnel",
    year: "2026",
  },
  {
    no: "C",
    label: "IdeaViaggi",
    desc: "Trip-input CPT system with per-customer visibility gate. GDPR-hardened.",
    tag: "WordPress",
    year: "2026",
  },
  {
    no: "D",
    label: "TakyCorp Email",
    desc: "Gmail automation engine. Survived two outages — patched and stabilised.",
    tag: "Automation",
    year: "2025",
  },
  {
    no: "E",
    label: "SkynetJoe.com",
    desc: "AEO-optimised founder site. 9 deploys, citation-layer architecture.",
    tag: "AEO + Next.js",
    year: "2024",
  },
];

const TICKER_TEXT =
  "SKYNETLABS — AI AUTOMATION — 180+ BUILDS SHIPPED — 40+ CLIENTS — 9 COUNTRIES — SINCE 2019 — WASEEM NASIR — INDEPENDENT FOUNDER — BALI / LAHORE — ";

/* ── Horizontal rule ─────────────────────────────────────── */
function Rule({
  thick = false,
  color,
  style: extra = {},
}: {
  thick?: boolean;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        height: thick ? 3 : 1,
        background: color ?? (thick ? P.accent : P.rule),
        width: "100%",
        flexShrink: 0,
        ...extra,
      }}
    />
  );
}

/* ── Vertical rule ───────────────────────────────────────── */
function VRule({ thick = false }: { thick?: boolean }) {
  return (
    <div
      style={{
        width: thick ? 3 : 1,
        background: thick ? P.accent : P.rule,
        alignSelf: "stretch",
        flexShrink: 0,
      }}
    />
  );
}

/* ── Column label ────────────────────────────────────────── */
function ColLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        color: light ? "rgba(255,255,255,0.45)" : P.muted,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        marginBottom: 8,
      }}
    >
      {text}
    </div>
  );
}

/* ── Running newspaper ticker ────────────────────────────── */
function Ticker({ inverted = false }: { inverted?: boolean }) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const el = tickerRef.current;
    if (!el) return;
    const w = el.scrollWidth / 2;
    let raf: number;
    let pos = 0;
    const step = () => {
      pos -= 0.6;
      if (Math.abs(pos) >= w) pos = 0;
      x.set(pos);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced, x]);

  const col = inverted ? "rgba(255,255,255,0.35)" : P.muted;
  const borderCol = inverted ? "rgba(255,255,255,0.15)" : `${P.rule}22`;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 36,
        overflow: "hidden",
        borderTop: `1px solid ${borderCol}`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        ref={tickerRef}
        style={{ x, display: "flex", whiteSpace: "nowrap" }}
      >
        {[0, 1].map((rep) => (
          <span
            key={rep}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: col,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              paddingRight: 0,
            }}
          >
            {TICKER_TEXT.repeat(6)}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Panel progress bar ──────────────────────────────────── */
function ProgressBar({
  progress,
  inverted = false,
}: {
  progress: import("framer-motion").MotionValue<number>;
  inverted?: boolean;
}) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: inverted ? "rgba(255,255,255,0.1)" : `${P.rule}18`,
        zIndex: 200,
      }}
    >
      <motion.div
        style={{
          height: "100%",
          background: P.accent,
          width,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

/* ── Masthead bar ────────────────────────────────────────── */
function Masthead({
  issue,
  inverted = false,
}: {
  issue: string;
  inverted?: boolean;
}) {
  const fg = inverted ? "rgba(255,255,255,0.5)" : P.muted;
  const bdr = inverted ? "rgba(255,255,255,0.15)" : P.rule;
  const accentFg = inverted ? P.accent : P.accent;
  return (
    <div
      style={{
        padding: "0 48px",
        borderBottom: `1px solid ${bdr}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: accentFg,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontWeight: 700,
          }}
        >
          The Swiss Gazette
        </span>
        <div style={{ width: 1, height: 12, background: bdr }} />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: fg,
            letterSpacing: "0.14em",
          }}
        >
          {issue}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: fg,
          letterSpacing: "0.14em",
        }}
      >
        SKYNETLABS — EST. 2019
      </span>
    </div>
  );
}

/* ── Panel wrapper ───────────────────────────────────────── */
function Panel({
  children,
  bg = P.bg,
  style: extraStyle = {},
  inverted = false,
}: {
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
  inverted?: boolean;
}) {
  return (
    <div
      style={{
        width: "100vw",
        minWidth: "100vw",
        height: "100vh",
        background: bg,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...extraStyle,
      }}
    >
      {children}
      <Ticker inverted={inverted} />
    </div>
  );
}

/* ── Count-up number ─────────────────────────────────────── */
function CountUp({
  to,
  suffix = "",
  style: s = {},
}: {
  to: number;
  suffix?: string;
  style?: React.CSSProperties;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setVal(to);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          const ctrl = animate(0, to, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setVal(Math.round(v)),
          });
          return () => ctrl.stop();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, prefersReduced]);

  return (
    <span ref={ref} style={s}>
      {val}
      {suffix}
    </span>
  );
}

/* ── Clip-mask word reveal ───────────────────────────────── */
function RevealWord({
  word,
  delay = 0,
  style: s = {},
}: {
  word: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        ...s,
      }}
    >
      <motion.span
        style={{ display: "inline-block" }}
        initial={prefersReduced ? false : { y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {word}
      </motion.span>
    </span>
  );
}

/* ── Overprint ghost label (ITS device) ──────────────────── */
function Overprint({
  text,
  color = P.text,
  opacity = 0.05,
}: {
  text: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        right: -20,
        bottom: 36,
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: "clamp(120px, 18vw, 240px)",
        lineHeight: 1,
        color,
        opacity,
        letterSpacing: "-0.05em",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function SwissGazette() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const PANEL_COUNT = 6;

  const { scrollYProgress } = useScroll({ target: containerRef });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0px", "0px"] : ["0px", `-${(PANEL_COUNT - 1) * 100}vw`],
  );

  /* Active panel index for panel counter */
  const [activePanel, setActivePanel] = useState(0);
  useEffect(() => {
    if (prefersReduced) return;
    return scrollYProgress.on("change", (v) => {
      const idx = Math.round(v * (PANEL_COUNT - 1));
      setActivePanel(idx);
    });
  }, [scrollYProgress, prefersReduced]);

  return (
    <div
      className="root-47"
      style={{ fontFamily: "'Archivo Narrow', sans-serif", background: P.bg }}
    >
      <style>{`
        @import url('${FONTS_URL}');
        .root-47 * { box-sizing: border-box; margin: 0; padding: 0; }
        .root-47 a { color: inherit; text-decoration: none; }
        .root-47 a:focus-visible { outline: 2px solid ${P.accent}; outline-offset: 3px; }
        .root-47 img { display: block; }
        @media (prefers-reduced-motion: reduce) {
          .root-47 * { animation: none !important; transition: none !important; }
        }
        .cta-btn-47 {
          display: inline-block;
          background: ${P.accent};
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          padding: 14px 28px;
          text-transform: uppercase;
          transition: background 0.18s, color 0.18s;
        }
        .cta-btn-47:hover { background: #fff; color: ${P.accent}; }
        .cta-btn-47-lg {
          display: inline-block;
          background: ${P.accent};
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.15em;
          padding: 18px 36px;
          text-transform: uppercase;
          transition: background 0.18s, color 0.18s;
          align-self: flex-start;
        }
        .cta-btn-47-lg:hover { background: ${P.surface}; color: ${P.accent}; }
        .work-row-47 { transition: background 0.15s; }
        .work-row-47:hover { background: rgba(229,52,28,0.04); }
      `}</style>

      {/* Reading progress bar */}
      <ProgressBar progress={scrollYProgress} />

      {/* Skip nav */}
      <a
        href="#main-content"
        style={{
          position: "fixed",
          top: -100,
          left: 16,
          zIndex: 9999,
          background: P.accent,
          color: "#fff",
          padding: "8px 16px",
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
        }}
        onFocus={(e) => ((e.currentTarget as HTMLElement).style.top = "8px")}
        onBlur={(e) => ((e.currentTarget as HTMLElement).style.top = "-100px")}
      >
        Skip to content
      </a>

      {/* Panel counter — fixed top-right */}
      {!prefersReduced && (
        <div
          style={{
            position: "fixed",
            top: 40 + 12,
            right: 48,
            zIndex: 150,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: P.muted,
              letterSpacing: "0.15em",
            }}
          >
            {String(activePanel + 1).padStart(2, "0")}&nbsp;/&nbsp;
            {String(PANEL_COUNT).padStart(2, "0")}
          </span>
          <div
            style={{
              width: 48,
              height: 1,
              background: P.rule,
              opacity: 0.2,
            }}
          />
          <motion.div
            style={{
              height: 1,
              background: P.accent,
              width: `${((activePanel + 1) / PANEL_COUNT) * 48}px`,
              position: "absolute",
              right: 0,
            }}
          />
        </div>
      )}

      {/* Outer scroll container */}
      <div
        ref={containerRef}
        style={{
          height: prefersReduced ? "auto" : `${PANEL_COUNT * 100}vh`,
          position: "relative",
        }}
      >
        {/* Sticky viewport */}
        <div
          style={{
            position: prefersReduced ? "relative" : "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Horizontal track */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "row",
              x: prefersReduced ? 0 : x,
              willChange: "transform",
            }}
          >
            {/* ═══════════════════════════════════════════════════════
                PANEL 1 — HERO
            ═══════════════════════════════════════════════════════ */}
            <Panel>
              <Masthead issue="VOL. IX — NO. 47 — JUNE 2026" />
              <main
                id="main-content"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "0 48px",
                  paddingBottom: 36,
                }}
              >
                {/* Kicker row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 28,
                    paddingBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: P.accent,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        fontWeight: 700,
                      }}
                    >
                      Cover
                    </span>
                    <div
                      style={{
                        width: 32,
                        height: 1,
                        background: P.rule,
                        opacity: 0.25,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: P.muted,
                        letterSpacing: "0.14em",
                      }}
                    >
                      Independent Founder
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: P.muted,
                      textAlign: "right",
                      letterSpacing: "0.1em",
                      lineHeight: 1.9,
                    }}
                  >
                    WASEEM NASIR
                    <br />
                    SKYNETLABS
                  </div>
                </div>

                <Rule thick />
                <div style={{ height: 20 }} />

                {/* Grid: headline col + portrait col */}
                <div style={{ display: "flex", gap: 0, flex: 1 }}>
                  {/* LEFT — headline */}
                  <div
                    style={{
                      flex: "0 0 55%",
                      display: "flex",
                      flexDirection: "column",
                      paddingRight: 40,
                    }}
                  >
                    <h1
                      aria-label="180+ builds. 9 years. One operator."
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(60px, 8.5vw, 100px)",
                        lineHeight: 0.91,
                        letterSpacing: "-0.035em",
                        color: P.text,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <span style={{ display: "block" }}>
                        <RevealWord word="180+" delay={0.05} />
                      </span>
                      <span style={{ display: "block", color: P.accent }}>
                        <RevealWord word="builds." delay={0.18} />
                      </span>
                      <span style={{ display: "block" }}>
                        <RevealWord word="9&nbsp;years." delay={0.3} />
                      </span>
                      <span style={{ display: "block" }}>
                        <RevealWord word="One" delay={0.42} />
                      </span>
                      <span style={{ display: "block" }}>
                        <RevealWord word="operator." delay={0.54} />
                      </span>
                    </h1>

                    <div style={{ paddingBottom: 0 }}>
                      <Rule />
                      <div style={{ height: 14 }} />
                      <p
                        style={{
                          fontFamily: "'Archivo Narrow', sans-serif",
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: P.text,
                          maxWidth: 400,
                        }}
                      >
                        40+ clients. 9 countries. On the record since 2019. AI
                        &amp; automation systems that eliminate missed leads,
                        dead follow-ups, and manual ops.
                      </p>
                      <div style={{ height: 18 }} />
                      <a
                        href="https://skynetjoe.com/discovery-call"
                        className="cta-btn-47"
                      >
                        Book 30 min &rarr;
                      </a>
                    </div>
                  </div>

                  {/* Vertical column rule */}
                  <VRule thick />

                  {/* RIGHT — portrait */}
                  <div
                    style={{
                      flex: 1,
                      paddingLeft: 40,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <ColLabel text="Subject — Waseem Nasir" />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <img
                        src={IMAGES.hero}
                        alt="Waseem Nasir — founder of SkynetLabs"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top center",
                        }}
                      />
                    </div>
                    {/* Caption strip */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{ width: 16, height: 1, background: P.accent }}
                      />
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 8,
                          color: P.muted,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        Bali, 2026. Field documentation.
                      </span>
                    </div>
                  </div>
                </div>
              </main>
            </Panel>

            {/* ═══════════════════════════════════════════════════════
                PANEL 2 — PROOF / NUMBERS
            ═══════════════════════════════════════════════════════ */}
            <Panel bg={P.accent2} inverted>
              <Masthead issue="PROOF — BY THE NUMBERS" inverted />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px 48px",
                  paddingBottom: 36,
                }}
              >
                {/* Section kicker */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: P.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                    }}
                  >
                    02
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(255,255,255,0.12)",
                    }}
                  />
                </div>

                <Rule thick />
                <div style={{ height: 24 }} />

                {/* Section heading */}
                <h2
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(36px, 4.5vw, 58px)",
                    color: P.surface,
                    letterSpacing: "-0.03em",
                    lineHeight: 0.95,
                    marginBottom: 28,
                  }}
                >
                  Hard numbers.
                  <br />
                  <span style={{ color: P.accent }}>As issued.</span>
                </h2>

                {/* 2-col: 2x2 stat grid + image grid */}
                <div style={{ display: "flex", gap: 0, flex: 1 }}>
                  {/* Stats 2x2 */}
                  <div
                    style={{
                      flex: "0 0 45%",
                      paddingRight: 40,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "1fr 1fr",
                      gap: "1px",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  >
                    {[
                      {
                        to: 180,
                        suffix: "+",
                        label: "Builds shipped",
                        sub: "AI, automation, web",
                      },
                      {
                        to: 40,
                        suffix: "+",
                        label: "Clients served",
                        sub: "Across 9 countries",
                      },
                      {
                        to: 9,
                        suffix: "",
                        label: "Years operating",
                        sub: "Active since 2019",
                      },
                      {
                        to: 1,
                        suffix: "",
                        label: "Operator",
                        sub: "No agency overhead",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          background: P.accent2,
                          padding: "20px 22px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <CountUp
                          to={stat.to}
                          suffix={stat.suffix}
                          style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 900,
                            fontSize: "clamp(44px, 5vw, 68px)",
                            lineHeight: 1,
                            color: P.surface,
                            letterSpacing: "-0.04em",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontFamily: "'Archivo', sans-serif",
                              fontWeight: 600,
                              fontSize: 11,
                              color: P.surface,
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              marginBottom: 3,
                            }}
                          >
                            {stat.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Archivo Narrow', sans-serif",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {stat.sub}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      width: 1,
                      background: "rgba(255,255,255,0.1)",
                      flexShrink: 0,
                    }}
                  />

                  {/* Image grid 2x2 */}
                  <div
                    style={{
                      flex: 1,
                      paddingLeft: 40,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "1fr 1fr",
                      gap: 6,
                    }}
                  >
                    {[
                      IMAGES.work1,
                      IMAGES.work2,
                      IMAGES.work3,
                      IMAGES.cafe1,
                    ].map((src, i) => (
                      <div key={i} style={{ overflow: "hidden" }}>
                        <img
                          src={src}
                          alt={`Work evidence ${i + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            filter: "grayscale(20%)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            {/* ═══════════════════════════════════════════════════════
                PANEL 3 — SERVICES
            ═══════════════════════════════════════════════════════ */}
            <Panel>
              {/* Overprint ITS device */}
              <Overprint text="DEPLOY" color={P.text} opacity={0.04} />

              <Masthead issue="SERVICES — WHAT I DEPLOY" />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px 48px",
                  paddingBottom: 36,
                }}
              >
                {/* Kicker row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: P.accent,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    03
                  </span>
                  <div
                    style={{ flex: 1, height: 1, background: `${P.rule}20` }}
                  />
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: P.muted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Four disciplines. One operator.
                  </p>
                </div>
                <Rule thick />
                <div style={{ height: 24 }} />

                {/* Two-column layout */}
                <div style={{ display: "flex", flex: 1, gap: 0 }}>
                  {/* Left: section heading */}
                  <div
                    style={{
                      flex: "0 0 28%",
                      paddingRight: 32,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(32px, 3.5vw, 48px)",
                        letterSpacing: "-0.03em",
                        color: P.text,
                        lineHeight: 0.96,
                      }}
                    >
                      What I<br />
                      deploy
                      <br />
                      <span style={{ color: P.accent }}>for you.</span>
                    </h2>
                    <div style={{ marginTop: "auto" }}>
                      <Rule style={{ marginBottom: 12 }} />
                      <p
                        style={{
                          fontFamily: "'Archivo Narrow', sans-serif",
                          fontSize: 12,
                          color: P.muted,
                          lineHeight: 1.6,
                        }}
                      >
                        No subcontractors, no account managers. Every system
                        designed, built, and shipped by the same hands.
                      </p>
                    </div>
                  </div>

                  <VRule />

                  {/* Right: service rows */}
                  <div
                    style={{
                      flex: 1,
                      paddingLeft: 36,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {SERVICES.map((s, i) => (
                      <div key={s.no}>
                        <div
                          style={{
                            display: "flex",
                            gap: 24,
                            alignItems: "flex-start",
                            paddingTop: 12,
                            paddingBottom: 12,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: 9,
                              color: P.accent,
                              letterSpacing: "0.18em",
                              flexShrink: 0,
                              paddingTop: 6,
                              textTransform: "uppercase",
                            }}
                          >
                            {s.no}
                          </span>
                          <div style={{ flex: 1 }}>
                            <h3
                              style={{
                                fontFamily: "'Archivo', sans-serif",
                                fontWeight: 900,
                                fontSize: "clamp(22px, 2.5vw, 32px)",
                                letterSpacing: "-0.02em",
                                color: P.text,
                                lineHeight: 1.1,
                                marginBottom: 6,
                              }}
                            >
                              {s.title}
                            </h3>
                            <p
                              style={{
                                fontFamily: "'Archivo Narrow', sans-serif",
                                fontSize: 13,
                                color: P.muted,
                                lineHeight: 1.6,
                                maxWidth: 520,
                              }}
                            >
                              {s.body}
                            </p>
                          </div>
                        </div>
                        {i < SERVICES.length - 1 && <Rule />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom image strip */}
                <div
                  style={{
                    height: 120,
                    display: "flex",
                    gap: 6,
                    marginTop: 16,
                  }}
                >
                  {[
                    IMAGES.work4,
                    IMAGES.work5,
                    IMAGES.event,
                    IMAGES.travel,
                  ].map((src, i) => (
                    <div
                      key={i}
                      style={{
                        flex: i === 1 ? 2 : 1,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={src}
                        alt={`Field documentation ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            {/* ═══════════════════════════════════════════════════════
                PANEL 4 — SELECTED WORK
            ═══════════════════════════════════════════════════════ */}
            <Panel bg={P.surface}>
              {/* Overprint ITS device */}
              <Overprint text="WORK" color={P.text} opacity={0.035} />

              <Masthead issue="SELECTED WORK — 2019–2026" />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px 48px",
                  paddingBottom: 36,
                }}
              >
                {/* Kicker */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: P.accent,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    04
                  </span>
                  <div
                    style={{ flex: 1, height: 1, background: `${P.rule}20` }}
                  />
                </div>

                <Rule thick />
                <div style={{ height: 16 }} />

                {/* Header row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 160px 1fr 80px 60px",
                    gap: 20,
                    paddingBottom: 6,
                  }}
                >
                  {["Ref", "Client", "Scope", "Stack", "Year"].map((h) => (
                    <ColLabel key={h} text={h} />
                  ))}
                </div>
                <Rule />

                {/* Work rows */}
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {WORKS.map((w, i) => (
                    <div key={w.no} className="work-row-47">
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "36px 160px 1fr 80px 60px",
                          gap: 20,
                          padding: "15px 0",
                          alignItems: "start",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 11,
                            color: P.accent,
                            paddingTop: 1,
                          }}
                        >
                          {w.no}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 900,
                            fontSize: 14,
                            color: P.text,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {w.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Archivo Narrow', sans-serif",
                            fontSize: 13,
                            color: P.muted,
                            lineHeight: 1.5,
                          }}
                        >
                          {w.desc}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 9,
                            color: P.accent,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            paddingTop: 2,
                          }}
                        >
                          {w.tag}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 9,
                            color: P.muted,
                            paddingTop: 2,
                          }}
                        >
                          {w.year}
                        </span>
                      </div>
                      {i < WORKS.length - 1 && <Rule />}
                    </div>
                  ))}
                </div>

                {/* Manifesto pull-quote */}
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    marginTop: "auto",
                    borderTop: `3px solid ${P.accent}`,
                    paddingTop: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 900,
                        fontStyle: "italic",
                        fontSize: "clamp(14px, 1.6vw, 20px)",
                        color: P.text,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.3,
                        maxWidth: 600,
                      }}
                    >
                      "The grid is mathematically real. Consistent baseline
                      across horizontal panels is the hardest thing to fake.
                      Templates can't hold it."
                    </p>
                  </div>
                  <div
                    style={{
                      alignSelf: "flex-end",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: P.muted,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    W. Nasir
                  </div>
                </div>
              </div>
            </Panel>

            {/* ═══════════════════════════════════════════════════════
                PANEL 5 — ABOUT
            ═══════════════════════════════════════════════════════ */}
            <Panel>
              <Overprint text="OPERATOR" color={P.text} opacity={0.035} />

              <Masthead issue="PROFILE — THE OPERATOR" />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 0,
                  padding: "28px 0 36px 48px",
                }}
              >
                {/* Left column */}
                <div
                  style={{
                    flex: "0 0 42%",
                    display: "flex",
                    flexDirection: "column",
                    paddingRight: 40,
                  }}
                >
                  {/* Kicker */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: P.accent,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                      }}
                    >
                      05
                    </span>
                    <div
                      style={{ flex: 1, height: 1, background: `${P.rule}20` }}
                    />
                  </div>

                  <Rule thick />
                  <div style={{ height: 20 }} />

                  <h2
                    style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(32px, 3.5vw, 48px)",
                      letterSpacing: "-0.03em",
                      color: P.text,
                      lineHeight: 0.96,
                      marginBottom: 20,
                    }}
                  >
                    Remote.
                    <br />
                    Systematic.
                    <br />
                    <span style={{ color: P.accent }}>Accountable.</span>
                  </h2>

                  {/* Pull quote */}
                  <div
                    style={{
                      borderLeft: `3px solid ${P.accent}`,
                      paddingLeft: 16,
                      marginBottom: 20,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 600,
                        fontStyle: "italic",
                        fontSize: "clamp(13px, 1.4vw, 16px)",
                        color: P.text,
                        lineHeight: 1.45,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      "The brief doesn't get diluted through layers. You spoke
                      with the builder. You got the builder."
                    </p>
                  </div>

                  <div
                    style={{
                      fontFamily: "'Archivo Narrow', sans-serif",
                      fontSize: 13,
                      lineHeight: 1.8,
                      color: P.text,
                    }}
                  >
                    <p>
                      Waseem Nasir. Independent founder. SkynetLabs operates
                      from Bali and Lahore — no office, no retainer bloat, no
                      agency markup.
                    </p>
                    <br />
                    <p>
                      Since 2019, every system is designed, built, deployed and
                      maintained by the same person you spoke with.
                    </p>
                    <br />
                    <p style={{ color: P.muted }}>
                      Stack: n8n &middot; Next.js &middot; WhatsApp Business API
                      &middot; AEO &middot; WordPress &middot; Vercel &middot;
                      Hostinger
                    </p>
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <Rule style={{ marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 24 }}>
                      <a
                        href="https://skynetjoe.com/discovery-call"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: P.accent,
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                        }}
                      >
                        Book Call &rarr;
                      </a>
                      <a
                        href="https://github.com/waseemnasir2k26"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: P.muted,
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                        }}
                      >
                        GitHub &rarr;
                      </a>
                    </div>
                  </div>
                </div>

                <VRule />

                {/* Right image triptych */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    paddingLeft: 4,
                  }}
                >
                  <div style={{ flex: "0 0 58%", overflow: "hidden" }}>
                    <img
                      src={IMAGES.about1}
                      alt="Waseem Nasir — balcony portrait"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, display: "flex", gap: 4 }}>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <img
                        src={IMAGES.about2}
                        alt="Waseem Nasir — travel"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <img
                        src={IMAGES.about3}
                        alt="Waseem Nasir — working"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            {/* ═══════════════════════════════════════════════════════
                PANEL 6 — CTA / CONTACT
            ═══════════════════════════════════════════════════════ */}
            <Panel bg={P.text} inverted>
              <Masthead issue="CONTACT — BOOK THE OPERATOR" inverted />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px 48px",
                  paddingBottom: 36,
                }}
              >
                {/* Kicker */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: P.accent,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    06
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                </div>

                <div
                  style={{ height: 2, background: P.accent, width: "100%" }}
                />
                <div style={{ height: 28 }} />

                <div style={{ display: "flex", gap: 0, flex: 1 }}>
                  {/* CTA left */}
                  <div
                    style={{
                      flex: "0 0 55%",
                      paddingRight: 48,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(48px, 6vw, 80px)",
                        letterSpacing: "-0.04em",
                        color: P.surface,
                        lineHeight: 0.93,
                        marginBottom: 28,
                      }}
                    >
                      <RevealWord
                        word="30&nbsp;minutes."
                        style={{ color: P.surface }}
                      />
                      <br />
                      <RevealWord
                        word="No&nbsp;pitch&nbsp;deck."
                        delay={0.1}
                        style={{ color: P.surface }}
                      />
                      <br />
                      <RevealWord
                        word="Just&nbsp;scope."
                        delay={0.2}
                        style={{ color: P.accent }}
                      />
                    </h2>

                    <p
                      style={{
                        fontFamily: "'Archivo Narrow', sans-serif",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: P.muted,
                        maxWidth: 380,
                        marginBottom: 28,
                      }}
                    >
                      Tell me the bottleneck. I'll tell you if automation solves
                      it and what it costs. No retainer until there's a clear
                      brief.
                    </p>

                    <a
                      href="https://skynetjoe.com/discovery-call"
                      className="cta-btn-47-lg"
                    >
                      skynetjoe.com/discovery-call
                    </a>

                    <div style={{ marginTop: "auto" }}>
                      <div
                        style={{
                          height: 1,
                          background: "rgba(255,255,255,0.12)",
                          marginBottom: 16,
                        }}
                      />
                      <div style={{ display: "flex", gap: 40 }}>
                        {[
                          ["Location", "Bali / Lahore — Remote"],
                          ["GitHub", "waseemnasir2k26"],
                          ["Since", "2019"],
                        ].map(([label, val]) => (
                          <div key={label}>
                            <ColLabel text={label} light />
                            <span
                              style={{
                                fontFamily: "'Archivo Narrow', sans-serif",
                                fontSize: 12,
                                color: P.surface,
                              }}
                            >
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: 1,
                      background: "rgba(255,255,255,0.12)",
                      flexShrink: 0,
                    }}
                  />

                  {/* Right: portrait + caption */}
                  <div
                    style={{
                      flex: 1,
                      paddingLeft: 48,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <img
                        src={IMAGES.portrait}
                        alt="Waseem Nasir — founder portrait"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top center",
                        }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          height: 1,
                          background: "rgba(255,255,255,0.15)",
                          marginBottom: 10,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 8,
                          color: "rgba(255,255,255,0.35)",
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                        }}
                      >
                        Waseem Nasir — SkynetLabs — Est. 2019
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer baseline */}
              <footer
                style={{
                  padding: "14px 48px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 8,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  The Swiss Gazette — SkynetLabs — 2026
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 8,
                    color: P.accent,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  180+ builds / 40+ clients / 9 countries / since 2019
                </span>
              </footer>
            </Panel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
