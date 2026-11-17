# Changelog

All notable changes to this project are documented in this file.

## [2026.10] - 2026-10-12

- waseemnasir-react is the public Next.js 14 / React 18 / Tailwind founder site for Waseem Nasir (waseemnasir.com): production homepage, 17 design variants under /v/<name>, plus brand, blog, mentorship and legal routes. MIT licensed.
- Reviewed October 2026: README links (skynetjoe.com, waseemnasir.com) returned HTTP 200. Most recent commits are from 2026-09-21 to 09-24: shared WhatsApp and Book-a-call header CTAs, and security headers (CSP scoped to Calendly and self-hosted fonts) in next.config.mjs.
- Known gaps: no tests and no CI workflow; the README route table still omits routes present in app/ (/about, /book, /inbox-ops, /legal, /privacy, /terms).
- Release housekeeping only: package version 1.1.0 to 1.2.0, Status line, changelog and Work with SkynetLabs section. No app code changes in this release.

## [2026.09] - 2026-09-16

- Maintenance review of `waseemnasir-react` — the Next.js 14 founder personal site for Waseem Nasir (SkynetLabs). The README states it is live at www.waseemnasir.com.
- Stack: Next.js 14 App Router + React 18 + TypeScript, Tailwind CSS 3, Framer Motion 11 and Lenis for motion, deployed on Vercel (`vercel.json` present). MIT licensed, LICENSE file in repo.
- Status: public repo, last commit 2026-09-06. One codebase ships the production homepage plus 17 fully-built design variants under `/v/<name>` with an index at `/variants`, alongside `/brand`, `/blog`, `/mentorship` and the legal/privacy/terms routes. SEO is handled in-app by `app/sitemap.ts` and `app/robots.ts`. Planning documents (`REVAMP-PLAN.md`, `AI-CITY-STATE.md`, `AI-CITY-WAVE1-BLUEPRINT.md`) are tracked in the repo root.
- Reviewed September 2026: documentation refreshed, package version bumped to 1.1.0, released as v2026.09. No routes, components, content or deploy config changed.
- Known gaps visible in the repo: no CHANGELOG before this release, no tests and no `.github/` CI workflow, and the README's route table omits several routes that exist in `app/` (`/about`, `/book`, `/inbox-ops`, `/legal`, `/privacy`, `/terms`).
