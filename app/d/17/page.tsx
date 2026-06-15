"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   DESIGN 17 — Chrome Keychain
   Y2K-revival / liquid-metal sticker UI
   palette: #C8D2DC bg · #EAF0F4 surface · #0A0E12 text
            #5B6672 muted · #B6FF00 accent · #FF45A3 accent2
   fonts:   Bricolage Grotesque 700/800 · Inter Tight 400/500 · DM Mono 400/500
   motion:  floating chrome trinket pendulum on pointer · glossy press buttons
   layout:  vertical asymmetric scattered-object hero · frosted cards · draggable stickers
──────────────────────────────────────────────────────────────────── */

const CTA = "https://skynetjoe.com/discovery-call";
const GITHUB = "https://github.com/waseemnasir2k26";

/* ── Chrome gradient helper ── */
const CHROME_CONIC = `conic-gradient(
  from 180deg at 50% 50%,
  #fff 0deg, #d4dde4 30deg, #a8b8c4 60deg,
  #7c9aab 90deg, #5b7a8d 120deg, #8fafc0 150deg,
  #c2d4de 180deg, #eaf0f4 210deg, #fff 240deg,
  #d0dce6 270deg, #9ab0bd 300deg, #c8d6df 330deg,
  #fff 360deg
)`;

const CHROME_RING = `conic-gradient(
  from 90deg at 50% 50%,
  #b6ff00 0deg, #7ec800 40deg, #4a8c00 80deg,
  #7ec800 120deg, #b6ff00 160deg, #d4ff4d 200deg,
  #b6ff00 240deg, #8fd400 280deg, #b6ff00 320deg,
  #d4ff4d 360deg
)`;

const CHROME_PINK = `conic-gradient(
  from 45deg at 50% 50%,
  #ff45a3 0deg, #c4006e 45deg, #8a004e 90deg,
  #c4006e 135deg, #ff45a3 180deg, #ff7ec5 225deg,
  #ff45a3 270deg, #d4006e 315deg, #ff45a3 360deg
)`;

/* ── Services ── */
const SERVICES = [
  {
    tag: "AUTOMATION",
    title: "n8n Pipelines",
    body: "Dead follow-ups resurrected. Missed leads caught before they ghost. Manual ops automated overnight — runs while you sleep, scales on zero headcount.",
    icon: "⚡",
  },
  {
    tag: "BUILDS",
    title: "Next.js Systems",
    body: "Not a theme. Architecture. Sub-2s LCP, SSR, edge-ready. The kind of web app that prints trust before the visitor reads a word.",
    icon: "🔩",
  },
  {
    tag: "PRESENCE",
    title: "AEO & Visibility",
    body: "Get cited by GPT-4, Perplexity, Gemini. Structured data done properly — your brand in the answer, not just the results.",
    icon: "📡",
  },
  {
    tag: "BOTS",
    title: "WhatsApp & Voice",
    body: "24/7 lead qualification that never calls in sick. WhatsApp auto-responders + voice agents replacing the busiest inbox you own.",
    icon: "🤖",
  },
];

/* ── Projects ── */
const WORK = [
  {
    label: "AI Receptionist",
    desc: "WhatsApp + Voice bot for a freight logistics company — killed 80% of manual inquiry handling.",
    tag: "Automation",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  },
  {
    label: "Stripe Funnel",
    desc: "$27 product funnel — Next.js, live in 5 days. Payments, thank-you flow, client self-service.",
    tag: "Next.js",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  },
  {
    label: "AEO Engine v0.7",
    desc: "Full Answer Engine Optimisation stack — brand cited across Perplexity, GPT, Gemini within weeks.",
    tag: "AEO",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  },
  {
    label: "Email Outreach Engine",
    desc: "n8n automation for a SaaS company — 3-step nurture sequence, Gmail-safe rate limiting, OpenAI-copy.",
    tag: "n8n",
    img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  },
];

/* ── Stats ── */
const STATS = [
  { value: "180+", label: "Builds shipped" },
  { value: "40+", label: "Clients served" },
  { value: "9", label: "Countries worked from" },
  { value: "2019", label: "In operation since" },
];

