"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/* ─── SCOPED STYLES ────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Michroma&family=Chakra+Petch:wght@400;500&family=VT323&display=swap');

.va-root {
  font-family: 'Chakra Petch', sans-serif;
  background: #07070F;
  color: #E6E6FF;
  overflow-x: hidden;
}

/* ── DITHER PATTERN ── */
.va-dither {
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%2300E5FF' opacity='0.08'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%2300E5FF' opacity='0.08'/%3E%3C/svg%3E");
  background-size: 4px 4px;
}

.va-dither-dense {
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='1' height='1' fill='%2300E5FF' opacity='0.18'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%2300E5FF' opacity='0.06'/%3E%3Crect x='2' y='0' width='1' height='1' fill='%2300E5FF' opacity='0.12'/%3E%3Crect x='3' y='3' width='1' height='1' fill='%2300E5FF' opacity='0.04'/%3E%3Crect x='0' y='2' width='1' height='1' fill='%2300E5FF' opacity='0.10'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%2300E5FF' opacity='0.14'/%3E%3C/svg%3E");
  background-size: 4px 4px;
}

/* ── CRT SCANLINES ── */
.va-scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,229,255,0.025) 2px,
    rgba(0,229,255,0.025) 4px
  );
  pointer-events: none;
  z-index: 2;
}

/* ── HUD CORNERS ── */
.va-hud {
  position: relative;
}
.va-hud::before,
.va-hud::after,
.va-hud .hud-br,
.va-hud .hud-bl {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  pointer-events: none;
  z-index: 5;
}
.va-hud::before {
  top: 0; left: 0;
  border-top: 2px solid #00E5FF;
  border-left: 2px solid #00E5FF;
}
.va-hud::after {
  top: 0; right: 0;
  border-top: 2px solid #00E5FF;
  border-right: 2px solid #00E5FF;
}
.va-hud .hud-br {
  content: '';
  bottom: 0; right: 0;
  border-bottom: 2px solid #00E5FF;
  border-right: 2px solid #00E5FF;
  width: 18px; height: 18px;
  position: absolute;
}
.va-hud .hud-bl {
  content: '';
  bottom: 0; left: 0;
  border-bottom: 2px solid #00E5FF;
  border-left: 2px solid #00E5FF;
  width: 18px; height: 18px;
  position: absolute;
}

/* ── BARREL DISTORT HOVER ── */
@media (hover: hover) {
  .va-barrel-hover {
    transition: filter 0.3s ease, transform 0.3s ease;
  }
  .va-barrel-hover:hover {
    filter: url('#barrel');
    transform: scale(1.01);
  }
}

/* ── GLITCH TEXT ── */
@keyframes va-glitch {
  0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-2px,0); }
  20%       { clip-path: inset(30% 0 40% 0); transform: translate(2px,0); }
  40%       { clip-path: inset(70% 0 10% 0); transform: translate(-1px,0); }
  60%       { clip-path: inset(50% 0 30% 0); transform: translate(1px,0); }
  80%       { clip-path: inset(10% 0 80% 0); transform: translate(-2px,0); }
}

.va-glitch {
  position: relative;
}
.va-glitch::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  color: #FF2E97;
  animation: va-glitch 4s infinite;
  opacity: 0.7;
}
.va-glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  color: #00E5FF;
  animation: va-glitch 4s infinite 0.15s;
  opacity: 0.5;
}

/* ── SCROLLBAR ── */
.va-scroll-container::-webkit-scrollbar {
  height: 4px;
  background: #07070F;
}
.va-scroll-container::-webkit-scrollbar-thumb {
  background: #00E5FF;
}

/* ── MONO LABEL ── */
.va-mono {
  font-family: 'VT323', monospace;
  letter-spacing: 0.08em;
}

/* ── DISPLAY FONT ── */
.va-display {
  font-family: 'Michroma', sans-serif;
}

/* ── PANEL BORDER ── */
.va-panel {
  border-right: 1px solid rgba(0,229,255,0.15);
}

/* ── BLINK CURSOR ── */
@keyframes va-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.va-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #00E5FF;
  vertical-align: text-bottom;
  animation: va-blink 1s step-end infinite;
}

