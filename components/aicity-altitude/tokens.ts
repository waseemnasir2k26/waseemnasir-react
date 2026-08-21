/* ============================================================
   ALTITUDE ZERO — shared tokens + verbatim copy
   Self-contained: nothing here is imported by any other route.
   Sibling world to /v/skyline (components/skyline/tokens.ts) —
   identical brand tokens + identical locked copy/numbers, same
   night-jade palette (the concept's palette journey is cloud-paper
   white -> jade night street, achieved via fog/lighting, not new
   color tokens). Do not invent new copy or numbers here.
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
} as const;

export const CTA_URL = "https://skynetjoe.com/discovery-call";

/* H1 + subhead.

   DELIBERATE DIVERGENCE from the homepage mirror (2026-08-21, Waseem's
   call) — same divergence as /v/ai-city, written for THIS concept's
   descent thesis (you fall past the departments one by one). Homepage
   strings preserved below for promotion/rollback parity.

   TRUTH NOTE — first-party claim about SkynetLabs' own offer, which the
   positioning canon sanctions. NOT a claim that a named client removed
   staff; no such outcome exists, so none is stated. Never attach a
   client name, headcount, or saving figure to these strings. */
export const H1 = "Every floor of this city used to be somebody's job.";
export const SUB =
  "Intake. Follow-up. Scheduling. Reporting. Publishing. Fall past each one and watch it run without a person in the seat — one AI system, wired end to end, getting sharper every job it handles. I'm Waseem Nasir, founder of SkynetLabs. I replace whole roles with systems, not another hire.";

/** Live-homepage strings, kept verbatim for promotion/rollback parity. */
export const H1_HOMEPAGE =
  "Every hour your team works by hand, your business leaks money.";
export const SUB_HOMEPAGE =
  "Leads ghost. Follow-ups slip. Your team drowns in repetitive ops. I'm Waseem Nasir, founder of SkynetLabs — I find where your business bleeds time and money, then build the systems that stop it.";
export const CTA_LABEL = "Book a free audit";

/* The 4 LOCKED proof numbers — verbatim, single source of truth is
   components/site.ts PROOF. Mirrored here (not imported) to keep this
   route fully self-contained per scope rules; values must stay identical.
   2019 never counts up (roll:false) — locked rule. */
export const PROOF = [
  { value: 180, suffix: "+", label: "workflows built" },
  { value: 40, suffix: "+", label: "sites shipped" },
  { value: 9, suffix: "", label: "countries served" },
  { value: 2019, suffix: "", label: "in practice since", roll: false },
] as const;

/* Work case cards — verbatim from components/skyline/tokens.ts. Reused as
   the Broadcast Basin placard's four locked case cards, and the first
   entry (idea-viaggi/KODIASIMMO) doubles as the Portal Quarter feature
   card. Dental card keeps "a demo build, not a paid client" verbatim
   (spec-demo truth rule) — never edit this string. */
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

/* Utilities strip — Site A's 5 real stack tools, reused verbatim from
   components/skyline/tokens.ts STACK, framed as district utilities per
   the concept's Section Treatment: "five landmark towers, one system,"
   city language for the existing claim only — nothing invented. */
export const UTILITIES = [
  { id: "n8n", tag: "POWER", label: "n8n", sub: "Workflow engine" },
  { id: "whatsapp", tag: "WATER", label: "WhatsApp", sub: "Intake & bots" },
  { id: "wordpress", tag: "ROADS", label: "WordPress", sub: "Client sites" },
  { id: "ghl", tag: "TRANSIT", label: "GHL", sub: "Pipelines & CRM" },
  { id: "ai", tag: "GRID", label: "AI core", sub: "Agents & automation" },
] as const;

/* The four descent districts — order = fall order, altLabel/survey text
   drive both the HTML placard headers and the Altimeter Rail nav.
   Building heights below (in SceneObjects.ts) are explicitly decorative,
   never tied to these numbers — same honesty rule as skyline, carried
   over verbatim. */
export const DISTRICTS = [
  {
    id: "signal",
    order: 1,
    name: "Signal Heights",
    altLabel: "1700–1200M",
    survey: "DISTRICT 01 · SIGNAL HEIGHTS · ALT 1700–1200M",
    landmark: "The Signal Spire",
    pitch:
      "Lead response & inbox automation: every lead answered before it goes cold.",
  },
  {
    id: "pipeline",
    order: 2,
    name: "Pipeline Row",
    altLabel: "1200–800M",
    survey: "DISTRICT 02 · PIPELINE ROW · ALT 1200–800M",
    landmark: "Pipeline Row HQ",
    pitch: "Ops & CRM follow-up: first touch to close, no human relay.",
  },
  {
    id: "portal",
    order: 3,
    name: "Portal Quarter",
    altLabel: "800–450M",
    survey: "DISTRICT 03 · PORTAL QUARTER · ALT 800–450M",
    landmark: "The Portal Gate",
    pitch: "Per-customer portals: each client walks through their own door.",
  },
  {
    id: "broadcast",
    order: 4,
    name: "Broadcast Basin",
    altLabel: "450–150M",
    survey: "DISTRICT 04 · BROADCAST BASIN · ALT 450–150M",
    landmark: "The Cutting House",
    pitch: "AI video editing & publishing — whole videos cut with Claude Code.",
  },
] as const;

export const EASE = [0.16, 1, 0.3, 1] as const;
