/* ============================================================
   SKYLINE — shared tokens + verbatim copy
   Self-contained: nothing here is imported by any other route.
   Sibling world to /v/orbit (components/orbit/tokens.ts) — same
   copy, same locked numbers, night-city palette instead of
   paper/glass. Do not invent new copy or numbers here.
   ============================================================ */

export const C = {
  // Night sky / haze — a dark ink-jade base with a pale paper-colored
  // fog doing the "city lights bleaching the night air" glow at range.
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

/* H1 + subhead — verbatim from the live homepage (app/v/blueprint/BlueprintClient.tsx Hero),
   mirrored via components/orbit/tokens.ts; must stay identical. */
export const H1 =
  "Every hour your team works by hand, your business leaks money.";
export const SUB =
  "Leads ghost. Follow-ups slip. Your team drowns in repetitive ops. I'm Waseem Nasir, founder of SkynetLabs — I find where your business bleeds time and money, then build the systems that stop it.";
export const CTA_LABEL = "Book a free audit";

/* The 4 LOCKED proof numbers — verbatim, single source of truth is
   components/site.ts PROOF. Mirrored here (not imported) to keep this
   route fully self-contained per scope rules; values must stay identical. */
export const PROOF = [
  { value: 180, suffix: "+", label: "workflows built" },
  { value: 40, suffix: "+", label: "sites shipped" },
  { value: 9, suffix: "", label: "countries served" },
  { value: 2019, suffix: "", label: "in practice since", roll: false },
] as const;

/* Stack — his real, named tooling. Reused verbatim from components/orbit/tokens.ts
   as the 5 labeled landmark towers in THE STACK DISTRICT. */
export const STACK = [
  { id: "n8n", label: "n8n", sub: "Workflow engine" },
  { id: "whatsapp", label: "WhatsApp", sub: "Intake & bots" },
  { id: "wordpress", label: "WordPress", sub: "Client sites" },
  { id: "ghl", label: "GHL", sub: "Pipelines & CRM" },
  { id: "ai", label: "AI core", sub: "Agents & automation" },
] as const;

/* Work billboards — reused verbatim from components/orbit/tokens.ts (originally
   BlueprintClient's CASES / DentalTile content) as the WORKS BOULEVARD signs. */
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
