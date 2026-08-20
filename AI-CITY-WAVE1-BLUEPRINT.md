# AI CITY — WAVE 1 BLUEPRINT (Approval Doc)

**For: Waseem. Purpose: approve/kill each item below, then Wave 2 builds.**
Routes: `/v/ai-city` (MERIDIAN) · `/v/ai-city-2` (ALTITUDE ZERO) · `/v/ai-city-3` (SIGNALGRID) — on BOTH waseemnasir.com and skynetjoe.com. All noindex/nofollow, robots-disallow `/v/`, canonical → main domain (skyline pattern).

**Provenance labels:**

- **[MY IDEA]** = from Waseem's brief: city metaphor, dual-site build, evolve the winning `/v/skyline` variant, buildings = services, locked copy/claims/tokens, static-SSR-default + WebGL upgrade, mobile tap-to-expand buildings requirement.
- **[ADDITION]** = invented by the concepts. Every ADDITION carries an approve/kill checkbox — nothing ships unapproved.

All three concepts inherit unchanged [MY IDEA]: locked H1/sub/CTA copy, proof numbers 180+/40+/9/since-2019 (2019 never counts up), plain-three imperative (fiber forbidden), DPR ≤1.5, zero image assets, dispose discipline, `webglcontextlost` → permanent static, `overflowX: clip`, dental card = "a demo build, not a paid client" verbatim, FreightOps → `/lp/logistics` only, building heights decorative-never-data.

---

## CONCEPT 1 — MERIDIAN (judge avg 86) → `/v/ai-city`

**Pitch:** One scroll = one compressed day. Page opens at golden hour ("your business by hand"), sinks through dusk, lands at deep night — when the automated city switches ON. The metaphor IS the ROI pitch: manual work ends at 5pm; automation works the night shift. Every district that wakes as darkness falls is a service that runs while the owner sleeps. Entire choreography derives from ONE uniform (`uDayness`) — sun, sky, fog, windows, bridges, all one dial. Judges' consensus: the rare gimmick that increases trust; cheapest possible choreography model; only real risk is aesthetic (sunset palette).

### Scroll choreography (6 × 100vh)

| Scroll % | Time beat   | What happens                                                                                                           |
| -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| 0–14%    | GOLDEN HOUR | Hero (SSR H1), windows dark, sun sinks past 8%. Mono cue: "IT'S 4:52 PM — SCROLL TO CLOSE THE OFFICE ↓"                |
| 14–30%   | SUNSET      | Stack district: 5 towers' windows ignite floor-by-floor as each tool card scrolls in — light choreography = the reveal |
| 30–46%   | DUSK        | Proof plaza: streetlamps pop on radially; CountUp stats fire; low ambient makes proof cylinders' pulse visible         |
| 46–64%   | NIGHTFALL   | Work boulevard: 4 client billboards light one per case card; sky = full `skyDark`; ~70% windows lit                    |
| 64–82%   | DEEP NIGHT  | Light-bridges arc between districts, packets pulsing. Scrim: "While you sleep, the system runs." (locked claims only)  |
| 82–100%  | MIDNIGHT    | Widest pull-back: full grid, all bridges, beacon. Dock CTA. One dark window blinks on at 96%                           |

Scrubbing backward runs the sunrise in reverse — free, zero extra code.

### Building→service map — Site A

| Building             | Service                                       | Pitch                                                                                    |
| -------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| The Switchboard      | Lead response / inbox                         | "Every lead answered before it goes cold."                                               |
| The Gatehouse        | Per-customer portals (idea-viaggi/KODIASIMMO) | "Each customer sees only their own door."                                                |
| The Conveyor         | Ops / CRM follow-up                           | "First touch to close, nothing dropped."                                                 |
| The Radio Mast       | Voice agents (Vapi·GHL)                       | "It picks up when you can't."                                                            |
| The Projection House | AI video editing/publishing                   | "Whole videos edited overnight — 10 vlogs in one batch." (existing blog claim, verbatim) |

### Building→service map — Site B (cream-editorial translation: night = warm deep ink, windows terracotta `#c66b3f`)

