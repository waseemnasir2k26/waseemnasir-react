# waseemnasir.com Revamp — Master Plan & Build Handoff

> **Authored by:** Fable 5 (strategy pass, 2026-07-15) · 10-agent research fan-out
> **For:** Build-model handoff (execute phases in order; obey every HARD rule)
> **Goal (locked by Waseem):** BOOK MORE CALLS. Premium motion serves conversion, never replaces it.
> **Repo:** `GITHUB\waseemnasir-react` — Next.js 14, React 18, Tailwind 3, framer-motion 11 + lenis 1.1 ALREADY installed. Deploys to Vercel. ⚠ HARD GOTCHA: www alias is PINNED → run `vercel alias set` after EVERY `--prod` deploy.

---

## 1. Executive summary

Rebuild waseemnasir.com as a **conversion-first founder site with award-tier motion polish** — not a design-flex clone. The reference (sstiem.com) is bot-walled with zero archive/index footprint, so the motion direction is derived from the 2025-26 award-tier consensus stack instead (Lenis + scroll reveals + one sticky-pin moment + text stagger). Research verdict across 10 agents: the current site's booking path is already strong (1-click, 9/10); the real gaps are **zero testimonials, zero quantified outcomes, and no face-forward hero video** — fix those, then layer motion.

**The unclaimed differentiator (competitive scan, 10 live AI-founder sites):** nobody in the niche combines (a) face-forward founder video hero, (b) named case studies with real outcomes, (c) a real booking funnel. Audience-builders (Ottley, Herk) have no booking; service-sellers (AutomateScale, Flowmondo) have no face. Waseem can own the intersection.

---

## 2. Current site audit (agent-verified 2026-07-15)

