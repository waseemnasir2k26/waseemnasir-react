"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────────
   MIDNIGHT GLASS AURORA  — Design 35 / 50
   Cinematic glassmorphism / nocturne
   Palette: #070B16 bg · #0F1626 surface · #EAF0FF text · #5A6788 muted · #6E8BFF accent · #36E0B0 accent2
───────────────────────────────────────────── */

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap";

const BOOKING = "https://skynetjoe.com/discovery-call";

const SERVICES = [
  {
    icon: "◈",
    title: "AI Voice & WhatsApp Bots",
    body: "24 / 7 receptionists that qualify, route, and follow up. Missed calls become booked jobs.",
  },
  {
    icon: "⬡",
    title: "n8n Automation Pipelines",
    body: "End-to-end workflow engines. CRM sync, invoice triggers, Slack alerts — headless and invisible.",
  },
  {
    icon: "◇",
    title: "Next.js Builds",
    body: "Fast, indexed, production-hardened web apps. AEO-structured so AI search surfaces you first.",
  },
  {
    icon: "◉",
    title: "AEO & Answer-Layer SEO",
    body: "Schema, entity authority, citation architecture — built to own the AI answer panel.",
  },
  {
    icon: "⬟",
    title: "Lead-Capture Funnels",
    body: "From cold click to booked call in under 90 seconds. Every touchpoint tracked and optimised.",
  },
  {
    icon: "◎",
    title: "Ops Systemisation",
    body: "Map the busywork, automate the loop, reclaim the hours. Delivered as runbooks + live systems.",
  },
];

const WORKS = [
  {
    label: "Freight Ops — US & Singapore",
    tag: "Voice AI · WhatsApp",
    desc: "Dual-geo AI receptionist replacing a $6 k / mo dispatcher. WhatsApp conversations auto-qualify, route, and close.",
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
  },
  {
    label: "Inspire Health PT",
    tag: "Funnel · Stripe",
    desc: "$27 intake funnel live in 72 h. Sticky header, mobile menu, Zocdoc chat integration, zero broken flows.",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  },
  {
    label: "IdeaViaggi — Inpsieme",
    tag: "WordPress · CTM",
    desc: "Trip-input system for Italian student travel. GDPR-hardened, per-customer destination gating via REST.",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  },
  {
    label: "TakyCorp Email Engine",
    tag: "n8n · OpenAI",
    desc: "AI outreach pipeline, 2-outage post-mortems fixed, Gmail-limit routing, OOM patched.",
    img: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
  },
];

const STATS = [
  { value: 180, suffix: "+", label: "Builds shipped" },
  { value: 40, suffix: "+", label: "Clients served" },
  { value: 9, suffix: "", label: "Countries worked from" },
  { value: 2019, suffix: "", label: "Operating since" },
];

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!active || reduced) {
      setCount(target);
      return;
    }
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration, reduced]);
  return count;
}

