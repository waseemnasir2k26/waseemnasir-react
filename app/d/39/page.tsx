"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrbConfig {
  id: number;
  x: string;
  y: string;
  size: number;
  color: string;
  blur: number;
  opacity: number;
  zPlane: number;
}

interface WorkItem {
  label: string;
  tag: string;
  img: string;
  orient: "portrait" | "landscape";
}

interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const PALETTE = {
  bg: "#0D1018",
  surface: "#161B27",
  text: "#EDF1F7",
  muted: "#7C879B",
  accent: "#86EFAC",
  accent2: "#C4B5FD",
} as const;

const BOOKING_URL = "https://skynetjoe.com/discovery-call";

const SERVICES: ServiceItem[] = [
  {
    icon: "◈",
    title: "AI Automation Systems",
    desc: "n8n workflows that replace repetitive manual ops — lead routing, follow-ups, data sync — running 24/7 without babysitting.",
  },
  {
    icon: "◎",
    title: "WhatsApp & Voice Bots",
    desc: "Conversational AI that qualifies leads, books calls, and answers FAQs on WhatsApp or phone before a human ever touches it.",
  },
  {
    icon: "◇",
    title: "AEO-Ready Web Builds",
    desc: "Next.js sites structured for Answer Engine Optimisation — built to appear when AI assistants answer your clients' questions.",
  },
  {
    icon: "⬡",
    title: "Growth Infrastructure",
    desc: "Full-stack pipelines: intake forms → CRM sync → onboarding sequences → reporting dashboards. One system that scales.",
  },
];

const WORK_ITEMS: WorkItem[] = [
  {
    label: "Freight Ops Voice Receptionist",
    tag: "AI Voice · US/SG",
    img: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    orient: "landscape",
  },
  {
    label: "Inspire Health PT — Stripe Funnel",
    tag: "Next.js · Stripe",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    orient: "landscape",
  },
  {
    label: "IdeaViaggi Trip CPT System",
    tag: "WP · REST API",
    img: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
    orient: "landscape",
  },
  {
    label: "AEO Engine v0.7",
    tag: "Next.js · Schema",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    orient: "landscape",
  },
  {
    label: "TakyCorp Email Automation",
    tag: "n8n · OpenAI",
    img: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
    orient: "landscape",
  },
  {
    label: "GigSignal Chrome Extension",
    tag: "Chrome Ext · JS",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    orient: "landscape",
  },
];

const ORBS: OrbConfig[] = [
  {
    id: 1,
    x: "10%",
    y: "8%",
    size: 560,
    color: "#C4B5FD",
    blur: 140,
    opacity: 0.22,
    zPlane: 1,
  },
  {
    id: 2,
    x: "72%",
    y: "5%",
    size: 420,
    color: "#86EFAC",
    blur: 120,
    opacity: 0.18,
    zPlane: 1,
  },
  {
    id: 3,
    x: "45%",
    y: "38%",
    size: 380,
    color: "#6EE7B7",
    blur: 100,
    opacity: 0.14,
    zPlane: 2,
  },
  {
    id: 4,
    x: "80%",
    y: "55%",
    size: 480,
    color: "#A78BFA",
    blur: 130,
    opacity: 0.16,
    zPlane: 2,
  },
  {
    id: 5,
    x: "5%",
    y: "65%",
    size: 340,
    color: "#86EFAC",
    blur: 90,
    opacity: 0.12,
    zPlane: 1,
  },
  {
    id: 6,
    x: "60%",
    y: "80%",
    size: 300,
    color: "#C4B5FD",
    blur: 80,
    opacity: 0.13,
    zPlane: 2,
  },
];

// ─── Parallax hook (pointer + scroll) ────────────────────────────────────────
function useParallaxLayers() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return pointer;
}

