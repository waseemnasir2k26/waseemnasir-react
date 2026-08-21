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


## Wave 2+3 log (2026-08-20 evening)
- Workflow wf_b4b7f5d4-9f2: 3 wn builds + 3 sj ports DONE, both repos build GREEN.
- Routes: wn /v/ai-city (MERIDIAN) /v/ai-city-2 (ALTITUDE) /v/ai-city-3 (SIGNALGRID) · sj /v9 /v10 /v11 (same order).
- Committed: wn 732f1df (main) · sj d967b19 (fix/truth-cleanup branch).
- INCIDENT: session-snapshot hook committed mid-task work to wip/2026-08-20 (96e812a) + checked out main, wiping tree; verify agent restored byte-for-byte. Canonical copies remain in 96e812a.
- JURY (independent, skeptical): wn 68/68/64 · sj 66(v9)/55(v10)/74(v11).
- UNIVERSAL BLOCKER found: PinnedScene inert-freeze (active computed once at mount, MotionValue never re-subscribed) → post-hero scenes/CTAs dead in 3D mode, all 6 routes.
- v10 truth-gate blocker: altimeter digits in copy → replacing with digit-free stage labels.
- FIX ROUND running: 2 parallel fixers (wn + sj), full P0+major lists, each rebuilds green.
- NEXT: commit fixes -> stage previews -> Waseem deploy word (B5). NOT DEPLOYED.

## Fix round DONE (2026-08-20 late)
- wn commit 0063982 (main): inert-freeze x3 fixed (MotionValue .on(change) -> el.inert), real packets governor, rAF hidden-tab cancel, tooltip scratch vec, dynamic() ref -> onReady bridge (Next 16.3 loadable intercepts refs — would THROW), cloud snap on degrade. Build green.
- sj commit cb3c606 (fix/truth-cleanup): inert-freeze x3, v10 altimeter digits -> word stage labels (truth canon), v9 anonymized + shared fonts + real governor, v10 header dedupe + FreightOps card detach + promo offset, v11 static 2019 + real buttons. tsc clean, build green 245 routes, standalone server 200 x3, served-HTML greps clean.
- UNVERIFIED-AT-RUNTIME: interactive scroll behavior (inert flips, governor under load) — code+build verified only; gstack pass owed at preview stage.
- ⛔ NEXT = B5 DEPLOY RULING (Waseem): wn previews via Vercel · sj via Hostinger ZIP (MCP currently DISCONNECTED — /mcp reconnect needed first). NOT DEPLOYED.

## Polish rounds + SHIPPED (2026-08-20 night)
- Runtime QA (playwright, live): inert fix verified, CTAs clickable at all scroll positions, 0 page errors.
- Visual round 1 (commit pre-1fb5124 work): dock tube + ground flood + hidden ScrollProgress; agent self-graded 2 fixes PASS wrongly — caught on independent shot review.
- Visual round 2 (1fb5124): Meridian SUNSET waypoint -> [0.9,34,30] (Catmull-Rom sampling root cause) + landmark near-fade/bright-cap; Altitude "floating panel" = static SVG fallback rendering over canvas in 3D mode -> gated !is3D. Both re-verified on screenshots by parent.
- DEPLOYED: waseemnasir-8b495oj9m aliased to www. 3 routes 200+noindex, homepage clean. wn side COMPLETE.
- Known minor (accepted): Altitude 30-90% bright bridge beam near cards (pre-existing, in-concept); proof-plaza beacon always-on glow.
- sj /v9-11: committed cb3c606 + clean deploy branch deploy/ai-city-v9-11 + ZIP staged. ⛔ BLOCKED: Hostinger MCP disconnected — /mcp reconnect, then hosting_deployJsApplication + cold boot + served greps.


## SJ DEPLOYED (2026-08-21)
- Waseem gave B5 GO ("deploy all things"). skynetjoe /v9 /v10 /v11 LIVE.
- Build `01a0241f-7284-7151-88b3-bfcdcec8aba8` (node 20, next, npm), archive deploy-ai-city-v9-11.zip, commit cb3c606 / branch deploy/ai-city-v9-11.
- Pre-flight: `git diff --stat 36d2998 deploy/ai-city-v9-11` = 22 files, 6981 insertions, ADDITIONS ONLY (divergence trap clear). ZIP = 1085 entries, 0 node_modules, 0 .next.
- GOTCHA: first deployJsApplication call died "Pre-upload request failed: socket hang up" on the 126MB archive; straight retry worked but exceeded the 120s MCP window and finished as a background task. Retry, do not re-cut the ZIP.
- Served-HTML verification: /v9 /v10 /v11 = 200 + noindex x2 each · homepage 200, 0 noindex, 217,895 bytes BEFORE and AFTER (byte-identical), title + canonical unchanged · sitemap.xml 0 hits for v9/v10/v11 · /v2-/v8 still 200.
- STILL OWED: runtime scroll/gstack pass on the sj trio (inert flips + packets governor code-verified only). Waseem B4 verdicts on all 19 preview routes. Promotion decision. Losers -> proxy.ts BLOCKED_IN_PROD.
- Board: Desktop\VARIANT-REVIEW-BOARD.html (all 19 routes, verdict buttons, copy-all).
