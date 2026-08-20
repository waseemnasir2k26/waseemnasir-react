/* ============================================================
   MERIDIAN — shared tokens + verbatim copy for /v/ai-city.
   Self-contained: nothing here is imported by any other route.
   Evolves components/skyline/tokens.ts (same night palette, same
   locked copy/numbers) plus a warm, DESATURATED dusk ramp used
   ONLY by the shader/JS sky-lerp in MeridianCanvas — never by any
   HTML surface. Do not invent new copy or numbers here.
   ============================================================ */

export const C = {
  // Night sky / haze — identical to skyline, the state the whole
  // cycle lands on and stays on for every HTML surface.
  skyDark: "#03110F",
  ground: "#0A3D38",
  paper: "#FBFCFD",
  card: "#0F2E2A",
  ink: "#EAF4F1",
  body: "#B9CFC9",
  mute: "#7FA69D",
  hairline: "rgba(234,244,241,0.14)",
  jade: "#117E73",
  jadeBright: "#1FE7C7",
  inkJade: "#0A3D38",
  jadeTint: "rgba(17,126,115,0.18)",
  live: "#15A06B",
  onDeep: "#EAF4F1",
} as const;

/* Dusk warm ramp — SHADER/CANVAS ONLY. Deliberately desaturated
   (muted terracotta -> plum haze -> jade-ink), never neon-orange
   "AI-slop sunset" territory, and only ever visible for the first
   ~30% of scroll before the cycle folds back into C.skyDark. NEVER
   reference these in any HTML/Scrim/card — those stay on C above. */
export const DUSK = {
  duskA: "#E9C9A6", // warm horizon haze, muted (not saturated peach)
  duskB: "#B87A5C", // mid-sky terracotta, desaturated
  duskC: "#3B4A52", // upper-sky plum-slate, folds into skyDark
} as const;

export const CTA_URL = "https://skynetjoe.com/discovery-call";

/* H1 + subhead — verbatim, mirrored from components/skyline/tokens.ts
   (source of truth: live homepage Hero). Must stay identical. */
export const H1 =
  "Every hour your team works by hand, your business leaks money.";
export const SUB =
  "Leads ghost. Follow-ups slip. Your team drowns in repetitive ops. I'm Waseem Nasir, founder of SkynetLabs — I find where your business bleeds time and money, then build the systems that stop it.";
export const CTA_LABEL = "Book a free audit";

/* Hero mono cue — approved ADDITION 1 ("Close the Office"). Not a
   dated deadline (it's a fictional clock-of-day, not a calendar date) —
   ties the scroll affordance to the day/night thesis in six words. */
export const HERO_CUE = "IT'S 4:52 PM — SCROLL TO CLOSE THE OFFICE";

/* The 4 LOCKED proof numbers — verbatim, single source of truth is
   components/site.ts PROOF. Mirrored (not imported) to keep this
   route fully self-contained per scope rules; values must stay identical. */
export const PROOF = [
  { value: 180, suffix: "+", label: "workflows built" },
  { value: 40, suffix: "+", label: "sites shipped" },
  { value: 9, suffix: "", label: "countries served" },
  { value: 2019, suffix: "", label: "in practice since", roll: false },
] as const;

/* THE STACK DISTRICT — Site A's 5 landmark towers, this concept's own
   building->service map (approved concept content, distinct from
   skyline's STACK which names raw tools). Pitches are original one-
   liners describing real offerings, not invented metrics. */
export const DISTRICT = [
  {
    id: "switchboard",
    name: "The Switchboard",
    service: "Lead response / inbox automation",
    pitch: "Every lead answered before it goes cold.",
  },
  {
    id: "gatehouse",
    name: "The Gatehouse",
    service: "Per-customer portals",
    pitch: "Each customer sees only their own door.",
  },
  {
    id: "conveyor",
    name: "The Conveyor",
    service: "Ops automation / CRM follow-up",
    pitch: "First touch to close, nothing dropped.",
  },
  {
    id: "radio-mast",
    name: "The Radio Mast",
    service: "Voice agents",
    pitch: "It picks up when you can't.",
  },
  {
    id: "projection-house",
    name: "The Projection House",
    service: "AI video editing / publishing",
    pitch: "Whole videos edited overnight — 10 vlogs in one batch.",
  },
] as const;

/* Work billboards — reused verbatim from components/skyline/tokens.ts
   (WORKS BOULEVARD). Locked claims only; dental stays explicitly a demo. */
export const WORK = [
  {
    client: "idea-viaggi / KODIASIMMO",
    outcome: "Per-user trip authorization, delivered.",
    metric: "~20 trips",
    note: "each gated so a customer sees only what they booked.",
    mech: "Per-customer trip access",
    status: "DELIVERED" as const,
  },
  {
    client: "Insurance retainer client",
    outcome: "Inbound email, handled for them.",
    metric: "0",
    note: "messages left waiting — triage + auto-reply runs the inbox.",
    mech: "Inbox triage + auto-reply",
    status: "LIVE" as const,
  },
  {
    client: "Christelle",
    outcome: "Care intake, handled for them.",
    metric: "24/7",
    note: "first-response handled around the clock.",
    mech: "Care intake, automated",
    status: "LIVE" as const,
  },
  {
    client: "Dental practice",
    outcome: "Front desk, automated — a demo build, not a paid client.",
    metric: "Demo",
    note: "booking + reminders + auto-reply.",
    mech: "Front desk, automated",
    status: "DEMO" as const,
  },
] as const;

export const EASE = [0.16, 1, 0.3, 1] as const;

/* ── The 6 stages of the compressed day. clock/label drive both the
   fictional clock-strip nav (ADDITION 2) and each section's mono
   time-of-day header stamp. Fictional clock aesthetic only — never a
   real calendar deadline. ── */
export const STAGES = [
  { id: "golden", clock: "17:42", label: "GOLDEN HOUR" },
  { id: "sunset", clock: "19:06", label: "SUNSET" },
  { id: "dusk", clock: "20:15", label: "DUSK" },
  { id: "nightfall", clock: "21:30", label: "NIGHTFALL" },
  { id: "deep", clock: "22:48", label: "DEEP NIGHT" },
  { id: "midnight", clock: "23:58", label: "MIDNIGHT" },
] as const;

export type StageId = (typeof STAGES)[number]["id"];
