/* ============================================================
   SIGNALGRID — shared tokens + verbatim copy
   Self-contained: nothing here is imported by any other route.
   Extends components/skyline/tokens.ts `C` VERBATIM (same night
   palette, same fonts, same EASE, same locked copy/numbers) and
   adds three ADDITIVE-ONLY signal tokens per the approved spec.
   Do not invent new copy or numbers here.
   ============================================================ */

export const C = {
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

  /* SIGNALGRID additions — additive only, everything else is `C` verbatim */
  signalDim: "rgba(31,231,199,0.22)",
  signalHot: "#7FFFE9",
  gridHair: "rgba(17,126,115,0.30)",

  /* HOLOGRAPHIC pass additions — additive only, one warm secondary accent
     so the frame isn't monochrome teal. Amber marks REAL client traffic
     (the "honest" lanes) so the colour split is legible, not decorative. */
  signalAmber: "#FFB870",
  glassFillDim: "rgba(17,126,115,0.05)",
} as const;

export const CTA_URL = "https://skynetjoe.com/discovery-call";

/* H1 + subhead — verbatim, mirrored from components/skyline/tokens.ts. */
export const H1 =
  "Every hour your team works by hand, your business leaks money.";
export const SUB =
  "Leads ghost. Follow-ups slip. Your team drowns in repetitive ops. I'm Waseem Nasir, founder of SkynetLabs — I find where your business bleeds time and money, then build the systems that stop it.";
export const CTA_LABEL = "Book a free audit";

/* The 4 LOCKED proof numbers — verbatim, single source of truth is
   components/site.ts PROOF. Mirrored here for route self-containment. */
export const PROOF = [
  { value: 180, suffix: "+", label: "workflows built" },
  { value: 40, suffix: "+", label: "sites shipped" },
  { value: 9, suffix: "", label: "countries served" },
  { value: 2019, suffix: "", label: "in practice since", roll: false },
] as const;

/* STACK — 5 landmark towers, the highest-degree nodes in the grid.
   n8n sits center — the architecture diagram IS the skyline. */
export const STACK = [
  { id: "n8n", label: "n8n", sub: "Workflow engine" },
  { id: "whatsapp", label: "WhatsApp", sub: "Intake & bots" },
  { id: "wordpress", label: "WordPress", sub: "Client sites" },
  { id: "ghl", label: "GHL", sub: "Pipelines & CRM" },
  { id: "ai", label: "AI core", sub: "Agents & automation" },
] as const;

/* SITE A service towers — the four TOWER FLYBYS district. Locked pitches
   from the approved SIGNALGRID concept spec, verbatim. */
export const SERVICES = [
  {
    id: "exchange",
    district: "DISTRICT 01",
    label: "The Exchange",
    kicker: "Lead response / inbox automation",
    pitch: "Every lead answered before it goes cold.",
  },
  {
    id: "gatehouse",
    district: "DISTRICT 02",
    label: "The Gatehouse",
    kicker: "Per-customer portals",
    pitch:
      "Each customer sees only their own floor — ~20 gated trip pages in production.",
  },
  {
    id: "relayyard",
    district: "DISTRICT 03",
    label: "The Relay Yard",
    kicker: "Ops automation / CRM follow-up",
    pitch: "First touch to close, moved automatically between your tools.",
  },
  {
    id: "speaker",
    district: "DISTRICT 04",
    label: "The Speaker",
    kicker: "Voice agents",
    pitch: "Follow-up calls that happen while you sleep — Vapi + GHL.",
  },
] as const;

/* WORK — named clients, WORKS BOULEVARD. Reused verbatim from
   components/skyline/tokens.ts. Dental renders in a distinct dashed
   stroke everywhere (3D + SVG) — the spec-demo truth rule made visual. */
export const WORK = [
  {
    id: "idea-viaggi",
    client: "idea-viaggi / KODIASIMMO",
    outcome: "Per-user trip authorization, delivered.",
    metric: "~20 trips",
    note: "each gated so a customer sees only what they booked.",
    mech: "Per-customer trip access",
    status: "DELIVERED" as const,
    dashed: false,
  },
  {
    id: "insurance",
    client: "Insurance retainer client",
    outcome: "Inbound email, handled for them.",
    metric: "0",
    note: "messages left waiting — triage + auto-reply runs the inbox.",
    mech: "Inbox triage + auto-reply",
    status: "LIVE" as const,
    dashed: false,
  },
  {
    id: "christelle",
    client: "Christelle",
    outcome: "Care intake, handled for them.",
    metric: "24/7",
    note: "first-response handled around the clock.",
    mech: "Care intake, automated",
    status: "LIVE" as const,
    dashed: false,
  },
  {
    id: "dental",
    client: "Dental practice",
    outcome: "Front desk, automated — a demo build, not a paid client.",
    metric: "Demo",
    note: "booking + reminders + auto-reply.",
    mech: "Front desk, automated",
    status: "DEMO" as const,
    dashed: true,
  },
] as const;

export const EASE = [0.16, 1, 0.3, 1] as const;

/* Honesty layer — locked mono chip copy, carried on every real client lane. */
export const LANE_HONESTY_CHIP = "1 pulse = 1 handled message (illustrative)";

/* The Leak — the one deliberately broken lane in the entry grid. */
export const LEAK_CHIP = "This is the leak. Manual handoff. Data dies here.";