| Building            | Offer                        | Pitch                                               |
| ------------------- | ---------------------------- | --------------------------------------------------- |
| The Workshop        | n8n Automation               | "We wire your tools together so work moves itself." |
| The Exchange        | GoHighLevel CRM              | "One place where every lead and follow-up lives."   |
| The Print Works     | WordPress SEO Blog           | "Pages that bring customers in while you work."     |
| The Storefront Row  | Vibe-coded sites / e-com     | "Sites built fast that look built slow."            |
| The Answering House | AI Chatbots                  | "Answers customers at 3 AM, in your voice."         |
| The Freight Yard    | FreightOps → `/lp/logistics` | "Dispatch that runs the yard at night."             |

### Interconnection spec

Bridges = static tube geometry at 6% opacity + ONE InstancedMesh of ~60 emissive packet studs on precomputed arc LUTs. Gated by `smoothstep(0.6, 0.75, uDayness)` — bridges cannot exist before deep night (narrative enforcement). Topology mirrors real flows (Switchboard→Conveyor = lead→CRM, etc.); mono caption "illustrative flow, not live data" (spec-demo truth on decoration). Hover (pointer:fine, 30Hz raycast vs ~6 boxes): building windows overshoot 1.3×, its packets triple speed, others dim 40%, tooltip chip with pitch + anchor link. Click = smooth-scroll to that service's stage — clicking a building jumps the city to that hour.

### Mobile / reduced-motion

Static = SSR default (skyline gate verbatim). "Postcard set": each section headed by a deterministic inline SVG skyline strip hard-coded to that section's time of day — day→night story survives as discrete frames, zero JS animation. Tap-to-expand: SVG buildings are `<button>`s; tap expands detail row (CSS grid-rows), windows fill jadeBright via CSS transition. Reduced-motion: everything instant, numbers final, pre-lit.

### Perf budget

≈11 draw calls (sky quad, ground, 2 city InstancedMeshes, streetlamps, landmarks, bridge tubes, packets, sun/moon sprite, birds, beacon). Zero textures. Net bundle delta over skyline: **~8KB** (+three ~150KB gz, lazy behind gate, unchanged). Bridges/packets constructed lazily at first `uDayness > 0.5`. Killswitches: contextlost→static; 4-step frame governor (>22ms sustained: packets halved → birds off → streetlamps off → DPR 1.25 → full static). Lighthouse ≥90 protected (SSR H1, no images, three code-split).

### ADDITIONS — approve/kill

- [ ] **[ADDITION — approve/kill] "Close the Office" hero affordance** — scroll cue "IT'S 4:52 PM — SCROLL TO CLOSE THE OFFICE ↓" with scroll-driven clock glyph. The thesis in six words.
- [ ] **[ADDITION — approve/kill] Clickable clock nav** — MiniNav day-strip (dawn→midnight gradient, 6 ticks, cursor tracks scroll, click = jump to stage). Solves wayfinding inside the metaphor; judges cited it as the wayfinding fix.
- [ ] **[ADDITION — approve/kill] The last dark window** — one window stays dark all night, blinks on at 96% beside the CTA; footer `LAST MANUAL TASK · AUTOMATED`. One instance attribute; the emotional close.

### Risks

1. **Golden-hour palette → AI-slop sunset.** Mitigation: desaturated ramp, first 30% of scroll only; HTML surfaces never leave `C` tokens; `duskA/B/C` tokens locked shader-only; critic-loop hero at 3 scroll positions before ship. **⚠ Requires Waseem eyeball.**
2. **Finale stacks all systems → frame budget on mid-range GPUs.** Mitigation: one-uniform choreography (shader attribute compares, no JS loops), packets capped 60, raycast 30Hz/6 boxes, 4-step governor sheds decoration before content. Test floor: 60fps on Iris Xe @ 1.5 DPR.

---

## CONCEPT 2 — ALTITUDE ZERO (judge avg 76) → `/v/ai-city-2`

**Pitch:** Scroll position = altitude. Start above the cloud deck at 2,400m, end at 0m facing a lit doorway (the CTA). Every service is a district you fall past; each lights, expands, and hands you its placard as you pass through its altitude band. Pure controlled descent, drone-landing-shot discipline, one metaphor never broken. Judges: real conversion craft (altimeter nav, Descent Receipt) and disciplined budget, but the CTA lives at the bottom of a 2,400m ride and vertical motion under text is the highest motion-discomfort risk of the set.

