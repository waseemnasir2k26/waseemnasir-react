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

const BOOKING = "https://skynetjoe.com/discovery-call";

const PALETTE = {
  bg: "#070A14",
  surface: "#0E1426",
  text: "#F2F5FF",
  muted: "#8A93B2",
  accent: "#5EEAD4",
  accent2: "#A78BFA",
};

const SERVICES = [
  {
    num: "01",
    title: "AI Automation Systems",
    body: "n8n pipelines that handle lead capture, follow-up sequences, and ops routing — without a human in the loop.",
  },
  {
    num: "02",
    title: "WhatsApp & Voice Bots",
    body: "Conversational agents that qualify leads and book calls while you're away. Live 24/7, costs a fraction of staff.",
  },
  {
    num: "03",
    title: "Next.js Builds",
    body: "Fast, AEO-ready web properties that rank in AI search and convert. Architected to scale without the agency overhead.",
  },
  {
    num: "04",
    title: "AEO & Visibility Systems",
    body: "Answer Engine Optimization: structured data, citation strategy, and content architecture so AI assistants cite you first.",
  },
];

const WORK = [
  {
    label: "Inspire Health PT",
    detail:
      "Full funnel — $27 tripwire + Stripe integration. Lead flow automated, zero missed bookings.",
    tag: "Healthcare · Funnel · Automation",
  },
  {
    label: "TakyCorp Email Engine",
    detail:
      "AI-driven outreach sequencer on top of Gmail. Fixed OOM + quota bugs. Rémi's pipeline back live.",
    tag: "SaaS · n8n · AI",
  },
  {
    label: "IdeaViaggi Trip System",
    detail:
      "Custom CPT + per-customer trip visibility via REST API. Hardened security, GDPR Ph2 compliant.",
    tag: "Travel · WordPress · REST",
  },
  {
    label: "FreightOps AI Receptionist",
    detail:
      "US + Singapore dual-geo Meta Ads. WhatsApp + voice bot combo. Live learning phase.",
    tag: "Logistics · Meta Ads · Voice AI",
  },
];

const PHOTOS = {
  hero: "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
  about: "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
  work1: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  work2: "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  work3: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  work4: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  life1: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  life2: "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
  life3: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  event: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
};

// Word reveal animation
function AuroraHeadline({ text, reduced }: { text: string; reduced: boolean }) {
  const words = text.split(" ");
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.14, delayChildren: 0.3 },
    },
  };
  const wordVariants = {
    hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    visible: {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      transition: { duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.h1
      className="ab-headline"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="ab-word-wrap">
          <motion.span className="ab-word" variants={wordVariants}>
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="ab-space"> </span>}
        </span>
      ))}
    </motion.h1>
  );
}

// Drifting aurora blob layer
function AuroraLayer({ reduced }: { reduced: boolean }) {
  return (
    <div className="ab-aurora-container" aria-hidden="true">
      <div className={`ab-blob ab-blob-1 ${reduced ? "ab-no-anim" : ""}`} />
      <div className={`ab-blob ab-blob-2 ${reduced ? "ab-no-anim" : ""}`} />
      <div className={`ab-blob ab-blob-3 ${reduced ? "ab-no-anim" : ""}`} />
    </div>
  );
}

// Count-up number
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVal(target);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
          start += step;
          if (start >= target) {
            setVal(target);
            clearInterval(interval);
          } else setVal(start);
        }, 22);
      },
      { threshold: 0.3 },
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

