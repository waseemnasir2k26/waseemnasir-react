"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  animate,
} from "framer-motion";
import Link from "next/link";

/* ─── SCOPED FONT IMPORT ─── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap";

/* ─── PALETTE ─── */
const P = {
  bg: "#0B0B0B",
  surface: "#161616",
  text: "#EDEDED",
  muted: "#7A7A7A",
  accent: "#39FF14",
  accent2: "#FF00A8",
} as const;

/* ─── PROOF DATA ─── */
const STATS = [
  { val: 180, suffix: "+", label: "SYSTEMS_SHIPPED" },
  { val: 40, suffix: "+", label: "CLIENTS_SERVED" },
  { val: 9, suffix: "", label: "COUNTRIES_WORKED" },
  { val: 2019, suffix: "", label: "OPERATING_SINCE" },
];

const SERVICES = [
  {
    id: "01",
    name: "AI Voice & Chat Bots",
    desc: "WhatsApp, phone, and web agents that qualify leads, book calls, and escalate — 24/7, no handholding.",
  },
  {
    id: "02",
    name: "Workflow Automation",
    desc: "n8n pipelines that stitch your CRM, inbox, calendar, and billing into one non-stupid system.",
  },
  {
    id: "03",
    name: "AEO / Answer Engine",
    desc: "Structured content that gets cited in AI search results before your competitors know it's a thing.",
  },
  {
    id: "04",
    name: "Next.js Builds",
    desc: "Production-grade web apps. Server components, edge runtime, real performance — not Wix dressed up.",
  },
  {
    id: "05",
    name: "Lead Capture Funnels",
    desc: "Landing pages wired to automation. Every form submit fires a sequence, not an email into the void.",
  },
  {
    id: "06",
    name: "Ops Systemisation",
    desc: "Kill the spreadsheet graveyard. One source of truth, roles defined, handoffs that don't leak.",
  },
];

const WORK_ITEMS = [
  {
    label: "FreightOps",
    tag: "AI_RECEPTIONIST",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  },
  {
    label: "Inspire Health PT",
    tag: "FUNNEL+STRIPE",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  },
  {
    label: "IdeaViaggi",
    tag: "CPT+MEMBER_GATE",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  },
  {
    label: "TakyCorp",
    tag: "EMAIL_AUTOMATION",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  },
  {
    label: "SkynetJoe AEO",
    tag: "ANSWER_ENGINE",
    img: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
  },
  {
    label: "GigSignal Ext",
    tag: "CHROME_EXTENSION",
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
  },
];

/* ─── RANDOM TRANSFORM-ORIGIN POOL ─── */
const ORIGINS = [
  "top left",
  "top center",
  "top right",
  "center left",
  "center center",
  "center right",
  "bottom left",
  "bottom center",
  "bottom right",
];
function randOrigin(seed: number) {
  return ORIGINS[seed % ORIGINS.length];
}

/* ─── GLITCH TEXT ─── */
const GLITCH_CHARS = "!@#$%^&*<>?/|\\~`".split("");
function glitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function GlitchLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [glitched, setGlitched] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReduced = useReducedMotion();

  const startGlitch = useCallback(() => {
    if (prefersReduced || typeof children !== "string") return;
    setHovered(true);
    let count = 0;
    timerRef.current = setInterval(() => {
      const text = children as string;
      const arr = text
        .split("")
        .map((c, i) => (Math.random() > 0.6 ? glitchChar() : c));
      setGlitched(arr.join(""));
      count++;
      if (count > 8) {
        clearInterval(timerRef.current!);
        setGlitched(null);
        setHovered(false);
      }
    }, 50);
  }, [children, prefersReduced]);

  const stopGlitch = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGlitched(null);
    setHovered(false);
  }, []);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`glitch-link ${className} ${hovered ? "hovered" : ""}`}
      onMouseEnter={startGlitch}
      onMouseLeave={stopGlitch}
      onFocus={startGlitch}
      onBlur={stopGlitch}
    >
      {glitched ?? children}
    </a>
  );
}

