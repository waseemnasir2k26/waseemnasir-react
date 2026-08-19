/* ============================================================
   /v/forge — brand tokens
   Same palette as the live homepage (app/v/blueprint/BlueprintClient.tsx):
   paper #FBFCFD, jade #117E73, ink-jade #0A3D38.
   TRUTH LOCK: the only numbers this variant renders are the four locked
   canon stats below, reused verbatim from Blueprint's hero stat strip.
   ============================================================ */

export const C = {
  canvas: "#FBFCFD",
  surface: "#F4F8F7",
  card: "#FFFFFF",
  ink: "#0E1B1A",
  body: "#3C4744",
  mute: "#5B6764",
  hairline: "#E2EAE8",
  accent: "#117E73",
  accentDeep: "#0A3D38",
  accentTint: "#E2F1EE",
  pillInk: "#0C5F57",
  live: "#15A06B",
  onDeep: "#EAF4F1",
} as const;

export const SHADOW = {
  sm: "0 1px 2px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  md: "0 8px 24px rgba(8,40,38,0.08), 0 0 0 1px rgba(8,40,38,0.05)",
  lg: "0 24px 48px rgba(8,40,38,0.10), 0 0 0 1px rgba(8,40,38,0.05)",
} as const;

export const EASE = [0.16, 1, 0.3, 1] as const;

/* Verbatim from BlueprintClient.tsx — never edit these numbers here. */
export const CTA = "https://skynetjoe.com/discovery-call";
export const H1 =
  "Every hour your team works by hand, your business leaks money.";
export const KICKER =
  "AI automation that pays for itself · for service businesses & stores";
export const SUB =
  "Leads ghost. Follow-ups slip. Your team drowns in repetitive ops. I'm Waseem Nasir, founder of SkynetLabs — I find where your business bleeds time and money, then build the systems that stop it.";
export const CTA_LABEL = "Book a free audit";

/* Locked canon stats — 180+ / 40+ / 9 / 2019. Do not add, round, or invent
   any other figure anywhere in this variant. */
export const STATS = [
  { to: 180, suffix: "+", label: "workflows shipped" },
  { to: 40, suffix: "+", label: "sites delivered" },
  { to: 9, suffix: "", label: "countries served" },
  { to: 2019, suffix: "", label: "building since", isYear: true },
] as const;

/* Build-beat captions — truthful capability voice, no invented metric. */
export const BUILD_CAPTIONS = [
  "Manual work goes in.",
  "A system comes out.",
  "It runs while you sleep.",
] as const;

/* Real trust-board projects, reused verbatim from BlueprintClient.tsx CLIENTS. */
export const PROJECTS = [
  {
    name: "Insurance retainer client",
    sub: "Inbox, auto-handled",
    mech: "n8n · Gmail triage · auto-reply",
    status: "LIVE" as const,
  },
  {
    name: "idea-viaggi / KODIASIMMO",
    sub: "Per-customer access",
    mech: "WordPress · per-user trip gate",
    status: "DELIVERED" as const,
  },
  {
    name: "Christelle",
    sub: "Care intake, automated",
    mech: "WhatsApp · intake flow · 24/7",
    status: "LIVE" as const,
  },
  {
    name: "Dental practice (demo build)",
    sub: "Front desk, automated",
    mech: "Booking · reminders · auto-reply",
    status: "DEMO" as const,
  },
  {
    name: "Insurance client · ops",
    sub: "Ops dashboard, real-time",
    mech: "Next.js · live metrics · alerts",
    status: "LIVE" as const,
  },
  {
    name: "SkynetLabs · voice",
    sub: "Calls answered by AI",
    mech: "Vapi · GHL · lead follow-up calls",
    status: "INTERNAL" as const,
  },
] as const;
