# AI-CITY — Persistent State File

Project: "AI City" dual-site scroll-city build — waseemnasir.com (Site A) + skynetjoe.com (Site B).
Base: the shipped `/v/skyline` variant (waseemnasir-react). Fiber FORBIDDEN — plain three imperative only.
Last updated: 2026-08-20.

## Wave status

| Wave   | Scope                                                                                                                       | Status                                                                                    |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Wave 0 | Safety: both repos tagged `pre-ai-city-20260820`; `/v/skyline` FROZEN (no edits, it is the reference implementation)        | ✅ DONE 2026-08-20                                                                        |
| Wave 1 | Concept ideation (6 concepts) → judged ranking → blueprint synthesis                                                        | ✅ DELIVERED 2026-08-20 — **AWAITING WASEEM APPROVAL** (see `AI-CITY-WAVE1-BLUEPRINT.md`) |
| Wave 2 | Build MERIDIAN → `/v/ai-city` on Site A, port to Site B. Critic-loop jury gate.                                             | ⏳ PENDING approval                                                                       |
| Wave 3 | Build ALTITUDE ZERO → `/v/ai-city-2` + SIGNALGRID → `/v/ai-city-3`, both sites. Critic-loop jury gate.                      | ⏳ PENDING                                                                                |
| Wave 4 | Cross-device QA (Iris Xe floor, 60% brightness TN panel), Lighthouse ≥90 all routes, final Waseem pick + promotion decision | ⏳ PENDING                                                                                |

## Judged ranking (Wave 1)

MERIDIAN **86** · ALTITUDE ZERO **76** · ~~NERVE CITY 69~~ (KILLED 08-20: biology off-category, Waseem: ONE niche only) · SIGNALGRID **68** (promoted to slot 3) · SIGNAL CITY 67 · GROUNDBREAK 62.
Top 3 become `/v/ai-city`, `/v/ai-city-2`, `/v/ai-city-3` on BOTH sites (noindex, robots-disallowed `/v/`, canonical → main domain — same as skyline).

## Decisions log

- 2026-08-20 — Wave 0 executed: tags `pre-ai-city-20260820` on both repos; skyline frozen as base.
- 2026-08-20 — Wave 1 blueprint written. All copy/claims LOCKED to `components/site.ts` canon (180+/40+/9/2019, 2019 roll:false). Building heights stay decorative-never-data. Dental card keeps "a demo build, not a paid client" verbatim. FreightOps links `/lp/logistics` only.
- OPEN — Waseem approve/kill: each concept's [ADDITION] items + go/no-go per concept (see blueprint §Decisions).

## Blockers

- ⛔ Wave 2 cannot start until Waseem approves the blueprint (concept go/no-go + ADDITION approve/kill list).
- ⚠️ MERIDIAN dusk palette (`duskA/B/C`) is new token territory — needs Waseem's eye at 3 scroll positions before polish (anti-AI-slop-sunset gate).
- ⚠️ Site B port requires palette translation ruling (cream-editorial night = warm deep ink, terracotta windows) — confirm before Wave 2 Site B work.

## Resume instructions

1. Read this file + `AI-CITY-WAVE1-BLUEPRINT.md` (same dir).
2. Recon reference: `/v/skyline` = `app/v/skyline/` + `components/skyline/` in waseemnasir-react — READ, never edit. Architecture rules (no fiber, DPR 1.5 cap, static-SSR-default, dispose discipline, `overflowX: clip`) inherit verbatim.
3. If approval received: start Wave 2 = MERIDIAN at `app/v/ai-city/` (copy skyline as scaffold, apply blueprint). Critic-loop before any deploy. Manual Hostinger ZIP for skynetjoe (NEVER /deploy skill).
4. If not: ping Waseem with the top-5 decision list from the blueprint exec summary.
5. Update this file's wave table + decisions log at every milestone.
