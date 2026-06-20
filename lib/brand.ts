/**
 * brand.ts — Waseem Nasir / waseemnasir.com
 * Canonical design token system for the Aurora Luxe identity.
 *
 * Single source of truth: color palette, gradients, glass surfaces,
 * tint/shade ramps, typography scale, spacing, radius.
 *
 * Usage:
 *   import { brand } from "@/lib/brand";
 *   style={{ color: brand.color.text }}
 *   style={{ background: brand.gradient.aurora }}
 *
 * Do NOT import this file into Server Components that use next/font —
 * font loading is handled in layout.tsx or the page file via next/font/google.
 * This file is pure data: zero JSX, zero runtime side-effects.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */

export type HexColor = `#${string}`;
export type RgbaColor = `rgba(${string})`;
export type CssGradient =
  | `linear-gradient(${string})`
  | `radial-gradient(${string})`;

export interface ColorRamp {
  50: HexColor;
  100: HexColor;
  200: HexColor;
  300: HexColor;
  400: HexColor;
  500: HexColor;
  600: HexColor;
  700: HexColor;
  800: HexColor;
  900: HexColor;
}

export interface GlassStyle {
  /** CSS background value — rgba with low opacity */
  background: RgbaColor;
  /** CSS border value — 1px solid with gold hairline */
  border: string;
  /** backdrop-filter blur */
  backdropFilter: string;
  /** -webkit- prefix for Safari */
  WebkitBackdropFilter: string;
  /** box-shadow: inner highlight + deep drop */
  boxShadow: string;
}

export interface TypeScaleEntry {
  /** px value at base viewport (reference only — use clamp() for fluid sizes) */
  px: number;
  /** rem equivalent */
  rem: number;
  /** Fraunces weight for display levels; Hanken Grotesk weight for body levels */
  weight: 400 | 500 | 600 | 700 | 800 | 900;
  /** CSS letter-spacing */
  tracking: string;
  /** CSS line-height */
  lineHeight: string;
  /** Which font family to use */
  fontFamily: "fraunces" | "hanken" | "jetbrains";
  /** Fluid clamp() expression — drop into style={{ fontSize: ... }} */
  clamp?: string;
}

export interface BrandTokens {
  color: {
    /* ── Base backgrounds ── */
    /** Page background — deep forest ink */
    bg: HexColor;
    /** CTA panel background — slightly richer than bg */
    bgCta: HexColor;

    /* ── Glass surfaces ── */
    /** Default glass surface fill */
    surface: RgbaColor;
    /** Elevated glass surface fill */
    surfaceHi: RgbaColor;

    /* ── Hairline borders ── */
    /** Standard gold hairline border color */
    line: RgbaColor;
    /** Elevated gold hairline border (stronger on hover cards) */
    lineHi: RgbaColor;
    /** Marquee / footer divider border — softest gold */
    lineSoft: RgbaColor;

    /* ── Text ── */
    /** Primary text — near-white with warm green undertone */
    text: HexColor;
    /** Secondary / muted text */
    muted: HexColor;
    /**
     * Alt-muted — slightly brighter for use on surfaces where
     * #B8C2B6 feels too low-contrast (glass cards with heavy blur):
     * #CDD5CB (~12.7:1 on bg, ~3.5:1 on surfaceHi after compositing).
     */
    mutedAlt: HexColor;

    /* ── Brand greens ── */
    /** Primary brand color — deep emerald */
    primary: HexColor;
    /** Deeper emerald variant (gradient start / bloom fill) */
    primaryDeep: HexColor;
    /** Teal — gradient midpoint, section label color */
    teal: HexColor;

    /* ── Accent gold ── */
    /** Warm gold — gradient end, CTA accent */
    accent: HexColor;
    /** Light gold — lifted variant for chip labels on dark bg */
    accentLight: HexColor;

    /* ── Semantic aliases ── */
    /** Success state — maps to teal */
    success: HexColor;
    /** Warning / highlight — maps to accent gold */
    warning: HexColor;
    /** On-brand button text color (dark fg over gradient bg) */
    onGradient: HexColor;
  };