/* ── STAT READOUT ── */
.va-stat-readout {
  border: 1px solid rgba(0,229,255,0.3);
  background: rgba(0,229,255,0.04);
  padding: 12px 16px;
  position: relative;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}

/* ── TAG ── */
.va-tag {
  font-family: 'VT323', monospace;
  font-size: 13px;
  color: #00E5FF;
  border: 1px solid rgba(0,229,255,0.4);
  padding: 2px 8px;
  letter-spacing: 0.1em;
  background: rgba(0,229,255,0.06);
}

/* ── CTA BUTTON ── */
.va-cta {
  font-family: 'Michroma', sans-serif;
  font-size: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #07070F;
  background: #00E5FF;
  padding: 14px 32px;
  border: none;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: background 0.2s, color 0.2s;
  position: relative;
}
.va-cta:hover {
  background: #FF2E97;
  color: #fff;
}
.va-cta:focus-visible {
  outline: 2px solid #FF2E97;
  outline-offset: 3px;
}

/* ── SECONDARY CTA ── */
.va-cta-ghost {
  font-family: 'Michroma', sans-serif;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00E5FF;
  background: transparent;
  padding: 12px 28px;
  border: 1px solid #00E5FF;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
.va-cta-ghost:hover {
  background: rgba(0,229,255,0.1);
}

/* ── PHOTO FRAME ── */
.va-photo {
  position: relative;
  overflow: hidden;
}
.va-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.va-photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,229,255,0.08) 0%, transparent 60%);
  pointer-events: none;
}

/* ── TICKER ── */
@keyframes va-ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.va-ticker-inner {
  display: flex;
  gap: 0;
  animation: va-ticker 22s linear infinite;
  white-space: nowrap;
}
@media (prefers-reduced-motion: reduce) {
  .va-ticker-inner { animation: none; }
  .va-glitch::before, .va-glitch::after { animation: none; }
  .va-cursor { animation: none; }
}

