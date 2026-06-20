/**
 * Waseem Nasir — Personal Founder Brand / Logo System
 * Aurora Luxe palette: Forest-ink #0A130E · Emerald #0B5D3B · Teal #0E7C66 · Gold #C9A24B · Text #F2F4EF
 *
 * EXPORTS
 * -------
 * Wordmark        — Primary text lockup, title-case serif with gold gradient on "Nasir" (recommended default)
 * WordmarkA       — All-caps condensed variant, tight tracking, gold accent period between names
 * WordmarkB       — Title-case with first/last names on separate baselines, stacked display
 * Monogram        — "WN" geometric letter-mark; works as avatar / favicon at 32px+
 * Mark            — Abstract leaf-circuit node glyph; standalone decorative mark or icon
 * LogoLockup      — RECOMMENDED PRIMARY: Mark + Wordmark side-by-side, horizontal
 * LogoLockupStack — Mark stacked above Wordmark, square-ish; good for social profiles
 *
 * FONT ASSUMPTION
 * ---------------
 * Fraunces must be loaded in the page/layout. In aurora-luxe/page.tsx it's loaded via
 * next/font/google with variable "--font-fraunces". In layout.tsx it uses "--font-serif".
 * Both are wired below via font-family fallback chain. If neither variable is present,
 * the SVG text falls back to Georgia → serif, which degrades gracefully.
 *
 * USAGE
 * -----
 * Dark bg (default):   <LogoLockup />                  — gold/emerald on transparent
 * Light bg:            <LogoLockup mono="light" />      — uses dark-ink fill
 * Custom size:         <LogoLockup size={180} />        — scales proportionally
 * Just the mark:       <Mark size={24} />               — for favicon / icon slots
 *
 * GRADIENT IDs
 * ------------
 * Each component that uses SVG gradients defines its own <defs> block with a
 * unique ID prefix to avoid collisions when multiple logos appear on one page.
 */

import React from "react";

/* ── Palette ── */
const P = {
  bg: "#0A130E",
  emerald: "#0B5D3B",
  teal: "#0E7C66",
  gold: "#C9A24B",
  goldLight: "#E2C47A",
  text: "#F2F4EF",
  muted: "#B8C2B6",
  ink: "#0A130E",
} as const;

/* ── Shared font stack ── */
const FRAUNCES =
  "var(--font-fraunces, var(--font-serif, 'Fraunces')), Georgia, 'Times New Roman', serif";

/* ── Prop interfaces ── */
export interface LogoProps {
  /** Optional Tailwind / CSS class forwarded to the root <svg> */
  className?: string;
  /**
   * Color mode.
   * "dark" (default) — gold/emerald marks on transparent (for dark backgrounds)
   * "light"          — dark-ink marks on transparent (for light/white backgrounds)
   * "mono"           — single flat #F2F4EF (light) or #0A130E (dark) for one-color usage
   */
  mono?: "dark" | "light" | "mono-light" | "mono-dark";
  /** Width in px. Height scales automatically per each component's natural ratio. */
  size?: number;
  /** aria-label for the SVG (supply for standalone icon usage; omit when decorative) */
  label?: string;
}

/* ══════════════════════════════════════════════════════════════════
   MARK — Leaf-circuit node glyph
   A rotated diamond (leaf body) with a signal-tick off the top vertex
   and a subtle inner highlight arc. Emerald→gold gradient.
   Crisp from 16px to 256px.
   ══════════════════════════════════════════════════════════════════ */
