# waseemnasir.com Revamp — Master Plan & Build Handoff

> **Authored by:** Fable 5 (strategy pass, 2026-07-15) · 10-agent research fan-out
> **For:** Build-model handoff (execute phases in order; obey every HARD rule)
> **Goal (locked by Waseem):** BOOK MORE CALLS. Premium motion serves conversion, never replaces it.
> **Repo:** `GITHUB\waseemnasir-react` — Next.js 14, React 18, Tailwind 3, framer-motion 11 + lenis 1.1 ALREADY installed. Deploys to Vercel. ⚠ HARD GOTCHA: www alias is PINNED → run `vercel alias set` after EVERY `--prod` deploy.

---

## 1. Executive summary

Rebuild waseemnasir.com as a **conversion-first founder site with award-tier motion polish** — not a design-flex clone. The reference (sstiem.com) is bot-walled with zero archive/index footprint, so the motion direction is derived from the 2025-26 award-tier consensus stack instead (Lenis + scroll reveals + one sticky-pin moment + text stagger). Research verdict across 10 agents: the current site's booking path is already strong (1-click, 9/10); the real gaps are **zero testimonials, zero quantified outcomes, unverified SEO/meta, and no face-forward hero** — fix those, then layer motion.

**The unclaimed differentiator (competitive scan, 10 live AI-founder sites):** nobody in the niche combines (a) face-forward founder video hero, (b) named case studies with real outcomes, (c) a real booking funnel. Audience-builders (Ottley, Herk) have no booking; service-sellers (AutomateScale, Flowmondo) have no face. Waseem can own the intersection.

---

## 2. Current site audit (agent-verified 2026-07-15)

| Area         | Score      | Note                                                                                                                   |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| Structure    | 7/10       | 7 sections, logical, but narrative-heavy vs proof                                                                      |
| Hero/CTA     | 7/10       | "AI automation that pays for itself" + "Book a free audit" — good, hierarchy unverified visually                       |
| Proof        | 5/10       | 4 named case studies (KODIASIMMO, Takycorp, Christelle, Lahore dental) but ZERO testimonials, ZERO quantified outcomes |
| SEO/meta     | unverified | Head section not inspectable via fetch — MUST audit in browser/Lighthouse pre-build                                    |
| Booking path | 9/10       | 1 click → skynetjoe.com/discovery-call, repeated 4×                                                                    |
| Copy voice   | 8/10       | Solo-operator, candid, "Built by the person who answers your call" — KEEP this voice                                   |

**MUST-fix list:** ① client testimonials ② quantified outcomes per case study (client-approved real numbers ONLY — house rule: no invented metrics) ③ verify/add meta + OG + JSON-LD ④ hero CTA visual primacy ⑤ link out to verifiable proof (Fiverr profile, GitHub, live client sites).

---

## 3. Positioning & messaging

**Angle (recommended):** outcome-first + delivered-niche hybrid. NOT "AI agency." Lead with the operational outcome for buyer types Waseem has actually shipped for (service businesses, clinics, logistics ops, e-com).

**Site role split:** waseemnasir.com = founder trust layer + booking funnel entry; skynetjoe.com = agency/service depth. One brand system, two lenses. Keep the single CTA destination (`skynetjoe.com/discovery-call`) — do not fragment.

**Hero headline candidates** (operator voice, zero invented stats — Waseem picks/edits):

1. "Ops systems that catch the leads your team is missing."
2. "I don't sell 'AI.' I build the ops backbone that stops things falling through the cracks."
3. "Less manual follow-up. More closed deals. Built around how your business actually runs."
4. "From messy spreadsheets to a system that runs itself."
5. Keep current "AI automation that pays for itself" (already outcome-first — viable to retain + strengthen subhead)

