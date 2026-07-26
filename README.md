# waseemnasir.com — founder personal site

Next.js 14 personal site for **Waseem Nasir**, founder of [SkynetLabs](https://www.skynetjoe.com) — an AI automation studio building voice AI agents, AI video pipelines, and n8n systems.

**Live:** [www.waseemnasir.com](https://www.waseemnasir.com)

---

## What this is

A single Next.js App Router codebase that ships the production site **plus 17 fully-built design variants** of the same content, each on its own route. The variants exist so a design direction can be compared side by side in the browser instead of in mockups — the same approach used on client pitches.

## Stack

|           |                                                 |
| --------- | ----------------------------------------------- |
| Framework | Next.js 14 (App Router) · React 18 · TypeScript |
| Styling   | Tailwind CSS 3                                  |
| Motion    | Framer Motion 11 · Lenis (smooth scroll)        |
| Deploy    | Vercel                                          |

## Routes

| Route         | Purpose                               |
| ------------- | ------------------------------------- |
| `/`           | Production homepage                   |
| `/variants`   | Index of every design variant         |
| `/v/<name>`   | An individual variant                 |
| `/brand`      | Brand tokens — color, type, messaging |
| `/blog`       | Writing                               |
| `/mentorship` | Mentorship page                       |

SEO handled in-app via `app/sitemap.ts` and `app/robots.ts`.

## Design variants

`aurora-luxe` · `bento-glass` · `blueprint` · `bordeaux-glass` · `brutalist` · `cinema-horizontal` · `dark-luxe` · `editorial-emerald` · `editorial-warm` · `gallery-exhibition` · `gradient-glass` · `ink-atelier` · `light-editorial` · `obsidian-aurum` · `warm-cinematic` · `warm-glass-dusk` · `web4-warm`

## Structure

```
app/          routes — production page, /v/<variant>, brand, blog, mentorship, sitemap, robots
components/   Hero, Work, Process, Solve, About, FinalCTA, Nav, Footer + motion primitives
content/      brand messaging, color/type tokens, image map (markdown)
scripts/      Python image-curation helpers
public/       static assets
```

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## License

MIT — see [LICENSE](LICENSE).