/* ── Aurora mesh shader (canvas) ── */
function AuroraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep space base
      ctx.fillStyle = "#070B16";
      ctx.fillRect(0, 0, w, h);

      if (!reduced) {
        // Aurora blobs — slow morphing radial gradients
        const blobs = [
          {
            x: 0.25 + 0.15 * Math.sin(t * 0.0004),
            y: 0.3 + 0.12 * Math.cos(t * 0.0003),
            r: 0.45,
            c1: "rgba(110,139,255,0.18)",
            c2: "rgba(110,139,255,0)",
          },
          {
            x: 0.75 + 0.1 * Math.cos(t * 0.00035),
            y: 0.55 + 0.15 * Math.sin(t * 0.00045),
            r: 0.4,
            c1: "rgba(54,224,176,0.14)",
            c2: "rgba(54,224,176,0)",
          },
          {
            x: 0.5 + 0.2 * Math.sin(t * 0.00025 + 1),
            y: 0.2 + 0.1 * Math.cos(t * 0.0004 + 2),
            r: 0.35,
            c1: "rgba(110,139,255,0.10)",
            c2: "rgba(110,139,255,0)",
          },
          {
            x: 0.15 + 0.08 * Math.cos(t * 0.0005),
            y: 0.75 + 0.1 * Math.sin(t * 0.00038),
            r: 0.3,
            c1: "rgba(54,224,176,0.09)",
            c2: "rgba(54,224,176,0)",
          },
        ];

        for (const b of blobs) {
          const cx = b.x * w;
          const cy = b.y * h;
          const radius = b.r * Math.max(w, h);
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          grad.addColorStop(0, b.c1);
          grad.addColorStop(1, b.c2);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        // Thin aurora band
        const bandGrad = ctx.createLinearGradient(0, h * 0.1, w, h * 0.55);
        bandGrad.addColorStop(0, "rgba(110,139,255,0.04)");
        bandGrad.addColorStop(0.4, "rgba(54,224,176,0.07)");
        bandGrad.addColorStop(0.7, "rgba(110,139,255,0.05)");
        bandGrad.addColorStop(1, "rgba(54,224,176,0.02)");
        ctx.fillStyle = bandGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Film-grain overlay
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const grainAmount = 18;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grainAmount;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);

      t += 16;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Portrait tilt card ── */
function TiltPortrait({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 80, damping: 20 });
  const sry = useSpring(ry, { stiffness: 80, damping: 20 });
  const rotX = useTransform(srx, [-1, 1], [8, -8]);
  const rotY = useTransform(sry, [-1, 1], [-8, 8]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      rx.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
      ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    },
    [reduced, rx, ry],
  );

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        cursor: "default",
      }}
    >
      <img
        src={`/img/pro/${src}`}
        alt={alt}
        style={{ width: "100%", display: "block", borderRadius: 20 }}
      />
      {/* Glass reflection sheen */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(110,139,255,0.10) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
          borderRadius: 20,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

/* ── Stat counter card ── */
function StatCard({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, 1600, active);
  return (
    <div
      style={{
        background: "rgba(15,22,38,0.65)",
        border: "1px solid rgba(110,139,255,0.18)",
        borderRadius: 16,
        padding: "28px 24px",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        textAlign: "center",
        flex: "1 1 140px",
        minWidth: 130,
      }}
    >
      <div
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          fontWeight: 800,
          color: "#6E8BFF",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.8rem",
          color: "#5A6788",
          marginTop: 8,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Glass panel helper ── */
function GlassPanel({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(15,22,38,0.55)",
        border: "1px solid rgba(110,139,255,0.14)",
        borderRadius: 20,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(110,139,255,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Service card ── */
function ServiceCard({
  icon,
  title,
  body,
  i,
}: {
  icon: string;
  title: string;
  body: string;
  i: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.07, duration: 0.5 }}
    >
      <GlassPanel style={{ padding: "28px 26px", height: "100%" }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.4rem",
            color: i % 2 === 0 ? "#6E8BFF" : "#36E0B0",
            marginBottom: 14,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "#EAF0FF",
            marginBottom: 10,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.88rem",
            color: "#5A6788",
            lineHeight: 1.65,
          }}
        >
          {body}
        </div>
      </GlassPanel>
    </motion.div>
  );
}

/* ── Work card ── */
function WorkCard({ item, i }: { item: (typeof WORKS)[0]; i: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.1, duration: 0.55 }}
    >
      <GlassPanel
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
          <img
            src={`/img/pro/${item.img}`}
            alt={item.label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(7,11,22,0.85) 100%)",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 14,
              left: 18,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              color: "#36E0B0",
              background: "rgba(7,11,22,0.7)",
              padding: "3px 10px",
              borderRadius: 20,
              border: "1px solid rgba(54,224,176,0.3)",
            }}
          >
            {item.tag}
          </span>
        </div>
        <div style={{ padding: "22px 24px 26px" }}>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#EAF0FF",
              marginBottom: 8,
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              color: "#5A6788",
              lineHeight: 1.6,
            }}
          >
            {item.desc}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

/* ── Divider ── */
function AuroraDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        background:
          "linear-gradient(to right, transparent, rgba(110,139,255,0.25) 30%, rgba(54,224,176,0.25) 70%, transparent)",
        margin: "0 auto",
        maxWidth: 700,
        width: "100%",
      }}
    />
  );
}

