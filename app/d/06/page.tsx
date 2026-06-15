"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  AnimatePresence,
} from "framer-motion";

/* ─── SCOPED STYLES ─────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

.t06 *, .t06 *::before, .t06 *::after { box-sizing: border-box; margin: 0; padding: 0; }

.t06 {
  font-family: 'IBM Plex Mono', monospace;
  background: #0D0F0C;
  color: #C9D1C9;
  min-height: 100vh;
  position: relative;
  z-index: 2;
  overflow-x: hidden;
}

.t06 h1, .t06 h2, .t06 h3, .t06 h4, .t06 .mono-display {
  font-family: 'JetBrains Mono', monospace;
}

/* Layout */
.t06-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.t06-topbar {
  grid-column: 1 / -1;
  background: #14170F;
  border-bottom: 1px solid #2A2E28;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.t06-topbar-dots { display: flex; gap: 6px; }
.t06-topbar-dot {
  width: 12px; height: 12px; border-radius: 50%;
}
.t06-topbar-dot.red   { background: #FF5F57; }
.t06-topbar-dot.amber { background: #FFBD2E; }
.t06-topbar-dot.green { background: #28C840; }

.t06-topbar-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #5A6358;
  flex: 1;
  text-align: center;
  letter-spacing: 0.05em;
}

.t06-topbar-status {
  font-size: 11px;
  color: #A3FF12;
  display: flex;
  align-items: center;
  gap: 6px;
}

.t06-topbar-status::before {
  content: '';
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #A3FF12;
  animation: t06-pulse 2s ease-in-out infinite;
}

@keyframes t06-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* File tree sidebar */
.t06-sidebar {
  background: #14170F;
  border-right: 1px solid #2A2E28;
  padding: 20px 0;
  overflow-y: auto;
  position: sticky;
  top: 41px;
  height: calc(100vh - 41px);
  scroll-behavior: smooth;
}

.t06-sidebar-section {
  margin-bottom: 24px;
}

.t06-sidebar-label {
  font-size: 10px;
  color: #5A6358;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0 16px 8px;
  display: block;
  font-family: 'JetBrains Mono', monospace;
}

.t06-tree-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px;
  font-size: 12px;
  color: #5A6358;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.t06-tree-item:hover, .t06-tree-item.active {
  color: #C9D1C9;
  background: rgba(163, 255, 18, 0.04);
}

.t06-tree-item.active { color: #A3FF12; }

.t06-tree-item .icon {
  font-style: normal;
  font-size: 11px;
  min-width: 16px;
  color: inherit;
}

.t06-tree-indent { padding-left: 32px; }

/* Log sidebar */
.t06-log-panel {
  margin-top: 12px;
  padding: 0 12px;
}

.t06-log-entry {
  font-size: 10px;
  line-height: 1.6;
  padding: 2px 0;
  color: #5A6358;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  gap: 8px;
}

.t06-log-entry.info  { color: #5A6358; }
.t06-log-entry.ok    { color: #A3FF12; }
.t06-log-entry.warn  { color: #FF6B35; }
.t06-log-entry.event { color: #7EB8C9; }

.t06-log-time { min-width: 42px; opacity: 0.6; }

/* Main content pane */
.t06-main {
  overflow-y: auto;
  padding: 0;
}

/* Hero terminal block */
.t06-hero {
  padding: 60px 48px 48px;
  border-bottom: 1px solid #2A2E28;
  position: relative;
}

.t06-prompt-line {
  display: flex;
  align-items: baseline;
  gap: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #5A6358;
  margin-bottom: 4px;
}

.t06-prompt-line .ps1 { color: #A3FF12; margin-right: 8px; }
.t06-prompt-line .cmd { color: #C9D1C9; }
.t06-prompt-line .arg { color: #7EB8C9; }
.t06-prompt-line .str { color: #FF6B35; }

.t06-hero-output {
  margin: 32px 0 0;
  padding-left: 2px;
}

.t06-hero-h1 {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(22px, 3.5vw, 42px);
  font-weight: 700;
  color: #C9D1C9;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.t06-hero-h1 .accent { color: #A3FF12; }
.t06-hero-h1 .str-lit { color: #FF6B35; }

.t06-caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #A3FF12;
  vertical-align: text-bottom;
  margin-left: 2px;
  animation: t06-blink 1s step-end infinite;
}

@keyframes t06-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.t06-hero-sub {
  margin-top: 20px;
  font-size: 14px;
  color: #5A6358;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
}

.t06-hero-sub .value { color: #7EB8C9; }

.t06-hero-cta {
  margin-top: 36px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 1px solid #A3FF12;
  color: #A3FF12;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: background 0.2s, color 0.2s;
  position: relative;
}

.t06-hero-cta:hover {
  background: #A3FF12;
  color: #0D0F0C;
}

.t06-hero-cta:focus-visible {
  outline: 2px solid #A3FF12;
  outline-offset: 4px;
}

/* ASCII portrait */
.t06-ascii-portrait {
  position: absolute;
  right: 48px;
  top: 60px;
  font-size: 6.5px;
  line-height: 1.18;
  color: #2A2E28;
  font-family: 'JetBrains Mono', monospace;
  pointer-events: none;
  user-select: none;
  white-space: pre;
  opacity: 0.7;
}

/* Sections */
.t06-section {
  padding: 48px 48px;
  border-bottom: 1px solid #1C1F1A;
}

.t06-section-cmd {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.t06-section-cmd .ps1 {
  color: #A3FF12;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.t06-section-h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: #C9D1C9;
  letter-spacing: 0.03em;
}

/* Proof / stats */
.t06-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #2A2E28;
  border: 1px solid #2A2E28;
  margin-bottom: 32px;
}

.t06-stat-cell {
  background: #0D0F0C;
  padding: 24px 20px;
}

.t06-stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  color: #A3FF12;
  line-height: 1;
  margin-bottom: 8px;
}

.t06-stat-key {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #5A6358;
  letter-spacing: 0.08em;
}

.t06-stat-comment {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3A3E38;
  margin-top: 4px;
}

/* Services */
.t06-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #2A2E28;
  border: 1px solid #2A2E28;
}

.t06-service-cell {
  background: #0D0F0C;
  padding: 28px 24px;
  transition: background 0.2s;
}

.t06-service-cell:hover { background: #14170F; }

.t06-service-cmd {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #FF6B35;
  margin-bottom: 10px;
}

.t06-service-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #C9D1C9;
  margin-bottom: 10px;
}

.t06-service-desc {
  font-size: 12px;
  color: #5A6358;
  line-height: 1.7;
  font-family: 'IBM Plex Mono', monospace;
}

.t06-service-tags {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.t06-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #A3FF12;
  border: 1px solid #2A3A10;
  padding: 2px 7px;
  letter-spacing: 0.05em;
}

/* Work gallery */
.t06-work-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid #2A2E28;
}

.t06-work-row {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 0;
  background: #2A2E28;
}

.t06-work-meta {
  background: #0D0F0C;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.t06-work-pid {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #5A6358;
  letter-spacing: 0.08em;
}

.t06-work-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #C9D1C9;
}

.t06-work-desc {
  font-size: 12px;
  color: #5A6358;
  font-family: 'IBM Plex Mono', monospace;
  line-height: 1.6;
  margin-top: 4px;
}

.t06-work-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #A3FF12;
  margin-top: 8px;
}

.t06-work-status::before {
  content: '';
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #A3FF12;
}

.t06-work-img {
  background: #14170F;
  overflow: hidden;
}

.t06-work-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.65;
  filter: grayscale(20%);
  display: block;
  transition: opacity 0.3s;
}

.t06-work-row:hover .t06-work-img img {
  opacity: 0.85;
}

/* About / whoami */
.t06-about-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 40px;
  align-items: start;
}

.t06-about-portrait {
  position: relative;
  border: 1px solid #2A2E28;
  overflow: hidden;
}

.t06-about-portrait img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  object-position: top center;
  display: block;
  filter: grayscale(10%) brightness(0.85);
}

.t06-about-portrait-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, #0D0F0C 60%, transparent);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #5A6358;
  line-height: 1.7;
}

.t06-about-portrait-overlay .key   { color: #7EB8C9; }
.t06-about-portrait-overlay .val   { color: #C9D1C9; }

.t06-whoami-output {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.t06-whoami-line {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  font-size: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #1C1F1A;
  font-family: 'JetBrains Mono', monospace;
}

.t06-whoami-line .key-col { color: #5A6358; }
.t06-whoami-line .val-col { color: #C9D1C9; }
.t06-whoami-line .accent  { color: #A3FF12; }
.t06-whoami-line .orange  { color: #FF6B35; }

/* Scrolling images row */
.t06-image-strip {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 48px 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.t06-image-strip::-webkit-scrollbar { display: none; }

.t06-strip-img {
  flex-shrink: 0;
  width: 220px;
  height: 160px;
  overflow: hidden;
  border: 1px solid #2A2E28;
  position: relative;
}

.t06-strip-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(15%) brightness(0.75);
  display: block;
  transition: filter 0.3s;
}

.t06-strip-img:hover img { filter: grayscale(0%) brightness(0.9); }

.t06-strip-label {
  position: absolute;
  bottom: 6px;
  left: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #5A6358;
  letter-spacing: 0.06em;
}

/* CTA / contact */
.t06-cta-block {
  border: 1px solid #2A2E28;
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.t06-cta-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(163,255,18,0.012) 2px,
    rgba(163,255,18,0.012) 4px
  );
  pointer-events: none;
}

.t06-cta-h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 700;
  color: #C9D1C9;
  margin-bottom: 16px;
  line-height: 1.35;
}

.t06-cta-h2 .acc { color: #A3FF12; }

.t06-cta-desc {
  font-size: 13px;
  color: #5A6358;
  font-family: 'IBM Plex Mono', monospace;
  line-height: 1.7;
  max-width: 540px;
  margin-bottom: 32px;
}

.t06-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: #A3FF12;
  color: #0D0F0C;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: background 0.2s, transform 0.1s;
}

.t06-cta-link:hover { background: #BFFF50; transform: translateY(-1px); }
.t06-cta-link:focus-visible { outline: 2px solid #A3FF12; outline-offset: 4px; }

.t06-cta-note {
  margin-top: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #3A3E38;
}

/* Footer */
.t06-footer {
  grid-column: 1 / -1;
  background: #14170F;
  border-top: 1px solid #2A2E28;
  padding: 20px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #3A3E38;
}

.t06-footer a {
  color: #5A6358;
  text-decoration: none;
  transition: color 0.2s;
}

.t06-footer a:hover { color: #A3FF12; }
.t06-footer a:focus-visible { outline: 1px solid #A3FF12; }

/* Skip link */
.t06-skip {
  position: absolute;
  top: -100px;
  left: 0;
  background: #A3FF12;
  color: #0D0F0C;
  padding: 8px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  z-index: 9999;
  text-decoration: none;
  transition: top 0.2s;
}

.t06-skip:focus { top: 0; }

/* Scroll-execute prompt animation */
.t06-exec-line {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
}

.t06-exec-line .ps1  { color: #A3FF12; }
.t06-exec-line .text { color: #C9D1C9; }
.t06-exec-line .ok   { color: #A3FF12; font-size: 11px; }
.t06-exec-line .warn { color: #FF6B35; }

/* Responsive */
@media (max-width: 900px) {
  .t06-shell { grid-template-columns: 1fr; }
  .t06-sidebar { display: none; }
  .t06-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .t06-services-grid { grid-template-columns: 1fr; }
  .t06-about-grid { grid-template-columns: 1fr; }
  .t06-work-row { grid-template-columns: 1fr; }
  .t06-work-img { height: 160px; }
  .t06-hero { padding: 40px 24px 36px; }
  .t06-section { padding: 36px 24px; }
  .t06-ascii-portrait { display: none; }
  .t06-whoami-line { grid-template-columns: 120px 1fr; }
}
`;

/* ─── ASCII PORTRAIT ─────────────────────────────────────────── */
const ASCII = `
...::----====++++++++====----:::...
..::---==++++##@@@@@@##++++=----::..
..:--=++++*##@@@@@@@@@@##*++++=--:..
.:--=+++*###@@@@@@@@@@@@@###*+++=--:.
.:-=++**##@@@@@@@@@@@@@@@@@@##**+=-:.
.:-=+**##@@@@@@@@@@@@@@@@@@@@@#*+=-:.
.:=+**##@@@@@####**###@@@@@@@@##*+=-:
.:=+*##@@@###**++++++**###@@@@@@#*+=:
.:+**#@@@@#*+===++++====+*#@@@@@#*+=:
.=+*#@@@@@#+==+##**##+=--+*@@@@@@#+=-
.=+*#@@@@@@*+*@@%##%@#+==**@@@@@@@*+.
.-+*#@@@@@@@%@@@@@@@@@%**%@@@@@@@@*+.
..=**#@@@@@@@@@@@@@@@@@@@@@@@@@@##*+.
..:+*##@@@@@@@@@@@@@@@@@@@@@@@@##*+:.
...:+*##@@@@@@@@@@@@@@@@@@@@###*++:..
....:=+*###@@@@@@@@@@@@@####**+=-:...
.....::-=+***########***++==--::......
`.trim();

/* ─── LOG DATA ──────────────────────────────────────────────── */
const INITIAL_LOGS: Array<{
  time: string;
  level: "info" | "ok" | "warn" | "event";
  msg: string;
}> = [
  { time: "00:00", level: "event", msg: "session.init" },
  { time: "00:01", level: "ok", msg: "env loaded" },
  { time: "00:02", level: "info", msg: "node v20.11" },
  { time: "00:03", level: "ok", msg: "n8n connected" },
  { time: "00:05", level: "warn", msg: "manual ops detected" },
  { time: "00:06", level: "ok", msg: "automating..." },
  { time: "00:08", level: "info", msg: "180 builds" },
  { time: "00:09", level: "ok", msg: "clients 40+" },
  { time: "00:11", level: "event", msg: "countries: 9" },
  { time: "00:13", level: "ok", msg: "uptime since 2019" },
  { time: "00:15", level: "info", msg: "next.js ready" },
  { time: "00:16", level: "warn", msg: "missed leads?" },
  { time: "00:17", level: "ok", msg: "handled." },
  { time: "00:19", level: "info", msg: "bot.voice ready" },
  { time: "00:21", level: "ok", msg: "aeo indexed" },
];

const LIVE_LOG_POOL = [
  { level: "ok" as const, msg: "lead captured" },
  { level: "ok" as const, msg: "follow-up sent" },
  { level: "event" as const, msg: "client ping" },
  { level: "info" as const, msg: "pipeline run" },
  { level: "ok" as const, msg: "booking opened" },
  { level: "warn" as const, msg: "idle > 2h detected" },
  { level: "ok" as const, msg: "automation fixed it" },
  { level: "info" as const, msg: "n8n webhook recv" },
  { level: "ok" as const, msg: "voice bot answered" },
  { level: "event" as const, msg: "new country: PK" },
  { level: "ok" as const, msg: "build shipped" },
  { level: "info" as const, msg: "aeo citation found" },
];

/* ─── TYPEWRITER HOOK ────────────────────────────────────────── */
function useTypewriter(
  text: string,
  speed = 38,
  startDelay = 400,
  reduced = false,
) {
  const [displayed, setDisplayed] = useState(reduced ? text : "");
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const tid = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(tid);
  }, [text, speed, startDelay, reduced]);

  return { displayed, done };
}

/* ─── SCROLL-EXECUTE LINE ────────────────────────────────────── */
function ExecLine({
  cmd,
  delay = 0,
  reduced = false,
}: {
  cmd: string;
  delay?: number;
  reduced?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (inView || reduced) {
      const t = setTimeout(() => setRun(true), reduced ? 0 : delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay, reduced]);

  const { displayed, done } = useTypewriter(cmd, 28, 0, !run || reduced);

  return (
    <div ref={ref} className="t06-exec-line">
      <span className="ps1">$</span>
      <span className="text">{displayed}</span>
      {run && !done && <span className="t06-caret" aria-hidden="true" />}
      {done && <span className="ok"> ✓</span>}
    </div>
  );
}

/* ─── LIVE LOG TICKER ────────────────────────────────────────── */
function LiveLog({ reduced }: { reduced: boolean }) {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let idx = 0;
    const iv = setInterval(() => {
      const entry = LIVE_LOG_POOL[idx % LIVE_LOG_POOL.length];
      idx++;
      const now = new Date();
      const time = `${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setLogs((prev) => {
        const next = [...prev, { time, ...entry }];
        return next.slice(-28);
      });
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 2800);
    return () => clearInterval(iv);
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="t06-log-panel"
      style={{ maxHeight: "360px", overflowY: "auto", scrollbarWidth: "none" }}
    >
      <AnimatePresence initial={false}>
        {logs.map((l, i) => (
          <motion.div
            key={i}
            className={`t06-log-entry ${l.level}`}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="t06-log-time">{l.time}</span>
            <span>{l.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── COUNT-UP STAT ──────────────────────────────────────────── */
function CountStat({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCount(target);
      return;
    }
    let start = 0;
    const duration = 1400;
    const step = 16;
    const total = Math.ceil(duration / step);
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      setCount(Math.round((frame / total) * target));
      if (frame >= total) {
        setCount(target);
        clearInterval(iv);
      }
    }, step);
    return () => clearInterval(iv);
  }, [inView, target, reduced]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function Design06Terminal() {
  const reduced = useReducedMotion() ?? false;

  const nav = [
    { label: "waseem.sh", icon: "▶", section: "hero", active: true },
    { label: "src/", icon: "▸", section: null, active: false },
    {
      label: "proof.json",
      icon: "📄",
      section: "proof",
      active: false,
      indent: true,
    },
    { label: "services/", icon: "▸", section: null, active: false },
    {
      label: "automate.ts",
      icon: "📄",
      section: "services",
      active: false,
      indent: true,
    },
    {
      label: "build.ts",
      icon: "📄",
      section: "services",
      active: false,
      indent: true,
    },
    { label: "work/", icon: "▸", section: null, active: false },
    {
      label: "selected.log",
      icon: "📄",
      section: "work",
      active: false,
      indent: true,
    },
    { label: "whoami.sh", icon: "📄", section: "about", active: false },
    { label: "contact.init", icon: "📄", section: "contact", active: false },
  ];

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(`t06-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <div className="t06">
        <a href="#t06-hero" className="t06-skip">
          Skip to main content
        </a>

        {/* TOP BAR */}
        <header className="t06-shell" style={{ display: "block" }}>
          <div className="t06-topbar" role="banner">
            <div className="t06-topbar-dots" aria-hidden="true">
              <div className="t06-topbar-dot red" />
              <div className="t06-topbar-dot amber" />
              <div className="t06-topbar-dot green" />
            </div>
            <div className="t06-topbar-title">
              waseem@skynetlabs: ~/builds (zsh) — 180+ shipped
            </div>
            <div
              className="t06-topbar-status"
              aria-label="System status: always shipping"
            >
              always shipping
            </div>
          </div>
        </header>

        {/* TWO-PANE SHELL */}
        <div className="t06-shell">
          {/* SIDEBAR: file tree + live log */}
          <aside className="t06-sidebar" aria-label="Navigation file tree">
            <div className="t06-sidebar-section">
              <span className="t06-sidebar-label">EXPLORER</span>
              <nav>
                {nav.map((item, i) =>
                  item.section ? (
                    <button
                      key={i}
                      className={`t06-tree-item${item.indent ? " t06-tree-indent" : ""}${item.active ? " active" : ""}`}
                      onClick={() => scrollTo(item.section!)}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <span className="icon" aria-hidden="true">
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ) : (
                    <div
                      key={i}
                      className={`t06-tree-item${item.indent ? " t06-tree-indent" : ""}`}
                      aria-hidden="true"
                    >
                      <span className="icon">{item.icon}</span>
                      {item.label}
                    </div>
                  ),
                )}
              </nav>
            </div>

            <div className="t06-sidebar-section">
              <span className="t06-sidebar-label">LIVE LOG</span>
              <LiveLog reduced={reduced} />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main id="t06-hero" className="t06-main" aria-label="Main content">
            {/* ── HERO ───────────────────────────────────────── */}
            <section className="t06-hero" aria-labelledby="t06-h1">
              {/* ASCII portrait decoration */}
              <pre className="t06-ascii-portrait" aria-hidden="true">
                {ASCII}
              </pre>

              <div className="t06-prompt-line" aria-hidden="true">
                <span className="ps1">waseem@skynetlabs ~</span>
                <span style={{ color: "#5A6358", margin: "0 6px" }}>$</span>
                <span className="cmd">./waseem </span>
                <span className="arg">--build </span>
                <span className="str">"automation"</span>
                <span className="arg"> --status </span>
              </div>

              <div className="t06-hero-output">
                <h1 id="t06-h1" className="t06-hero-h1">
                  <HeroTypewriter reduced={reduced} />
                </h1>

                <p className="t06-hero-sub">
                  # uptime:{" "}
                  <span className="value">2019-{new Date().getFullYear()}</span>
                  {"  "}·{"  "}builds: <span className="value">180+</span>
                  {"  "}·{"  "}clients: <span className="value">40+</span>
                  {"  "}·{"  "}geo: <span className="value">9 countries</span>
                </p>

                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="t06-hero-cta"
                  aria-label="Book a 30-minute discovery call"
                >
                  <span aria-hidden="true">$</span>
                  ./book --duration 30m --topic "kill your busywork"
                </a>
              </div>
            </section>

            {/* ── PROOF / STATS ───────────────────────────────── */}
            <section
              id="t06-proof"
              className="t06-section"
              aria-labelledby="t06-h2-proof"
            >
              <div className="t06-section-cmd">
                <span className="ps1">$</span>
                <h2 id="t06-h2-proof" className="t06-section-h2">
                  cat proof.json
                </h2>
              </div>

              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px",
                  color: "#5A6358",
                  marginBottom: "16px",
                }}
              >
                {"{"} <span style={{ color: "#7EB8C9" }}>"type"</span>:{" "}
                <span style={{ color: "#FF6B35" }}>"first-party"</span>,{" "}
                <span style={{ color: "#7EB8C9" }}>"fabricated"</span>:{" "}
                <span style={{ color: "#A3FF12" }}>false</span> {"}"}
              </div>

              <div className="t06-stats-grid" role="list">
                {[
                  {
                    value: 180,
                    suffix: "+",
                    key: "builds_shipped",
                    comment: "// n8n, Next.js, bots",
                  },
                  {
                    value: 40,
                    suffix: "+",
                    key: "clients_served",
                    comment: "// 9 countries",
                  },
                  {
                    value: 9,
                    suffix: "",
                    key: "countries_worked_from",
                    comment: "// Bali → Lahore → ...",
                  },
                  {
                    value: 2019,
                    suffix: "→",
                    key: "operating_since",
                    comment: "// uptime: uninterrupted",
                  },
                ].map((s) => (
                  <div key={s.key} className="t06-stat-cell" role="listitem">
                    <div className="t06-stat-value">
                      <CountStat target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="t06-stat-key">{s.key}</div>
                    <div className="t06-stat-comment">{s.comment}</div>
                  </div>
                ))}
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <ExecLine
                  cmd="verify --source first-party --field builds_shipped --value 180"
                  delay={0}
                  reduced={reduced}
                />
                <ExecLine
                  cmd="verify --source first-party --field clients_served  --value 40"
                  delay={180}
                  reduced={reduced}
                />
                <ExecLine
                  cmd="verify --source first-party --field countries       --value 9"
                  delay={360}
                  reduced={reduced}
                />
              </div>
            </section>

            {/* ── SERVICES ───────────────────────────────────── */}
            <section
              id="t06-services"
              className="t06-section"
              aria-labelledby="t06-h2-services"
            >
              <div className="t06-section-cmd">
                <span className="ps1">$</span>
                <h2 id="t06-h2-services" className="t06-section-h2">
                  ls -la services/
                </h2>
              </div>

              <div className="t06-services-grid" role="list">
                {[
                  {
                    cmd: "./automate.sh --target lead_capture",
                    title: "AI Lead Capture & Follow-Up",
                    desc: "Missed leads are a manual-ops bug. I wire n8n pipelines that catch every inbound, score intent, and follow up automatically — no human needed between ping and close.",
                    tags: ["n8n", "OpenAI", "webhooks", "CRM"],
                  },
                  {
                    cmd: "./deploy.sh --stack next --mode prod",
                    title: "Next.js Product Builds",
                    desc: "From blank repo to deployed product. Full-stack Next.js with TypeScript, AEO-ready markup, and performance budgets that hold in production — not just Lighthouse CI.",
                    tags: ["Next.js", "TypeScript", "Vercel", "SEO/AEO"],
                  },
                  {
                    cmd: "./bot.sh --channel voice --channel whatsapp",
                    title: "Voice & WhatsApp Bots",
                    desc: "Receptionist-grade bots that answer calls, qualify leads, and hand off to humans when complexity requires it. Deployed on real business lines, not toy demos.",
                    tags: ["Twilio", "WhatsApp", "LLM", "n8n"],
                  },
                  {
                    cmd: "./aeo.sh --index --cite --rank",
                    title: "AEO / AI-Search Optimization",
                    desc: "Answer Engine Optimization: structured data, FAQ schema, citation-ready copy so your business appears when AI assistants answer your customers' questions.",
                    tags: ["AEO", "schema.org", "content", "Bing"],
                  },
                  {
                    cmd: "./ops.sh --kill manual --replace workflow",
                    title: "Ops Automation",
                    desc: "Dead follow-ups, manual reporting, copy-paste busywork — each one is a process waiting to be automated. I map the ops, find the bottlenecks, ship the fix.",
                    tags: ["n8n", "Zapier", "APIs", "agentic"],
                  },
                  {
                    cmd: "./consult.sh --mode async --rate ship-first",
                    title: "Async Technical Advisory",
                    desc: "Not retainers-for-the-sake-of-it. Async technical advisory for founders who need a senior build-partner to ship correctly, not a team that ships slowly.",
                    tags: ["async", "strategy", "code-review", "velocity"],
                  },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="t06-service-cell"
                    role="listitem"
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
                  >
                    <div className="t06-service-cmd">{s.cmd}</div>
                    <div className="t06-service-title">{s.title}</div>
                    <p className="t06-service-desc">{s.desc}</p>
                    <div className="t06-service-tags">
                      {s.tags.map((t) => (
                        <span key={t} className="t06-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── SELECTED WORK ──────────────────────────────── */}
            <section
              id="t06-work"
              className="t06-section"
              aria-labelledby="t06-h2-work"
            >
              <div className="t06-section-cmd">
                <span className="ps1">$</span>
                <h2 id="t06-h2-work" className="t06-section-h2">
                  tail -n 5 selected.log
                </h2>
              </div>

              <div className="t06-work-list" role="list">
                {[
                  {
                    pid: "PID 4291 · 2024",
                    name: "Inspire Health PT — $27 Funnel",
                    desc: "Built the entire patient acquisition funnel: Stripe checkout, WP theme+plugin, mobile nav fix, Zocdoc chat wiring. 6 bugs patched from v1.4.1 to v1.4.3 before handoff.",
                    img: "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
                    status: "RUNNING",
                  },
                  {
                    pid: "PID 3870 · 2024",
                    name: "SkynetJoe.com — AEO Engine",
                    desc: "Personal brand site rebuilt with Next.js standalone, AEO-ready schema, 6 mega-menu service groupings, and citation-layer for AI search. Deployed to Hostinger via zip upload (no auto-deploy).",
                    img: "CAFE-WORK-2026-03-29-closeup-laptop-sunglasses-valley-view.jpg",
                    status: "RUNNING",
                  },
                  {
                    pid: "PID 3641 · 2023",
                    name: "TakyCorp — Email Automation",
                    desc: "Fixed Gmail-limit bug + OOM + auto-deactivate crash in a live production email pipeline. Two outage cycles diagnosed and patched without downtime for client.",
                    img: "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
                    status: "MONITORING",
                  },
                  {
                    pid: "PID 3204 · 2023",
                    name: "IdeaViaggi — Trip Input System",
                    desc: "Custom WordPress CPT with security-hardened 5-agent review, GDPR phase 2, and CTM-based per-customer trip visibility. Built with real Inpsieme branding, not generic WP templates.",
                    img: "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
                    status: "RUNNING",
                  },
                  {
                    pid: "PID 2817 · 2022",
                    name: "Meta Ads — Dual Geo Launch",
                    desc: "US + Singapore campaign architecture: LPV-optimised ad sets, WhatsApp Conversations as the only reachable learning event, and niche creative for freight & clinic verticals.",
                    img: "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
                    status: "RUNNING",
                  },
                ].map((w, i) => (
                  <motion.div
                    key={i}
                    className="t06-work-row"
                    role="listitem"
                    initial={reduced ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <div className="t06-work-meta">
                      <span className="t06-work-pid">{w.pid}</span>
                      <div className="t06-work-name">{w.name}</div>
                      <p className="t06-work-desc">{w.desc}</p>
                      <span className="t06-work-status">{w.status}</span>
                    </div>
                    <div className="t06-work-img">
                      <img
                        src={`/img/pro/${w.img}`}
                        alt={w.name}
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── ABOUT / WHOAMI ─────────────────────────────── */}
            <section
              id="t06-about"
              className="t06-section"
              aria-labelledby="t06-h2-about"
            >
              <div className="t06-section-cmd">
                <span className="ps1">$</span>
                <h2 id="t06-h2-about" className="t06-section-h2">
                  whoami && cat ~/.profile
                </h2>
              </div>

              <div className="t06-about-grid">
                <div
                  className="t06-whoami-output"
                  role="table"
                  aria-label="Profile data"
                >
                  {[
                    { key: "name", val: "Waseem Nasir", type: "str" },
                    { key: "role", val: "Independent Founder", type: "str" },
                    { key: "org", val: "SkynetLabs", type: "str" },
                    {
                      key: "stack",
                      val: "n8n · Next.js · Twilio · OpenAI",
                      type: "list",
                    },
                    {
                      key: "specialty",
                      val: "kill busywork with automation",
                      type: "str",
                    },
                    { key: "operating_since", val: "2019", type: "num" },
                    {
                      key: "locations",
                      val: "Bali / Lahore (remote-first)",
                      type: "str",
                    },
                    {
                      key: "github",
                      val: "github.com/waseemnasir2k26",
                      type: "link",
                    },
                    {
                      key: "cta",
                      val: "skynetjoe.com/discovery-call",
                      type: "link",
                    },
                    { key: "availability", val: "open — book 30m", type: "ok" },
                  ].map((row) => (
                    <div key={row.key} className="t06-whoami-line" role="row">
                      <span className="key-col" role="cell">
                        {row.key}:
                      </span>
                      <span
                        className={`val-col ${row.type === "ok" ? "accent" : row.type === "num" ? "accent" : row.type === "link" ? "orange" : ""}`}
                        role="cell"
                      >
                        {row.type === "link" ? (
                          <a
                            href={
                              row.key === "github"
                                ? `https://${row.val}`
                                : `https://${row.val}`
                            }
                            style={{
                              color: "inherit",
                              textDecoration: "underline",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row.val}
                          </a>
                        ) : (
                          row.val
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="t06-about-portrait">
                  <img
                    src="/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg"
                    alt="Waseem Nasir — founder of SkynetLabs"
                  />
                  <div className="t06-about-portrait-overlay">
                    <div>
                      <span className="key">user: </span>
                      <span className="val">waseem</span>
                    </div>
                    <div>
                      <span className="key">loc: </span>
                      <span className="val">Bali, Indonesia</span>
                    </div>
                    <div>
                      <span className="key">mood: </span>
                      <span className="val">shipping</span>
                    </div>
                    <div>
                      <span className="key">OS: </span>
                      <span className="val">always-on</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── IMAGE STRIP ────────────────────────────────── */}
            <section aria-label="Field photos" style={{ paddingTop: "40px" }}>
              <div
                style={{
                  padding: "0 48px 12px",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px",
                  color: "#5A6358",
                }}
              >
                <span style={{ color: "#A3FF12" }}>$</span> ls -1
                ~/field-ops/*.jpg
              </div>
              <div className="t06-image-strip" role="list">
                {[
                  {
                    file: "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
                    label: "bali-rooftop-2026",
                  },
                  {
                    file: "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
                    label: "mountain-cafe-2026",
                  },
                  {
                    file: "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
                    label: "city-vista-2026",
                  },
                  {
                    file: "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
                    label: "cowork-night-2025",
                  },
                  {
                    file: "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
                    label: "city-lights-2026",
                  },
                  {
                    file: "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
                    label: "rainbow-mug-2026",
                  },
                  {
                    file: "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
                    label: "nusa-penida-2025",
                  },
                  {
                    file: "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
                    label: "neon-sign-2026",
                  },
                  {
                    file: "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
                    label: "meetup-bali-2026",
                  },
                ].map((img) => (
                  <div key={img.file} className="t06-strip-img" role="listitem">
                    <img
                      src={`/img/pro/${img.file}`}
                      alt={img.label.replace(/-/g, " ")}
                      loading="lazy"
                    />
                    <span className="t06-strip-label" aria-hidden="true">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA / CONTACT ──────────────────────────────── */}
            <section
              id="t06-contact"
              className="t06-section"
              aria-labelledby="t06-h2-contact"
            >
              <div className="t06-section-cmd">
                <span className="ps1">$</span>
                <h2 id="t06-h2-contact" className="t06-section-h2">
                  ./book-call --with waseem
                </h2>
              </div>

              <div className="t06-cta-block">
                <div className="t06-cta-scanline" aria-hidden="true" />

                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    color: "#5A6358",
                    marginBottom: "20px",
                  }}
                >
                  <ExecLine
                    cmd="ping skynetlabs.io --count 1"
                    reduced={reduced}
                  />
                </div>

                <h3 className="t06-cta-h2">
                  Your busywork is a <span className="acc">process bug</span>.
                  <br />I ship the fix in 30 minutes.
                </h3>

                <p className="t06-cta-desc">
                  Book a no-fluff discovery call. We map the manual work
                  that&apos;s costing you time, I tell you exactly how I&apos;d
                  automate it. No pitch deck, no agency theatre — just a
                  terminal session and a ship date.
                </p>

                <a
                  href="https://skynetjoe.com/discovery-call"
                  className="t06-cta-link"
                  aria-label="Book a 30-minute discovery call with Waseem Nasir"
                >
                  <span aria-hidden="true">▶</span>
                  ./book --duration 30m
                </a>

                <p className="t06-cta-note">
                  # async-friendly · remote-first · ships this week
                </p>
              </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────── */}
            <footer className="t06-footer" role="contentinfo">
              <span>waseem@skynetlabs — uptime since 2019</span>
              <span>
                <a
                  href="https://github.com/waseemnasir2k26"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                >
                  github.com/waseemnasir2k26
                </a>
                {"  "}·{"  "}
                <a
                  href="https://skynetjoe.com/discovery-call"
                  aria-label="Book a discovery call"
                >
                  skynetjoe.com/discovery-call
                </a>
              </span>
              <span>exit 0</span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}

/* ─── HERO TYPEWRITER (compound) ────────────────────────────── */
function HeroTypewriter({ reduced }: { reduced: boolean }) {
  const lines = ["$ ./waseem --build automation", '--status "always shipping"'];
  const full = lines[0] + "\n" + lines[1];
  const { displayed, done } = useTypewriter(full, 32, 600, reduced);

  const parts = displayed.split("\n");
  return (
    <>
      <span style={{ display: "block" }}>
        <span style={{ color: "#A3FF12" }}>$</span>{" "}
        <span style={{ color: "#C9D1C9" }}>
          {parts[0]?.replace(/^\$ /, "") ?? ""}
        </span>
      </span>
      {parts[1] !== undefined && (
        <span
          style={{ display: "block", paddingLeft: "18px", color: "#FF6B35" }}
        >
          {parts[1]}
          {!done && <span className="t06-caret" aria-hidden="true" />}
        </span>
      )}
      {done && parts[1] === undefined && (
        <span className="t06-caret" aria-hidden="true" />
      )}
    </>
  );
}