export default function AuroraBorealis() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const railScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Pointer tilt for hero portrait
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), {
    stiffness: 80,
    damping: 20,
  });
  const tiltY = useSpring(useTransform(mouseX, [-300, 300], [-4, 4]), {
    stiffness: 80,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <div className="root-36">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&family=Space+Mono:wght@400&display=swap');

        .root-36 {
          --bg: #070A14;
          --surface: #0E1426;
          --text: #F2F5FF;
          --muted: #8A93B2;
          --accent: #5EEAD4;
          --accent2: #A78BFA;
          --font-display: 'Instrument Serif', Georgia, serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'Space Mono', monospace;

          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          font-weight: 400;
          line-height: 1.6;
          min-height: 100vh;
          position: relative;
          z-index: 2;
          overflow-x: hidden;
        }

        /* ── Skip link ── */
        .root-36 .ab-skip {
          position: absolute;
          left: -9999px;
          top: 0;
          padding: 8px 16px;
          background: var(--accent);
          color: var(--bg);
          font-size: 14px;
          z-index: 9999;
        }
        .root-36 .ab-skip:focus { left: 16px; }

        /* ── Scroll rail ── */
        .root-36 .ab-rail {
          position: fixed;
          top: 0;
          right: 0;
          width: 2px;
          height: 100vh;
          background: rgba(94,234,212,0.08);
          z-index: 100;
        }
        .root-36 .ab-rail-inner {
          width: 100%;
          background: linear-gradient(to bottom, var(--accent), var(--accent2));
          transform-origin: top;
        }

        /* ── Aurora blobs ── */
        .root-36 .ab-aurora-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .root-36 .ab-blob {
          position: absolute;
          border-radius: 50%;
          mix-blend-mode: screen;
          filter: blur(90px);
          opacity: 0.28;
        }
        .root-36 .ab-blob-1 {
          width: 70vw;
          height: 55vw;
          background: radial-gradient(ellipse, #5EEAD4 0%, #0E7490 50%, transparent 80%);
          top: -15vw;
          left: -15vw;
          animation: aurora-drift-1 55s ease-in-out infinite alternate;
        }
        .root-36 .ab-blob-2 {
          width: 65vw;
          height: 50vw;
          background: radial-gradient(ellipse, #A78BFA 0%, #6D28D9 50%, transparent 80%);
          top: 10vw;
          right: -20vw;
          animation: aurora-drift-2 45s ease-in-out infinite alternate;
        }
        .root-36 .ab-blob-3 {
          width: 55vw;
          height: 45vw;
          background: radial-gradient(ellipse, #5EEAD4 0%, #A78BFA 40%, transparent 75%);
          bottom: 5vw;
          left: 20vw;
          animation: aurora-drift-3 60s ease-in-out infinite alternate;
        }
        .root-36 .ab-no-anim {
          animation: none !important;
        }

        @keyframes aurora-drift-1 {
          0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.28; }
          33%  { transform: translate(12vw, 8vw) scale(1.1) rotate(15deg); opacity: 0.32; }
          66%  { transform: translate(-5vw, 20vw) scale(0.95) rotate(-10deg); opacity: 0.24; }
          100% { transform: translate(20vw, 5vw) scale(1.15) rotate(25deg); opacity: 0.3; }
        }
        @keyframes aurora-drift-2 {
          0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.25; }
          40%  { transform: translate(-15vw, 12vw) scale(1.08) rotate(-20deg); opacity: 0.3; }
          80%  { transform: translate(-5vw, 25vw) scale(0.92) rotate(10deg); opacity: 0.22; }
          100% { transform: translate(-20vw, 8vw) scale(1.12) rotate(-30deg); opacity: 0.28; }
        }
        @keyframes aurora-drift-3 {
          0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.2; }
          50%  { transform: translate(10vw, -10vw) scale(1.2) rotate(20deg); opacity: 0.26; }
          100% { transform: translate(-8vw, -15vw) scale(0.88) rotate(-15deg); opacity: 0.18; }
        }

        /* ── Nav ── */
        .root-36 .ab-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 20px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(7,10,20,0.85) 0%, transparent 100%);
          backdrop-filter: blur(0px);
        }
        .root-36 .ab-nav-logo {
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.12em;
          color: var(--accent);
          text-decoration: none;
        }
        .root-36 .ab-nav-cta {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.1em;
          color: var(--bg);
          background: var(--accent);
          padding: 8px 20px;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.2s, color 0.2s;
        }
        .root-36 .ab-nav-cta:hover,
        .root-36 .ab-nav-cta:focus-visible {
          background: var(--accent2);
          outline: none;
        }

        /* ── Layout ── */
        .root-36 .ab-main {
          position: relative;
          z-index: 2;
        }
        .root-36 .ab-section {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .root-36 .ab-section-wide {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ── Hero ── */
        .root-36 .ab-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 120px;
          padding-bottom: 80px;
          position: relative;
        }
        .root-36 .ab-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .root-36 .ab-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: var(--accent);
          flex-shrink: 0;
        }
        .root-36 .ab-headline {
          font-family: var(--font-display);
          font-size: clamp(3.2rem, 8.5vw, 7.5rem);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--text);
          margin: 0 0 40px;
          position: relative;
        }
        /* Aurora light bleeds through text */
        .root-36 .ab-headline::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 60%, transparent 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.18;
          pointer-events: none;
          mix-blend-mode: screen;
          animation: aurora-text-drift 40s ease-in-out infinite alternate;
        }
        @keyframes aurora-text-drift {
          0%   { background-position: 0% 50%; opacity: 0.12; }
          50%  { background-position: 100% 50%; opacity: 0.22; }
          100% { background-position: 50% 100%; opacity: 0.15; }
        }
        .root-36 .ab-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 0.08em;
        }
        .root-36 .ab-word {
          display: inline-block;
        }
        .root-36 .ab-space { display: inline-block; width: 0.3em; }

        .root-36 .ab-subhead {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.06em;
          margin-bottom: 48px;
        }
        .root-36 .ab-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.1em;
          color: var(--bg);
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 2px;
          transition: opacity 0.2s, transform 0.2s;
        }
        .root-36 .ab-cta-primary:hover,
        .root-36 .ab-cta-primary:focus-visible {
          opacity: 0.88;
          transform: translateY(-1px);
          outline: none;
        }
        .root-36 .ab-cta-arrow {
          font-size: 16px;
          line-height: 1;
        }

        /* ── Hero portrait ── */
        .root-36 .ab-hero-portrait {
          position: absolute;
          right: -60px;
          bottom: 0;
          width: 380px;
          height: 560px;
          pointer-events: none;
        }
        .root-36 .ab-hero-portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          mask-image: linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 25%, black 60%, black 100%),
                      linear-gradient(to right, transparent 0%, black 40%);
          mask-composite: intersect;
          -webkit-mask-image: linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 25%, black 60%, black 100%),
                              linear-gradient(to right, transparent 0%, black 40%);
          -webkit-mask-composite: destination-in;
          opacity: 0.45;
        }
        .root-36 .ab-hero-portrait::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(94,234,212,0.1) 0%, rgba(167,139,250,0.08) 100%);
          mix-blend-mode: screen;
        }

        /* ── Divider ── */
        .root-36 .ab-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(94,234,212,0.2), rgba(167,139,250,0.2), transparent);
          margin: 0;
        }

        /* ── Proof numbers ── */
        .root-36 .ab-proof {
          padding: 80px 0;
        }
        .root-36 .ab-proof-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .root-36 .ab-proof-item {
          padding: 32px 0;
          border-right: 1px solid rgba(94,234,212,0.1);
          padding-right: 32px;
          padding-left: 8px;
        }
        .root-36 .ab-proof-item:first-child {
          padding-left: 0;
        }
        .root-36 .ab-proof-item:last-child {
          border-right: none;
        }
        .root-36 .ab-proof-num {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(2.8rem, 5vw, 4rem);
          color: var(--text);
          line-height: 1;
          margin-bottom: 8px;
          background: linear-gradient(135deg, var(--text) 40%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .root-36 .ab-proof-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ── Section headers ── */
        .root-36 .ab-section-header {
          display: flex;
          align-items: baseline;
          gap: 20px;
          margin-bottom: 56px;
        }
        .root-36 .ab-section-num {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--accent);
        }
        .root-36 .ab-section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 400;
          color: var(--text);
          margin: 0;
        }

        /* ── Services ── */
        .root-36 .ab-services {
          padding: 80px 0 100px;
        }
        .root-36 .ab-service-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .root-36 .ab-service-row {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 24px;
          padding: 36px 0;
          border-bottom: 1px solid rgba(242,245,255,0.06);
        }
        .root-36 .ab-service-row:first-child {
          border-top: 1px solid rgba(242,245,255,0.06);
        }
        .root-36 .ab-service-num {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent2);
          letter-spacing: 0.15em;
          padding-top: 6px;
        }
        .root-36 .ab-service-content {}
        .root-36 .ab-service-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 400;
          color: var(--text);
          margin: 0 0 10px;
        }
        .root-36 .ab-service-body {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.7;
          margin: 0;
          max-width: 520px;
        }

        /* ── Work gallery ── */
        .root-36 .ab-work {
          padding: 80px 0 100px;
          background: linear-gradient(to bottom, transparent, rgba(14,20,38,0.6) 20%, rgba(14,20,38,0.6) 80%, transparent);
        }
        .root-36 .ab-work-photos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 12px;
          margin-bottom: 64px;
        }
        .root-36 .ab-work-photo {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .root-36 .ab-work-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
          filter: saturate(0.8) brightness(0.75);
        }
        .root-36 .ab-work-photo:hover img {
          transform: scale(1.04);
          filter: saturate(1) brightness(0.85);
        }
        .root-36 .ab-work-photo-1 { height: 320px; }
        .root-36 .ab-work-photo-2 { height: 200px; }
        .root-36 .ab-work-photo-3 { height: 200px; }
        .root-36 .ab-work-photo-4 { height: 320px; }
        .root-36 .ab-work-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(94,234,212,0.05) 0%, rgba(167,139,250,0.05) 100%);
          mix-blend-mode: screen;
        }

        .root-36 .ab-work-cases {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .root-36 .ab-work-case {
          padding: 28px;
          background: rgba(14,20,38,0.8);
          border: 1px solid rgba(94,234,212,0.08);
          border-radius: 4px;
          backdrop-filter: blur(12px);
        }
        .root-36 .ab-work-case-label {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--text);
          margin: 0 0 10px;
        }
        .root-36 .ab-work-case-detail {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.65;
          margin: 0 0 16px;
        }
        .root-36 .ab-work-case-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: var(--accent2);
        }

        /* ── About / Life section ── */
        .root-36 .ab-about {
          padding: 100px 0;
        }
        .root-36 .ab-about-grid {
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 80px;
          align-items: start;
        }
        .root-36 .ab-about-text {}
        .root-36 .ab-about-body {
          font-size: 16px;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 24px;
        }
        .root-36 .ab-about-body strong {
          color: var(--text);
          font-weight: 500;
        }
        .root-36 .ab-about-detail {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--accent);
          letter-spacing: 0.1em;
          line-height: 2;
        }
        .root-36 .ab-about-detail a {
          color: var(--accent2);
          text-decoration: none;
        }
        .root-36 .ab-about-detail a:hover,
        .root-36 .ab-about-detail a:focus-visible {
          text-decoration: underline;
          outline: none;
        }
        .root-36 .ab-about-photos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .root-36 .ab-about-photo {
          overflow: hidden;
          border-radius: 2px;
        }
        .root-36 .ab-about-photo img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          filter: saturate(0.75) brightness(0.7);
          transition: filter 0.4s;
        }
        .root-36 .ab-about-photo:hover img {
          filter: saturate(1) brightness(0.85);
        }
        .root-36 .ab-about-photo-main {
          grid-column: 1 / -1;
        }
        .root-36 .ab-about-photo-main img {
          height: 360px;
        }

        /* ── CTA ── */
        .root-36 .ab-cta-section {
          padding: 120px 0 100px;
          text-align: center;
          position: relative;
        }
        .root-36 .ab-cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(94,234,212,0.06) 0%, rgba(167,139,250,0.04) 50%, transparent 80%);
          pointer-events: none;
          border-radius: 50%;
        }
        .root-36 .ab-cta-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 28px;
        }
        .root-36 .ab-cta-headline {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 400;
          color: var(--text);
          line-height: 1.15;
          margin: 0 0 48px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }
        .root-36 .ab-cta-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .root-36 .ab-cta-secondary {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-decoration: none;
          padding: 14px 24px;
          border: 1px solid rgba(138,147,178,0.2);
          border-radius: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .root-36 .ab-cta-secondary:hover,
        .root-36 .ab-cta-secondary:focus-visible {
          color: var(--accent2);
          border-color: var(--accent2);
          outline: none;
        }

        /* ── Footer ── */
        .root-36 .ab-footer {
          padding: 40px 0;
          border-top: 1px solid rgba(242,245,255,0.06);
        }
        .root-36 .ab-footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .root-36 .ab-footer-left {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.1em;
        }
        .root-36 .ab-footer-left span {
          color: var(--accent);
        }
        .root-36 .ab-footer-right {
          display: flex;
          gap: 24px;
        }
        .root-36 .ab-footer-link {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .root-36 .ab-footer-link:hover,
        .root-36 .ab-footer-link:focus-visible {
          color: var(--accent);
          outline: none;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .root-36 .ab-nav { padding: 16px 24px; }
          .root-36 .ab-section { padding: 0 24px; }
          .root-36 .ab-section-wide { padding: 0 24px; }
          .root-36 .ab-proof-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
          .root-36 .ab-proof-item { border-right: none; padding: 0; }
          .root-36 .ab-work-cases { grid-template-columns: 1fr; }
          .root-36 .ab-about-grid { grid-template-columns: 1fr; gap: 48px; }
          .root-36 .ab-hero-portrait { display: none; }
        }
        @media (max-width: 600px) {
          .root-36 .ab-proof-grid { grid-template-columns: 1fr 1fr; }
          .root-36 .ab-work-photos { grid-template-columns: 1fr; }
          .root-36 .ab-work-photo-1,
          .root-36 .ab-work-photo-2,
          .root-36 .ab-work-photo-3,
          .root-36 .ab-work-photo-4 { height: 220px; }
          .root-36 .ab-cta-headline { font-size: 2rem; }
          .root-36 .ab-about-photos { grid-template-columns: 1fr; }
          .root-36 .ab-about-photo-main { grid-column: 1; }
        }
      `}</style>

      <a href="#main-content" className="ab-skip">
        Skip to content
      </a>

      {/* Scroll rail */}
      <div className="ab-rail" aria-hidden="true">
        <motion.div className="ab-rail-inner" style={{ scaleY: railScaleY }} />
      </div>

      {/* Aurora background */}
      <AuroraLayer reduced={reduced} />

      {/* Nav */}
      <nav className="ab-nav" aria-label="Main navigation">
        <a href="/" className="ab-nav-logo" aria-label="SkynetLabs home">
          SKYNETLABS
        </a>
        <a
          href={BOOKING}
          className="ab-nav-cta"
          aria-label="Book a discovery call"
        >
          BOOK A CALL
        </a>
      </nav>

      <main id="main-content" className="ab-main">
        {/* ── HERO ── */}
        <section className="ab-hero" aria-labelledby="hero-heading">
          <div className="ab-section">
            <motion.div
              className="ab-eyebrow"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, ease: "easeOut" }}
            >
              Waseem Nasir / SkynetLabs
            </motion.div>

            <AuroraHeadline
              text="I build the systems that run while you sleep."
              reduced={reduced}
            />

            <motion.p
              className="ab-subhead"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.7, delay: 1.4 }}
            >
              Since 2019 — 180+ builds, 40+ clients, 9 countries.
            </motion.p>

            <motion.a
              href={BOOKING}
              className="ab-cta-primary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: 1.8 }}
              aria-label="Book a 30-minute discovery call"
            >
              Book 30 min{" "}
              <span className="ab-cta-arrow" aria-hidden="true">
                →
              </span>
            </motion.a>
          </div>

          {/* Ghosted portrait — desktop only */}
          <motion.div
            className="ab-hero-portrait"
            onMouseMove={handleMouseMove}
            style={{ rotateX: tiltX, rotateY: tiltY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 1.2, delay: 0.5 }}
            aria-hidden="true"
          >
            <img src={`/img/pro/${PHOTOS.hero}`} alt="" draggable={false} />
          </motion.div>
        </section>

        <div className="ab-divider" />

        {/* ── PROOF NUMBERS ── */}
        <section className="ab-proof" aria-label="Proof numbers">
          <div className="ab-section">
            <div className="ab-proof-grid">
              {[
                { n: 180, suffix: "+", label: "Builds shipped" },
                { n: 40, suffix: "+", label: "Clients served" },
                { n: 9, suffix: "", label: "Countries worked from" },
                { n: 2019, suffix: "", label: "Operating since" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="ab-proof-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: reduced ? 0 : 0.6 }}
                >
                  <div className="ab-proof-num">
                    <CountUp target={item.n} suffix={item.suffix} />
                  </div>
                  <div className="ab-proof-label">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="ab-divider" />

        {/* ── SERVICES ── */}
        <section className="ab-services" aria-labelledby="services-heading">
          <div className="ab-section">
            <div className="ab-section-header">
              <span className="ab-section-num">// 01</span>
              <h2 id="services-heading" className="ab-section-title">
                What I build
              </h2>
            </div>

            <div className="ab-service-list" role="list">
              {SERVICES.map((svc, i) => (
                <motion.div
                  key={svc.num}
                  className="ab-service-row"
                  role="listitem"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: reduced ? 0 : 0.55, delay: i * 0.08 }}
                >
                  <div className="ab-service-num" aria-hidden="true">
                    {svc.num}
                  </div>
                  <div className="ab-service-content">
                    <h3 className="ab-service-title">{svc.title}</h3>
                    <p className="ab-service-body">{svc.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WORK ── */}
        <section className="ab-work" aria-labelledby="work-heading">
          <div className="ab-section-wide">
            <div className="ab-section-header">
              <span className="ab-section-num">// 02</span>
              <h2 id="work-heading" className="ab-section-title">
                Selected builds
              </h2>
            </div>

            <div className="ab-work-photos" aria-hidden="true">
              {[
                {
                  photo: PHOTOS.work1,
                  cls: "ab-work-photo-1",
                  alt: "Analytics dashboard on dual laptops at cafe",
                },
                {
                  photo: PHOTOS.work2,
                  cls: "ab-work-photo-2",
                  alt: "Focused at coworking desk",
                },
                {
                  photo: PHOTOS.work3,
                  cls: "ab-work-photo-3",
                  alt: "Working at Bali terrace cafe",
                },
                {
                  photo: PHOTOS.work4,
                  cls: "ab-work-photo-4",
                  alt: "Night coding session at backlit keyboard",
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  className={`ab-work-photo ${p.cls}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduced ? 0 : 0.7, delay: i * 0.1 }}
                >
                  <img src={`/img/pro/${p.photo}`} alt={p.alt} loading="lazy" />
                  <div className="ab-work-photo-overlay" />
                </motion.div>
              ))}
            </div>

            <div className="ab-work-cases">
              {WORK.map((w, i) => (
                <motion.div
                  key={w.label}
                  className="ab-work-case"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: reduced ? 0 : 0.5, delay: i * 0.07 }}
                >
                  <h3 className="ab-work-case-label">{w.label}</h3>
                  <p className="ab-work-case-detail">{w.detail}</p>
                  <div className="ab-work-case-tag">{w.tag}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="ab-about" aria-labelledby="about-heading">
          <div className="ab-section-wide">
            <div className="ab-about-grid">
              <div className="ab-about-text">
                <div className="ab-section-header">
                  <span className="ab-section-num">// 03</span>
                  <h2 id="about-heading" className="ab-section-title">
                    The operator
                  </h2>
                </div>

                <p className="ab-about-body">
                  <strong>I'm Waseem.</strong> Independent founder of
                  SkynetLabs. I don't run an agency — I'm a solo builder who
                  goes deep on a small number of problems: missed leads, dead
                  follow-ups, manual ops that should be automated.
                </p>
                <p className="ab-about-body">
                  Seven years building across{" "}
                  <strong>
                    n8n, Next.js, WhatsApp bots, voice agents, AEO
                  </strong>{" "}
                  — and the systems I build keep running long after the
                  engagement ends. Remote from Bali, Lahore, wherever the wifi
                  holds.
                </p>

                <div className="ab-about-detail">
                  <div>LOCATION — Bali / Lahore / remote anywhere</div>
                  <div>SINCE — 2019</div>
                  <div>
                    GITHUB —{" "}
                    <a
                      href="https://github.com/waseemnasir2k26"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/waseemnasir2k26
                    </a>
                  </div>
                </div>
              </div>

              <div className="ab-about-photos" aria-hidden="true">
                <div className="ab-about-photo ab-about-photo-main">
                  <img
                    src={`/img/pro/${PHOTOS.about}`}
                    alt="Waseem Nasir standing outside a glass building in beige tracksuit"
                    loading="lazy"
                  />
                </div>
                <div className="ab-about-photo">
                  <img
                    src={`/img/pro/${PHOTOS.life2}`}
                    alt="Relaxed evening at night cafe, armchair"
                    loading="lazy"
                  />
                </div>
                <div className="ab-about-photo">
                  <img
                    src={`/img/pro/${PHOTOS.life1}`}
                    alt="At Nusa Penida cliffs, arms spread"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional life photos band */}
        <div className="ab-section-wide" style={{ paddingBottom: "80px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            {[
              {
                photo: PHOTOS.life3,
                alt: "Hilltop with backpack, city vista in background",
              },
              { photo: PHOTOS.event, alt: "Bali coworking group meetup" },
              {
                photo:
                  "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                alt: "Rooftop working session, dragonfruit smoothie, smiling",
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                style={{ overflow: "hidden", borderRadius: "2px" }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduced ? 0 : 0.55, delay: i * 0.1 }}
              >
                <img
                  src={`/img/pro/${p.photo}`}
                  alt={p.alt}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    display: "block",
                    filter: "saturate(0.75) brightness(0.7)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="ab-cta-section" aria-labelledby="cta-heading">
          <div className="ab-cta-glow" aria-hidden="true" />
          <div className="ab-section">
            <motion.div
              className="ab-cta-eyebrow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduced ? 0 : 0.6 }}
            >
              // 04 — Let's work
            </motion.div>
            <motion.h2
              id="cta-heading"
              className="ab-cta-headline"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduced ? 0 : 0.7, delay: 0.1 }}
            >
              Thirty minutes to know if it's a fit.
            </motion.h2>
            <motion.div
              className="ab-cta-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduced ? 0 : 0.6, delay: 0.25 }}
            >
              <a
                href={BOOKING}
                className="ab-cta-primary"
                aria-label="Book a 30-minute discovery call"
              >
                Book discovery call{" "}
                <span className="ab-cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href="https://github.com/waseemnasir2k26"
                className="ab-cta-secondary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View GitHub profile"
              >
                GitHub
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="ab-footer">
          <div className="ab-section">
            <div className="ab-footer-inner">
              <div className="ab-footer-left">
                <span>SKYNETLABS</span> — Waseem Nasir © 2019–
                {new Date().getFullYear()}
              </div>
              <nav className="ab-footer-right" aria-label="Footer navigation">
                <a href={BOOKING} className="ab-footer-link">
                  Book a call
                </a>
                <a
                  href="https://github.com/waseemnasir2k26"
                  className="ab-footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="mailto:waseembali2k26@gmail.com"
                  className="ab-footer-link"
                >
                  Email
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
