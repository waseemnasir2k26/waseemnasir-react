/* ============================================================
   /v/347 — "3:47 AM — The City That Works While You Sleep"
   Shared tokens: colors, locked copy, beat timeline.

   CLAIMS LOCK — verbatim only, never rephrase/invent a number:
   180+ workflows · 40+ sites · 9 countries · since 2019 ·
   ~20 trips · 0 emails waiting · 24/7 care intake ·
   voice agents IN BUILD · lead nurture RUNNING.
   ============================================================ */

export const CTA_URL = "https://www.waseemnasir.com/book";
export const CTA_LABEL = "Book a free audit";

export const C = {
  ink: "#F2F7F5",
  body: "rgba(245,242,234,0.82)",
  mute: "rgba(245,242,234,0.56)",
  amber: "#FFB35C",
  amberBright: "#FFD48A",
  gold: "#F2A65A",
  hairline: "rgba(245,242,234,0.14)",
  glass: "rgba(6,10,18,0.42)",
};

/** Real clock start/end for the scroll-scrubbed night, in minutes since
    midnight — 03:47 -> 06:58 (191 total minutes). Every beat marker
    below is this same minute value converted to a 0-1 progress
    fraction, so the clock readout and the scene timeline can never
    drift apart. */
export const START_MIN = 3 * 60 + 47; // 227
export const END_MIN = 6 * 60 + 58; // 418
export const SPAN_MIN = END_MIN - START_MIN; // 191

export function minutesToProgress(min: number): number {
  return (min - START_MIN) / SPAN_MIN;
}

export function progressToClock(p: number): {
  hh: string;
  mm: string;
  ss: string;
} {
  const clamped = Math.min(1, Math.max(0, p));
  const totalSeconds = (START_MIN + clamped * SPAN_MIN) * 60;
  const hh = Math.floor(totalSeconds / 3600) % 24;
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = Math.floor(totalSeconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { hh: pad(hh), mm: pad(mm), ss: pad(ss) };
}

export type Beat = {
  id: string;
  min: number;
  p: number;
  clock: string;
  eyebrow: string;
  line: string;
  sub?: string;
  counters?: string;
};

export const BEATS: Beat[] = [
  {
    id: "hook",
    min: START_MIN,
    p: 0,
    clock: "03:47",
    eyebrow: "",
    line: "While you sleep, my systems are working.",
  },
  {
    id: "lead-nurture",
    min: 4 * 60 + 10,
    p: minutesToProgress(4 * 60 + 10),
    clock: "04:10",
    eyebrow: "LEAD NURTURE ENGINE",
    line: "Lead Nurture Engine — running right now.",
    sub: "Replies in minutes, not mornings.",
  },
  {
    id: "harbor",
    min: 4 * 60 + 40,
    p: minutesToProgress(4 * 60 + 40),
    clock: "04:40",
    eyebrow: "TRAVEL PORTAL",
    line: "Travel portal — ~20 trips booked while the owner slept.",
  },
  {
    id: "inbox-tower",
    min: 5 * 60 + 15,
    p: minutesToProgress(5 * 60 + 15),
    clock: "05:15",
    eyebrow: "INSURANCE INBOX",
    line: "Insurance inbox — 0 emails waiting at open.",
    counters: "180+ workflows · 40+ sites · 9 countries · since 2019",
  },
  {
    id: "clinic",
    min: 5 * 60 + 45,
    p: minutesToProgress(5 * 60 + 45),
    clock: "05:45",
    eyebrow: "24/7 CARE INTAKE",
    line: "24/7 care intake — the phone answers itself.",
    sub: "Voice agents in build. CRM end-to-end. Slack chief-of-staff. AI video pipeline.",
  },
  {
    id: "sunrise",
    min: 6 * 60 + 20,
    p: minutesToProgress(6 * 60 + 20),
    clock: "06:20",
    eyebrow: "",
    line: "By the time you wake up, it's already done.",
  },
  {
    id: "cta",
    min: END_MIN,
    p: 1,
    clock: "06:58",
    eyebrow: "",
    line: "Tell me what you do manually. I'll show you what the city can run.",
  },
];

export const PORTRAIT_SRC =
  "/img/pro/PORTRAIT-travertine-wall-sky-headshot-flowers.jpg";
export const CREDENTIAL_LINE =
  "Founder, SkynetLabs — automation systems, since 2019";

export const OPENING_LINE = "While you sleep, my systems are working.";
export const SCROLL_HINT = "scroll to sunrise";
