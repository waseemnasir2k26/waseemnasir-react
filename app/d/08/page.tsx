"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

/* ─── Spring physics constants ─── */
const SPRING_HEAVY = {
  type: "spring" as const,
  stiffness: 280,
  damping: 18,
  mass: 1.4,
};
const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 500,
  damping: 22,
  mass: 0.8,
};
const SPRING_BOUNCE = {
  type: "spring" as const,
  stiffness: 380,
  damping: 14,
  mass: 1.0,
};

/* ─── Glyph scramble util ─── */
const GLYPHS = "▓▒░█▄▀◆◇▸▹⟩⟨|/\\".split("");
function scramble(word: string, progress: number): string {
  return word
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      const threshold = i / word.length;
      if (progress >= threshold + 0.1) return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

/* ─── Per-letter drop component ─── */
function KineticLetter({
  char,
  index,
  total,
  reduced,
}: {
  char: string;
  index: number;
  total: number;
  reduced: boolean;
}) {
  if (char === " ")
    return <span style={{ display: "inline-block", width: "0.35em" }} />;
  const delay = reduced ? 0 : index * 0.06;
  return (
    <motion.span
      key={char + index}
      style={{ display: "inline-block", transformOrigin: "bottom center" }}
      initial={
        reduced ? false : { y: "-160%", scaleY: 0.4, scaleX: 1.3, opacity: 0 }
      }
      animate={{ y: "0%", scaleY: 1, scaleX: 1, opacity: 1 }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              ...SPRING_HEAVY,
              delay,
              scaleY: { ...SPRING_BOUNCE, delay: delay + 0.04 },
              scaleX: { ...SPRING_SNAPPY, delay: delay + 0.04 },
            }
      }
    >
      {char}
    </motion.span>
  );
}

/* ─── Scramble word on hover ─── */
function ScrambleWord({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(word);
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const reduced = useReducedMotion();

  const run = useCallback(
    (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 600;
      const progress = Math.min(elapsed, 1);
      setDisplay(scramble(word, progress));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(run);
      } else {
        setDisplay(word);
      }
    },
    [word],
  );

  const handleEnter = () => {
    if (reduced) return;
    setHovered(true);
    startRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(run);
  };

  const handleLeave = () => {
    setHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setDisplay(word);
  };

  return (
    <span
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        cursor: "crosshair",
        color: hovered ? "#DFFF6B" : "inherit",
        transition: "color 0.15s ease",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: hovered ? "0.04em" : "inherit",
      }}
    >
      {display}
    </span>
  );
}

/* ─── Neon ticker ─── */
function Ticker() {
  const items = [
    "180+ BUILDS SHIPPED",
    "40+ CLIENTS",
    "9 COUNTRIES",
    "SINCE 2019",
    "N8N · NEXT.JS · AI BOTS",
    "BALI / LAHORE",
    "SKYNETLABS",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid #DFFF6B33",
        borderBottom: "1px solid #DFFF6B33",
        padding: "10px 0",
        background: "#0A0A0B",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: "60px", whiteSpace: "nowrap" }}
        animate={{ x: [0, -50 * items.length * 12] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "13px",
              color: i % 3 === 0 ? "#DFFF6B" : "#6B6B73",
              letterSpacing: "0.12em",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Stat block ─── */
function StatBlock({
  num,
  label,
  accent,
  delay,
  reduced,
}: {
  num: string;
  label: string;
  accent?: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduced ? { duration: 0 } : { ...SPRING_SNAPPY, delay }}
      style={{
        borderLeft: `3px solid ${accent ? "#DFFF6B" : "#00D3FF"}`,
        paddingLeft: "20px",
      }}
    >
      <div
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(40px, 6vw, 80px)",
          lineHeight: 1,
          color: accent ? "#DFFF6B" : "#F4F4F0",
          letterSpacing: "-0.01em",
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          color: "#6B6B73",
          marginTop: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ─── Service card ─── */
function ServiceCard({
  icon,
  title,
  body,
  index,
  reduced,
}: {
  icon: string;
  title: string;
  body: string;
  index: number;
  reduced: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 50, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={
        reduced ? { duration: 0 } : { ...SPRING_BOUNCE, delay: index * 0.08 }
      }
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        background: hov ? "#141417" : "#0D0D10",
        border: `1px solid ${hov ? "#DFFF6B44" : "#1E1E24"}`,
        borderRadius: "4px",
        padding: "32px 28px",
        cursor: "default",
        transition: "background 0.2s ease, border-color 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hov && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 30%, #DFFF6B0A 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "28px",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(18px, 2.2vw, 26px)",
          color: "#F4F4F0",
          letterSpacing: "0.02em",
          marginBottom: "12px",
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "15px",
          color: "#6B6B73",
          lineHeight: 1.65,
        }}
      >
        {body}
      </div>
    </motion.div>
  );
}

/* ─── Work item ─── */
function WorkItem({
  num,
  label,
  tag,
  img,
  index,
  reduced,
}: {
  num: string;
  label: string;
  tag: string;
  img: string;
  index: number;
  reduced: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={
        reduced ? { duration: 0 } : { ...SPRING_SNAPPY, delay: index * 0.07 }
      }
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr auto",
        alignItems: "center",
        gap: "24px",
        padding: "20px 0",
        borderBottom: "1px solid #1A1A20",
        cursor: "default",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          color: "#DFFF6B",
          opacity: 0.7,
        }}
      >
        {num}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(18px, 2vw, 24px)",
            color: hov ? "#DFFF6B" : "#F4F4F0",
            transition: "color 0.15s ease",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#6B6B73",
            marginTop: "4px",
          }}
        >
          {tag}
        </div>
      </div>
      <motion.div
        animate={hov ? { scale: 1.06, rotate: 1 } : { scale: 1, rotate: 0 }}
        transition={SPRING_SNAPPY}
        style={{
          width: "80px",
          height: "56px",
          borderRadius: "3px",
          overflow: "hidden",
          flexShrink: 0,
          border: "1px solid #1E1E24",
        }}
      >
        <img
          src={`/img/pro/${img}`}
          alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Main page ─── */
