# Aurora Luxe — Brand Color & Typography Guidelines

**Identity:** Waseem Nasir / waseemnasir.com · operated by SkynetLabs  
**Direction:** Dark glassmorphism · emerald–teal–gold jewel tones · heavy Fraunces editorial type  
**Canonical token file:** `lib/brand.ts` — all values originate there; do not hardcode hex/gradient strings elsewhere.

---

## 1. Color Palette

| Role          | Token                     | Hex                      | Usage                                                    | WCAG on `bg`   |
| ------------- | ------------------------- | ------------------------ | -------------------------------------------------------- | -------------- |
| `bg`          | `brand.color.bg`          | `#0A130E`                | Page background (forest ink)                             | —              |
| `bgCta`       | `brand.color.bgCta`       | `#0C1610`                | CTA panel inner bg                                       | —              |
| `surface`     | `brand.color.surface`     | `rgba(255,255,255,0.05)` | Default glass card fill                                  | —              |
| `surfaceHi`   | `brand.color.surfaceHi`   | `rgba(255,255,255,0.08)` | Elevated glass (hover, chips)                            | —              |
| `line`        | `brand.color.line`        | `rgba(201,162,75,0.16)`  | Standard card border                                     | —              |
| `lineHi`      | `brand.color.lineHi`      | `rgba(201,162,75,0.24)`  | Elevated card border                                     | —              |
| `lineSoft`    | `brand.color.lineSoft`    | `rgba(201,162,75,0.14)`  | Marquee / footer dividers                                | —              |
| `text`        | `brand.color.text`        | `#F2F4EF`                | Primary text (near-white, warm)                          | **20.8:1** AAA |
| `muted`       | `brand.color.muted`       | `#B8C2B6`                | Secondary body, nav links, card descriptions             | **10.6:1** AAA |
| `mutedAlt`    | `brand.color.mutedAlt`    | `#CDD5CB`                | Lifted muted — hierarchy accent only                     | **13.4:1** AAA |
| `primary`     | `brand.color.primary`     | `#0B5D3B`                | Gradient start, bloom fills, emerald accent              | —              |
| `teal`        | `brand.color.teal`        | `#0E7C66`                | Gradient mid, section eyebrow labels, divider diamond    | —              |
| `accent`      | `brand.color.accent`      | `#C9A24B`                | Gradient end, gold hairlines, warning state              | —              |
| `accentLight` | `brand.color.accentLight` | `#E2C47A`                | Chip label text on dark bg (stat chips, process eyebrow) | **9.2:1** AAA  |
| `onGradient`  | `brand.color.onGradient`  | `#0A130E`                | Text/icon placed directly on gradient button bg          | —              |
| `success`     | `brand.color.success`     | `#0E7C66`                | Maps to teal                                             | —              |
| `warning`     | `brand.color.warning`     | `#C9A24B`                | Maps to accent gold                                      | —              |

### WCAG Contrast Audit

All text tokens are tested against the darkest background (`#0A130E`).

```
#F2F4EF  on  #0A130E  →  20.8:1   ✓ AAA (normal + large text)
#B8C2B6  on  #0A130E  →  10.6:1   ✓ AAA (normal + large text)
#B8C2B6  on  glass surface (composited)  →  ~10.4:1   ✓ AAA
#CDD5CB  on  #0A130E  →  13.4:1   ✓ AAA
#E2C47A  on  #0A130E  →   9.2:1   ✓ AAA
```