// ─── Aurora background ────────────────────────────────────────────────────────
function AuroraBackground({ pointer }: { pointer: { x: number; y: number } }) {
  const reduced = useReducedMotion();
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {ORBS.map((orb) => {
        const speed = orb.zPlane === 1 ? 18 : 10;
        return (
          <motion.div
            key={orb.id}
            animate={
              reduced
                ? {}
                : {
                    x: pointer.x * speed,
                    y: pointer.y * speed,
                  }
            }
            transition={{ type: "spring", stiffness: 30, damping: 25 }}
            style={{
              position: "absolute",
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          />
        );
      })}
      {/* grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(134,239,172,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(134,239,172,0.03) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}

// ─── Dust particles (z-plane 4 foreground) ────────────────────────────────────
function DustLayer({ pointer }: { pointer: { x: number; y: number } }) {
  const reduced = useReducedMotion();
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: `${(i * 4.2 + 3) % 100}%`,
    y: `${(i * 3.7 + 7) % 100}%`,
    size: 2 + (i % 3),
    opacity: 0.15 + (i % 5) * 0.04,
    color: i % 2 === 0 ? PALETTE.accent : PALETTE.accent2,
  }));

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={
            reduced
              ? {}
              : {
                  x: pointer.x * -6,
                  y: pointer.y * -6,
                }
          }
          transition={{ type: "spring", stiffness: 15, damping: 20 }}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: p.opacity,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

// ─── Clay card (reusable) ────────────────────────────────────────────────────
function ClayCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background:
          "linear-gradient(145deg, #1E2436 0%, #161B27 60%, #10141F 100%)",
        borderRadius: 24,
        border: "1px solid rgba(196,181,253,0.12)",
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.07),
          inset 0 -2px 4px rgba(0,0,0,0.4),
          0 8px 32px rgba(0,0,0,0.5),
          0 2px 8px rgba(0,0,0,0.3)
        `,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <ClayCard
      style={{
        padding: "20px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        flex: "1 1 140px",
      }}
    >
      <span
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          background: `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.accent2})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.78rem",
          color: PALETTE.muted,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </ClayCard>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ClayAuroraDepth() {
  const reduced = useReducedMotion();
  const pointer = useParallaxLayers();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
  });

  // Scroll-driven parallax for hero portrait (z-plane 3)
  const portraitY = useTransform(
    smoothProgress,
    [0, 0.3],
    [0, reduced ? 0 : -60],
  );
  const heroTextY = useTransform(
    smoothProgress,
    [0, 0.3],
    [0, reduced ? 0 : 30],
  );

  return (
    <div className="root-39">
      {/* ── Font injection ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap');

        .root-39 * { box-sizing: border-box; margin: 0; padding: 0; }
        .root-39 a:focus-visible { outline: 2px solid ${PALETTE.accent}; outline-offset: 3px; border-radius: 4px; }
        .root-39 img { display: block; max-width: 100%; }

        .root-39 .clay-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 999px;
          background: linear-gradient(135deg, ${PALETTE.accent} 0%, ${PALETTE.accent2} 100%);
          color: #0D1018;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          text-decoration: none;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -2px 4px rgba(0,0,0,0.2),
            0 6px 24px rgba(134,239,172,0.25),
            0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          cursor: pointer;
        }
        .root-39 .clay-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -2px 4px rgba(0,0,0,0.2),
            0 10px 36px rgba(134,239,172,0.35),
            0 4px 12px rgba(0,0,0,0.4);
        }
        .root-39 .clay-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 999px;
          border: 1px solid rgba(196,181,253,0.35);
          color: ${PALETTE.accent2};
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          background: rgba(196,181,253,0.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            0 4px 16px rgba(0,0,0,0.3);
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .root-39 .clay-btn-ghost:hover {
          background: rgba(196,181,253,0.12);
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .root-39 * { animation: none !important; transition-duration: 0.01ms !important; }
        }

        @media (max-width: 768px) {
          .root-39 .hero-grid { flex-direction: column !important; }
          .root-39 .work-grid { grid-template-columns: 1fr !important; }
          .root-39 .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Background (opaque, covers dark layout) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: PALETTE.bg,
        }}
        aria-hidden
      />

      {/* ── Aurora orbs (z-plane 1 + 2) ── */}
      <AuroraBackground pointer={pointer} />

      {/* ── Foreground dust (z-plane 4) ── */}
      <DustLayer pointer={pointer} />

      {/* ── Scroll progress rail ── */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          background: `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.accent2})`,
          transformOrigin: "left",
          scaleX: smoothProgress,
          zIndex: 100,
        }}
        aria-hidden
      />

      {/* ── Skip to content ── */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: -40,
          left: 16,
          zIndex: 200,
          padding: "8px 16px",
          background: PALETTE.accent,
          color: PALETTE.bg,
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: "0.85rem",
          transition: "top 0.2s",
          textDecoration: "none",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.top = "16px";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.top = "-40px";
        }}
      >
        Skip to content
      </a>

      {/* ── Nav ── */}
      <nav
        role="navigation"
        aria-label="Main"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(13,16,24,0.72)",
          borderBottom: "1px solid rgba(196,181,253,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: PALETTE.text,
            letterSpacing: "-0.01em",
          }}
        >
          Waseem<span style={{ color: PALETTE.accent }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            ["Work", "#work"],
            ["Services", "#services"],
            ["About", "#about"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "0.85rem",
                color: PALETTE.muted,
                textDecoration: "none",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  PALETTE.text;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  PALETTE.muted;
              }}
            >
              {label}
            </a>
          ))}
          <a
            href={BOOKING_URL}
            className="clay-btn"
            style={{ padding: "10px 20px", fontSize: "0.82rem" }}
          >
            Book a call
          </a>
        </div>
      </nav>

      {/* ── Page content (z-plane 3) ── */}
      <main
        id="main-content"
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 10,
          color: PALETTE.text,
        }}
      >
        {/* ═══════════════════════ HERO ═══════════════════════ */}
        <section
          aria-label="Hero"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "120px 40px 80px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            className="hero-grid"
            style={{
              display: "flex",
              gap: 64,
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Left: text */}
            <motion.div style={{ flex: "1 1 480px", y: heroTextY }}>
              {/* Badge */}
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  border: `1px solid rgba(134,239,172,0.3)`,
                  background: "rgba(134,239,172,0.08)",
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: PALETTE.accent,
                    boxShadow: `0 0 8px ${PALETTE.accent}`,
                    display: "inline-block",
                    animation: reduced
                      ? "none"
                      : "pulse39 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.72rem",
                    color: PALETTE.accent,
                    letterSpacing: "0.08em",
                  }}
                >
                  AVAILABLE FOR PROJECTS
                </span>
              </motion.div>

              <style>{`
                @keyframes pulse39 {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
              `}</style>

              <motion.h1
                initial={reduced ? {} : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.4rem, 5vw, 4rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.03em",
                  marginBottom: 24,
                  color: PALETTE.text,
                }}
              >
                The AI hire
                <br />
                you don't have
                <br />
                <span
                  style={{
                    background: `linear-gradient(135deg, ${PALETTE.accent} 0%, ${PALETTE.accent2} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  to manage.
                </span>
              </motion.h1>

              <motion.p
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                  color: PALETTE.muted,
                  lineHeight: 1.65,
                  maxWidth: 440,
                  marginBottom: 40,
                }}
              >
                I'm Waseem — I build AI + automation systems that handle the
                busywork your team hates. Missed leads, dead follow-ups, manual
                ops. Gone.
              </motion.p>

              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.55 }}
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <a href={BOOKING_URL} className="clay-btn">
                  Book 30-min call
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="#0D1018"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="clay-btn-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.021C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
              </motion.div>
            </motion.div>

            {/* Right: portrait on own z-plane */}
            <motion.div
              style={{
                flex: "0 0 auto",
                position: "relative",
                y: portraitY,
              }}
            >
              {/* Aurora rim-light */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -24,
                  borderRadius: 32,
                  background: `conic-gradient(from 220deg at 50% 50%, ${PALETTE.accent2} 0deg, ${PALETTE.accent} 120deg, transparent 200deg, ${PALETTE.accent2} 360deg)`,
                  opacity: 0.35,
                  filter: "blur(24px)",
                  zIndex: 0,
                }}
              />
              {/* Clay portrait frame */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: 28,
                  overflow: "hidden",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    inset 0 -2px 6px rgba(0,0,0,0.5),
                    0 24px 64px rgba(0,0,0,0.7),
                    0 8px 24px rgba(0,0,0,0.5),
                    0 0 0 1px rgba(196,181,253,0.2)
                  `,
                }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                  alt="Waseem Nasir, founder of SkynetLabs, on a balcony in a black coat"
                  width={340}
                  height={480}
                  style={{
                    objectFit: "cover",
                    display: "block",
                    width: 340,
                    height: 480,
                  }}
                />
                {/* Inner shadow shading — light from top-left */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `
                      radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.45) 0%, transparent 65%),
                      radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.04) 0%, transparent 50%)
                    `,
                    borderRadius: 28,
                  }}
                />
              </div>

              {/* Floating clay tag */}
              <motion.div
                initial={reduced ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{
                  position: "absolute",
                  bottom: 32,
                  right: -28,
                  zIndex: 2,
                }}
              >
                <ClayCard
                  style={{
                    padding: "12px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: 140,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: PALETTE.accent,
                    }}
                  >
                    180+
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.72rem",
                      color: PALETTE.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Builds shipped
                  </span>
                </ClayCard>
              </motion.div>

              {/* Top floating tag */}
              <motion.div
                initial={reduced ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{
                  position: "absolute",
                  top: 28,
                  left: -32,
                  zIndex: 2,
                }}
              >
                <ClayCard
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: "1rem" }} aria-hidden>
                    🌍
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        color: PALETTE.text,
                      }}
                    >
                      9 countries
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.68rem",
                        color: PALETTE.muted,
                      }}
                    >
                      worked from
                    </div>
                  </div>
                </ClayCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════ STATS ═══════════════════════ */}
        <section
          aria-label="Proof numbers"
          style={{ padding: "0 40px 100px", maxWidth: 1200, margin: "0 auto" }}
        >
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <StatPill value="180+" label="Builds shipped" />
            <StatPill value="40+" label="Clients served" />
            <StatPill value="9" label="Countries" />
            <StatPill value="2019" label="In the game since" />
          </motion.div>
        </section>

        {/* ═══════════════════════ SERVICES ═══════════════════════ */}
        <section
          id="services"
          aria-label="Services"
          style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}
        >
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            style={{ marginBottom: 56 }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                color: PALETTE.accent,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              What I build
            </span>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                color: PALETTE.text,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                maxWidth: 520,
              }}
            >
              Systems that run
              <br />
              <span style={{ color: PALETTE.accent2 }}>without you.</span>
            </h2>
          </motion.div>

          <div
            className="services-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={reduced ? {} : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
              >
                <ClayCard
                  style={{
                    padding: "32px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                  }}
                  className="svc-card-39"
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `linear-gradient(135deg, rgba(134,239,172,0.15), rgba(196,181,253,0.1))`,
                      border: `1px solid rgba(134,239,172,0.2)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)",
                    }}
                    aria-hidden
                  >
                    {svc.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      color: PALETTE.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.9rem",
                      color: PALETTE.muted,
                      lineHeight: 1.65,
                    }}
                  >
                    {svc.desc}
                  </p>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ WORK ═══════════════════════ */}
        <section
          id="work"
          aria-label="Selected work"
          style={{ padding: "100px 40px", background: "rgba(22,27,39,0.4)" }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              style={{ marginBottom: 48 }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.72rem",
                  color: PALETTE.accent2,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Selected builds
              </span>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  color: PALETTE.text,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                Things I've shipped.
              </h2>
            </motion.div>

            <div
              className="work-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
              }}
            >
              {WORK_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={reduced ? {} : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.55 }}
                  whileHover={
                    reduced ? {} : { y: -6, transition: { duration: 0.2 } }
                  }
                >
                  <ClayCard
                    style={{
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        height: 200,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`/img/pro/${item.img}`}
                        alt={item.label}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.4s ease",
                        }}
                      />
                      {/* Scrim */}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(13,16,24,0.85) 0%, transparent 55%)",
                        }}
                      />
                      {/* Inner shading — light from top-left */}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `
                            radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.3) 0%, transparent 60%),
                            radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.04) 0%, transparent 40%)
                          `,
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.65rem",
                          color: PALETTE.accent,
                          background: "rgba(13,16,24,0.7)",
                          border: `1px solid rgba(134,239,172,0.3)`,
                          borderRadius: 999,
                          padding: "4px 10px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <div style={{ padding: "18px 20px" }}>
                      <p
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: PALETTE.text,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.35,
                        }}
                      >
                        {item.label}
                      </p>
                    </div>
                  </ClayCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ ABOUT ═══════════════════════ */}
        <section
          id="about"
          aria-label="About Waseem"
          style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}
        >
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              gap: 64,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Photo cluster */}
            <div
              style={{
                position: "relative",
                flex: "0 0 auto",
                width: 320,
                height: 420,
              }}
            >
              {/* Background photo */}
              <div
                style={{
                  position: "absolute",
                  top: 32,
                  left: 32,
                  width: 260,
                  height: 340,
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                  alt="Waseem at Nusa Penida cliffs, Bali"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Foreground photo */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 200,
                  height: 270,
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    0 20px 56px rgba(0,0,0,0.65),
                    0 0 0 1px rgba(196,181,253,0.25)
                  `,
                  zIndex: 2,
                }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg"
                  alt="Waseem smiling in a Bali rice field"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.35) 0%, transparent 60%)`,
                  }}
                />
              </div>
              {/* Accent orb behind cluster */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: PALETTE.accent2,
                  filter: "blur(60px)",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
            </div>

            {/* Text */}
            <div style={{ flex: "1 1 380px" }}>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.72rem",
                  color: PALETTE.accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 16,
                }}
              >
                The human behind the systems
              </span>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  color: PALETTE.text,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >
                I've been building on
                <br />
                the internet since 2019.
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {[
                  "Started as a developer. Became an operator. Now I build the AI infrastructure that lets small teams punch like enterprises.",
                  "I run SkynetLabs remotely — from Bali rice terraces, Lahore rooftops, or whatever city has good coffee and fast Wi-Fi.",
                  "I don't sell software. I solve the specific problem where your business leaks time and money every day, then automate it out of existence.",
                ].map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.95rem",
                      color: PALETTE.muted,
                      lineHeight: 1.7,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Tech stack tags */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 28,
                }}
              >
                {[
                  "n8n",
                  "Next.js",
                  "OpenAI",
                  "WhatsApp API",
                  "AEO",
                  "Stripe",
                ].map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.7rem",
                      color: PALETTE.accent2,
                      background: "rgba(196,181,253,0.1)",
                      border: "1px solid rgba(196,181,253,0.2)",
                      borderRadius: 8,
                      padding: "5px 12px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════ LIFE / MORE PHOTOS ═══════════════════════ */}
        <section
          aria-label="Life on the road"
          style={{
            padding: "80px 40px",
            background: "rgba(22,27,39,0.3)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <motion.p
              initial={reduced ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                color: PALETTE.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              40+ clients · 9 countries · still shipping
            </motion.p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  img: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                  alt: "Waseem on a Bali rooftop cafe with laptop",
                },
                {
                  img: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Waseem on a hilltop overlooking a city",
                },
                {
                  img: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  alt: "Waseem smiling with dragonfruit smoothie and laptop",
                },
                {
                  img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                  alt: "Waseem giving thumbs up at a client cafe meeting",
                },
                {
                  img: "LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
                  alt: "Waseem in black bandhgala at cafe",
                },
              ].map((photo, i) => (
                <motion.div
                  key={photo.img}
                  initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    aspectRatio: "3/4",
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,0.06),
                      0 8px 24px rgba(0,0,0,0.45)
                    `,
                    border: "1px solid rgba(196,181,253,0.08)",
                  }}
                >
                  <img
                    src={`/img/pro/${photo.img}`}
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
          </div>
        </section>

        {/* ═══════════════════════ CTA ═══════════════════════ */}
        <section
          aria-label="Book a call"
          style={{
            padding: "120px 40px",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
          >
            {/* Aurora glow behind CTA */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 500,
                height: 200,
                background: `radial-gradient(ellipse, ${PALETTE.accent2} 0%, transparent 70%)`,
                opacity: 0.12,
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />

            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                color: PALETTE.accent,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 20,
              }}
            >
              Ready to stop losing to busywork?
            </span>

            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                marginBottom: 20,
                color: PALETTE.text,
              }}
            >
              Thirty minutes.
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${PALETTE.accent} 0%, ${PALETTE.accent2} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                One clear plan.
              </span>
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                color: PALETTE.muted,
                lineHeight: 1.65,
                maxWidth: 480,
                margin: "0 auto 44px",
              }}
            >
              Tell me what's breaking. I'll tell you exactly what to build — and
              whether I'm the right person to build it.
            </p>

            <a
              href={BOOKING_URL}
              className="clay-btn"
              style={{ fontSize: "1.05rem", padding: "16px 36px" }}
            >
              Book the 30-min call
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="#0D1018"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                color: PALETTE.muted,
                marginTop: 16,
                opacity: 0.7,
              }}
            >
              No pitch deck. No hourly billing. Just honest systems work.
            </p>
          </motion.div>
        </section>

        {/* ═══════════════════════ FOOTER ═══════════════════════ */}
        <footer
          role="contentinfo"
          style={{
            padding: "40px",
            borderTop: "1px solid rgba(196,181,253,0.1)",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
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
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: PALETTE.text,
                }}
              >
                Waseem Nasir
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.78rem",
                  color: PALETTE.muted,
                  marginLeft: 12,
                }}
              >
                SkynetLabs · AI & Automation
              </span>
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <a
                href="https://github.com/waseemnasir2k26"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  color: PALETTE.muted,
                  textDecoration: "none",
                  transition: "color 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    PALETTE.text;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    PALETTE.muted;
                }}
              >
                GitHub
              </a>
              <a
                href={BOOKING_URL}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  color: PALETTE.accent,
                  textDecoration: "none",
                }}
              >
                Book a call
              </a>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  color: PALETTE.muted,
                  opacity: 0.5,
                }}
              >
                Bali / Lahore · 2019–
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