### Scroll choreography (7 × 100vh, hold-and-travel pacing: 60% readable hover-hold / 40% fast fall per band)

| Scroll % | Altitude   | What happens                                                                              |
| -------- | ---------- | ----------------------------------------------------------------------------------------- |
| 0–8%     | 2400→2100m | Sky hero (SSR H1), fBm cloud deck, city glow through gaps. HUD altimeter `ALT 2400M`      |
| 8–16%    | 2100→1700m | Cloud punch: planes scale past camera; proof strip rides as HUD mono line                 |
| 16–34%   | 1700→1200m | District A "Signal Heights" (lead/intake) power-on wave; bridges begin                    |
| 34–52%   | 1200→800m  | Through-the-gap flyby → "Pipeline Row" (ops/CRM); a pulse from A visibly arrives          |
| 52–68%   | 800→450m   | "Portal Quarter" (portals/sites) — idea-viaggi/KODIASIMMO cards                           |
| 68–84%   | 450→150m   | "Broadcast Basin" (voice + AI video) — 4 locked case cards                                |
| 84–100%  | 150→0m     | TOUCHDOWN: hard ease-out, eye-level wet street, lit doorway = dock CTA, `ALT 0M · LANDED` |

### Building→service maps

**Site A:** The Signal Spire (lead response) · Pipeline Row HQ (ops/CRM — a building that IS a bridge) · The Portal Gate (per-customer portals, lit archway) · The Switchboard (voice agents, call-and-response window pairs) · The Cutting House (AI video, screen facade). One-line pitches as authored in concept (all claim-safe).
**Site B (districts map 1:1 to SERVICE_CATEGORIES):** Automation (The Relay Works/n8n, Dispatch Yard/FreightOps via `/lp/logistics`, The Follow-Up Office/GHL, Junction Box/Zapier·Make, The Night Shift/social) · AI Content (The Studio Stack, Broadcast Basin triplets) · Development (The Print Works/WP-SEO, The Storefront/e-com, Glasshouse Annex/vibe-coded, The Concierge/chatbots) · Consulting (City Hall, The Drafting Room, The Sign Shop, The Newsroom).

### Interconnection spec

ONE InstancedMesh of ≤24 thin beams tower-to-tower; ShaderMaterial with per-instance phase — a moving gaussian jadeBright "packet" per beam, one uniform write per rAF. Packet phases staggered so a pulse leaves the district you just read and arrives at the one you're falling toward. Canonical relay drawn: intake → n8n → GHL → storefront/portal. Hover (every-3rd-frame raycast, ≤20 boxes): tower glows 1.3×, its bridges full-bright, tooltip in plain words (`WHATSAPP INTAKE → N8N → GHL`), 400ms damp decay. Reduced-motion: constant glow, packets frozen mid-span.

### Mobile / reduced-motion

Static SSR default, same gate. Stacked district sections in descent order; deterministic SVG skyline reused as a left-margin **cross-section elevation strip** whose district band highlights via IntersectionObserver class toggles. Tap-to-expand: SVG silhouette row per district, native `<details>`-based cards, CSS window-light transition. Altimeter becomes in-flow labels (no fixed element, no motion).

### Perf budget

≤11 draw calls; window power-on = shader `uWakeFront` compare (no matrix churn); only matrix writes = ≤5 tower scale-Y instances during a band's travel slice. Route delta vs skyline: **+7–9KB gz**. Killswitches: contextlost→static; frame monitor (median >22ms/2s → bridges+clouds freeze; >28ms → full static). Bridges drop FIRST — worst case = the proven skyline minus interconnection.

### ADDITIONS — approve/kill