/* ── Section label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.72rem",
        color: "#36E0B0",
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          display: "block",
          width: 24,
          height: 1,
          background: "#36E0B0",
          opacity: 0.5,
        }}
      />
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function MidnightGlassAurora() {
  const reduced = useReducedMotion();
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Intersect observer for count-up trigger
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsActive(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll progress rail
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollPct(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const inner: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 clamp(18px, 5vw, 60px)",
  };

  const sectionPad: React.CSSProperties = {
    padding: "clamp(64px, 10vh, 120px) 0",
  };

  return (
    <>
      {/* Font import + scoped styles */}
      <style>{`
        @import url('${FONTS_URL}');

        .d35-root {
          font-family: 'Inter', sans-serif;
          color: #EAF0FF;
          background: #070B16;
        }

        .d35-root *:focus-visible {
          outline: 2px solid #6E8BFF;
          outline-offset: 3px;
        }

        /* Glass card hover lift */
        .d35-service-grid > * {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .d35-service-grid > *:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(110,139,255,0.15), 0 0 0 1px rgba(110,139,255,0.22);
        }

        /* Work grid hover */
        .d35-work-grid > * {
          transition: transform 0.3s ease;
        }
        .d35-work-grid > *:hover {
          transform: translateY(-3px);
        }

        /* Scroll rail */
        .d35-scroll-rail {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(to right, #6E8BFF, #36E0B0);
          z-index: 9999;
          transform-origin: left;
          pointer-events: none;
        }

        /* Nav */
        .d35-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 18px clamp(18px, 5vw, 60px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(7,11,22,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(110,139,255,0.08);
        }

        .d35-nav-logo {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          color: #EAF0FF;
          text-decoration: none;
          letter-spacing: -0.02em;
        }

        .d35-nav-cta {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #070B16;
          background: #6E8BFF;
          padding: 9px 20px;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .d35-nav-cta:hover {
          background: #8BA4FF;
          transform: scale(1.03);
        }

        /* CTA button */
        .d35-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: #070B16;
          background: linear-gradient(135deg, #6E8BFF 0%, #36E0B0 100%);
          padding: 15px 36px;
          border-radius: 100px;
          text-decoration: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: 0 0 40px rgba(110,139,255,0.35);
        }
        .d35-btn-primary:hover {
          opacity: 0.88;
          transform: scale(1.02);
          box-shadow: 0 0 60px rgba(110,139,255,0.5);
        }

        .d35-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: #EAF0FF;
          border: 1px solid rgba(110,139,255,0.28);
          padding: 13px 30px;
          border-radius: 100px;
          text-decoration: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .d35-btn-ghost:hover {
          border-color: rgba(110,139,255,0.6);
          background: rgba(110,139,255,0.07);
        }

        /* About photo grid */
        .d35-about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 12px;
        }
        .d35-about-grid img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 14px;
          display: block;
        }
        .d35-about-grid .span2 {
          grid-column: span 2;
          height: 260px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .d35-hero-split {
            flex-direction: column !important;
          }
          .d35-hero-split > * {
            width: 100% !important;
          }
          .d35-service-grid {
            grid-template-columns: 1fr !important;
          }
          .d35-work-grid {
            grid-template-columns: 1fr !important;
          }
          .d35-about-cols {
            flex-direction: column !important;
          }
        }

        @media (max-width: 540px) {
          .d35-about-grid {
            grid-template-columns: 1fr;
          }
          .d35-about-grid .span2 {
            grid-column: span 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .d35-btn-primary,
          .d35-btn-ghost,
          .d35-nav-cta,
          .d35-service-grid > *,
          .d35-work-grid > * {
            transition: none !important;
          }
        }
      `}</style>

      {/* Scroll progress rail */}
      <div
        className="d35-scroll-rail"
        aria-hidden="true"
        style={{ width: `${scrollPct * 100}%` }}
      />

      {/* Living aurora background */}
      <AuroraCanvas />

      <div
        className="d35-root"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        {/* Skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: -9999,
            top: 8,
            zIndex: 9999,
            padding: "8px 16px",
            background: "#6E8BFF",
            color: "#070B16",
            borderRadius: 6,
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.left = "18px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.left = "-9999px";
          }}
        >
          Skip to main content
        </a>

        {/* NAV */}
        <nav className="d35-nav" aria-label="Site navigation">
          <a href="/" className="d35-nav-logo" aria-label="Home — SkynetLabs">
            SkynetLabs
          </a>
          <a
            href={BOOKING}
            className="d35-nav-cta"
            aria-label="Book a discovery call"
          >
            Book a call
          </a>
        </nav>

        <main id="main-content">
          {/* ══════════════════════════════
              HERO
          ══════════════════════════════ */}
          <section
            aria-label="Hero"
            style={{
              ...sectionPad,
              paddingTop: "clamp(120px, 16vh, 180px)",
              paddingBottom: "clamp(64px, 8vh, 100px)",
            }}
          >
            <div style={inner}>
              <div
                className="d35-hero-split"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(32px, 5vw, 80px)",
                }}
              >
                {/* Copy column */}
                <div style={{ flex: "1 1 500px" }}>
                  <motion.div
                    initial={reduced ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SectionLabel>Waseem Nasir · SkynetLabs</SectionLabel>
                  </motion.div>

                  <motion.h1
                    initial={reduced ? {} : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1 }}
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                      color: "#EAF0FF",
                      lineHeight: 1.08,
                      letterSpacing: "-0.03em",
                      margin: "0 0 24px",
                    }}
                  >
                    The quiet operator
                    <br />
                    <span
                      style={{
                        background:
                          "linear-gradient(90deg, #6E8BFF 0%, #36E0B0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      behind 40+ companies'
                    </span>
                    <br />
                    busywork.
                  </motion.h1>

                  <motion.p
                    initial={reduced ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.22 }}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(1rem, 2vw, 1.15rem)",
                      color: "#5A6788",
                      lineHeight: 1.7,
                      maxWidth: 520,
                      margin: "0 0 36px",
                    }}
                  >
                    180+ builds across 9 countries, since 2019. AI Voice,
                    WhatsApp bots, n8n pipelines, Next.js — systems that run
                    while you sleep and close while you're offline.
                  </motion.p>

                  <motion.div
                    initial={reduced ? {} : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.34 }}
                    style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
                  >
                    <a
                      href={BOOKING}
                      className="d35-btn-primary"
                      aria-label="Book a 30-minute discovery call"
                    >
                      Book 30 min call
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/waseemnasir2k26"
                      className="d35-btn-ghost"
                      aria-label="GitHub profile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </motion.div>

                  {/* Availability tag */}
                  <motion.div
                    initial={reduced ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      marginTop: 28,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.75rem",
                      color: "#5A6788",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#36E0B0",
                        display: "inline-block",
                        boxShadow: "0 0 8px #36E0B0",
                      }}
                    />
                    Available remotely · Bali / Lahore
                  </motion.div>
                </div>

                {/* Portrait column */}
                <motion.div
                  initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  style={{ flex: "0 0 clamp(240px, 32vw, 380px)" }}
                >
                  <div style={{ position: "relative" }}>
                    {/* Glow behind portrait */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: -30,
                        background:
                          "radial-gradient(ellipse at center, rgba(110,139,255,0.22) 0%, transparent 70%)",
                        borderRadius: "50%",
                        filter: "blur(20px)",
                        zIndex: 0,
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <TiltPortrait
                        src="PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                        alt="Waseem Nasir — founder of SkynetLabs, in a black prince coat on a balcony"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <AuroraDivider />

          {/* ══════════════════════════════
              PROOF NUMBERS
          ══════════════════════════════ */}
          <section aria-label="Key metrics" style={sectionPad} ref={statsRef}>
            <div style={inner}>
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", marginBottom: 48 }}
              >
                <SectionLabel>
                  <span style={{ marginLeft: "auto", marginRight: "auto" }}>
                    Proof of work
                  </span>
                </SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                    color: "#EAF0FF",
                    letterSpacing: "-0.025em",
                    margin: 0,
                  }}
                >
                  Numbers that don't move.
                </h2>
              </motion.div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  justifyContent: "center",
                }}
              >
                {STATS.map((s) => (
                  <StatCard key={s.label} {...s} active={statsActive} />
                ))}
              </div>
            </div>
          </section>

          <AuroraDivider />

          {/* ══════════════════════════════
              SERVICES
          ══════════════════════════════ */}
          <section aria-label="Services" style={sectionPad}>
            <div style={inner}>
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 52 }}
              >
                <SectionLabel>What I build</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                    color: "#EAF0FF",
                    letterSpacing: "-0.025em",
                    margin: "0 0 16px",
                    maxWidth: 560,
                  }}
                >
                  Six kinds of leverage.
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    color: "#5A6788",
                    maxWidth: 480,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  Every engagement ends with a system you can hand to an
                  operator and walk away from.
                </p>
              </motion.div>

              <div
                className="d35-service-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {SERVICES.map((s, i) => (
                  <ServiceCard key={s.title} {...s} i={i} />
                ))}
              </div>
            </div>
          </section>

          <AuroraDivider />

          {/* ══════════════════════════════
              SELECTED WORK
          ══════════════════════════════ */}
          <section aria-label="Selected work" style={sectionPad}>
            <div style={inner}>
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 52 }}
              >
                <SectionLabel>Selected work</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                    color: "#EAF0FF",
                    letterSpacing: "-0.025em",
                    margin: 0,
                  }}
                >
                  Ships that sailed.
                </h2>
              </motion.div>

              <div
                className="d35-work-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 20,
                }}
              >
                {WORKS.map((item, i) => (
                  <WorkCard key={item.label} item={item} i={i} />
                ))}
              </div>

              {/* Voice / credibility strip */}
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GlassPanel
                  style={{
                    marginTop: 20,
                    padding: "32px 36px",
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    flexWrap: "wrap",
                  }}
                >
                  <img
                    src="/img/pro/EVENT-expo-booth-navy-polo-chandelier-hall.jpg"
                    alt="Waseem Nasir at an expo booth in a chandelier hall"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      border: "2px solid rgba(110,139,255,0.3)",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <p
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#EAF0FF",
                        margin: "0 0 8px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      "I don't pitch decks. I ship code and hand over runbooks."
                    </p>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.76rem",
                        color: "#5A6788",
                        margin: 0,
                      }}
                    >
                      — Waseem Nasir, Founder SkynetLabs
                    </p>
                  </div>
                  <a
                    href={BOOKING}
                    className="d35-btn-primary"
                    aria-label="Book a discovery call"
                  >
                    Book a call
                  </a>
                </GlassPanel>
              </motion.div>
            </div>
          </section>

          <AuroraDivider />

          {/* ══════════════════════════════
              ABOUT / PHOTO SECTION
          ══════════════════════════════ */}
          <section aria-label="About Waseem" style={sectionPad}>
            <div style={inner}>
              <div
                className="d35-about-cols"
                style={{
                  display: "flex",
                  gap: "clamp(28px, 5vw, 72px)",
                  alignItems: "center",
                }}
              >
                {/* Photos */}
                <motion.div
                  initial={reduced ? {} : { opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{ flex: "0 0 clamp(280px, 40%, 440px)" }}
                >
                  <div className="d35-about-grid">
                    <img
                      src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                      alt="Waseem Nasir arms spread at Nusa Penida cliffs"
                    />
                    <img
                      src="/img/pro/CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg"
                      alt="Waseem on a night rooftop cafe with city lights"
                    />
                    <img
                      src="/img/pro/CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg"
                      alt="Waseem working on laptop at a rooftop cafe with mountain clouds"
                      className="span2"
                    />
                  </div>
                </motion.div>

                {/* Copy */}
                <motion.div
                  initial={reduced ? {} : { opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{ flex: 1 }}
                >
                  <SectionLabel>The operator</SectionLabel>
                  <h2
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                      color: "#EAF0FF",
                      letterSpacing: "-0.025em",
                      margin: "0 0 24px",
                      lineHeight: 1.15,
                    }}
                  >
                    Built from a laptop,
                    <br />
                    from 9 countries.
                  </h2>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.95rem",
                      color: "#5A6788",
                      lineHeight: 1.75,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      I'm Waseem Nasir — independent founder of SkynetLabs.
                      Since 2019 I've shipped 180+ projects for founders,
                      clinics, logistics companies, and agencies across the US,
                      UK, Singapore, Pakistan, and beyond.
                    </p>
                    <p style={{ margin: 0 }}>
                      My stack is n8n for glue, Next.js for surfaces, and AI
                      where there's genuine leverage — not where it's
                      fashionable. Every engagement runs on async principles:
                      you get a working system, a runbook, and a handover. No
                      retainer dependency.
                    </p>
                    <p style={{ margin: 0 }}>
                      Currently operating from Bali and Lahore. Wired in during
                      EU business hours and US EST evenings.
                    </p>
                  </div>

                  {/* Skill chips */}
                  <div
                    style={{
                      marginTop: 28,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {[
                      "n8n",
                      "Next.js",
                      "WhatsApp API",
                      "OpenAI",
                      "Voice AI",
                      "AEO",
                      "WordPress",
                      "Stripe",
                    ].map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.72rem",
                          color: "#6E8BFF",
                          background: "rgba(110,139,255,0.08)",
                          border: "1px solid rgba(110,139,255,0.2)",
                          padding: "5px 12px",
                          borderRadius: 100,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <AuroraDivider />

          {/* ══════════════════════════════
              GALLERY STRIP
          ══════════════════════════════ */}
          <section
            aria-label="Life and work"
            style={{ ...sectionPad, overflow: "hidden" }}
          >
            <div style={inner}>
              <SectionLabel>Remote life</SectionLabel>
            </div>
            <motion.div
              initial={reduced ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                display: "flex",
                gap: 14,
                paddingLeft: "clamp(18px, 5vw, 60px)",
                paddingRight: "clamp(18px, 5vw, 60px)",
                overflowX: "auto",
                paddingBottom: 8,
                scrollbarWidth: "none",
              }}
            >
              {[
                {
                  src: "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
                  alt: "Waseem standing on a jungle bridge with sunglasses",
                },
                {
                  src: "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
                  alt: "Waseem at blue hour with peace sign, laptop, and coconut",
                },
                {
                  src: "LIFESTYLE-2025-08-08-rattan-chair-headphones-pavilion-relaxed.jpg",
                  alt: "Waseem relaxed in rattan chair with headphones",
                },
                {
                  src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Waseem on hilltop with backpack and city vista",
                },
                {
                  src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  alt: "Waseem smiling on rooftop with laptop and dragonfruit smoothie",
                },
                {
                  src: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                  alt: "Waseem with team at night coworking space",
                },
                {
                  src: "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
                  alt: "Waseem on beach arms spread laughing at camera",
                },
              ].map(({ src, alt }) => (
                <div
                  key={src}
                  style={{
                    flexShrink: 0,
                    width: 220,
                    height: 280,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(110,139,255,0.12)",
                  }}
                >
                  <img
                    src={`/img/pro/${src}`}
                    alt={alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </section>

          <AuroraDivider />

          {/* ══════════════════════════════
              CONTACT / CTA
          ══════════════════════════════ */}
          <section aria-label="Contact and call to action" style={sectionPad}>
            <div style={inner}>
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <GlassPanel
                  style={{
                    padding: "clamp(48px, 8vw, 80px) clamp(32px, 6vw, 80px)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Subtle inner glow */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "60%",
                      height: "60%",
                      background:
                        "radial-gradient(ellipse, rgba(110,139,255,0.12) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <SectionLabel>
                      <span style={{ margin: "0 auto" }}>
                        Ready when you are
                      </span>
                    </SectionLabel>
                    <h2
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                        color: "#EAF0FF",
                        letterSpacing: "-0.03em",
                        margin: "0 0 20px",
                        lineHeight: 1.1,
                      }}
                    >
                      30 minutes to know
                      <br />
                      <span
                        style={{
                          background:
                            "linear-gradient(90deg, #6E8BFF 0%, #36E0B0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        if we're a fit.
                      </span>
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1rem",
                        color: "#5A6788",
                        maxWidth: 480,
                        margin: "0 auto 40px",
                        lineHeight: 1.7,
                      }}
                    >
                      Bring your biggest ops headache. I'll tell you what I'd
                      automate, in what order, and what it actually costs. No
                      deck, no upsell.
                    </p>
                    <a
                      href={BOOKING}
                      className="d35-btn-primary"
                      aria-label="Book a 30-minute discovery call with Waseem"
                      style={{ fontSize: "1rem", padding: "17px 44px" }}
                    >
                      Book a discovery call
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.5 9h11M10 5l4.5 4L10 13"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>

                    {/* Additional contact options */}
                    <div
                      style={{
                        marginTop: 28,
                        display: "flex",
                        justifyContent: "center",
                        gap: 24,
                        flexWrap: "wrap",
                      }}
                    >
                      <a
                        href="https://github.com/waseemnasir2k26"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.76rem",
                          color: "#5A6788",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.color = "#6E8BFF")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.color = "#5A6788")
                        }
                        aria-label="GitHub profile"
                      >
                        github.com/waseemnasir2k26
                      </a>
                      <span
                        style={{
                          color: "#5A6788",
                          fontSize: "0.76rem",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        ·
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.76rem",
                          color: "#5A6788",
                        }}
                      >
                        Bali / Lahore · Remote
                      </span>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            </div>
          </section>
        </main>

        {/* ══════════════════════════════
            FOOTER
        ══════════════════════════════ */}
        <footer
          role="contentinfo"
          style={{
            borderTop: "1px solid rgba(110,139,255,0.08)",
            padding: "32px clamp(18px, 5vw, 60px)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
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
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "#EAF0FF",
                letterSpacing: "-0.01em",
              }}
            >
              SkynetLabs
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                color: "#5A6788",
              }}
            >
              © {new Date().getFullYear()} Waseem Nasir · Design 35 — Midnight
              Glass Aurora
            </div>
            <a
              href={BOOKING}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.82rem",
                color: "#6E8BFF",
                textDecoration: "none",
              }}
              aria-label="Book a call"
            >
              Book a call →
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
