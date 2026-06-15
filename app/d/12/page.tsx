"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
  animate,
} from "framer-motion";
import Link from "next/link";

/* ─── types ─────────────────────────────────────────────── */
interface Panel {
  id: number;
  label: string;
  headline: string;
  body: string;
  img: string;
  imgAlt: string;
  tag: string;
  velocity: number; /* parallax multiplier */
}

/* ─── data ───────────────────────────────────────────────── */
const PANELS: Panel[] = [
  {
    id: 1,
    label: "01 / AI Systems",
    headline: "Workflows that\nrun while\nyou sleep.",
    body: "n8n pipelines that qualify leads, book calls, and follow up — no human in the loop.",
    img: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    imgAlt: "Waseem typing on laptop at Bali terrace cafe",
    tag: "Automation",
    velocity: 0.35,
  },
  {
    id: 2,
    label: "02 / Web Builds",
    headline: "Next.js sites\nthat load before\nthe click lands.",
    body: "180+ projects shipped. Every one performance-first, SEO-clean, conversion-wired.",
    img: "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    imgAlt: "Waseem with dual laptops showing analytics dashboard",
    tag: "Next.js",
    velocity: 0.5,
  },
  {
    id: 3,
    label: "03 / AEO",
    headline: "Answer engines\ncite you.\nNot the rival.",
    body: "Structure, schema, and authority signals that put your brand in AI responses.",
    img: "/img/pro/WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
    imgAlt: "Waseem focused on phone at rice terrace",
    tag: "AEO",
    velocity: 0.42,
  },
  {
    id: 4,
    label: "04 / Voice & Chat",
    headline: "Bots that close.\nNot just\nreply.",
    body: "WhatsApp + voice receptionists that handle enquiries, triage, and book calls — 24/7.",
    img: "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    imgAlt: "Waseem typing at night cafe with backlit keyboard",
    tag: "WhatsApp · Voice",
    velocity: 0.28,
  },
  {
    id: 5,
    label: "05 / Clients",
    headline: "40+ founders\nacross\n9 countries.",
    body: "From Bali startups to Singapore clinics to US freight operators — same standard, every time.",
    img: "/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    imgAlt: "Waseem and client smiling thumbs up at cafe",
    tag: "Global",
    velocity: 0.6,
  },
  {
    id: 6,
    label: "06 / Process",
    headline: "Shipped in weeks.\nNot quarters.",
    body: "No committees. No sprints theatre. Brief → build → deploy. You own the repo.",
    img: "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    imgAlt: "Waseem focused on phone at coworking desk",
    tag: "Speed",
    velocity: 0.38,
  },
  {
    id: 7,
    label: "07 / Remote",
    headline: "Bali. Lahore.\nWherever the\nwork needs.",
    body: "Operating since 2019. Same systems, same output — timezone is just a config value.",
    img: "/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    imgAlt: "Waseem with arms spread at Nusa Penida cliffs",
    tag: "Remote-first",
    velocity: 0.55,
  },
  {
    id: 8,
    label: "08 / Let's Build",
    headline: "30 minutes.\nOne call.\nClear next step.",
    body: "Book a discovery call. No pitch deck. Just an honest look at what we can build together.",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    imgAlt: "Waseem arms crossed sunglasses confident pose",
    tag: "Book now",
    velocity: 0.3,
  },
];

const STATS = [
  { value: "180+", label: "builds shipped" },
  { value: "40+", label: "clients" },
  { value: "9", label: "countries" },
  { value: "2019", label: "operating since" },
];

const SERVICES = [
  { icon: "⟳", name: "AI Automation", desc: "n8n · Zapier · custom agents" },
  { icon: "◈", name: "Next.js Builds", desc: "Full-stack, edge-ready" },
  { icon: "◉", name: "AEO / SEO", desc: "Answer Engine Optimization" },
  { icon: "◎", name: "Voice & WhatsApp Bots", desc: "24/7 lead capture" },
  { icon: "◇", name: "Workflow Ops", desc: "Kill manual busywork" },
  { icon: "○", name: "CRM Wiring", desc: "GHL · HubSpot · custom" },
];

/* ─── helpers ────────────────────────────────────────────── */
function useWindowSize() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const ctrl = animate(0, to, {
            duration: 1.6,
            ease: "easeOut",
            onUpdate: (v) => setVal(Math.round(v)),
          });
          obs.disconnect();
          return () => ctrl.stop();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── letter reveal ──────────────────────────────────────── */
