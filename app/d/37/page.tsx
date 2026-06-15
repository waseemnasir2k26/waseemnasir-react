"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────
   DESIGN 37 — Liquid Glass
   Apple Liquid Glass · SVG feDisplacementMap refraction
   palette: #0B0D10 bg · #10141A surface · #FFFFFF text
            #9CA3AF muted · #7DD3FC accent · #E2E8F0 accent2
   fonts:   Geist (display) · Inter (body) · JetBrains Mono
   signature: floating glass cards w/ chromatic R/G/B split
              edge fringing + feDisplacementMap distortion
───────────────────────────────────────────────────────── */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap";

const P = {
  bg: "#0B0D10",
  surface: "#10141A",
  text: "#FFFFFF",
  muted: "#9CA3AF",
  accent: "#7DD3FC",
  accent2: "#E2E8F0",
};

/* SVG filter IDs are global in the DOM, so prefix with d37 */
const FILTER_ID = "d37-liquid-glass";
const CHROMATIC_ID = "d37-chromatic";

/* ── services data ── */
const SERVICES = [
  {
    label: "ai workflows",
    title: "n8n & Make automations",
    body: "End-to-end pipelines. CRM sync, lead routing, invoice ops — zero manual steps.",
    accent: "#7DD3FC",
  },
  {
    label: "voice & chat agents",
    title: "WhatsApp / Voice bots",
    body: "Inbound qualification, booking, follow-up. Runs 24/7, sounds like your best rep.",
    accent: "#a5f3fc",
  },
  {
    label: "web systems",
    title: "Next.js product builds",
    body: "Fast, SEO-optimised sites wired to real automation backends. Ship in weeks.",
    accent: "#E2E8F0",
  },
  {
    label: "aeo & discoverability",
    title: "AI Engine Optimisation",
    body: "Get cited by ChatGPT, Perplexity, Gemini. The new organic channel.",
    accent: "#c7d2fe",
  },
  {
    label: "missed-lead recovery",
    title: "Follow-up machines",
    body: "Auto-detect dead leads, restart sequences, book meetings — without lifting a finger.",
    accent: "#7DD3FC",
  },
  {
    label: "ops infrastructure",
    title: "Manual ops → systems",
    body: "Map your team's repetitive work. Replace with reliable, observable automation.",
    accent: "#E2E8F0",
  },
];

/* ── selected work ── */
const WORK = [
  {
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    label: "analytics · 2025",
    title: "AI-driven freight ops dashboard",
    desc: "Voice receptionist + WhatsApp intake → n8n → live CRM. Zero missed loads.",
    orientation: "landscape",
  },
  {
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    label: "automation · 2024",
    title: "12-Day email nurture system",
    desc: "Triggered onboarding, segmented by lead source. Conversion lift 3×.",
    orientation: "landscape",
  },
  {
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    label: "aeo · 2026",
    title: "AI engine citation engine",
    desc: "Structured data + entity graphs → cited in 6 AI search tools in 30 days.",
    orientation: "landscape",
  },
  {
    img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    label: "product · 2026",
    title: "SkynetLabs client portal",
    desc: "Next.js + Stripe + auto-onboarding. Client activates in under 4 minutes.",
    orientation: "landscape",
  },
];

/* ── stats ── */
const STATS = [
  { value: "180+", label: "builds shipped" },
  { value: "40+", label: "clients" },
  { value: "9", label: "countries" },
  { value: "2019", label: "operating since" },
];

/* ── GlassCard: tilt + refract on pointer ── */
function GlassCard({
  children,
  className = "",
  style = {},
  intensity = 1,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: cy * 14 * intensity, y: -cx * 14 * intensity });
    },
    [reduced, intensity],
  );

  const handleLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`d37-glass-card ${className}`}
      style={{
        rotateX: reduced ? 0 : tilt.x,
        rotateY: reduced ? 0 : tilt.y,
        transformStyle: "preserve-3d",
        ...style,
      }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.8 }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
    >
      {/* Chromatic border fringing */}
      <div
        className="d37-chroma-border"
        style={{
          opacity: hovered ? 1 : 0.55,
          transition: "opacity 0.3s ease",
        }}
      />
      {children}
    </motion.div>
  );
}

