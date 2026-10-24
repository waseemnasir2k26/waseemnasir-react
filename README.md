# waseemnasir.com

Founder site for Waseem Nasir (SkynetLabs): Next.js 14 App Router, React 18, TypeScript, Tailwind 3, Framer Motion, Lenis. One codebase that serves the production site plus 17 full design variants on their own routes (`/v/<name>`), so a direction can be compared before it replaces the live one.

| Route | Purpose |
|---|---|
| `/` | Production homepage |
| `/variants` | Index of design variants |
| `/v/<name>` | One variant |
| `/brand` | Brand tokens |
| `/blog` | Writing |
| `/mentorship` | Mentorship page |

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Sitemap and robots are generated in `app/sitemap.ts` and `app/robots.ts`. Python image-curation helpers live in `scripts/`.

Live: https://www.waseemnasir.com

MIT.
