# Image Map — Blueprint page refresh (FRESH picks)

Target file: `app/v/blueprint/page.tsx`
Image path helper in file: `const IMG = (f: string) => \`/img/pro/${f}\`;` (line 66) — gallery + about + hero all resolve through `/img/pro/`.
All NEW images are already present in `public/img/pro/` (no copy needed). All NEW picks are < 1MB (largest 399 KB) — no compression flagged.

Owner constraint honored: every NEW pick is DIFFERENT from the current live image in that slot, and none reuse the two banned files
(`CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg`, `CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg`).

---

## Primary slots

| Slot | Location (page.tsx) | Role | OLD (live) | NEW path | Orientation | Alt text |
|---|---|---|---|---|---|---|
| Hero photo card | line ~616, `<Image src={IMG(...)}>` inside HERO 7/5 grid, `aspectRatio: 4/5` | Strong confident founder portrait | `CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg` | `/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg` | Portrait (fills 4:5) | `Waseem Nasir — confident founder portrait, arms crossed in sunglasses` |
| About portrait card | line ~1355, `<Image src={IMG(...)}>` in ABOUT section, `aspectRatio: 4/5` | Operator-at-work / builder credibility | `PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg` | `/img/pro/CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg` | Portrait-friendly 4:5 crop | `Waseem Nasir working on a laptop on a cafe couch against an exposed-brick wall` |

Note on swap: the live page used a CAFE-WORK shot in the hero and the strong PORTRAIT in About. Per brief, hero is now the strong PORTRAIT (arms-crossed, sunglasses, confident) and About is now an at-work CAFE-WORK shot — the semantically correct arrangement.

---

## Gallery grid — `GALLERY[]` array, lines ~1446–1509 (16 tiles, masonry "life, work & travel")

Replace each `src` (and matching `alt`). Cohesive mix: WORK/CAFE-WORK credibility + PORTRAIT + TRAVEL + LIFESTYLE + EVENT, no near-duplicate scenes, zero overlap with the live set.

| # | OLD src | NEW src (`/img/pro/…`) | Category | Alt text |
|---|---|---|---|---|
| 1 | CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg | WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg | WORK | `Waseem focused at a coworking desk, phone in hand` |
| 2 | WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg | CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg | CAFE-WORK | `Working on a laptop over coffee at a cafe in an olive track jacket` |
| 3 | EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg | EVENT-expo-booth-navy-polo-chandelier-hall.jpg | EVENT | `At an expo booth in a chandelier hall — networking proof` |
| 4 | CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg | WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg | WORK | `Working from a rice terrace, phone and power bank — nomad operator` |
| 5 | TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg | TRAVEL-2025-05-31-cliff-bucket-hat-crossbody-ocean.jpg | TRAVEL | `On an ocean cliff in a bucket hat with a crossbody bag` |
| 6 | EVENT-expo-booth-navy-polo-chandelier-hall.jpg | PORTRAIT-restaurant-closeup-glasses-beige-shirt.jpg | PORTRAIT | `Close-up portrait in glasses and a beige shirt at a restaurant` |
| 7 | CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg | CAFE-WORK-2026-06-01-rooftop-laptop-orange-juice-foreground.jpg | CAFE-WORK | `Rooftop laptop session with fresh orange juice in the foreground` |
| 8 | TRAVEL-2026-03-27-motorbike-helmet-backpack-mountain-road.jpg | TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg | TRAVEL | `Mountain-ridge portrait in a tan knit sweater` |
| 9 | LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg | LIFESTYLE-2025-08-05-coffee-cup-raise-bamboo-cafe.jpg | LIFESTYLE | `Raising a coffee cup at a bamboo cafe` |
| 10 | WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg | PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg | PORTRAIT | `Smiling in a rice field framed by palms and mountains` |
| 11 | PORTRAIT-2026-05-18-window-seat-sunglasses-facing-camera-relaxed.jpg | PORTRAIT-stool-portrait-navy-polo-framed-art.jpg | PORTRAIT | `Seated portrait in a navy polo beside framed art` |
| 12 | CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg | CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg | CAFE-WORK | `Night rooftop cafe, phone in hand with city lights behind` |
| 13 | TRAVEL-2026-03-27-khyber-pakhtunkhwa-welcome-arch-backpack.jpg | TRAVEL-2026-05-24-jungle-rail-lean-sunglasses-candid.jpg | TRAVEL | `Leaning on a jungle rail in sunglasses, candid` |
| 14 | LIFESTYLE-2025-08-08-rattan-chair-headphones-pavilion-relaxed.jpg | LIFESTYLE-cafe-counter-espresso-machine-facing-camera.jpg | LIFESTYLE | `Behind a cafe counter by the espresso machine, facing camera` |
| 15 | TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg | TRAVEL-2025-05-17-beach-standing-smile-moody-sky.jpg | TRAVEL | `Standing on a beach under a moody sky, smiling` |
| 16 | CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg | CAFE-WORK-2026-06-05-garden-cafe-blue-polo-phone-focus.jpg | CAFE-WORK | `Focused on a phone at a garden cafe in a blue polo` |

### Clean final gallery list (paste-ready, no annotations)

```
1  WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg
2  CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg
3  EVENT-expo-booth-navy-polo-chandelier-hall.jpg
4  WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg
5  TRAVEL-2025-05-31-cliff-bucket-hat-crossbody-ocean.jpg
6  PORTRAIT-restaurant-closeup-glasses-beige-shirt.jpg
7  CAFE-WORK-2026-06-01-rooftop-laptop-orange-juice-foreground.jpg
8  TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg
9  LIFESTYLE-2025-08-05-coffee-cup-raise-bamboo-cafe.jpg
10 PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg
11 PORTRAIT-stool-portrait-navy-polo-framed-art.jpg
12 CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg
13 TRAVEL-2026-05-24-jungle-rail-lean-sunglasses-candid.jpg
14 LIFESTYLE-cafe-counter-espresso-machine-facing-camera.jpg
15 TRAVEL-2025-05-17-beach-standing-smile-moody-sky.jpg
16 CAFE-WORK-2026-06-05-garden-cafe-blue-polo-phone-focus.jpg
```

---

## Build-agent notes

- Hero (`PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg`) is portrait-orientation and fills the 4:5 card cleanly with `object-cover`. Keep `priority` + existing `sizes`.
- About now uses a CAFE-WORK shot — fine for 4:5 `object-cover` (subject centered).
- All NEW files confirmed present in `public/img/pro/`; nothing copied, nothing deleted, nothing overwritten.
- Old root images `public/img/hero-portrait.jpg`, `public/img/about.jpg`, `public/img/work.jpg` (3–4 MB) are NOT referenced by the blueprint page (they're used by `components/Hero.tsx` and `components/About.tsx`). Out of scope for this slot refresh, but flagged as oversized if those legacy components are ever re-used.

## Oversized flag (>1MB)
- None among the NEW picks. All NEW gallery/hero/about images are 138 KB – 399 KB.
- Legacy (NOT used by blueprint, informational): `public/img/hero-portrait.jpg`, `public/img/about.jpg`, `public/img/work.jpg` are 3–4 MB each — compress if ever reused.
