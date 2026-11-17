/* ============================================================
   DESIGN SYSTEM — single source of truth for waseemnasir.com
   Premium-minimal founder site: warm-neutral light canvas, ONE accent
   (smoky jade), ink text, hairlines instead of boxes, soft radii,
   generous whitespace, headings 600+.
   Consumed by: components/home/BlueprintClient, app/blog/_ui (shell +
   prose), components/ui/system, app/mentorship.
   ============================================================ */

/* ─── Color ─── */
export const C = {
  canvas: "#FBFCFD",
  surface: "#F4F8F7",
  card: "#FFFFFF",
  ink: "#0E1B1A", // headings           (contrast on canvas ~17:1)
  body: "#3C4744", // body copy          (~9.6:1)
  mute: "#5B6764", // labels, captions   (~5.9:1, AA)
  hairline: "#E2EAE8",
  accent: "#117E73", // the one accent     (~5.3:1 on canvas, AA)
  accentDeep: "#0A3D38", // depth band / featured card
  accentTint: "#E2F1EE",
  pillInk: "#0C5F57",
  live: "#15A06B",
  onDeep: "#EAF4F1",
} as const;

/* ─── Elevation (one soft family; no neon glows) ─── */
export const SHADOW = {
  sm: "0 1px 2px rgba(8,40,38,0.06)",
  md: "0 8px 24px rgba(8,40,38,0.07)",
  lg: "0 24px 48px rgba(8,40,38,0.09)",
} as const;

/* ─── Shape ─── */
export const RADIUS = { sm: 10, md: 16, lg: 24 } as const;

/* ─── Spacing: one section rhythm + one shell width ─── */
export const SHELL = "mx-auto w-full max-w-[1200px] px-5 sm:px-6";
export const SECTION_Y = "py-20 sm:py-28 lg:py-32";

/* ─── Type scale (inline-style objects; all headings are 600+) ─── */
export const TYPE = {
  h1: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "clamp(2.4rem, 5.4vw, 4rem)",
    lineHeight: 1.04,
    letterSpacing: "-0.03em",
    color: C.ink,
  },
  h2: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
    lineHeight: 1.08,
    letterSpacing: "-0.026em",
    color: C.ink,
  },
  h3: {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "clamp(1.15rem, 1.4vw, 1.35rem)",
    lineHeight: 1.22,
    letterSpacing: "-0.015em",
    color: C.ink,
  },
  lead: {
    fontSize: "clamp(1.0625rem, 1.3vw, 1.2rem)",
    lineHeight: 1.65,
    color: C.body,
  },
  body: { fontSize: "1rem", lineHeight: 1.7, color: C.body },
  small: { fontSize: "0.9rem", lineHeight: 1.6, color: C.body },
} as const;

/* ─── Photos live in /img/v2 (WebP, EXIF stripped, <=1800px long edge) ─── */
export const IMG = (f: string) => `/img/v2/${f}`;
export const CTA = "/book";
