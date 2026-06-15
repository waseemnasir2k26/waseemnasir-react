"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ─── SCOPED STYLES ──────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400&display=swap');

.d31 * { box-sizing: border-box; margin: 0; padding: 0; }

.d31 {
  font-family: 'Inter', sans-serif;
  background: #0C0F1A;
  color: #EAEFFF;
  min-height: 100vh;
  position: relative;
  z-index: 2;
  overflow-x: hidden;
}

.d31-display { font-family: 'Bricolage Grotesque', sans-serif; }
.d31-mono    { font-family: 'JetBrains Mono', monospace; }

/* ── DUOTONE: indigo→magenta via mix-blend ─── */
.d31-duotone-wrap {
  position: relative;
  display: inline-block;
  line-height: 0;
}
.d31-duotone-wrap img {
  display: block;
  filter: grayscale(1) contrast(1.2);
}
.d31-duotone-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #5B6CFF 0%, #FF5DA2 100%);
  mix-blend-mode: color;
  z-index: 1;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.d31-duotone-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(92, 107, 138, 0.18);
  mix-blend-mode: overlay;
  z-index: 2;
  pointer-events: none;
}

/* ── RGB GLITCH on hover ─── */
@keyframes d31-glitch-r {
  0%,100% { transform: translate(0,0); opacity:1; }
  20%      { transform: translate(-3px, 1px); opacity:0.85; }
  40%      { transform: translate(3px,-1px); opacity:0.9; }
  60%      { transform: translate(-2px, 2px); opacity:0.8; }
  80%      { transform: translate(2px,-2px); opacity:0.85; }
}
@keyframes d31-glitch-b {
  0%,100% { transform: translate(0,0); opacity:0; }
  20%      { transform: translate(3px, 1px); opacity:0.6; }
  40%      { transform: translate(-3px,-1px); opacity:0.5; }
  60%      { transform: translate(2px, 2px); opacity:0.55; }
  80%      { transform: translate(-2px,-2px); opacity:0.6; }
}

.d31-duotone-wrap.glitching::before {
  background: #FF0044;
  mix-blend-mode: screen;
  animation: d31-glitch-r 0.18s steps(1) forwards;
}
.d31-duotone-wrap.glitching .d31-glitch-blue {
  display: block;
  position: absolute;
  inset: 0;
  background: #00CFFF;
  mix-blend-mode: screen;
  z-index: 3;
  pointer-events: none;
  animation: d31-glitch-b 0.18s steps(1) forwards;
}
.d31-glitch-blue { display: none; }

/* ── MAGNETIC BUTTON ─── */
.d31-magnetic {
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(.23,1,.32,1);
}

/* ── PROGRESS BAR ─── */
.d31-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, #5B6CFF, #FF5DA2);
  z-index: 999;
  transform-origin: left;
}

/* ── NUMERAL ANCHORS ─── */
.d31-numeral {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  line-height: 0.85;
  color: transparent;
  -webkit-text-stroke: 1px rgba(91,108,255,0.35);
  user-select: none;
  pointer-events: none;
}

/* ── BROKEN GRID GALLERY ─── */
.d31-gallery {
  display: grid;
  grid-template-columns: 3fr 2fr 3fr;
  grid-template-rows: auto auto;
  gap: 3px;
}
.d31-gallery-item-a { grid-column: 1; grid-row: 1 / 3; }
.d31-gallery-item-b { grid-column: 2; grid-row: 1; }
.d31-gallery-item-c { grid-column: 3; grid-row: 1; }
.d31-gallery-item-d { grid-column: 2 / 4; grid-row: 2; }

/* ── SERVICES STRIP ─── */
.d31-service {
  border-top: 1px solid rgba(92,108,255,0.2);
  padding: 2rem 0;
  display: grid;
  grid-template-columns: 3.5rem 1fr auto;
  gap: 1.5rem;
  align-items: start;
  transition: background 0.2s ease;
}
.d31-service:hover {
  background: rgba(91,108,255,0.04);
}