- [ ] **[ADDITION — approve/kill] The Altimeter Rail** — fixed HUD doubles as click-nav (`1200M — PIPELINE ROW`); pure HTML, works in static mode as anchor list. Fixes the buried-CTA judge criticism partially (jump to touchdown any time).
- [ ] **[ADDITION — approve/kill] The Descent Receipt** — touchdown card prints only districts you dwelt in ≥1.5s: `SURVEYED: … → BOOK THE AUDIT FOR THESE`. Session-only, no storage. Behavior-personalized CTA; degrades to locked dock copy.
- [ ] **[ADDITION — approve/kill] Through-the-gap moment** — camera authored between two towers at ~1.5-unit clearance at the A→B transition. The screen-record shot; costs two waypoints. (Judges flag it as QA surface — kill if motion-comfort testing fails.)

### Risks

1. **Reading-vs-falling motion discomfort.** Mitigation: hard contract — placards full-opacity only where camera drift ≤2m/s; travel zones carry no readable text (≤15% opacity); 3-real-device scroll pass before ship (green gates can still be bad).
2. **Bridge/hover surface breaking determinism/perf.** Mitigation: builder-pattern module, stable refs, shared PRNG seed, degrade ladder drops bridges first.

---

## CONCEPT 3 — SIGNALGRID (judge avg 68) → `/v/ai-city-3`

> Replaced NERVE CITY (biology metaphor) per Waseem ruling 08-20: ONE category only — pure AI City. SIGNALGRID is the next-ranked city-native concept.

**Pitch:** The city is wireframe; the DATA is the star. Buildings are thin jade edge-only outlines on near-black — the only bright thing on screen is data in motion: pulses traveling building-to-building on catenary light-bridges, continuously. The city is the circuit board; the pulses are the product. Every service section = "this tower's traffic, isolated." Judges: cheapest GPU profile of the field (~5 draw calls, all animation in shaders), the honest-topology hover teaches the real architecture; risk is wireframe minimalism reading "unfinished" without polish.

**New tokens (additive only):** `signalDim rgba(31,231,199,0.22)` idle lanes · `signalHot #7FFFE9` pulse head · `gridHair rgba(17,126,115,0.30)` wireframe stroke. Everything else = Skyline `C` verbatim (skyDark ground, jadeBright signal, fonts, EASE, Scrim, pill CTA).

### Scroll choreography (6 × 100vh)

| Scroll % | Beat             | What happens                                                                                                                                                                             |
| -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–16%    | ENTRY            | SSR H1 over full living grid, ~25 pulses alive; proof strip mono pinned bottom-left (locked numbers)                                                                                     |
| 16–32%   | GRID             | Camera lifts to 35° overhead; 5 STACK towers power on sequentially, each ignition = radial pulse burst; n8n tower center = highest-degree node — the architecture diagram IS the skyline |
| 32–50%   | TOWER FLYBYS     | Street-grazing dolly past 4 service towers; `uFocusBuilding` isolates each (its lanes 100%, rest 12%); HTML card crossfades anchored by facade fragment                                  |
| 50–64%   | PROOF SUBSTATION | Plaza of 4 wireframe substations; CountUps (locked); pulse traffic visually converges as numbers count; heights decorative-never-data                                                    |
| 64–82%   | WORKS BOULEVARD  | 4 client towers — dental Demo tower in distinct DASHED stroke (spec-demo truth made visual); hover isolates that client's real signal path                                               |
| 82–100%  | UPLINK           | Every lane bends toward the tallest tower and pulses up into fog; max signal density = dock CTA (locked copy)                                                                            |

### Building→service map — Site A

| Building         | Service                 | Silhouette + pitch                                                                                              |
| ---------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| The Exchange     | Lead response / inbox   | Wide slab, antenna comb, most inbound lanes. "Every lead answered before it goes cold."                         |
| The Gatehouse    | Per-customer portals    | Twin towers, one bright skybridge gate. "Each customer sees only their own floor."                              |
| The Relay Yard   | Ops / CRM follow-up     | Stepped ziggurat, lanes enter low exit high. "First touch to close, moved automatically."                       |
| The Speaker      | Voice agents (Vapi·GHL) | Slim cylinder radiating pulse rings. "Follow-up calls that happen while you sleep."                             |
| The Cutting Room | AI video (Now-building) | Horizontal gantry; scatter in, ordered stream out. "10 Ubud vlogs cut in one overnight batch." (verbatim claim) |