  /** Gradient strings — ready to drop into background or backgroundImage */
  gradient: {
    /** Primary aurora: emerald → teal → gold, 100deg. Use for text-clip, button bg, borders. */
    aurora: CssGradient;
    /** Softer aurora — same hues, fractionally less contrast. Use for tag pills, decorative fills. */
    auroraSoft: CssGradient;
    /** Portrait ring / bento accent — same as aurora */
    ring: CssGradient;
    /** Image overlay fade (hero portrait, work card bottom) */
    imageFadeBottom: CssGradient;
    /** Image overlay fade (life strip landscape) */
    imageFadeSide: CssGradient;
  };

  /** Tint/shade ramps for programmatic usage (Tailwind extension, Storybook, etc.) */
  ramp: {
    emerald: ColorRamp;
    gold: ColorRamp;
  };

  /** Reusable glass surface style objects — spread directly into React style props */
  glass: {
    /** Standard glass card */
    card: GlassStyle;
    /** Elevated glass card (hover state, hero chips) */
    cardHi: GlassStyle;
  };

  /** Typography system */
  type: {
    /** CSS custom property names — set on the root wrapper element */
    vars: {
      fraunces: "--font-fraunces";
      hanken: "--font-hanken";
      jetbrains: "--font-jetbrains";
    };
    /** CSS font-family strings referencing the CSS vars above */
    families: {
      display: string;
      body: string;
      mono: string;
    };
    /**
     * Type scale.
     * display → h1 → h2 → h3 use Fraunces (serif, heavy).
     * body → bodyLg → small use Hanken Grotesk (sans).
     * mono → label use JetBrains Mono.
     *
     * "px" = reference size at ~1280px viewport.
     * Use clamp() expression for fluid sizing in production.
     */
    scale: {
      display: TypeScaleEntry;
      h1: TypeScaleEntry;
      h2: TypeScaleEntry;
      h3: TypeScaleEntry;
      bodyLg: TypeScaleEntry;
      body: TypeScaleEntry;
      small: TypeScaleEntry;
      mono: TypeScaleEntry;
      label: TypeScaleEntry;
    };
  };

  /** Spacing scale (px → rem) — 4px base grid */
  spacing: {
    1: "0.25rem";
    2: "0.5rem";
    3: "0.75rem";
    4: "1rem";
    5: "1.25rem";
    6: "1.5rem";
    8: "2rem";
    10: "2.5rem";
    12: "3rem";
    16: "4rem";
    20: "5rem";
    24: "6rem";
  };