/* ─── COUNT-UP ─── */
function CountUp({
  to,
  suffix,
  reduced,
}: {
  to: number;
  suffix: string;
  reduced: boolean;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observed = useRef(false);

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observed.current) {
          observed.current = true;
          const ctrl = animate(0, to, {
            duration: 1.4,
            ease: "easeOut",
            onUpdate: (v) => setVal(Math.round(v)),
          });
          return () => ctrl.stop();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, reduced]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── ASCII RAIN FOOTER ─── */
function AsciiRain({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const FONT_SIZE = 13;
    const COLS = Math.floor(W / FONT_SIZE);
    const drops: number[] = Array(COLS).fill(1);
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノ!@#$%^&*";

    let raf: number;
    let last = 0;
    const FPS = 18;

    function draw(ts: number) {
      if (ts - last < 1000 / FPS) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = ts;
      ctx!.fillStyle = "rgba(11,11,11,0.12)";
      ctx!.fillRect(0, 0, W, H);
      ctx!.fillStyle = "#39FF14";
      ctx!.font = `${FONT_SIZE}px 'IBM Plex Mono', monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx!.fillStyle = drops[i] * FONT_SIZE < H * 0.3 ? "#FF00A8" : "#39FF14";
        ctx!.fillText(text, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      width={1440}
      height={220}
      style={{
        width: "100%",
        height: "220px",
        display: "block",
        opacity: 0.7,
      }}
      aria-hidden="true"
    />
  );
}

/* ─── SPLIT TEXT HERO ─── */
function SplitHero({ text, reduced }: { text: string; reduced: boolean }) {
  const words = text.split(" ");
  return (
    <h1 className="hero-headline" aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="hero-word-wrap">
          {word.split("").map((char, ci) => {
            const seed = wi * 7 + ci * 3;
            const origin = randOrigin(seed);
            return (
              <motion.span
                key={ci}
                className="hero-char"
                aria-hidden="true"
                initial={
                  reduced
                    ? false
                    : { opacity: 0, scale: 1.75, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{
                  delay: reduced ? 0 : wi * 0.08 + ci * 0.03,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: origin, display: "inline-block" }}
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
    </h1>
  );
}

/* ─── DRAGGABLE WORK SLIDER ─── */
function WorkSlider({ reduced }: { reduced: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const rafRef = useRef<number>(0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = trackRef.current.scrollLeft;
    lastX.current = e.clientX;
    lastT.current = Date.now();
    velocity.current = 0;
    trackRef.current.setPointerCapture(e.pointerId);
    cancelAnimationFrame(rafRef.current);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = scrollLeft.current - dx;
    const now = Date.now();
    const dt = now - lastT.current;
    if (dt > 0) velocity.current = (lastX.current - e.clientX) / dt;
    lastX.current = e.clientX;
    lastT.current = now;
  };

  const onPointerUp = () => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    let v = velocity.current * 16;
    const inertia = () => {
      if (!trackRef.current) return;
      trackRef.current.scrollLeft += v;
      v *= 0.93;
      if (Math.abs(v) > 0.3) rafRef.current = requestAnimationFrame(inertia);
    };
    rafRef.current = requestAnimationFrame(inertia);
  };

  return (
    <div className="slider-container" aria-label="Selected work">
      <div
        ref={trackRef}
        className="slider-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="list"
      >
        {WORK_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            className="slider-card"
            role="listitem"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
          >
            <div className="card-img-wrap">
              <img
                src={`/img/pro/${item.img}`}
                alt={item.label}
                className="card-img"
                draggable={false}
              />
              <div className="card-img-overlay" />
            </div>
            <div className="card-meta">
              <span className="card-index">
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span className="card-tag">{item.tag}</span>
            </div>
            <p className="card-label">{item.label}</p>
          </motion.div>
        ))}
      </div>
      <p className="slider-hint" aria-hidden="true">
        &lt;— DRAG —&gt;
      </p>
    </div>
  );
}

/* ─── NOISE OVERLAY ─── */
function NoiseOverlay() {
  return (
    <div
      className="noise-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.04,
      }}
    />
  );
}

/* ─── PAGE ─── */
export default function GlitchBrutalist() {
  const reduced = useReducedMotion() ?? false;
  const [tick, setTick] = useState(0);

  /* scanline flicker */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, [reduced]);

  const scanVisible = tick % 5 !== 0; /* flicker occasionally off */

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        .root-02 {
          --bg: ${P.bg};
          --surface: ${P.surface};
          --text: ${P.text};
          --muted: ${P.muted};
          --accent: ${P.accent};
          --accent2: ${P.accent2};
          font-family: 'Space Grotesk', sans-serif;
          background: var(--bg);
          color: var(--text);
          position: relative;
          min-height: 100vh;
          z-index: 2;
          overflow-x: hidden;
        }

        /* scanlines */
        .root-02::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 3px,
            rgba(0,0,0,0.18) 3px,
            rgba(0,0,0,0.18) 4px
          );
        }

        /* ── NAV ── */
        .root-02 .nav-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid rgba(57,255,20,0.2);
          background: rgba(11,11,11,0.88);
          backdrop-filter: blur(6px);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
        }
        .root-02 .nav-logo {
          color: var(--accent);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-decoration: none;
        }
        .root-02 .nav-logo:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .root-02 .nav-links {
          display: flex;
          gap: 28px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .root-02 .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.1em;
          transition: color 0.15s;
        }
        .root-02 .nav-links a:hover,
        .root-02 .nav-links a:focus-visible { color: var(--accent); }
        .root-02 .nav-links a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .root-02 .nav-cta {
          background: var(--accent);
          color: #000;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-decoration: none;
          padding: 8px 16px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .root-02 .nav-cta:hover { background: var(--accent2); color: #fff; }
        .root-02 .nav-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

        /* ── HERO ── */
        .root-02 .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 120px 40px 60px;
          position: relative;
          overflow: hidden;
          border-bottom: 2px solid var(--accent);
        }
        .root-02 .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: grayscale(1) contrast(1.2);
          opacity: 0.08;
          z-index: 0;
        }
        .root-02 .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
        }
        .root-02 .hero-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--accent);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .root-02 .hero-eyebrow::before {
          content: '>';
          color: var(--accent2);
        }
        .root-02 .hero-headline {
          font-family: 'Anton', sans-serif;
          font-size: clamp(60px, 11vw, 160px);
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: var(--text);
          margin: 0 0 36px;
          text-transform: uppercase;
        }
        .root-02 .hero-word-wrap {
          display: inline;
          white-space: nowrap;
          margin-right: 0.18em;
        }
        .root-02 .hero-char { display: inline-block; }
        .root-02 .hero-sub {
          font-size: clamp(14px, 1.8vw, 20px);
          color: var(--muted);
          max-width: 540px;
          line-height: 1.6;
          margin-bottom: 48px;
          font-family: 'Space Grotesk', sans-serif;
        }
        .root-02 .hero-sub em { color: var(--text); font-style: normal; }
        .root-02 .hero-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .root-02 .cta-primary {
          font-family: 'Anton', sans-serif;
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: var(--accent);
          color: #000;
          text-decoration: none;
          padding: 16px 32px;
          border: 2px solid var(--accent);
          position: relative;
          transition: all 0.15s;
        }
        .root-02 .cta-primary::after {
          content: '';
          position: absolute;
          top: 4px; left: 4px;
          right: -4px; bottom: -4px;
          border: 2px solid var(--accent2);
          transition: all 0.15s;
          pointer-events: none;
        }
        .root-02 .cta-primary:hover {
          background: var(--accent2);
          border-color: var(--accent2);
          color: #fff;
        }
        .root-02 .cta-primary:hover::after { border-color: var(--accent); }
        .root-02 .cta-primary:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
        .root-02 .hero-scroll-hint {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.15em;
          animation: blink 1.2s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        /* ── STATS ── */
        .root-02 .stats-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .root-02 .stat-cell {
          padding: 48px 32px;
          border-right: 1px solid rgba(255,255,255,0.06);
          position: relative;
        }
        .root-02 .stat-cell:last-child { border-right: none; }
        .root-02 .stat-val {
          font-family: 'Anton', sans-serif;
          font-size: clamp(40px, 5vw, 72px);
          color: var(--accent);
          line-height: 1;
          margin-bottom: 8px;
          display: block;
        }
        .root-02 .stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.15em;
        }
        .root-02 .stat-cell::before {
          content: attr(data-idx);
          position: absolute;
          top: 16px; right: 16px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.1);
        }

        /* ── SECTION LABEL ── */
        .root-02 .section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        /* ── SERVICES ── */
        .root-02 .services-section {
          padding: 80px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .root-02 .services-header {
          display: flex;
          align-items: baseline;
          gap: 24px;
          margin-bottom: 56px;
        }
        .root-02 .services-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 5vw, 72px);
          text-transform: uppercase;
          color: var(--text);
          line-height: 1;
          margin: 0;
        }
        .root-02 .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .root-02 .service-item {
          padding: 36px 32px;
          border-right: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          transition: background 0.2s;
          cursor: default;
        }
        .root-02 .service-item:hover {
          background: var(--surface);
        }
        .root-02 .service-item:nth-child(3n) { border-right: none; }
        .root-02 .service-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--accent2);
          letter-spacing: 0.1em;
          margin-bottom: 14px;
          display: block;
        }
        .root-02 .service-name {
          font-family: 'Anton', sans-serif;
          font-size: 18px;
          text-transform: uppercase;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: 0.04em;
        }
        .root-02 .service-desc {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.65;
        }
        .root-02 .service-arrow {
          position: absolute;
          top: 36px; right: 32px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 18px;
          color: rgba(57,255,20,0.15);
          transition: color 0.15s, transform 0.15s;
        }
        .root-02 .service-item:hover .service-arrow {
          color: var(--accent);
          transform: translate(3px, -3px);
        }

        /* ── WORK SLIDER ── */
        .root-02 .work-section {
          padding: 80px 0 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .root-02 .work-header {
          padding: 0 40px;
          margin-bottom: 40px;
        }
        .root-02 .work-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 5vw, 72px);
          text-transform: uppercase;
          color: var(--text);
          line-height: 1;
          margin: 0;
        }
        .root-02 .slider-container {
          position: relative;
        }
        .root-02 .slider-track {
          display: flex;
          gap: 20px;
          overflow-x: scroll;
          overflow-y: hidden;
          scroll-behavior: auto;
          cursor: grab;
          padding: 0 40px 24px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          user-select: none;
        }
        .root-02 .slider-track:active { cursor: grabbing; }
        .root-02 .slider-track::-webkit-scrollbar { display: none; }
        .root-02 .slider-card {
          flex: 0 0 340px;
          background: var(--surface);
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          position: relative;
        }
        .root-02 .card-img-wrap {
          width: 100%;
          height: 220px;
          overflow: hidden;
          position: relative;
        }
        .root-02 .card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: grayscale(0.7) contrast(1.1);
          transition: filter 0.3s, transform 0.3s;
          display: block;
          pointer-events: none;
        }
        .root-02 .slider-card:hover .card-img {
          filter: grayscale(0) contrast(1.05);
          transform: scale(1.03);
        }
        .root-02 .card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(11,11,11,0.9) 100%);
        }
        .root-02 .card-meta {
          padding: 16px 20px 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .root-02 .card-index {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: var(--accent2);
          letter-spacing: 0.1em;
        }
        .root-02 .card-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: var(--accent);
          background: rgba(57,255,20,0.08);
          padding: 3px 8px;
          letter-spacing: 0.08em;
        }
        .root-02 .card-label {
          font-family: 'Anton', sans-serif;
          font-size: 20px;
          text-transform: uppercase;
          color: var(--text);
          margin: 0;
          padding: 8px 20px 20px;
          letter-spacing: 0.04em;
        }
        .root-02 .slider-hint {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.15em;
          text-align: center;
          margin: 8px 0 0;
        }

        /* ── ABOUT ── */
        .root-02 .about-section {
          padding: 80px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .root-02 .about-imgs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 12px;
        }
        .root-02 .about-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: center top;
          filter: grayscale(0.3);
          display: block;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .root-02 .about-img-large {
          grid-row: span 2;
          aspect-ratio: 2/3;
        }
        .root-02 .about-img-accent {
          border: 1px solid var(--accent);
        }
        .root-02 .about-text { }
        .root-02 .about-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 4vw, 60px);
          text-transform: uppercase;
          color: var(--text);
          line-height: 1;
          margin: 0 0 28px;
        }
        .root-02 .about-title span { color: var(--accent); }
        .root-02 .about-body {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.75;
          margin-bottom: 32px;
        }
        .root-02 .about-body strong { color: var(--text); font-weight: 500; }
        .root-02 .about-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 36px;
        }
        .root-02 .about-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--accent);
          border: 1px solid rgba(57,255,20,0.3);
          padding: 5px 10px;
          letter-spacing: 0.08em;
        }
        .root-02 .about-links {
          display: flex;
          gap: 20px;
        }

        /* ── PHOTO STRIP ── */
        .root-02 .photo-strip {
          display: flex;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .root-02 .photo-strip img {
          flex: 1;
          height: 200px;
          object-fit: cover;
          object-position: center;
          filter: grayscale(0.5) contrast(1.05);
          display: block;
        }

        /* ── CTA SECTION ── */
        .root-02 .cta-section {
          padding: 100px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .root-02 .cta-bg-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Anton', sans-serif;
          font-size: clamp(80px, 18vw, 280px);
          color: rgba(57,255,20,0.03);
          text-transform: uppercase;
          pointer-events: none;
          white-space: nowrap;
          line-height: 1;
        }
        .root-02 .cta-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.25em;
          color: var(--accent2);
          margin-bottom: 24px;
        }
        .root-02 .cta-headline {
          font-family: 'Anton', sans-serif;
          font-size: clamp(40px, 7vw, 100px);
          text-transform: uppercase;
          color: var(--text);
          line-height: 0.95;
          margin: 0 0 40px;
          position: relative;
        }
        .root-02 .cta-headline span { color: var(--accent); }
        .root-02 .cta-sub {
          font-size: 15px;
          color: var(--muted);
          max-width: 400px;
          margin: 0 auto 48px;
          line-height: 1.65;
        }

        /* ── FOOTER ── */
        .root-02 .footer {
          background: var(--surface);
          position: relative;
          overflow: hidden;
        }
        .root-02 .footer-ascii { display: block; }
        .root-02 .footer-bar {
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(57,255,20,0.15);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
        }
        .root-02 .footer-copy { color: var(--muted); }
        .root-02 .footer-copy span { color: var(--accent); }
        .root-02 .footer-links {
          display: flex;
          gap: 24px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .root-02 .footer-links a {
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .root-02 .footer-links a:hover { color: var(--accent); }
        .root-02 .footer-links a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        /* ── GLITCH LINK ── */
        .root-02 .glitch-link {
          color: var(--accent);
          text-decoration: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.08em;
          position: relative;
          padding-bottom: 1px;
          border-bottom: 1px solid rgba(57,255,20,0.3);
          transition: color 0.1s;
        }
        .root-02 .glitch-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .root-02 .glitch-link.hovered {
          color: var(--accent2);
          border-bottom-color: var(--accent2);
          text-shadow:
            1px 0 0 rgba(57,255,20,0.6),
            -1px 0 0 rgba(255,0,168,0.6);
        }

        /* ── INLINE DIVIDER ── */
        .root-02 .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, var(--accent) 0%, var(--accent2) 50%, transparent 100%);
          margin: 0;
          opacity: 0.3;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .root-02 .stats-section { grid-template-columns: repeat(2, 1fr); }
          .root-02 .services-grid { grid-template-columns: 1fr 1fr; }
          .root-02 .service-item:nth-child(3n) { border-right: 1px solid rgba(255,255,255,0.06); }
          .root-02 .service-item:nth-child(2n) { border-right: none; }
          .root-02 .about-section { grid-template-columns: 1fr; gap: 40px; }
          .root-02 .nav-links { display: none; }
        }
        @media (max-width: 600px) {
          .root-02 .stats-section { grid-template-columns: 1fr 1fr; }
          .root-02 .services-grid { grid-template-columns: 1fr; }
          .root-02 .service-item:nth-child(2n) { border-right: none; }
          .root-02 .hero-section { padding: 100px 20px 48px; }
          .root-02 .services-section,
          .root-02 .about-section,
          .root-02 .cta-section { padding: 60px 20px; }
          .root-02 .stat-cell { padding: 32px 20px; }
          .root-02 .footer-bar { flex-direction: column; gap: 12px; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .root-02 .hero-scroll-hint { animation: none; }
          .root-02 .glitch-link.hovered { text-shadow: none; }
        }
      `}</style>

      <div className="root-02">
        <NoiseOverlay />

        {/* skip nav */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            zIndex: 999,
            color: "#000",
            background: P.accent,
            padding: "8px 16px",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
          onFocus={(e) => {
            e.currentTarget.style.left = "0";
          }}
          onBlur={(e) => {
            e.currentTarget.style.left = "-9999px";
          }}
        >
          Skip to main content
        </a>

        {/* NAV */}
        <nav className="nav-bar" aria-label="Main navigation">
          <a href="/" className="nav-logo" aria-label="SkynetLabs home">
            SKYNETLABS.EXE
          </a>
          <ul className="nav-links">
            <li>
              <a href="#services">SERVICES</a>
            </li>
            <li>
              <a href="#work">WORK</a>
            </li>
            <li>
              <a href="#about">ABOUT</a>
            </li>
          </ul>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            ./BOOK_CALL
          </a>
        </nav>

        {/* HERO */}
        <main id="main-content">
          <section className="hero-section" aria-labelledby="hero-h1">
            <img
              src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
              alt=""
              className="hero-bg-img"
              aria-hidden="true"
            />
            <div className="hero-content">
              <motion.div
                className="hero-eyebrow"
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                WASEEM_NASIR.SH — SKYNETLABS — REMOTE:BALI/LAHORE
              </motion.div>
              <div id="hero-h1">
                <SplitHero
                  text="AUTOMATION THAT DOESN'T ASK FOR PERMISSION."
                  reduced={reduced}
                />
              </div>
              <motion.p
                className="hero-sub"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.9 }}
              >
                <em>9 years.</em> 180+ systems shipped. 40+ teams across 9
                countries freed from manual ops, dead leads, and broken
                follow-ups.
              </motion.p>
              <motion.div
                className="hero-actions"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 1.1 }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="cta-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BOOK 30-MIN CALL
                </a>
                <span className="hero-scroll-hint" aria-hidden="true">
                  SCROLL_DOWN▼
                </span>
              </motion.div>
            </div>
          </section>

          {/* STATS */}
          <section className="stats-section" aria-label="Key numbers">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="stat-cell"
                data-idx={`[${String(i + 1).padStart(2, "0")}]`}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <span className="stat-val">
                  <CountUp to={s.val} suffix={s.suffix} reduced={reduced} />
                </span>
                <span className="stat-label">{s.label}</span>
              </motion.div>
            ))}
          </section>

          {/* SERVICES */}
          <section
            className="services-section"
            id="services"
            aria-labelledby="services-heading"
          >
            <div className="services-header">
              <div>
                <p className="section-label">// WHAT_I_BUILD</p>
                <h2 className="services-title" id="services-heading">
                  Six Weapons.
                </h2>
              </div>
            </div>
            <div className="services-grid">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.id}
                  className="service-item"
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <span className="service-num">{s.id}</span>
                  <h3 className="service-name">{s.name}</h3>
                  <p className="service-desc">{s.desc}</p>
                  <span className="service-arrow" aria-hidden="true">
                    ↗
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* WORK SLIDER */}
          <section
            className="work-section"
            id="work"
            aria-labelledby="work-heading"
          >
            <div className="work-header">
              <p className="section-label">// SELECTED_OUTPUT</p>
              <h2 className="work-title" id="work-heading">
                Proof of Work.
              </h2>
            </div>
            <WorkSlider reduced={reduced} />
          </section>

          {/* PHOTO STRIP */}
          <div className="photo-strip" role="presentation">
            {[
              "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
              "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
              "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
              "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
              "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
            ].map((f) => (
              <img key={f} src={`/img/pro/${f}`} alt="" aria-hidden="true" />
            ))}
          </div>

          {/* ABOUT */}
          <section
            className="about-section"
            id="about"
            aria-labelledby="about-heading"
          >
            <div className="about-imgs">
              <img
                src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                alt="Waseem Nasir — founder of SkynetLabs"
                className="about-img about-img-large about-img-accent"
              />
              <img
                src="/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg"
                alt="Waseem working from a rooftop cafe"
                className="about-img"
              />
              <img
                src="/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg"
                alt="Waseem with a client team at a coworking space"
                className="about-img"
              />
            </div>
            <div className="about-text">
              <p className="section-label">// ABOUT_WASEEM</p>
              <h2 className="about-title" id="about-heading">
                One builder.
                <br />
                <span>No agency overhead.</span>
              </h2>
              <p className="about-body">
                I'm <strong>Waseem Nasir</strong> — independent founder of{" "}
                <strong>SkynetLabs</strong>, operating since 2019. I build the
                systems that let businesses run while founders sleep: AI voice
                bots that never miss a lead, n8n pipelines that kill the
                copy-paste loops, Next.js products that ship fast and don't
                break at 3am.
              </p>
              <p className="about-body">
                I work remote — from Bali, Lahore, a mountain cafe, wherever.
                40+ clients across 9 countries have stopped paying for seats and
                started paying for <strong>outcomes</strong>.
              </p>
              <div className="about-tags" aria-label="Tech stack">
                {[
                  "n8n",
                  "Next.js",
                  "WhatsApp Bots",
                  "Voice AI",
                  "AEO",
                  "TypeScript",
                  "Vercel",
                  "OpenAI",
                ].map((t) => (
                  <span key={t} className="about-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="about-links">
                <GlitchLink
                  href="https://skynetjoe.com/discovery-call"
                  external
                >
                  ./BOOK_CALL
                </GlitchLink>
                <GlitchLink href="https://github.com/waseemnasir2k26" external>
                  ./GITHUB
                </GlitchLink>
              </div>
            </div>
          </section>

          <div className="divider" role="presentation" />

          {/* CTA */}
          <section className="cta-section" aria-labelledby="cta-heading">
            <div className="cta-bg-text" aria-hidden="true">
              BUILD
            </div>
            <motion.p
              className="cta-label"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              // NEXT_STEP
            </motion.p>
            <motion.h2
              className="cta-headline"
              id="cta-heading"
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              Ready to ship
              <br />
              <span>something real?</span>
            </motion.h2>
            <motion.p
              className="cta-sub"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              30 minutes. No pitch deck. We map your biggest bottleneck and
              agree on what to build first.
            </motion.p>
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.35 }}
            >
              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-primary"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "16px" }}
              >
                BOOK DISCOVERY CALL →
              </a>
            </motion.div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="footer" aria-label="Site footer">
          <div className="footer-ascii" aria-hidden="true">
            <AsciiRain reduced={reduced} />
          </div>
          <div className="footer-bar">
            <p className="footer-copy">
              © 2019–2026 <span>SKYNETLABS</span> — WASEEM_NASIR.EXE —
              ALL_SYSTEMS_GO
            </p>
            <ul className="footer-links">
              <li>
                <a
                  href="https://skynetjoe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SKYNETJOE.COM
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GITHUB
                </a>
              </li>
              <li>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BOOK_CALL
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  );
}