export default function VoltageKinetic() {
  const reduced = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], ["0%", "-12%"]);

  const headline = "I make robots do the boring part.";
  const words = headline.split(" ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .root-08 * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .root-08 a:focus-visible {
          outline: 2px solid #DFFF6B;
          outline-offset: 3px;
          border-radius: 2px;
        }
        .root-08 .cta-btn:hover {
          background: #DFFF6B !important;
          color: #0A0A0B !important;
          transform: translateY(-2px) scale(1.02);
        }
        .root-08 .cta-btn {
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
        }
        .root-08 .neon-line {
          box-shadow: 0 0 12px #DFFF6B66, 0 0 32px #DFFF6B22;
        }
        .root-08 .cyan-glow {
          box-shadow: 0 0 12px #00D3FF66, 0 0 32px #00D3FF22;
        }
        @media (prefers-reduced-motion: reduce) {
          .root-08 .ticker-motion { animation: none !important; }
        }
        @media (max-width: 768px) {
          .root-08 .hero-grid { grid-template-columns: 1fr !important; }
          .root-08 .services-grid { grid-template-columns: 1fr !important; }
          .root-08 .about-grid { grid-template-columns: 1fr !important; }
          .root-08 .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Scroll progress rail */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          width: progressWidth,
          background: "linear-gradient(90deg, #DFFF6B, #00D3FF)",
          zIndex: 9999,
          boxShadow: "0 0 10px #DFFF6B88",
        }}
      />

      <div
        className="root-08"
        ref={containerRef}
        style={{
          minHeight: "100vh",
          background: "#0A0A0B",
          color: "#F4F4F0",
          position: "relative",
          zIndex: 2,
          overflowX: "hidden",
        }}
      >
        {/* Skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            top: "-100px",
            left: "16px",
            background: "#DFFF6B",
            color: "#0A0A0B",
            padding: "8px 16px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            borderRadius: "2px",
            zIndex: 10000,
            transition: "top 0.2s",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.top = "16px";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.top = "-100px";
          }}
        >
          Skip to main content
        </a>

        {/* ── NAV ── */}
        <header
          role="banner"
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
            background: "#0A0A0Bcc",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #DFFF6B18",
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "20px",
              color: "#DFFF6B",
              letterSpacing: "0.06em",
            }}
          >
            SKYNETLABS
          </span>
          <nav
            aria-label="Primary navigation"
            style={{ display: "flex", gap: "32px" }}
          >
            {["Work", "Services", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#6B6B73",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#DFFF6B")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#6B6B73")
                }
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="cta-btn"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.1em",
              color: "#0A0A0B",
              background: "#DFFF6B",
              padding: "10px 22px",
              borderRadius: "2px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            BOOK CALL
          </a>
        </header>

        {/* ── HERO ── */}
        <main id="main-content">
          <section
            aria-label="Hero"
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 40px 60px",
              paddingTop: "100px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background texture grid */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(#DFFF6B08 1px, transparent 1px), linear-gradient(90deg, #DFFF6B08 1px, transparent 1px)",
                backgroundSize: "80px 80px",
                pointerEvents: "none",
              }}
            />

            {/* Neon corner accent */}
            <motion.div
              aria-hidden
              initial={reduced ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING_BOUNCE, delay: 1.2 }}
              style={{
                position: "absolute",
                top: "120px",
                right: "40px",
                width: "220px",
                height: "220px",
                border: "1px solid #DFFF6B",
                borderRadius: "50%",
                opacity: 0.15,
                boxShadow: "0 0 40px #DFFF6B44 inset, 0 0 60px #DFFF6B22",
                pointerEvents: "none",
              }}
            />
            <motion.div
              aria-hidden
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              style={{
                position: "absolute",
                top: "170px",
                right: "90px",
                width: "120px",
                height: "120px",
                border: "1px solid #00D3FF",
                borderRadius: "50%",
                opacity: 0.12,
                boxShadow: "0 0 30px #00D3FF44 inset",
                pointerEvents: "none",
              }}
            />

            {/* Eyebrow */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING_SNAPPY, delay: 0.1 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
                color: "#00D3FF",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "36px",
                  height: "2px",
                  background: "#00D3FF",
                }}
                className="cyan-glow"
              />
              Waseem Nasir · SkynetLabs · AI Automation
            </motion.div>

            {/* Hero headline — per-letter drop */}
            <h1
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(13vw, 18vw, 22vw)",
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                color: "#F4F4F0",
                marginBottom: "0",
                display: "flex",
                flexWrap: "wrap",
                gap: "0 0.18em",
                position: "relative",
                zIndex: 2,
              }}
            >
              {words.map((word, wi) => {
                const letters = word.replace(".", "").split("");
                const isPeriod = word.endsWith(".");
                const globalOffset = words.slice(0, wi).join("").length + wi;
                return (
                  <span key={wi} style={{ display: "inline-flex" }}>
                    {letters.map((ch, li) => (
                      <KineticLetter
                        key={li}
                        char={ch}
                        index={globalOffset + li}
                        total={headline.length}
                        reduced={reduced}
                      />
                    ))}
                    {isPeriod && (
                      <motion.span
                        style={{ display: "inline-block", color: "#DFFF6B" }}
                        initial={reduced ? false : { opacity: 0, scale: 3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...SPRING_BOUNCE, delay: 1.1 }}
                      >
                        .
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </h1>

            {/* Acid word scramble + subhead row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "32px",
                marginTop: "48px",
              }}
            >
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SNAPPY, delay: 1.0 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(15px, 1.6vw, 20px)",
                  color: "#6B6B73",
                  maxWidth: "480px",
                  lineHeight: 1.6,
                }}
              >
                180+ builds. 40+ clients. 9 countries.{" "}
                <ScrambleWord word="Shipping" className="" /> since 2019.
              </motion.p>

              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING_BOUNCE, delay: 1.15 }}
                style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
              >
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="cta-btn"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "16px",
                    letterSpacing: "0.1em",
                    color: "#0A0A0B",
                    background: "#DFFF6B",
                    padding: "18px 40px",
                    borderRadius: "2px",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  BOOK 30 MIN — FREE
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="cta-btn"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "13px",
                    letterSpacing: "0.08em",
                    color: "#6B6B73",
                    background: "transparent",
                    border: "1px solid #1E1E24",
                    padding: "18px 28px",
                    borderRadius: "2px",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  GITHUB ↗
                </a>
              </motion.div>
            </div>

            {/* Hero paralax image strip */}
            <motion.div
              style={{ y: heroParallax }}
              aria-hidden
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "40px",
                  bottom: "60px",
                  width: "260px",
                  height: "360px",
                  borderRadius: "3px",
                  overflow: "hidden",
                  border: "1px solid #1E1E24",
                  boxShadow: "0 0 60px #0A0A0B88",
                }}
              >
                <img
                  src="/img/pro/LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg"
                  alt="Waseem Nasir standing by a neon sign"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, #0A0A0B88 0%, transparent 60%)",
                  }}
                />
              </div>
            </motion.div>
          </section>

          {/* ── TICKER ── */}
          <Ticker />

          {/* ── NUMBERS ── */}
          <section
            id="proof"
            aria-label="Proof numbers"
            style={{ padding: "100px 40px", borderBottom: "1px solid #0F0F14" }}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={SPRING_SNAPPY}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#DFFF6B",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "56px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  height: "2px",
                  background: "#DFFF6B",
                }}
                className="neon-line"
              />
              BY THE NUMBERS
            </motion.div>

            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "40px",
              }}
            >
              <StatBlock
                num="180+"
                label="Builds shipped"
                accent
                delay={0}
                reduced={reduced}
              />
              <StatBlock
                num="40+"
                label="Clients served"
                delay={0.1}
                reduced={reduced}
              />
              <StatBlock
                num="9"
                label="Countries operated"
                delay={0.2}
                reduced={reduced}
              />
              <StatBlock
                num="2019"
                label="Year one"
                accent
                delay={0.3}
                reduced={reduced}
              />
            </div>

            {/* Visual row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "4px",
                marginTop: "64px",
              }}
            >
              {[
                "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
                "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
                "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
              ].map((img, i) => (
                <motion.div
                  key={img}
                  initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { ...SPRING_SNAPPY, delay: i * 0.06 }
                  }
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: "2px",
                  }}
                >
                  <img
                    src={`/img/pro/${img}`}
                    alt="Waseem working remotely"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── SERVICES ── */}
          <section
            id="services"
            aria-label="Services"
            style={{ padding: "100px 40px", borderBottom: "1px solid #0F0F14" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "64px",
                flexWrap: "wrap",
                gap: "24px",
              }}
            >
              <div>
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={SPRING_SNAPPY}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: "#00D3FF",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "24px",
                      height: "2px",
                      background: "#00D3FF",
                    }}
                    className="cyan-glow"
                  />
                  WHAT I BUILD
                </motion.div>
                <motion.h2
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING_HEAVY, delay: 0.1 }}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(36px, 5vw, 72px)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.01em",
                    color: "#F4F4F0",
                  }}
                >
                  SYSTEMS THAT <br />
                  <span style={{ color: "#DFFF6B" }}>NEVER SLEEP.</span>
                </motion.h2>
              </div>
            </div>

            <div
              className="services-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2px",
              }}
            >
              {[
                {
                  icon: "⚡",
                  title: "AI VOICE + WHATSAPP BOTS",
                  body: "Missed a lead at 2am? Your bot didn't. Inbound voice answer, WhatsApp intake, CRM write — all automatic. Real calls, real replies, zero headcount.",
                },
                {
                  icon: "↻",
                  title: "N8N WORKFLOW AUTOMATION",
                  body: "Manual ops are a tax. I map your ops, kill the hand-offs, wire n8n to your stack. What took an hour now fires in 90 seconds.",
                },
                {
                  icon: "◈",
                  title: "NEXT.JS PRODUCT BUILDS",
                  body: "Funnels, internal tools, SaaS dashboards. Full-stack Next.js with auth, payments, and edge caching. Shipped fast, production-hardened.",
                },
                {
                  icon: "◎",
                  title: "AEO — AI ANSWER ENGINE",
                  body: "When someone asks ChatGPT or Perplexity who to hire, your name shows up. I structure your content so AI cites you first.",
                },
                {
                  icon: "▸",
                  title: "LEAD CAPTURE FUNNELS",
                  body: "One page, one action. Stripe-wired checkout, GDPR-clean opt-ins, thank-you automations. Converts cold traffic into booked calls.",
                },
                {
                  icon: "∞",
                  title: "FULL OPS STACK SETUP",
                  body: "CRM, inbox routing, docs, dashboards — everything wired together. Start with one bottleneck, end with a business that runs itself.",
                },
              ].map((s, i) => (
                <ServiceCard
                  key={i}
                  icon={s.icon}
                  title={s.title}
                  body={s.body}
                  index={i}
                  reduced={reduced}
                />
              ))}
            </div>
          </section>

          {/* ── WORK ── */}
          <section
            id="work"
            aria-label="Selected work"
            style={{ padding: "100px 40px", borderBottom: "1px solid #0F0F14" }}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={SPRING_SNAPPY}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#DFFF6B",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  height: "2px",
                  background: "#DFFF6B",
                }}
                className="neon-line"
              />
              SELECTED BUILDS
            </motion.div>

            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING_HEAVY, delay: 0.08 }}
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(36px, 5vw, 72px)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                color: "#F4F4F0",
                marginBottom: "48px",
              }}
            >
              180+ SHIPPED.{" "}
              <span style={{ color: "#6B6B73" }}>HERE'S A FEW.</span>
            </motion.h2>

            <div style={{ borderTop: "1px solid #1A1A20" }}>
              {[
                {
                  num: "01",
                  label: "PHYSICAL THERAPY STRIPE FUNNEL",
                  tag: "Next.js · Stripe · WP",
                  img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                },
                {
                  num: "02",
                  label: "FREIGHT OPS VOICE AI RECEPTIONIST",
                  tag: "n8n · Twilio · WhatsApp",
                  img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
                },
                {
                  num: "03",
                  label: "TRAVEL AGENCY BOOKING AUTOMATION",
                  tag: "n8n · WordPress · REST API",
                  img: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                },
                {
                  num: "04",
                  label: "AEO ENGINE FOR CLINIC NETWORK",
                  tag: "Next.js · Structured Data · AEO",
                  img: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                },
                {
                  num: "05",
                  label: "EMAIL AUTOMATION OUTREACH STACK",
                  tag: "n8n · OpenAI · IMAP",
                  img: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                },
              ].map((item, i) => (
                <WorkItem
                  key={i}
                  num={item.num}
                  label={item.label}
                  tag={item.tag}
                  img={item.img}
                  index={i}
                  reduced={reduced}
                />
              ))}
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section
            id="about"
            aria-label="About Waseem"
            style={{ padding: "100px 40px", borderBottom: "1px solid #0F0F14" }}
          >
            <div
              className="about-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
                alignItems: "start",
              }}
            >
              {/* Text */}
              <div>
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={SPRING_SNAPPY}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: "#00D3FF",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "24px",
                      height: "2px",
                      background: "#00D3FF",
                    }}
                    className="cyan-glow"
                  />
                  WHO BUILDS THIS
                </motion.div>

                <motion.h2
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING_HEAVY, delay: 0.08 }}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(32px, 4vw, 60px)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.01em",
                    color: "#F4F4F0",
                    marginBottom: "32px",
                  }}
                >
                  WASEEM NASIR. <br />
                  <span style={{ color: "#DFFF6B" }}>INDEPENDENT.</span>
                </motion.h2>

                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.18 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    color: "#6B6B73",
                    lineHeight: 1.75,
                    maxWidth: "440px",
                  }}
                >
                  <p style={{ marginBottom: "16px" }}>
                    Founder of SkynetLabs. I build AI + automation systems that
                    kill busywork: missed leads, dead follow-ups, manual ops.
                    You keep the strategy — robots handle the grind.
                  </p>
                  <p style={{ marginBottom: "16px" }}>
                    Working remotely from Bali and Lahore. Operated solo since
                    2019 — no agency overhead, no account manager, just fast
                    execution with one point of contact.
                  </p>
                  <p>
                    Stack: n8n · Next.js · OpenAI · Twilio · WhatsApp Business
                    API · Stripe. If it runs on the web, I can automate it.
                  </p>
                </motion.div>

                <motion.div
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  style={{
                    marginTop: "40px",
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    "n8n",
                    "Next.js",
                    "OpenAI",
                    "Twilio",
                    "Stripe",
                    "WhatsApp API",
                  ].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        color: "#DFFF6B",
                        background: "#DFFF6B10",
                        border: "1px solid #DFFF6B33",
                        padding: "6px 14px",
                        borderRadius: "2px",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Photo stack */}
              <div style={{ position: "relative" }}>
                <motion.div
                  initial={reduced ? false : { opacity: 0, rotate: -4, y: 30 }}
                  whileInView={{ opacity: 1, rotate: -3, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING_BOUNCE, delay: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    width: "100%",
                    height: "500px",
                    borderRadius: "3px",
                    overflow: "hidden",
                    border: "1px solid #1E1E24",
                  }}
                >
                  <img
                    src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                    alt="Waseem Nasir in a black coat on a balcony"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </motion.div>
                <motion.div
                  initial={reduced ? false : { opacity: 0, rotate: 3, y: 30 }}
                  whileInView={{ opacity: 1, rotate: 2, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING_BOUNCE, delay: 0.25 }}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "500px",
                    borderRadius: "3px",
                    overflow: "hidden",
                    border: "2px solid #DFFF6B33",
                    boxShadow: "0 0 40px #DFFF6B18",
                  }}
                >
                  <img
                    src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                    alt="Waseem Nasir arms crossed, confident pose"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "20px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "#DFFF6B",
                      background: "#0A0A0Bcc",
                      padding: "6px 12px",
                      borderRadius: "2px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    BALI / LAHORE — REMOTE
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── BALI STRIP ── */}
          <section
            aria-label="Remote work locations"
            style={{ padding: "0 0 0 0" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "4px",
              }}
            >
              {[
                {
                  img: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                  cap: "Nusa Penida, Bali",
                },
                {
                  img: "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
                  cap: "Blue hour builds",
                },
                {
                  img: "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
                  cap: "Mountain ridge, Lahore",
                },
              ].map(({ img, cap }, i) => (
                <motion.div
                  key={img}
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { ...SPRING_SNAPPY, delay: i * 0.1 }
                  }
                  style={{
                    position: "relative",
                    height: "340px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`/img/pro/${img}`}
                    alt={cap}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, #0A0A0Bcc 0%, transparent 55%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "20px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "#F4F4F0",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {cap}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section
            id="contact"
            aria-label="Contact and call to action"
            style={{
              padding: "120px 40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* bg grid */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(#DFFF6B06 1px, transparent 1px), linear-gradient(90deg, #DFFF6B06 1px, transparent 1px)",
                backgroundSize: "60px 60px",
                pointerEvents: "none",
              }}
            />

            {/* Neon accent lines */}
            <motion.div
              aria-hidden
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, #DFFF6B44, transparent)",
                transformOrigin: "left",
              }}
            />

            <div
              style={{ position: "relative", zIndex: 2, textAlign: "center" }}
            >
              <motion.div
                initial={reduced ? false : { opacity: 0, y: -12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={SPRING_SNAPPY}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#00D3FF",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "24px",
                }}
              >
                [ READY TO AUTOMATE? ]
              </motion.div>

              <motion.h2
                initial={reduced ? false : { opacity: 0, y: 32, scaleY: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ ...SPRING_HEAVY, delay: 0.08 }}
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(40px, 8vw, 120px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  color: "#F4F4F0",
                  marginBottom: "40px",
                }}
              >
                30 MINUTES. <br />
                <span style={{ color: "#DFFF6B" }}>
                  <ScrambleWord word="ZERO FLUFF." />
                </span>
              </motion.h2>

              <motion.p
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "17px",
                  color: "#6B6B73",
                  maxWidth: "420px",
                  margin: "0 auto 48px",
                  lineHeight: 1.65,
                }}
              >
                Tell me what's bleeding time. I'll show you exactly how to kill
                it — in the call, not after a proposal.
              </motion.p>

              <motion.a
                href="https://skynetjoe.com/discovery-call"
                className="cta-btn"
                initial={reduced ? false : { opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...SPRING_BOUNCE, delay: 0.28 }}
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "20px",
                  letterSpacing: "0.12em",
                  color: "#0A0A0B",
                  background: "#DFFF6B",
                  padding: "24px 64px",
                  borderRadius: "2px",
                  textDecoration: "none",
                  display: "inline-block",
                  boxShadow: "0 0 40px #DFFF6B44",
                }}
              >
                BOOK THE CALL — FREE
              </motion.a>

              {/* Bali photo below CTA */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING_SNAPPY, delay: 0.4 }}
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  marginTop: "64px",
                }}
              >
                {[
                  "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                  "PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
                  "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
                ].map((img, i) => (
                  <div
                    key={img}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border:
                        i === 1 ? "3px solid #DFFF6B" : "2px solid #1E1E24",
                      boxShadow: i === 1 ? "0 0 20px #DFFF6B44" : "none",
                    }}
                  >
                    <img
                      src={`/img/pro/${img}`}
                      alt="Waseem Nasir"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer
          role="contentinfo"
          style={{
            borderTop: "1px solid #141417",
            padding: "40px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            background: "#0A0A0B",
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "18px",
              color: "#DFFF6B",
              letterSpacing: "0.08em",
            }}
          >
            SKYNETLABS
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#6B6B73",
              letterSpacing: "0.06em",
            }}
          >
            Waseem Nasir · waseemnasir2k26@gmail.com · Bali / Lahore
          </span>
          <div style={{ display: "flex", gap: "24px" }}>
            <a
              href="https://github.com/waseemnasir2k26"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#6B6B73",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#DFFF6B")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#6B6B73")
              }
            >
              GitHub ↗
            </a>
            <a
              href="https://skynetjoe.com/discovery-call"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#6B6B73",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#DFFF6B")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#6B6B73")
              }
            >
              Book Call ↗
            </a>
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#2A2A32",
              letterSpacing: "0.04em",
            }}
          >
            © 2026 SkynetLabs
          </span>
        </footer>
      </div>
    </>
  );
}
