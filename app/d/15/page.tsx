"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/* ─── palette & tokens ─────────────────────────────────────── */
const C = {
  bg: "#0B0B0C",
  surface: "#16161A",
  text: "#ECECEC",
  muted: "#6E6E78",
  accent: "#C6FF3D",
  accent2: "#B36BFF",
};

/* ─── services list ─────────────────────────────────────────── */
const SERVICES = [
  {
    code: "SVC-01",
    label: "ai agent pipelines",
    desc: "n8n + llm orchestration. lead capture, enrichment, follow-up. zero missed touchpoints.",
  },
  {
    code: "SVC-02",
    label: "voice & whatsapp bots",
    desc: "24/7 receptionist layer. books calls, qualifies leads, replies in natural language.",
  },
  {
    code: "SVC-03",
    label: "aeo + web infra",
    desc: "answer-engine optimisation. next.js. systems that surface in ai search results, not just google.",
  },
  {
    code: "SVC-04",
    label: "crm & ops automation",
    desc: "ghl, make, zapier. kill the manual glue work between your tools.",
  },
  {
    code: "SVC-05",
    label: "data pipelines",
    desc: "scrape → clean → store → act. headless extraction, structured outputs, scheduled triggers.",
  },
  {
    code: "SVC-06",
    label: "rapid prototyping",
    desc: "idea → deployed mvp in days. not months. not a slide deck. a working thing.",
  },
];

/* ─── selected work ─────────────────────────────────────────── */
const WORK = [
  {
    id: "W-01",
    client: "freight ops / us",
    output: "ai voice receptionist",
    stack: "n8n / vapi / ghl",
    status: "live",
  },
  {
    id: "W-02",
    client: "physio clinic",
    output: "$27 funnel + stripe booking",
    stack: "next.js / wp / stripe",
    status: "live",
  },
  {
    id: "W-03",
    client: "travel platform",
    output: "trip-input cms + cpt gate",
    stack: "wp / rest api / ctm",
    status: "live",
  },
  {
    id: "W-04",
    client: "saas (sg)",
    output: "whatsapp lead qualification bot",
    stack: "n8n / twilio / openai",
    status: "live",
  },
  {
    id: "W-05",
    client: "agency (uk)",
    output: "bulk email automation + crm sync",
    stack: "n8n / gmail / airtable",
    status: "live",
  },
  {
    id: "W-06",
    client: "e-commerce (au)",
    output: "abandoned cart recovery agent",
    stack: "n8n / shopify / openai",
    status: "live",
  },
];

/* ─── stats ─────────────────────────────────────────────────── */
const STATS = [
  { val: "180+", label: "builds shipped" },
  { val: "40+", label: "clients" },
  { val: "9", label: "countries" },
  { val: "2019", label: "operating since" },
];

/* ─── chromatic aberration hook ────────────────────────────── */
function useChromatic(reduced: boolean) {
  const { scrollY } = useScroll();
  const velRef = useRef(0);
  const prevY = useRef(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const unsub = scrollY.on("change", (y) => {
      const v = Math.abs(y - prevY.current);
      prevY.current = y;
      velRef.current = v;
      const clamped = Math.min(v * 0.6, 8);
      setOffset(clamped);
    });
    // decay back to 0
    const interval = setInterval(() => {
      setOffset((o) => (o > 0.1 ? o * 0.78 : 0));
    }, 40);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [scrollY, reduced]);

  return offset;
}

/* ─── per-letter chromatic headline ────────────────────────── */
function ChromaticHeadline({ text, offset }: { text: string; offset: number }) {
  return (
    <span
      aria-label={text}
      style={{ display: "inline-block", position: "relative" }}
    >
      {/* red channel */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${offset}px, 0)`,
          color: "rgba(255,40,40,0.55)",
          mixBlendMode: "screen",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
          willChange: "transform",
        }}
      >
        {text}
      </span>
      {/* blue channel */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(-${offset}px, 0)`,
          color: "rgba(40,120,255,0.55)",
          mixBlendMode: "screen",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
          willChange: "transform",
        }}
      >
        {text}
      </span>
      {/* base */}
      <span style={{ color: C.text, position: "relative" }}>{text}</span>
    </span>
  );
}