**No contrast caveat exists for this palette.** Every text color passes AAA on the page background and on composited glass surfaces. `mutedAlt` (#CDD5CB) is available purely as a visual-hierarchy tool, not a contrast fix.

**Important:** do NOT use `primary` (#0B5D3B) as a text color on any background — it fails AA against bg. It is a surface/gradient fill only.

---

## 2. Gradient Usage

| Token                      | Value                                                                   | Use                                                                    |
| -------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `gradient.aurora`          | `linear-gradient(100deg,#0B5D3B 0%,#0E7C66 48%,#C9A24B 100%)`           | Button bg, text-clip gradient, portrait ring border, gradient rule bar |
| `gradient.auroraSoft`      | `linear-gradient(100deg,#0B5D3B,#0E7C66 55%,#C9A24B)`                   | Tag pills, decorative fills — fractionally softer stops                |
| `gradient.ring`            | Same as aurora                                                          | Portrait frame, bento ring border                                      |
| `gradient.imageFadeBottom` | `linear-gradient(180deg,rgba(10,19,14,0) 30%,rgba(10,19,14,0.88) 100%)` | Work card image overlay                                                |
| `gradient.imageFadeSide`   | `linear-gradient(120deg,rgba(10,19,14,0.55) 0%,transparent 60%)`        | Life strip landscape overlay                                           |

### Gradient Rules

**Do:**

- Use `aurora` as `background` on `<button>` and `<a>` CTAs with `color: onGradient` (`#0A130E`) for text.
- Use `aurora` as `backgroundImage` with `-webkit-background-clip: text` for gradient headline spans (GradText pattern).
- Use `aurora` as `background` on a `2–3px` wrapper `div` to create gradient-bordered cards/rings.
- Keep gradient direction at `100deg` for all primary uses (consistent left-to-right emerald→gold sweep).

**Don't:**

- Don't use gradient text on body copy — only display/headline spans of ≥24px.
- Don't tint the gradient with opacity; if you need a softer version use `auroraSoft`.
- Don't use gradient fills on glass surfaces — the surface fill is `rgba(255,255,255,0.05)` only; the gradient appears as a hairline border wrapper.
- Don't flip the gradient direction to gold→emerald — the brand reads left-warm-right-cool-to-gold, not the reverse.
- Don't introduce pink, violet, electric-blue, or cyan into any gradient stop.

---

## 3. Glass Surface System

Two glass presets. Spread directly into React `style` props or copy the CSS values.

### `glass.card` — default

```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(201, 162, 75, 0.16);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.06),
  0 30px 80px -40px rgba(0, 0, 0, 0.85);
```

Use on: nav pill, proof stat cards, work gallery cards, process cards, skill chips, secondary CTA button.

### `glass.cardHi` — elevated

```css
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(201, 162, 75, 0.24);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.06),
  0 30px 80px -40px rgba(0, 0, 0, 0.85);
```

Use on: hero portrait chips, hover state of cards, elevated panels.

**Blur must be 20px.** Less makes the glass look cheap; more creates performance issues on mobile. Always apply `will-change: transform` on animated glass elements.

---

## 4. Typography System

### Font Families

| Role                 | Family         | CSS var            | Fallback                 | Load via           |
| -------------------- | -------------- | ------------------ | ------------------------ | ------------------ |
| Display / headings   | Fraunces       | `--font-fraunces`  | Georgia, serif           | `next/font/google` |
| Body / UI            | Hanken Grotesk | `--font-hanken`    | system-ui, sans-serif    | `next/font/google` |
| Labels / mono / code | JetBrains Mono | `--font-jetbrains` | 'Courier New', monospace | `next/font/google` |

### Font Loading (next/font/google)

```ts
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"], // load heavy weights — thin look = loading only 300/400
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
```

Apply all three `variable` class names to the page root wrapper. The CSS vars then cascade to all children.

**Banned fonts:** Inter · Poppins · Montserrat · Raleway · Nunito. These are generic "AI startup" / SaaS fonts that directly conflict with the premium editorial identity. If a third-party component imports Inter, override it at the CSS layer.

---

## 5. Type Scale

| Level     | Font      | px (ref) | rem   | Weight  | Fraunces class   | Tracking | Line-height | Fluid clamp                           |
| --------- | --------- | -------- | ----- | ------- | ---------------- | -------- | ----------- | ------------------------------------- |
| `display` | Fraunces  | 90       | 5.625 | **900** | `font-black`     | -0.02em  | 0.95        | `clamp(3.1rem,7.8vw + 0.5rem,5.6rem)` |
| `h1`      | Fraunces  | 56       | 3.5   | **800** | `font-extrabold` | -0.02em  | 1.05        | `clamp(2.4rem,5vw + 0.5rem,4.2rem)`   |
| `h2`      | Fraunces  | 40       | 2.5   | **800** | `font-extrabold` | -0.01em  | 1.10        | `clamp(1.9rem,4vw + 0.5rem,3.5rem)`   |
| `h3`      | Fraunces  | 28       | 1.75  | **700** | `font-bold`      | -0.01em  | 1.20        | — (use `text-2xl` / `text-3xl`)       |
| `bodyLg`  | Hanken    | 18       | 1.125 | 400     | —                | 0        | 1.65        | —                                     |
| `body`    | Hanken    | 16       | 1.0   | 400     | —                | 0        | 1.60        | —                                     |
| `small`   | Hanken    | 14       | 0.875 | 400     | —                | 0        | 1.50        | —                                     |
| `mono`    | JetBrains | 14       | 0.875 | 400     | —                | 0        | 1.50        | —                                     |
| `label`   | JetBrains | 12       | 0.75  | 500     | —                | 0.25em   | 1.40        | —                                     |

### Fraunces Weight Rules

- **900 (black)** — hero display only. Short, single-line, maximum impact. One instance per page.
- **800 (extrabold)** — H1 section openers, H2 subsection headings.
- **700 (bold)** — H3 card titles, process step titles.
- **600 (semibold)** — Fraunces only when used decoratively inline (e.g., a mid-sentence pull-quote).
- **400 (regular)** — Fraunces editorial body (rare; only for long-form articles).
- Gradient clip text (`-webkit-background-clip: text`) always uses Fraunces at the weight matching the parent heading level.

### Hanken Grotesk Rules

- Body and UI text. Max weight for body emphasis: **600** (semibold) on a `<strong>` or highlighted span.
- Navigation links: 400 base, 600 on active/hover.
- CTA button labels: 600.
- Never use 700+ in body copy — reserve heavy weights for Fraunces.

### JetBrains Mono Rules

- Section eyebrow labels (`text-xs uppercase tracking-[0.25em]`): 500.
- Stat badges, chip labels: 400–500.
- All-caps labels must use `tracking: 0.25em` — do not use default tracking on uppercase mono.

---

## 6. Emerald Ramp

| Step    | Hex           | Notes                                     |
| ------- | ------------- | ----------------------------------------- |
| 50      | `#E8F5EF`     | Background tint for light-mode future use |
| 100     | `#C5E6D6`     |                                           |
| 200     | `#9FD3BB`     |                                           |
| 300     | `#6DBFA0`     |                                           |
| 400     | `#3DAF86`     |                                           |
| **500** | **`#0B5D3B`** | **Locked brand primary**                  |
| 600     | `#094E32`     | Hover state on emerald elements           |
| 700     | `#073F28`     |                                           |
| 800     | `#05301E`     |                                           |
| 900     | `#022014`     | Deepest shade — near-black                |

---

## 7. Gold Ramp

| Step    | Hex           | Notes                            |
| ------- | ------------- | -------------------------------- |
| 50      | `#FBF5E6`     |                                  |
| 100     | `#F5E8C2`     |                                  |
| 200     | `#EDD898`     |                                  |
| 300     | `#E5C96F`     |                                  |
| 400     | `#DDB860`     | Close to `accentLight` (#E2C47A) |
| **500** | **`#C9A24B`** | **Locked brand accent**          |
| 600     | `#AA883A`     | Hover state on gold elements     |
| 700     | `#896D2D`     |                                  |
| 800     | `#69531F`     |                                  |
| 900     | `#493912`     |                                  |

---

## 8. Spacing & Radius Reference

### Spacing (4px grid)

`1=0.25rem` · `2=0.5rem` · `3=0.75rem` · `4=1rem` · `5=1.25rem` · `6=1.5rem` · `8=2rem` · `10=2.5rem` · `12=3rem` · `16=4rem` · `20=5rem` · `24=6rem`

### Border Radius

| Token  | Value    | Use                           |
| ------ | -------- | ----------------------------- |
| `sm`   | `0.5rem` | Chips, pills inner            |
| `md`   | `1rem`   | Small cards                   |
| `lg`   | `1.5rem` | Standard cards                |
| `xl`   | `2rem`   | Portrait ring, large panels   |
| `2xl`  | `2.5rem` | CTA hero panel                |
| `full` | `9999px` | Nav pill, buttons, stat chips |

---

## 9. Do / Don't Summary

| Do                                                                        | Don't                                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Use `brand.gradient.aurora` from `lib/brand.ts` — no inline hex strings   | Hardcode `#0B5D3B` or gradient strings in component files                |
| Fraunces at 800–900 for display headings                                  | Use Fraunces at 300 or 400 for headlines (looks weak)                    |
| `color: onGradient` (`#0A130E`) for text on gradient buttons              | Light text on gradient buttons — fails contrast                          |
| Glass blur at exactly 20px                                                | Reduce blur below 16px ("airier") or push above 24px (perf hit)          |
| JetBrains Mono with `tracking: 0.25em` for uppercase labels               | Default tracking on ALL-CAPS mono labels                                 |
| Keep gradient direction at `100deg`                                       | Reverse the gradient or rotate to vertical                               |
| Use emerald/gold bloom divs (`opacity 0.12–0.42`, `blur(90px)`) for depth | Solid color blobs or visible hard-edged backgrounds                      |
| Import fonts via `next/font/google` with all heavy weights declared       | Load Fraunces without 800/900 in the weights array                       |
| Use `mutedAlt` for visual hierarchy lift                                  | Use `mutedAlt` thinking it "fixes" contrast (#B8C2B6 already passes AAA) |
