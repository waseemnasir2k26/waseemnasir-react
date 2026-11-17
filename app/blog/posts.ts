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
      "An honest account of one working day running an AI automation agency from Bali — a client fire, the quiet build, and the real cost.",
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
      "Ten Ubud travel vlogs plus teasers, edited and rendered in one night with Claude Code and an ffmpeg NVENC pipeline, in three steps.",
    ogImage:
      "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    ogAlt:
      "Waseem Nasir at a dual-laptop setup running an editing and analytics pipeline over coffee",
  },
  {
    slug: "what-i-automate-first-in-a-small-business",
    title:
      "What I automate first in a small business (and why it's the boring stuff)",
    date: "2026-11-05",
    dateLabel: "November 5, 2026",
    readingTime: "5 min read",
    tag: "Founder story",
    kind: "STORY",
    excerpt:
      "New business owners ask for something clever. I start with leaks, then repeats, then reports, and I start with one small automation, not ten. Here is the order I use and where it comes from.",
    description:
      "Why I start small-business automation with missed inquiries, repeated tasks and only then reports, and why I begin with one small automation instead of ten.",
    ogImage:
      "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    ogAlt:
      "Waseem Nasir typing on a laptop at a terrace cafe in Bali with a latte beside him",
  },
  {
    slug: "why-i-never-let-ai-send-a-customer-reply-without-a-human-check",
    title: "Why I never let AI send a customer reply without a human check",
    date: "2026-11-05",
    dateLabel: "November 5, 2026",
    readingTime: "5 min read",
    tag: "Founder story",
    kind: "STORY",
    excerpt:
      "The AI can draft the reply. A person approves it before it goes out. Here is the thinking behind that one rule, what I still let run on its own, and what happens when a step breaks.",
    description:
      "Why every AI-written customer message I build gets approved by a person first, what can safely stay automatic, and how to plan for failure.",
    ogImage:
      "/img/pro/CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
    ogAlt:
      "Waseem Nasir at a cafe table with a laptop and coffee, reviewing messages",
  },
  {
    slug: "why-i-build-automations-for-trades-and-small-local-businesses",
    title: "Why I build automations for trades and small local businesses",
    date: "2026-11-05",
    dateLabel: "November 5, 2026",
    readingTime: "5 min read",
    tag: "Founder story",
    kind: "STORY",
    excerpt:
      "The owner is up a ladder or under a sink when the customer reaches out. That gap is the problem I want to work on, and an honest account of where I am with it.",
    description:
      "Why I build missed-call, reminder and quote automations for roofers, plumbers, HVAC and other local trades, and how an accounting background shaped it.",
    ogImage:
      "/img/pro/CAFE-WORK-2026-03-29-closeup-laptop-sunglasses-valley-view.jpg",
    ogAlt:
      "Waseem Nasir working on a laptop with a valley view behind him in Bali",
  },
];

export function getPost(slug: string): PostMeta | undefined {
  return POSTS.find((p) => p.slug === slug);
}