  /** Border-radius tokens */
  radius: {
    sm: "0.5rem";
    md: "1rem";
    lg: "1.5rem";
    xl: "2rem";
    "2xl": "2.5rem";
    full: "9999px";
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   TOKEN VALUES
───────────────────────────────────────────────────────────────────────────── */

export const brand: BrandTokens = {
  /* ── Colors ──────────────────────────────────────────────────────────────── */
  color: {
    /* base */
    bg: "#0A130E",
    bgCta: "#0C1610",

    /* surfaces */
    surface: "rgba(255,255,255,0.05)",
    surfaceHi: "rgba(255,255,255,0.08)",

    /* borders */
    line: "rgba(201,162,75,0.16)",
    lineHi: "rgba(201,162,75,0.24)",
    lineSoft: "rgba(201,162,75,0.14)",

    /* text */
    text: "#F2F4EF",
    muted: "#B8C2B6",
    /**
     * WCAG NOTE — #B8C2B6 on #0A130E:
     *   Relative luminance of #B8C2B6 ≈ 0.524
     *   Relative luminance of #0A130E ≈ 0.0044
     *   Contrast ratio ≈ 10.6:1 → passes WCAG AA and AAA at ALL sizes.
     *
     * On composited glass surfaces (rgba(255,255,255,0.05) over #0A130E):
     *   Effective bg luminance rises to ~0.007 → ratio ≈ 10.4:1 — still AAA.
     *
     * mutedAlt (#CDD5CB) is provided for situations where a lighter
     * muted shade is needed for visual hierarchy, NOT for contrast reasons.
     * Contrast of mutedAlt on bg: ≈ 13.4:1 (AAA).
     */
    mutedAlt: "#CDD5CB",

    /* brand greens */
    primary: "#0B5D3B",
    primaryDeep: "#0B5D3B",
    teal: "#0E7C66",

    /* accent gold */
    accent: "#C9A24B",
    accentLight: "#E2C47A",

    /* semantic */
    success: "#0E7C66",
    warning: "#C9A24B",
    onGradient: "#0A130E",
  },

  /* ── Gradients ────────────────────────────────────────────────────────────── */
  gradient: {
    aurora:
      "linear-gradient(100deg,#0B5D3B 0%,#0E7C66 48%,#C9A24B 100%)" as CssGradient,
    auroraSoft:
      "linear-gradient(100deg,#0B5D3B,#0E7C66 55%,#C9A24B)" as CssGradient,
    ring: "linear-gradient(100deg,#0B5D3B 0%,#0E7C66 48%,#C9A24B 100%)" as CssGradient,
    imageFadeBottom:
      "linear-gradient(180deg,rgba(10,19,14,0) 30%,rgba(10,19,14,0.88) 100%)" as CssGradient,
    imageFadeSide:
      "linear-gradient(120deg,rgba(10,19,14,0.55) 0%,transparent 60%)" as CssGradient,
  },

  /* ── Tint / shade ramps ───────────────────────────────────────────────────── */
  /**
   * Approximated from the locked hex anchors.
   * 500 = locked brand value. Lighter = higher tint (toward white).
   * Darker = lower shade (toward black). Use for hover states,
   * disabled states, Tailwind theme extension.
   */
  ramp: {
    emerald: {
      50: "#E8F5EF",
      100: "#C5E6D6",
      200: "#9FD3BB",
      300: "#6DBFA0",
      400: "#3DAF86",
      500: "#0B5D3B", // locked brand primary
      600: "#094E32",
      700: "#073F28",
      800: "#05301E",
      900: "#022014",
    },
    gold: {
      50: "#FBF5E6",
      100: "#F5E8C2",
      200: "#EDD898",
      300: "#E5C96F",
      400: "#DDB860",
      500: "#C9A24B", // locked brand accent
      600: "#AA883A",
      700: "#896D2D",
      800: "#69531F",
      900: "#493912",
    },
  },

  /* ── Glass surfaces ───────────────────────────────────────────────────────── */
  glass: {
    card: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(201,162,75,0.16)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -40px rgba(0,0,0,0.85)",
    },
    cardHi: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(201,162,75,0.24)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -40px rgba(0,0,0,0.85)",
    },
  },