/* ── HORIZONTAL SCROLL NAV ── */
.va-nav-track {
  display: flex;
  gap: 2px;
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
.va-nav-dot {
  width: 6px;
  height: 6px;
  background: rgba(0,229,255,0.25);
  border: 1px solid rgba(0,229,255,0.5);
  cursor: pointer;
  transition: background 0.2s;
}
.va-nav-dot.active {
  background: #00E5FF;
}

/* ── GRID LINES ── */
.va-grid-bg {
  background-image:
    linear-gradient(rgba(0,229,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ── SERVICE CARD ── */
.va-service-card {
  border: 1px solid rgba(0,229,255,0.2);
  background: rgba(17,17,42,0.9);
  padding: 24px 20px;
  position: relative;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  transition: border-color 0.2s, background 0.2s;
}
.va-service-card:hover {
  border-color: rgba(0,229,255,0.6);
  background: rgba(17,17,42,1);
}

/* ── MISSION LOG LINE ── */
.va-log-line {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,229,255,0.08);
}
.va-log-ts {
  font-family: 'VT323', monospace;
  font-size: 14px;
  color: #5A5A8C;
  flex-shrink: 0;
  width: 72px;
}
.va-log-status {
  font-family: 'VT323', monospace;
  font-size: 14px;
  flex-shrink: 0;
  width: 60px;
}

/* ── SCROLLABLE HORIZONTAL WRAPPER ── */
.va-h-scroll {
  display: flex;
  width: max-content;
}
.va-h-panel {
  width: 100vw;
  min-height: 100vh;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
`;

/* ─── HUD CORNER SPANS ─────────────────────────────────────────────────── */
function HudCorners() {
  return (
    <>
      <span className="hud-br" aria-hidden="true" />
      <span className="hud-bl" aria-hidden="true" />
    </>
  );
}

/* ─── STAT CARD ────────────────────────────────────────────────────────── */
function StatCard({
  value,
  label,
  id,
}: {
  value: string;
  label: string;
  id: string;
}) {
  return (
    <div className="va-stat-readout va-hud" role="presentation">
      <HudCorners />
      <div
        className="va-display"
        style={{ fontSize: 32, color: "#00E5FF", lineHeight: 1 }}
      >
        {value}
      </div>
      <div
        className="va-mono"
        style={{
          fontSize: 13,
          color: "#5A5A8C",
          marginTop: 4,
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── PHOTO PANEL ──────────────────────────────────────────────────────── */
function PhotoFrame({
  src,
  alt,
  style,
  className,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div className={`va-photo va-hud ${className ?? ""}`} style={style}>
      <HudCorners />
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div className="va-photo-overlay" />
    </div>
  );
}

/* ─── SERVICE CARD ─────────────────────────────────────────────────────── */
function ServiceCard({
  code,
  title,
  desc,
}: {
  code: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="va-service-card">
      <div
        className="va-mono"
        style={{ fontSize: 12, color: "#5A5A8C", marginBottom: 8 }}
      >
        {code}
      </div>
      <div
        className="va-display"
        style={{
          fontSize: 15,
          color: "#E6E6FF",
          marginBottom: 8,
          lineHeight: 1.4,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, color: "#5A5A8C", lineHeight: 1.6 }}>
        {desc}
      </div>
    </div>
  );
}

/* ─── BAYER DITHER GRADIENT SKY (CSS-only) ─────────────────────────────── */
function DitheredSky({
  accentColor,
  height = 260,
}: {
  accentColor: string;
  height?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height,
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${accentColor}22 0%, transparent 100%)`,
        }}
      />
      {/* Dither overlay using repeating pattern */}
      <div
        className="va-dither-dense"
        style={{
          position: "absolute",
          inset: 0,
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ─── TICKER STRIP ─────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "SYS ONLINE",
  "AUTOMATION CORE v9.1",
  "AI VOICE BOT",
  "N8N WORKFLOW",
  "AEO ENGINE",
  "WHATSAPP AGENT",
  "NEXT.JS DEPLOY",
  "ZERO BUSYWORK",
  "180+ BUILDS",
  "40+ CLIENTS",
  "9 COUNTRIES",
  "SINCE 2019",
];
function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        background: "rgba(0,229,255,0.06)",
        borderTop: "1px solid rgba(0,229,255,0.2)",
        borderBottom: "1px solid rgba(0,229,255,0.2)",
        overflow: "hidden",
        height: 32,
        display: "flex",
        alignItems: "center",
      }}
      aria-hidden="true"
    >
      <div className="va-ticker-inner">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="va-mono"
            style={{
              fontSize: 13,
              color: i % 3 === 0 ? "#00E5FF" : "#5A5A8C",
              paddingRight: 40,
              letterSpacing: "0.12em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ───────────────────────────────────────────────────── */
export default function VaporAtlas() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const TOTAL_PANELS = 6;

  // Horizontal scroll via vertical wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReduced) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal — allow
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [prefersReduced]);

  // Track active panel from scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const panel = Math.round(container.scrollLeft / window.innerWidth);
      setActivePanel(Math.min(panel, TOTAL_PANELS - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Nav dot click
  const goToPanel = (i: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ left: i * window.innerWidth, behavior: "smooth" });
  };

  // Parallax dither background — moves at 0.3x scroll speed
  const [scrollX, setScrollX] = useState(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => setScrollX(container.scrollLeft);
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      {/* SVG barrel distort filter */}
      <svg
        style={{ position: "fixed", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="barrel" x="-10%" y="-10%" width="120%" height="120%">
            <feDisplacementMap
              in="SourceGraphic"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="va-root"
        style={{ position: "relative", minHeight: "100vh", zIndex: 2 }}
      >
        {/* ── FIXED GLOBAL HUD HEADER ── */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 32px",
            background: "rgba(7,7,15,0.92)",
            borderBottom: "1px solid rgba(0,229,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          <a
            href="#main-content"
            style={{
              position: "absolute",
              left: -9999,
              top: "auto",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
            className="skip-link"
          >
            Skip to content
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              className="va-display"
              style={{ fontSize: 14, letterSpacing: "0.2em", color: "#00E5FF" }}
            >
              WASEEM.N
            </div>
            <div className="va-tag">SkynetLabs</div>
          </div>

          <nav
            aria-label="Mission sections"
            style={{ display: "flex", gap: 24, alignItems: "center" }}
          >
            {["INIT", "STATS", "OPS", "MISSION LOG", "OPERATOR", "CONTACT"].map(
              (label, i) => (
                <button
                  key={label}
                  onClick={() => goToPanel(i)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: activePanel === i ? "#00E5FF" : "#5A5A8C",
                    fontFamily: "'VT323', monospace",
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    transition: "color 0.2s",
                    padding: "4px 0",
                  }}
                  aria-current={activePanel === i ? "page" : undefined}
                >
                  {label}
                </button>
              ),
            )}
          </nav>

          <div className="va-mono" style={{ fontSize: 12, color: "#5A5A8C" }}>
            {String(activePanel + 1).padStart(2, "0")} /{" "}
            {String(TOTAL_PANELS).padStart(2, "0")}
          </div>
        </header>

        {/* ── HORIZONTAL SCROLL CONTAINER ── */}
        <div
          ref={containerRef}
          className="va-scroll-container"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100vw",
            height: "100vh",
            scrollSnapType: "x mandatory",
            scrollBehavior: prefersReduced ? "auto" : "smooth",
          }}
          id="main-content"
        >
          {/* Parallax dither BG layer */}
          <div
            className="va-dither"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              transform: prefersReduced
                ? "none"
                : `translateX(${-scrollX * 0.15}px)`,
              willChange: "transform",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />

          <div ref={trackRef} className="va-h-scroll">
            {/* ═══════════════════════════════════════════
                PANEL 0 — HERO / INIT
            ═══════════════════════════════════════════ */}
            <section
              className="va-h-panel va-panel va-scanlines"
              style={{
                scrollSnapAlign: "start",
                background: "#07070F",
                padding: "80px 0 0",
                flexDirection: "column",
                justifyContent: "stretch",
              }}
              aria-label="Hero — mission init"
            >
              <DitheredSky accentColor="#00E5FF" height={300} />

              <div
                className="va-grid-bg"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.4,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  padding: "60px 64px 40px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Top status bar */}
                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    marginBottom: 48,
                    alignItems: "center",
                  }}
                >
                  <div
                    className="va-mono"
                    style={{ fontSize: 12, color: "#5A5A8C" }}
                  >
                    SYS://MISSION_INIT
                  </div>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#00E5FF",
                      boxShadow: "0 0 8px #00E5FF",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="va-mono"
                    style={{ fontSize: 12, color: "#00E5FF" }}
                  >
                    ALL SYSTEMS NOMINAL
                  </div>
                </div>

                {/* Hero headline */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div
                      className="va-mono"
                      style={{
                        fontSize: 13,
                        color: "#FF2E97",
                        marginBottom: 16,
                        letterSpacing: "0.2em",
                      }}
                    >
                      // OPERATOR: WASEEM NASIR
                    </div>

                    <h1
                      className="va-display va-glitch"
                      data-text="YOUR OPS,"
                      style={{
                        fontSize: "clamp(42px, 7vw, 88px)",
                        lineHeight: 0.95,
                        margin: 0,
                        letterSpacing: "-0.01em",
                        color: "#E6E6FF",
                      }}
                    >
                      YOUR OPS,
                    </h1>
                    <h1
                      className="va-display"
                      style={{
                        fontSize: "clamp(42px, 7vw, 88px)",
                        lineHeight: 0.95,
                        margin: 0,
                        letterSpacing: "-0.01em",
                        color: "#00E5FF",
                      }}
                    >
                      ON AUTOPILOT.
                    </h1>

                    <div
                      style={{
                        marginTop: 24,
                        maxWidth: 520,
                        fontSize: 15,
                        color: "#5A5A8C",
                        lineHeight: 1.7,
                        fontFamily: "'Chakra Petch', sans-serif",
                      }}
                    >
                      Destination:{" "}
                      <span style={{ color: "#E6E6FF" }}>zero busywork.</span>{" "}
                      AI + automation systems that kill missed leads, dead
                      follow-ups, and manual ops — permanently.
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 40,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <a
                        href="https://skynetjoe.com/discovery-call"
                        className="va-cta"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book Flight Debrief
                      </a>
                      <button
                        onClick={() => goToPanel(2)}
                        className="va-cta-ghost"
                      >
                        View Ops Manifest
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom right — photo */}
                <div
                  style={{
                    position: "absolute",
                    right: 64,
                    bottom: 80,
                    width: 260,
                    height: 340,
                  }}
                >
                  <PhotoFrame
                    src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                    alt="Waseem Nasir — founder SkynetLabs, balcony portrait"
                    style={{ width: "100%", height: "100%" }}
                    className="va-barrel-hover"
                  />
                </div>
              </div>

              {/* Ticker strip */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 4,
                }}
              >
                <Ticker />
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 1 — PROOF / STATS
            ═══════════════════════════════════════════ */}
            <section
              className="va-h-panel va-panel"
              style={{
                scrollSnapAlign: "start",
                background: "#07070F",
                padding: "80px 64px 64px",
              }}
              aria-label="Mission statistics"
            >
              <DitheredSky accentColor="#FF2E97" height={200} />
              <div
                className="va-dither-dense"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  opacity: 0.3,
                }}
                aria-hidden="true"
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  className="va-mono"
                  style={{
                    fontSize: 12,
                    color: "#5A5A8C",
                    marginBottom: 8,
                    letterSpacing: "0.15em",
                  }}
                >
                  SYS://MISSION_METRICS
                </div>
                <div
                  className="va-display"
                  style={{
                    fontSize: "clamp(28px, 4vw, 52px)",
                    color: "#E6E6FF",
                    marginBottom: 48,
                    lineHeight: 1.1,
                  }}
                >
                  FLIGHT DATA
                  <br />
                  <span style={{ color: "#00E5FF" }}>CONFIRMED.</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                    maxWidth: 540,
                    marginBottom: 48,
                  }}
                >
                  {[
                    { value: "180+", label: "BUILDS SHIPPED" },
                    { value: "40+", label: "CLIENTS SERVED" },
                    { value: "9", label: "COUNTRIES OPS FROM" },
                    { value: "2019", label: "MISSION START YEAR" },
                  ].map((stat) => (
                    <StatCard
                      key={stat.label}
                      value={stat.value}
                      label={stat.label}
                      id={stat.label}
                    />
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    "n8n",
                    "Next.js",
                    "AI Voice",
                    "WhatsApp Bot",
                    "AEO",
                    "Automation",
                  ].map((t) => (
                    <span key={t} className="va-tag">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Side photo */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 280,
                    height: 400,
                  }}
                >
                  <PhotoFrame
                    src="/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg"
                    alt="Waseem working with dual laptop analytics dashboard"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 2 — OPS MANIFEST / SERVICES
            ═══════════════════════════════════════════ */}
            <section
              className="va-h-panel va-panel"
              style={{
                scrollSnapAlign: "start",
                background: "#07070F",
                padding: "80px 64px 64px",
              }}
              aria-label="Services — ops manifest"
            >
              <div
                className="va-grid-bg"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              />
              <DitheredSky accentColor="#00E5FF" height={180} />

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  className="va-mono"
                  style={{
                    fontSize: 12,
                    color: "#5A5A8C",
                    marginBottom: 8,
                    letterSpacing: "0.15em",
                  }}
                >
                  SYS://OPS_MANIFEST
                </div>
                <div
                  className="va-display"
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 44px)",
                    color: "#E6E6FF",
                    marginBottom: 40,
                    lineHeight: 1.1,
                  }}
                >
                  SYSTEMS I DEPLOY
                  <br />
                  <span style={{ color: "#FF2E97" }}>FOR YOUR MISSION.</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 12,
                    maxWidth: 680,
                  }}
                >
                  {[
                    {
                      code: "OPS-01",
                      title: "AI Voice + WhatsApp Receptionist",
                      desc: "Never miss a lead call again. AI handles inbound, qualifies, books — 24/7, zero lag.",
                    },
                    {
                      code: "OPS-02",
                      title: "n8n Workflow Automation",
                      desc: "CRM syncs, follow-up sequences, invoice triggers — orchestrated without code debt.",
                    },
                    {
                      code: "OPS-03",
                      title: "AEO Search Engine",
                      desc: "Answer Engine Optimisation: get cited by ChatGPT, Perplexity, and Gemini for your niche.",
                    },
                    {
                      code: "OPS-04",
                      title: "Next.js Product Builds",
                      desc: "Full-stack Next.js apps: dashboards, client portals, booking funnels, SaaS MVPs.",
                    },
                    {
                      code: "OPS-05",
                      title: "Dead Follow-up Revival",
                      desc: "Automated re-engagement sequences that recover leads already written off as lost.",
                    },
                    {
                      code: "OPS-06",
                      title: "Full-Ops Retainer",
                      desc: "Monthly coverage: build + maintain + iterate your entire automation stack, hands-free.",
                    },
                  ].map((svc) => (
                    <ServiceCard key={svc.code} {...svc} />
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 3 — MISSION LOG / SELECTED WORK
            ═══════════════════════════════════════════ */}
            <section
              className="va-h-panel va-panel"
              style={{
                scrollSnapAlign: "start",
                background: "#07070F",
                padding: "80px 64px 64px",
              }}
              aria-label="Mission log — selected work"
            >
              <div
                className="va-dither-dense"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  opacity: 0.25,
                }}
                aria-hidden="true"
              />
              <DitheredSky accentColor="#FF2E97" height={220} />

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  gap: 64,
                }}
              >
                {/* Log entries */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="va-mono"
                    style={{
                      fontSize: 12,
                      color: "#5A5A8C",
                      marginBottom: 8,
                      letterSpacing: "0.15em",
                    }}
                  >
                    SYS://MISSION_LOG
                  </div>
                  <div
                    className="va-display"
                    style={{
                      fontSize: "clamp(22px, 3vw, 40px)",
                      color: "#E6E6FF",
                      marginBottom: 32,
                      lineHeight: 1.1,
                    }}
                  >
                    FLIGHT RECORDS
                    <span style={{ color: "#00E5FF" }}>
                      {" "}
                      —<br />
                      VERIFIED.
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 0 }}
                  >
                    {[
                      {
                        ts: "LOG-001",
                        status: "[SHIP]",
                        statusColor: "#00E5FF",
                        text: "AI voice + WhatsApp receptionist for US trucking co — 100% lead capture, zero missed calls.",
                      },
                      {
                        ts: "LOG-002",
                        status: "[SHIP]",
                        statusColor: "#00E5FF",
                        text: "$27 subscription funnel with Stripe: Inspire Health PT — live, payments confirmed.",
                      },
                      {
                        ts: "LOG-003",
                        status: "[LIVE]",
                        statusColor: "#FF2E97",
                        text: "Full n8n email automation for Takycorp — 2,000+ contacts, quota-aware throttle built.",
                      },
                      {
                        ts: "LOG-004",
                        status: "[SHIP]",
                        statusColor: "#00E5FF",
                        text: "AEO engine dogfooded on skynetjoe.com — cited by AI search, 6-service mega nav live.",
                      },
                      {
                        ts: "LOG-005",
                        status: "[LIVE]",
                        statusColor: "#FF2E97",
                        text: "Meta dual-geo ad campaign: US FreightOps + Singapore trades clinic WhatsApp funnels.",
                      },
                      {
                        ts: "LOG-006",
                        status: "[SHIP]",
                        statusColor: "#00E5FF",
                        text: "Trip-input system for IdeaViaggi: GDPR-hardened, role-gated, REST API + CTM integration.",
                      },
                    ].map((entry) => (
                      <div key={entry.ts} className="va-log-line">
                        <span className="va-log-ts">{entry.ts}</span>
                        <span
                          className="va-log-status"
                          style={{ color: entry.statusColor }}
                        >
                          {entry.status}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: "#E6E6FF",
                            lineHeight: 1.6,
                          }}
                        >
                          {entry.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Side photo stack */}
                <div
                  style={{
                    width: 220,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    justifyContent: "center",
                  }}
                >
                  <PhotoFrame
                    src="/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg"
                    alt="Waseem with client, thumbs up at cafe"
                    style={{ height: 180 }}
                  />
                  <PhotoFrame
                    src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                    alt="Waseem typing on laptop on Bali terrace with latte"
                    style={{ height: 180 }}
                  />
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 4 — OPERATOR PROFILE / ABOUT
            ═══════════════════════════════════════════ */}
            <section
              className="va-h-panel va-panel"
              style={{
                scrollSnapAlign: "start",
                background: "#07070F",
                padding: "80px 0 64px",
              }}
              aria-label="Operator profile — about Waseem"
            >
              <div
                className="va-grid-bg"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              />
              <DitheredSky accentColor="#00E5FF" height={240} />

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                {/* Photo column */}
                <div
                  style={{
                    width: "40%",
                    height: "100%",
                    position: "relative",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                    alt="Waseem at Nusa Penida cliffs, arms spread wide"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Dither fade edge */}
                  <div
                    className="va-dither"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 80,
                      height: "100%",
                      background:
                        "linear-gradient(to right, transparent, #07070F)",
                    }}
                    aria-hidden="true"
                  />
                  {/* HUD overlay */}
                  <div
                    className="va-hud"
                    style={{
                      position: "absolute",
                      inset: 24,
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                    <HudCorners />
                  </div>
                </div>

                {/* Text column */}
                <div style={{ flex: 1, padding: "0 64px" }}>
                  <div
                    className="va-mono"
                    style={{
                      fontSize: 12,
                      color: "#5A5A8C",
                      marginBottom: 8,
                      letterSpacing: "0.15em",
                    }}
                  >
                    SYS://OPERATOR_PROFILE
                  </div>
                  <div
                    className="va-display"
                    style={{
                      fontSize: "clamp(24px, 3.5vw, 44px)",
                      color: "#E6E6FF",
                      marginBottom: 24,
                      lineHeight: 1.1,
                    }}
                  >
                    WASEEM NASIR<span style={{ color: "#FF2E97" }}>.</span>
                    <br />
                    <span style={{ color: "#00E5FF" }}>INDEPENDENT.</span>
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color: "#5A5A8C",
                      lineHeight: 1.8,
                      maxWidth: 440,
                      marginBottom: 32,
                    }}
                  >
                    Founder of{" "}
                    <span style={{ color: "#E6E6FF" }}>SkynetLabs</span>. I
                    build AI + automation systems that kill busywork — missed
                    leads, dead follow-ups, manual ops — for founders and small
                    teams worldwide.
                    <br />
                    <br />
                    Operating since 2019. Remote from{" "}
                    <span style={{ color: "#E6E6FF" }}>Bali / Lahore</span>.
                    180+ builds shipped across 9 countries. I've sat in the
                    chaos of manual ops — I know exactly what to kill first.
                  </div>

                  {/* Photo grid strip */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                    {[
                      {
                        src: "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
                        alt: "Waseem with headphones, neon tea sign, smiling closeup",
                      },
                      {
                        src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                        alt: "Waseem at hilltop with backpack, city vista",
                      },
                      {
                        src: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                        alt: "Waseem at Bali coworking group meetup",
                      },
                    ].map((p) => (
                      <div
                        key={p.src}
                        className="va-hud"
                        style={{ width: 110, height: 80, position: "relative" }}
                      >
                        <HudCorners />
                        <img
                          src={`/img/pro/${p.src}`}
                          alt={p.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    style={{ display: "flex", gap: 24, alignItems: "center" }}
                  >
                    <a
                      href="https://github.com/waseemnasir2k26"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="va-mono"
                      style={{
                        fontSize: 13,
                        color: "#5A5A8C",
                        letterSpacing: "0.08em",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#00E5FF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#5A5A8C")
                      }
                    >
                      github.com/waseemnasir2k26
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                PANEL 5 — CTA / CONTACT
            ═══════════════════════════════════════════ */}
            <section
              className="va-h-panel va-scanlines"
              style={{
                scrollSnapAlign: "start",
                background: "#07070F",
                padding: "80px 64px 64px",
              }}
              aria-label="Contact — book a call"
            >
              <DitheredSky accentColor="#FF2E97" height={280} />
              <div
                className="va-dither-dense"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  opacity: 0.4,
                }}
                aria-hidden="true"
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  display: "flex",
                  height: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="va-mono"
                  style={{
                    fontSize: 12,
                    color: "#5A5A8C",
                    marginBottom: 8,
                    letterSpacing: "0.15em",
                  }}
                >
                  SYS://CONTACT_UPLINK
                </div>

                <div
                  className="va-display"
                  style={{
                    fontSize: "clamp(32px, 5.5vw, 72px)",
                    lineHeight: 0.95,
                    marginBottom: 24,
                    color: "#E6E6FF",
                  }}
                >
                  READY TO
                  <br />
                  <span style={{ color: "#00E5FF" }}>INITIATE?</span>
                </div>

                <div
                  style={{
                    fontSize: 15,
                    color: "#5A5A8C",
                    lineHeight: 1.7,
                    maxWidth: 480,
                    marginBottom: 40,
                  }}
                >
                  Book a 30-minute debrief. We map your biggest operational
                  bottleneck and I tell you exactly what automation kills it —
                  no pitch, no upsell theatre.
                </div>

                {/* Cursor blink readout */}
                <div
                  className="va-hud"
                  style={{
                    border: "1px solid rgba(0,229,255,0.3)",
                    padding: "16px 24px",
                    marginBottom: 40,
                    display: "inline-block",
                    position: "relative",
                    background: "rgba(0,229,255,0.04)",
                  }}
                >
                  <HudCorners />
                  <span
                    className="va-mono"
                    style={{ fontSize: 16, color: "#E6E6FF" }}
                  >
                    &gt; AWAITING_DEBRIEF_REQUEST
                  </span>
                  <span className="va-cursor" aria-hidden="true" />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 64,
                  }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="va-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Book a 30-minute discovery call"
                  >
                    Book 30-Min Debrief
                  </a>
                  <a
                    href="https://skynetjoe.com"
                    className="va-cta-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full Ops Hub
                  </a>
                </div>

                {/* Photo strip */}
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    {
                      src: "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
                      alt: "Waseem at beach, arms spread, laughing at camera",
                    },
                    {
                      src: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                      alt: "Waseem standing by neon 'limit' quote sign in black outfit",
                    },
                    {
                      src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                      alt: "Waseem on rooftop with laptop and dragonfruit smoothie, smiling",
                    },
                    {
                      src: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                      alt: "Waseem arms crossed, sunglasses, confident table pose",
                    },
                  ].map((p) => (
                    <div
                      key={p.src}
                      className="va-hud va-barrel-hover"
                      style={{
                        width: 130,
                        height: 180,
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <HudCorners />
                      <img
                        src={`/img/pro/${p.src}`}
                        alt={p.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <footer
                  style={{
                    position: "absolute",
                    bottom: 32,
                    left: 64,
                    right: 64,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(0,229,255,0.1)",
                    paddingTop: 16,
                  }}
                >
                  <div
                    className="va-mono"
                    style={{ fontSize: 11, color: "#5A5A8C" }}
                  >
                    &copy; {new Date().getFullYear()} WASEEM NASIR / SKYNETLABS
                  </div>
                  <div
                    className="va-mono"
                    style={{ fontSize: 11, color: "#5A5A8C" }}
                  >
                    VAPOR ATLAS v1.0 — DESIGN NO. 19 OF 50
                  </div>
                  <div
                    className="va-mono"
                    style={{ fontSize: 11, color: "#5A5A8C" }}
                  >
                    REMOTE: BALI / LAHORE
                  </div>
                </footer>
              </div>
            </section>
          </div>
          {/* end va-h-scroll track */}
        </div>
        {/* end scroll container */}

        {/* ── NAV DOTS ── */}
        <nav
          aria-label="Panel navigation"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            display: "flex",
            gap: 6,
          }}
        >
          {Array.from({ length: TOTAL_PANELS }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPanel(i)}
              className={`va-nav-dot${activePanel === i ? " active" : ""}`}
              aria-label={`Go to panel ${i + 1}`}
              aria-current={activePanel === i ? "true" : undefined}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 8,
                  height: 8,
                  background:
                    activePanel === i ? "#00E5FF" : "rgba(0,229,255,0.2)",
                  border: "1px solid rgba(0,229,255,0.5)",
                  transition: "background 0.2s",
                }}
              />
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