function KineticHeadline({
  text,
  progress,
}: {
  text: string;
  progress: number;
}) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, li) => (
        <div key={li} style={{ overflow: "hidden", display: "block" }}>
          <motion.div
            style={{
              display: "block",
              translateY: `${(1 - Math.min(progress * 3, 1)) * 60}px`,
              opacity: Math.min(progress * 3, 1),
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ─── main component ─────────────────────────────────────── */
export default function SidewaysKinetic() {
  const shouldReduceMotion = useReducedMotion();
  const { w: winW } = useWindowSize();

  /* track section refs for sections below gallery */
  const sectionRef = useRef<HTMLDivElement>(null);

  /* horizontal scroll state */
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0); /* 0 → -maxScroll */
  const springX = useSpring(rawX, { stiffness: 80, damping: 20, mass: 0.8 });
  const displayX = shouldReduceMotion ? rawX : springX;

  const [activePanel, setActivePanel] = useState(0);
  const [panelProgress, setPanelProgress] = useState<number[]>(
    PANELS.map(() => 0),
  );
  const maxScrollRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartVal = useRef(0);

  /* PANEL WIDTH — 85vw each */
  const PANEL_W = winW * 0.85;
  const GAP = winW * 0.04;

  /* ── compute max scroll ── */
  useEffect(() => {
    if (!winW) return;
    const total = PANELS.length * (PANEL_W + GAP);
    maxScrollRef.current = total - winW;
  }, [winW, PANEL_W, GAP]);

  /* ── wheel handler ── */
  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const next = Math.max(
        -maxScrollRef.current,
        Math.min(0, rawX.get() - delta * 1.2),
      );
      rawX.set(next);
      /* derive active panel */
      const idx = Math.round(-next / (PANEL_W + GAP));
      setActivePanel(Math.min(idx, PANELS.length - 1));
      /* per-panel progress */
      const progs = PANELS.map((_, i) => {
        const panelStart = i * (PANEL_W + GAP);
        const p = (-next - panelStart + winW * 0.5) / (PANEL_W + GAP);
        return Math.max(0, Math.min(1, p));
      });
      setPanelProgress(progs);
    },
    [rawX, PANEL_W, GAP, winW],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  /* ── touch / drag ── */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartVal.current = rawX.get();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [rawX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const next = Math.max(
        -maxScrollRef.current,
        Math.min(0, dragStartVal.current + delta),
      );
      rawX.set(next);
      const idx = Math.round(-next / (PANEL_W + GAP));
      setActivePanel(Math.min(idx, PANELS.length - 1));
      const progs = PANELS.map((_, i) => {
        const panelStart = i * (PANEL_W + GAP);
        const p = (-next - panelStart + winW * 0.5) / (PANEL_W + GAP);
        return Math.max(0, Math.min(1, p));
      });
      setPanelProgress(progs);
    },
    [rawX, PANEL_W, GAP, winW],
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /* ── keyboard nav ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const next = Math.max(
          -maxScrollRef.current,
          rawX.get() - (PANEL_W + GAP),
        );
        rawX.set(next);
        setActivePanel((p) => Math.min(p + 1, PANELS.length - 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const next = Math.min(0, rawX.get() + (PANEL_W + GAP));
        rawX.set(next);
        setActivePanel((p) => Math.max(p - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rawX, PANEL_W, GAP]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap');

        .root-12 * { box-sizing: border-box; margin: 0; padding: 0; }

        .root-12 a:focus-visible {
          outline: 2px solid #6D5CFF;
          outline-offset: 4px;
          border-radius: 4px;
        }

        /* ─ progress rail ─ */
        .d12-rail {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: linear-gradient(90deg, #6D5CFF, #FF5C8A);
          z-index: 200;
          transform-origin: left;
          transition: width 0.12s ease;
          pointer-events: none;
        }

        /* ─ dots ─ */
        .d12-dots {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 200;
        }
        .d12-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(245,244,251,0.25);
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }
        .d12-dot.active {
          background: #6D5CFF;
          width: 24px;
          border-radius: 3px;
        }

        /* ─ panel ─ */
        .d12-panel {
          position: relative;
          flex: none;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: #1A1A26;
          border: 1px solid rgba(109,92,255,0.15);
        }

        .d12-panel-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        .d12-panel-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(16,16,24,0.97) 0%,
            rgba(16,16,24,0.6) 40%,
            rgba(16,16,24,0.1) 100%
          );
        }

        .d12-panel-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 48px 48px 56px;
        }

        /* ─ kinetic headline letters ─ */
        .d12-kinetic-headline {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 5.5vw, 72px);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #F5F4FB;
          white-space: pre-line;
          margin-bottom: 16px;
        }

        .d12-panel-body {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.65;
          color: rgba(245,244,251,0.7);
          max-width: 420px;
          margin-bottom: 20px;
        }

        .d12-panel-tag {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #6D5CFF;
          border: 1px solid rgba(109,92,255,0.4);
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.06em;
        }

        .d12-panel-label {
          position: absolute;
          top: 32px; left: 48px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(245,244,251,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ─ hint arrow ─ */
        @keyframes d12-nudge {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          50% { transform: translateX(6px); opacity: 1; }
        }
        .d12-hint {
          animation: d12-nudge 1.8s ease-in-out infinite;
        }

        /* ─ service grid ─ */
        .d12-services {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 768px) {
          .d12-services { grid-template-columns: repeat(2, 1fr); }
          .d12-panel-content { padding: 28px 24px 40px; }
          .d12-panel-label { left: 24px; }
          .d12-kinetic-headline { font-size: clamp(28px, 8vw, 40px); }
        }

        /* ─ about photo mosaic ─ */
        .d12-mosaic {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 320px 200px;
          gap: 3px;
        }
        .d12-mosaic .span2 { grid-column: span 2; }
        @media (max-width: 768px) {
          .d12-mosaic {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 220px 160px;
          }
          .d12-mosaic .span2 { grid-column: span 1; }
        }

        /* ─ marquee ─ */
        @keyframes d12-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .d12-marquee-inner {
          display: flex;
          white-space: nowrap;
          animation: d12-marquee 18s linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .d12-marquee-inner { animation: none; }
          .d12-hint { animation: none; }
        }

        /* ─ CTA button ─ */
        .d12-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          background: #6D5CFF;
          color: #F5F4FB;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 15px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          position: relative;
          overflow: hidden;
        }
        .d12-cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
        }
        .d12-cta-btn:hover {
          background: #7D6FFF;
          transform: translateY(-2px);
        }
        .d12-cta-btn:active { transform: translateY(0); }
      `}</style>

      <div className="root-12" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* skip nav */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            top: -40,
            left: 8,
            background: "#6D5CFF",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 14,
            zIndex: 999,
            transition: "top 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.top = "8px")}
          onBlur={(e) => (e.currentTarget.style.top = "-40px")}
        >
          Skip to content
        </a>

        {/* full-bleed opaque root */}
        <main
          id="main-content"
          style={{
            minHeight: "100vh",
            background: "#101018",
            color: "#F5F4FB",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* ── PROGRESS RAIL ── */}
          <div
            className="d12-rail"
            style={{ width: `${((activePanel + 1) / PANELS.length) * 100}%` }}
            aria-hidden="true"
          />

          {/* ── NAV ── */}
          <nav
            aria-label="Site navigation"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 40px",
              background: "rgba(16,16,24,0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(109,92,255,0.1)",
            }}
          >
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.02em",
              }}
            >
              Waseem<span style={{ color: "#6D5CFF" }}>.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a
                href="https://github.com/waseemnasir2k26"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  color: "rgba(245,244,251,0.5)",
                  textDecoration: "none",
                }}
              >
                github
              </a>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="d12-cta-btn"
                style={{ padding: "10px 22px", fontSize: 13 }}
              >
                Book a call
              </a>
            </div>
          </nav>

          {/* ── HERO ── */}
          <section
            aria-labelledby="d12-hero-headline"
            style={{
              paddingTop: "140px",
              paddingLeft: "40px",
              paddingRight: "40px",
              paddingBottom: "60px",
            }}
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: "#6D5CFF",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                SkynetLabs · Waseem Nasir · Since 2019
              </div>
              <h1
                id="d12-hero-headline"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(48px, 8vw, 110px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.04em",
                  color: "#F5F4FB",
                  maxWidth: "18ch",
                  marginBottom: 28,
                }}
              >
                Scroll sideways through what I've shipped.
              </h1>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 18,
                  color: "rgba(245,244,251,0.55)",
                  fontWeight: 400,
                  marginBottom: 16,
                }}
              >
                180+ builds &middot; 40+ clients &middot; 9 countries &middot;
                since 2019.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(245,244,251,0.35)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                }}
                aria-label="Drag or scroll right to navigate gallery"
              >
                <span>Use scroll or drag to move</span>
                <span className="d12-hint" aria-hidden="true">
                  →
                </span>
              </div>
            </motion.div>
          </section>

          {/* ── HORIZONTAL GALLERY ── */}
          <section
            aria-label="Work gallery"
            ref={containerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              height: "72vh",
              overflow: "hidden",
              cursor: isDragging.current ? "grabbing" : "grab",
              userSelect: "none",
              touchAction: "none",
              position: "relative",
            }}
          >
            <motion.div
              ref={trackRef}
              style={{
                display: "flex",
                gap: `${GAP}px`,
                height: "100%",
                paddingLeft: "40px",
                paddingRight: "40px",
                x: displayX,
              }}
            >
              {PANELS.map((panel, i) => {
                const prog = panelProgress[i] ?? 0;
                const imgParallax = shouldReduceMotion
                  ? 0
                  : (prog - 0.5) * panel.velocity * 100;

                return (
                  <div
                    key={panel.id}
                    className="d12-panel"
                    style={{ width: `${PANEL_W}px` }}
                    role="group"
                    aria-label={`Panel ${panel.id}: ${panel.label}`}
                  >
                    {/* parallax image */}
                    <motion.img
                      className="d12-panel-img"
                      src={panel.img}
                      alt={panel.imgAlt}
                      style={{
                        x: `${imgParallax}%`,
                        scale: 1.18,
                      }}
                      draggable={false}
                    />
                    <div className="d12-panel-scrim" aria-hidden="true" />

                    {/* label top-left */}
                    <div className="d12-panel-label" aria-hidden="true">
                      {panel.label}
                    </div>

                    {/* active indicator */}
                    {activePanel === i && (
                      <motion.div
                        layoutId="d12-active-border"
                        style={{
                          position: "absolute",
                          inset: 0,
                          border: "2px solid rgba(109,92,255,0.6)",
                          borderRadius: 16,
                          pointerEvents: "none",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* content */}
                    <div className="d12-panel-content">
                      <div className="d12-kinetic-headline">
                        <KineticHeadline
                          text={panel.headline}
                          progress={prog}
                        />
                      </div>
                      <p className="d12-panel-body">{panel.body}</p>
                      <span className="d12-panel-tag">{panel.tag}</span>

                      {/* CTA on last panel */}
                      {panel.id === 8 && (
                        <div style={{ marginTop: 28 }}>
                          <a
                            href="https://skynetjoe.com/discovery-call"
                            className="d12-cta-btn"
                          >
                            Book discovery call
                            <span aria-hidden="true">→</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </section>

          {/* ── DOTS ── */}
          <nav className="d12-dots" aria-label="Gallery navigation">
            {PANELS.map((p, i) => (
              <button
                key={p.id}
                className={`d12-dot${activePanel === i ? " active" : ""}`}
                aria-label={`Go to panel ${i + 1}: ${p.label}`}
                aria-current={activePanel === i ? "true" : undefined}
                onClick={() => {
                  const targetX = -(i * (PANEL_W + GAP));
                  rawX.set(targetX);
                  setActivePanel(i);
                }}
              />
            ))}
          </nav>

          {/* ── MARQUEE STRIP ── */}
          <div
            aria-hidden="true"
            style={{
              borderTop: "1px solid rgba(109,92,255,0.12)",
              borderBottom: "1px solid rgba(109,92,255,0.12)",
              overflow: "hidden",
              marginTop: "80px",
              padding: "16px 0",
              background: "#0E0E1A",
            }}
          >
            <div className="d12-marquee-inner">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(245,244,251,0.25)",
                    marginRight: "60px",
                    display: "inline-flex",
                    gap: "60px",
                  }}
                >
                  <span>AI Automation</span>
                  <span style={{ color: "#6D5CFF" }}>◆</span>
                  <span>Next.js</span>
                  <span style={{ color: "#FF5C8A" }}>◆</span>
                  <span>AEO</span>
                  <span style={{ color: "#6D5CFF" }}>◆</span>
                  <span>WhatsApp Bots</span>
                  <span style={{ color: "#FF5C8A" }}>◆</span>
                  <span>Voice Agents</span>
                  <span style={{ color: "#6D5CFF" }}>◆</span>
                  <span>Workflow Ops</span>
                  <span style={{ color: "#FF5C8A" }}>◆</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── STATS ── */}
          <section
            aria-labelledby="d12-stats-heading"
            style={{ padding: "100px 40px" }}
          >
            <h2
              id="d12-stats-heading"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 4vw, 52px)",
                letterSpacing: "-0.03em",
                marginBottom: 64,
                color: "#F5F4FB",
              }}
            >
              The numbers
              <span style={{ color: "#6D5CFF" }}> don't need a deck.</span>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#1A1A26",
                    border: "1px solid rgba(109,92,255,0.1)",
                    padding: "48px 40px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(52px, 6vw, 80px)",
                      letterSpacing: "-0.04em",
                      background: "linear-gradient(135deg, #6D5CFF, #FF5C8A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1,
                      marginBottom: 12,
                    }}
                    aria-label={`${s.value} ${s.label}`}
                  >
                    {s.value === "9" ? (
                      <CountUp to={9} />
                    ) : s.value === "2019" ? (
                      <CountUp to={2019} />
                    ) : s.value === "40+" ? (
                      <>
                        <CountUp to={40} />+
                      </>
                    ) : (
                      <>
                        <CountUp to={180} />+
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      color: "rgba(245,244,251,0.45)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SERVICES ── */}
          <section
            aria-labelledby="d12-services-heading"
            style={{ padding: "0 40px 100px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 48,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <h2
                id="d12-services-heading"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  letterSpacing: "-0.03em",
                  color: "#F5F4FB",
                }}
              >
                What I build.
              </h2>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  color: "rgba(245,244,251,0.35)",
                  letterSpacing: "0.08em",
                }}
              >
                Every service, zero fluff.
              </span>
            </div>
            <div className="d12-services">
              {SERVICES.map((svc, i) => (
                <motion.div
                  key={svc.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  style={{
                    background: "#1A1A26",
                    border: "1px solid rgba(109,92,255,0.1)",
                    padding: "36px 32px",
                    cursor: "default",
                    transition: "border-color 0.2s",
                  }}
                  whileHover={{ borderColor: "rgba(109,92,255,0.4)" }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 22,
                      color: "#6D5CFF",
                      marginBottom: 16,
                    }}
                  >
                    {svc.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 600,
                      fontSize: 18,
                      color: "#F5F4FB",
                      marginBottom: 8,
                    }}
                  >
                    {svc.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      color: "rgba(245,244,251,0.4)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {svc.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── ABOUT / PHOTO MOSAIC ── */}
          <section
            aria-labelledby="d12-about-heading"
            style={{ padding: "0 40px 100px" }}
          >
            <h2
              id="d12-about-heading"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                letterSpacing: "-0.03em",
                color: "#F5F4FB",
                marginBottom: 48,
              }}
            >
              The person behind the builds.
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
                alignItems: "start",
              }}
            >
              {/* text */}
              <div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 18,
                    lineHeight: 1.7,
                    color: "rgba(245,244,251,0.7)",
                    marginBottom: 24,
                  }}
                >
                  I'm Waseem Nasir — independent founder of SkynetLabs. I build
                  AI and automation systems that eliminate the manual work
                  eating your margins: missed leads, dead follow-ups,
                  spreadsheet ops.
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "rgba(245,244,251,0.5)",
                    marginBottom: 40,
                  }}
                >
                  Remote-first since 2019. Based between Bali and Lahore. 40+
                  clients across 9 countries. I keep the team small and the
                  output tight — you get direct access, not an account manager.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="d12-cta-btn"
                >
                  Book a 30-minute call
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              {/* photo mosaic */}
              <div className="d12-mosaic">
                <img
                  className="span2"
                  src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                  alt="Waseem Nasir, arms crossed, confident pose"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    borderRadius: 8,
                  }}
                />
                <img
                  src="/img/pro/TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg"
                  alt="Waseem at hilltop with city vista"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 8,
                  }}
                />
                <img
                  src="/img/pro/CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg"
                  alt="Waseem smiling at rooftop cafe with laptop"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    borderRadius: 8,
                  }}
                />
                <img
                  src="/img/pro/LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg"
                  alt="Waseem standing by neon quote sign"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 8,
                  }}
                />
                <img
                  src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                  alt="Waseem at Nusa Penida cliffs, arms spread"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </section>

          {/* ── VOICE / SELECTED WORK CALLOUT ── */}
          <section
            aria-label="Selected work highlights"
            style={{
              margin: "0 40px 100px",
              background: "#1A1A26",
              border: "1px solid rgba(109,92,255,0.15)",
              borderRadius: 16,
              padding: "60px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: "#FF5C8A",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                Recent scene
              </div>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(28px, 3vw, 42px)",
                  letterSpacing: "-0.03em",
                  color: "#F5F4FB",
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >
                A $27 checkout that converts — built, wired, and live in a week.
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: "rgba(245,244,251,0.6)",
                  marginBottom: 32,
                }}
              >
                Stripe funnel for a US physical therapy clinic. WooCommerce
                checkout, custom mobile nav, live Zocdoc booking widget, and
                sticky header — tested, confirmed, zero bugs at handoff.
              </p>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  color: "rgba(245,244,251,0.35)",
                  letterSpacing: "0.06em",
                }}
              >
                Next.js · Stripe · WooCommerce · GHL
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <img
                src="/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg"
                alt="Waseem and client giving thumbs up at cafe"
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  objectPosition: "center top",
                  borderRadius: 12,
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "rgba(16,16,24,0.8)",
                  border: "1px solid rgba(109,92,255,0.3)",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: "#6D5CFF",
                  backdropFilter: "blur(8px)",
                }}
              >
                ● DELIVERED
              </div>
            </div>
          </section>

          {/* ── MORE PHOTOS ROW ── */}
          <section
            aria-label="Field photos"
            style={{ padding: "0 40px 100px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 3,
                height: 260,
              }}
            >
              {[
                {
                  src: "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  alt: "Waseem smiling with dragonfruit smoothie and laptop on rooftop",
                },
                {
                  src: "/img/pro/EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
                  alt: "Waseem at expo booth in chandelier hall",
                },
                {
                  src: "/img/pro/PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
                  alt: "Waseem smiling at rice field with palms",
                },
                {
                  src: "/img/pro/CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
                  alt: "Waseem smiling with headphones at neon tea sign",
                },
              ].map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    borderRadius: 6,
                  }}
                />
              ))}
            </div>
          </section>

          {/* ── CONTACT / CTA ── */}
          <section
            aria-labelledby="d12-cta-heading"
            style={{
              padding: "100px 40px",
              background: "#0E0E1A",
              borderTop: "1px solid rgba(109,92,255,0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#6D5CFF",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              One conversation. No pitch.
            </div>
            <h2
              id="d12-cta-heading"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(40px, 6vw, 88px)",
                letterSpacing: "-0.04em",
                color: "#F5F4FB",
                lineHeight: 1.0,
                marginBottom: 32,
                maxWidth: "18ch",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Let's find the 10 hours a week your team is burning.
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 17,
                color: "rgba(245,244,251,0.5)",
                marginBottom: 48,
                lineHeight: 1.6,
              }}
            >
              30-minute call. We map the bottleneck. You leave with a clear plan
              — build or not.
            </p>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="d12-cta-btn"
              style={{ fontSize: 16, padding: "20px 48px" }}
            >
              Book discovery call
              <span aria-hidden="true" style={{ fontSize: 20 }}>
                →
              </span>
            </a>

            <div
              style={{
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
                gap: 48,
                flexWrap: "wrap",
              }}
            >
              <img
                src="/img/pro/PORTRAIT-stool-portrait-navy-polo-framed-art.jpg"
                alt="Waseem Nasir portrait"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  border: "2px solid rgba(109,92,255,0.4)",
                }}
              />
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#F5F4FB",
                    marginBottom: 4,
                  }}
                >
                  Waseem Nasir
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: "rgba(245,244,251,0.4)",
                    marginBottom: 8,
                  }}
                >
                  Founder, SkynetLabs
                </div>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: "#6D5CFF",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  github.com/waseemnasir2k26
                </a>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer
            role="contentinfo"
            style={{
              padding: "32px 40px",
              borderTop: "1px solid rgba(109,92,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "rgba(245,244,251,0.25)",
                letterSpacing: "0.06em",
              }}
            >
              &copy; {new Date().getFullYear()} SkynetLabs &mdash; Waseem Nasir.
              Design 12 / Sideways.
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <a
                href="https://github.com/waseemnasir2k26"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: "rgba(245,244,251,0.3)",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                }}
              >
                GitHub
              </a>
              <a
                href="https://skynetjoe.com/discovery-call"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: "#6D5CFF",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                }}
              >
                Book a call
              </a>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
