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
  ground: "#0A2E2B", // darkened/desaturated 08-27 grade pass — recede, don't read as felt
  paper: "#FBFCFD",
  card: "#0F2E2A",
  ink: "#EAF4F1",
  body: "#B9CFC9",
  mute: "#7FA69D",
  hairline: "rgba(234,244,241,0.14)",
  jade: "#117E73",
  jadeBright: "#1FE7C7",
  inkJade: "#071F1D", // darkened 08-27 grade pass — buildings/ground base must read as ink even under the warm sun-side rim, 3D-only (never an HTML surface, verified)
  jadeTint: "rgba(17,126,115,0.18)",
  live: "#15A06B",
  onDeep: "#EAF4F1",
} as const;

/* Dusk warm ramp — SHADER/CANVAS ONLY. Deliberately desaturated
   (muted terracotta -> plum haze -> jade-ink), never neon-orange
   "AI-slop sunset" territory, and only ever visible for the first
   ~30% of scroll before the cycle folds back into C.skyDark. NEVER
   reference these in any HTML/Scrim/card — those stay on C above.

   Re-graded 08-27 (Meridian grade pass): the original trio read as
   pastel/washed once ACES tone mapping and the fog band got hold of
   it (beige haze, not a low-sun gradient). Deepened + desaturated
   each stop so the ramp reads as one deliberate low-sun dusk rather
   than a bright sky dissolving into mush at distance. */
export const DUSK = {
  duskA: "#D9A972", // warm horizon haze, deepened amber (not pastel beige)
  // Round-2 fix (08-27, jury MINOR #4): was "#96604A", a muddy terracotta
  // that leaned mauve/pink once blended toward duskC at the 25% scroll
  // stop, reading as under-rendered rather than a deliberate dusk beat.
  // Re-keyed warmer/more amber (less brown/pink) so the 25% stop still
  // reads as the SAME established amber-dusk ramp as duskA, not a
  // separate cool-toned haze.
  duskB: "#C2814A", // mid-sky amber-terracotta, warmer than before
  duskC: "#28353D", // upper-sky ink-slate, folds into skyDark
} as const;

/* Warm ignition colour — ordinary city lighting (windows, streetlamps).
   Deliberately distinct from C.jadeBright, which is reserved for the
   SkynetLabs "systems" signal (stack-district towers, proof beacons,
   light-bridges, the last dark window). Two intentional families —
   warm inhabited city + cool brand-accent glow — instead of one teal
   note bleeding into everything else. SHADER/CANVAS ONLY, same rule
   as DUSK above. */
export const WARM = {
  windowBright: "#F3C57E",
  lampBright: "#F0B15C",
} as const;

export const CTA_URL = "https://skynetjoe.com/discovery-call";

/* H1 + subhead.

   DELIBERATE DIVERGENCE from the homepage mirror (2026-08-21, Waseem's
   call): this preview tests the harder replacement pitch instead of the
   softer "leaks money" framing. The homepage strings are kept verbatim
   below as H1_HOMEPAGE / SUB_HOMEPAGE so promotion or rollback is a
   one-line swap, and so the parity rule is visible rather than lost.

   TRUTH NOTE — this is a first-party claim about SkynetLabs' OWN offer
   ("here is what we build"), which the positioning canon explicitly
   sanctions. It is NOT a claim that any named client cut headcount;
   no such outcome has been delivered, so none is stated. Do not add
   a client name, a headcount, or a saving figure to these strings. */
export const H1 = "Stop paying people to do what a system should do.";
export const SUB =
  "Intake, follow-up, scheduling, reporting, publishing — the repeatable work sitting behind a 30-to-50 person back office can run as one AI system that learns from every job it handles. I'm Waseem Nasir, founder of SkynetLabs. I find where your business bleeds hours, then build the system that takes them back. You keep the people who actually think.";

/** Live-homepage strings, kept verbatim for promotion/rollback parity. */
export const H1_HOMEPAGE =
  "Every hour your team works by hand, your business leaks money.";
export const SUB_HOMEPAGE =
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