| Area         | Score | Note                                                                                                                                              |
| ------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structure    | 7/10  | 7 sections, logical, but narrative-heavy vs proof                                                                                                 |
| Hero/CTA     | 7/10  | "AI automation that pays for itself" + "Book a free audit" — good                                                                                 |
| Proof        | 5/10  | 4 named case studies (KODIASIMMO, Takycorp, Christelle, Lahore dental) but ZERO testimonials, ZERO quantified outcomes                            |
| SEO/meta     | ✅    | Phase-0 ground truth: title/meta/OG + Person & Organization JSON-LD ALL EXIST on live site (subagent fetch couldn't see head — verified via curl) |
| Booking path | 9/10  | 1 click → skynetjoe.com/discovery-call, repeated 4×                                                                                               |
| Copy voice   | 8/10  | Solo-operator, candid — KEEP this voice                                                                                                           |

**MUST-fix list:** ① client testimonials ② quantified outcomes per case study (client-approved real numbers ONLY — house rule: no invented metrics) ③ FAQ + FAQPage schema (SHIPPED 07-15) ④ post-booking process strip (SHIPPED 07-15) ⑤ link out to verifiable proof (Fiverr profile, GitHub, live client sites).

---

## 3. Positioning & messaging

**Angle (recommended):** outcome-first + delivered-niche hybrid. NOT "AI agency." Lead with the operational outcome for buyer types Waseem has actually shipped for (service businesses, clinics, logistics ops, e-com).

**Site role split:** waseemnasir.com = founder trust layer + booking funnel entry; skynetjoe.com = agency/service depth. One brand system, two lenses. Keep the single CTA destination (`skynetjoe.com/discovery-call`) — do not fragment.

**Hero headline candidates** (operator voice, zero invented stats — Waseem picks/edits):

1. "Ops systems that catch the leads your team is missing."
2. "I don't sell 'AI.' I build the ops backbone that stops things falling through the cracks."
3. "Less manual follow-up. More closed deals. Built around how your business actually runs."
4. "From messy spreadsheets to a system that runs itself."
5. Keep current "Every hour your team works by hand, your business leaks money." (already outcome-first — viable to retain)

**Proof narrative per case study:** 2-4 sentence summary → client context (industry/size) → problem (mirror prospect's pain) → what was built (n8n/GHL/WP specifics) → outcome. Outcome = qualitative UNLESS a client-approved verified figure exists. HARD: never fabricate, never round up ([no-fake-claims], [no-invented-metrics]).

**AI-buyer trust rule (highest-confidence finding):** 2026 buyers fear vaporware. Show WORKING systems — live demo links, screen recordings, dashboards — over claims. Waseem has real ones (Takycorp ops dashboard, skynetjoe tools engine, creator portal). Use them.

---

## 4. Site architecture (section spec, in order)

1. **HERO** — headline + subhead + primary CTA "Book a free audit" (visually dominant, above fold, zero animation delay on LCP element) + secondary "See the work ↓". Face-forward founder photo (EXISTS) or short muted autoplay loop ≤2MB (upgrade option). Trust strip with verified figures (EXISTS).
2. **PROOF STRIP** — client status row (EXISTS as Trust).
3. **PROBLEM → SOLUTION** — "where it leaks" copy (EXISTS as How/Stack).
4. **CASE STUDIES (the sticky-pin moment)** — ONE pinned scrollytelling section: case studies swap as user scrolls. All text present in DOM (SEO hard rule). **SHIPPED 07-15** (desktop+motion; grid fallback mobile/reduced-motion).
5. **TESTIMONIALS** — new. 2-4 client quotes (Waseem must collect). Named > anonymous > none. **Scaffold gated in code — ships only when real quotes land.**
6. **PROCESS** — post-booking 3 steps. **SHIPPED 07-15** as strip in Convert.
7. **FOUNDER/STORY** — condensed narrative (EXISTS as About/Gallery) — trust texture, NOT the lead.
8. **FAQ** — 6 real questions, price anchor, ~14 days, tools. Question-shaped H3s + FAQPage schema (visible text = markup text). **SHIPPED 07-15.**
9. **FINAL CTA** — full-width booking block (EXISTS as Convert) + Loom-style 60-90s intro video near CTA (pending Waseem recording).
10. **Sticky CTA bar** — EXISTS (MobileCTABar).

Blog stays; add `/work/<case-slug>` detail pages later (phase 5) for shareability + indexing.

---

## 5. Motion system spec

**Stack decision:** KEEP existing deps — `framer-motion` (micro-interactions, reveals via `whileInView`, `useScroll`/`useTransform` for the pin section) + `lenis` (gentle smooth scroll). Do NOT add GSAP unless the pin section proves infeasible in FM. Use `LazyMotion` + `m` components where new code allows — no full-bundle import.

**USE (8):** scroll-triggered fade/rise reveals · number counters · logo marquee · text stagger on H1 + section titles · Lenis smooth scroll (gentle inertia) · route/section fades <300ms · ONE sticky-pin section (case studies only) · magnetic/hover CTA (desktop only).

**AVOID (5) — hard:** full scroll-jacking · custom cursor · horizontal-scroll sections on mobile · full-viewport WebGL/shader hero · >3 stacked parallax layers.

**Per-rule:**

- Animate ONLY `transform`/`opacity`/`filter`. Never layout properties.
- Content visible-by-default in DOM; animation is enhancement FROM visible state.
- LCP element (hero H1 + CTA): renders at full opacity/final position on first paint.
- `prefers-reduced-motion`: root gate (`useReducedMotion`) → reduced users get end-state instantly; Lenis init `smoothWheel: !reducedMotion`.
- Reserve layout space for animated elements (no CLS).

---

## 6. SEO/AEO hard rules (build must obey — checklist)

1. All rankable text in initial rendered DOM (SSR/SSG — Next 14 does this; don't client-gate copy).
2. No content injected only on scroll/click. Pin section: all case-study texts in DOM.
3. No canvas/WebGL text without DOM equivalent.
4. Animation JS budget ≤ ~110KB; code-split below-fold motion.
5. CWV targets: LCP <2.5s · INP <200ms · CLS <0.1 (p75). Lighthouse gate pre-ship.
6. JSON-LD: Person ✅ + Organization ✅ (both live) + **FAQPage** (SHIPPED 07-15) + Service + BreadcrumbList + BlogPosting on posts. Frame as infrastructure, not citation guarantee (2026 Ahrefs: schema alone ≠ citation lift).
7. AEO extraction style: short declarative sentences, question-shaped H2/H3s, one-answer-per-block.
8. llms.txt: exists in repo (see commit 108af44).
9. Verify with Google URL Inspection rendered-HTML before ship.
10. Meta/OG/Twitter/canonical: verified present on live site.

---

## 7. Mobile + accessibility rules

- Sticky-pin → mobile fallback: unpinned stacked cards. iOS URL-bar viewport shifts break pins — never pin <1024px. (IMPLEMENTED: `hidden lg:block` split.)
- Hover/magnetic effects: desktop-only; tap states on touch.
- Use `dvh` not `vh` for full-height sections where iOS matters.
- Marquee/looping animations: pause off-screen; cap 30fps if canvas.
- WCAG 2.1 AA is the legal-de-facto bar; 2.3.3 (AAA) satisfied free via reduced-motion gate.
- Test matrix pre-ship: iPhone Safari + Android Chrome + 375px viewport + reduced-motion ON.

---

## 8. Booking funnel architecture

- **Keep:** single destination `skynetjoe.com/discovery-call` (GHL calendar — already licensed; avoids Calendly's 464KB iframe payload + keeps bookings in CRM).
- **Add qualifying micro-form** before calendar (2-3 fields: business type, main bottleneck, rough budget band) — lives on skynetjoe.com funnel side, not this repo.
- **Reminders:** GHL 3-touch — confirm → 48h → 2-4h day-of, SMS where possible, "Reply C to confirm."
- **Timezone:** auto-detect, show visitor-local times (Bali founder ↔ US/EU buyers).
- **Tracking:** GA4 `generate_lead`/`appointment_booked` via GTM postMessage listener + Meta `Schedule` event + CAPI with shared event ID. ⚠ GA4/Pixel IDs = existing open gate in [traffic-growth-plan-2026-07].
- **Later (dogfood):** Vapi voice callback within 60s of form submit — sells itself as a demo of the service. Phase 5, not launch.

## 9. Conversion rules (locked into design)

- CTA at hero + after proof + end + sticky bar. Same label everywhere ("Book a free audit").
- Proof leads with named specific case studies, not a logo wall.
- Pricing: floor anchor in FAQ once Waseem sets it (current copy: "fixed quote after free audit").
- Loom-style personal video near final CTA (pending recording).
- Animation is subordinate to CTA access — any motion that delays CTA visibility gets cut.

---

## 10. Build phases (status 2026-07-15)

**Phase 0 — Audit ground truth:** ✅ DONE — meta/OG/schema verified present; repo = 17 variants, root = blueprint; baseline build 157kB first-load.
**Phase 1 — Content & proof (Waseem-dependent):** ⛔ OPEN — testimonials + client-approved outcome figures + headline pick + Loom + pricing floor + GA4/Pixel IDs.
**Phase 2 — Structure & copy:** ✅ SHIPPED 07-15 — FAQ + FAQPage schema, post-booking strip, testimonial scaffold (gated).
**Phase 3 — Motion layer:** ✅ SHIPPED 07-15 — pinned proof deck (desktop+motion) with grid fallback; existing Reveal/CountUp/marquee retained.
**Phase 4 — QA & ship:** ⛔ NEXT — Waseem visual pass → /critic-loop → Lighthouse ≥90 → deploy via vercel --prod → **`vercel alias set` www (PINNED gotcha)** → URL Inspection.
**Phase 5 — Later:** testimonials render, Loom embed, /work detail pages, Vapi callback dogfood.

**Ship gates (all HARD):** critic-loop PASS · CWV green · zero invented metrics in copy · reduced-motion verified · www alias set.

## 11. Waseem input needed (blockers, ranked)

1. **Testimonials** — ask Takycorp (Nkento), Christelle, KODIASIMMO/ideaviaggi, dental client. 2-3 sentences each + permission to name.
2. **Outcome numbers** — per case study, client-approved real figures. If none → qualitative only.
3. **Hero headline pick** (§3) + pricing floor for FAQ anchor.
4. **60-90s Loom intro video** + hero video-loop decision.
5. **GA4 + Pixel IDs** (same gate as traffic-growth plan).
6. **sstiem.com** — bot-walled to all tooling; if the exact animation feel matters, screen-record a scroll-through and drop it in the repo.

## 12. Research provenance

10-agent fan-out 2026-07-15 (Fable 5): sstiem teardown (null — no footprint) · live-site audit · 10-site competitive scan (AutomateScale, Flowmondo, Goodspeed, Ottley, Herk, +5) · award-tier motion pattern library · conversion playbook (vendor-sourced, directional) · React motion stack memo · SEO/AEO hard rules (Ahrefs 2026 schema study) · positioning research · mobile/a11y matrix · booking funnel mechanics. Key caveat: most conversion stats = vendor blogs, directional not proven; all real-number claims in copy must be client-verified.

## 13. ⚠ OneDrive hazard (learned 2026-07-15, the hard way)

Repo lives inside OneDrive. OneDrive sync REVERTED uncommitted working-tree edits once (blueprint page + this file, ~1h of work). **Rule: commit to a git branch immediately after any meaningful edit batch in this repo. Never leave work uncommitted.**