export function Mark({ className, mono, size = 32, label }: LogoProps) {
  const gId = "mark-grad";
  const isLight = mono === "light";
  const isMono = mono === "mono-light" || mono === "mono-dark";
  const monoColor = mono === "mono-light" ? P.text : P.ink;

  // Viewbox: 32×36 — diamond 28px tall, 20px wide, centred, + 4px tick above
  return (
    <svg
      viewBox="0 0 32 36"
      width={size}
      height={Math.round(size * (36 / 32))}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      role={label ? "img" : "presentation"}
      aria-hidden={!label}
    >
      <defs>
        {!isMono && (
          <linearGradient
            id={gId}
            x1="0"
            y1="4"
            x2="32"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={isLight ? P.teal : P.emerald} />
            <stop offset="52%" stopColor={isLight ? P.teal : P.teal} />
            <stop offset="100%" stopColor={isLight ? P.gold : P.gold} />
          </linearGradient>
        )}
      </defs>

      {/* Diamond body — leaf/node shape */}
      <path
        d="M16 6 L28 20 L16 34 L4 20 Z"
        fill={isMono ? monoColor : `url(#${gId})`}
      />

      {/* Inner highlight — subtle lighter facet */}
      <path d="M16 6 L22 17 L16 19.5 L10 17 Z" fill="rgba(255,255,255,0.18)" />

      {/* Signal tick — circuit antenna off the top vertex */}
      {/* Vertical stroke up from tip */}
      <line
        x1="16"
        y1="6"
        x2="16"
        y2="1"
        stroke={isMono ? monoColor : P.goldLight}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Horizontal bar at top of antenna */}
      <line
        x1="12.5"
        y1="1"
        x2="19.5"
        y2="1"
        stroke={isMono ? monoColor : P.goldLight}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Right perpendicular tick — node connection */}
      <line
        x1="28"
        y1="20"
        x2="32"
        y2="20"
        stroke={isMono ? monoColor : P.goldLight}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MONOGRAM — "WN" geometric letter-mark
   The W and N share a common bold vertical right-stroke.
   Works as avatar or favicon at 32px. Uses emerald→gold gradient bg
   or transparent bg with gradient strokes.
   ══════════════════════════════════════════════════════════════════ */
export function Monogram({
  className,
  mono,
  size = 48,
  label = "WN monogram",
}: LogoProps) {
  const bgGradId = "mono-bg";
  const strokeGradId = "mono-stroke";
  const isLight = mono === "light";
  const isMono = mono === "mono-light" || mono === "mono-dark";
  const monoColor =
    mono === "mono-light" ? P.text : mono === "mono-dark" ? P.ink : undefined;

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      role="img"
    >
      <defs>
        {!isMono && (
          <>
            <linearGradient
              id={bgGradId}
              x1="0"
              y1="0"
              x2="48"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isLight ? "#e8f5ee" : P.emerald} />
              <stop offset="100%" stopColor={isLight ? "#f5ead0" : "#1a3020"} />
            </linearGradient>
            <linearGradient
              id={strokeGradId}
              x1="4"
              y1="4"
              x2="44"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isLight ? P.teal : P.teal} />
              <stop offset="55%" stopColor={isLight ? P.teal : P.teal} />
              <stop offset="100%" stopColor={P.gold} />
            </linearGradient>
          </>
        )}
      </defs>

      {/* Rounded-square background */}
      <rect
        x="0"
        y="0"
        width="48"
        height="48"
        rx="11"
        fill={
          isMono ? (monoColor === P.ink ? P.text : P.bg) : `url(#${bgGradId})`
        }
      />

      {/*
        WN constructed geometry (viewbox 48×48, inner area 8–40):
        W: left half (x 8–26)
          - left descender: (8,10)→(12,36)
          - left valley:    (12,36)→(17,24)
          - centre peak:    (17,24)→(24,10)   ← shared centre-right of W = left of N
          (note: W and N share the stroke at x=24)
        N: right half (x 24–40)
          - left ascender:  (24,10)→(24,36)   ← this left leg is also W's right peak base
          - diagonal:       (24,10)→(36,36)
          - right ascender: (36,10)→(36,36)
          - right cap:      top of right leg is separate
        We draw as a single connected polyline for W, then N as separate path.
      */}

      {/* W — two descenders, two valleys, meeting at centre */}
      <polyline
        points="8,10 13,36 20.5,20 28,36 33,10"
        stroke={
          isMono
            ? monoColor === P.ink
              ? P.ink
              : P.text
            : `url(#${strokeGradId})`
        }
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* N — left leg, diagonal, right leg */}
      <polyline
        points="33,10 33,36 41,10 41,36"
        stroke={
          isMono
            ? monoColor === P.ink
              ? P.ink
              : P.text
            : `url(#${strokeGradId})`
        }
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Gold accent dot — bottom right corner */}
      <circle
        cx="40"
        cy="37.5"
        r="2.2"
        fill={isMono ? (monoColor === P.ink ? P.ink : P.goldLight) : P.gold}
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   WORDMARK — Title-case, Fraunces 800, gradient "Nasir"
   The refined default. "Waseem" in text-white, "Nasir" in
   emerald→gold gradient. Gold accent spark line beneath.
   ══════════════════════════════════════════════════════════════════ */
