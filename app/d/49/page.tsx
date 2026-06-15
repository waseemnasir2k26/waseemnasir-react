"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ── Font injection ─────────────────────────────────────────────────── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";

/* ── Palette ────────────────────────────────────────────────────────── */
const C = {
  bg: "#0A0B0F",
  surface: "#13141A",
  elevated: "#1C1D26",
  text: "#F0F0F2",
  muted: "#6B6B7A",
  subtler: "#3A3A4A",
  accent: "#7C5CFF",
  accentDim: "rgba(124,92,255,0.12)",
  accentBorder: "rgba(124,92,255,0.22)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.1)",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.1)",
};

/* ── Command items ──────────────────────────────────────────────────── */
type CmdAction = "scroll" | "link" | "toggle";

interface CmdItem {
  id: string;
  label: string;
  shortcut?: string;
  group: string;
  action: CmdAction;
  icon: string;
  href?: string;
  preview?: {
    heading: string;
    body: string;
    tag?: string;
  };
}

const COMMANDS: CmdItem[] = [
  {
    id: "n1",
    group: "Navigate",
    label: "About me",
    icon: "person",
    action: "scroll",
    shortcut: "A",
    href: "#about",
    preview: {
      heading: "Waseem Nasir",
      body: "Independent founder of SkynetLabs. Shipping automation and AI systems since 2019 across 9 countries.",
      tag: "builder",
    },
  },
  {
    id: "n2",
    group: "Navigate",
    label: "Services",
    icon: "grid",
    action: "scroll",
    shortcut: "S",
    href: "#services",
    preview: {
      heading: "6 core services",
      body: "AI voice bots, n8n automation, Next.js builds, AEO, lead funnels, follow-up resurrection.",
      tag: "what I do",
    },
  },
  {
    id: "n3",
    group: "Navigate",
    label: "Selected work",
    icon: "work",
    action: "scroll",
    shortcut: "W",
    href: "#work",
    preview: {
      heading: "4 live clients",
      body: "FreightOps, InspireHealth PT, IdeaViaggi, TakyCorp — real results, real systems.",
      tag: "proof",
    },
  },
  {
    id: "n4",
    group: "Navigate",
    label: "Stats & proof",
    icon: "chart",
    action: "scroll",
    shortcut: "P",
    href: "#proof",
    preview: {
      heading: "180+ · 40+ · 9 · 2019",
      body: "Builds shipped · clients served · countries · operating since.",
      tag: "numbers",
    },
  },
  {
    id: "n5",
    group: "Navigate",
    label: "Book a discovery call",
    icon: "call",
    action: "link",
    shortcut: "⏎",
    href: "https://skynetjoe.com/discovery-call",
    preview: {
      heading: "30-min free call",
      body: "Describe the bottleneck. I'll tell you exactly how to automate it. No sales pitch, no fluff.",
      tag: "CTA",
    },
  },
  {
    id: "s1",
    group: "Services",
    label: "AI voice + WhatsApp bots",
    icon: "bot",
    action: "scroll",
    href: "#services",
    preview: {
      heading: "Conversational AI",
      body: "Missed leads answered, qualified, and booked while you sleep — without a human touching anything.",
      tag: "conversational AI",
    },
  },
  {
    id: "s2",
    group: "Services",
    label: "n8n workflow automation",
    icon: "flow",
    action: "scroll",
    href: "#services",
    preview: {
      heading: "Workflow ops",
      body: "CRM updates, invoice chasing, onboarding sequences — all wired and running without manual trigger.",
      tag: "workflow ops",
    },
  },
  {
    id: "s3",
    group: "Services",
    label: "Next.js product builds",
    icon: "code",
    action: "scroll",
    href: "#services",
    preview: {
      heading: "Full-stack",
      body: "React + TypeScript + Vercel. Your idea ships in weeks, not quarters.",
      tag: "full-stack",
    },
  },
  {
    id: "s4",
    group: "Services",
    label: "AEO & AI search visibility",
    icon: "search",
    action: "scroll",
    href: "#services",
    preview: {
      heading: "AEO",
      body: "When someone asks ChatGPT or Perplexity in your space, your name shows up. By design.",
      tag: "AEO",
    },
  },
  {
    id: "s5",
    group: "Services",
    label: "Lead capture funnels",
    icon: "funnel",
    action: "scroll",
    href: "#services",
    preview: {
      heading: "Growth",
      body: "Page → opt-in → sequence → booked call. Tight, conversion-tested, integrated with your stack.",
      tag: "growth",
    },
  },
  {
    id: "s6",
    group: "Services",
    label: "Dead follow-up resurrection",
    icon: "revive",
    action: "scroll",
    href: "#services",
    preview: {
      heading: "Retention",
      body: "You left money in your inbox. Automated follow-up re-engages cold leads before a competitor does.",
      tag: "retention",
    },
  },
  {
    id: "l1",
    group: "Links",
    label: "GitHub",
    icon: "link",
    action: "link",
    shortcut: "G",
    href: "https://github.com/waseemnasir2k26",
    preview: {
      heading: "github.com/waseemnasir2k26",
      body: "Open source tools, Chrome extensions, automation scripts, and client repos.",
      tag: "external",
    },
  },
  {
    id: "l2",
    group: "Links",
    label: "skynetjoe.com",
    icon: "globe",
    action: "link",
    href: "https://skynetjoe.com",
    preview: {
      heading: "SkynetLabs HQ",
      body: "Full service menu, case studies, and discovery call booking on the main site.",
      tag: "external",
    },
  },
];