/* ─── film grain SVG ────────────────────────────────────────── */
function FilmGrain() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9,
        opacity: 0.18,
        mixBlendMode: "overlay",
      }}
    >
      <filter id="grain-15">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="multiply" />
        <animate
          attributeName="baseFrequency"
          from="0.72"
          to="0.74"
          dur="0.08s"
          repeatCount="indefinite"
          calcMode="discrete"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-15)" />
    </svg>
  );
}

/* ─── hairline rule ─────────────────────────────────────────── */
function HairlineRule({ accent = false }: { accent?: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background: accent ? C.accent : C.muted,
        opacity: accent ? 0.6 : 0.25,
      }}
    />
  );
}

/* ─── label chip ─────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: C.accent,
        background: `${C.accent}18`,
        border: `1px solid ${C.accent}40`,
        padding: "3px 8px",
        borderRadius: "2px",
      }}
    >
      {children}
    </span>
  );
}

/* ─── main component ─────────────────────────────────────────── */
export default function AcidTerminal() {
  const reduced = useReducedMotion() ?? false;
  const offset = useChromatic(reduced);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .root-15 {
          font-family: 'Space Grotesk', sans-serif;
          background: ${C.bg};
          color: ${C.text};
          min-height: 100vh;
          position: relative;
          z-index: 2;
        }
        .root-15 * { box-sizing: border-box; }
        .root-15 a:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
          border-radius: 2px;
        }
        .root-15 h1, .root-15 h2 {
          font-family: 'Anton', sans-serif;
          letter-spacing: 0.01em;
          line-height: 0.95;
          text-transform: lowercase;
          font-weight: 400;
        }
        .root-15 .mono { font-family: 'JetBrains Mono', monospace; }

        /* data row hover */
        .root-15 .data-row {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 80px;
          gap: 0 24px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(110,110,120,0.18);
          align-items: center;
          transition: background 0.15s;
          cursor: default;
        }
        .root-15 .data-row:hover { background: rgba(198,255,61,0.04); }

        /* service block */
        .root-15 .svc-block {
          padding: 20px 0;
          border-bottom: 1px solid rgba(110,110,120,0.18);
          display: grid;
          grid-template-columns: 80px 1fr 1fr;
          gap: 0 24px;
          align-items: start;
          transition: background 0.15s;
          cursor: default;
        }
        .root-15 .svc-block:hover { background: rgba(179,107,255,0.04); }

        /* stat card */
        .root-15 .stat-card {
          border: 1px solid rgba(198,255,61,0.2);
          padding: 24px 20px;
          background: ${C.surface};
          transition: border-color 0.2s;
        }
        .root-15 .stat-card:hover { border-color: ${C.accent}; }

        /* cta button */
        .root-15 .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: ${C.accent};
          color: #000;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: lowercase;
          padding: 14px 28px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }
        .root-15 .cta-btn:hover { background: #d9ff5a; transform: translateY(-1px); }
        .root-15 .cta-btn:active { transform: translateY(0); }

        /* scroll progress rail */
        .root-15 .progress-rail {
          position: fixed;
          top: 0; left: 0;
          height: 2px;
          background: ${C.accent};
          transform-origin: left;
          z-index: 100;
          will-change: transform;
        }

        /* photo grid */
        .root-15 .photo-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 640px) {
          .root-15 .data-row {
            grid-template-columns: 60px 1fr;
            grid-template-rows: auto auto;
          }
          .root-15 .svc-block {
            grid-template-columns: 60px 1fr;
          }
          .root-15 .photo-strip {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .root-15 * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="root-15">
        {/* film grain overlay */}
        <FilmGrain />

        {/* scroll progress rail */}
        <motion.div
          className="progress-rail"
          style={{ scaleX }}
          aria-hidden="true"
        />

        {/* skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            top: -40,
            left: 8,
            color: C.bg,
            background: C.accent,
            padding: "4px 8px",
            fontSize: 12,
            zIndex: 200,
            transition: "top 0.2s",
            fontFamily: "'JetBrains Mono', monospace",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.top = "8px";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.top = "-40px";
          }}
        >
          skip to content
        </a>

        {/* ── nav ───────────────────────────────────────────── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: `1px solid rgba(110,110,120,0.2)`,
            background: `${C.bg}ee`,
            backdropFilter: "blur(12px)",
            padding: "0 clamp(20px,5vw,80px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 52,
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 11, color: C.accent, letterSpacing: "0.12em" }}
            >
              skynetlabs / waseem-nasir
            </span>
            <nav
              aria-label="primary"
              style={{ display: "flex", gap: 28, alignItems: "center" }}
            >
              {["services", "work", "about", "contact"].map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    textDecoration: "none",
                    letterSpacing: "0.1em",
                    textTransform: "lowercase",
                  }}
                >
                  {s}
                </a>
              ))}
              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-btn"
                style={{ padding: "8px 16px", fontSize: 11 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                book call
              </a>
            </nav>
          </div>
        </header>

        {/* ── hero ──────────────────────────────────────────── */}
        <main id="main-content">
          <section
            style={{
              padding:
                "clamp(60px,10vw,120px) clamp(20px,5vw,80px) clamp(40px,6vw,80px)",
              borderBottom: `1px solid rgba(110,110,120,0.2)`,
            }}
          >
            {/* system tag */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                marginBottom: 32,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Label>sys.boot</Label>
              <span className="mono" style={{ fontSize: 10, color: C.muted }}>
                waseem.nasir@skynetlabs:~$ ./init
              </span>
            </motion.div>

            {/* main headline */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1
                style={{
                  fontSize: "clamp(52px, 9vw, 130px)",
                  margin: "0 0 20px",
                  maxWidth: "14ch",
                }}
              >
                <ChromaticHeadline
                  text="i build the machines that do your busywork while you sleep."
                  offset={offset}
                />
              </h1>
            </motion.div>

            {/* subhead */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 18px)",
                color: C.muted,
                maxWidth: "55ch",
                lineHeight: 1.55,
                margin: "0 0 40px",
              }}
            >
              i ship the agent, not the slide deck.{" "}
              <span style={{ color: C.text }}>180+ builds since 2019.</span>{" "}
              remote from bali + lahore. operational in 9 countries.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>→</span> book 30-min call
              </a>
              <a
                href="https://github.com/waseemnasir2k26"
                className="mono"
                style={{
                  fontSize: 11,
                  color: C.muted,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.muted}40`,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/waseemnasir2k26
              </a>
            </motion.div>
          </section>

          {/* ── stats grid ───────────────────────────────────── */}
          <section
            aria-label="proof numbers"
            style={{
              padding: "0 clamp(20px,5vw,80px)",
              borderBottom: `1px solid rgba(110,110,120,0.2)`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "1px",
                margin: "0 -clamp(20px,5vw,80px)",
              }}
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="stat-card"
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                >
                  <div
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "clamp(36px, 5vw, 64px)",
                      color: C.accent,
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: C.muted,
                      letterSpacing: "0.1em",
                      textTransform: "lowercase",
                    }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── services ─────────────────────────────────────── */}
          <section
            id="services"
            aria-label="services"
            style={{ padding: "clamp(60px,8vw,100px) clamp(20px,5vw,80px)" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: "clamp(28px,4vw,48px)", margin: 0 }}>
                what i do
              </h2>
              <Label>6 systems</Label>
            </div>
            <HairlineRule accent />

            {/* column headers */}
            <div
              className="svc-block"
              style={{ paddingTop: 8, paddingBottom: 8, cursor: "default" }}
            >
              <span className="mono" style={{ fontSize: 10, color: C.muted }}>
                id
              </span>
              <span className="mono" style={{ fontSize: 10, color: C.muted }}>
                system
              </span>
              <span className="mono" style={{ fontSize: 10, color: C.muted }}>
                output
              </span>
            </div>
            <HairlineRule />

            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.code}
                className="svc-block"
                initial={reduced ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: C.accent,
                    letterSpacing: "0.08em",
                  }}
                >
                  {svc.code}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(14px,1.4vw,16px)",
                    color: C.text,
                  }}
                >
                  {svc.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(12px,1.2vw,14px)",
                    color: C.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {svc.desc}
                </span>
              </motion.div>
            ))}
          </section>

          {/* ── selected work ────────────────────────────────── */}
          <section
            id="work"
            aria-label="selected work"
            style={{
              padding: "clamp(60px,8vw,100px) clamp(20px,5vw,80px)",
              borderTop: `1px solid rgba(110,110,120,0.2)`,
              background: C.surface,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: "clamp(28px,4vw,48px)", margin: 0 }}>
                selected work
              </h2>
              <span className="mono" style={{ fontSize: 10, color: C.muted }}>
                all builds. no decks.
              </span>
            </div>
            <HairlineRule accent />

            {/* table header */}
            <div
              className="data-row"
              style={{ paddingTop: 8, paddingBottom: 8 }}
            >
              {["id", "client", "output", "status"].map((h) => (
                <span
                  key={h}
                  className="mono"
                  style={{ fontSize: 10, color: C.muted }}
                >
                  {h}
                </span>
              ))}
            </div>

            {WORK.map((w, i) => (
              <motion.div
                key={w.id}
                className="data-row"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 10, color: C.accent2 }}
                >
                  {w.id}
                </span>
                <span
                  style={{ fontSize: "clamp(12px,1.3vw,14px)", color: C.text }}
                >
                  {w.client}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "clamp(12px,1.3vw,14px)",
                      color: C.text,
                      marginBottom: 2,
                    }}
                  >
                    {w.output}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 10, color: C.muted }}
                  >
                    {w.stack}
                  </div>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: C.accent,
                    letterSpacing: "0.1em",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      background: C.accent,
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                  {w.status}
                </span>
              </motion.div>
            ))}
          </section>

          {/* ── photo strip ──────────────────────────────────── */}
          <section aria-label="field work" style={{ lineHeight: 0 }}>
            <div className="photo-strip">
              {[
                {
                  file: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                  alt: "waseem typing at bali terrace cafe with laptop and latte",
                },
                {
                  file: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
                  alt: "waseem typing at night cafe, backlit keyboard, candid shot",
                },
                {
                  file: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
                  alt: "waseem with dual laptops showing analytics dashboard and coffee",
                },
                {
                  file: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
                  alt: "waseem at coworking desk, focused, candid phone shot",
                },
                {
                  file: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                  alt: "waseem smiling at rooftop cafe with laptop and rainbow mug",
                },
                {
                  file: "CAFE-WORK-2026-06-01-rooftop-laptop-orange-juice-foreground.jpg",
                  alt: "waseem at rooftop with laptop and orange juice in foreground",
                },
              ].map((img, i) => (
                <motion.div
                  key={img.file}
                  initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  style={{ overflow: "hidden", aspectRatio: "1/1" }}
                >
                  <img
                    src={`/img/pro/${img.file}`}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "saturate(0.85) contrast(1.08)",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── about ────────────────────────────────────────── */}
          <section
            id="about"
            aria-label="about waseem"
            style={{
              padding: "clamp(60px,8vw,100px) clamp(20px,5vw,80px)",
              borderTop: `1px solid rgba(110,110,120,0.2)`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(32px,5vw,80px)",
                alignItems: "start",
              }}
            >
              {/* portrait */}
              <motion.div
                initial={reduced ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                style={{ position: "relative" }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                  alt="waseem nasir, arms crossed, confident pose"
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    display: "block",
                    filter: "contrast(1.05) saturate(0.8)",
                  }}
                />
                {/* overlay label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    background: `${C.bg}cc`,
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${C.accent}30`,
                    padding: "8px 14px",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: C.accent,
                      letterSpacing: "0.1em",
                    }}
                  >
                    waseem nasir
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: C.muted }}>
                    founder, skynetlabs
                  </div>
                </div>
              </motion.div>

              {/* text */}
              <motion.div
                initial={reduced ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1 }}
              >
                <Label>about</Label>
                <h2
                  style={{
                    fontSize: "clamp(28px,4vw,52px)",
                    margin: "20px 0 24px",
                  }}
                >
                  systems that run while you're asleep
                </h2>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {[
                    "i'm an independent builder. not an agency with 40 layers. just someone who's been shipping working systems since 2019.",
                    "i work with founders and operators who are done with the manual glue. missed leads, dead follow-ups, ops that eat 3 hours of every day — these are solvable.",
                    "n8n, next.js, openai, vapi, ghl. the stack changes per problem. the outcome doesn't: your operations run without you babysitting them.",
                    "180+ builds shipped. 40+ clients. 9 countries. remote from bali and lahore.",
                  ].map((p, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "clamp(13px,1.4vw,15px)",
                        color: C.muted,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* tech stack */}
                <div style={{ marginTop: 32 }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      marginBottom: 12,
                      letterSpacing: "0.1em",
                    }}
                  >
                    stack
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[
                      "n8n",
                      "next.js",
                      "openai",
                      "vapi",
                      "ghl",
                      "make",
                      "stripe",
                      "supabase",
                      "wp",
                      "vercel",
                    ].map((t) => (
                      <span
                        key={t}
                        className="mono"
                        style={{
                          fontSize: 10,
                          color: C.text,
                          background: C.surface,
                          border: `1px solid rgba(110,110,120,0.3)`,
                          padding: "4px 8px",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── extra photos row ─────────────────────────────── */}
          <section
            aria-label="more photos"
            style={{
              padding: "0 clamp(20px,5vw,80px)",
              paddingBottom: "clamp(40px,6vw,80px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 2,
              }}
            >
              {[
                {
                  file: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                  alt: "waseem at nusa penida cliffs arms spread",
                },
                {
                  file: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-phone-focus.jpg",
                  alt: "waseem focused on phone at garden cafe in blue polo",
                },
                {
                  file: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                  alt: "waseem at night coworking space with team and laptops",
                },
                {
                  file: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                  alt: "waseem standing in black outfit next to neon limit quote sign",
                },
              ].map((img) => (
                <div
                  key={img.file}
                  style={{ aspectRatio: "1/1", overflow: "hidden" }}
                >
                  <img
                    src={`/img/pro/${img.file}`}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: "saturate(0.75) contrast(1.1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── contact / CTA ─────────────────────────────────── */}
          <section
            id="contact"
            aria-label="contact"
            style={{
              padding: "clamp(80px,10vw,140px) clamp(20px,5vw,80px)",
              borderTop: `1px solid rgba(198,255,61,0.25)`,
              background: C.surface,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* bg accent text */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: "-0.05em",
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(120px,18vw,260px)",
                color: `${C.accent}06`,
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
                textTransform: "lowercase",
              }}
            >
              book
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <Label>start here</Label>
              <h2
                style={{
                  fontSize: "clamp(36px,6vw,96px)",
                  margin: "20px 0 16px",
                  maxWidth: "14ch",
                }}
              >
                ready to kill the busywork?
              </h2>
              <p
                style={{
                  fontSize: "clamp(14px,1.5vw,17px)",
                  color: C.muted,
                  maxWidth: "48ch",
                  lineHeight: 1.65,
                  marginBottom: 40,
                }}
              >
                30 minutes. no sales pitch. we map the exact automation that
                buys back the most time in your ops. if it's not a fit, i'll
                tell you.
              </p>

              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-btn"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, padding: "16px 36px" }}
              >
                <span>→</span> book 30-min discovery call
              </a>

              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                <span className="mono" style={{ fontSize: 11, color: C.muted }}>
                  bali · lahore · remote
                </span>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    textDecoration: "none",
                    borderBottom: `1px solid ${C.muted}40`,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/waseemnasir2k26
                </a>
              </div>
            </motion.div>
          </section>

          {/* ── footer ────────────────────────────────────────── */}
          <footer
            style={{
              padding: "20px clamp(20px,5vw,80px)",
              borderTop: `1px solid rgba(110,110,120,0.18)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span className="mono" style={{ fontSize: 10, color: C.muted }}>
              skynetlabs © 2019–2026 / waseem nasir
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="mono"
                style={{ fontSize: 10, color: C.muted, textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                skynetjoe.com
              </a>
              <a
                href="https://github.com/waseemnasir2k26"
                className="mono"
                style={{ fontSize: 10, color: C.muted, textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                github
              </a>
            </div>
            <span
              className="mono"
              style={{ fontSize: 10, color: `${C.muted}70` }}
            >
              d/15 · acid-terminal · acid graphics / cyber-grotesk
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}
