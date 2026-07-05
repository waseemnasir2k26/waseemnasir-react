/* ============================================================
   BLOG · post registry (pure data)
   Single source of truth for the index list, sitemap entries,
   and cross-links. Prose bodies live in each post's page.tsx.
   ============================================================ */

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO date — drives <time> + sitemap lastModified + JSON-LD */
  date: string;
  /** Human-readable date for the card + byline */
  dateLabel: string;
  readingTime: string;
  tag: string;
  kind: "STORY" | "LATEST NEWS";
  excerpt: string;
  /** <meta name="description"> + OG description */
  description: string;
  /** relative path under /public */
  ogImage: string;
  ogAlt: string;
};

export const POSTS: PostMeta[] = [
  {
    slug: "a-real-day-running-an-automation-agency-from-bali",
    title:
      "What a real day of running an automation agency from Bali actually looks like",
    date: "2026-06-28",
    dateLabel: "June 28, 2026",
    readingTime: "7 min read",
    tag: "Founder story",
    kind: "STORY",
    excerpt:
      "Pre-dawn cafe, an Italian travel plugin stuck behind a hosting firewall, agents building while I film, and a rule I don't break: no eight-hour days. An honest walk through one working day — and how an accounting-firm job led here.",
    description:
      "An honest, first-person account of one working day running an AI automation agency from Bali — a client fire, the quiet build, the real cost, and the accounting-firm background that led to it.",
    ogImage:
      "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    ogAlt:
      "Waseem Nasir typing on a backlit laptop keyboard at a night cafe in Bali",
  },
  {
    slug: "edited-10-travel-vlogs-in-one-night-with-claude-code",
    title: "We edited 10 travel vlogs in one night with Claude Code",
    date: "2026-07-04",
    dateLabel: "July 4, 2026",
    readingTime: "3 min read",
    tag: "Latest news",
    kind: "LATEST NEWS",
    excerpt:
      "Ten Ubud vlogs and their teasers, cut, captioned, and rendered in a single night — driven from the terminal with Claude Code and an ffmpeg NVENC pipeline. Here's exactly how the system works, in three steps.",
    description:
      "Ten Ubud travel vlogs plus teasers, edited and rendered in one night using Claude Code and an ffmpeg NVENC pipeline. A concrete look at how the video-editing system works in three steps.",
    ogImage:
      "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    ogAlt:
      "Waseem Nasir at a dual-laptop setup running an editing and analytics pipeline over coffee",
  },
];

export function getPost(slug: string): PostMeta | undefined {
  return POSTS.find((p) => p.slug === slug);
}