**Proof narrative per case study:** 2-4 sentence summary → client context (industry/size) → problem (mirror prospect's pain) → what was built (n8n/GHL/WP specifics) → outcome. Outcome = qualitative UNLESS a client-approved verified figure exists. HARD: never fabricate, never round up ([no-fake-claims], [no-invented-metrics]).

**AI-buyer trust rule (highest-confidence finding):** 2026 buyers fear vaporware. Show WORKING systems — live demo links, screen recordings, dashboards — over claims. Waseem has real ones (Takycorp ops dashboard, skynetjoe tools engine, creator portal). Use them.

---

## 4. Site architecture (section spec, in order)

1. **HERO** — headline + subhead + primary CTA "Book a free audit" (visually dominant, above fold, zero animation delay on LCP element) + secondary "See the work ↓". Face-forward founder presence: professional photo from `WASEEM IMAGES\PROFESSIONAL` (PORTRAIT/WORK category) or short muted autoplay loop ≤2MB. Trust strip under CTA: "Top Rated on Fiverr · 180+ workflows · since 2019" (verify each figure before ship).
2. **PROOF STRIP** — client/logo marquee OR stat counters (real numbers only). Cheap motion, high credibility.
3. **PROBLEM → SOLUTION** — current "where it leaks" copy, tightened. Scroll-reveal stagger.
4. **CASE STUDIES (the sticky-pin moment)** — ONE pinned scrollytelling section: 4 case studies swap as user scrolls. All text present in DOM (SEO hard rule #4). Each card: context → build → outcome + screenshot/demo link + "Want one like this?" CTA.
5. **TESTIMONIALS** — new. 2-4 client quotes (Waseem must collect — see §11). Named > anonymous > none.
6. **PROCESS** — 3-5 numbered steps ("what happens after you book"). Converges across all top converters. Reduces call anxiety.
7. **FOUNDER/STORY** — condensed current narrative ("Built from cafes, rooftops & rice fields") — trust texture, NOT the lead.
8. **FAQ** — 5-7 real questions (pricing anchor, timeline ~14 days, tools, "do I need to understand AI?"). Question-shaped H3s + FAQPage schema (visible text = markup text).
9. **FINAL CTA** — full-width booking block, personal line + Loom-style 60-90s intro video near CTA (research: strongest trust lever for founder brands).
10. **Sticky CTA bar** — appears after hero scroll-out, always reachable, mobile included.

Blog stays; add `/work/<case-slug>` detail pages later (phase 3) for shareability + indexing.

---

## 5. Motion system spec

**Stack decision:** KEEP existing deps — `framer-motion` (micro-interactions, reveals via `whileInView`, `useScroll`/`useTransform` for the pin section) + `lenis` (gentle smooth scroll). Do NOT add GSAP unless the pin section proves infeasible in FM — one library fewer, deps already shipped. Use `LazyMotion` + `m` components (~4.6-15kB) — no full-bundle import.

**USE (8):** scroll-triggered fade/rise reveals · number counters · logo marquee · text stagger on H1 + section titles · Lenis smooth scroll (gentle inertia) · route/section fades <300ms · ONE sticky-pin section (case studies only) · magnetic/hover CTA (desktop only).

**AVOID (5) — hard:** full scroll-jacking · custom cursor · horizontal-scroll sections on mobile · full-viewport WebGL/shader hero · >3 stacked parallax layers.

**Per-rule:**

- Animate ONLY `transform`/`opacity`/`filter`. Never layout properties.
- Content visible-by-default in DOM; animation is enhancement FROM visible state (or gated: hidden initial state only when JS confirmed + reduced-motion respected).
- LCP element (hero H1 + CTA): renders at full opacity/final position on first paint. No entrance delay.
- `prefers-reduced-motion`: single `useReducedMotion` gate at app root via context → reduced users get end-state instantly; Lenis init `smoothWheel: !reducedMotion`.
- Reserve layout space for animated elements (no CLS).

---

## 6. SEO/AEO hard rules (build must obey — checklist)

1. All rankable text in initial rendered DOM (SSR/SSG — Next 14 does this; don't client-gate copy).
2. No content injected only on scroll/click. Pin section: all 4 case-study texts in DOM.
3. No canvas/WebGL text without DOM equivalent.
4. Animation JS budget ≤ ~110KB; code-split below-fold motion.
5. CWV targets: LCP <2.5s · INP <200ms · CLS <0.1 (p75). Lighthouse gate pre-ship.
6. JSON-LD: **Person** (Waseem, stable @id, sameAs → LinkedIn/GitHub/Fiverr) + **Organization** (SkynetLabs, founder link) + **Service** + **FAQPage** (only matching visible text) + **BreadcrumbList** + **BlogPosting** on posts. Frame as infrastructure, not citation guarantee (2026 Ahrefs: schema alone ≠ citation lift).
7. AEO extraction style: short declarative sentences, question-shaped H2/H3s, one-answer-per-block.
8. llms.txt: publish (5 min, harmless) but zero build-time priority.
9. Verify with Google URL Inspection rendered-HTML before ship.
10. Meta/OG/Twitter/canonical on every route — currently UNVERIFIED on live site, audit first.

---

## 7. Mobile + accessibility rules

- Sticky-pin → mobile fallback: unpinned stacked cards (IntersectionObserver reveals). GSAP-style `pin:true` breaks with iOS URL-bar viewport shifts — avoid pattern entirely on <768px.
- Hover/magnetic effects: desktop-only; tap states on touch.
- Use `dvh` not `vh` for full-height sections (iOS URL bar).
- Marquee/looping animations: pause off-screen (`visibilitychange` + IntersectionObserver); cap 30fps if canvas.
- WCAG 2.1 AA is the legal-de-facto bar; 2.3.3 (AAA) satisfied free via reduced-motion gate.
- Test matrix pre-ship: iPhone Safari + Android Chrome + 375px viewport + reduced-motion ON.

---

## 8. Booking funnel architecture

- **Keep:** single destination `skynetjoe.com/discovery-call` (GHL calendar — already licensed; avoids Calendly's 464KB iframe payload + keeps bookings in CRM).
- **Add qualifying micro-form** before calendar (2-3 fields: business type, main bottleneck, rough budget band) — filters junk calls; capacity is scarce (solo founder).
- **Reminders:** GHL 3-touch — confirm → 48h → 2-4h day-of, SMS where possible, "Reply C to confirm."
- **Timezone:** auto-detect, show visitor-local times (Bali founder ↔ US/EU buyers).
- **Tracking:** GA4 `generate_lead`/`appointment_booked` via GTM postMessage listener + Meta `Schedule` event + CAPI with shared event ID. ⚠ GA4/Pixel IDs = existing open gate in [traffic-growth-plan-2026-07] — same blocker, same fix.
- **Later (dogfood):** Vapi voice callback within 60s of form submit — sells itself as a demo of the service. Phase 4, not launch.

## 9. Conversion rules (locked into design)

- CTA at hero + after proof + end + sticky bar. Same label everywhere ("Book a free audit").
- Proof leads with 1-2 named specific case studies, not a logo wall.
- Pricing: show floor anchor in FAQ ("projects from $X — exact scope on the call") — Waseem sets X.
- Loom-style personal video near final CTA.
- Page length proportional to ticket size — current single-pager depth is right.
- Animation is subordinate to CTA access — any motion that delays CTA visibility gets cut.

---

## 10. Build phases (handoff execution order)

**Phase 0 — Audit ground truth (½ day):** Lighthouse + view-source on live site (meta/OG/schema state) · confirm Next config (pages vs app router) · baseline CWV numbers → record in repo `docs/BASELINE.md`.
**Phase 1 — Content & proof (blocks everything; Waseem-dependent):** collect testimonials + client-approved outcome figures + pick hero headline + record 60-90s Loom + pick hero photo (PORTRAIT/WORK, `_pick-next.py`).
**Phase 2 — Structure & copy (1-2 days):** new section architecture §4, copy pass in existing voice, schema JSON-LD, meta/OG, qualifying form + tracking wiring.
**Phase 3 — Motion layer (1-2 days):** LazyMotion setup, reduced-motion root gate, reveals/stagger/counters/marquee, sticky-pin case studies (desktop) + stacked fallback (mobile), Lenis tune.
**Phase 4 — QA & ship:** `/qa` responsive sweep · Lighthouse ≥90 perf · reduced-motion pass · `/critic-loop` (independent jury — conversion + web + perf) · deploy via `/deploy` → **`vercel alias set` for www (PINNED gotcha)** · Google URL Inspection · GSC re-crawl.

**Ship gates (all HARD):** critic-loop PASS · CWV green · zero invented metrics in copy · reduced-motion verified · www alias set.

---

## 11. Waseem input needed (blockers, ranked)

1. **Testimonials** — ask Takycorp (Nkento — closure msg already sent, natural moment), Christelle, KODIASIMMO/ideaviaggi, dental client. 2-3 sentences each + permission to name.
2. **Outcome numbers** — per case study, client-approved real figures (hours saved, response time, leads caught). If none → qualitative only.
3. **Hero headline pick** (§3, 1-5) + pricing floor for FAQ anchor.
4. **60-90s Loom intro video** + hero photo/loop approval.
5. **GA4 + Pixel IDs** (same gate as traffic-growth plan).
6. **sstiem.com** — bot-walled to all tooling; if the exact animation feel matters, screen-record a scroll-through and drop it in the repo → motion spec gets refined against it. Otherwise §5 stands on award-tier consensus.

## 12. Research provenance

10-agent fan-out 2026-07-15 (Fable 5): sstiem teardown (null — no footprint) · live-site audit · 10-site competitive scan (AutomateScale, Flowmondo, Goodspeed, Ottley, Herk, +5) · award-tier motion pattern library · conversion playbook (vendor-sourced, directional) · React motion stack memo · SEO/AEO hard rules (Ahrefs 2026 schema study) · positioning research · mobile/a11y matrix · booking funnel mechanics. Key caveat: most conversion stats = vendor blogs, directional not proven; all real-number claims in copy must be client-verified.
