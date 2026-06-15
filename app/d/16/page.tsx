"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";

/* ─── SCOPED FONT IMPORT ─── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Spline+Sans:wght@400;500&family=Space+Mono:wght@400&display=swap";

/* ─── PALETTE ─── */
const P = {
  bg: "#F3EFE4",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#7C7768",
  accent: "#FF4F00", // ink 1 — orange
  accent2: "#0050FF", // ink 2 — blue
};

/* ─── HALFTONE DOT PATTERN (SVG data URI) ─── */
const halftoteSVG = `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='2.2' fill='%23FF4F00' opacity='0.18'/></svg>`;
const halftoteBlue = `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='4' cy='4' r='1.6' fill='%230050FF' opacity='0.13'/></svg>`;

/* ─── MISREGISTRATION VARIANTS ─── */
const inkLayerVariants = {
  rest: { x: 0, y: 0 },
  hover: {
    x: [0, 4, -2, 0],
    y: [0, -3, 2, 0],
    transition: { duration: 0.55, ease: "easeInOut" },
  },
};
const inkLayer2Variants = {
  rest: { x: 0, y: 0 },
  hover: {
    x: [0, -4, 3, 0],
    y: [0, 3, -2, 0],
    transition: { duration: 0.55, ease: "easeInOut" },
  },
};

/* ─── HALFTONE DISSOLVE (section enter) ─── */
const hDotVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.018, duration: 0.38, ease: "easeOut" },
  }),
};

/* ─── HELPERS ─── */
function HalftoneRow({
  cols = 18,
  ink = P.accent,
  size = 5,
  gap = 14,
}: {
  cols?: number;
  ink?: string;
  size?: number;
  gap?: number;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ display: "flex", gap: gap, flexWrap: "wrap" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={prefersReduced ? {} : hDotVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: ink,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}

/* ─── MISPRINT HEADING ─── */
function MisprintText({
  children,
  tag = "h2",
  size = 64,
  weight = 900,
  color1 = P.accent,
  color2 = P.accent2,
  className = "",
}: {
  children: string;
  tag?: "h1" | "h2" | "h3" | "span" | "p";
  size?: number;
  weight?: number;
  color1?: string;
  color2?: string;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const Tag = tag as React.ElementType;

  return (
    <Tag
      className={`misprint-text ${className}`}
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: "'Fraunces', serif",
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.05,
        color: P.text,
      }}
    >
      {/* Ink 1 ghost — orange, behind */}
      {!prefersReduced && (
        <motion.span
          variants={inkLayerVariants}
          initial="rest"
          whileHover="hover"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            color: color1,
            mixBlendMode: "multiply",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {children}
        </motion.span>
      )}
      {/* Ink 2 ghost — blue, in front */}
      {!prefersReduced && (
        <motion.span
          variants={inkLayer2Variants}
          initial="rest"
          whileHover="hover"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            color: color2,
            mixBlendMode: "multiply",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {children}
        </motion.span>
      )}
      {/* Visible base layer */}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Tag>
  );
}

/* ─── RISO TAG ─── */
function RisoTag({
  children,
  ink = P.accent,
}: {
  children: string;
  ink?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        background: ink,
        color: "#fff",
        padding: "3px 10px",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

/* ─── PHOTO CARD WITH MISPRINT HOVER ─── */
function PhotoCard({
  src,
  alt,
  caption,
  rotate = 0,
  style = {},
}: {
  src: string;
  alt: string;
  caption: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      style={{
        position: "relative",
        display: "inline-block",
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {/* Orange misprint layer */}
      {!prefersReduced && (
        <motion.div
          variants={inkLayerVariants}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: P.accent,
            mixBlendMode: "multiply",
            opacity: 0.28,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      )}
      {/* Blue misprint layer */}
      {!prefersReduced && (
        <motion.div
          variants={inkLayer2Variants}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: P.accent2,
            mixBlendMode: "multiply",
            opacity: 0.22,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "sepia(0.18) contrast(1.08)",
        }}
      />
      {caption && (
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            color: P.muted,
            marginTop: 6,
            textAlign: "center",
          }}
        >
          {caption}
        </p>
      )}
    </motion.div>
  );
}

/* ─── SERVICE CARD ─── */
function ServiceCard({
  num,
  title,
  desc,
  ink,
}: {
  num: string;
  title: string;
  desc: string;
  ink: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      style={{
        borderTop: `3px solid ${ink}`,
        paddingTop: 20,
        paddingBottom: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: ink,
            letterSpacing: "0.1em",
          }}
        >
          {num}
        </span>
        {!prefersReduced ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <motion.span
              variants={inkLayerVariants}
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                fontWeight: 700,
                color: ink,
                mixBlendMode: "multiply",
                opacity: 0.5,
                pointerEvents: "none",
              }}
            >
              {title}
            </motion.span>
            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                fontWeight: 700,
                color: P.text,
                margin: 0,
                position: "relative",
              }}
            >
              {title}
            </h3>
          </div>
        ) : (
          <h3
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 22,
              fontWeight: 700,
              color: P.text,
              margin: 0,
            }}
          >
            {title}
          </h3>
        )}
      </div>
      <p
        style={{
          fontFamily: "'Spline Sans', sans-serif",
          fontSize: 15,
          lineHeight: 1.6,
          color: P.muted,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </motion.div>
  );
}

