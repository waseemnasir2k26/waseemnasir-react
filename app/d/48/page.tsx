"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

// ─── Terracotta Review — Design 48 ─────────────────────────────────────────
// Warm editorial / New Yorker long-read meets 2026 warm palette.
// Single-column 66ch measure, marginalia anchored to paragraphs,
// Bodoni Moda display, Newsreader body, Didone hairlines.
// Award-tier upgrades: paper grain, cinematic hero overlay, slide-reveal
// work gallery, animated pull-quote rule, inline marginalia fallback,
// editorial proof strip, drop-cap uppercase fix, CTA card re-skin.

const C = {
  bg: "#EDE3D3",
  surface: "#F7EFE2",
  paper: "#FAF4EA",
  text: "#241C15",
  muted: "#8A7A67",
  accent: "#A8552F",
  accent2: "#4B6358",
  hairline: "rgba(36,28,21,0.15)",
};

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,400&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=IBM+Plex+Mono:wght@400&display=swap";

// ─── Reading-progress hook ──────────────────────────────────────────────────
function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

// ─── Marginalia note ───────────────────────────────────────────────────────
// On desktop: floats in left gutter. On mobile: inline callout below paragraph.
function Marginalia({
  children,
  reduced,
  inline = false,
}: {
  children: React.ReactNode;
  reduced: boolean;
  inline?: boolean;
}) {
  return (
    <motion.aside
      className={
        inline ? "d48-marginalia d48-marginalia--inline" : "d48-marginalia"
      }
      initial={reduced ? false : { opacity: 0, x: inline ? 0 : -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      aria-label="Editorial note"
    >
      {children}
    </motion.aside>
  );
}

// ─── Pull-quote — with animated rule ──────────────────────────────────────
function PullQuote({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  return (
    <div className="d48-pull-wrap">
      <motion.div
        className="d48-pull-rule"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.blockquote
        className="d48-pull"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
      >
        {children}
      </motion.blockquote>
      <motion.div
        className="d48-pull-rule d48-pull-rule--bottom"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// ─── Drop cap — always uppercase ─────────────────────────────────────────
function DropCap({ children }: { children: string }) {
  const trimmed = children.trimStart();
  const first = trimmed[0].toUpperCase();
  const rest = trimmed.slice(1);
  return (
    <p className="d48-body d48-body--dropcap">
      <span className="d48-dropcap" aria-hidden="true">
        {first}
      </span>
      <span className="d48-dropcap-sr">{first}</span>
      {rest}
    </p>
  );
}

// ─── Count-up ──────────────────────────────────────────────────────────────
function CountUp({
  target,
  suffix = "",
  reduced,
}: {
  target: number;
  suffix?: string;
  reduced: boolean;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reduced) {
      setVal(target);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const dur = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, reduced]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ─── Work card with hover caption reveal ─────────────────────────────────
function WorkCard({
  src,
  alt,
  caption,
  tags,
  delay,
  reduced,
}: {
  src: string;
  alt: string;
  caption: string;
  tags: string[];
  delay: number;
  reduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="d48-work-item"
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="figure"
      aria-label={caption}
    >
      <div className="d48-work-img-wrap">
        <img
          src={`/img/pro/${src}`}
          alt={alt}
          className="d48-work-img"
          style={{
            transform: hovered && !reduced ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <AnimatePresence>
          {hovered && !reduced && (
            <motion.div
              className="d48-work-overlay"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
            >
              <p className="d48-work-overlay-caption">{caption}</p>
              <div className="d48-work-overlay-tags">
                {tags.map((t) => (
                  <span key={t} className="d48-tag d48-tag--light">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="d48-work-meta">
        {tags.map((t) => (
          <span key={t} className="d48-tag">
            {t}
          </span>
        ))}
        <p className="d48-work-caption">{caption}</p>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function TerracottaReview() {
  const reduced = useReducedMotion() ?? false;
  const progress = useReadingProgress();
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 700], [0, -90]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 1.06]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.6]);

  return (
    <div className="root-48">
      {/* ── Font preconnect + import ── */}
      <style>{`
        @import url('${FONT_URL}');

        /* Reset within scope */
        .root-48 *, .root-48 *::before, .root-48 *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ── Root shell ── */
        .root-48 {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          background: ${C.bg};
          color: ${C.text};
          font-family: 'Newsreader', Georgia, serif;
          font-size: 19px;
          line-height: 1.72;
          -webkit-font-smoothing: antialiased;
        }

        /* Paper grain overlay — covers entire page */
        .root-48::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* Reading-progress hairline */
        .d48-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, ${C.accent}, ${C.accent2});
          z-index: 500;
          transform-origin: left;
          transition: width 0.08s linear;
        }

        /* ── Navigation bar ── */
        .d48-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 150;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 52px;
          background: ${C.bg}f0;
          backdrop-filter: blur(8px) saturate(140%);
          border-bottom: 0.5px solid ${C.hairline};
        }

        .d48-nav-logo {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: ${C.text};
          text-decoration: none;
          letter-spacing: 0.01em;
        }

        .d48-nav-right {
          display: flex;
          align-items: center;
          gap: 1.8rem;
        }

        .d48-nav-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.muted};
          text-decoration: none;
          transition: color 0.2s;
        }
        .d48-nav-link:hover { color: ${C.accent}; }
        .d48-nav-link:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
          border-radius: 2px;
        }
        .d48-nav-cta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${C.bg};
          background: ${C.accent};
          text-decoration: none;
          padding: 0.42rem 1.1rem;
          border: 1px solid ${C.accent};
          transition: background 0.2s, color 0.2s;
        }
        .d48-nav-cta:hover {
          background: transparent;
          color: ${C.accent};
        }
        .d48-nav-cta:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
        }

        /* ── Masthead rules ── */
        .d48-masthead-rule {
          border: none;
          border-top: 2px solid ${C.text};
          margin: 0;
        }
        .d48-masthead-thin {
          border: none;
          border-top: 0.5px solid ${C.hairline};
          margin: 0;
        }

        /* Issue line */
        .d48-issue {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.67rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${C.muted};
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 2rem;
        }

        /* ── Hero section ── */
        .d48-hero { padding: 3rem 0 0; }

        /* Content column + gutter layout */
        .d48-layout {
          display: grid;
          grid-template-columns: 1fr min(66ch, 100%) 1fr;
          column-gap: 0;
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .d48-gutter-left {
          grid-column: 1;
          padding-right: 2rem;
          position: relative;
        }
        .d48-gutter-right { grid-column: 3; padding-left: 2rem; }
        .d48-main { grid-column: 2; min-width: 0; }

        /* ── Headline ── */
        .d48-headline {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: clamp(2.6rem, 5.8vw, 4.8rem);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: -0.018em;
          color: ${C.text};
          margin-bottom: 1.25rem;
        }

        .d48-subhead {
          font-family: 'Newsreader', Georgia, serif;
          font-size: 1.13rem;
          font-style: italic;
          color: ${C.muted};
          line-height: 1.56;
          margin-bottom: 2rem;
        }

        .d48-byline {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.muted};
          border-top: 0.5px solid ${C.hairline};
          padding-top: 0.8rem;
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .d48-byline span { color: ${C.accent}; }

        /* ── Hero image — cinematic full-bleed with warm overlay ── */
        .d48-hero-frame {
          position: relative;
          overflow: hidden;
          margin: 2.5rem 0 0;
        }

        .d48-hero-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }

        /* warm gradient scrim bottom-up — editorial captioning space */
        .d48-hero-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(36,28,21,0.55) 0%,
            rgba(36,28,21,0.18) 38%,
            transparent 65%
          );
          pointer-events: none;
        }

        /* warm amber dust overlay */
        .d48-hero-dust {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 70% 40%,
            rgba(168,85,47,0.08) 0%,
            transparent 65%
          );
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .d48-hero-caption-float {
          position: absolute;
          bottom: 1.25rem;
          left: 2rem;
          right: 2rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
        }

        .d48-hero-caption-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.63rem;
          letter-spacing: 0.1em;
          color: rgba(250,244,234,0.82);
          text-transform: uppercase;
          border-left: 1.5px solid ${C.accent};
          padding-left: 0.7rem;
        }

        .d48-hero-caption-loc {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: 0.78rem;
          font-style: italic;
          color: rgba(250,244,234,0.65);
          white-space: nowrap;
        }

        /* ── Body text ── */
        .d48-body {
          font-family: 'Newsreader', Georgia, serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: ${C.text};
          margin-bottom: 1.45em;
          font-feature-settings: "onum" 1, "kern" 1, "liga" 1;
        }

        /* Drop cap */
        .d48-body--dropcap { overflow: hidden; }

        .d48-dropcap {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: 5.2em;
          font-weight: 700;
          float: left;
          line-height: 0.79;
          margin: 0.08em 0.07em -0.04em 0;
          color: ${C.accent};
          /* Proper Didone display sizing */
          padding-top: 0.05em;
        }
        /* SR reads the letter once; aria-hidden on visual dropcap */
        .d48-dropcap-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        /* ── Section divider ── */
        .d48-section-divider {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin: 3.2rem 0;
        }
        .d48-section-divider::before,
        .d48-section-divider::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: ${C.hairline};
        }
        .d48-section-divider span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.63rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${C.muted};
          white-space: nowrap;
        }

        /* Ornamental section divider — three diamonds */
        .d48-ornament {
          text-align: center;
          margin: 3rem 0;
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: 0.85rem;
          letter-spacing: 0.6em;
          color: ${C.muted}90;
          user-select: none;
        }

        /* ── Section headings ── */
        .d48-h2 {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          line-height: 1.16;
          color: ${C.text};
          margin-bottom: 1.2rem;
          letter-spacing: -0.012em;
        }

        .d48-h3 {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: 1.22rem;
          font-weight: 700;
          color: ${C.text};
          margin-bottom: 0.55rem;
          margin-top: 2.2rem;
        }

        /* ── Marginalia ── */
        .d48-marginalia {
          font-family: 'Newsreader', Georgia, serif;
          font-size: 0.8rem;
          line-height: 1.58;
          color: ${C.muted};
          font-style: italic;
          border-left: 1.5px solid ${C.accent}65;
          padding-left: 0.9rem;
          margin-bottom: 2.5rem;
          max-width: 20ch;
        }

        /* Inline variant — shown on mobile */
        .d48-marginalia--inline {
          display: none;
          max-width: 100%;
          background: ${C.surface};
          border-left: 2px solid ${C.accent};
          padding: 0.8rem 1rem;
          margin: 0 0 1.8rem;
          border-radius: 0 2px 2px 0;
        }

        /* ── Pull quote ── */
        .d48-pull-wrap {
          margin: 3rem 0;
        }

        .d48-pull-rule {
          height: 2px;
          background: ${C.accent};
          transform-origin: left;
        }
        .d48-pull-rule--bottom {
          height: 0.5px;
          background: ${C.hairline};
          transform-origin: left;
          margin-top: 1.25rem;
        }

        .d48-pull {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: clamp(1.18rem, 2.5vw, 1.6rem);
          font-weight: 400;
          font-style: italic;
          line-height: 1.4;
          color: ${C.accent};
          padding: 1.3rem 0 0;
          quotes: none;
        }

        /* ── Proof strip ── */
        .d48-proof {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 2px solid ${C.text};
          margin: 2rem 0 3rem;
        }

        .d48-proof-item {
          padding: 2rem 1.4rem 1.8rem;
          border-right: 0.5px solid ${C.hairline};
          position: relative;
        }
        .d48-proof-item:last-child { border-right: none; }

        .d48-proof-num {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700;
          color: ${C.accent};
          line-height: 1;
          display: block;
          margin-bottom: 0.4rem;
        }

        .d48-proof-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.61rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${C.muted};
          display: block;
          line-height: 1.4;
        }

        /* thin rule above label */
        .d48-proof-item::after {
          content: '';
          display: block;
          width: 24px;
          height: 0.5px;
          background: ${C.muted}50;
          margin: 0.6rem 0 0;
        }

        /* ── Services list ── */
        .d48-service-list { list-style: none; margin: 1.5rem 0; }

        .d48-service-item {
          display: flex;
          align-items: flex-start;
          gap: 1.1rem;
          padding: 1.2rem 0;
          border-bottom: 0.5px solid ${C.hairline};
          font-family: 'Newsreader', Georgia, serif;
          font-size: 1rem;
          line-height: 1.6;
          color: ${C.text};
        }

        .d48-service-bullet {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: 1.1rem;
          color: ${C.accent};
          flex-shrink: 0;
          margin-top: 0.08em;
          user-select: none;
        }

        .d48-service-name {
          font-weight: 700;
          font-size: 0.97rem;
          font-family: 'Bodoni Moda', Georgia, serif;
          display: block;
          margin-bottom: 0.22rem;
          letter-spacing: -0.005em;
        }

        /* ── Work gallery ── */
        .d48-work-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
          margin: 2rem 0;
        }

        .d48-work-item {
          position: relative;
          outline: none;
          cursor: default;
        }
        .d48-work-item:focus-visible {
          box-shadow: 0 0 0 2px ${C.accent};
        }

        .d48-work-img-wrap {
          position: relative;
          overflow: hidden;
        }

        .d48-work-img {
          width: 100%;
          display: block;
          object-fit: cover;
          aspect-ratio: 4/3;
          will-change: transform;
        }

        /* Hover overlay */
        .d48-work-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(36,28,21,0.82) 0%, rgba(36,28,21,0.2) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.1rem;
        }

        .d48-work-overlay-caption {
          font-family: 'Newsreader', Georgia, serif;
          font-size: 0.88rem;
          font-style: italic;
          color: ${C.paper};
          line-height: 1.45;
          margin-bottom: 0.5rem;
        }

        .d48-work-overlay-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }

        .d48-work-meta { margin-top: 0.65rem; }

        .d48-work-caption {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.61rem;
          letter-spacing: 0.08em;
          color: ${C.muted};
          margin-top: 0.3rem;
          text-transform: uppercase;
        }

        /* ── About section ── */
        .d48-about {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          align-items: start;
          margin: 2rem 0 3rem;
        }

        .d48-about-img {
          width: 100%;
          display: block;
          object-fit: cover;
          aspect-ratio: 3/4;
          filter: sepia(10%) saturate(88%);
        }
        .d48-about-text .d48-body { margin-bottom: 1.2em; }

        /* Locations */
        .d48-locations {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: ${C.muted};
          text-transform: uppercase;
          margin-top: 1.5rem;
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .d48-locations span { color: ${C.accent2}; }

        /* ── CTA — classified-ad style ── */
        .d48-cta-wrap {
          position: relative;
          background: ${C.text};
          padding: 3.5rem 2.8rem;
          margin: 3rem 0;
        }

        /* warm amber corner accent */
        .d48-cta-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 4px; height: 100%;
          background: ${C.accent};
        }

        .d48-cta-overline {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.66rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${C.accent};
          margin-bottom: 1.1rem;
        }

        .d48-cta-heading {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: clamp(1.5rem, 3.5vw, 2.4rem);
          font-weight: 700;
          line-height: 1.14;
          color: ${C.paper};
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }

        .d48-cta-body {
          font-family: 'Newsreader', Georgia, serif;
          font-size: 1rem;
          font-style: italic;
          color: rgba(250,244,234,0.65);
          max-width: 48ch;
          margin-bottom: 2.2rem;
          line-height: 1.65;
        }

        .d48-cta-btn {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${C.text};
          background: ${C.paper};
          text-decoration: none;
          padding: 0.9rem 2.6rem;
          border: 1px solid ${C.paper};
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .d48-cta-btn:hover {
          background: transparent;
          color: ${C.paper};
          border-color: ${C.paper}80;
        }
        .d48-cta-btn:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
        }

        /* ── Inline link ── */
        .d48-link {
          color: ${C.accent};
          text-decoration: underline;
          text-decoration-thickness: 0.5px;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }
        .d48-link:hover { color: ${C.accent2}; }
        .d48-link:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 2px;
          border-radius: 1px;
        }

        /* ── Mono tag ── */
        .d48-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.accent2};
          background: ${C.accent2}18;
          padding: 0.18rem 0.5rem;
          margin-right: 0.4rem;
          margin-bottom: 0.35rem;
          display: inline-block;
        }

        .d48-tag--light {
          color: ${C.paper};
          background: rgba(250,244,234,0.18);
        }

        /* ── Wide image ── */
        .d48-wide-img {
          width: 100%;
          display: block;
          object-fit: cover;
          object-position: center 40%;
        }

        /* ── Travel strip ── */
        .d48-travel-strip {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1240px;
          margin: 0 auto 3rem;
        }

        /* ── Photo triptych ── */
        .d48-triptych {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.85rem;
          margin: 2rem 0 1rem;
        }

        .d48-img-caption {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.63rem;
          letter-spacing: 0.08em;
          color: ${C.muted};
          margin-top: 0.5rem;
          padding-left: 0.6rem;
          border-left: 1.5px solid ${C.accent}60;
        }

        /* ── Footer ── */
        .d48-footer {
          border-top: 2px solid ${C.text};
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 1240px;
          margin: 0 auto;
        }

        .d48-footer-logo {
          font-family: 'Bodoni Moda', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: ${C.text};
          text-decoration: none;
        }

        .d48-footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }

        .d48-footer-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.64rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.muted};
          text-decoration: none;
          transition: color 0.2s;
        }
        .d48-footer-link:hover { color: ${C.accent}; }
        .d48-footer-link:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 2px;
          border-radius: 1px;
        }

        .d48-footer-copy {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.61rem;
          color: ${C.muted};
          letter-spacing: 0.06em;
        }

        /* ── Responsive ── */
        @media (max-width: 1000px) {
          .d48-layout {
            grid-template-columns: 0 1fr 0;
            padding: 0 1.25rem;
          }
          .d48-gutter-left, .d48-gutter-right { display: none; }
          .d48-main { grid-column: 2; }
          .d48-marginalia--inline { display: block; }
          .d48-about { grid-template-columns: 1fr; gap: 1.5rem; }
          .d48-about-img { aspect-ratio: 16/9; object-position: center 20%; }
          .d48-proof { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .root-48 { font-size: 17px; }
          .d48-work-grid { grid-template-columns: 1fr; }
          .d48-triptych { grid-template-columns: 1fr 1fr; }
          .d48-proof { grid-template-columns: 1fr 1fr; }
          .d48-issue { flex-direction: column; align-items: flex-start; gap: 0.3rem; }
          .d48-cta-wrap { padding: 2.5rem 1.5rem; }
          .d48-footer { flex-direction: column; align-items: flex-start; }
          .d48-travel-strip { grid-template-columns: 1fr; }
          .d48-nav-right .d48-nav-link { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .d48-progress { transition: none; }
          .d48-work-img { transition: none !important; }
        }
      `}</style>

      {/* Skip nav */}
      <a
        href="#main-content"
        className="d48-link"
        style={{ position: "absolute", left: "-9999px", top: "1rem" }}
      >
        Skip to main content
      </a>

      {/* Reading-progress hairline */}
      <div
        className="d48-progress"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />

      {/* ── Nav ── */}
      <nav className="d48-nav" aria-label="Site navigation">
        <a href="/" className="d48-nav-logo">
          Waseem Nasir
        </a>
        <div className="d48-nav-right">
          <a href="https://skynetjoe.com" className="d48-nav-link">
            SkynetLabs
          </a>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="d48-nav-cta"
            aria-label="Book a discovery call"
          >
            Book a call
          </a>
        </div>
      </nav>

      {/* ── Masthead ── */}
      <header style={{ paddingTop: "52px" }}>
        <div className="d48-issue">
          <span>SkynetLabs&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2019</span>
          <span>Vol. I — On Founders &amp; Machines</span>
        </div>
        <hr className="d48-masthead-rule" />
        <hr className="d48-masthead-thin" style={{ marginTop: "3px" }} />
      </header>

      {/* ── Main ── */}
      <main id="main-content">
        {/* ── Hero ── */}
        <section className="d48-hero" aria-labelledby="hero-headline">
          <div className="d48-layout">
            <div className="d48-gutter-left">
              <Marginalia reduced={reduced}>
                Written in Bali, edited in Lahore — filed from wherever the
                coffee is good.
              </Marginalia>
            </div>

            <div className="d48-main">
              <motion.h1
                id="hero-headline"
                className="d48-headline"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                Why I&rsquo;d rather automate the boring parts than hire around
                them.
              </motion.h1>

              <motion.p
                className="d48-subhead"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
              >
                A founder writing since 2019 — 180+ builds, 40+ clients, 9
                countries.
              </motion.p>

              <motion.div
                className="d48-byline"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.52 }}
              >
                <div>
                  By <span>Waseem Nasir</span>
                </div>
                <div>
                  SkynetLabs · <span>Independent Founder</span>
                </div>
                <div>AI Systems &amp; Automation</div>
              </motion.div>
            </div>

            <div className="d48-gutter-right" />
          </div>

          {/* Cinematic hero image */}
          <motion.div
            className="d48-hero-frame"
            style={
              reduced
                ? undefined
                : { y: heroParallax, scale: heroScale, opacity: heroOpacity }
            }
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.35 }}
          >
            <img
              src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
              alt="Waseem Nasir typing on a laptop at a Bali terrace cafe, sunglasses on, latte beside him"
              className="d48-hero-img"
            />
            <div className="d48-hero-scrim" aria-hidden="true" />
            <div className="d48-hero-dust" aria-hidden="true" />
            <div className="d48-hero-caption-float" aria-hidden="true">
              <span className="d48-hero-caption-text">
                Canggu, Bali — the usual office
              </span>
              <span className="d48-hero-caption-loc">June 2026</span>
            </div>
          </motion.div>
        </section>

        {/* ── Essay body ── */}
        <section aria-labelledby="essay-section">
          <div className="d48-layout">
            <div className="d48-gutter-left">
              <Marginalia reduced={reduced}>
                The first build in 2019 was a Zapier zap that saved four hours a
                week. Still running.
              </Marginalia>
              <Marginalia reduced={reduced}>
                n8n replaced three Zapier plans. The ROI conversation is short.
              </Marginalia>
              <Marginalia reduced={reduced}>
                Nine countries. The work doesn&rsquo;t change. Only the coffee
                quality does.
              </Marginalia>
            </div>

            <div className="d48-main">
              {/* Inline marginalia for mobile */}
              <Marginalia reduced={reduced} inline>
                The first build in 2019 was a Zapier zap that saved four hours a
                week. Still running.
              </Marginalia>

              <DropCap>
                {
                  "There is a version of the story founders tell themselves: hire for the gap. Find someone who does the thing you don't have time for, pay them a salary, and the problem disappears. I ran that experiment in year one. The problem didn't disappear — it migrated."
                }
              </DropCap>

              <p className="d48-body">
                The issue isn&rsquo;t people. People are fine. The issue is that
                most of the gap that founders want to close is made of
                repetition — of tasks that run on the same logic every single
                time. And repetition is the one thing a machine never gets tired
                of.
              </p>

              <PullQuote reduced={reduced}>
                &ldquo;Most of what founders call a people problem is actually a
                process problem wearing a costume.&rdquo;
              </PullQuote>

              <p className="d48-body">
                Since 2019 I&rsquo;ve shipped over 180 builds — automation
                systems, AI voice bots, WhatsApp agents, lead-capture pipelines,
                AEO-tuned content engines — for clients across 9 countries. The
                pattern is consistent: a founder is losing time to something
                that runs on a rule. Qualify leads. Follow up at 24 hours. Pull
                a weekly report. Route a support ticket. The work is
                predictable. The person doing it is not optimally deployed.
              </p>

              <p className="d48-body">
                What I build replaces the rule-work. Not the judgment, not the
                relationship — just the rule-work. What&rsquo;s left is the
                founder&rsquo;s actual leverage: thinking, choosing, building
                trust with clients, deciding what to build next.
              </p>

              <div className="d48-ornament" aria-hidden="true">
                ◆ ◆ ◆
              </div>

              <p className="d48-body">
                The tools I reach for — <strong>n8n</strong> for workflow
                orchestration, <strong>Next.js</strong> for product surfaces,{" "}
                <strong>AEO</strong> for AI-era search presence, WhatsApp and
                voice APIs for human-feeling bots — are not interesting in
                themselves. What&rsquo;s interesting is the question underneath:
                what is the smallest system that removes the biggest drag on
                this particular business?
              </p>

              <p className="d48-body">
                That question doesn&rsquo;t have a template answer. Forty-plus
                clients means forty-plus different answers. A PT clinic in New
                York needed missed-call recovery. A freight logistics company in
                Singapore needed a 24-hour WhatsApp intake. A content agency in
                Lahore needed a pipeline that turned rough notes into polished
                drafts. Same tool, different problem, different configuration.
              </p>
            </div>

            <div className="d48-gutter-right" />
          </div>
        </section>

        {/* ── Proof strip ── */}
        <section aria-labelledby="proof-heading">
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "0 1.5rem",
            }}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2
                id="proof-heading"
                className="d48-h2"
                style={{ marginBottom: "0.2rem", marginTop: "3rem" }}
              >
                The record.
              </h2>
              <p
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: "0.93rem",
                  color: C.muted,
                  fontStyle: "italic",
                  marginBottom: "0.5rem",
                }}
              >
                First-party numbers — never inflated.
              </p>
            </motion.div>

            <div className="d48-proof">
              {[
                { n: 180, suf: "+", label: "Builds shipped" },
                { n: 40, suf: "+", label: "Clients served" },
                { n: 9, suf: "", label: "Countries" },
                { n: 2019, suf: "", label: "Operating since" },
              ].map((item, i) => (
                <motion.div
                  className="d48-proof-item"
                  key={item.label}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: "easeOut",
                  }}
                >
                  <span className="d48-proof-num">
                    <CountUp
                      target={item.n}
                      suffix={item.suf}
                      reduced={reduced}
                    />
                  </span>
                  <span className="d48-proof-label">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section aria-labelledby="services-heading">
          <div className="d48-layout">
            <div className="d48-gutter-left">
              <Marginalia reduced={reduced}>
                Everything here is composable — one system often unlocks the
                next.
              </Marginalia>
            </div>

            <div className="d48-main">
              <Marginalia reduced={reduced} inline>
                Everything here is composable — one system often unlocks the
                next.
              </Marginalia>

              <div className="d48-section-divider" aria-hidden="true">
                <span>What I build</span>
              </div>

              <h2 id="services-heading" className="d48-h2">
                The systems, plainly named.
              </h2>

              <p className="d48-body">
                I don&rsquo;t sell retainers for retainer&rsquo;s sake. Each of
                these is a system that pays for itself in recovered time or
                recovered revenue within the first quarter.
              </p>

              <ul className="d48-service-list">
                {[
                  {
                    name: "AI Automation & n8n Orchestration",
                    desc: "Multi-step workflows that connect your tools, fire on triggers, and never drop the ball on follow-ups.",
                  },
                  {
                    name: "WhatsApp & Voice AI Bots",
                    desc: "24-hour intake, qualification, and nurture over the channels your clients already use — no app install required.",
                  },
                  {
                    name: "AEO Content Systems",
                    desc: "Answer-engine-optimised pages that put your name in AI search results before competitors figure out the game has changed.",
                  },
                  {
                    name: "Next.js Product Builds",
                    desc: "Fast, type-safe web products — landing pages, portals, dashboards — deployed on infrastructure that doesn't fall over.",
                  },
                  {
                    name: "Lead Capture & CRM Integration",
                    desc: "From first click to qualified call — automatic. No leads lost to slow follow-up or missed notifications.",
                  },
                  {
                    name: "Ops Audits & Architecture",
                    desc: "A structured read of where your manual hours are going, followed by a build roadmap that prioritises highest-return wins first.",
                  },
                ].map((svc, i) => (
                  <motion.li
                    key={svc.name}
                    className="d48-service-item"
                    initial={reduced ? false : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.42,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <span className="d48-service-bullet" aria-hidden="true">
                      —
                    </span>
                    <div>
                      <span className="d48-service-name">{svc.name}</span>
                      {svc.desc}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="d48-gutter-right" />
          </div>
        </section>

        {/* ── Selected work ── */}
        <section aria-labelledby="work-heading">
          <div className="d48-layout">
            <div className="d48-gutter-left">
              <Marginalia reduced={reduced}>
                These are working systems. Not decks, not prototypes — deployed
                and billing.
              </Marginalia>
            </div>

            <div className="d48-main">
              <Marginalia reduced={reduced} inline>
                These are working systems. Not decks, not prototypes — deployed
                and billing.
              </Marginalia>

              <div className="d48-section-divider" aria-hidden="true">
                <span>Selected work</span>
              </div>

              <h2 id="work-heading" className="d48-h2">
                Some of what shipped.
              </h2>

              <div className="d48-work-grid">
                {[
                  {
                    src: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
                    alt: "Waseem reviewing analytics dashboards on dual laptops over coffee",
                    caption: "Analytics automation — dual-pipeline n8n build",
                    tags: ["n8n", "Analytics"],
                  },
                  {
                    src: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
                    alt: "Waseem at coworking desk, focused on phone — candid",
                    caption:
                      "WhatsApp bot deployment — Singapore client intake",
                    tags: ["WhatsApp AI", "Lead ops"],
                  },
                  {
                    src: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                    alt: "Waseem checking phone at Bali rice terrace, powerbank in hand",
                    caption: "AEO content engine — 40+ pages auto-generated",
                    tags: ["AEO", "Next.js"],
                  },
                  {
                    src: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                    alt: "Waseem and client at cafe, both smiling and giving thumbs up",
                    caption: "Client delivery — PT clinic $27 funnel + stripe",
                    tags: ["Funnel", "WP"],
                  },
                ].map((item, i) => (
                  <WorkCard
                    key={item.src}
                    src={item.src}
                    alt={item.alt}
                    caption={item.caption}
                    tags={item.tags}
                    delay={i * 0.08}
                    reduced={reduced}
                  />
                ))}
              </div>

              <PullQuote reduced={reduced}>
                &ldquo;The goal is always the same: make the business operate
                well when you&rsquo;re asleep. Everything else is
                elaboration.&rdquo;
              </PullQuote>

              <h3 className="d48-h3">
                On working remotely from nine countries.
              </h3>
              <p className="d48-body">
                The practical effect of working from Bali, Lahore, Singapore,
                and everywhere in between is not romance — it&rsquo;s
                discipline. There&rsquo;s no standing meeting to coast on, no
                hallway conversation to substitute for clarity, no office to
                signal presence. What you have is the work and the deadline. For
                clients this is unexpectedly good news: the communication is
                written, the deliverables are specific, and the timezone gap is
                usually closed with async updates before they wake up.
              </p>

              <p className="d48-body">
                What it also produces is a certain indifference to the myth that
                creative work requires a particular geography. Good automation
                architecture looks the same whether I&rsquo;m writing it in a
                Canggu cafe or a Lahore co-working space. The code doesn&rsquo;t
                know where it was written. Only the commit timestamp does.
              </p>
            </div>

            <div className="d48-gutter-right" />
          </div>
        </section>

        {/* ── Wide scenic image ── */}
        <section aria-label="Travel photography">
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            style={{ margin: "2.5rem 0 0", position: "relative" }}
          >
            <img
              src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
              alt="Waseem on Nusa Penida cliff edge, arms spread, dramatic ocean view"
              className="d48-wide-img"
              style={{ aspectRatio: "21/9", objectPosition: "center 35%" }}
            />
            {/* warm overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(168,85,47,0.12) 0%, transparent 50%)",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />
          </motion.div>
          <div className="d48-layout">
            <div className="d48-gutter-left" />
            <div className="d48-main">
              <p
                className="d48-img-caption"
                style={{ marginTop: "0.6rem", marginBottom: "2rem" }}
              >
                Nusa Penida, Indonesia — one of the nine.
              </p>
            </div>
            <div className="d48-gutter-right" />
          </div>
        </section>

        {/* ── About ── */}
        <section aria-labelledby="about-heading">
          <div className="d48-layout">
            <div className="d48-gutter-left">
              <Marginalia reduced={reduced}>
                &ldquo;Founder-as-writer&rdquo; is not a pose. Everything I ship
                starts with a brief written in plain language.
              </Marginalia>
            </div>

            <div className="d48-main">
              <Marginalia reduced={reduced} inline>
                &ldquo;Founder-as-writer&rdquo; is not a pose. Everything I ship
                starts with a brief written in plain language.
              </Marginalia>

              <div className="d48-section-divider" aria-hidden="true">
                <span>About</span>
              </div>

              <div className="d48-about">
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                >
                  <img
                    src="/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg"
                    alt="Waseem Nasir in black kurta, soft smile, wood interior background"
                    className="d48-about-img"
                  />
                </motion.div>

                <div className="d48-about-text">
                  <h2 id="about-heading" className="d48-h2">
                    Waseem Nasir.
                  </h2>
                  <p className="d48-body">
                    Independent founder. Builder. I run{" "}
                    <strong>SkynetLabs</strong> — a one-person shop that designs
                    and deploys AI and automation systems for founders who are
                    serious about removing friction from their operations.
                  </p>
                  <p className="d48-body">
                    I started in 2019, before &ldquo;AI automation&rdquo; was a
                    LinkedIn category. The first few years were consulting —
                    understanding how businesses actually break before I had
                    opinions about how to fix them. The following years were
                    building — 180+ systems, shipped, running, billable.
                  </p>
                  <p className="d48-body">
                    I write about what I notice along the way: the gap between
                    what automation promises and what it delivers, why most CRMs
                    are coffins for good intentions, and what it actually takes
                    to make a business run when the founder stops being in the
                    room.
                  </p>

                  <div className="d48-locations">
                    <div>
                      Currently: <span>Bali / Lahore</span>
                    </div>
                    <div>
                      GitHub:{" "}
                      <a
                        href="https://github.com/waseemnasir2k26"
                        className="d48-link"
                        aria-label="Waseem's GitHub profile"
                      >
                        waseemnasir2k26
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo triptych */}
              <div className="d48-triptych">
                {[
                  {
                    src: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                    alt: "Waseem on hilltop with backpack and sunglasses, city vista below",
                  },
                  {
                    src: "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
                    alt: "Waseem smiling at laptop in garden cafe, blue polo shirt",
                  },
                  {
                    src: "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
                    alt: "Waseem in armchair at night cafe, relaxed gaze",
                  },
                ].map((img, i) => (
                  <motion.img
                    key={img.src}
                    src={`/img/pro/${img.src}`}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      aspectRatio: "3/4",
                      filter: "sepia(8%) saturate(88%)",
                    }}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              <PullQuote reduced={reduced}>
                &ldquo;Nine countries, 180 builds, one consistent finding: the
                founders who free themselves first, grow fastest.&rdquo;
              </PullQuote>
            </div>

            <div className="d48-gutter-right" />
          </div>
        </section>

        {/* ── Travel strip ── */}
        <section aria-label="Field photography">
          <div className="d48-travel-strip">
            {[
              {
                src: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                alt: "Rooftop cafe with laptop, mountain and clouds in background",
                pos: "center 40%",
              },
              {
                src: "PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
                alt: "Waseem smiling in Bali rice field, palms and mountain backdrop",
                pos: "center 30%",
              },
            ].map((img) => (
              <motion.img
                key={img.src}
                src={`/img/pro/${img.src}`}
                alt={img.alt}
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                  objectPosition: img.pos,
                  aspectRatio: "4/3",
                }}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.75, ease: "easeOut" }}
              />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section aria-labelledby="cta-heading">
          <div className="d48-layout">
            <div className="d48-gutter-left" />
            <div className="d48-main">
              <motion.div
                className="d48-cta-wrap"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                <p className="d48-cta-overline">
                  Thirty minutes. No pitch deck.
                </p>
                <h2 id="cta-heading" className="d48-cta-heading">
                  Let&rsquo;s talk about what&rsquo;s eating your hours.
                </h2>
                <p className="d48-cta-body">
                  If you&rsquo;re spending recurring time on something a system
                  could handle, that&rsquo;s a solvable problem. We can scope it
                  in a single call.
                </p>
                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="d48-cta-btn"
                  aria-label="Book a 30-minute discovery call with Waseem"
                >
                  Book a 30-minute call
                </a>
              </motion.div>
            </div>
            <div className="d48-gutter-right" />
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="d48-footer">
        <a
          href="/"
          className="d48-footer-logo"
          aria-label="Waseem Nasir homepage"
        >
          Waseem Nasir
        </a>
        <nav aria-label="Footer navigation" className="d48-footer-links">
          <a href="https://skynetjoe.com" className="d48-footer-link">
            SkynetLabs
          </a>
          <a
            href="https://github.com/waseemnasir2k26"
            className="d48-footer-link"
            aria-label="GitHub profile"
          >
            GitHub
          </a>
          <a
            href="https://skynetjoe.com/discovery-call"
            className="d48-footer-link"
          >
            Book a call
          </a>
        </nav>
        <span className="d48-footer-copy">
          &copy; {new Date().getFullYear()} SkynetLabs. Est. 2019.
        </span>
      </footer>
    </div>
  );
}