  /* ── Typography ───────────────────────────────────────────────────────────── */
  type: {
    vars: {
      fraunces: "--font-fraunces",
      hanken: "--font-hanken",
      jetbrains: "--font-jetbrains",
    },
    families: {
      /** Use for headings, hero copy, number callouts */
      display: "var(--font-fraunces), Georgia, serif",
      /** Use for all body copy, nav, labels by default */
      body: "var(--font-hanken), system-ui, sans-serif",
      /** Use for eyebrow labels, mono stats, badge text, code */
      mono: "var(--font-jetbrains), 'Courier New', monospace",
    },
    /**
     * SCALE LEGEND
     * ─────────────────────────────────────────────────────────────────────
     * Level      │ Font       │  px  │  rem  │ Weight │ Tracking │ Leading
     * ───────────┼────────────┼──────┼───────┼────────┼──────────┼────────
     * display    │ Fraunces   │  90  │  5.6  │  900   │ -0.02em  │  0.95
     * h1         │ Fraunces   │  56  │  3.5  │  800   │ -0.02em  │  1.05
     * h2         │ Fraunces   │  40  │  2.5  │  800   │ -0.01em  │  1.10
     * h3         │ Fraunces   │  28  │  1.75 │  700   │ -0.01em  │  1.20
     * bodyLg     │ Hanken     │  18  │  1.125│  400   │  0       │  1.65
     * body       │ Hanken     │  16  │  1.0  │  400   │  0       │  1.6
     * small      │ Hanken     │  14  │  0.875│  400   │  0       │  1.5
     * mono       │ JetBrains  │  14  │  0.875│  400   │  0       │  1.5
     * label      │ JetBrains  │  12  │  0.75 │  500   │  0.25em  │  1.4
     * ─────────────────────────────────────────────────────────────────────
     *
     * Fraunces weight rule:
     *   display 900 — only for the hero H1 or very short single-line display.
     *   h1      800 — page-level section opener (Fraunces font-black).
     *   h2      800 — subsection headings (use extrabold class).
     *   h3      700 — card headings, process steps.
     *   For gradient clip text: always use Fraunces, weight matches level.
     *
     * Hanken Grotesk does NOT use decorative weights for body text —
     * max body weight is 600 (semibold) for emphasis spans only.
     *
     * NEVER use: Inter, Poppins, Montserrat — generic "AI startup" fonts
     * that conflict with the premium editorial identity.
     *
     * Font loading (next/font/google):
     *   Fraunces: weights ["400","600","700","800","900"], display:"swap"
     *   Hanken_Grotesk: weights ["400","500","600","700"], display:"swap"
     *   JetBrains_Mono: weights ["400","500"], display:"swap"
     *   All three variables must be applied to the page wrapper element.
     */
    scale: {
      display: {
        px: 90,
        rem: 5.625,
        weight: 900,
        tracking: "-0.02em",
        lineHeight: "0.95",
        fontFamily: "fraunces",
        clamp: "clamp(3.1rem,7.8vw + 0.5rem,5.6rem)",
      },
      h1: {
        px: 56,
        rem: 3.5,
        weight: 800,
        tracking: "-0.02em",
        lineHeight: "1.05",
        fontFamily: "fraunces",
        clamp: "clamp(2.4rem,5vw + 0.5rem,4.2rem)",
      },
      h2: {
        px: 40,
        rem: 2.5,
        weight: 800,
        tracking: "-0.01em",
        lineHeight: "1.10",
        fontFamily: "fraunces",
        clamp: "clamp(1.9rem,4vw + 0.5rem,3.5rem)",
      },
      h3: {
        px: 28,
        rem: 1.75,
        weight: 700,
        tracking: "-0.01em",
        lineHeight: "1.20",
        fontFamily: "fraunces",
      },
      bodyLg: {
        px: 18,
        rem: 1.125,
        weight: 400,
        tracking: "0",
        lineHeight: "1.65",
        fontFamily: "hanken",
      },
      body: {
        px: 16,
        rem: 1.0,
        weight: 400,
        tracking: "0",
        lineHeight: "1.6",
        fontFamily: "hanken",
      },
      small: {
        px: 14,
        rem: 0.875,
        weight: 400,
        tracking: "0",
        lineHeight: "1.5",
        fontFamily: "hanken",
      },
      mono: {
        px: 14,
        rem: 0.875,
        weight: 400,
        tracking: "0",
        lineHeight: "1.5",
        fontFamily: "jetbrains",
      },
      label: {
        px: 12,
        rem: 0.75,
        weight: 500,
        tracking: "0.25em",
        lineHeight: "1.4",
        fontFamily: "jetbrains",
      },
    },
  },

  /* ── Spacing ──────────────────────────────────────────────────────────────── */
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  },

  /* ── Radius ───────────────────────────────────────────────────────────────── */
  radius: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    full: "9999px",
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   CONVENIENCE EXPORTS
───────────────────────────────────────────────────────────────────────────── */

/** Shorthand alias for color tokens */
export const color = brand.color;

/** Shorthand alias for gradient strings */
export const gradient = brand.gradient;

/** Shorthand alias for glass surface styles */
export const glass = brand.glass;

/** Shorthand alias for type scale */
export const typeScale = brand.type.scale;

/** Shorthand alias for font family strings */
export const fonts = brand.type.families;