/* ── Icon SVGs ──────────────────────────────────────────────────────── */
function CmdIcon({ type, size = 14 }: { type: string; size?: number }) {
  const s = size;
  const icons: Record<string, JSX.Element> = {
    person: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    grid: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="1.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="9.5"
          y="1.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="1.5"
          y="9.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="9.5"
          y="9.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    work: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="5.5"
          width="13"
          height="9"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M5.5 5.5V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    chart: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 14L6 9l3 3 5-8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    call: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <path
          d="M3.5 2.5C3.5 2.5 2 3 2 5c0 5 4 9 9 9 2 0 2.5-1.5 2.5-1.5l-2-2-1.5 1s-2-1-3-2-2-3-2-3l1-1.5-2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bot: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="5"
          width="12"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M5.5 9h.01M10.5 9h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 2v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="1.5" r="0.5" fill="currentColor" />
        <path
          d="M0 9h2M14 9h2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    flow: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <circle cx="3" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle
          cx="13"
          cy="4"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="8"
          cy="12"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4.5 4h7M3 5.5v5M13 5.5v3.5a2 2 0 0 1-2 2H9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    code: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <path
          d="M5 4L1 8l4 4M11 4l4 4-4 4M9 2L7 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    search: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <circle
          cx="6.5"
          cy="6.5"
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 10l3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    funnel: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 3h12l-4.5 5.5V13l-3-1.5V8.5L2 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    revive: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <path
          d="M2.5 8A5.5 5.5 0 1 0 8 2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M2.5 4.5V8h3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    link: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <path
          d="M6.5 9.5a4 4 0 0 0 5.657 0l1.414-1.414a4 4 0 0 0-5.657-5.657L6.5 3.843"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9.5 6.5a4 4 0 0 0-5.657 0L2.429 7.914a4 4 0 0 0 5.657 5.657L9.5 12.157"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    globe: (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 8h12M8 2c-1.5 2-2 4-2 6s.5 4 2 6M8 2c1.5 2 2 4 2 6s-.5 4-2 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  };
  return icons[type] ?? <span style={{ fontSize: size * 0.9 }}>◈</span>;
}

/* ── Fuzzy match ────────────────────────────────────────────────────── */
function fuzzyMatch(
  str: string,
  query: string,
): { matched: boolean; positions: number[] } {
  if (!query) return { matched: true, positions: [] };
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  const positions: number[] = [];
  let si = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = s.indexOf(q[qi], si);
    if (idx === -1) return { matched: false, positions: [] };
    positions.push(idx);
    si = idx + 1;
  }
  return { matched: true, positions };
}