export function Wordmark({
  className,
  mono,
  size = 200,
  label = "Waseem Nasir",
}: LogoProps) {
  const gId = "wm-grad";
  const isLight = mono === "light";
  const isMono = mono === "mono-light" || mono === "mono-dark";
  const monoColor =
    mono === "mono-light" ? P.text : mono === "mono-dark" ? P.ink : undefined;

  const primaryColor = isMono
    ? (monoColor as string)
    : isLight
      ? P.ink
      : P.text;

  // Viewbox 200×52. Adjust width if you change font size.
  return (
    <svg
      viewBox="0 0 200 52"
      width={size}
      height={Math.round(size * (52 / 200))}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      role="img"
    >
      <defs>
        {!isMono && (
          <linearGradient
            id={gId}
            x1="0"
            y1="0"
            x2="200"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={isLight ? P.teal : P.teal} />
            <stop offset="60%" stopColor={isLight ? P.teal : P.teal} />
            <stop offset="100%" stopColor={P.gold} />
          </linearGradient>
        )}
        {/* Spark underline gradient — always gold-tipped */}
        <linearGradient id="wm-spark" x1="0" y1="0" x2="1" y2="0">
          <stop
            offset="0%"
            stopColor={isLight ? P.emerald : P.teal}
            stopOpacity="0"
          />
          <stop offset="40%" stopColor={isLight ? P.teal : P.teal} />
          <stop offset="100%" stopColor={P.gold} />
        </linearGradient>
      </defs>

      {/* "Waseem" — primary text colour */}
      <text
        x="0"
        y="38"
        fontFamily={FRAUNCES}
        fontWeight="800"
        fontSize="36"
        letterSpacing="-0.5"
        fill={primaryColor}
      >
        Waseem
      </text>

      {/* "Nasir" — gradient fill or mono */}
      <text
        x="122"
        y="38"
        fontFamily={FRAUNCES}
        fontWeight="800"
        fontSize="36"
        letterSpacing="-0.5"
        fill={isMono ? (monoColor as string) : `url(#${gId})`}
      >
        Nasir
      </text>

      {/* Spark accent line — tapers in from left, gold tip at right */}
      <line
        x1="0"
        y1="47"
        x2="112"
        y2="47"
        stroke="url(#wm-spark)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   WORDMARK A — All-caps condensed, gold accent dot
   "WASEEM · NASIR" with a gold diamond separator.
   Tight tracking, heavier weight. Strong at large display sizes.
   ══════════════════════════════════════════════════════════════════ */
export function WordmarkA({
  className,
  mono,
  size = 260,
  label = "Waseem Nasir",
}: LogoProps) {
  const gId = "wma-grad";
  const isLight = mono === "light";
  const isMono = mono === "mono-light" || mono === "mono-dark";
  const monoColor = mono === "mono-light" ? P.text : P.ink;
  const primaryColor = isMono ? monoColor : isLight ? P.ink : P.text;

  return (
    <svg
      viewBox="0 0 260 44"
      width={size}
      height={Math.round(size * (44 / 260))}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      role="img"
    >
      <defs>
        {!isMono && (
          <linearGradient
            id={gId}
            x1="0"
            y1="0"
            x2="260"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={isLight ? P.emerald : P.emerald} />
            <stop offset="50%" stopColor={isLight ? P.teal : P.teal} />
            <stop offset="100%" stopColor={P.gold} />
          </linearGradient>
        )}
      </defs>

      {/* "WASEEM" all caps — full gradient span */}
      <text
        x="0"
        y="34"
        fontFamily={FRAUNCES}
        fontWeight="900"
        fontSize="32"
        letterSpacing="3"
        fill={isMono ? primaryColor : `url(#${gId})`}
      >
        WASEEM
      </text>

      {/* Gold diamond separator */}
      <text
        x="155"
        y="34"
        fontFamily="system-ui, sans-serif"
        fontWeight="400"
        fontSize="18"
        fill={isMono ? primaryColor : P.gold}
        letterSpacing="0"
      >
        ◆
      </text>

      {/* "NASIR" all caps — primary color */}
      <text
        x="180"
        y="34"
        fontFamily={FRAUNCES}
        fontWeight="900"
        fontSize="32"
        letterSpacing="3"
        fill={primaryColor}
      >
        NASIR
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   WORDMARK B — Stacked two-line, founder-grade editorial
   "Waseem" large on line 1, "Nasir" with a left-edge gold bar on
   line 2, slightly offset right for optical interest.
   Best at large display sizes (hero, print, OG image).
   ══════════════════════════════════════════════════════════════════ */
export function WordmarkB({
  className,
  mono,
  size = 200,
  label = "Waseem Nasir",
}: LogoProps) {
  const gId = "wmb-grad";
  const isLight = mono === "light";
  const isMono = mono === "mono-light" || mono === "mono-dark";
  const monoColor = mono === "mono-light" ? P.text : P.ink;
  const primaryColor = isMono ? monoColor : isLight ? P.ink : P.text;

  return (
    <svg
      viewBox="0 0 200 76"
      width={size}
      height={Math.round(size * (76 / 200))}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      role="img"
    >
      <defs>
        {!isMono && (
          <linearGradient
            id={gId}
            x1="0"
            y1="0"
            x2="200"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={isLight ? P.teal : P.emerald} />
            <stop offset="100%" stopColor={P.gold} />
          </linearGradient>
        )}
      </defs>

      {/* Line 1: Waseem */}
      <text
        x="0"
        y="36"
        fontFamily={FRAUNCES}
        fontWeight="900"
        fontSize="38"
        letterSpacing="-1"
        fill={primaryColor}
      >
        Waseem
      </text>

      {/* Gold left-edge accent bar on line 2 */}
      <rect
        x="0"
        y="46"
        width="3"
        height="26"
        rx="1.5"
        fill={isMono ? primaryColor : P.gold}
      />

      {/* Line 2: Nasir — indented, gradient */}
      <text
        x="10"
        y="70"
        fontFamily={FRAUNCES}
        fontWeight="800"
        fontSize="30"
        letterSpacing="-0.5"
        fill={isMono ? monoColor : `url(#${gId})`}
      >
        Nasir
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LOGO LOCKUP — PRIMARY RECOMMENDED
   Mark (leaf-circuit node) + Wordmark (title-case), horizontal
   8px gap between mark and text. This is the primary brand lockup.
   ══════════════════════════════════════════════════════════════════ */
export function LogoLockup({
  className,
  mono,
  size = 220,
  label = "Waseem Nasir",
}: LogoProps) {
  const gIdMark = "ll-mark-grad";
  const gIdText = "ll-text-grad";
  const gIdSpark = "ll-spark-grad";
  const isLight = mono === "light";
  const isMono = mono === "mono-light" || mono === "mono-dark";
  const monoColor = mono === "mono-light" ? P.text : P.ink;
  const primaryColor = isMono ? monoColor : isLight ? P.ink : P.text;

  // Composite viewBox: 44 (mark) + 10 (gap) + 166 (wordmark) × 52 tall
  // Mark sits centred vertically in the 52px height
  return (
    <svg
      viewBox="0 0 220 52"
      width={size}
      height={Math.round(size * (52 / 220))}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      role="img"
    >
      <defs>
        {!isMono && (
          <>
            <linearGradient
              id={gIdMark}
              x1="0"
              y1="6"
              x2="38"
              y2="50"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isLight ? P.teal : P.emerald} />
              <stop offset="55%" stopColor={P.teal} />
              <stop offset="100%" stopColor={P.gold} />
            </linearGradient>
            <linearGradient
              id={gIdText}
              x1="54"
              y1="0"
              x2="220"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isLight ? P.teal : P.teal} />
              <stop offset="100%" stopColor={P.gold} />
            </linearGradient>
            <linearGradient
              id={gIdSpark}
              x1="54"
              y1="0"
              x2="160"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0%"
                stopColor={isLight ? P.teal : P.teal}
                stopOpacity="0"
              />
              <stop offset="50%" stopColor={P.teal} />
              <stop offset="100%" stopColor={P.gold} />
            </linearGradient>
          </>
        )}
      </defs>

      {/* ── Mark (inline, shifted into composite coordinate space) ── */}
      {/* Diamond body, viewBox 0–38 wide, 4–50 tall, centred in 52px */}
      <path
        d="M17 6 L29 22 L17 48 L5 22 Z"
        fill={isMono ? primaryColor : `url(#${gIdMark})`}
      />
      {/* Inner highlight facet */}
      <path d="M17 6 L23 19 L17 22 L11 19 Z" fill="rgba(255,255,255,0.18)" />
      {/* Signal antenna up from tip */}
      <line
        x1="17"
        y1="6"
        x2="17"
        y2="1.5"
        stroke={isMono ? primaryColor : P.goldLight}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="13.5"
        y1="1.5"
        x2="20.5"
        y2="1.5"
        stroke={isMono ? primaryColor : P.goldLight}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Right node tick */}
      <line
        x1="29"
        y1="22"
        x2="33"
        y2="22"
        stroke={isMono ? primaryColor : P.goldLight}
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* ── Wordmark (x offset = 44) ── */}
      {/* "Waseem" */}
      <text
        x="44"
        y="38"
        fontFamily={FRAUNCES}
        fontWeight="800"
        fontSize="34"
        letterSpacing="-0.4"
        fill={primaryColor}
      >
        Waseem
      </text>

      {/* "Nasir" — gradient */}
      <text
        x="160"
        y="38"
        fontFamily={FRAUNCES}
        fontWeight="800"
        fontSize="34"
        letterSpacing="-0.4"
        fill={isMono ? primaryColor : `url(#${gIdText})`}
      >
        Nasir
      </text>

      {/* Spark underline */}
      <line
        x1="44"
        y1="46"
        x2="154"
        y2="46"
        stroke={isMono ? "none" : `url(#${gIdSpark})`}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LOGO LOCKUP STACK — Mark above Wordmark, square ratio
   Good for social bios, round/square avatar contexts where the
   horizontal lockup is too wide.
   ══════════════════════════════════════════════════════════════════ */
export function LogoLockupStack({
  className,
  mono,
  size = 160,
  label = "Waseem Nasir",
}: LogoProps) {
  const gIdMark = "lls-mark-grad";
  const gIdText = "lls-text-grad";
  const isLight = mono === "light";
  const isMono = mono === "mono-light" || mono === "mono-dark";
  const monoColor = mono === "mono-light" ? P.text : P.ink;
  const primaryColor = isMono ? monoColor : isLight ? P.ink : P.text;

  return (
    <svg
      viewBox="0 0 160 80"
      width={size}
      height={Math.round(size * (80 / 160))}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      role="img"
    >
      <defs>
        {!isMono && (
          <>
            <linearGradient
              id={gIdMark}
              x1="65"
              y1="0"
              x2="95"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isLight ? P.teal : P.emerald} />
              <stop offset="55%" stopColor={P.teal} />
              <stop offset="100%" stopColor={P.gold} />
            </linearGradient>
            <linearGradient
              id={gIdText}
              x1="0"
              y1="0"
              x2="160"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isLight ? P.teal : P.teal} />
              <stop offset="100%" stopColor={P.gold} />
            </linearGradient>
          </>
        )}
      </defs>

      {/* Mark — centred at top, x=80 centre */}
      <path
        d="M80 2 L92 18 L80 34 L68 18 Z"
        fill={isMono ? primaryColor : `url(#${gIdMark})`}
      />
      <path d="M80 2 L86 15 L80 18 L74 15 Z" fill="rgba(255,255,255,0.18)" />
      {/* Antenna */}
      <line
        x1="80"
        y1="2"
        x2="80"
        y2="-2"
        stroke={isMono ? primaryColor : P.goldLight}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="76.5"
        y1="-2"
        x2="83.5"
        y2="-2"
        stroke={isMono ? primaryColor : P.goldLight}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Separator line */}
      <line
        x1="56"
        y1="42"
        x2="104"
        y2="42"
        stroke={isMono ? primaryColor : P.gold}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />

      {/* Wordmark below mark */}
      <text
        x="80"
        y="64"
        textAnchor="middle"
        fontFamily={FRAUNCES}
        fontWeight="800"
        fontSize="22"
        letterSpacing="-0.3"
        fill={primaryColor}
      >
        Waseem
      </text>
      <text
        x="80"
        y="80"
        textAnchor="middle"
        fontFamily={FRAUNCES}
        fontWeight="800"
        fontSize="18"
        letterSpacing="-0.2"
        fill={isMono ? primaryColor : `url(#${gIdText})`}
      >
        Nasir
      </text>
    </svg>
  );
}
