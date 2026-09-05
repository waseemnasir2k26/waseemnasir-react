# Content plan — 12 deep pages in 90 days

Source: SEO/AEO deep research 2026-09-05 (`REPORTS/seo-waseemnasir.md` §3) + primary-source
refuter (`REPORTS/seo-refuter-primary.md`). Scaffolded 2026-09-06 by the technical/entity
build. **No essay in this list has been written yet** — this file is the brief, not the content.

## Doctrine (applies to every page below)

- Out-proof, don't out-publish. "More pages = more traffic" is falsified by Google's own
  helpful-content self-assessment and the scaled-content-abuse policy. Twelve deep pages,
  never a hundred thin ones. Never batch-publish three in one day.
- Minimum bar per page: ≥1,200 words · one extractable 40–60-word definition block near the
  top · ≥1 dated screenshot or real number from a system that actually ran · `BlogPosting`
  schema with `author.@id` → `https://www.waseemnasir.com/#person` · ≥3 internal links (two
  money pages + one sibling) · one outbound to a skynetjoe case study where one exists.
- Truth gates: only the four published proof numbers (180+ workflows · 40+ sites · 9 countries
  · since 2019). No client name without written consent. No invented metric, no "% increase"
  without a documented source. Never promise or imply a Google Knowledge Panel.
- Cadence: ~1/week, 3–4 h of Waseem time. If capacity is 2 h/week, ship the **six starred**
  rows only (#1, #2, #4, #5, #7, #11) — they carry the entity plus both funnels.

## The 12

| #    | Wk  | URL                                                     | Target query (natural phrasing)                                                   | Intent                        | Angle                                                                                                                             | Proof to include                                                      | Internal links                                                       |
| ---- | --- | ------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1 ★  | 1   | `/about` (ProfilePage)                                  | "Waseem Nasir SkynetLabs", "who is Waseem Nasir automation"                       | navigational / entity         | Plain-language bio: name, role, company, location, what he builds, for whom, since when; timeline; photo                          | Live GitHub repo count, YouTube channel, 3 shipped systems with dates | `/`, `/mentorship`, `/book`, `/blog`                                 |
| 2 ★  | 3   | `/blog/claude-code-video-editing-pipeline`              | "claude code video editing", "automate video editing with ffmpeg and claude code" | informational                 | Expand the 493-word "10 vlogs in one night" post into the full pipeline: skills, NVENC flags, the polite-render rule, what failed | Command snippets, render timings, before/after                        | existing post (expand in place), `/mentorship`, skynetjoe case study |
| 3    | 4   | `/blog/n8n-vs-make-for-an-agency`                       | "n8n vs make for agencies"                                                        | commercial-investigational    | Cost model from a real retainer: self-hosted n8n on a VPS vs Make ops pricing at real volumes; when Make still wins               | Monthly VPS bill, execution counts, one migration story               | `/inbox-ops`, `/book`, #7                                            |
| 4 ★  | 5   | `/blog/how-to-write-a-claude-code-skill`                | "how to write claude code skills", "claude code skills tutorial"                  | informational                 | Anatomy of one real skill (SKILL.md frontmatter, triggers, gotchas), then a 20-minute build-along                                 | Real SKILL.md excerpt, screen recording from @vibecodewithwaseemnasir | `/mentorship` (primary CTA), #2, #8                                  |
| 5 ★  | 6   | `/blog/ai-email-triage-n8n-what-broke`                  | "ai email triage n8n", "n8n gmail classifier small business"                      | informational → commercial    | The Inbox Ops design and the honest failure: classifier collapse, catch-all at 49%, how the drift review caught it                | Anonymised label-distribution chart, 30-day counts                    | `/inbox-ops` (primary), `/book`, #3                                  |
| 6    | 7   | `/blog/running-an-ai-automation-agency-from-bali-costs` | "run an agency from bali", "digital nomad automation agency"                      | informational / inspirational | Sequel to the day-in-the-life: the numbers — timezone overlap, tooling cost, what clients never ask, the 25%-CPU rule             | Monthly cost table, timezone chart                                    | existing Bali post, `/about`, `/book`                                |
| 7 ★  | 8   | `/blog/what-an-n8n-automation-costs`                    | "how much does an n8n automation cost", "n8n consultant pricing"                  | commercial                    | Price ladder using only figures already published, and what moves the number                                                      | Scope-to-price table, 3 anonymised builds                             | `/inbox-ops`, `/book`, skynetjoe pricing                             |
| 8    | 9   | `/blog/claude-code-vs-cursor-for-non-developers`        | "claude code vs cursor 2026", "claude code vs cursor for beginners"               | commercial-investigational    | The mentorship lens: which one a non-CS founder should learn first, same task built in both                                       | Two screen recordings, time-to-ship                                   | `/mentorship`, #4                                                    |
| 9    | 10  | `/blog/whatsapp-ai-agent-n8n-real-client`               | "whatsapp ai agent n8n"                                                           | informational / commercial    | Architecture of a real WhatsApp agent + guardrails (human hand-off, breaker caps)                                                 | Flow diagram, synthetic message samples, latency                      | `/book`, #5, skynetjoe case study                                    |
| 10   | 11  | `/blog/answer-engine-optimization-for-founders`         | "aeo for small business", "answer engine optimization founder site"               | informational                 | What was actually done on two sites, what moved, what did not (including the honest llms.txt result)                              | 08-31 before/after scores, citation-monitor output                    | `/about`, skynetjoe AEO guide                                        |
| 11 ★ | 11  | `/speaking`                                             | "AI automation workshop Bali", "AI automation speaker Southeast Asia"             | commercial (long-tail)        | 3 talk titles with abstracts, past sessions (only real ones), a 90-second reel, booking → `/book`                                 | Event photos (EVENT-\* image library), dates                          | `/about`, `/book`                                                    |
| 12   | 12  | `/blog/gohighlevel-vs-n8n-for-service-businesses`       | "gohighlevel vs n8n"                                                              | commercial-investigational    | When to keep GHL, when n8n replaces it, from a real rebuild                                                                       | Migration diagram, hours saved                                        | `/book`, #3, skynetjoe GHL case study                                |

★ = the six-page cut if Waseem only has 2 h/week.

## Consent + ruling gates before drafting

- #5, #9, #12 must not name a client (insurance retainer, clinic lane, Takycorp) without
  written consent. Sector + system only, otherwise.
- #11 `/speaking` may list only sessions that actually happened.
- #2 and #10 quote real numbers from this estate — re-measure before publishing, do not
  copy figures out of an old report.

## Status 2026-09-06

- #1 `/about` — **scaffold SHIPPED** by the technical build (ProfilePage → Person, bio from
  `content/brand-messaging.md`, timeline, profile list). Still owes Waseem a voice pass and
  the three dated shipped-system examples.
- #2–#12 — not started. Content lane, separate session.