function HighlightedText({
  text,
  positions,
}: {
  text: string;
  positions: number[];
}) {
  if (!positions.length) return <span>{text}</span>;
  const posSet = new Set(positions);
  return (
    <span>
      {text.split("").map((ch, i) =>
        posSet.has(i) ? (
          <span key={i} style={{ color: C.accent, fontWeight: 600 }}>
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  );
}

/* ── Section data ───────────────────────────────────────────────────── */
const SERVICES = [
  {
    title: "AI Voice + WhatsApp Bots",
    body: "Your phone rings while you sleep. Missed leads answered, qualified, booked — without a human touching anything.",
    tag: "conversational AI",
  },
  {
    title: "n8n Workflow Automation",
    body: "The manual ops killing your margin? Gone. CRM updates, invoice chasing, onboarding sequences — all wired.",
    tag: "workflow ops",
  },
  {
    title: "Next.js Product Builds",
    body: "From spec to deployed. React + TypeScript + Vercel. Your idea ships in weeks, not quarters.",
    tag: "full-stack",
  },
  {
    title: "AEO & AI Search Visibility",
    body: "When someone asks ChatGPT or Perplexity in your space, your name shows up. Not someday — by design.",
    tag: "AEO",
  },
  {
    title: "Lead Capture Funnels",
    body: "Page → opt-in → sequence → booked call. Tight, conversion-tested, integrated with whatever stack you run.",
    tag: "growth",
  },
  {
    title: "Dead Follow-Up Resurrection",
    body: "You left money in your inbox. Automated follow-up re-engages cold leads before a competitor does.",
    tag: "retention",
  },
];

const WORK = [
  {
    client: "FreightOps",
    result: "AI voice receptionist handles 100% inbound dispatch calls",
    geo: "US",
    img: "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  },
  {
    client: "InspireHealth PT",
    result: "Stripe funnel + Zocdoc booking bot → $27 care-plan live",
    geo: "US",
    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
  },
  {
    client: "IdeaViaggi",
    result: "Custom CPT + per-customer trip visibility system",
    geo: "IT",
    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  },
  {
    client: "TakyCorp",
    result: "Gmail automation engine, 0 outages post v2 patch",
    geo: "FR",
    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  },
];

const STATS = [
  { value: "180+", label: "builds shipped" },
  { value: "40+", label: "clients served" },
  { value: "9", label: "countries worked from" },
  { value: "2019", label: "operating since" },
];

const GALLERY_IMGS = [
  "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
  "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
  "LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
  "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
  "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
  "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
];

/* ── Typed prompt ───────────────────────────────────────────────────── */
function TypingPrompt({
  lines,
  speed = 40,
}: {
  lines: string[];
  speed?: number;
}) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? lines.join("") : "");
  const full = lines.join("");

  useEffect(() => {
    if (reduced) return;
    setDisplayed("");
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [full, speed, reduced]);

  const done = displayed.length === full.length;
  return (
    <span>
      {displayed}
      <motion.span
        animate={!done ? {} : { opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: C.accent,
          marginLeft: "2px",
          verticalAlign: "text-bottom",
        }}
      />
    </span>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
export default function Page49() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [activePreview, setActivePreview] = useState<CmdItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = COMMANDS.map((cmd) => {
    const { matched, positions } = fuzzyMatch(cmd.label, query);
    return { cmd, matched, positions };
  }).filter((r) => r.matched);

  const grouped: Record<string, typeof filtered> = {};
  for (const r of filtered) {
    if (!grouped[r.cmd.group]) grouped[r.cmd.group] = [];
    grouped[r.cmd.group].push(r);
  }

  const flatFiltered = filtered;

  // Keep preview in sync with active item
  useEffect(() => {
    const item = flatFiltered[activeIdx];
    setActivePreview(item?.cmd.preview ? item.cmd : null);
  }, [activeIdx, flatFiltered]);

  const handleSelect = useCallback((item: CmdItem) => {
    if (item.href) {
      if (item.action === "scroll") {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setPaletteOpen(false);
      } else {
        window.open(item.href, "_blank", "noopener");
      }
    }
    setQuery("");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        setTimeout(() => inputRef.current?.focus(), 50);
        return;
      }
      if (!paletteOpen) return;
      if (e.key === "Escape") {
        setPaletteOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const sel = flatFiltered[activeIdx];
        if (sel) handleSelect(sel.cmd);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, flatFiltered, activeIdx, handleSelect]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(
      `[data-idx="${activeIdx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const openPalette = () => {
    setPaletteOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const spring = { type: "spring", stiffness: 500, damping: 32, mass: 0.8 };

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        *, *::before, *::after { box-sizing: border-box; }

        .root-49 {
          font-family: 'Inter', sans-serif;
          background: ${C.bg};
          color: ${C.text};
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Fine dot grid */
        .root-49::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(124,92,255,0.12) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* Ambient glow at top */
        .root-49::after {
          content: '';
          position: fixed;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(124,92,255,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .r49-display { font-family: 'Space Grotesk', sans-serif; }
        .r49-mono { font-family: 'JetBrains Mono', monospace; }

        /* ── Backdrop ── */
        .r49-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10,11,15,0.80);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: clamp(80px, 14vh, 160px);
          padding-left: 16px;
          padding-right: 16px;
        }

        /* ── Palette container (split) ── */
        .r49-palette-wrap {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
          max-width: 860px;
        }

        /* ── Palette box ── */
        .r49-palette {
          flex: 1;
          min-width: 0;
          max-width: 560px;
          background: ${C.surface};
          border: 1px solid rgba(124,92,255,0.2);
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(124,92,255,0.06),
            0 8px 32px rgba(0,0,0,0.5),
            0 40px 80px rgba(0,0,0,0.4),
            0 0 80px rgba(124,92,255,0.06);
        }

        /* ── Preview panel ── */
        .r49-preview {
          width: 260px;
          flex-shrink: 0;
          background: ${C.surface};
          border: 1px solid ${C.border};
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 140px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        @media (max-width: 720px) {
          .r49-preview { display: none; }
          .r49-palette { max-width: 100%; }
        }

        .r49-preview-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.green};
          background: ${C.greenDim};
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 100px;
          padding: 3px 10px;
          display: inline-block;
          width: fit-content;
        }

        .r49-preview-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: ${C.text};
          line-height: 1.3;
        }

        .r49-preview-body {
          font-size: 12px;
          color: ${C.muted};
          line-height: 1.65;
        }

        /* ── Input row ── */
        .r49-input-row {
          display: flex;
          align-items: center;
          padding: 0 18px;
          border-bottom: 1px solid ${C.border};
          gap: 12px;
        }

        .r49-input-icon {
          display: flex;
          align-items: center;
          color: ${C.muted};
          flex-shrink: 0;
        }

        .r49-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: ${C.text};
          font-family: 'Inter', sans-serif;
          font-size: 14.5px;
          padding: 17px 0;
          caret-color: ${C.accent};
        }

        .r49-input::placeholder { color: ${C.muted}; }

        .r49-kbd-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: ${C.muted};
          background: rgba(255,255,255,0.04);
          border: 1px solid ${C.border};
          border-radius: 5px;
          padding: 2px 7px;
          flex-shrink: 0;
        }

        /* ── Results ── */
        .r49-results {
          max-height: 340px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(124,92,255,0.25) transparent;
          padding: 6px 0;
        }

        .r49-group-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.subtler};
          padding: 10px 18px 3px;
        }

        .r49-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 18px;
          cursor: pointer;
          list-style: none;
          position: relative;
          transition: background 0.08s;
        }

        .r49-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: ${C.accent};
          opacity: 0;
          transition: opacity 0.1s;
          border-radius: 0 2px 2px 0;
        }

        .r49-item:hover,
        .r49-item[data-active="true"] {
          background: ${C.accentDim};
        }

        .r49-item[data-active="true"]::before {
          opacity: 1;
        }

        .r49-item-icon {
          color: ${C.muted};
          display: flex;
          align-items: center;
          flex-shrink: 0;
          width: 18px;
          transition: color 0.1s;
        }

        .r49-item[data-active="true"] .r49-item-icon,
        .r49-item:hover .r49-item-icon {
          color: ${C.accent};
        }

        .r49-item-label {
          flex: 1;
          font-size: 13.5px;
          color: ${C.text};
        }

        .r49-item-shortcut {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: ${C.subtler};
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 1px 6px;
        }

        /* ── Palette footer ── */
        .r49-palette-footer {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 9px 18px;
          border-top: 1px solid ${C.border};
          background: rgba(255,255,255,0.015);
        }

        .r49-foot-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: ${C.subtler};
        }

        .r49-foot-kbd {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 3px;
          padding: 1px 5px;
          font-size: 9px;
        }

        /* ── Hero ── */
        .r49-hero {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          gap: 22px;
        }

        .r49-prompt-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(124,92,255,0.06);
          border: 1px solid ${C.accentBorder};
          border-radius: 8px;
          padding: 6px 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: ${C.accent};
          letter-spacing: 0.04em;
        }

        .r49-prompt-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${C.accent};
          opacity: 0.7;
        }

        .r49-hero-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(30px, 5.5vw, 64px);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.04em;
          color: ${C.text};
          max-width: 700px;
          margin: 0;
        }

        .r49-hero-h1 .accent { color: ${C.accent}; }

        .r49-hero-sub {
          font-size: 15px;
          color: ${C.muted};
          max-width: 500px;
          line-height: 1.65;
        }

        .r49-hero-sub strong { color: ${C.text}; font-weight: 500; }

        .r49-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: ${C.accent};
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          padding: 12px 26px;
          border-radius: 8px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: filter 0.2s, transform 0.15s;
        }

        .r49-cta-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .r49-cta-btn:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 3px; }

        .r49-palette-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid ${C.accentBorder};
          color: ${C.muted};
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
        }

        .r49-palette-btn:hover {
          background: ${C.accentDim};
          color: ${C.text};
          border-color: rgba(124,92,255,0.45);
        }

        .r49-trigger-kbd {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 10.5px;
        }

        /* ── Stats ── */
        .r49-section-wrap {
          position: relative;
          z-index: 1;
          padding: 80px 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .r49-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: ${C.surface};
          border: 1px solid ${C.accentBorder};
          border-radius: 14px;
          overflow: hidden;
        }

        @media (max-width: 600px) {
          .r49-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .r49-stat-cell {
          padding: 36px 24px;
          border-right: 1px solid ${C.border};
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .r49-stat-cell:last-child { border-right: none; }

        @media (max-width: 600px) {
          .r49-stat-cell:nth-child(2) { border-right: none; }
          .r49-stat-cell:nth-child(3) { border-top: 1px solid ${C.border}; }
          .r49-stat-cell:nth-child(4) { border-top: 1px solid ${C.border}; border-right: none; }
        }

        .r49-stat-val {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 44px;
          font-weight: 600;
          color: ${C.text};
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .r49-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${C.muted};
        }

        /* ── Section heading ── */
        .r49-section-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.accent};
          margin-bottom: 10px;
        }

        .r49-section-h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(22px, 3.5vw, 36px);
          font-weight: 600;
          color: ${C.text};
          margin: 0 0 44px;
          letter-spacing: -0.03em;
        }

        /* ── Services grid ── */
        .r49-services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(124,92,255,0.07);
          border: 1px solid ${C.accentBorder};
          border-radius: 14px;
          overflow: hidden;
        }

        @media (max-width: 740px) {
          .r49-services-grid { grid-template-columns: 1fr; }
        }

        .r49-service-card {
          background: ${C.surface};
          padding: 26px 22px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          transition: background 0.18s;
        }

        .r49-service-card:hover { background: rgba(124,92,255,0.06); }

        .r49-service-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${C.green};
        }

        .r49-service-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: ${C.text};
        }

        .r49-service-body {
          font-size: 12.5px;
          color: ${C.muted};
          line-height: 1.65;
        }

        /* ── Work cards ── */
        .r49-work-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (max-width: 600px) {
          .r49-work-grid { grid-template-columns: 1fr; }
        }

        .r49-work-card {
          border: 1px solid ${C.border};
          border-radius: 12px;
          overflow: hidden;
          background: ${C.surface};
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .r49-work-card:hover {
          border-color: ${C.accentBorder};
          box-shadow: 0 4px 24px rgba(124,92,255,0.08);
        }

        .r49-work-img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          display: block;
        }

        .r49-work-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .r49-work-geo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: ${C.accent};
          text-transform: uppercase;
        }

        .r49-work-client {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: ${C.text};
        }

        .r49-work-result {
          font-size: 12.5px;
          color: ${C.muted};
          line-height: 1.55;
        }

        /* ── About ── */
        .r49-about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }

        @media (max-width: 740px) {
          .r49-about-grid { grid-template-columns: 1fr; gap: 36px; }
        }

        .r49-about-imgs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .r49-about-img {
          border-radius: 8px;
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }

        .r49-about-img-tall {
          border-radius: 8px;
          width: 100%;
          aspect-ratio: 3/5;
          object-fit: cover;
          grid-row: span 2;
        }

        .r49-about-text {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .r49-about-p {
          font-size: 14.5px;
          color: ${C.muted};
          line-height: 1.75;
        }

        .r49-about-p strong { color: ${C.text}; font-weight: 500; }

        .r49-tag-row { display: flex; flex-wrap: wrap; gap: 7px; }

        .r49-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: ${C.green};
          background: ${C.greenDim};
          border: 1px solid rgba(52,211,153,0.18);
          border-radius: 100px;
          padding: 3px 11px;
        }

        /* ── CTA section ── */
        .r49-cta-section {
          position: relative;
          z-index: 1;
          padding: 100px 24px 120px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .r49-cta-h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(26px, 4.5vw, 54px);
          font-weight: 600;
          letter-spacing: -0.04em;
          color: ${C.text};
          max-width: 560px;
          margin: 0;
          line-height: 1.1;
        }

        .r49-cta-h2 .accent { color: ${C.accent}; }

        .r49-cta-sub {
          font-size: 14.5px;
          color: ${C.muted};
          max-width: 420px;
          line-height: 1.65;
        }

        .r49-cmd-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
        }

        .r49-cmd-hint-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: ${C.subtler};
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Divider ── */
        .r49-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(124,92,255,0.15), transparent);
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* ── Footer ── */
        .r49-footer {
          position: relative;
          z-index: 1;
          padding: 36px 24px;
          border-top: 1px solid ${C.border};
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .r49-footer-brand {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: ${C.text};
        }

        .r49-footer-links { display: flex; gap: 22px; }

        .r49-footer-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          color: ${C.muted};
          text-decoration: none;
          transition: color 0.15s;
        }

        .r49-footer-link:hover { color: ${C.text}; }
        .r49-footer-link:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 3px; border-radius: 2px; }

        /* ── No results ── */
        .r49-no-results {
          padding: 28px 20px;
          text-align: center;
          color: ${C.muted};
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
        }

        /* ── Scroll indicator ── */
        .r49-scroll-hint {
          position: absolute;
          bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .r49-scroll-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${C.subtler};
        }

        .r49-scroll-line {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, ${C.accent}, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .r49-service-card,
          .r49-work-card,
          .r49-cta-btn,
          .r49-palette-btn { transition: none !important; }
        }
      `}</style>

      <div className="root-49">
        {/* Skip link */}
        <a
          href="#main-content"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 4,
            background: C.accent,
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 4,
            fontSize: 13,
            zIndex: 9999,
            textDecoration: "none",
          }}
        >
          Skip to main content
        </a>

        {/* ── Command Palette ──────────────────────────────────────── */}
        <AnimatePresence>
          {paletteOpen && (
            <motion.div
              className="r49-backdrop"
              initial={reduced ? {} : { opacity: 0 }}
              animate={reduced ? {} : { opacity: 1 }}
              exit={reduced ? {} : { opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setPaletteOpen(false);
              }}
              role="dialog"
              aria-label="Command palette"
              aria-modal="true"
            >
              <motion.div
                className="r49-palette-wrap"
                initial={reduced ? {} : { scale: 0.97, opacity: 0, y: -10 }}
                animate={reduced ? {} : { scale: 1, opacity: 1, y: 0 }}
                exit={reduced ? {} : { scale: 0.97, opacity: 0, y: -10 }}
                transition={reduced ? {} : spring}
              >
                {/* ── Main palette ── */}
                <div className="r49-palette">
                  {/* Input */}
                  <div className="r49-input-row">
                    <span className="r49-input-icon" aria-hidden="true">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle
                          cx="6.5"
                          cy="6.5"
                          r="4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M10.5 10.5l3 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <input
                      ref={inputRef}
                      className="r49-input"
                      type="text"
                      placeholder="Type a command or search…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Search commands"
                      autoFocus
                    />
                    <span className="r49-kbd-chip">ESC</span>
                  </div>

                  {/* Results */}
                  <ul
                    className="r49-results"
                    ref={listRef}
                    role="listbox"
                    aria-label="Command results"
                  >
                    {Object.entries(grouped).map(([group, items]) => (
                      <li key={group} role="presentation">
                        <div className="r49-group-label">{group}</div>
                        <ul
                          role="group"
                          style={{ listStyle: "none", margin: 0, padding: 0 }}
                        >
                          {items.map((r) => {
                            const globalIdx = flatFiltered.findIndex(
                              (f) => f.cmd.id === r.cmd.id,
                            );
                            return (
                              <li
                                key={r.cmd.id}
                                className="r49-item"
                                data-idx={globalIdx}
                                data-active={globalIdx === activeIdx}
                                role="option"
                                aria-selected={globalIdx === activeIdx}
                                onClick={() => handleSelect(r.cmd)}
                                onMouseEnter={() => setActiveIdx(globalIdx)}
                              >
                                <span
                                  className="r49-item-icon"
                                  aria-hidden="true"
                                >
                                  <CmdIcon type={r.cmd.icon} size={13} />
                                </span>
                                <span className="r49-item-label">
                                  <HighlightedText
                                    text={r.cmd.label}
                                    positions={r.positions}
                                  />
                                </span>
                                {r.cmd.shortcut && (
                                  <span
                                    className="r49-item-shortcut"
                                    aria-hidden="true"
                                  >
                                    {r.cmd.shortcut}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ))}

                    {flatFiltered.length === 0 && (
                      <li className="r49-no-results">
                        No results for &ldquo;{query}&rdquo;
                      </li>
                    )}
                  </ul>

                  {/* Footer */}
                  <div className="r49-palette-footer" aria-hidden="true">
                    <span className="r49-foot-hint">
                      <span className="r49-foot-kbd">↑↓</span>navigate
                    </span>
                    <span className="r49-foot-hint">
                      <span className="r49-foot-kbd">⏎</span>select
                    </span>
                    <span className="r49-foot-hint">
                      <span className="r49-foot-kbd">ESC</span>close
                    </span>
                    <span style={{ flex: 1 }} />
                    <span className="r49-foot-hint">
                      <span className="r49-foot-kbd">⌘K</span>toggle
                    </span>
                  </div>
                </div>

                {/* ── Preview panel ── */}
                <AnimatePresence mode="wait">
                  {activePreview?.preview ? (
                    <motion.div
                      key={activePreview.id}
                      className="r49-preview"
                      initial={reduced ? {} : { opacity: 0, x: 6 }}
                      animate={reduced ? {} : { opacity: 1, x: 0 }}
                      exit={reduced ? {} : { opacity: 0, x: 6 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                      aria-hidden="true"
                    >
                      {activePreview.preview.tag && (
                        <span className="r49-preview-tag">
                          {activePreview.preview.tag}
                        </span>
                      )}
                      <div className="r49-preview-heading">
                        {activePreview.preview.heading}
                      </div>
                      <div className="r49-preview-body">
                        {activePreview.preview.body}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="r49-preview"
                      initial={reduced ? {} : { opacity: 0 }}
                      animate={reduced ? {} : { opacity: 1 }}
                      exit={reduced ? {} : { opacity: 0 }}
                      style={{ justifyContent: "center", alignItems: "center" }}
                      aria-hidden="true"
                    >
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: C.subtler,
                          textAlign: "center",
                          lineHeight: 1.7,
                        }}
                      >
                        hover a command
                        <br />
                        to preview it
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Page content ──────────────────────────────────────────── */}
        <main id="main-content">
          {/* ── Hero ────────────────────────────────────────────────── */}
          <section className="r49-hero" aria-label="Hero">
            <motion.div
              className="r49-prompt-bar"
              initial={reduced ? {} : { opacity: 0, y: 8 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
            >
              <span className="r49-prompt-dot" />
              <span>skynetlabs</span>
              <span style={{ color: C.subtler }}>~</span>
              <span style={{ color: C.green }}>⌘K</span>
              <span style={{ color: C.subtler }}>to navigate</span>
            </motion.div>

            <motion.h1
              className="r49-hero-h1"
              initial={reduced ? {} : { opacity: 0, y: 18 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {reduced ? (
                <>
                  Type a problem.{" "}
                  <span className="accent">I've automated it.</span>
                </>
              ) : (
                <TypingPrompt
                  lines={[
                    "Type a problem. I've probably already automated it.",
                  ]}
                  speed={38}
                />
              )}
            </motion.h1>

            <motion.p
              className="r49-hero-sub"
              initial={reduced ? {} : { opacity: 0, y: 12 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <strong>180+ builds</strong> · <strong>40+ clients</strong> ·{" "}
              <strong>9 countries</strong> · since 2019. Independent builder of
              AI + automation systems that kill busywork before it kills your
              margin.
            </motion.p>

            <motion.div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
              initial={reduced ? {} : { opacity: 0, y: 10 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.45 }}
            >
              <a
                href="https://skynetjoe.com/discovery-call"
                className="r49-cta-btn r49-display"
                rel="noopener noreferrer"
              >
                Book a 30-min call →
              </a>
              <button
                className="r49-palette-btn"
                onClick={openPalette}
                aria-label="Open command palette"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10.5 10.5l3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Search anything
                <span className="r49-trigger-kbd">⌘K</span>
              </button>
            </motion.div>

            {/* Scroll line */}
            <motion.div
              className="r49-scroll-hint"
              initial={reduced ? {} : { opacity: 0 }}
              animate={reduced ? {} : { opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              aria-hidden="true"
            >
              <span className="r49-scroll-label">scroll</span>
              <motion.div
                className="r49-scroll-line"
                animate={reduced ? {} : { scaleY: [1, 0.4, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </section>

          {/* ── Stats ───────────────────────────────────────────────── */}
          <section
            id="proof"
            className="r49-section-wrap"
            aria-label="Proof of work"
          >
            <div className="r49-stats-grid">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="r49-stat-cell"
                  initial={reduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                >
                  <div className="r49-stat-val r49-display">{s.value}</div>
                  <div className="r49-stat-label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="r49-divider" aria-hidden="true" />

          {/* ── Services ────────────────────────────────────────────── */}
          <section
            id="services"
            className="r49-section-wrap"
            aria-label="Services"
          >
            <p className="r49-section-eyebrow">what I do</p>
            <h2 className="r49-section-h2 r49-display">
              Pick the problem. I'll wire the fix.
            </h2>
            <div className="r49-services-grid">
              {SERVICES.map((svc, i) => (
                <motion.div
                  key={svc.title}
                  className="r49-service-card"
                  initial={reduced ? {} : { opacity: 0, y: 14 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.42 }}
                >
                  <span className="r49-service-tag">{svc.tag}</span>
                  <h3 className="r49-service-title r49-display">{svc.title}</h3>
                  <p className="r49-service-body">{svc.body}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="r49-divider" aria-hidden="true" />

          {/* ── Work ────────────────────────────────────────────────── */}
          <section
            id="work"
            className="r49-section-wrap"
            aria-label="Selected work"
          >
            <p className="r49-section-eyebrow">selected work</p>
            <h2 className="r49-section-h2 r49-display">
              Clients who stopped doing it manually.
            </h2>
            <div className="r49-work-grid">
              {WORK.map((w, i) => (
                <motion.article
                  key={w.client}
                  className="r49-work-card"
                  initial={reduced ? {} : { opacity: 0, y: 18 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.48 }}
                >
                  <img
                    src={`/img/pro/${w.img}`}
                    alt={`Work context — ${w.client}`}
                    className="r49-work-img"
                  />
                  <div className="r49-work-body">
                    <span className="r49-work-geo">{w.geo}</span>
                    <h3 className="r49-work-client r49-display">{w.client}</h3>
                    <p className="r49-work-result">{w.result}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <div className="r49-divider" aria-hidden="true" />

          {/* ── About ────────────────────────────────────────────────── */}
          <section
            id="about"
            className="r49-section-wrap"
            aria-label="About Waseem"
          >
            <div className="r49-about-grid">
              <motion.div
                className="r49-about-imgs"
                initial={reduced ? {} : { opacity: 0, x: -18 }}
                whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg"
                  alt="Waseem Nasir — portrait in black kurta"
                  className="r49-about-img-tall"
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <img
                    src="/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg"
                    alt="Working from Bali terrace cafe"
                    className="r49-about-img"
                  />
                  <img
                    src="/img/pro/TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg"
                    alt="Nusa Penida cliffs"
                    className="r49-about-img"
                  />
                </div>
              </motion.div>

              <motion.div
                className="r49-about-text"
                initial={reduced ? {} : { opacity: 0, x: 18 }}
                whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="r49-section-eyebrow">the builder</p>
                <h2
                  className="r49-section-h2 r49-display"
                  style={{
                    fontSize: "clamp(20px, 2.8vw, 30px)",
                    marginBottom: 0,
                  }}
                >
                  Waseem Nasir
                </h2>
                <p className="r49-about-p">
                  <strong>Independent founder of SkynetLabs.</strong> Shipping
                  automation and AI systems since 2019 — before "AI tools" was a
                  LinkedIn category.
                </p>
                <p className="r49-about-p">
                  Working from Bali or Lahore, usually with a coffee and a
                  terminal open. Clients stop losing leads, stop doing manual
                  ops, and stop waiting on developers.
                </p>
                <p className="r49-about-p">
                  n8n, Next.js, WhatsApp bots, AEO — whatever stack kills the
                  problem fastest.
                </p>
                <div className="r49-tag-row">
                  {[
                    "n8n",
                    "Next.js",
                    "AI Bots",
                    "AEO",
                    "Automation",
                    "Bali / Lahore",
                  ].map((t) => (
                    <span key={t} className="r49-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <div className="r49-divider" aria-hidden="true" />

          {/* ── Gallery strip ────────────────────────────────────────── */}
          <section
            aria-label="Photo gallery"
            style={{
              position: "relative",
              zIndex: 1,
              padding: "56px 0",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                display: "flex",
                gap: 12,
                paddingLeft: 24,
                width: "max-content",
              }}
              animate={reduced ? {} : { x: [0, -1280] }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            >
              {[...GALLERY_IMGS, ...GALLERY_IMGS].map((img, i) => (
                <img
                  key={i}
                  src={`/img/pro/${img}`}
                  alt={`Gallery image ${(i % GALLERY_IMGS.length) + 1}`}
                  style={{
                    height: 210,
                    width: "auto",
                    borderRadius: 8,
                    objectFit: "cover",
                    flexShrink: 0,
                    border: `1px solid ${C.border}`,
                  }}
                />
              ))}
            </motion.div>
          </section>

          <div className="r49-divider" aria-hidden="true" />

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <section
            id="contact"
            className="r49-cta-section"
            aria-label="Contact"
          >
            <motion.h2
              className="r49-cta-h2"
              initial={reduced ? {} : { opacity: 0, y: 18 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              You have a problem.
              <br />
              <span className="accent">Let's run it through the system.</span>
            </motion.h2>
            <p className="r49-cta-sub">
              30 minutes. You describe the bottleneck. I tell you exactly how to
              automate it. No fluff.
            </p>
            <motion.a
              href="https://skynetjoe.com/discovery-call"
              className="r49-cta-btn r49-display"
              rel="noopener noreferrer"
              initial={reduced ? {} : { opacity: 0, y: 10 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              Book a 30-min call →
            </motion.a>
            <div className="r49-cmd-hint">
              <span className="r49-cmd-hint-label">or use the palette</span>
              <button
                className="r49-palette-btn"
                onClick={openPalette}
                aria-label="Open command palette"
              >
                <span>⌘K</span>
                <span style={{ color: C.subtler }}>·</span>
                <span>navigate anywhere</span>
              </button>
            </div>
          </section>
        </main>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="r49-footer" aria-label="Footer">
          <span className="r49-footer-brand r49-display">
            Waseem Nasir · SkynetLabs
          </span>
          <nav className="r49-footer-links" aria-label="Footer navigation">
            <a
              href="https://github.com/waseemnasir2k26"
              className="r49-footer-link"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://skynetjoe.com"
              className="r49-footer-link"
              rel="noopener noreferrer"
            >
              skynetjoe.com
            </a>
            <a
              href="https://skynetjoe.com/discovery-call"
              className="r49-footer-link"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          </nav>
        </footer>
      </div>
    </>
  );
}