/* ── ABOUT SPLIT ─── */
.d31-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
@media (max-width: 768px) {
  .d31-gallery {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .d31-gallery-item-a { grid-column: 1 / 3; grid-row: 1; }
  .d31-gallery-item-b { grid-column: 1; grid-row: 2; }
  .d31-gallery-item-c { grid-column: 2; grid-row: 2; }
  .d31-gallery-item-d { grid-column: 1 / 3; grid-row: 3; }
  .d31-about-grid { grid-template-columns: 1fr; }
}

/* ── FOCUS VISIBLE ─── */
.d31 a:focus-visible,
.d31 button:focus-visible {
  outline: 2px solid #5B6CFF;
  outline-offset: 3px;
  border-radius: 2px;
}

/* ── NAV ─── */
.d31-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  background: rgba(12,15,26,0.75);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(92,108,255,0.1);
}

/* ── TICKER ─── */
@keyframes d31-ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.d31-ticker-inner {
  display: flex;
  white-space: nowrap;
  animation: d31-ticker 22s linear infinite;
}
`;

/* ─── DUOTONE IMAGE ──────────────────────────────────────────── */
function DuotoneImg({
  src,
  alt,
  style,
  className = "",
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [glitching, setGlitching] = useState(false);
  const reduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function triggerGlitch() {
    if (reduced) return;
    setGlitching(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setGlitching(false), 220);
  }

  return (
    <div
      className={`d31-duotone-wrap ${glitching ? "glitching" : ""} ${className}`}
      style={{ width: "100%", height: "100%", ...style }}
      onMouseEnter={triggerGlitch}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <span className="d31-glitch-blue" aria-hidden="true" />
    </div>
  );
}

/* ─── MAGNETIC BUTTON ────────────────────────────────────────── */
function MagneticBtn({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 22 });
  const sy = useSpring(y, { stiffness: 300, damping: 22 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base: React.CSSProperties =
    variant === "primary"
      ? {
          background: "linear-gradient(90deg,#5B6CFF,#FF5DA2)",
          color: "#0C0F1A",
          border: "none",
          padding: "0.9rem 2.2rem",
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 800,
          fontSize: "0.9rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          textDecoration: "none",
          display: "inline-block",
          borderRadius: "2px",
        }
      : {
          background: "transparent",
          color: "#EAEFFF",
          border: "1px solid rgba(91,108,255,0.5)",
          padding: "0.9rem 2.2rem",
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 700,
          fontSize: "0.9rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          textDecoration: "none",
          display: "inline-block",
          borderRadius: "2px",
        };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ ...base, x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

/* ─── SCROLL PROGRESS ────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      className="d31-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/* ─── COUNT-UP ───────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = Math.ceil(to / 50);
        const id = setInterval(() => {
          start = Math.min(start + step, to);
          setVal(start);
          if (start >= to) clearInterval(id);
        }, 28);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, reduced]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── SERVICE ROW ────────────────────────────────────────────── */
function ServiceRow({
  num,
  title,
  desc,
  delay,
}: {
  num: string;
  title: string;
  desc: string;
  delay: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="d31-service"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <span
        className="d31-mono"
        style={{ color: "#5B6CFF", fontSize: "0.75rem", paddingTop: "0.15rem" }}
      >
        {num}
      </span>
      <div>
        <p
          className="d31-display"
          style={{
            fontWeight: 800,
            fontSize: "1.15rem",
            marginBottom: "0.4rem",
          }}
        >
          {title}
        </p>
        <p style={{ color: "#5C6B8A", fontSize: "0.875rem", lineHeight: 1.6 }}>
          {desc}
        </p>
      </div>
      <span
        style={{ color: "#5B6CFF", fontSize: "1.1rem", paddingTop: "0.2rem" }}
      >
        ↗
      </span>
    </motion.div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
export default function D31DuotoneSpotlight() {
  const reduced = useReducedMotion();

  /* ── PARALLAX on hero portrait ── */
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -80]);

  return (
    <>
      <style>{STYLES}</style>
      <a
        href="#main-content"
        className="d31-display"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          zIndex: 9999,
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.cssText =
            "position:fixed;top:1rem;left:1rem;z-index:9999;background:#5B6CFF;color:#0C0F1A;padding:0.75rem 1.5rem;font-weight:800;border-radius:2px;width:auto;height:auto;";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.cssText =
            "position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;z-index:9999";
        }}
      >
        Skip to content
      </a>

      <ScrollProgress />

      <div className="d31">
        {/* ── NAV ── */}
        <nav className="d31-nav" aria-label="Primary navigation">
          <span
            className="d31-display"
            style={{
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: "#5B6CFF" }}>W</span>aseem
            <span style={{ color: "#FF5DA2" }}>.</span>
          </span>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {["Work", "Services", "About"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="d31-mono"
                style={{
                  color: "#5C6B8A",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </a>
            ))}
            <MagneticBtn
              href="https://skynetjoe.com/discovery-call"
              variant="primary"
            >
              Book a call
            </MagneticBtn>
          </div>
        </nav>

        <main id="main-content">
          {/* ══════════════════════════════════
              HERO
          ══════════════════════════════════ */}
          <section
            style={{
              paddingTop: "7rem",
              paddingBottom: "0",
              minHeight: "100vh",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              position: "relative",
            }}
          >
            {/* BIG NUMERAL ANCHOR — background graphic */}
            <div
              aria-hidden="true"
              className="d31-numeral"
              style={{
                position: "absolute",
                bottom: "-0.05em",
                left: "2rem",
                fontSize: "clamp(9rem,22vw,18rem)",
                zIndex: 0,
                letterSpacing: "-0.06em",
              }}
            >
              01
            </div>

            {/* Left column: copy */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "4rem 3rem 6rem 3rem",
                position: "relative",
                zIndex: 2,
              }}
            >
              <motion.span
                className="d31-mono"
                style={{
                  color: "#FF5DA2",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  display: "block",
                }}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Waseem Nasir / SkynetLabs / Est. 2019
              </motion.span>

              <h1 className="d31-display">
                <motion.span
                  style={{
                    display: "block",
                    fontWeight: 800,
                    fontSize: "clamp(2.6rem,5.5vw,4.8rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    marginBottom: "1.2rem",
                  }}
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  Automation isn&apos;t a tool.
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(90deg,#5B6CFF,#FF5DA2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    It&apos;s the unfair advantage
                  </span>
                  <br />I install.
                </motion.span>
              </h1>

              <motion.p
                style={{
                  color: "#5C6B8A",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  maxWidth: "32rem",
                  marginBottom: "2.5rem",
                }}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Missed leads, dead follow-ups, manual ops — these are profit
                leaks. I build AI + automation systems with n8n, Next.js, and
                WhatsApp bots that seal them permanently.
              </motion.p>

              <motion.div
                style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <MagneticBtn href="https://skynetjoe.com/discovery-call">
                  Book 30-min call ↗
                </MagneticBtn>
                <MagneticBtn
                  href="https://github.com/waseemnasir2k26"
                  variant="outline"
                >
                  GitHub
                </MagneticBtn>
              </motion.div>

              {/* inline stats */}
              <motion.div
                style={{
                  display: "flex",
                  gap: "2.5rem",
                  marginTop: "3.5rem",
                  borderTop: "1px solid rgba(92,108,255,0.15)",
                  paddingTop: "2rem",
                }}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {[
                  { val: 180, suf: "+", label: "Builds" },
                  { val: 40, suf: "+", label: "Clients" },
                  { val: 9, suf: "", label: "Countries" },
                ].map((s) => (
                  <div key={s.label}>
                    <p
                      className="d31-display"
                      style={{
                        fontWeight: 800,
                        fontSize: "2rem",
                        lineHeight: 1,
                        color: "#EAEFFF",
                      }}
                    >
                      <CountUp to={s.val} suffix={s.suf} />
                    </p>
                    <p
                      className="d31-mono"
                      style={{
                        color: "#5C6B8A",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginTop: "0.3rem",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column: hero portrait */}
            <motion.div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "90vh",
                y: heroParallax,
              }}
            >
              <DuotoneImg
                src="/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg"
                alt="Waseem Nasir — founder SkynetLabs, arms crossed, confident"
                style={{ height: "100%" }}
              />
              {/* label overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: "2rem",
                  right: "2rem",
                  background: "rgba(12,15,26,0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(91,108,255,0.25)",
                  padding: "0.75rem 1.2rem",
                  zIndex: 5,
                }}
              >
                <p
                  className="d31-mono"
                  style={{
                    color: "#5B6CFF",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Working from
                </p>
                <p
                  className="d31-display"
                  style={{
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    color: "#EAEFFF",
                  }}
                >
                  Bali / Lahore
                </p>
              </div>
            </motion.div>
          </section>

          {/* ══════════════════════════════════
              TICKER STRIP
          ══════════════════════════════════ */}
          <div
            style={{
              background: "linear-gradient(90deg,#5B6CFF,#FF5DA2)",
              padding: "0.75rem 0",
              overflow: "hidden",
            }}
            aria-hidden="true"
          >
            <div
              className="d31-ticker-inner d31-display"
              style={{
                fontWeight: 800,
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0C0F1A",
              }}
            >
              {Array(6)
                .fill(
                  "n8n Automation  ·  AI Voice Bots  ·  WhatsApp Systems  ·  AEO  ·  Next.js  ·  Lead Capture  ·  ",
                )
                .join("")}
            </div>
          </div>

          {/* ══════════════════════════════════
              NUMBERS — GRAPHIC ANCHORS
          ══════════════════════════════════ */}
          <section
            style={{
              padding: "8rem 3rem",
              position: "relative",
              background: "#151A2B",
              overflow: "hidden",
            }}
            aria-label="Proof numbers"
          >
            <div
              aria-hidden="true"
              className="d31-numeral"
              style={{
                position: "absolute",
                right: "-0.08em",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "clamp(12rem,30vw,26rem)",
                opacity: 0.25,
              }}
            >
              180
            </div>

            <div style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>
              <motion.p
                className="d31-mono"
                style={{
                  color: "#FF5DA2",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "3rem",
                }}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                Hard numbers. No rounding.
              </motion.p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                  gap: "3rem",
                }}
              >
                {[
                  {
                    big: "180+",
                    label:
                      "Automation builds shipped across 40+ client orgs since 2019.",
                  },
                  {
                    big: "40+",
                    label:
                      "Clients in e-commerce, healthcare, logistics, SaaS, and real estate.",
                  },
                  {
                    big: "9",
                    label:
                      "Countries worked from remotely — Bali, Lahore, Singapore, and beyond.",
                  },
                  {
                    big: "2019",
                    label:
                      "Independent since 2019. No VC, no co-founder, no excuses.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.big}
                    initial={reduced ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <p
                      className="d31-display"
                      style={{
                        fontWeight: 800,
                        fontSize: "clamp(3.5rem,8vw,6rem)",
                        lineHeight: 0.9,
                        background: "linear-gradient(135deg,#5B6CFF,#FF5DA2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "1rem",
                      }}
                    >
                      {item.big}
                    </p>
                    <p
                      style={{
                        color: "#5C6B8A",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        maxWidth: "220px",
                      }}
                    >
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════
              SELECTED WORK — BROKEN GRID GALLERY
          ══════════════════════════════════ */}
          <section
            id="work"
            style={{
              padding: "7rem 0",
              position: "relative",
              overflow: "hidden",
            }}
            aria-label="Selected work"
          >
            <div
              style={{
                padding: "0 3rem",
                marginBottom: "3rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <span
                  className="d31-mono"
                  style={{
                    color: "#5C6B8A",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  02 / Selected work
                </span>
                <h2
                  className="d31-display"
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(2rem,4vw,3.5rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    marginTop: "0.6rem",
                  }}
                >
                  The builds that
                  <br />
                  <span style={{ color: "#FF5DA2" }}>moved the needle.</span>
                </h2>
              </div>
              <div
                aria-hidden="true"
                className="d31-numeral"
                style={{
                  fontSize: "clamp(4rem,9vw,8rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,93,162,0.2)",
                }}
              >
                40+
              </div>
            </div>

            <div className="d31-gallery" style={{ gap: "3px" }}>
              <div className="d31-gallery-item-a" style={{ height: "70vh" }}>
                <DuotoneImg
                  src="/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg"
                  alt="Waseem with dual laptops showing analytics dashboard"
                  style={{ height: "100%" }}
                />
              </div>
              <div className="d31-gallery-item-b" style={{ height: "35vh" }}>
                <DuotoneImg
                  src="/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg"
                  alt="Waseem focused at coworking desk"
                  style={{ height: "100%" }}
                />
              </div>
              <div className="d31-gallery-item-c" style={{ height: "35vh" }}>
                <DuotoneImg
                  src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                  alt="Waseem typing on laptop at Bali terrace cafe"
                  style={{ height: "100%" }}
                />
              </div>
              <div className="d31-gallery-item-d" style={{ height: "35vh" }}>
                <DuotoneImg
                  src="/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg"
                  alt="Waseem typing at night cafe with backlit keyboard"
                  style={{ height: "100%" }}
                />
              </div>
            </div>

            {/* Work cases */}
            <div
              style={{
                padding: "4rem 3rem 0",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: "2px",
              }}
            >
              {[
                {
                  tag: "Healthcare / n8n",
                  title: "Physiotherapy intake automation",
                  result: "$27/mo funnel replaces a receptionist shift.",
                },
                {
                  tag: "Logistics / AI Voice",
                  title: "FreightOps 24/7 dispatcher bot",
                  result: "Missed calls → zero. WhatsApp + voice, dual-geo.",
                },
                {
                  tag: "E-commerce / Next.js",
                  title: "AEO-optimised storefront rebuild",
                  result: "AI citations up 3× in 60 days post-launch.",
                },
                {
                  tag: "Travel / n8n",
                  title: "Inpsieme trip-input CMS",
                  result:
                    "Per-customer trip visibility without custom dev spend.",
                },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  style={{
                    background: "#151A2B",
                    padding: "2rem",
                    borderLeft: "2px solid transparent",
                    transition: "border-color 0.2s ease",
                  }}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ borderColor: "#5B6CFF" } as never}
                >
                  <span
                    className="d31-mono"
                    style={{
                      color: "#FF5DA2",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.tag}
                  </span>
                  <h3
                    className="d31-display"
                    style={{
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      margin: "0.6rem 0 0.5rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      color: "#5C6B8A",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {c.result}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════
              SERVICES
          ══════════════════════════════════ */}
          <section
            id="services"
            style={{ padding: "7rem 3rem", background: "#151A2B" }}
            aria-label="Services"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "4rem",
                alignItems: "start",
              }}
            >
              <div style={{ position: "sticky", top: "6rem" }}>
                <span
                  className="d31-mono"
                  style={{
                    color: "#5C6B8A",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  03 / What I build
                </span>
                <h2
                  className="d31-display"
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(2rem,4vw,3rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    marginTop: "0.6rem",
                  }}
                >
                  Systems that
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(90deg,#5B6CFF,#FF5DA2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    run without you.
                  </span>
                </h2>
                <p
                  style={{
                    color: "#5C6B8A",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    marginTop: "1.2rem",
                    maxWidth: "22rem",
                  }}
                >
                  Every engagement ends with a working system you own — not a
                  retainer that holds your ops hostage.
                </p>
              </div>

              <div>
                {[
                  {
                    num: "01",
                    title: "AI + n8n Workflow Automation",
                    desc: "Full-stack automation across CRM, email, WhatsApp, Slack, Airtable. Missed leads sealed. Follow-up sequences deployed.",
                  },
                  {
                    num: "02",
                    title: "AI Voice & Chat Bots",
                    desc: "24/7 inbound handling for clinics, freight operators, real estate — trained on your SOPs, integrated with your calendar.",
                  },
                  {
                    num: "03",
                    title: "AEO — Answer Engine Optimisation",
                    desc: "Get cited by ChatGPT, Perplexity, Gemini. Structured data, schema, and content architecture that feeds AI answer boxes.",
                  },
                  {
                    num: "04",
                    title: "Next.js Performance Builds",
                    desc: "Core Web Vitals-clean storefronts and landing pages. Server components, edge-cached, built to convert.",
                  },
                  {
                    num: "05",
                    title: "WhatsApp Funnel Systems",
                    desc: "Opt-in flows, lead qualification, appointment booking — WhatsApp Business API integrated end-to-end.",
                  },
                ].map((s, i) => (
                  <ServiceRow key={s.num} {...s} delay={i * 0.07} />
                ))}
                <div style={{ borderTop: "1px solid rgba(92,108,255,0.2)" }} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════
              VOICE / MANIFESTO
          ══════════════════════════════════ */}
          <section
            style={{
              padding: "8rem 3rem",
              background: "#0C0F1A",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
            }}
            aria-label="Manifesto"
          >
            <div
              aria-hidden="true"
              className="d31-numeral"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontSize: "clamp(16rem,40vw,36rem)",
                opacity: 0.06,
                whiteSpace: "nowrap",
              }}
            >
              2019
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <motion.p
                className="d31-mono"
                style={{
                  color: "#5B6CFF",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "2rem",
                }}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                04 / The stance
              </motion.p>

              {[
                "Your competitors are not automating faster.",
                "They hired someone to babysit a process.",
                "I build the process that replaces the babysitter.",
                "The gap compounds monthly.",
              ].map((line, i) => (
                <motion.p
                  key={i}
                  className="d31-display"
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(1.5rem,3.5vw,3rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.5rem",
                    color: i % 2 === 0 ? "#EAEFFF" : "#5C6B8A",
                  }}
                  initial={
                    reduced ? false : { opacity: 0, x: i % 2 === 0 ? -30 : 30 }
                  }
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.12,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════
              ABOUT — SPLIT with portrait gallery
          ══════════════════════════════════ */}
          <section
            id="about"
            style={{ background: "#151A2B" }}
            aria-label="About Waseem"
          >
            <div className="d31-about-grid">
              {/* left: photos */}
              <div
                style={{
                  position: "relative",
                  minHeight: "80vh",
                  display: "grid",
                  gridTemplateRows: "2fr 1fr",
                  gap: "3px",
                }}
              >
                <DuotoneImg
                  src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                  alt="Waseem Nasir in black prince coat at balcony, sunglasses"
                  style={{ height: "100%" }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "3px",
                  }}
                >
                  <DuotoneImg
                    src="/img/pro/TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg"
                    alt="Waseem standing on jungle bridge in sunglasses"
                    style={{ height: "100%", minHeight: "200px" }}
                  />
                  <DuotoneImg
                    src="/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg"
                    alt="Waseem in beige tracksuit in front of glass building"
                    style={{ height: "100%", minHeight: "200px" }}
                  />
                </div>
              </div>

              {/* right: copy */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "5rem 4rem",
                }}
              >
                <span
                  className="d31-mono"
                  style={{
                    color: "#5C6B8A",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "2rem",
                  }}
                >
                  05 / About
                </span>

                <h2
                  className="d31-display"
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(2rem,4vw,3.2rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    marginBottom: "1.5rem",
                  }}
                >
                  Independent
                  <br />
                  since <span style={{ color: "#5B6CFF" }}>2019.</span>
                </h2>

                <div
                  style={{
                    color: "#5C6B8A",
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                  }}
                >
                  <p style={{ marginBottom: "1.2rem" }}>
                    I&apos;m Waseem — founder of SkynetLabs. I build AI and
                    automation infrastructure for founders who are done watching
                    leads evaporate and hours vanish into manual work.
                  </p>
                  <p style={{ marginBottom: "1.2rem" }}>
                    180+ builds. 40+ clients. 9 countries lived and worked from.
                    The workflow that wins isn&apos;t always the prettiest —
                    it&apos;s the one that runs at 3am while you sleep.
                  </p>
                  <p>Base is Bali and Lahore. Remote everywhere else.</p>
                </div>

                <div
                  style={{ marginTop: "2.5rem", display: "flex", gap: "1rem" }}
                >
                  <a
                    href="https://github.com/waseemnasir2k26"
                    className="d31-mono"
                    style={{
                      color: "#5B6CFF",
                      fontSize: "0.8rem",
                      letterSpacing: "0.06em",
                      textDecoration: "none",
                      textTransform: "uppercase",
                    }}
                  >
                    github ↗
                  </a>
                </div>

                {/* extra portrait strip */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "3px",
                    marginTop: "2.5rem",
                  }}
                >
                  {[
                    {
                      src: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                      alt: "Waseem arms spread at Nusa Penida cliffs",
                    },
                    {
                      src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                      alt: "Waseem on hilltop with backpack overlooking city",
                    },
                    {
                      src: "LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
                      alt: "Waseem in black bandhgala with sunglasses at cafe table",
                    },
                  ].map((img) => (
                    <DuotoneImg
                      key={img.src}
                      src={`/img/pro/${img.src}`}
                      alt={img.alt}
                      style={{ height: "160px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════
              LOCATION STRIP — duotone imagery
          ══════════════════════════════════ */}
          <section
            style={{
              padding: "0",
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "3px",
            }}
            aria-label="Where I work from"
          >
            {[
              {
                src: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                alt: "Waseem at rooftop cafe with rainbow mug smiling",
              },
              {
                src: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                alt: "Waseem at rooftop with laptop and dragonfruit smoothie",
              },
              {
                src: "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
                alt: "Waseem on night rooftop with phone and city lights",
              },
              {
                src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                alt: "Waseem at rooftop cafe with laptop and mountain clouds",
              },
            ].map((img) => (
              <div
                key={img.src}
                style={{
                  height: "45vh",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <DuotoneImg
                  src={`/img/pro/${img.src}`}
                  alt={img.alt}
                  style={{ height: "100%" }}
                />
              </div>
            ))}
          </section>

          {/* ══════════════════════════════════
              CTA
          ══════════════════════════════════ */}
          <section
            id="contact"
            style={{
              padding: "10rem 3rem",
              background: "#0C0F1A",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
            }}
            aria-label="Book a call"
          >
            {/* giant accent numeral */}
            <div
              aria-hidden="true"
              className="d31-numeral"
              style={{
                position: "absolute",
                bottom: "-0.1em",
                right: "-0.05em",
                fontSize: "clamp(10rem,25vw,22rem)",
                opacity: 0.07,
              }}
            >
              30
            </div>

            {/* accent lines */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,108,255,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <motion.span
                className="d31-mono"
                style={{
                  color: "#FF5DA2",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "1.5rem",
                }}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                06 / Book
              </motion.span>

              <motion.h2
                className="d31-display"
                style={{
                  fontWeight: 800,
                  fontSize: "clamp(2.5rem,7vw,6rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.04em",
                  marginBottom: "1.5rem",
                }}
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                30 minutes.
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#5B6CFF,#FF5DA2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  One system installed.
                </span>
              </motion.h2>

              <motion.p
                style={{
                  color: "#5C6B8A",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  maxWidth: "28rem",
                  margin: "0 auto 3rem",
                }}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Tell me the leak. I&apos;ll map the system that plugs it — on
                the call, not in a proposal PDF that never gets read.
              </motion.p>

              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <MagneticBtn href="https://skynetjoe.com/discovery-call">
                  Book the free 30-min call ↗
                </MagneticBtn>
              </motion.div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer
          style={{
            background: "#151A2B",
            borderTop: "1px solid rgba(92,108,255,0.12)",
            padding: "2.5rem 3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span
            className="d31-display"
            style={{ fontWeight: 800, fontSize: "0.95rem" }}
          >
            <span style={{ color: "#5B6CFF" }}>W</span>aseem Nasir
            <span
              className="d31-mono"
              style={{
                color: "#5C6B8A",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                marginLeft: "0.75rem",
              }}
            >
              SkynetLabs © 2019–{new Date().getFullYear()}
            </span>
          </span>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <a
              href="https://skynetjoe.com"
              className="d31-mono"
              style={{
                color: "#5C6B8A",
                fontSize: "0.75rem",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              skynetjoe.com
            </a>
            <a
              href="https://github.com/waseemnasir2k26"
              className="d31-mono"
              style={{
                color: "#5C6B8A",
                fontSize: "0.75rem",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              github.com/waseemnasir2k26
            </a>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="d31-mono"
              style={{
                color: "#5B6CFF",
                fontSize: "0.75rem",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              Book a call ↗
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