/* ─── STAT BLOCK ─── */
function StatBlock({
  value,
  label,
  ink,
}: {
  value: string;
  label: string;
  ink: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const prefersReduced = useReducedMotion();

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          fontFamily: "'Fraunces', serif",
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1,
          color: P.text,
        }}
      >
        {/* misprint ghost */}
        {!prefersReduced && (
          <motion.span
            aria-hidden="true"
            animate={inView ? { x: [3, 0], y: [-3, 0], opacity: [0.6, 0] } : {}}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              color: ink,
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          >
            {value}
          </motion.span>
        )}
        <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
      </div>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: P.muted,
          marginTop: 8,
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function RisoMisprint() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  /* Lock body scroll when mobile nav is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      /* Focus first link on open */
      firstLinkRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        .root-16 * { box-sizing: border-box; margin: 0; padding: 0; }
        .root-16 a:focus-visible { outline: 2px solid ${P.accent2}; outline-offset: 3px; }
        .root-16 img { max-width: 100%; }

        /* Halftone paper texture overlay */
        .root-16 .halftone-bg {
          background-image:
            url("${halftoteSVG}"),
            url("${halftoteBlue}");
          background-repeat: repeat;
          background-size: 20px 20px, 20px 20px;
          background-position: 0 0, 10px 10px;
          pointer-events: none;
        }

        /* Duotone multiply blend for images */
        .root-16 .riso-img-wrap {
          position: relative;
          overflow: hidden;
          display: block;
        }
        .root-16 .riso-img-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${P.accent};
          mix-blend-mode: multiply;
          opacity: 0.22;
          z-index: 2;
          pointer-events: none;
        }
        .root-16 .riso-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: ${P.accent2};
          mix-blend-mode: multiply;
          opacity: 0.16;
          z-index: 3;
          pointer-events: none;
        }

        /* Baseline broken text utilities */
        .root-16 .offset-up { transform: translateY(-8px); }
        .root-16 .offset-dn { transform: translateY(8px); }

        /* Mobile nav sheet */
        .root-16 .desktop-nav { display: flex; }
        .root-16 .hamburger-btn { display: none; }
        .root-16 .mobile-nav-sheet {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 200;
          pointer-events: none;
        }
        .root-16 .mobile-nav-sheet.open {
          display: block;
          pointer-events: auto;
        }
        .root-16 .mobile-nav-overlay {
          position: absolute;
          inset: 0;
          background: rgba(26,26,26,0.55);
          backdrop-filter: blur(2px);
        }
        .root-16 .mobile-nav-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: min(320px, 88vw);
          height: 100%;
          background: ${P.bg};
          border-left: 3px solid ${P.accent};
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow-y: auto;
        }
        .root-16 .mobile-nav-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("${halftoteSVG}");
          background-repeat: repeat;
          background-size: 20px 20px;
          opacity: 0.35;
          pointer-events: none;
        }
        .root-16 .mobile-nav-close {
          align-self: flex-end;
          margin: 20px 20px 0 0;
          background: none;
          border: none;
          cursor: pointer;
          color: ${P.text};
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 12px;
          position: relative;
          z-index: 1;
        }
        .root-16 .mobile-nav-close:focus-visible {
          outline: 2px solid ${P.accent2};
          outline-offset: 3px;
        }
        .root-16 .mobile-nav-links {
          list-style: none;
          padding: 32px 40px 40px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .root-16 .mobile-nav-links li {
          border-bottom: 1px solid rgba(28,28,28,0.1);
        }
        .root-16 .mobile-nav-links li:first-child {
          border-top: 1px solid rgba(28,28,28,0.1);
        }
        .root-16 .mobile-nav-links a {
          display: block;
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: ${P.text};
          text-decoration: none;
          padding: 16px 0;
          transition: color 0.15s;
          position: relative;
        }
        .root-16 .mobile-nav-links a:hover,
        .root-16 .mobile-nav-links a:focus-visible {
          color: ${P.accent};
          outline: none;
        }
        .root-16 .mobile-nav-links a .link-num {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: ${P.muted};
          display: block;
          margin-bottom: 2px;
        }
        .root-16 .mobile-nav-cta {
          margin: 0 40px 48px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .root-16 .hero-grid { flex-direction: column !important; }
          .root-16 .services-grid { grid-template-columns: 1fr !important; }
          .root-16 .stats-row { flex-direction: column !important; gap: 40px !important; }
          .root-16 .work-grid { grid-template-columns: 1fr 1fr !important; }
          .root-16 .about-grid { flex-direction: column !important; }
          .root-16 .desktop-nav { display: none !important; }
          .root-16 .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 480px) {
          .root-16 .work-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="root-16"
        style={{
          minHeight: "100vh",
          background: P.bg,
          position: "relative",
          zIndex: 2,
          overflowX: "hidden",
        }}
      >
        {/* Halftone texture overlay */}
        <div
          className="halftone-bg"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />

        {/* Scroll progress rail */}
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: 3,
            width: "100%",
            background: `linear-gradient(to right, ${P.accent}, ${P.accent2})`,
            transformOrigin: "left",
            scaleX: progressScaleX,
            zIndex: 100,
          }}
        />

        {/* Skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            top: -60,
            left: 16,
            background: P.accent,
            color: "#fff",
            padding: "8px 16px",
            fontFamily: "'Spline Sans', sans-serif",
            fontSize: 14,
            zIndex: 200,
            transition: "top 0.2s",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.top = "16px";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.top = "-60px";
          }}
        >
          Skip to content
        </a>

        {/* ── NAV ── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: P.bg,
            borderBottom: `1px solid rgba(28,28,28,0.12)`,
            padding: "0 clamp(24px, 5vw, 80px)",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 60,
            }}
          >
            {/* Logo — misprint style */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: "'Fraunces', serif",
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: "-0.02em",
              }}
            >
              {!prefersReduced && (
                <>
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      color: P.accent,
                      mixBlendMode: "multiply",
                      transform: "translate(2px,-1px)",
                      opacity: 0.7,
                    }}
                  >
                    WN
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      color: P.accent2,
                      mixBlendMode: "multiply",
                      transform: "translate(-2px,1px)",
                      opacity: 0.7,
                    }}
                  >
                    WN
                  </span>
                </>
              )}
              <span style={{ position: "relative", zIndex: 1, color: P.text }}>
                WN
              </span>
            </div>

            {/* Desktop nav */}
            <nav aria-label="Primary navigation" className="desktop-nav">
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: 32,
                }}
              >
                {["Work", "Services", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: P.muted,
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          P.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          P.muted;
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Hamburger — mobile only */}
            <button
              ref={menuBtnRef}
              className="hamburger-btn"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-sheet"
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                flexDirection: "column",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 4px",
                width: 40,
                height: 40,
              }}
            >
              {/* Three bars — top and bottom rotate on open, middle fades */}
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={
                    menuOpen
                      ? i === 0
                        ? { rotate: 45, y: 10 }
                        : i === 1
                          ? { opacity: 0, scaleX: 0 }
                          : { rotate: -45, y: -10 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{
                    display: "block",
                    width: 22,
                    height: 2,
                    background:
                      i === 0 ? P.accent : i === 2 ? P.accent2 : P.text,
                    transformOrigin: "center",
                  }}
                />
              ))}
            </button>
          </div>
        </header>

        {/* ── MOBILE NAV SHEET ── */}
        <div
          id="mobile-nav-sheet"
          className={`mobile-nav-sheet${menuOpen ? " open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="mobile-nav-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <motion.div
            className="mobile-nav-panel"
            initial={false}
            animate={menuOpen ? { x: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {/* Close button */}
            <button
              className="mobile-nav-close"
              onClick={() => {
                setMenuOpen(false);
                menuBtnRef.current?.focus();
              }}
              aria-label="Close navigation"
            >
              ✕ Close
            </button>

            {/* Issue tag inside sheet */}
            <div
              style={{
                padding: "16px 40px 0",
                position: "relative",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: P.muted,
                }}
              >
                SkynetLabs Zine — Issue 01
              </span>
            </div>

            {/* Links */}
            <ul className="mobile-nav-links">
              {["Work", "Services", "About", "Contact"].map((item, idx) => (
                <li key={item}>
                  <a
                    ref={idx === 0 ? firstLinkRef : undefined}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="link-num">0{idx + 1} —</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA inside sheet */}
            <div className="mobile-nav-cta">
              <a
                href="https://skynetjoe.com/discovery-call"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  background: P.accent,
                  color: "#fff",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "14px 24px",
                  textDecoration: "none",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                Book discovery call
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: `2px solid ${P.accent2}`,
                    transform: "translate(4px,4px)",
                    pointerEvents: "none",
                  }}
                />
              </a>
            </div>

            {/* Riso dots decoration */}
            <div
              style={{
                padding: "0 40px 40px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <HalftoneRow cols={10} ink={P.accent} size={5} gap={10} />
            </div>
          </motion.div>
        </div>

        <main id="main-content" style={{ position: "relative", zIndex: 1 }}>
          {/* ════════════════════════════════════
              HERO
          ════════════════════════════════════ */}
          <section
            style={{
              padding:
                "clamp(60px,8vw,120px) clamp(24px,5vw,80px) clamp(40px,6vw,80px)",
              maxWidth: 1280,
              margin: "0 auto",
            }}
          >
            {/* Issue tag line */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 40,
                alignItems: "center",
              }}
            >
              <RisoTag ink={P.accent}>Issue 01</RisoTag>
              <RisoTag ink={P.accent2}>SkynetLabs Zine</RisoTag>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: P.muted,
                  letterSpacing: "0.08em",
                }}
              >
                — EST. 2019 / LAHORE · BALI
              </span>
            </div>

            {/* Hero flex */}
            <div
              className="hero-grid"
              style={{
                display: "flex",
                gap: "clamp(32px,5vw,80px)",
                alignItems: "flex-start",
              }}
            >
              {/* Left: headline block */}
              <div style={{ flex: "1 1 55%" }}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {/* Big misprint H1 */}
                  <h1
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 900,
                      fontSize: "clamp(48px,7vw,96px)",
                      lineHeight: 1.0,
                      color: P.text,
                      letterSpacing: "-0.03em",
                      marginBottom: 28,
                    }}
                  >
                    {/* "Automation" — orange layer drifts left */}
                    <span style={{ display: "block", position: "relative" }}>
                      {!prefersReduced && (
                        <>
                          <motion.span
                            aria-hidden="true"
                            animate={{ x: [0, -5, 0], y: [0, 2, 0] }}
                            transition={{
                              repeat: Infinity,
                              repeatType: "mirror",
                              duration: 6,
                              ease: "easeInOut",
                            }}
                            style={{
                              position: "absolute",
                              color: P.accent,
                              mixBlendMode: "multiply",
                              opacity: 0.55,
                              pointerEvents: "none",
                            }}
                          >
                            Automation
                          </motion.span>
                          <motion.span
                            aria-hidden="true"
                            animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
                            transition={{
                              repeat: Infinity,
                              repeatType: "mirror",
                              duration: 7,
                              ease: "easeInOut",
                            }}
                            style={{
                              position: "absolute",
                              color: P.accent2,
                              mixBlendMode: "multiply",
                              opacity: 0.45,
                              pointerEvents: "none",
                            }}
                          >
                            Automation
                          </motion.span>
                        </>
                      )}
                      <span style={{ position: "relative", zIndex: 1 }}>
                        Automation
                      </span>
                    </span>
                    <span
                      style={{
                        display: "block",
                        paddingLeft: "clamp(16px,3vw,48px)",
                      }}
                    >
                      that feels
                    </span>
                    <span style={{ display: "block", position: "relative" }}>
                      {!prefersReduced && (
                        <>
                          <motion.span
                            aria-hidden="true"
                            animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
                            transition={{
                              repeat: Infinity,
                              repeatType: "mirror",
                              duration: 8,
                              ease: "easeInOut",
                            }}
                            style={{
                              position: "absolute",
                              color: P.accent,
                              mixBlendMode: "multiply",
                              opacity: 0.55,
                              pointerEvents: "none",
                            }}
                          >
                            handmade.
                          </motion.span>
                          <motion.span
                            aria-hidden="true"
                            animate={{ x: [0, -4, 0], y: [0, 3, 0] }}
                            transition={{
                              repeat: Infinity,
                              repeatType: "mirror",
                              duration: 6.5,
                              ease: "easeInOut",
                            }}
                            style={{
                              position: "absolute",
                              color: P.accent2,
                              mixBlendMode: "multiply",
                              opacity: 0.45,
                              pointerEvents: "none",
                            }}
                          >
                            handmade.
                          </motion.span>
                        </>
                      )}
                      <span style={{ position: "relative", zIndex: 1 }}>
                        handmade.
                      </span>
                    </span>
                  </h1>

                  <p
                    style={{
                      fontFamily: "'Spline Sans', sans-serif",
                      fontSize: "clamp(16px,1.8vw,20px)",
                      lineHeight: 1.6,
                      color: P.muted,
                      maxWidth: 480,
                      marginBottom: 40,
                    }}
                  >
                    Printed once, runs forever. I wire n8n, Next.js, and voice
                    bots into systems that kill busywork — missed leads, stalled
                    follow-ups, manual ops that eat your week.
                  </p>

                  {/* CTA */}
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    style={{
                      display: "inline-block",
                      background: P.accent,
                      color: "#fff",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 13,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "14px 32px",
                      textDecoration: "none",
                      position: "relative",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        P.accent2;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        P.accent;
                    }}
                  >
                    Book 30-min call
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        border: `2px solid ${P.accent2}`,
                        transform: "translate(4px,4px)",
                        pointerEvents: "none",
                      }}
                    />
                  </a>
                </motion.div>
              </div>

              {/* Right: portrait with riso overlay */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                style={{ flex: "0 0 clamp(220px,30vw,360px)" }}
              >
                <div
                  className="riso-img-wrap"
                  style={{
                    width: "100%",
                    aspectRatio: "956/1700",
                    transform: "rotate(1.2deg)",
                    boxShadow: `6px 6px 0 ${P.accent}, 10px 10px 0 ${P.accent2}`,
                  }}
                >
                  <img
                    src="/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg"
                    alt="Waseem Nasir — founder, SkynetLabs"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Caption under portrait */}
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: P.muted,
                    letterSpacing: "0.08em",
                    marginTop: 12,
                    textAlign: "right",
                    paddingRight: 8,
                  }}
                >
                  WASEEM NASIR / SKYNETLABS
                </p>

                {/* Halftone dots decoration */}
                <div style={{ marginTop: 16, paddingLeft: 8 }}>
                  <HalftoneRow cols={12} ink={P.accent} size={5} gap={10} />
                </div>
              </motion.div>
            </div>

            {/* Subhead strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                marginTop: "clamp(40px,6vw,80px)",
                borderTop: `1px solid rgba(28,28,28,0.15)`,
                borderBottom: `1px solid rgba(28,28,28,0.15)`,
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
                gap: 24,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: P.muted,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Made by hand, run by robots.
              </span>
              <div
                style={{
                  height: 1,
                  background: `linear-gradient(to right, ${P.accent}, ${P.accent2})`,
                  flex: 1,
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  color: P.muted,
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                180+ builds · 40+ clients · 9 countries
              </span>
            </motion.div>
          </section>

          {/* ════════════════════════════════════
              STATS / PROOF
          ════════════════════════════════════ */}
          <section
            id="proof"
            style={{
              padding: "clamp(60px,8vw,100px) clamp(24px,5vw,80px)",
              background: P.text,
              position: "relative",
            }}
          >
            {/* Halftone on dark */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("${halftoteSVG}")`,
                backgroundRepeat: "repeat",
                backgroundSize: "20px 20px",
                opacity: 0.08,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                maxWidth: 1280,
                margin: "0 auto",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ marginBottom: 48 }}>
                <RisoTag ink={P.accent}>Print run</RisoTag>
                <h2
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "clamp(28px,4vw,48px)",
                    fontWeight: 900,
                    color: "#F3EFE4",
                    marginTop: 16,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Numbers that don't need a footnote.
                </h2>
              </div>

              <div
                className="stats-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 40,
                  flexWrap: "wrap",
                }}
              >
                <StatBlock value="180+" label="Builds shipped" ink={P.accent} />
                <StatBlock value="40+" label="Clients served" ink={P.accent2} />
                <StatBlock
                  value="9"
                  label="Countries worked from"
                  ink={P.accent}
                />
                <StatBlock value="2019" label="Year one" ink={P.accent2} />
              </div>

              {/* Halftone row decorative */}
              <div
                style={{
                  marginTop: 56,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <HalftoneRow cols={32} ink={P.accent} size={6} gap={12} />
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════
              SERVICES
          ════════════════════════════════════ */}
          <section
            id="services"
            style={{
              padding: "clamp(60px,8vw,120px) clamp(24px,5vw,80px)",
              maxWidth: 1280,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                marginBottom: 48,
              }}
            >
              <RisoTag ink={P.accent2}>Services</RisoTag>
              <div
                style={{
                  height: 1,
                  flex: 1,
                  background: `rgba(28,28,28,0.12)`,
                }}
              />
            </div>

            <div style={{ marginBottom: 40, maxWidth: 640 }}>
              <MisprintText
                tag="h2"
                size={48}
                color1={P.accent}
                color2={P.accent2}
              >
                What I print.
              </MisprintText>
              <p
                style={{
                  fontFamily: "'Spline Sans', sans-serif",
                  fontSize: 17,
                  color: P.muted,
                  lineHeight: 1.65,
                  marginTop: 16,
                }}
              >
                Every system I build gets two passes — logic layer (the robot),
                craft layer (the human). The result looks hand-made; the cost is
                machine-scale.
              </p>
            </div>

            <div
              className="services-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "clamp(24px,3vw,48px)",
              }}
            >
              <ServiceCard
                num="01 —"
                title="n8n Automation"
                desc="Workflows that replace the stuff you paste between tabs at midnight. CRMs, email sequences, lead routing, notifications — all wired, all running headless."
                ink={P.accent}
              />
              <ServiceCard
                num="02 —"
                title="AI Voice + WhatsApp Bots"
                desc="Answer missed calls. Follow up dead leads. Book appointments. The bot picks up; you stay focused. Live 24/7, no extra headcount."
                ink={P.accent2}
              />
              <ServiceCard
                num="03 —"
                title="Next.js / AEO Builds"
                desc="Fast sites engineered to rank in AI answer engines, not just Google. Structured data, semantic HTML, real proof — built so LLMs cite you."
                ink={P.accent}
              />
              <ServiceCard
                num="04 —"
                title="AI-Powered Ops Systems"
                desc="Custom GPT pipelines for content batching, client onboarding, proposal generation. You review; the system drafts."
                ink={P.accent2}
              />
              <ServiceCard
                num="05 —"
                title="Funnel + Stripe Wiring"
                desc="Lead capture → payment → fulfilment in one continuous chain. No leaks, no manual handoffs, no 3am Slack messages about a failed charge."
                ink={P.accent}
              />
              <ServiceCard
                num="06 —"
                title="Audit + Strategy"
                desc="30-minute call, full teardown. I'll show you the three places your ops are leaking revenue — and exactly which automation seals each one."
                ink={P.accent2}
              />
            </div>
          </section>

          {/* ════════════════════════════════════
              SELECTED WORK / GALLERY
          ════════════════════════════════════ */}
          <section
            id="work"
            style={{
              padding: "clamp(60px,8vw,120px) clamp(24px,5vw,80px)",
              background: "#EDEAE0",
              position: "relative",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("${halftoteBlue}")`,
                backgroundRepeat: "repeat",
                backgroundSize: "20px 20px",
                opacity: 0.5,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                maxWidth: 1280,
                margin: "0 auto",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ marginBottom: 48 }}>
                <RisoTag ink={P.accent}>Field work</RisoTag>
                <h2
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "clamp(28px,4vw,48px)",
                    fontWeight: 900,
                    color: P.text,
                    marginTop: 16,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Where the ink hit the page.
                </h2>
              </div>

              {/* Work image grid */}
              <div
                className="work-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "clamp(16px,2vw,28px)",
                }}
              >
                {/* Card 1 — landscape */}
                <div style={{ gridColumn: "span 2" }}>
                  <PhotoCard
                    src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                    alt="Waseem working from a Bali terrace cafe with laptop and latte"
                    caption="Bali terrace — n8n funnel deploy, 2026"
                    rotate={-0.8}
                  />
                </div>
                {/* Card 2 — portrait */}
                <div>
                  <PhotoCard
                    src="/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg"
                    alt="Waseem outside a glass building in Lahore"
                    caption="Lahore — client kickoff, Q1 2026"
                    rotate={1.2}
                  />
                </div>
                {/* Card 3 */}
                <div>
                  <PhotoCard
                    src="/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg"
                    alt="Dual laptop analytics dashboard session in a cafe"
                    caption="Dual-screen — reporting pipeline"
                    rotate={-1.5}
                  />
                </div>
                {/* Card 4 — landscape */}
                <div style={{ gridColumn: "span 2" }}>
                  <PhotoCard
                    src="/img/pro/WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg"
                    alt="Waseem with a client, both smiling with thumbs up"
                    caption="40+ clients, every continent"
                    rotate={0.5}
                  />
                </div>
              </div>

              {/* Work voice pull-quote */}
              <blockquote
                style={{
                  marginTop: "clamp(40px,6vw,80px)",
                  borderLeft: `4px solid ${P.accent}`,
                  paddingLeft: 28,
                  maxWidth: 680,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "clamp(20px,2.5vw,32px)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: P.text,
                    lineHeight: 1.4,
                  }}
                >
                  "I don't ship dashboards. I ship mornings back."
                </p>
                <cite
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: P.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "block",
                    marginTop: 12,
                  }}
                >
                  — Waseem Nasir, SkynetLabs
                </cite>
              </blockquote>
            </div>
          </section>

          {/* ════════════════════════════════════
              ABOUT / CRAFT SECTION
          ════════════════════════════════════ */}
          <section
            id="about"
            style={{
              padding: "clamp(60px,8vw,120px) clamp(24px,5vw,80px)",
              maxWidth: 1280,
              margin: "0 auto",
            }}
          >
            <div
              className="about-grid"
              style={{
                display: "flex",
                gap: "clamp(40px,6vw,100px)",
                alignItems: "flex-start",
              }}
            >
              {/* Photo cluster */}
              <div
                style={{
                  flex: "0 0 clamp(220px,35vw,420px)",
                  position: "relative",
                }}
              >
                {/* Main portrait */}
                <div
                  className="riso-img-wrap"
                  style={{
                    width: "75%",
                    aspectRatio: "956/1700",
                    boxShadow: `4px 4px 0 ${P.accent}`,
                  }}
                >
                  <img
                    src="/img/pro/PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg"
                    alt="Waseem smiling in front of rice fields, palms, and mountain"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                {/* Overlapping second photo */}
                <div
                  className="riso-img-wrap"
                  style={{
                    position: "absolute",
                    bottom: -32,
                    right: 0,
                    width: "55%",
                    aspectRatio: "1700/956",
                    boxShadow: `4px 4px 0 ${P.accent2}`,
                    transform: "rotate(-2deg)",
                  }}
                >
                  <img
                    src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                    alt="Waseem with arms spread on Nusa Penida cliffs"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Halftone dots */}
                <div style={{ marginTop: 16 }}>
                  <HalftoneRow cols={16} ink={P.accent2} size={5} gap={10} />
                </div>
              </div>

              {/* Text */}
              <div style={{ flex: "1 1 0", paddingTop: "clamp(0px,3vw,40px)" }}>
                <RisoTag ink={P.accent}>About the press</RisoTag>
                <MisprintText
                  tag="h2"
                  size={40}
                  color1={P.accent}
                  color2={P.accent2}
                  className=""
                >
                  Independent. Hands-on. Always shipping.
                </MisprintText>

                <div style={{ marginTop: 28 }}>
                  {[
                    "I'm Waseem Nasir — independent founder of SkynetLabs. I've been building AI and automation systems since 2019, long before 'AI-native agency' became a pitch deck word.",
                    "My work is hands-on and direct. No account managers, no project handoffs to a junior dev offshore. When you book a call with me, you talk to the person who writes the code and runs the workflow.",
                    "180+ builds shipped. 40+ clients across 9 countries. I've built from Lahore rooftops and Bali terraces and a client facing three time zones — and the systems still ran on time.",
                    "I believe automation should feel human. Warm follow-ups, not cold bots. Precise timing, not spam. That's the craft I bring to every build.",
                  ].map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "'Spline Sans', sans-serif",
                        fontSize: 16,
                        lineHeight: 1.7,
                        color: P.muted,
                        marginBottom: 20,
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  <a
                    href="https://skynetjoe.com/discovery-call"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: P.accent,
                      textDecoration: "none",
                      borderBottom: `2px solid ${P.accent}`,
                      paddingBottom: 2,
                    }}
                  >
                    Book a call
                  </a>
                  <a
                    href="https://github.com/waseemnasir2k26"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: P.accent2,
                      textDecoration: "none",
                      borderBottom: `2px solid ${P.accent2}`,
                      paddingBottom: 2,
                    }}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════
              MORE PHOTOS STRIP
          ════════════════════════════════════ */}
          <section
            style={{
              padding: "clamp(40px,6vw,80px) clamp(24px,5vw,80px)",
              background: P.text,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                maxWidth: 1280,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  src: "/img/pro/CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  alt: "Waseem on rooftop with laptop and dragonfruit smoothie",
                  rotate: -1,
                },
                {
                  src: "/img/pro/TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
                  alt: "Waseem in tan knit sweater at mountain ridge",
                  rotate: 1.5,
                },
                {
                  src: "/img/pro/LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
                  alt: "Waseem in black bandhgala with sunglasses at cafe",
                  rotate: -0.8,
                },
                {
                  src: "/img/pro/CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                  alt: "Waseem in garden cafe with blue polo smiling at laptop",
                  rotate: 1.2,
                },
                {
                  src: "/img/pro/PORTRAIT-mural-halfbody-smile-watch-raised.jpg",
                  alt: "Waseem smiling with watch raised in front of mural",
                  rotate: -1.5,
                },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  style={{ transform: `rotate(${img.rotate}deg)` }}
                >
                  <div
                    className="riso-img-wrap"
                    style={{ aspectRatio: "1/1.3", overflow: "hidden" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "sepia(0.2) contrast(1.1)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ════════════════════════════════════
              CONTACT / CTA
          ════════════════════════════════════ */}
          <section
            id="contact"
            style={{
              padding: "clamp(80px,10vw,140px) clamp(24px,5vw,80px)",
              maxWidth: 1280,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Decorative halftone rings */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 600,
                height: 600,
                borderRadius: "50%",
                border: `80px solid ${P.accent}`,
                opacity: 0.04,
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 400,
                height: 400,
                borderRadius: "50%",
                border: `50px solid ${P.accent2}`,
                opacity: 0.05,
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <RisoTag ink={P.accent}>Run a copy</RisoTag>

              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(36px,6vw,80px)",
                  fontWeight: 900,
                  color: P.text,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  marginTop: 20,
                  marginBottom: 24,
                }}
              >
                Your ops,
                <br />
                <span style={{ color: P.accent }}>hand-</span>
                <span style={{ color: P.accent2 }}>crafted</span>
                <br />
                automation.
              </h2>

              <p
                style={{
                  fontFamily: "'Spline Sans', sans-serif",
                  fontSize: "clamp(16px,2vw,20px)",
                  color: P.muted,
                  maxWidth: 480,
                  margin: "0 auto 48px",
                  lineHeight: 1.6,
                }}
              >
                30 minutes. I'll map your top three revenue leaks and tell you
                exactly which system seals each one.
              </p>

              <motion.a
                href="https://skynetjoe.com/discovery-call"
                whileHover={prefersReduced ? {} : { scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-block",
                  background: P.text,
                  color: P.bg,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "18px 48px",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                Book discovery call
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: `2px solid ${P.accent}`,
                    transform: "translate(5px,5px)",
                    pointerEvents: "none",
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: `2px solid ${P.accent2}`,
                    transform: "translate(9px,9px)",
                    pointerEvents: "none",
                  }}
                />
              </motion.a>

              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  justifyContent: "center",
                  gap: 32,
                }}
              >
                <HalftoneRow cols={8} ink={P.accent} size={6} gap={12} />
                <HalftoneRow cols={8} ink={P.accent2} size={6} gap={12} />
              </div>
            </div>
          </section>
        </main>

        {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
        <footer
          style={{
            borderTop: `3px solid ${P.accent}`,
            background: P.text,
            padding: "clamp(32px,4vw,56px) clamp(24px,5vw,80px)",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              {/* Footer logo */}
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 900,
                  fontSize: 28,
                  color: P.bg,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                {!prefersReduced && (
                  <>
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        color: P.accent,
                        mixBlendMode: "screen",
                        transform: "translate(3px,-2px)",
                        opacity: 0.8,
                      }}
                    >
                      SkynetLabs
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        color: P.accent2,
                        mixBlendMode: "screen",
                        transform: "translate(-3px,2px)",
                        opacity: 0.6,
                      }}
                    >
                      SkynetLabs
                    </span>
                  </>
                )}
                <span style={{ position: "relative", zIndex: 1 }}>
                  SkynetLabs
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: P.muted,
                  textTransform: "uppercase",
                }}
              >
                By Waseem Nasir · Lahore / Bali · Est. 2019
              </p>
            </div>

            <nav aria-label="Footer navigation">
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                {[
                  {
                    label: "Discovery Call",
                    href: "https://skynetjoe.com/discovery-call",
                  },
                  {
                    label: "GitHub",
                    href: "https://github.com/waseemnasir2k26",
                  },
                  { label: "SkynetJoe", href: "https://skynetjoe.com" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: P.muted,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        P.accent;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        P.muted;
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </nav>

            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: P.muted,
                letterSpacing: "0.06em",
              }}
            >
              Riso Misprint — Design 16 / 50
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