### Building→service map — Site B (4 category blocks = SERVICE_CATEGORIES; FreightOps → `/lp/logistics` only)

| Block              | Offers                                                                    | Pitch                                                                  |
| ------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Automation Quarter | n8n · GHL · Zapier/Make · social · FreightOps                             | "We wire your tools together so work moves itself."                    |
| Broadcast Row      | AI video · YT/TikTok/FB automation (fan-out lanes)                        | "One piece of content goes in, every platform gets it."                |
| Foundry Block      | WP SEO · e-com · vibe-coded sites · chatbots (self-completing wireframes) | "Sites and bots built fast, owned by you."                             |
| The Observatory    | AI business systems · strategy · branding · content                       | "We look at your whole operation and tell you what to automate first." |

### Interconnection spec

Hand-authored static graph JSON (~2KB): edges mirror REAL integrations (WhatsApp→n8n→GHL) — hovering teaches the actual architecture. All bridges in ONE LineSegments buffer; isolation = single `uFocusBuilding` uniform (`touchesFocus ? 1.0 : 0.12`), zero draw-call changes. "Glow" faked by double-stroke (wide translucent underlay + thin core) — no bloom pass. Hover: rAF-throttled raycast vs invisible hit-proxy boxes; connected lanes double pulse rate; Scrim tooltip via direct style.transform (no React re-render). Click = native scrollIntoView. Keyboard parity: focusable HTML tower list drives the same uniform — 3D isolation is a11y-navigable.

### Section treatment

Each section anchored by that building's **facade fragment**: 220×280 inline SVG generated at BUILD TIME from the same JSON as the 3D geometry (2D/3D never drift). Lane rule: 1px jadeBright line enters from viewport edge, terminates at card — section "plugged into" the grid. Mono kickers = grid addresses (`DISTRICT 03 · THE RELAY YARD`). No new colors, no images — identity is stroke + pulse.

### Mobile / reduced-motion

Static = SSR default (skyline gate verbatim; three.js never downloads). Mobile star: full-width static SVG city map (~14KB inline, same build-time silhouettes) — towers are `<button>`s; tap expands accordion + CSS-animates that tower's lanes (`stroke-dashoffset`, compositor-only). One tower open at a time. Reduced-motion: lanes static solid, expansion instant. All content in DOM, real headings/links.

### Perf budget

≤5 rendered draw calls (wireframes, bridge underlay, bridge core, window-flicker Points, ground grid). ~60K vertices. rAF writes 3 uniforms + camera — zero allocation, zero React renders. Scene module **~14KB gz**; DPR 1.5; no postprocessing/targets/shadows. Killswitches: contextlost→static; FPS governor (<48fps → drop flicker + halve pulses via `uDensity`; <30fps 3s → dispose, static; one-way ratchet); tab-hidden freezes uTime; `?static=1` QA param. First-frame readPixels sanity check → killswitch if lane luminance absent.

### ADDITIONS — approve/kill

- [ ] **[ADDITION — approve/kill] Live-lane honesty chip** — real client lanes labeled "1 pulse = 1 handled message (illustrative)". Turns the truth-gate into a design voice.
- [ ] **[ADDITION — approve/kill] The Leak** — one deliberately broken lane; pulses die mid-bridge; hover chip "This is the leak. Manual handoff. Data dies here."; click → CTA. The H1 dramatized inside the system — the Awwwards moment.
- [ ] **[ADDITION — approve/kill] Twin-source silhouettes** — one JSON emits both three.js geometry AND the SVG fallback at build time. Mobile ships the same city, zero drift.

### Risks

1. **Custom GLSL is the one novel surface** (skyline shipped stock materials). Mitigation: ~120 lines, no derivatives/loops/textures; frame-2 readPixels sanity → killswitch; test matrix Intel iGPU + Apple + NVIDIA; `?static=1` always the verified floor.
2. **Wireframe reads "unfinished" if untuned.** Mitigation: double-stroke glow budgeted FIRST; /critic-loop on hero-only build at 20% cost with rubric line "engineered luxury or debug view" — kill/pivot early.

---

## SHARED SECTION

### Route plan [MY IDEA]