/* ── Sticker data ── */
const STICKERS = [
  {
    label: "Y2K",
    bg: CHROME_CONIC,
    color: "#0A0E12",
    top: "12%",
    left: "68%",
    rotate: -12,
    size: 88,
  },
  {
    label: "AI",
    bg: CHROME_RING,
    color: "#0A0E12",
    top: "28%",
    left: "80%",
    rotate: 8,
    size: 72,
  },
  {
    label: "BOT",
    bg: CHROME_PINK,
    color: "#fff",
    top: "52%",
    left: "74%",
    rotate: -5,
    size: 80,
  },
  {
    label: "n8n",
    bg: CHROME_CONIC,
    color: "#0A0E12",
    top: "70%",
    left: "82%",
    rotate: 14,
    size: 68,
  },
];

/* ── Keychain trinket ── */
function ChromeTrinket({
  size,
  bg,
  label,
  color,
  delay = 0,
  pointerX,
  pointerY,
  baseX,
  baseY,
}: {
  size: number;
  bg: string;
  label: string;
  color: string;
  delay?: number;
  pointerX: number;
  pointerY: number;
  baseX: string | number;
  baseY: string | number;
}) {
  const reduced = useReducedMotion();

  const tiltX = reduced ? 0 : (pointerY - 0.5) * -20;
  const tiltY = reduced ? 0 : (pointerX - 0.5) * 20;
  const offsetX = reduced ? 0 : (pointerX - 0.5) * 28;
  const offsetY = reduced ? 0 : (pointerY - 0.5) * 18;

  return (
    <motion.div
      style={{
        position: "absolute",
        top: baseY,
        left: baseX,
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        boxShadow: `0 4px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 0 2px rgba(255,255,255,0.18)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: size * 0.24,
        color,
        cursor: "default",
        userSelect: "none",
        letterSpacing: "0.04em",
        zIndex: 4,
      }}
      animate={
        reduced
          ? {}
          : {
              x: offsetX,
              y: offsetY,
              rotateX: tiltX,
              rotateY: tiltY,
              rotate: [
                delay % 2 === 0 ? -3 : 3,
                delay % 2 === 0 ? 3 : -3,
                delay % 2 === 0 ? -3 : 3,
              ],
            }
      }
      transition={{
        x: { type: "spring", stiffness: 60, damping: 18 },
        y: { type: "spring", stiffness: 60, damping: 18 },
        rotateX: { type: "spring", stiffness: 60, damping: 18 },
        rotateY: { type: "spring", stiffness: 60, damping: 18 },
        rotate: {
          duration: 3 + delay * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.4,
        },
      }}
    >
      {label}
    </motion.div>
  );
}

/* ── Draggable sticker ── */
function DraggableSticker({
  label,
  bg,
  color,
  initX,
  initY,
  rotate,
}: {
  label: string;
  bg: string;
  color: string;
  initX: number;
  initY: number;
  rotate: number;
}) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState(false);

  return (
    <motion.div
      drag={!reduced}
      dragMomentum={false}
      initial={{ x: initX, y: initY, rotate, scale: 1 }}
      whileDrag={{ scale: 1.12, zIndex: 99 }}
      whileTap={{ scale: 0.93 }}
      onTapStart={() => setPressed(true)}
      onTap={() => setPressed(false)}
      onTapCancel={() => setPressed(false)}
      style={{
        position: "absolute",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 20px",
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: "0.06em",
        boxShadow: pressed
          ? `0 1px 4px rgba(0,0,0,0.18), inset 0 2px 4px rgba(0,0,0,0.12)`
          : `0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0 2px rgba(255,255,255,0.22)`,
        cursor: "grab",
        userSelect: "none",
        zIndex: 10,
        WebkitUserSelect: "none",
        transition: "box-shadow 0.12s",
      }}
    >
      {label}
    </motion.div>
  );
}

/* ── Glossy pill button ── */
function GlossyButton({
  href,
  children,
  accent = false,
}: {
  href: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  const bg = accent
    ? `linear-gradient(160deg, #cbff33 0%, #b6ff00 40%, #8fd400 100%)`
    : CHROME_CONIC;
  const textColor = accent ? "#0A0E12" : "#0A0E12";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.94, y: 2 }}
      whileHover={{ scale: 1.03 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 32px",
        borderRadius: 999,
        background: bg,
        color: textColor,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: "0.05em",
        textDecoration: "none",
        boxShadow: `0 8px 32px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.65), 0 0 0 2px rgba(255,255,255,0.25)`,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* gloss sheen */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, transparent 100%)",
          borderRadius: "999px 999px 0 0",
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </motion.a>
  );
}

/* ── Frosted card ── */
function FrostedCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "rgba(234,240,244,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1.5px solid rgba(255,255,255,0.6)",
        borderRadius: 20,
        boxShadow:
          "0 4px 32px rgba(10,14,18,0.07), 0 1px 0 rgba(255,255,255,0.55) inset",
        padding: "28px 28px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Count-up hook ── */
function useCountUp(target: string, inView: boolean) {
  const [display, setDisplay] = useState("0");
  const numericMatch = target.match(/(\d+)/);
  const numeric = numericMatch ? parseInt(numericMatch[1]) : 0;
  const suffix = target.replace(/[\d]/g, "");

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(numeric / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(start + suffix);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target, numeric, suffix]);

  return display;
}

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView.current) {
          inView.current = true;
          setVisible(true);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const display = useCountUp(value, visible);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(2.4rem, 6vw, 4rem)",
          background: CHROME_RING,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {display}
      </div>
      <div
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 13,
          color: "#5B6672",
          marginTop: 6,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function Design17ChromeKeychain() {
  const reduced = useReducedMotion();

  /* pointer tracking */
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPointer({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  /* scroll progress */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  /* chain swing positions */
  const trinkets = [
    {
      size: 96,
      bg: CHROME_CONIC,
      label: "2019",
      color: "#0A0E12",
      delay: 0,
      baseX: "72%",
      baseY: "14%",
    },
    {
      size: 72,
      bg: CHROME_RING,
      label: "AI",
      color: "#0A0E12",
      delay: 1,
      baseX: "82%",
      baseY: "30%",
    },
    {
      size: 80,
      bg: CHROME_PINK,
      label: "BOT",
      color: "#fff",
      delay: 2,
      baseX: "76%",
      baseY: "46%",
    },
    {
      size: 64,
      bg: CHROME_CONIC,
      label: "180+",
      color: "#0A0E12",
      delay: 3,
      baseX: "84%",
      baseY: "60%",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..60,700;12..60,800&family=Inter+Tight:wght@400;500&family=DM+Mono:wght@400;500&display=swap');

        .root-17 {
          font-family: 'Inter Tight', sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #0A0E12;
        }

        .root-17 *,
        .root-17 *::before,
        .root-17 *::after {
          box-sizing: border-box;
        }

        .root-17 :focus-visible {
          outline: 3px solid #B6FF00;
          outline-offset: 3px;
          border-radius: 4px;
        }

        /* chrome surface shimmer */
        @keyframes d17-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* chain link line */
        .d17-chain-line {
          position: absolute;
          width: 2px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(182,255,0,0.4), rgba(255,69,163,0.3));
          left: calc(72% + 44px);
          top: 14%;
          height: 52%;
          border-radius: 2px;
          z-index: 3;
          opacity: 0.5;
        }

        /* bubble tag */
        .d17-bubble {
          display: inline-flex;
          align-items: center;
          padding: 4px 14px;
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(182,255,0,0.18);
          color: #3a6600;
          border: 1.5px solid rgba(182,255,0,0.45);
        }

        .d17-bubble.pink {
          background: rgba(255,69,163,0.12);
          color: #8a003a;
          border-color: rgba(255,69,163,0.35);
        }

        /* service card hover */
        .d17-service-card {
          transition: transform 0.22s cubic-bezier(.22,.97,.44,1), box-shadow 0.22s;
        }
        .d17-service-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 48px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.7) inset;
        }

        /* work card hover */
        .d17-work-card {
          transition: transform 0.22s cubic-bezier(.22,.97,.44,1);
          overflow: hidden;
        }
        .d17-work-card:hover {
          transform: translateY(-3px);
        }
        .d17-work-card img {
          transition: transform 0.4s ease;
        }
        .d17-work-card:hover img {
          transform: scale(1.05);
        }

        /* scrollbar */
        .root-17::-webkit-scrollbar { width: 6px; }
        .root-17::-webkit-scrollbar-track { background: #C8D2DC; }
        .root-17::-webkit-scrollbar-thumb { background: #B6FF00; border-radius: 3px; }

        @media (max-width: 768px) {
          .d17-chain-line { display: none; }
          .d17-trinket { display: none; }
        }
      `}</style>

      <div
        className="root-17"
        style={{
          background: "#C8D2DC",
          minHeight: "100vh",
          position: "relative",
          zIndex: 2,
          overflowX: "hidden",
        }}
      >
        {/* ── Scroll progress rail ── */}
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, #B6FF00, #FF45A3)`,
            scaleX,
            transformOrigin: "0%",
            zIndex: 1000,
          }}
        />

        {/* ── Skip link ── */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            top: -40,
            left: 16,
            padding: "8px 16px",
            background: "#B6FF00",
            color: "#0A0E12",
            borderRadius: 8,
            fontWeight: 700,
            zIndex: 9999,
            textDecoration: "none",
            transition: "top 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.top = "16px")}
          onBlur={(e) => (e.currentTarget.style.top = "-40px")}
        >
          Skip to content
        </a>

        {/* ══════════════════════════════
            NAV
        ══════════════════════════════ */}
        <header
          role="banner"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "0 32px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(200,210,220,0.72)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderBottom: "1.5px solid rgba(255,255,255,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: CHROME_CONIC,
                boxShadow:
                  "0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            />
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: "-0.02em",
                color: "#0A0E12",
              }}
            >
              SkynetLabs
            </span>
          </div>

          <nav
            aria-label="Primary navigation"
            style={{ display: "flex", gap: 8 }}
          >
            {["Work", "Services", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#5B6672",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: 999,
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(182,255,0,0.18)";
                  e.currentTarget.style.color = "#3a6600";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#5B6672";
                }}
              >
                {item}
              </a>
            ))}
            <GlossyButton href={CTA} accent>
              Book a call
            </GlossyButton>
          </nav>
        </header>

        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <main id="main-content">
          <section
            aria-label="Hero"
            style={{
              minHeight: "100vh",
              paddingTop: 96,
              paddingBottom: 80,
              paddingLeft: "clamp(24px, 6vw, 80px)",
              paddingRight: "clamp(24px, 6vw, 80px)",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Background texture dots */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(circle, rgba(10,14,18,0.07) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                zIndex: 0,
              }}
            />

            {/* Floating chain line */}
            {!reduced && <div className="d17-chain-line" aria-hidden />}

            {/* Floating trinkets */}
            {!reduced &&
              trinkets.map((t, i) => (
                <div key={i} className="d17-trinket" aria-hidden>
                  <ChromeTrinket
                    size={t.size}
                    bg={t.bg}
                    label={t.label}
                    color={t.color}
                    delay={t.delay}
                    pointerX={pointer.x}
                    pointerY={pointer.y}
                    baseX={t.baseX}
                    baseY={t.baseY}
                  />
                </div>
              ))}

            {/* Draggable stickers (desktop only) */}
            {!reduced && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: "58%",
                    pointerEvents: "all",
                  }}
                >
                  <DraggableSticker
                    label="Y2K MODE"
                    bg={CHROME_CONIC}
                    color="#0A0E12"
                    initX={0}
                    initY={0}
                    rotate={-8}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "65%",
                    left: "55%",
                    pointerEvents: "all",
                  }}
                >
                  <DraggableSticker
                    label="AUTOMATION"
                    bg={CHROME_PINK}
                    color="#fff"
                    initX={0}
                    initY={0}
                    rotate={5}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "78%",
                    left: "70%",
                    pointerEvents: "all",
                  }}
                >
                  <DraggableSticker
                    label="BALI →PKI"
                    bg={CHROME_RING}
                    color="#0A0E12"
                    initX={0}
                    initY={0}
                    rotate={-3}
                  />
                </div>
              </div>
            )}

            {/* Hero content */}
            <div style={{ position: "relative", zIndex: 5, maxWidth: 680 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 0.97, 0.44, 1] }}
              >
                <div className="d17-bubble" style={{ marginBottom: 24 }}>
                  Est. 2019 · 9 Countries · Remote-first
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.22, 0.97, 0.44, 1],
                }}
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.035em",
                  color: "#0A0E12",
                  margin: "0 0 24px",
                }}
              >
                Shiny on the outside.{" "}
                <span
                  style={{
                    background: CHROME_RING,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Ruthless automation
                </span>{" "}
                underneath.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.22,
                  ease: [0.22, 0.97, 0.44, 1],
                }}
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
                  color: "#5B6672",
                  lineHeight: 1.6,
                  maxWidth: 520,
                  margin: "0 0 40px",
                }}
              >
                The future called — it wants its busywork back. 180+ builds
                since 2019. Waseem Nasir / SkynetLabs ships AI systems that
                quietly eat your manual ops.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.34,
                  ease: [0.22, 0.97, 0.44, 1],
                }}
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <GlossyButton href={CTA} accent>
                  Book 30-min call ✦
                </GlossyButton>
                <GlossyButton href={GITHUB}>GitHub →</GlossyButton>
              </motion.div>
            </div>

            {/* Hero portrait — appears right side, overlapping */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              style={{
                position: "absolute",
                right: "clamp(24px, 8vw, 80px)",
                bottom: 0,
                width: "clamp(280px, 36vw, 460px)",
                aspectRatio: "956 / 1700",
                borderRadius: "24px 24px 0 0",
                overflow: "hidden",
                boxShadow:
                  "0 -8px 64px rgba(0,0,0,0.14), 0 0 0 3px rgba(255,255,255,0.35)",
                zIndex: 3,
              }}
            >
              <img
                src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                alt="Waseem Nasir — founder of SkynetLabs, standing on a balcony"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Chrome overlay gloss */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background:
                    "linear-gradient(to bottom, rgba(234,240,244,0.3) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          </section>

          {/* ══════════════════════════════
              STATS / PROOF
          ══════════════════════════════ */}
          <section
            aria-label="Track record"
            id="proof"
            style={{
              background: "#EAF0F4",
              borderTop: "1.5px solid rgba(255,255,255,0.6)",
              borderBottom: "1.5px solid rgba(0,0,0,0.05)",
              padding: "64px clamp(24px,6vw,80px)",
            }}
          >
            <div
              style={{
                maxWidth: 960,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
                gap: 40,
              }}
            >
              {STATS.map((s) => (
                <StatItem key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </section>

          {/* ══════════════════════════════
              SERVICES
          ══════════════════════════════ */}
          <section
            aria-label="Services"
            id="services"
            style={{
              padding: "96px clamp(24px,6vw,80px)",
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 56 }}
            >
              <div className="d17-bubble" style={{ marginBottom: 16 }}>
                What I build
              </div>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  letterSpacing: "-0.03em",
                  color: "#0A0E12",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Systems that run when you&apos;re{" "}
                <span
                  style={{
                    background: CHROME_PINK,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  offline.
                </span>
              </h2>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
                gap: 20,
              }}
            >
              {SERVICES.map((svc, i) => (
                <motion.div
                  key={svc.title}
                  className="d17-service-card"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <FrostedCard>
                    {/* Icon chrome disc */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: i % 2 === 0 ? CHROME_CONIC : CHROME_RING,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        marginBottom: 20,
                        boxShadow:
                          "0 2px 12px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.6)",
                      }}
                      aria-hidden
                    >
                      {svc.icon}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        color: "#5B6672",
                        marginBottom: 8,
                        textTransform: "uppercase",
                      }}
                    >
                      {svc.tag}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 800,
                        fontSize: "1.25rem",
                        color: "#0A0E12",
                        margin: "0 0 12px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {svc.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 14,
                        color: "#5B6672",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {svc.body}
                    </p>
                  </FrostedCard>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════
              SELECTED WORK
          ══════════════════════════════ */}
          <section
            aria-label="Selected work"
            id="work"
            style={{
              background: "#EAF0F4",
              borderTop: "1.5px solid rgba(255,255,255,0.6)",
              padding: "96px clamp(24px,6vw,80px)",
            }}
          >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: 56 }}
              >
                <div className="d17-bubble pink" style={{ marginBottom: 16 }}>
                  Selected builds
                </div>
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 5vw, 3.4rem)",
                    letterSpacing: "-0.03em",
                    color: "#0A0E12",
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  40+ clients. Real builds.
                </h2>
              </motion.div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
                  gap: 24,
                }}
              >
                {WORK.map((w, i) => (
                  <motion.div
                    key={w.label}
                    className="d17-work-card"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    style={{
                      background: "rgba(234,240,244,0.8)",
                      border: "1.5px solid rgba(255,255,255,0.65)",
                      borderRadius: 20,
                      overflow: "hidden",
                      boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ height: 200, overflow: "hidden" }}>
                      <img
                        src={`/img/pro/${w.img}`}
                        alt={w.label}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                    <div style={{ padding: "20px 20px 24px" }}>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#5B6672",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        {w.tag}
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "#0A0E12",
                          margin: "0 0 8px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {w.label}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 13,
                          color: "#5B6672",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {w.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════
              ABOUT
          ══════════════════════════════ */}
          <section
            aria-label="About Waseem Nasir"
            id="about"
            style={{
              padding: "96px clamp(24px,6vw,80px)",
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                alignItems: "center",
              }}
            >
              {/* Photos collage */}
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                style={{ position: "relative" }}
              >
                {/* Main photo */}
                <div
                  style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    boxShadow:
                      "0 8px 48px rgba(0,0,0,0.13), 0 0 0 3px rgba(255,255,255,0.45)",
                    aspectRatio: "1 / 1.2",
                  }}
                >
                  <img
                    src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                    alt="Waseem Nasir working from a Bali terrace with laptop and latte"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                {/* Floating secondary photo */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -28,
                    right: -24,
                    width: "48%",
                    aspectRatio: "1",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow:
                      "0 6px 32px rgba(0,0,0,0.16), 0 0 0 3px rgba(255,255,255,0.6)",
                    border: "3px solid rgba(255,255,255,0.7)",
                    zIndex: 2,
                  }}
                >
                  <img
                    src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                    alt="Waseem Nasir at Nusa Penida cliffs arms spread"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                {/* Chrome badge */}
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    right: 20,
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: CHROME_RING,
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: 10,
                    color: "#0A0E12",
                    textAlign: "center",
                    lineHeight: 1.3,
                    letterSpacing: "0.04em",
                    zIndex: 3,
                  }}
                  aria-hidden
                >
                  BALI
                  <br />
                  2026
                </div>
              </motion.div>

              {/* Copy */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.12 }}
                style={{ paddingTop: 16 }}
              >
                <div className="d17-bubble" style={{ marginBottom: 20 }}>
                  The human behind the machine
                </div>
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    letterSpacing: "-0.03em",
                    color: "#0A0E12",
                    margin: "0 0 20px",
                    lineHeight: 1.15,
                  }}
                >
                  Waseem Nasir
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 15,
                    color: "#5B6672",
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  Independent founder of SkynetLabs. I build AI and automation
                  systems — n8n pipelines, Next.js apps, WhatsApp bots, voice
                  agents, AEO stacks — for clients across 9 countries.
                </p>
                <p
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 15,
                    color: "#5B6672",
                    lineHeight: 1.7,
                    marginBottom: 28,
                  }}
                >
                  Operating since 2019. Remote from Bali and Lahore. I work on
                  the unglamorous stuff — the missed leads, dead follow-ups, and
                  manual ops that quietly drain time and money. Then I automate
                  them.
                </p>

                {/* Mini stat chips */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginBottom: 32,
                  }}
                >
                  {[
                    { val: "180+", txt: "builds" },
                    { val: "40+", txt: "clients" },
                    { val: "9", txt: "countries" },
                  ].map((chip) => (
                    <div
                      key={chip.txt}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 999,
                        background: CHROME_CONIC,
                        boxShadow:
                          "0 2px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 800,
                        fontSize: 14,
                        color: "#0A0E12",
                      }}
                    >
                      <span style={{ color: "#0A0E12" }}>{chip.val}</span>{" "}
                      <span
                        style={{
                          color: "#5B6672",
                          fontWeight: 500,
                          fontSize: 12,
                        }}
                      >
                        {chip.txt}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <GlossyButton href={CTA} accent>
                    Book a discovery call
                  </GlossyButton>
                  <GlossyButton href={GITHUB}>See GitHub</GlossyButton>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════
              PHOTO STRIP
          ══════════════════════════════ */}
          <section
            aria-label="Photo gallery"
            style={{
              background: "#EAF0F4",
              borderTop: "1.5px solid rgba(255,255,255,0.6)",
              padding: "64px 0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                paddingLeft: "clamp(24px,6vw,80px)",
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingBottom: 8,
              }}
            >
              {[
                {
                  file: "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
                  alt: "Waseem laughing at beach",
                },
                {
                  file: "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
                  alt: "Waseem confident arms crossed",
                },
                {
                  file: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  alt: "Waseem on rooftop with laptop and dragonfruit smoothie",
                },
                {
                  file: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                  alt: "Waseem with client, thumbs up and smiles",
                },
                {
                  file: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Waseem at hilltop city vista",
                },
                {
                  file: "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
                  alt: "Waseem smiling with headphones at neon tea sign",
                },
                {
                  file: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                  alt: "Group meetup at Bali coworking cafe",
                },
              ].map((photo, i) => (
                <motion.div
                  key={photo.file}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  style={{
                    flexShrink: 0,
                    width: 220,
                    height: 280,
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow:
                      "0 4px 24px rgba(0,0,0,0.1), 0 0 0 2px rgba(255,255,255,0.5)",
                    border: "2px solid rgba(255,255,255,0.65)",
                    transform: `rotate(${i % 3 === 0 ? -1.5 : i % 3 === 1 ? 1 : -0.5}deg)`,
                  }}
                >
                  <img
                    src={`/img/pro/${photo.file}`}
                    alt={photo.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════
              CTA SECTION
          ══════════════════════════════ */}
          <section
            aria-label="Contact and booking"
            id="contact"
            style={{
              padding: "112px clamp(24px,6vw,80px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative chrome discs */}
            {[
              {
                bg: CHROME_CONIC,
                size: 320,
                top: "-80px",
                left: "-80px",
                opacity: 0.35,
              },
              {
                bg: CHROME_RING,
                size: 240,
                bottom: "-60px",
                right: "-60px",
                opacity: 0.3,
              },
              {
                bg: CHROME_PINK,
                size: 180,
                top: "40%",
                right: "20%",
                opacity: 0.2,
              },
            ].map((disc, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  position: "absolute",
                  width: disc.size,
                  height: disc.size,
                  borderRadius: "50%",
                  background: disc.bg,
                  top: (disc as any).top,
                  bottom: (disc as any).bottom,
                  left: (disc as any).left,
                  right: (disc as any).right,
                  opacity: disc.opacity,
                  filter: "blur(8px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <div
                className="d17-bubble"
                style={{ marginBottom: 24, display: "inline-flex" }}
              >
                Let&apos;s talk
              </div>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
                  letterSpacing: "-0.035em",
                  color: "#0A0E12",
                  margin: "0 auto 20px",
                  lineHeight: 1.05,
                  maxWidth: 680,
                }}
              >
                One call. No pitch deck.{" "}
                <span
                  style={{
                    background: CHROME_RING,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Just diagnosis.
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  color: "#5B6672",
                  lineHeight: 1.65,
                  maxWidth: 480,
                  margin: "0 auto 44px",
                }}
              >
                30 minutes. You tell me what&apos;s eating your team&apos;s
                time. I tell you if I can kill it — and how fast.
              </p>
              <GlossyButton href={CTA} accent>
                Book a 30-min discovery call ✦
              </GlossyButton>

              {/* Contact detail chips */}
              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Bali / Lahore, Remote", mono: true },
                  { label: "40+ clients · 9 countries", mono: true },
                  {
                    label: "github.com/waseemnasir2k26",
                    mono: true,
                    href: GITHUB,
                  },
                ].map((chip) => (
                  <div
                    key={chip.label}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 999,
                      background: "rgba(234,240,244,0.8)",
                      border: "1.5px solid rgba(255,255,255,0.65)",
                      fontFamily: chip.mono
                        ? "'DM Mono', monospace"
                        : "'Inter Tight', sans-serif",
                      fontSize: 12,
                      color: "#5B6672",
                      letterSpacing: "0.05em",
                      boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    {chip.href ? (
                      <a
                        href={chip.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {chip.label}
                      </a>
                    ) : (
                      chip.label
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </main>

        {/* ══════════════════════════════
            FOOTER
        ══════════════════════════════ */}
        <footer
          role="contentinfo"
          style={{
            background: "#0A0E12",
            borderTop: "1.5px solid rgba(255,255,255,0.08)",
            padding: "40px clamp(24px,6vw,80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: CHROME_RING,
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
              aria-hidden
            />
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#EAF0F4",
                letterSpacing: "-0.01em",
              }}
            >
              SkynetLabs
            </span>
          </div>

          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "#5B6672",
              margin: 0,
              letterSpacing: "0.06em",
            }}
          >
            © 2019–2026 Waseem Nasir · SkynetLabs · All rights reserved
          </p>

          <a
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "#B6FF00",
              textDecoration: "none",
              letterSpacing: "0.03em",
            }}
          >
            skynetjoe.com/discovery-call →
          </a>
        </footer>
      </div>
    </>
  );
}
