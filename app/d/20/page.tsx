"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────────
   HYPERPOP COLLAGE — Design 20
   Palette: #FFE600 / #FF5DA2 / #120016 / #7A2E6B / #00FFB3 / #6A00FF
   Fonts: Bagel Fat One / Schibsted Grotesk / Fragment Mono
───────────────────────────────────────────── */

const PALETTE = {
  bg: "#FFE600",
  surface: "#FF5DA2",
  text: "#120016",
  muted: "#7A2E6B",
  accent: "#00FFB3",
  accent2: "#6A00FF",
};

/* Confetti particle type */
interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
  size: number;
  shape: "circle" | "star" | "rect";
}

/* ── Sticker card with spring wobble ── */
function StickerCard({
  children,
  rotate = 0,
  zIndex = 10,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  rotate?: number;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ rotate, zIndex, position: "relative", ...style }}
      whileHover={
        prefersReduced
          ? {}
          : {
              rotate: rotate + (Math.random() > 0.5 ? 3 : -3),
              scale: 1.04,
              zIndex: 999,
            }
      }
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

/* ── Confetti burst on CTA click ── */
function ConfettiBurst({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced || !active) return null;

  const colors = [
    PALETTE.surface,
    PALETTE.accent,
    PALETTE.accent2,
    "#fff",
    PALETTE.bg,
    "#FF0080",
  ];
  const particles: Particle[] = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    angle: (i / 48) * 360,
    speed: 60 + Math.random() * 120,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
    shape: (["circle", "star", "rect"] as const)[i % 3],
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.speed;
        const ty = Math.sin(rad) * p.speed - 60;
        return (
          <motion.div
            key={p.id}
            initial={{ x: "50vw", y: "60vh", opacity: 1, scale: 1 }}
            animate={{
              x: `calc(50vw + ${tx}px)`,
              y: `calc(60vh + ${ty}px)`,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius:
                p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : "0",
              background: p.color,
              clipPath:
                p.shape === "star"
                  ? "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
                  : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Torn paper edge SVG ── */
function TornEdge({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        lineHeight: 0,
        transform: flip ? "scaleY(-1)" : undefined,
        marginTop: flip ? "-1px" : undefined,
        marginBottom: flip ? undefined : "-1px",
      }}
    >
      <svg
        viewBox="0 0 1200 40"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%" }}
      >
        <path
          d="M0,40 L0,20 Q20,2 40,18 Q60,35 80,12 Q100,0 120,22 Q140,38 160,10 Q180,0 200,25 Q220,40 240,15 Q260,2 280,28 Q300,40 320,8 Q340,0 360,20 Q380,38 400,14 Q420,2 440,30 Q460,42 480,10 Q500,0 520,25 Q540,40 560,12 Q580,0 600,22 Q620,38 640,8 Q660,0 680,28 Q700,40 720,14 Q740,0 760,26 Q780,40 800,10 Q820,0 840,24 Q860,38 880,8 Q900,0 920,22 Q940,40 960,14 Q980,2 1000,28 Q1020,42 1040,10 Q1060,0 1080,24 Q1100,40 1120,12 Q1140,0 1160,22 Q1180,38 1200,16 L1200,40 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/* ── Marquee ticker ── */
function Marquee({
  items,
  bg,
  color,
}: {
  items: string[];
  bg: string;
  color: string;
}) {
  const prefersReduced = useReducedMotion();
  const text = items.join("  ★  ");
  return (
    <div
      style={{
        background: bg,
        color,
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "10px 0",
        fontFamily: "'Fragment Mono', monospace",
        fontSize: "0.85rem",
        letterSpacing: "0.05em",
        fontWeight: 400,
      }}
    >
      <motion.div
        animate={prefersReduced ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ display: "inline-block" }}
      >
        {text}
        {"  ★  "}
        {text}
        {"  ★  "}
      </motion.div>
    </div>
  );
}

/* ── Photo sticker ── */
function PhotoSticker({
  src,
  alt,
  rotate,
  style,
}: {
  src: string;
  alt: string;
  rotate: number;
  style?: React.CSSProperties;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      style={{
        rotate,
        position: "absolute",
        border: "6px solid #fff",
        boxShadow: "4px 4px 0 #120016, 8px 8px 0 #6A00FF",
        overflow: "hidden",
        cursor: "grab",
        ...style,
      }}
      whileHover={
        prefersReduced
          ? {}
          : { rotate: rotate + (rotate > 0 ? 3 : -3), scale: 1.06, zIndex: 900 }
      }
      transition={{ type: "spring", stiffness: 350, damping: 16 }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </motion.div>
  );
}

/* ── Number badge ── */
function StatBadge({
  number,
  label,
  bg,
  color,
  rotate,
  style,
}: {
  number: string;
  label: string;
  bg: string;
  color: string;
  rotate: number;
  style?: React.CSSProperties;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      style={{
        rotate,
        background: bg,
        color,
        border: "4px solid #120016",
        boxShadow: "5px 5px 0 #120016",
        borderRadius: "12px",
        padding: "18px 22px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "default",
        ...style,
      }}
      whileHover={
        prefersReduced
          ? {}
          : { rotate: rotate + (rotate > 0 ? 3 : -3), scale: 1.07 }
      }
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <span
        style={{
          fontFamily: "'Bagel Fat One', cursive",
          fontSize: "2.6rem",
          lineHeight: 1,
          display: "block",
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: "'Schibsted Grotesk', sans-serif",
          fontSize: "0.75rem",
          fontWeight: 600,
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ── Service pill ── */
function ServicePill({
  icon,
  label,
  bg,
  color,
  rotate,
}: {
  icon: string;
  label: string;
  bg: string;
  color: string;
  rotate: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      style={{
        rotate,
        background: bg,
        color,
        border: "3px solid #120016",
        boxShadow: "4px 4px 0 #120016",
        borderRadius: "999px",
        padding: "12px 24px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'Schibsted Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: "0.95rem",
        cursor: "default",
        whiteSpace: "nowrap",
      }}
      whileHover={prefersReduced ? {} : { rotate: 0, scale: 1.08, y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 17 }}
    >
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
      {label}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function HyperpopCollage() {
  const [confetti, setConfetti] = useState(false);
  const prefersReduced = useReducedMotion();

  function fireCTA() {
    if (prefersReduced) return;
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1000);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Schibsted+Grotesk:wght@400;600&family=Fragment+Mono&display=swap');

        .root-20 {
          font-family: 'Schibsted Grotesk', sans-serif;
          background: #FFE600;
          color: #120016;
          min-height: 100vh;
          position: relative;
          z-index: 2;
        }

        .root-20 *,
        .root-20 *::before,
        .root-20 *::after {
          box-sizing: border-box;
        }

        .root-20 :focus-visible {
          outline: 3px solid #6A00FF;
          outline-offset: 3px;
        }

        .root-20 .cta-btn {
          display: inline-block;
          background: #120016;
          color: #FFE600;
          font-family: 'Bagel Fat One', cursive;
          font-size: 1.2rem;
          letter-spacing: 0.04em;
          padding: 18px 38px;
          border-radius: 999px;
          border: 4px solid #120016;
          box-shadow: 6px 6px 0 #6A00FF, 12px 12px 0 #00FFB3;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.12s, box-shadow 0.12s;
          position: relative;
          z-index: 10;
        }
        .root-20 .cta-btn:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 #6A00FF, 18px 18px 0 #00FFB3;
        }
        .root-20 .cta-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #6A00FF, 4px 4px 0 #00FFB3;
        }

        .root-20 .section-label {
          font-family: 'Fragment Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.65;
        }

        .root-20 .display-font {
          font-family: 'Bagel Fat One', cursive;
        }

        .root-20 .grid-collage {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        @keyframes d20-wobble {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes d20-pulse-border {
          0%, 100% { border-color: #6A00FF; }
          50% { border-color: #00FFB3; }
        }

        .root-20 .jiggle {
          animation: d20-wobble 2.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .root-20 .jiggle { animation: none; }
        }

        @media (max-width: 768px) {
          .root-20 .hero-grid { flex-direction: column !important; }
          .root-20 .collage-zone { height: 360px !important; }
          .root-20 .stats-row { flex-wrap: wrap !important; justify-content: center !important; }
          .root-20 .services-flex { flex-wrap: wrap !important; }
        }
      `}</style>

      <div className="root-20">
        {/* ── CONFETTI ── */}
        <ConfettiBurst active={confetti} />

        {/* ── NAV ── */}
        <nav
          aria-label="Site navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 32px",
            borderBottom: "3px solid #120016",
            background: PALETTE.bg,
            position: "sticky",
            top: 0,
            zIndex: 200,
          }}
        >
          <motion.span
            className="display-font"
            style={{
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              color: PALETTE.text,
            }}
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            SkynetLabs<span style={{ color: PALETTE.surface }}>.</span>
          </motion.span>

          <div style={{ display: "flex", gap: 12 }}>
            {["Work", "Services", "About", "Contact"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: "'Schibsted Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: PALETTE.text,
                  textDecoration: "none",
                  background: [
                    PALETTE.surface,
                    PALETTE.accent2,
                    PALETTE.accent,
                    "#fff",
                  ][i],
                  border: "2px solid #120016",
                  borderRadius: "999px",
                  padding: "6px 16px",
                  boxShadow: "2px 2px 0 #120016",
                }}
                whileHover={prefersReduced ? {} : { y: -2, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </nav>

        {/* ── MARQUEE #1 ── */}
        <Marquee
          items={[
            "AI AUTOMATION",
            "n8n WORKFLOWS",
            "CHATBOTS",
            "NEXT.JS",
            "AEO",
            "WHATSAPP BOTS",
            "180+ BUILDS",
            "SINCE 2019",
          ]}
          bg={PALETTE.surface}
          color="#fff"
        />

        {/* ── HERO ── */}
        <section
          aria-labelledby="hero-heading"
          style={{
            position: "relative",
            padding: "60px 32px 0",
            overflow: "hidden",
            background: PALETTE.bg,
          }}
        >
          <div
            className="hero-grid"
            style={{
              display: "flex",
              gap: 40,
              alignItems: "flex-start",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {/* LEFT: text collage */}
            <div
              style={{ flex: "1 1 500px", position: "relative", zIndex: 10 }}
            >
              <motion.div
                className="section-label"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: PALETTE.accent2,
                  color: "#fff",
                  border: "2px solid #120016",
                  borderRadius: "999px",
                  padding: "4px 16px",
                  display: "inline-block",
                  marginBottom: 24,
                }}
              >
                ✦ Available for new projects ✦
              </motion.div>

              <motion.h1
                id="hero-heading"
                className="display-font"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5.2rem)",
                  lineHeight: 1.05,
                  margin: "0 0 8px",
                  color: PALETTE.text,
                }}
              >
                Too much{" "}
                <span
                  style={{
                    background: PALETTE.surface,
                    color: "#fff",
                    padding: "0 12px",
                    borderRadius: 8,
                    display: "inline-block",
                    transform: "rotate(-1.5deg)",
                  }}
                >
                  to do?
                </span>
              </motion.h1>

              <motion.div
                className="display-font"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
                  lineHeight: 1.05,
                  marginBottom: 28,
                  color: PALETTE.accent2,
                  textShadow: "3px 3px 0 #120016",
                }}
              >
                Good. I automate{" "}
                <span
                  style={{
                    background: PALETTE.accent,
                    color: PALETTE.text,
                    padding: "0 10px",
                    borderRadius: 8,
                    display: "inline-block",
                    transform: "rotate(1deg)",
                  }}
                >
                  the chaos.
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                style={{
                  fontFamily: "'Schibsted Grotesk', sans-serif",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  maxWidth: 500,
                  marginBottom: 36,
                  color: PALETTE.muted,
                  fontWeight: 600,
                }}
              >
                Chronically online, professionally automated.{" "}
                <span style={{ color: PALETTE.text }}>
                  180+ builds since 2019.
                </span>{" "}
                n8n workflows, AI voice bots, WhatsApp automations — shipped
                from cafes in Bali to co-works in Lahore.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.5,
                }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="cta-btn"
                  onClick={fireCTA}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a free 30-min call ✦
                </a>
              </motion.div>

              {/* mini stickers row */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 28,
                  flexWrap: "wrap",
                }}
              >
                {[
                  "n8n certified",
                  "remote-first",
                  "9 countries",
                  "since 2019",
                ].map((tag, i) => (
                  <StickerCard
                    key={tag}
                    rotate={[-2, 1.5, -1, 2][i]}
                    style={{
                      background: [
                        PALETTE.accent,
                        "#fff",
                        PALETTE.surface,
                        PALETTE.accent2,
                      ][i],
                      color: [PALETTE.text, PALETTE.text, "#fff", "#fff"][i],
                      border: "3px solid #120016",
                      boxShadow: "3px 3px 0 #120016",
                      borderRadius: 8,
                      padding: "6px 14px",
                      fontFamily: "'Fragment Mono', monospace",
                      fontSize: "0.78rem",
                    }}
                  >
                    {tag}
                  </StickerCard>
                ))}
              </div>
            </div>

            {/* RIGHT: photo collage */}
            <div
              className="collage-zone"
              style={{ flex: "0 0 420px", position: "relative", height: 520 }}
            >
              <PhotoSticker
                src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                alt="Waseem Nasir — arms crossed, confident"
                rotate={-3}
                style={{
                  width: 260,
                  height: 340,
                  top: 0,
                  left: 60,
                  zIndex: 20,
                }}
              />
              <PhotoSticker
                src="/img/pro/CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg"
                alt="Waseem at rooftop cafe with laptop and rainbow mug"
                rotate={4}
                style={{
                  width: 200,
                  height: 200,
                  top: 180,
                  left: 0,
                  zIndex: 15,
                }}
              />
              <PhotoSticker
                src="/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg"
                alt="Waseem with dragonfruit smoothie and laptop"
                rotate={-5}
                style={{
                  width: 180,
                  height: 180,
                  top: 300,
                  left: 200,
                  zIndex: 18,
                }}
              />

              {/* floating emoji stickers */}
              <motion.div
                className="jiggle"
                style={{
                  position: "absolute",
                  top: -20,
                  right: 10,
                  fontSize: "3.5rem",
                  zIndex: 30,
                  filter: "drop-shadow(2px 2px 0 #120016)",
                }}
              >
                ⚡
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  background: PALETTE.surface,
                  color: "#fff",
                  border: "4px solid #120016",
                  boxShadow: "4px 4px 0 #120016",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontFamily: "'Bagel Fat One', cursive",
                  fontSize: "1rem",
                  zIndex: 30,
                  rotate: 3,
                }}
                whileHover={prefersReduced ? {} : { rotate: 6, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
              >
                40+ clients 🌍
              </motion.div>
            </div>
          </div>

          <TornEdge color={PALETTE.surface} />
        </section>

        {/* ── STATS SECTION ── */}
        <section
          aria-label="Proof numbers"
          style={{
            background: PALETTE.surface,
            padding: "60px 32px",
            position: "relative",
          }}
        >
          <div
            className="stats-row"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
              flexWrap: "wrap",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <StatBadge
              number="180+"
              label="builds shipped"
              bg={PALETTE.bg}
              color={PALETTE.text}
              rotate={-3}
            />
            <StatBadge
              number="40+"
              label="clients served"
              bg={PALETTE.accent}
              color={PALETTE.text}
              rotate={2}
            />
            <StatBadge
              number="9"
              label="countries worked from"
              bg="#fff"
              color={PALETTE.accent2}
              rotate={-2}
            />
            <StatBadge
              number="2019"
              label="in the game since"
              bg={PALETTE.accent2}
              color="#fff"
              rotate={3}
            />
          </div>

          <TornEdge color={PALETTE.bg} />
        </section>

        {/* ── MARQUEE #2 ── */}
        <Marquee
          items={[
            "MISSED LEADS FIXED",
            "DEAD FOLLOW-UPS KILLED",
            "MANUAL OPS AUTOMATED",
            "AI VOICE BOTS SHIPPED",
            "NEXT.JS APPS LIVE",
            "AEO OPTIMISED",
          ]}
          bg={PALETTE.accent2}
          color="#fff"
        />

        {/* ── WHAT I DO (SERVICES) ── */}
        <section
          id="services"
          aria-labelledby="services-heading"
          style={{
            background: PALETTE.bg,
            padding: "80px 32px",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <StickerCard rotate={-1} style={{ display: "inline-block" }}>
                <h2
                  id="services-heading"
                  className="display-font"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.8rem)",
                    margin: 0,
                    background: PALETTE.text,
                    color: PALETTE.bg,
                    padding: "12px 32px",
                    borderRadius: 12,
                    border: "4px solid #120016",
                    boxShadow: "6px 6px 0 #6A00FF",
                  }}
                >
                  What I blow up.
                </h2>
              </StickerCard>
              <p
                style={{
                  marginTop: 20,
                  color: PALETTE.muted,
                  fontWeight: 600,
                  fontFamily: "'Schibsted Grotesk', sans-serif",
                  fontSize: "1.05rem",
                }}
              >
                (automation-style — not literally)
              </p>
            </div>

            <div
              className="services-flex"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
              }}
            >
              <ServicePill
                icon="🤖"
                label="AI Voice Receptionists"
                bg={PALETTE.surface}
                color="#fff"
                rotate={-2}
              />
              <ServicePill
                icon="💬"
                label="WhatsApp Automation"
                bg={PALETTE.accent}
                color={PALETTE.text}
                rotate={1.5}
              />
              <ServicePill
                icon="⚙️"
                label="n8n Workflow Systems"
                bg={PALETTE.accent2}
                color="#fff"
                rotate={-1}
              />
              <ServicePill
                icon="🚀"
                label="Next.js Web Apps"
                bg="#fff"
                color={PALETTE.text}
                rotate={2}
              />
              <ServicePill
                icon="📡"
                label="AEO + AI Search Presence"
                bg={PALETTE.muted}
                color="#fff"
                rotate={-2.5}
              />
              <ServicePill
                icon="🔁"
                label="Lead Follow-Up Bots"
                bg={PALETTE.bg}
                color={PALETTE.text}
                rotate={1}
              />
              <ServicePill
                icon="📊"
                label="Dead Ops → Automated"
                bg={PALETTE.text}
                color={PALETTE.bg}
                rotate={-1.5}
              />
              <ServicePill
                icon="🌍"
                label="Remote, 9 Countries"
                bg="#FF0080"
                color="#fff"
                rotate={2}
              />
            </div>
          </div>
        </section>

        <TornEdge color={PALETTE.accent} />

        {/* ── SELECTED WORK ── */}
        <section
          id="work"
          aria-labelledby="work-heading"
          style={{
            background: PALETTE.accent,
            padding: "80px 32px",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <StickerCard
              rotate={2}
              style={{ display: "inline-block", marginBottom: 44 }}
            >
              <h2
                id="work-heading"
                className="display-font"
                style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                  margin: 0,
                  color: PALETTE.text,
                  background: "#fff",
                  border: "4px solid #120016",
                  boxShadow: "5px 5px 0 #120016",
                  borderRadius: 10,
                  padding: "12px 28px",
                }}
              >
                Selected chaos, tamed. ✦
              </h2>
            </StickerCard>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {[
                {
                  title: "AI WhatsApp Receptionist",
                  desc: "24/7 voice + text bot for a Singapore trades firm — never misses a lead again.",
                  tag: "AI VOICE",
                  bg: PALETTE.surface,
                  color: "#fff",
                  rotate: -2,
                  img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
                },
                {
                  title: "Stripe Funnel — $27 Product",
                  desc: "Full checkout flow, automated onboarding email sequence, zero manual ops.",
                  tag: "FUNNEL",
                  bg: "#fff",
                  color: PALETTE.text,
                  rotate: 1.5,
                  img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                },
                {
                  title: "Outreach Email System",
                  desc: "n8n pipeline — 200 prospects/day, automatic follow-ups, human-style personalisation.",
                  tag: "n8n",
                  bg: PALETTE.accent2,
                  color: "#fff",
                  rotate: -1,
                  img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
                },
              ].map((card) => (
                <StickerCard
                  key={card.title}
                  rotate={card.rotate}
                  style={{
                    background: card.bg,
                    color: card.color,
                    border: "4px solid #120016",
                    boxShadow: "6px 6px 0 #120016",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`/img/pro/${card.img}`}
                    alt={card.title}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div style={{ padding: "20px 20px 24px" }}>
                    <span
                      style={{
                        fontFamily: "'Fragment Mono', monospace",
                        fontSize: "0.7rem",
                        letterSpacing: "0.12em",
                        background: PALETTE.bg,
                        color: PALETTE.text,
                        border: "2px solid #120016",
                        borderRadius: "999px",
                        padding: "3px 10px",
                        display: "inline-block",
                        marginBottom: 10,
                      }}
                    >
                      {card.tag}
                    </span>
                    <h3
                      className="display-font"
                      style={{
                        fontSize: "1.4rem",
                        margin: "0 0 10px",
                        lineHeight: 1.2,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Schibsted Grotesk', sans-serif",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        margin: 0,
                        opacity: 0.85,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </StickerCard>
              ))}
            </div>
          </div>

          <TornEdge color={PALETTE.muted} flip />
        </section>

        {/* ── ABOUT ── */}
        <section
          id="about"
          aria-labelledby="about-heading"
          style={{
            background: PALETTE.muted,
            padding: "80px 32px",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              gap: 56,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* photo cluster */}
            <div
              style={{
                position: "relative",
                width: 340,
                height: 420,
                flexShrink: 0,
              }}
            >
              <PhotoSticker
                src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                alt="Waseem at Nusa Penida cliffs"
                rotate={-4}
                style={{ width: 240, height: 300, top: 0, left: 0, zIndex: 10 }}
              />
              <PhotoSticker
                src="/img/pro/LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg"
                alt="Waseem in black outfit by neon limit sign"
                rotate={5}
                style={{
                  width: 180,
                  height: 220,
                  top: 160,
                  left: 140,
                  zIndex: 15,
                }}
              />
              <motion.div
                className="jiggle"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  background: PALETTE.bg,
                  color: PALETTE.text,
                  border: "4px solid #120016",
                  boxShadow: "4px 4px 0 #120016",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontFamily: "'Bagel Fat One', cursive",
                  fontSize: "0.95rem",
                  zIndex: 20,
                  rotate: "-2deg",
                }}
              >
                Bali + Lahore 🌴
              </motion.div>
            </div>

            {/* copy */}
            <div style={{ flex: "1 1 320px" }}>
              <h2
                id="about-heading"
                className="display-font"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  color: "#fff",
                  marginBottom: 20,
                  lineHeight: 1.1,
                }}
              >
                Waseem Nasir.
                <br />
                <span style={{ color: PALETTE.bg }}>Founder,</span>{" "}
                <span style={{ color: PALETTE.accent }}>SkynetLabs.</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Schibsted Grotesk', sans-serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#e8d0ff",
                  marginBottom: 16,
                }}
              >
                Independent builder. I've shipped 180+ automation systems for
                40+ clients across 9 countries since 2019 — from clinics that
                were missing 60% of their WhatsApp leads, to freight firms that
                couldn't follow up after hours.
              </p>
              <p
                style={{
                  fontFamily: "'Schibsted Grotesk', sans-serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#e8d0ff",
                  marginBottom: 28,
                }}
              >
                I don't sell retainers you forget you're paying. I build systems
                that make your ops run without you in the loop.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Fragment Mono', monospace",
                    fontSize: "0.85rem",
                    color: PALETTE.accent,
                    textDecoration: "none",
                    border: "2px solid #00FFB3",
                    borderRadius: "999px",
                    padding: "8px 18px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      PALETTE.accent;
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      PALETTE.text;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      PALETTE.accent;
                  }}
                >
                  github ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <TornEdge color={PALETTE.text} flip />

        {/* ── PHOTO STRIP ── */}
        <section
          aria-label="Photo gallery"
          style={{
            background: PALETTE.text,
            padding: "48px 32px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 12,
              scrollbarWidth: "none",
            }}
          >
            {[
              {
                src: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
                alt: "Waseem on jungle bridge",
              },
              {
                src: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                alt: "Waseem at Bali terrace with laptop",
              },
              {
                src: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
                alt: "Waseem in black prince coat on balcony",
              },
              {
                src: "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
                alt: "Waseem at beach, arms spread, laughing",
              },
              {
                src: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                alt: "Waseem at garden cafe with laptop",
              },
              {
                src: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                alt: "Group coworking meetup in Bali",
              },
              {
                src: "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
                alt: "Waseem headshot against travertine wall",
              },
            ].map((photo, i) => (
              <StickerCard
                key={photo.src}
                rotate={[-2, 3, -1.5, 2.5, -3, 1, -2][i]}
                style={{
                  flexShrink: 0,
                  width: 200,
                  height: 240,
                  border: "5px solid #fff",
                  boxShadow: "4px 4px 0 #6A00FF",
                }}
              >
                <img
                  src={`/img/pro/${photo.src}`}
                  alt={photo.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </StickerCard>
            ))}
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          style={{
            background: PALETTE.bg,
            padding: "100px 32px",
            position: "relative",
            textAlign: "center",
          }}
        >
          {/* scattered sticker decorations */}
          <motion.div
            style={{
              position: "absolute",
              top: 40,
              left: "8%",
              fontSize: "4rem",
              zIndex: 5,
            }}
            animate={prefersReduced ? {} : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            🤖
          </motion.div>
          <motion.div
            style={{
              position: "absolute",
              top: 60,
              right: "6%",
              fontSize: "3.5rem",
              zIndex: 5,
            }}
            animate={prefersReduced ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            ⚡
          </motion.div>
          <motion.div
            style={{
              position: "absolute",
              bottom: 60,
              left: "12%",
              fontSize: "3rem",
              zIndex: 5,
            }}
            animate={prefersReduced ? {} : { rotate: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            🚀
          </motion.div>
          <motion.div
            style={{
              position: "absolute",
              bottom: 40,
              right: "10%",
              fontSize: "3.5rem",
              zIndex: 5,
            }}
            animate={prefersReduced ? {} : { scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            💥
          </motion.div>

          <div style={{ position: "relative", zIndex: 10 }}>
            <StickerCard
              rotate={-1}
              style={{ display: "inline-block", marginBottom: 20 }}
            >
              <span
                style={{
                  fontFamily: "'Fragment Mono', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  background: PALETTE.surface,
                  color: "#fff",
                  border: "3px solid #120016",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  display: "inline-block",
                }}
              >
                ★ 30-minute call. free. no pitch deck.
              </span>
            </StickerCard>

            <h2
              id="contact-heading"
              className="display-font"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
                marginBottom: 16,
                color: PALETTE.text,
                lineHeight: 1.1,
              }}
            >
              Let's kill your{" "}
              <span
                style={{
                  background: PALETTE.surface,
                  color: "#fff",
                  padding: "0 14px",
                  borderRadius: 10,
                  display: "inline-block",
                  transform: "rotate(-2deg)",
                }}
              >
                busywork.
              </span>
            </h2>
            <p
              style={{
                fontFamily: "'Schibsted Grotesk', sans-serif",
                fontSize: "1.15rem",
                color: PALETTE.muted,
                fontWeight: 600,
                maxWidth: 480,
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              Tell me what's breaking. I'll tell you exactly what to automate
              first — and what it'll cost.
            </p>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 18,
                delay: 0.1,
              }}
            >
              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-btn"
                onClick={fireCTA}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "1.35rem", padding: "22px 52px" }}
              >
                Book the free call ✦
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            background: PALETTE.text,
            color: "#fff",
            padding: "40px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
            borderTop: `5px solid ${PALETTE.surface}`,
          }}
        >
          <div>
            <div
              className="display-font"
              style={{ fontSize: "1.6rem", color: PALETTE.bg, marginBottom: 4 }}
            >
              SkynetLabs
            </div>
            <div
              style={{
                fontFamily: "'Fragment Mono', monospace",
                fontSize: "0.78rem",
                color: "#9966cc",
              }}
            >
              Waseem Nasir — AI + Automation Builder
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a
              href="https://github.com/waseemnasir2k26"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Fragment Mono', monospace",
                fontSize: "0.82rem",
                color: PALETTE.accent,
                textDecoration: "none",
              }}
            >
              GitHub
            </a>
            <a
              href="https://skynetjoe.com/discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Fragment Mono', monospace",
                fontSize: "0.82rem",
                color: PALETTE.surface,
                textDecoration: "none",
              }}
            >
              Book a call
            </a>
            <span
              style={{
                fontFamily: "'Fragment Mono', monospace",
                fontSize: "0.78rem",
                color: "#9966cc",
              }}
            >
              Bali / Lahore — Remote
            </span>
          </div>

          <div
            style={{
              fontFamily: "'Fragment Mono', monospace",
              fontSize: "0.75rem",
              color: "#9966cc",
            }}
          >
            © 2019–2026 SkynetLabs
          </div>
        </footer>
      </div>
    </>
  );
}