- Site A (waseemnasir-react): `app/v/ai-city/`, `app/v/ai-city-2/`, `app/v/ai-city-3/` — each self-contained like skyline (mirrored tokens, server page.tsx + one client component), noindex/nofollow, canonical → `https://www.waseemnasir.com`, covered by existing `robots.ts` disallow `/v/`.
- Site B (skynetjoe): same three routes, same noindex discipline, canonical → skynetjoe.com. Palette translation per concept (documented above). **Deploy = manual ZIP to Hostinger — never the /deploy skill; commit ≠ deployed on Hostinger.**
- `/v/skyline` stays FROZEN as reference. Nothing on the main domains changes in Waves 2–3.

### Differentiation matrix (proof these are 3 distinct experiences, not reskins)

| Axis                | MERIDIAN                             | ALTITUDE ZERO                                 | SIGNALGRID                                 |
| ------------------- | ------------------------------------ | --------------------------------------------- | ------------------------------------------ |
| Core metaphor       | Time (one day, dusk→night)           | Space (2,400m vertical descent)               | Circuit (wireframe data grid)              |
| Scroll =            | Clock hand                           | Altimeter                                     | Camera through the circuit                          |
| Emotional register  | Warm→triumphant ("night shift wins") | Cinematic vertigo → landing relief            | Engineered, kinetic precision            |
| Palette journey     | Golden dusk ramp → shipped skyDark   | Cloud-paper white → jade night street         | Near-black + single jade signal color             |
| Choreography driver | ONE scalar (`uDayness`)              | Camera Y spline + hold/travel pacing          | GPU shader pulses off uTime + uFocusBuilding |
| Interconnection     | Night-gated packet bridges           | Beam relay, pulses hand-off between districts | Catenary lanes, honest-topology pulses       |
| Hover model         | Raycast 30Hz, click = time-jump      | Raycast 1/3 frames, plain-words tooltips      | rAF raycast, focus-isolation uniform     |
| Nav invention       | Clock-strip day nav                  | Altimeter rail                                | The Leak (broken lane → CTA)                        |
| Signature moment    | The last dark window                 | Through-the-gap flyby                         | UPLINK — all lanes bend to the CTA tower          |
| Bundle delta        | ~8KB                                 | ~7–9KB                                        | ~14KB                                       |

### Build order

1. **W2 — MERIDIAN** (winner, hardest palette risk — front-load Waseem's eyeball): Site A build → critic-loop jury → Site B port → jury → both staged.
2. **W3a — ALTITUDE ZERO**: Site A → motion-comfort 3-device pass → jury → Site B port.
3. **W3b — SIGNALGRID**: Site A → hero-only critic pass (luxury-vs-debug rubric) → jury → Site B port. (W3a/W3b can run as parallel agents — disjoint routes.)
4. **W4 — estate QA**: Lighthouse ≥90 all 6 routes, Iris Xe 60fps floor, cross-browser, then Waseem picks promotion path.

### Ship gates (non-negotiable)

- Critic-loop jury (independent, no self-grading) at end of W2 and W3, per route, before any deploy.
- NO deploy of anything without Waseem approval of this blueprint first, and no promotion beyond `/v/` previews without a second explicit ruling.
- Anti-slop gate: MERIDIAN hero screenshotted at 3 scroll positions for Waseem before polish.
- All claims verbatim from `site.ts` canon; any new sentence passes the no-fake-claims gate.
- skynetjoe deploys = manual Hostinger ZIP, verified live (commit-is-not-deployed rule).

### Decisions Waseem must make (the approval checklist)

1. **GO/NO-GO per concept** (build all 3, or cut to top 1–2?).
2. **MERIDIAN dusk palette** — approve `duskA/B/C` warm-ramp direction after seeing 3-position hero mock (the one aesthetic risk judges docked it for).
3. **9 ADDITIONs** — approve/kill each checkbox above; flagged: ALTITUDE's through-the-gap (QA cost).
4. **Site B palette translation ruling** — warm-ink night + terracotta windows for the cream-editorial brand: yes/no.
5. **Build order confirm** — MERIDIAN first, ALTITUDE+SIGNALGRID parallel in W3: yes/no.
