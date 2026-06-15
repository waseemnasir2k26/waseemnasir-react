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

/* ─── Constants ─── */
const INK_RED = "#E8341A";
const INK_BLUE = "#1A3AD4";
const PAPER = "#F2E8D8";
const PAPER_DARK = "#E8D8C0";
const INK_BLACK = "#1A1410";
const CREAM = "#FDF6EB";

/* ─── Risograph misregistration hook ─── */
function useMisregistration(enabled: boolean, autoPlay = false) {
  const [shift, setShift] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (!enabled) return;
    setShift(1);
    timerRef.current = setTimeout(() => {
      setShift(2);
      timerRef.current = setTimeout(() => setShift(0), 120);
    }, 80);
  }, [enabled]);

  useEffect(() => {
    if (!autoPlay || !enabled) return;
    const id = setInterval(() => trigger(), 4200 + Math.random() * 3000);
    return () => clearInterval(id);
  }, [autoPlay, enabled, trigger]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { shift, trigger };
}

/* ─── Count-up hook ─── */
function useCountUp(target: number, suffix = "", decimals = 0) {
  const [val, setVal] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !triggered.current) {
          triggered.current = true;
          const mv = { v: 0 };
          animate(mv.v, target, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setVal(v.toFixed(decimals) + suffix),
            onComplete: () => setVal(target.toFixed(decimals) + suffix),
          });
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix, decimals]);
  return { ref, val };
}

/* ─── Scroll velocity ─── */
function useScrollVelocity() {
  const [vel, setVel] = useState(0);
  const lastY = useRef(0);
  const lastT = useRef(Date.now());
  const rafRef = useRef(0);
  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const now = Date.now();
        const dt = now - lastT.current;
        if (dt > 0) {
          const v = Math.abs(window.scrollY - lastY.current) / dt;
          setVel(Math.min(v * 15, 1));
        }
        lastY.current = window.scrollY;
        lastT.current = now;
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  return vel;
}

/* ─── Risograph-duotone image ─── */
function RisoImage({
  src,
  alt,
  className,
  style,
  inkColor = INK_RED,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  inkColor?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<0 | 1 | 2>(0); // 0=hidden 1=halftone 2=revealed

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          obs.disconnect();
          if (reduced) {
            setPhase(2);
            return;
          }
          setTimeout(() => setPhase(1), 60);
          setTimeout(() => setPhase(2), 700);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        background: PAPER_DARK,
        ...style,
      }}
    >
      {/* Duotone-ish base via CSS blend */}
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: reduced
            ? "none"
            : "opacity 0.55s ease, filter 0.55s ease",
          opacity: phase === 0 ? 0 : phase === 1 ? 0.55 : 1,
          filter:
            phase === 2
              ? "contrast(1.08) saturate(0.85)"
              : "contrast(2.2) brightness(0.25) saturate(0)",
        }}
      />
      {/* Ink halftone screen — fades out as image reveals */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${inkColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "7px 7px",
          opacity: phase === 2 ? 0 : phase === 1 ? 0.55 : 0,
          transition: reduced ? "none" : "opacity 0.6s ease 0.1s",
          mixBlendMode: "multiply",
        }}
      />
      {/* Overprint color wash — risograph ink bleed */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `${inkColor}18`,
          mixBlendMode: "multiply",
          opacity: phase === 2 ? 1 : 0,
          transition: reduced ? "none" : "opacity 0.4s ease 0.3s",
        }}
      />
    </div>
  );
}

/* ─── MisregText — chromatic aberration on text ─── */
function MisregText({
  children,
  className,
  style,
  as: Tag = "span",
  autoPlay = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  autoPlay?: boolean;
}) {
  const reduced = useReducedMotion();
  const { shift, trigger } = useMisregistration(!reduced, autoPlay);

  const redX = shift === 1 ? -5 : shift === 2 ? -3 : 0;
  const redY = shift === 1 ? -3 : shift === 2 ? -1 : 0;
  const blueX = shift === 1 ? 5 : shift === 2 ? 3 : 0;
  const blueY = shift === 1 ? 3 : shift === 2 ? 1 : 0;

  return (
    // @ts-ignore dynamic tag
    <Tag
      className={className}
      onMouseEnter={trigger}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "default",
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          color: INK_RED,
          transform: `translate(${redX}px,${redY}px)`,
          transition: shift
            ? "none"
            : "transform 0.3s cubic-bezier(.22,1,.36,1)",
          userSelect: "none",
          whiteSpace: "inherit",
          willChange: "transform",
        }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          color: INK_BLUE,
          transform: `translate(${blueX}px,${blueY}px)`,
          transition: shift
            ? "none"
            : "transform 0.3s cubic-bezier(.22,1,.36,1)",
          userSelect: "none",
          whiteSpace: "inherit",
          willChange: "transform",
        }}
      >
        {children}
      </span>
      <span
        style={{
          position: "relative",
          color: "inherit",
          whiteSpace: "inherit",
        }}
      >
        {children}
      </span>
    </Tag>
  );
}