/* ── CountUp ── */
function CountUp({
  target,
  duration = 1.6,
}: {
  target: string;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRef(false);
  const [display, setDisplay] = useState(reduced ? target : "0");

  useEffect(() => {
    if (reduced) return;
    const num = parseInt(target.replace(/\D/g, ""), 10);
    const suffix = target.replace(/[\d]/g, "");
    if (isNaN(num)) {
      setDisplay(target);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView.current) {
          inView.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / (duration * 1000), 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.floor(ease * num) + suffix);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, reduced]);

  return <span ref={ref}>{display}</span>;
}

/* ── FloatingOrb: animated gradient blob ── */
function FloatingOrb({
  color,
  size,
  style,
}: {
  color: string;
  size: number;
  style: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 40% 40%, ${color}44, ${color}00 70%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
        ...style,
      }}
      animate={
        reduced
          ? {}
          : {
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.12, 0.94, 1],
            }
      }
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Design37() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  /* Scroll-driven gradient backplate shift */
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  /* Global pointer displacement for hero */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  const handleGlobalMouse = useCallback(
    (e: MouseEvent) => {
      if (reduced) return;
      const cx = (e.clientX / window.innerWidth - 0.5) * 30;
      const cy = (e.clientY / window.innerHeight - 0.5) * 20;
      mouseX.set(cx);
      mouseY.set(cy);
    },
    [reduced, mouseX, mouseY],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouse);
    return () => window.removeEventListener("mousemove", handleGlobalMouse);
  }, [handleGlobalMouse]);

  /* Displacement scale animation value for SVG filter */
  const [dispScale, setDispScale] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let frame: number;
    let t = 0;
    const tick = () => {
      t += 0.012;
      setDispScale(18 + Math.sin(t) * 10 + Math.cos(t * 0.7) * 6);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        @import url('${FONT_URL}');

        .root-37 {
          font-family: 'Inter', sans-serif;
          background: ${P.bg};
          color: ${P.text};
          min-height: 100vh;
          position: relative;
          z-index: 2;
          overflow-x: hidden;
        }

        .root-37 * { box-sizing: border-box; }

        /* glass card base */
        .d37-glass-card {
          position: relative;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.055) 0%,
            rgba(255,255,255,0.018) 50%,
            rgba(125,211,252,0.04) 100%
          );
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.10);
          overflow: visible;
        }

        /* Chromatic R/G/B fringe border */
        .d37-chroma-border {
          position: absolute;
          inset: -1.5px;
          border-radius: 21px;
          pointer-events: none;
          background: transparent;
          z-index: 0;
          /* Three offset box-shadows simulate chromatic aberration */
          box-shadow:
            0 0 0 1px rgba(255,60,60,0.45),
            0 0 0 1.5px rgba(60,255,120,0.0),
            0 0 0 2px rgba(60,140,255,0.35),
            inset 0 1px 0 rgba(255,255,255,0.14),
            0 8px 32px rgba(0,0,0,0.5),
            0 2px 8px rgba(125,211,252,0.12);
          transition: box-shadow 0.3s ease, opacity 0.3s ease;
        }

        .d37-glass-card:hover .d37-chroma-border {
          box-shadow:
            -2px -1px 0 1px rgba(255,60,60,0.55),
            2px 1px 0 1.5px rgba(60,255,120,0.0),
            0 0 0 2.5px rgba(60,140,255,0.5),
            inset 0 1px 0 rgba(255,255,255,0.22),
            0 16px 48px rgba(0,0,0,0.6),
            0 4px 16px rgba(125,211,252,0.22);
        }

        /* Glass card content above chroma border */
        .d37-glass-inner {
          position: relative;
          z-index: 1;
        }

        /* Nav pill */
        .d37-nav-pill {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 32px;
          padding: 12px 28px;
          background: rgba(11, 13, 16, 0.72);
          backdrop-filter: blur(20px) saturate(200%);
          -webkit-backdrop-filter: blur(20px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 100px;
          box-shadow:
            -1px 0 0 0.5px rgba(255,60,60,0.3),
            1px 0 0 0.5px rgba(60,140,255,0.3),
            0 8px 32px rgba(0,0,0,0.5);
        }

        .d37-nav-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: ${P.muted};
          text-decoration: none;
          letter-spacing: 0.08em;
          transition: color 0.2s;
        }

        .d37-nav-link:hover,
        .d37-nav-link:focus-visible {
          color: ${P.text};
          outline: none;
        }

        .d37-nav-cta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: ${P.bg};
          background: ${P.accent};
          padding: 7px 16px;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }

        .d37-nav-cta:hover,
        .d37-nav-cta:focus-visible {
          background: #a5f3fc;
          box-shadow: 0 0 20px rgba(125,211,252,0.4);
          outline: none;
        }

        /* Skip link */
        .d37-skip {
          position: fixed;
          top: -100px;
          left: 16px;
          z-index: 9999;
          background: ${P.accent};
          color: ${P.bg};
          padding: 8px 16px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          transition: top 0.2s;
          text-decoration: none;
        }
        .d37-skip:focus {
          top: 16px;
          outline: 2px solid ${P.accent};
          outline-offset: 2px;
        }

        /* Mono label */
        .d37-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: lowercase;
          color: ${P.accent};
          display: block;
          margin-bottom: 10px;
        }

        /* Bento grid */
        .d37-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .d37-bento { grid-template-columns: repeat(2, 1fr); }
          .d37-bento-wide { grid-column: span 2 !important; }
        }
        @media (max-width: 600px) {
          .d37-bento { grid-template-columns: 1fr; }
          .d37-bento-wide { grid-column: span 1 !important; }
          .d37-nav-pill { gap: 16px; padding: 10px 16px; }
          .d37-nav-link { display: none; }
        }

        /* Work grid */
        .d37-work-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 700px) {
          .d37-work-grid { grid-template-columns: 1fr; }
        }

        /* Section */
        .d37-section {
          padding: 96px 0;
        }
        .d37-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Stats row */
        .d37-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 700px) {
          .d37-stats-row { grid-template-columns: repeat(2, 1fr); }
        }

        /* About split */
        .d37-about-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 800px) {
          .d37-about-split { grid-template-columns: 1fr; }
        }

        /* Divider */
        .d37-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 0;
        }

        /* Noise texture overlay on glass */
        .d37-noise {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          pointer-events: none;
          z-index: 0;
        }

        /* Scrollbar */
        .root-37 ::-webkit-scrollbar { width: 4px; }
        .root-37 ::-webkit-scrollbar-track { background: transparent; }
        .root-37 ::-webkit-scrollbar-thumb { background: rgba(125,211,252,0.2); border-radius: 4px; }
      `}</style>

      {/* SVG filters — render once, invisible */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <defs>
          {/* Liquid glass displacement filter */}
          <filter id={FILTER_ID} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="3"
              seed="8"
              result="noise"
            >
              {!reduced && (
                <animate
                  attributeName="baseFrequency"
                  values="0.012 0.018;0.018 0.012;0.012 0.018"
                  dur="14s"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={reduced ? 0 : dispScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.4" />
          </filter>

          {/* Chromatic aberration filter (edge fringe) */}
          <filter
            id={CHROMATIC_ID}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feOffset in="red" dx="-2" dy="-1" result="red-shift" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feOffset in="blue" dx="2" dy="1" result="blue-shift" />
            <feBlend
              in="red-shift"
              in2="blue-shift"
              mode="screen"
              result="chroma"
            />
            <feBlend in="SourceGraphic" in2="chroma" mode="screen" />
          </filter>
        </defs>
      </svg>

      <div className="root-37" ref={containerRef}>
        {/* Skip to content */}
        <a href="#main-content" className="d37-skip">
          skip to content
        </a>

        {/* ── Sticky glass nav pill ── */}
        <nav className="d37-nav-pill" aria-label="Primary navigation">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: P.text,
              letterSpacing: "0.04em",
            }}
          >
            skynetlabs
          </span>
          <a href="#services" className="d37-nav-link">
            services
          </a>
          <a href="#work" className="d37-nav-link">
            work
          </a>
          <a href="#about" className="d37-nav-link">
            about
          </a>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="d37-nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            book call →
          </a>
        </nav>

        {/* ── Moving gradient backplate ── */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            x: bgX,
            y: bgY,
            background: `
              radial-gradient(ellipse 70% 60% at 20% 15%, rgba(125,211,252,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 80%, rgba(99,102,241,0.10) 0%, transparent 55%),
              radial-gradient(ellipse 80% 70% at 50% 50%, rgba(16,20,26,1) 30%, ${P.bg} 100%)
            `,
            pointerEvents: "none",
          }}
        />

        {/* Ambient orbs */}
        <FloatingOrb
          color="#7DD3FC"
          size={480}
          style={{ top: "5%", left: "-8%", zIndex: 0 }}
        />
        <FloatingOrb
          color="#6366f1"
          size={360}
          style={{ top: "40%", right: "-6%", zIndex: 0 }}
        />
        <FloatingOrb
          color="#38bdf8"
          size={300}
          style={{ bottom: "10%", left: "30%", zIndex: 0 }}
        />

        <main id="main-content" style={{ position: "relative", zIndex: 1 }}>
          {/* ════════════════════════════════════
              HERO
          ════════════════════════════════════ */}
          <section
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              paddingTop: 80,
            }}
            aria-labelledby="d37-hero-h1"
          >
            <div className="d37-container" style={{ width: "100%" }}>
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ maxWidth: 760 }}
              >
                <motion.span variants={fadeUp} className="d37-label">
                  // skynetlabs · automation engineering
                </motion.span>

                <motion.h1
                  id="d37-hero-h1"
                  variants={fadeUp}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(2.6rem, 6vw, 5.2rem)",
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    color: P.text,
                    margin: "0 0 24px",
                  }}
                >
                  automation that feels{" "}
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${P.accent} 0%, #a5f3fc 40%, ${P.accent2} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: reduced ? "none" : `url(#${CHROMATIC_ID})`,
                      display: "inline-block",
                    }}
                  >
                    engineered,
                  </span>{" "}
                  <br />
                  not duct-taped.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    color: P.muted,
                    lineHeight: 1.7,
                    maxWidth: 540,
                    margin: "0 0 40px",
                  }}
                >
                  180+ builds · 40+ clients · 9 countries · since 2019. I build
                  AI + automation systems that kill busywork — missed leads,
                  dead follow-ups, manual ops.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px 28px",
                      borderRadius: 100,
                      background: P.accent,
                      color: P.bg,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      fontWeight: 400,
                      letterSpacing: "0.04em",
                      textDecoration: "none",
                      transition: "background 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "#a5f3fc";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                        "0 0 28px rgba(125,211,252,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        P.accent;
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                        "none";
                    }}
                  >
                    book 30-min call
                    <span style={{ fontSize: 16 }}>→</span>
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "14px 24px",
                      borderRadius: 100,
                      border: `1px solid rgba(255,255,255,0.12)`,
                      color: P.muted,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textDecoration: "none",
                      transition: "color 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        P.text;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "rgba(255,255,255,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        P.muted;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "rgba(255,255,255,0.12)";
                    }}
                  >
                    github ↗
                  </a>
                </motion.div>
              </motion.div>

              {/* Hero floating glass card — refracted */}
              <motion.div
                style={{
                  position: "absolute",
                  right: "max(2vw, 20px)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "clamp(220px, 28vw, 380px)",
                  display: "none",
                }}
                className="d37-hero-float"
                animate={reduced ? {} : { y: [0, -16, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Hidden on small — handled via CSS below */}
              </motion.div>
            </div>
          </section>

          {/* ── Inline hero image (desktop right) via CSS trick ── */}
          <style>{`
            @media (min-width: 1000px) {
              #d37-hero-img-wrap {
                position: absolute;
                right: max(3vw, 40px);
                top: 50%;
                transform: translateY(-50%);
                width: clamp(200px, 26vw, 360px);
                display: block !important;
                pointer-events: none;
              }
            }
          `}</style>
          <div
            id="d37-hero-img-wrap"
            style={{ display: "none", position: "absolute", zIndex: 2 }}
          >
            <GlassCard style={{ borderRadius: 24, overflow: "hidden" }}>
              <div className="d37-glass-inner">
                <img
                  src="/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg"
                  alt="Waseem Nasir — founder, SkynetLabs"
                  style={{
                    width: "100%",
                    display: "block",
                    filter: reduced ? "none" : `url(#${FILTER_ID})`,
                    transition: "filter 0.4s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px 16px 16px",
                    background:
                      "linear-gradient(to top, rgba(11,13,16,0.92) 0%, transparent 100%)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: P.accent,
                      display: "block",
                    }}
                  >
                    waseem nasir · bali / lahore
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ════════════════════════════════════
              STATS
          ════════════════════════════════════ */}
          <section
            className="d37-section"
            style={{ paddingTop: 48 }}
            aria-label="Proof numbers"
          >
            <div className="d37-container">
              <hr className="d37-divider" style={{ marginBottom: 48 }} />
              <motion.div
                className="d37-stats-row"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                {STATS.map((s) => (
                  <motion.div key={s.label} variants={fadeUp}>
                    <GlassCard
                      style={{ padding: "28px 24px", textAlign: "center" }}
                    >
                      <div className="d37-glass-inner d37-noise" />
                      <div className="d37-glass-inner">
                        <div
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            color: P.accent,
                            lineHeight: 1,
                            marginBottom: 8,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          <CountUp target={s.value} />
                        </div>
                        <span className="d37-label" style={{ marginBottom: 0 }}>
                          {s.label}
                        </span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
              <hr className="d37-divider" style={{ marginTop: 48 }} />
            </div>
          </section>

          {/* ════════════════════════════════════
              SERVICES — bento grid
          ════════════════════════════════════ */}
          <section
            id="services"
            className="d37-section"
            aria-labelledby="d37-services-h2"
          >
            <div className="d37-container">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
                <motion.span variants={fadeUp} className="d37-label">
                  // what i build
                </motion.span>
                <motion.h2
                  id="d37-services-h2"
                  variants={fadeUp}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    letterSpacing: "-0.025em",
                    color: P.text,
                    marginBottom: 48,
                    lineHeight: 1.15,
                  }}
                >
                  systems that replace
                  <br />
                  people doing manual work.
                </motion.h2>

                <motion.div className="d37-bento" variants={stagger}>
                  {/* Large hero service card */}
                  <motion.div
                    variants={fadeUp}
                    style={{ gridColumn: "span 2" }}
                    className="d37-bento-wide"
                  >
                    <GlassCard
                      style={{ padding: 0, overflow: "hidden", height: 320 }}
                    >
                      <div className="d37-noise" />
                      <div
                        className="d37-glass-inner"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          height: "100%",
                          gap: 0,
                        }}
                      >
                        <div
                          style={{
                            padding: "36px 32px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                          }}
                        >
                          <span className="d37-label">// flagship</span>
                          <h3
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 700,
                              fontSize: "1.6rem",
                              color: P.text,
                              letterSpacing: "-0.02em",
                              margin: "0 0 12px",
                            }}
                          >
                            AI automation{" "}
                            <span style={{ color: P.accent }}>
                              that runs ops
                            </span>
                          </h3>
                          <p
                            style={{
                              color: P.muted,
                              fontSize: "0.9rem",
                              lineHeight: 1.65,
                              margin: 0,
                            }}
                          >
                            n8n pipelines. WhatsApp bots. Voice agents. CRM
                            sync. All wired together. All observable. Zero duct
                            tape.
                          </p>
                        </div>
                        <div
                          style={{ overflow: "hidden", position: "relative" }}
                        >
                          <img
                            src="/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg"
                            alt="Dual-laptop analytics workflow"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              filter: reduced
                                ? "none"
                                : `url(#${FILTER_ID}) brightness(0.85)`,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(to right, rgba(16,20,26,0.7) 0%, transparent 50%)",
                            }}
                          />
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Remaining service cards */}
                  {SERVICES.slice(1).map((svc, i) => (
                    <motion.div key={svc.label} variants={fadeUp}>
                      <GlassCard
                        style={{
                          padding: "28px 24px",
                          height: "100%",
                          minHeight: 200,
                        }}
                      >
                        <div className="d37-noise" />
                        <div
                          className="d37-glass-inner"
                          style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <span className="d37-label">{svc.label}</span>
                          <h3
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              fontSize: "1.05rem",
                              color: P.text,
                              letterSpacing: "-0.015em",
                              margin: "0 0 10px",
                            }}
                          >
                            {svc.title}
                          </h3>
                          <p
                            style={{
                              color: P.muted,
                              fontSize: "0.875rem",
                              lineHeight: 1.65,
                              margin: 0,
                              flex: 1,
                            }}
                          >
                            {svc.body}
                          </p>
                          <div
                            style={{
                              marginTop: 20,
                              width: 32,
                              height: 2,
                              borderRadius: 2,
                              background: svc.accent,
                              boxShadow: `0 0 8px ${svc.accent}88`,
                            }}
                          />
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════
              SELECTED WORK
          ════════════════════════════════════ */}
          <section
            id="work"
            className="d37-section"
            aria-labelledby="d37-work-h2"
          >
            <div className="d37-container">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
                <motion.span variants={fadeUp} className="d37-label">
                  // selected builds
                </motion.span>
                <motion.h2
                  id="d37-work-h2"
                  variants={fadeUp}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    letterSpacing: "-0.025em",
                    color: P.text,
                    marginBottom: 48,
                  }}
                >
                  real work. real clients.
                </motion.h2>

                <motion.div className="d37-work-grid" variants={stagger}>
                  {WORK.map((item, i) => (
                    <motion.div key={item.title} variants={fadeUp}>
                      <GlassCard style={{ overflow: "hidden" }}>
                        <div className="d37-noise" />
                        <div className="d37-glass-inner">
                          <div
                            style={{
                              height: 220,
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <img
                              src={`/img/pro/${item.img}`}
                              alt={item.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center top",
                                filter: reduced
                                  ? "none"
                                  : `url(#${FILTER_ID}) brightness(0.8)`,
                                transition: "transform 0.5s ease",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "linear-gradient(to top, rgba(11,13,16,0.85) 0%, transparent 60%)",
                              }}
                            />
                            <span
                              className="d37-label"
                              style={{
                                position: "absolute",
                                top: 14,
                                left: 14,
                                margin: 0,
                                background: "rgba(11,13,16,0.7)",
                                padding: "4px 10px",
                                borderRadius: 100,
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              {item.label}
                            </span>
                          </div>
                          <div style={{ padding: "20px 22px 24px" }}>
                            <h3
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: "1rem",
                                color: P.text,
                                letterSpacing: "-0.01em",
                                margin: "0 0 8px",
                              }}
                            >
                              {item.title}
                            </h3>
                            <p
                              style={{
                                color: P.muted,
                                fontSize: "0.85rem",
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════
              ABOUT
          ════════════════════════════════════ */}
          <section
            id="about"
            className="d37-section"
            aria-labelledby="d37-about-h2"
          >
            <div className="d37-container">
              <motion.div
                className="d37-about-split"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
                {/* Photo stack */}
                <motion.div
                  variants={fadeUp}
                  style={{ position: "relative", height: 480 }}
                >
                  <GlassCard
                    style={{
                      position: "absolute",
                      width: "75%",
                      top: 0,
                      left: 0,
                      overflow: "hidden",
                      borderRadius: 20,
                    }}
                    intensity={0.6}
                  >
                    <div className="d37-glass-inner">
                      <img
                        src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                        alt="Waseem Nasir — balcony portrait"
                        style={{
                          width: "100%",
                          display: "block",
                          height: 340,
                          objectFit: "cover",
                          objectPosition: "top",
                          filter: reduced
                            ? "none"
                            : `url(#${FILTER_ID}) brightness(0.9)`,
                        }}
                      />
                    </div>
                  </GlassCard>
                  <GlassCard
                    style={{
                      position: "absolute",
                      width: "55%",
                      bottom: 0,
                      right: 0,
                      overflow: "hidden",
                      borderRadius: 16,
                    }}
                    intensity={0.8}
                  >
                    <div className="d37-glass-inner">
                      <img
                        src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                        alt="Waseem working at Bali terrace cafe"
                        style={{
                          width: "100%",
                          display: "block",
                          height: 200,
                          objectFit: "cover",
                          objectPosition: "center",
                          filter: reduced
                            ? "none"
                            : `url(#${FILTER_ID}) brightness(0.85)`,
                        }}
                      />
                    </div>
                  </GlassCard>

                  {/* Floating accent card */}
                  <motion.div
                    style={{
                      position: "absolute",
                      top: "38%",
                      right: "-10%",
                      zIndex: 3,
                    }}
                    animate={reduced ? {} : { y: [0, -10, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <GlassCard style={{ padding: "14px 18px", minWidth: 160 }}>
                      <div className="d37-glass-inner">
                        <span className="d37-label" style={{ marginBottom: 4 }}>
                          remote-first
                        </span>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: P.muted,
                          }}
                        >
                          bali / lahore / anywhere
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </motion.div>

                {/* Text */}
                <motion.div variants={fadeUp}>
                  <span className="d37-label">// who builds this</span>
                  <h2
                    id="d37-about-h2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                      letterSpacing: "-0.025em",
                      color: P.text,
                      margin: "0 0 20px",
                      lineHeight: 1.2,
                    }}
                  >
                    Waseem Nasir
                    <br />
                    <span style={{ color: P.muted, fontWeight: 400 }}>
                      founder, SkynetLabs
                    </span>
                  </h2>
                  <p
                    style={{
                      color: P.muted,
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      margin: "0 0 20px",
                    }}
                  >
                    Independent builder. Since 2019 I've shipped 180+ automation
                    systems for clients across 9 countries — from US freight ops
                    to Singapore trades to Bali clinics. The work is always the
                    same: find the busywork, kill it, replace it with something
                    that runs reliably without you.
                  </p>
                  <p
                    style={{
                      color: P.muted,
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      margin: "0 0 32px",
                    }}
                  >
                    Stack: n8n · Next.js · OpenAI · WhatsApp Business API ·
                    Stripe. I work remote, usually from Bali or Lahore.
                    Async-first, no retainer theatre.
                  </p>

                  {/* Mini photo strip */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
                    {[
                      "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                      "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                      "TRAVEL-google-office-sign-cream-outfit.jpg",
                    ].map((img, i) => (
                      <div
                        key={i}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 12,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.08)",
                          flex: "0 0 auto",
                        }}
                      >
                        <img
                          src={`/img/pro/${img}`}
                          alt={`Waseem — moment ${i + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: reduced
                              ? "none"
                              : `url(#${FILTER_ID}) brightness(0.8)`,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://skynetjoe.com/discovery-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px 28px",
                      borderRadius: 100,
                      background: P.accent,
                      color: P.bg,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "background 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "#a5f3fc";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                        "0 0 28px rgba(125,211,252,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        P.accent;
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                        "none";
                    }}
                  >
                    book 30-min call →
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════
              LIFESTYLE / SOCIAL PROOF GALLERY
          ════════════════════════════════════ */}
          <section
            className="d37-section"
            style={{ paddingTop: 0, paddingBottom: 80 }}
            aria-label="Work from anywhere gallery"
          >
            <div className="d37-container">
              <motion.span
                className="d37-label"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                // work from anywhere
              </motion.span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                {[
                  {
                    src: "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
                    alt: "Night beach cafe session",
                    h: 220,
                  },
                  {
                    src: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                    alt: "Rooftop cafe work session",
                    h: 220,
                  },
                  {
                    src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                    alt: "Mountain view rooftop laptop",
                    h: 220,
                  },
                  {
                    src: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                    alt: "Night coworking team",
                    h: 220,
                  },
                  {
                    src: "CAFE-WORK-2024-06-13-hotel-cafe-selfie-blue-polo-coffee.jpg",
                    alt: "Hotel cafe work selfie",
                    h: 220,
                  },
                ].map((photo, i) => (
                  <motion.div
                    key={photo.src}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    style={{
                      borderRadius: 14,
                      overflow: "hidden",
                      height: photo.h,
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <img
                      src={`/img/pro/${photo.src}`}
                      alt={photo.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        filter: reduced
                          ? "none"
                          : `url(#${FILTER_ID}) brightness(0.75) saturate(1.1)`,
                        transition: "transform 0.4s ease",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════
              CTA
          ════════════════════════════════════ */}
          <section
            className="d37-section"
            style={{ paddingTop: 80, paddingBottom: 100 }}
            aria-labelledby="d37-cta-h2"
          >
            <div className="d37-container" style={{ textAlign: "center" }}>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                <GlassCard
                  style={{
                    padding: "72px 48px",
                    maxWidth: 680,
                    margin: "0 auto",
                    background: `linear-gradient(135deg,
                      rgba(125,211,252,0.07) 0%,
                      rgba(255,255,255,0.03) 50%,
                      rgba(99,102,241,0.06) 100%
                    )`,
                  }}
                >
                  <div className="d37-noise" />
                  <div className="d37-glass-inner">
                    <motion.span variants={fadeUp} className="d37-label">
                      // ready to ship
                    </motion.span>
                    <motion.h2
                      id="d37-cta-h2"
                      variants={fadeUp}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                        letterSpacing: "-0.025em",
                        color: P.text,
                        margin: "0 0 16px",
                        lineHeight: 1.15,
                      }}
                    >
                      got a process
                      <br />
                      worth automating?
                    </motion.h2>
                    <motion.p
                      variants={fadeUp}
                      style={{
                        color: P.muted,
                        fontSize: "1rem",
                        lineHeight: 1.7,
                        margin: "0 0 36px",
                        maxWidth: 400,
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      30 minutes. I'll map what you have, identify the
                      highest-leverage automation, and tell you exactly what it
                      would cost to build.
                    </motion.p>
                    <motion.div variants={fadeUp}>
                      <a
                        href="https://skynetjoe.com/discovery-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "16px 36px",
                          borderRadius: 100,
                          background: P.accent,
                          color: P.bg,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 14,
                          letterSpacing: "0.03em",
                          textDecoration: "none",
                          fontWeight: 400,
                          boxShadow: "0 0 0 rgba(125,211,252,0)",
                          transition:
                            "background 0.2s, box-shadow 0.3s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.background = "#a5f3fc";
                          el.style.boxShadow =
                            "0 0 40px rgba(125,211,252,0.55)";
                          el.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.background = P.accent;
                          el.style.boxShadow = "0 0 0 rgba(125,211,252,0)";
                          el.style.transform = "translateY(0)";
                        }}
                      >
                        book discovery call
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "rgba(11,13,16,0.2)",
                            fontSize: 14,
                          }}
                        >
                          →
                        </span>
                      </a>
                    </motion.div>
                    <motion.p
                      variants={fadeUp}
                      style={{
                        marginTop: 20,
                        color: P.muted,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                      }}
                    >
                      no pitch deck. no sales team. just waseem.
                    </motion.p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </section>

          {/* ════════════════════════════════════
              FOOTER
          ════════════════════════════════════ */}
          <footer
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "40px 0",
            }}
            aria-label="Footer"
          >
            <div
              className="d37-container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: P.muted,
                    letterSpacing: "0.04em",
                  }}
                >
                  skynetlabs © 2019–2026
                </span>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: P.muted,
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = P.text;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      P.muted;
                  }}
                >
                  github ↗
                </a>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: P.accent,
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                  }}
                >
                  book call ↗
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
