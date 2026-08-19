/* ============================================================
   TIMELINE — shared tokens + verbatim copy
   Self-contained: nothing here is imported by any other route.
   Colors match the blueprint variant (paper canvas / jade accent)
   per brand-messaging.md — do not invent new brand colors here.

   TRUTH LOCK — this world tells time, so it is held to a tighter
   rule than orbit/forge: the ONLY dated/quantified facts allowed
   anywhere in this route are:
     1. "2019 — started" (canonical, matches PROOF[3] below)
     2. The three other locked PROOF numbers (180+ / 40+ / 9),
        presented ONLY as current totals "so far" — never split
        into a per-year breakdown, because no such breakdown
        exists in components/site.ts and inventing one would be
        a fabricated metric.
     3. STACK and WORK below, reused verbatim from orbit's copy,
        presented with NO years attached — "along the way", not
        "in <year>". WORK already carries no date field; do not
        add one.
   ============================================================ */

export const C = {
  paper: "#FBFCFD",
  surface: "#F4F8F7",
  card: "#FFFFFF",
  ink: "#0E1B1A",
  body: "#3C4744",
  mute: "#5B6764",
  hairline: "#E2EAE8",
  jade: "#117E73",
  inkJade: "#0A3D38",
  jadeTint: "#E2F1EE",
  live: "#15A06B",
  onDeep: "#EAF4F1",
} as const;

export const CTA_URL = "https://skynetjoe.com/discovery-call";

/* H1 + subhead — verbatim from the live homepage (app/v/blueprint/BlueprintClient.tsx Hero) */
export const H1 =
  "Every hour your team works by hand, your business leaks money.";
export const SUB =
  "Leads ghost. Follow-ups slip. Your team drowns in repetitive ops. I'm Waseem Nasir, founder of SkynetLabs — I find where your business bleeds time and money, then build the systems that stop it.";
export const CTA_LABEL = "Book a free audit";

/* The 4 LOCKED proof numbers — verbatim, single source of truth is
   components/site.ts PROOF. Mirrored here (not imported) to keep this
   route fully self-contained per scope rules; values must stay identical.
   Presented in THE PRESENT PLATFORM scene as current totals "so far" —
   never as a per-year ledger. */
export const PROOF = [
  { value: 180, suffix: "+", label: "workflows built" },
  { value: 40, suffix: "+", label: "sites shipped" },
  { value: 9, suffix: "", label: "countries served" },
  { value: 2019, suffix: "", label: "in practice since", roll: false },
] as const;

/* Stack — his real, named tooling (matches "n8n flows, Next.js, Stripe,
   WhatsApp bots, Meta CAPI, WordPress, AEO" from brand-messaging.md §1).
   Docked onto the rail as capabilities gained — deliberately NO years
   attached to any single entry; order is presentation only, not a timeline
   of when each was adopted (that year-by-year data doesn't exist). */
export const STACK = [
  { id: "n8n", label: "n8n", sub: "Workflow engine" },
  { id: "whatsapp", label: "WhatsApp", sub: "Intake & bots" },
  { id: "wordpress", label: "WordPress", sub: "Client sites" },
  { id: "ghl", label: "GHL", sub: "Pipelines & CRM" },
  { id: "ai", label: "AI core", sub: "Agents & automation" },
] as const;

/* Milestone markers — reused verbatim from BlueprintClient's CASES /
   DentalTile content (same source orbit draws from). No date field exists
   on this data and none is added — these stand beside the rail as
   undated "along the way" monuments. */
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