/* ─── Torn paper edge — more irregular path ─── */
function TornEdge({
  flip = false,
  color = PAPER,
}: {
  flip?: boolean;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 52"
      preserveAspectRatio="none"
      style={{
        display: "block",
        width: "100%",
        height: 52,
        transform: flip ? "scaleY(-1)" : "none",
      }}
    >
      <path
        d="M0,28 C18,8 34,44 56,22 C78,2 90,46 114,26 C138,6 155,42 178,20
           C200,0 222,48 248,24 C274,2 290,44 316,22 C342,2 358,46 384,24
           C410,4 428,40 456,20 C484,2 500,48 528,26 C554,6 574,44 602,22
           C630,2 648,46 676,24 C702,4 722,42 748,20 C774,0 792,48 820,28
           C848,8 864,44 892,22 C920,2 936,48 964,26 C992,6 1010,44 1038,22
           C1064,2 1082,46 1108,24 C1134,4 1152,42 1178,20 C1204,0 1222,48 1248,26
           C1274,6 1294,44 1320,22 C1344,2 1362,44 1392,24 L1440,20 L1440,52 L0,52 Z"
        fill={color}
      />
    </svg>
  );
}

/* ─── Ink splat / stamp badge ─── */
function Stamp({
  label,
  angle = -5,
  color = INK_RED,
  bg = "transparent",
}: {
  label: string;
  angle?: number;
  color?: string;
  bg?: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 14px",
        border: `2.5px solid ${color}`,
        color: bg !== "transparent" ? bg : color,
        background: bg !== "transparent" ? color : "transparent",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 400,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        transform: `rotate(${angle}deg)`,
        boxShadow: `2px 2px 0 ${color}`,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
}

/* ─── Halftone section divider ─── */
function HalftoneDivider({ color = INK_RED }: { color?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 1440 24"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 24 }}
      >
        <defs>
          <pattern
            id={`dots-${color.replace("#", "")}`}
            x="0"
            y="0"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="1.8" fill={color} />
          </pattern>
        </defs>
        <rect
          width="1440"
          height="24"
          fill={`url(#dots-${color.replace("#", "")})`}
        />
      </svg>
    </div>
  );
}

/* ─── Services data ─── */
const SERVICES = [
  {
    num: "01",
    title: "AI Voice Bots",
    body: "Never miss a lead call. Voice agents that qualify, book, follow up — 24/7, no payroll.",
  },
  {
    num: "02",
    title: "n8n Automation",
    body: "Kill the 40-tab shuffle. One workflow engine wires your whole stack.",
  },
  {
    num: "03",
    title: "WhatsApp Bots",
    body: "Your fastest channel, automated. Replies, reminders, upsells — instant.",
  },
  {
    num: "04",
    title: "AEO & SEO",
    body: "Get cited by AI assistants. Structured content that wins featured answers.",
  },
  {
    num: "05",
    title: "Next.js Builds",
    body: "Production-grade web apps. Fast, edge-deployed, built to scale with you.",
  },
  {
    num: "06",
    title: "Ops Teardown",
    body: "30-min brutal audit of your broken ops. You leave with a kill list.",
  },
];

/* ─── Work snippets ─── */
const WORK_ITEMS = [
  {
    tag: "VOICE BOT",
    client: "US Freight Co.",
    result: "Inbound calls handled overnight. 0 missed leads in 90 days.",
  },
  {
    tag: "WHATSAPP",
    client: "SG Clinic Chain",
    result: "Appointment rebooking automated. 40% drop in no-shows.",
  },
  {
    tag: "n8n PIPELINE",
    client: "PT Agency · Lahore",
    result: "Lead → CRM → follow-up in 8 minutes. Was 3 days manual.",
  },
  {
    tag: "AEO",
    client: "SkynetJoe.com",
    result: "AI citations in 4 assistants within 6 weeks. Organic traffic +3x.",
  },
  {
    tag: "NEXT.JS",
    client: "E-comm · Bali",
    result: "Rebuilt legacy site. LCP under 1s. Conversion rate doubled.",
  },
  {
    tag: "AUTOMATION",
    client: "Recruiting SaaS",
    result: "Candidate outreach loop. 500 messages/day with zero human ops.",
  },
];

/* ─── Proof stats ─── */
const STATS = [
  { target: 180, suffix: "+", label: "Builds shipped" },
  { target: 40, suffix: "+", label: "Clients" },
  { target: 9, suffix: "", label: "Countries" },
  { target: 2019, suffix: "", label: "Year one" },
];

/* ─── StatCounter sub-component ─── */
function StatCounter({
  target,
  suffix,
  label,
  color,
}: {
  target: number;
  suffix: string;
  label: string;
  color: string;
}) {
  const { ref, val } = useCountUp(target, suffix);
  return (
    <div ref={ref}>
      <div
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(32px,4vw,44px)",
          lineHeight: 1,
          color,
        }}
      >
        {val}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          color: "#86786A",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginTop: 5,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════ */
export default function RisographPress() {
  const reduced = useReducedMotion();
  const scrollVel = useScrollVelocity();
  const grainOpacity = 0.055 + scrollVel * 0.07;

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 700], [0, -90]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=JetBrains+Mono:wght@400&display=swap');

        .r45 { font-family: 'Newsreader', serif; background: ${PAPER}; color: ${INK_BLACK}; -webkit-font-smoothing: antialiased; }
        .r45 *, .r45 *::before, .r45 *::after { box-sizing: border-box; }
        .r45 a:focus-visible { outline: 3px solid ${INK_RED}; outline-offset: 3px; border-radius: 1px; }
        .r45 .disp { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; }
        .r45 .mono { font-family: 'JetBrains Mono', monospace; font-weight: 400; }

        .r45 .cta-btn {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          color: ${CREAM}; text-decoration: none;
          background: ${INK_RED}; padding: 16px 36px;
          border: 2.5px solid ${INK_BLACK};
          box-shadow: 4px 4px 0 ${INK_BLACK};
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .r45 .cta-btn:hover { transform: translate(-3px,-3px); box-shadow: 7px 7px 0 ${INK_BLACK}; }
        .r45 .cta-btn:active { transform: translate(1px,1px); box-shadow: 2px 2px 0 ${INK_BLACK}; }

        .r45 .cta-btn-inv {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          color: ${INK_RED}; text-decoration: none;
          background: ${CREAM}; padding: 18px 48px;
          border: 3px solid ${CREAM};
          box-shadow: 5px 5px 0 ${INK_BLACK};
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .r45 .cta-btn-inv:hover { transform: translate(-4px,-4px); box-shadow: 9px 9px 0 ${INK_BLACK}; }

        .r45 .svc-card {
          border: 2px solid ${INK_BLACK};
          padding: 28px 24px;
          background: ${CREAM};
          position: relative;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          cursor: default;
        }
        .r45 .svc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${INK_BLUE}08;
          opacity: 0;
          transition: opacity 0.18s ease;
          pointer-events: none;
        }
        .r45 .svc-card:hover { transform: translate(-4px,-4px); box-shadow: 6px 6px 0 ${INK_BLUE}; }
        .r45 .svc-card:hover::before { opacity: 1; }

        .r45 .work-row {
          border-top: 1.5px solid ${INK_BLACK};
          padding: 20px 0;
          display: grid;
          grid-template-columns: 130px 1fr 1.3fr;
          gap: 16px; align-items: start;
          transition: background 0.12s ease;
        }
        .r45 .work-row:last-child { border-bottom: 1.5px solid ${INK_BLACK}; }
        .r45 .work-row:hover { background: ${INK_RED}08; }

        @media (max-width: 700px) {
          .r45 .work-row { grid-template-columns: 1fr; }
          .r45 .hero-grid { grid-template-columns: 1fr !important; }
          .r45 .about-grid { grid-template-columns: 1fr !important; }
          .r45 .svc-grid { grid-template-columns: 1fr 1fr !important; }
          .r45 .sec-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .r45 .svc-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .r45 .hero-grid { grid-template-columns: 1fr !important; }
          .r45 .about-grid { grid-template-columns: 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .r45 * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div
        className="r45"
        style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
      >
        {/* ── Grain overlay ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: grainOpacity,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* ── Skip link ── */}
        <a
          href="#main-content"
          className="mono"
          style={{
            position: "absolute",
            left: -9999,
            top: 4,
            padding: "8px 16px",
            background: INK_RED,
            color: CREAM,
            textDecoration: "none",
            fontSize: 12,
            zIndex: 9999,
          }}
          onFocus={(e) => (e.currentTarget.style.left = "4px")}
          onBlur={(e) => (e.currentTarget.style.left = "-9999px")}
        >
          Skip to content
        </a>

        {/* ═════════════════ NAV ═════════════════ */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 200,
            background: INK_BLACK,
            borderBottom: `3px solid ${INK_RED}`,
            padding: "0 clamp(20px,5vw,64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 58,
          }}
          aria-label="Main navigation"
        >
          <a
            href="/"
            className="disp"
            style={{
              color: CREAM,
              fontSize: 20,
              letterSpacing: "-0.03em",
              textDecoration: "none",
            }}
          >
            <MisregText autoPlay>WN</MisregText>
          </a>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["Work", "Services", "About"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="mono"
                style={{
                  color: "#86786A",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = INK_RED)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#86786A")}
              >
                {l}
              </a>
            ))}
            <a
              href="https://skynetjoe.com/discovery-call"
              className="mono"
              style={{
                background: INK_RED,
                color: CREAM,
                padding: "7px 16px",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: `2px solid ${INK_RED}`,
                transition: "background 0.12s, color 0.12s, border-color 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = CREAM;
                e.currentTarget.style.color = INK_RED;
                e.currentTarget.style.borderColor = INK_RED;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = INK_RED;
                e.currentTarget.style.color = CREAM;
                e.currentTarget.style.borderColor = INK_RED;
              }}
            >
              Book Call
            </a>
          </div>
        </nav>

        <main id="main-content">
          {/* ═════════════════ HERO ═════════════════ */}
          <section
            style={{
              background: PAPER,
              padding: "64px clamp(20px,5vw,64px) 0",
              position: "relative",
              overflow: "hidden",
            }}
            aria-label="Hero"
          >
            {/* Ghost issue number */}
            <div
              aria-hidden="true"
              className="disp"
              style={{
                position: "absolute",
                top: -30,
                right: -10,
                fontSize: "clamp(200px,28vw,360px)",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: `1.5px ${INK_BLUE}10`,
                userSelect: "none",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              45
            </div>

            {/* Overprint ink splotch top-left — pure riso energy */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -40,
                left: -40,
                width: 280,
                height: 280,
                background: `radial-gradient(circle at 45% 45%, ${INK_BLUE}14 0%, transparent 70%)`,
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <div
              className="hero-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 360px",
                gap: "48px 72px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Left */}
              <div>
                {/* Masthead bar */}
                <div
                  className="mono"
                  style={{
                    display: "inline-flex",
                    gap: 14,
                    alignItems: "center",
                    background: INK_BLACK,
                    color: CREAM,
                    padding: "6px 18px",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: 36,
                  }}
                >
                  <span>SkynetLabs Press</span>
                  <span style={{ color: INK_RED }}>— Issue 01</span>
                  <span style={{ color: "#86786A" }}>Est. 2019</span>
                </div>

                <h1
                  className="disp"
                  style={{
                    fontSize: "clamp(56px,9vw,116px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.035em",
                    color: INK_BLACK,
                    margin: "0 0 28px",
                  }}
                >
                  <MisregText as="span" style={{ display: "block" }} autoPlay>
                    Ships fast.
                  </MisregText>
                  <span style={{ display: "block", color: INK_RED }}>
                    Breaks
                  </span>
                  <span style={{ display: "block" }}>meetings,</span>
                  <span style={{ display: "block", color: INK_BLUE }}>
                    not prod.
                  </span>
                </h1>

                {/* Halftone rule under headline */}
                <HalftoneDivider color={INK_RED} />

                <p
                  style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: "clamp(17px,2vw,20px)",
                    lineHeight: 1.65,
                    color: INK_BLACK,
                    maxWidth: 540,
                    margin: "24px 0 36px",
                  }}
                >
                  Waseem Nasir. Independent AI + automation builder. I wire n8n,
                  voice bots, WhatsApp agents, and Next.js into one machine that
                  kills your busywork — permanently.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 44,
                  }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    className="cta-btn"
                    aria-label="Book a free 30-minute discovery call"
                  >
                    30-min call — free
                  </a>
                  <Stamp
                    label="Remote · Bali / Lahore"
                    angle={-2}
                    color={INK_BLUE}
                  />
                  <Stamp label="9 Countries" angle={3} color={INK_RED} />
                </div>

                {/* Proof strip — count-up */}
                <div
                  style={{
                    display: "flex",
                    gap: "clamp(24px,4vw,48px)",
                    flexWrap: "wrap",
                    borderTop: `2px solid ${INK_BLACK}`,
                    paddingTop: 24,
                  }}
                >
                  {STATS.map(({ target, suffix, label }, i) => (
                    <StatCounter
                      key={label}
                      target={target}
                      suffix={suffix}
                      label={label}
                      color={i % 2 === 0 ? INK_RED : INK_BLUE}
                    />
                  ))}
                </div>
              </div>

              {/* Right: portrait */}
              <motion.div style={{ y: reduced ? 0 : heroParallax }}>
                <div style={{ position: "relative" }}>
                  {/* Offset ink block behind image */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: -18,
                      right: -18,
                      width: 110,
                      height: 110,
                      background: INK_BLUE,
                      transform: "rotate(10deg)",
                      zIndex: 0,
                    }}
                  />
                  {/* Halftone dot cluster bottom-left */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: -24,
                      left: -24,
                      width: 96,
                      height: 96,
                      zIndex: 0,
                      backgroundImage: `radial-gradient(circle, ${INK_RED} 2px, transparent 2px)`,
                      backgroundSize: "10px 10px",
                    }}
                  />

                  <RisoImage
                    src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                    alt="Waseem Nasir on a balcony in a black prince coat"
                    inkColor={INK_RED}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      border: `4px solid ${INK_BLACK}`,
                      position: "relative",
                      zIndex: 1,
                    }}
                  />

                  {/* Sticker rotated */}
                  <div
                    className="mono"
                    style={{
                      position: "absolute",
                      bottom: 20,
                      right: -28,
                      background: INK_RED,
                      color: CREAM,
                      padding: "8px 14px",
                      fontSize: 9,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      transform: "rotate(4deg)",
                      border: `2px solid ${INK_BLACK}`,
                      zIndex: 2,
                      boxShadow: `3px 3px 0 ${INK_BLACK}`,
                    }}
                  >
                    Founder · SkynetLabs
                  </div>
                </div>
              </motion.div>
            </div>

            <div style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
              <TornEdge color={INK_BLACK} />
            </div>
          </section>

          {/* ═════════════════ MARQUEE ═════════════════ */}
          <div
            style={{
              background: INK_BLACK,
              overflow: "hidden",
              padding: "13px 0",
              borderBottom: `3px solid ${INK_RED}`,
            }}
            role="marquee"
            aria-label="Skills and services ticker"
          >
            <motion.div
              style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
              animate={reduced ? {} : { x: ["0%", "-50%"] }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="mono"
                  style={{
                    color: i % 2 === 0 ? INK_RED : "#86786A",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  AI builds that work ✦ n8n workflows ✦ voice bots ✦ WhatsApp
                  automation ✦ AEO & SEO ✦ Next.js apps ✦ SkynetLabs ✦ Est. 2019
                  ✦
                </span>
              ))}
            </motion.div>
          </div>

          {/* ═════════════════ FIELD PHOTOS ═════════════════ */}
          <section
            style={{
              background: INK_BLACK,
              padding: "72px clamp(20px,5vw,64px)",
              position: "relative",
            }}
            aria-label="Life in the field"
          >
            {/* Two-ink overprint bleed */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: "30%",
                width: "40%",
                height: "100%",
                background: `linear-gradient(180deg, ${INK_BLUE}12 0%, transparent 100%)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                height: "clamp(260px,38vw,500px)",
                maxWidth: 1100,
                margin: "0 auto",
              }}
            >
              {/* Photo 1 */}
              <RisoImage
                src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                alt="Waseem working at a Bali terrace cafe"
                inkColor={INK_RED}
                style={{
                  position: "absolute",
                  left: "0%",
                  top: "12%",
                  width: "38%",
                  aspectRatio: "4/3",
                  border: `4px solid ${CREAM}`,
                  transform: "rotate(-3.5deg)",
                  zIndex: 1,
                }}
              />
              {/* Photo 2 — overprints center */}
              <RisoImage
                src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                alt="Waseem at Nusa Penida cliffs arms spread"
                inkColor={INK_BLUE}
                style={{
                  position: "absolute",
                  left: "26%",
                  top: "0%",
                  width: "38%",
                  aspectRatio: "4/3",
                  border: `4px solid ${INK_RED}`,
                  transform: "rotate(2deg)",
                  zIndex: 2,
                }}
              />
              {/* Photo 3 */}
              <RisoImage
                src="/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg"
                alt="Waseem smiling on a rooftop with dragonfruit smoothie and laptop"
                inkColor={INK_RED}
                style={{
                  position: "absolute",
                  right: "0%",
                  top: "8%",
                  width: "36%",
                  aspectRatio: "4/3",
                  border: `4px solid ${INK_BLUE}`,
                  transform: "rotate(-1.5deg)",
                  zIndex: 1,
                }}
              />
              {/* Caption tape */}
              <div
                className="mono"
                style={{
                  position: "absolute",
                  bottom: -18,
                  left: "50%",
                  transform: "translateX(-50%) rotate(-1deg)",
                  background: CREAM,
                  color: INK_BLACK,
                  padding: "5px 22px",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  border: `2px solid ${INK_BLACK}`,
                  whiteSpace: "nowrap",
                  zIndex: 5,
                  boxShadow: `3px 3px 0 ${INK_BLACK}`,
                }}
              >
                Field notes: Bali · Nusa Penida · Rooftop sessions
              </div>
            </div>

            <div style={{ marginTop: 64 }}>
              <TornEdge flip color={PAPER} />
            </div>
          </section>

          {/* ═════════════════ SERVICES ═════════════════ */}
          <section
            id="services"
            style={{ background: PAPER, padding: "88px clamp(20px,5vw,64px)" }}
            aria-label="Services"
          >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 48,
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <h2
                  className="disp"
                  style={{
                    fontSize: "clamp(36px,5vw,68px)",
                    lineHeight: 0.92,
                    letterSpacing: "-0.025em",
                    margin: 0,
                  }}
                >
                  <MisregText as="span">What I</MisregText>
                  <br />
                  <span style={{ color: INK_RED }}>actually</span> build.
                </h2>
                <Stamp label="6 core systems" angle={-3} color={INK_BLUE} />
              </div>

              <div
                className="svc-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 2,
                }}
              >
                {SERVICES.map((s, i) => (
                  <motion.div
                    key={s.num}
                    className="svc-card"
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.38, delay: i * 0.07 }}
                  >
                    {/* Corner halftone accent */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 36,
                        height: 36,
                        backgroundImage: `radial-gradient(circle, ${i % 2 === 0 ? INK_RED : INK_BLUE}55 1.5px, transparent 1.5px)`,
                        backgroundSize: "6px 6px",
                      }}
                    />
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: INK_RED,
                        letterSpacing: "0.16em",
                        marginBottom: 10,
                      }}
                    >
                      {s.num}
                    </div>
                    <h3
                      className="disp"
                      style={{
                        fontSize: 19,
                        margin: "0 0 10px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Newsreader', serif",
                        fontSize: 15,
                        color: "#86786A",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {s.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <HalftoneDivider color={INK_BLUE} />

          {/* ═════════════════ WORK ═════════════════ */}
          <section
            id="work"
            style={{
              background: CREAM,
              padding: "88px clamp(20px,5vw,64px)",
              borderTop: `3px solid ${INK_BLACK}`,
              borderBottom: `3px solid ${INK_BLACK}`,
            }}
            aria-label="Selected work"
          >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div
                style={{
                  marginBottom: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                <h2
                  className="disp"
                  style={{
                    fontSize: "clamp(36px,5vw,68px)",
                    lineHeight: 0.92,
                    letterSpacing: "-0.025em",
                    margin: 0,
                  }}
                >
                  Selected <span style={{ color: INK_BLUE }}>proof.</span>
                </h2>
                <Stamp label="Real results only" angle={2} color={INK_RED} />
              </div>

              <div>
                {WORK_ITEMS.map((w, i) => (
                  <motion.div
                    key={i}
                    className="work-row"
                    initial={reduced ? false : { opacity: 0, x: -18 }}
                    whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.32, delay: i * 0.055 }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: 9,
                        color: CREAM,
                        background: i % 2 === 0 ? INK_RED : INK_BLUE,
                        padding: "4px 10px",
                        letterSpacing: "0.16em",
                        display: "inline-flex",
                        alignSelf: "start",
                      }}
                    >
                      {w.tag}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Newsreader', serif",
                        fontSize: 16,
                        color: "#86786A",
                      }}
                    >
                      {w.client}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Newsreader', serif",
                        fontSize: 16,
                        fontStyle: "italic",
                      }}
                    >
                      {w.result}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════════ GALLERY STRIP ═════════════════ */}
          <section
            style={{ background: PAPER, padding: "64px 0", overflow: "hidden" }}
            aria-label="Photo gallery"
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                paddingLeft: "clamp(20px,5vw,64px)",
              }}
            >
              {[
                {
                  src: "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
                  alt: "Peace sign at blue hour with coconut drink",
                  ink: INK_RED,
                },
                {
                  src: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                  alt: "Client meeting thumbs up at cafe",
                  ink: INK_BLUE,
                },
                {
                  src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                  alt: "Rooftop cafe laptop with mountain clouds",
                  ink: INK_RED,
                },
                {
                  src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                  alt: "Hilltop with backpack overlooking city",
                  ink: INK_BLUE,
                },
                {
                  src: "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
                  alt: "Smiling with headphones near neon tea sign",
                  ink: INK_RED,
                },
              ].map((img, i) => (
                <motion.div
                  key={img.src}
                  initial={reduced ? false : { opacity: 0, scale: 0.93 }}
                  whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.38, delay: i * 0.07 }}
                  style={{
                    flex: `0 0 clamp(180px,20vw,260px)`,
                    transform: `rotate(${[-2.5, 1.8, -1.2, 2.8, -1.8][i]}deg)`,
                    border: `4px solid ${INK_BLACK}`,
                    background: INK_BLACK,
                    boxShadow: `4px 4px 0 ${i % 2 === 0 ? INK_RED : INK_BLUE}`,
                  }}
                >
                  <RisoImage
                    src={`/img/pro/${img.src}`}
                    alt={img.alt}
                    inkColor={img.ink}
                    style={{ width: "100%", aspectRatio: "3/4" }}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═════════════════ ABOUT ═════════════════ */}
          <section
            id="about"
            style={{
              background: INK_BLUE,
              padding: "0 clamp(20px,5vw,64px) 0",
              position: "relative",
            }}
            aria-label="About"
          >
            <TornEdge color={INK_BLUE} />
            <div style={{ paddingTop: 0, paddingBottom: 0 }}>
              {/* Extra overprint layer */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "35%",
                  height: "100%",
                  background: `${INK_RED}0C`,
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />

              <div
                className="about-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 340px",
                  gap: "64px 88px",
                  maxWidth: 1100,
                  margin: "0 auto",
                  alignItems: "center",
                  padding: "80px 0",
                }}
              >
                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: INK_RED,
                      marginBottom: 20,
                    }}
                  >
                    About the builder
                  </div>
                  <h2
                    className="disp"
                    style={{
                      fontSize: "clamp(36px,5vw,64px)",
                      lineHeight: 0.92,
                      color: CREAM,
                      letterSpacing: "-0.025em",
                      margin: "0 0 28px",
                    }}
                  >
                    <MisregText as="span" style={{ color: CREAM }}>
                      Not a
                    </MisregText>
                    <br />
                    <span style={{ color: INK_RED }}>consultancy.</span>
                    <br />
                    One builder.
                  </h2>

                  <HalftoneDivider color={`${CREAM}30`} />

                  <p
                    style={{
                      fontFamily: "'Newsreader', serif",
                      fontSize: "clamp(16px,1.8vw,19px)",
                      color: `${CREAM}CC`,
                      lineHeight: 1.72,
                      maxWidth: 520,
                      margin: "24px 0 22px",
                    }}
                  >
                    I'm Waseem Nasir — independent, solo, and deliberately so.
                    Seven years building AI systems that outlast the sprint. No
                    handoff to a junior. No bloated retainer. Just the thing
                    that works.
                  </p>
                  <p
                    style={{
                      fontFamily: "'Newsreader', serif",
                      fontSize: "clamp(16px,1.8vw,19px)",
                      color: `${CREAM}CC`,
                      lineHeight: 1.72,
                      maxWidth: 520,
                      marginBottom: 40,
                    }}
                  >
                    Running from wherever the WiFi holds — Bali right now,
                    Lahore when family calls. 40+ clients across 9 countries
                    trust the systems I've wired since 2019.
                  </p>

                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <Stamp
                      label="github.com/waseemnasir2k26"
                      angle={-1}
                      color={CREAM}
                    />
                    <Stamp
                      label="Open to new builds"
                      angle={2}
                      color={INK_RED}
                    />
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  {/* Ghost frame offset */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: -14,
                      left: -14,
                      width: "100%",
                      height: "100%",
                      border: `3px solid ${CREAM}30`,
                      transform: "rotate(4deg)",
                    }}
                  />
                  {/* Halftone dot cluster */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: -20,
                      right: -20,
                      width: 80,
                      height: 80,
                      backgroundImage: `radial-gradient(circle, ${INK_RED} 2px, transparent 2px)`,
                      backgroundSize: "10px 10px",
                      zIndex: 0,
                    }}
                  />
                  <RisoImage
                    src="/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg"
                    alt="Waseem Nasir in a beige tracksuit outside a glass building"
                    inkColor={INK_BLUE}
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      border: `4px solid ${CREAM}`,
                      position: "relative",
                      zIndex: 1,
                      boxShadow: `8px 8px 0 ${INK_RED}50`,
                    }}
                  />
                </div>
              </div>
            </div>
            <TornEdge flip color={PAPER} />
          </section>

          {/* ═════════════════ PROCESS ═════════════════ */}
          <section
            style={{ background: PAPER, padding: "88px clamp(20px,5vw,64px)" }}
            aria-label="How it works"
          >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <h2
                className="disp"
                style={{
                  fontSize: "clamp(32px,4.5vw,56px)",
                  letterSpacing: "-0.025em",
                  margin: "0 0 52px",
                }}
              >
                The <span style={{ color: INK_RED }}>no-BS</span> process.
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                  gap: 36,
                }}
              >
                {[
                  {
                    step: "I",
                    title: "30-min teardown",
                    body: "You tell me what's broken. I tell you exactly what to fix, in what order, and why.",
                  },
                  {
                    step: "II",
                    title: "Spec — not deck",
                    body: "A lean technical spec. No 40-slide deck. No buzzwords. Just the architecture.",
                  },
                  {
                    step: "III",
                    title: "Build in sprints",
                    body: "Shipped in 1–2 week increments. You see working software, not Figma frames.",
                  },
                  {
                    step: "IV",
                    title: "Handed off, not held",
                    body: "You own it. No lock-in. Full docs. If you ever need me again, I'm one message away.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={reduced ? false : { opacity: 0, y: 22 }}
                    whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.34, delay: i * 0.08 }}
                    style={{ position: "relative" }}
                  >
                    {/* Oversized ghost numeral — genuine zine energy */}
                    <div
                      className="disp"
                      aria-hidden="true"
                      style={{
                        fontSize: 88,
                        lineHeight: 1,
                        color: i % 2 === 0 ? `${INK_RED}18` : `${INK_BLUE}14`,
                        position: "absolute",
                        top: -16,
                        left: -10,
                        userSelect: "none",
                        pointerEvents: "none",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {item.step}
                    </div>
                    <div style={{ position: "relative", paddingTop: 40 }}>
                      <h3
                        className="disp"
                        style={{ fontSize: 20, margin: "0 0 10px" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Newsreader', serif",
                          fontSize: 15,
                          color: "#86786A",
                          lineHeight: 1.62,
                          margin: 0,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════════ SECONDARY PHOTOS ═════════════════ */}
          <section
            style={{
              background: CREAM,
              padding: "64px clamp(20px,5vw,64px)",
              borderTop: `3px solid ${INK_BLACK}`,
            }}
            aria-label="More work moments"
          >
            <div
              className="sec-grid"
              style={{
                maxWidth: 1100,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: 8,
              }}
            >
              <RisoImage
                src="/img/pro/WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg"
                alt="Night coworking team session with laptops"
                inkColor={INK_BLUE}
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  border: `3px solid ${INK_BLACK}`,
                }}
              />
              <RisoImage
                src="/img/pro/EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg"
                alt="Bali cafe coworking group meetup"
                inkColor={INK_RED}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  border: `3px solid ${INK_BLACK}`,
                }}
              />
              <RisoImage
                src="/img/pro/PORTRAIT-mural-halfbody-smile-watch-raised.jpg"
                alt="Waseem half body portrait in front of mural"
                inkColor={INK_BLUE}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  border: `3px solid ${INK_BLACK}`,
                }}
              />
            </div>
          </section>

          {/* ═════════════════ CTA ═════════════════ */}
          <section
            id="contact"
            style={{
              background: INK_RED,
              padding: "108px clamp(20px,5vw,64px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
            aria-label="Book a call"
          >
            {/* Giant overprint ink wash */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-20%",
                left: "-10%",
                width: "120%",
                height: "140%",
                backgroundImage: `radial-gradient(circle at 55% 50%, ${INK_BLUE}20 0%, transparent 55%)`,
                pointerEvents: "none",
              }}
            />
            {/* Halftone dot field */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: `radial-gradient(circle, ${CREAM}18 1px, transparent 1px)`,
                backgroundSize: "14px 14px",
              }}
            />
            {/* Ghost PRESS lettering */}
            <div
              aria-hidden="true"
              className="disp"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontSize: "clamp(100px,18vw,220px)",
                color: `${CREAM}09`,
                userSelect: "none",
                pointerEvents: "none",
                letterSpacing: "-0.06em",
                lineHeight: 1,
              }}
            >
              PRESS
            </div>

            {/* Overprint torn strip top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
              <TornEdge color={INK_RED} />
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <Stamp
                label="Limited slots — 2026"
                angle={-2}
                color={CREAM}
                bg={CREAM}
              />
              <h2
                className="disp"
                style={{
                  fontSize: "clamp(52px,9vw,108px)",
                  lineHeight: 0.9,
                  color: CREAM,
                  letterSpacing: "-0.035em",
                  margin: "24px 0 16px",
                }}
              >
                <MisregText as="span" style={{ color: CREAM }}>
                  Kill
                </MisregText>
                <br />
                <span>the busywork.</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: "clamp(17px,2vw,22px)",
                  color: `${CREAM}CC`,
                  maxWidth: 460,
                  margin: "0 auto 52px",
                  lineHeight: 1.65,
                }}
              >
                30 minutes. I'll show you exactly where your automation holes
                are and what the fix looks like. No pitch. Just the diagnosis.
              </p>
              <a
                href="https://skynetjoe.com/discovery-call"
                className="cta-btn-inv"
                aria-label="Book a free 30-minute discovery call with Waseem Nasir"
              >
                Book 30-min call — free
              </a>
            </div>
          </section>

          {/* ═════════════════ FOOTER ═════════════════ */}
          <footer
            style={{
              background: INK_BLACK,
              padding: "44px clamp(20px,5vw,64px)",
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `3px solid ${INK_RED}`,
            }}
          >
            <div>
              <div
                className="disp"
                style={{ color: CREAM, fontSize: 22, marginBottom: 5 }}
              >
                Waseem Nasir
              </div>
              <div
                className="mono"
                style={{
                  color: "#86786A",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                SkynetLabs · Independent AI Builder · Since 2019
              </div>
            </div>

            <nav
              aria-label="Footer navigation"
              style={{ display: "flex", gap: 28, flexWrap: "wrap" }}
            >
              {[
                {
                  label: "Discovery Call",
                  href: "https://skynetjoe.com/discovery-call",
                },
                { label: "GitHub", href: "https://github.com/waseemnasir2k26" },
                { label: "SkynetJoe.com", href: "https://skynetjoe.com" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="mono"
                  style={{
                    color: "#86786A",
                    textDecoration: "none",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    transition: "color 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = INK_RED)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#86786A")
                  }
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  {label}
                </a>
              ))}
            </nav>

            <div
              className="mono"
              style={{ color: "#86786A", fontSize: 9, letterSpacing: "0.12em" }}
            >
              Design 45 / 50 · Risograph Press
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
