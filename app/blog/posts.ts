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
  kind: "STORY" | "LATEST NEWS" | "LESSON" | "PLAYBOOK" | "PLAN";
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
    readingTime: "4 min read",
    tag: "Playbook",
    kind: "PLAYBOOK",
    excerpt:
      "Owners ask for something clever. I start with leaks, then repeats, then reports, one build at a time. The order I use, where it came from, and a quick leak check you can run today.",
    description:
      "Why I start small-business automation with leaking inquiries, then repeated tasks, then reports, plus a five-minute leak check you can do yourself.",
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
    readingTime: "4 min read",
    tag: "Lesson",
    kind: "LESSON",
    excerpt:
      "The AI drafts, a person sends. The reasoning behind that rule, what approval looks like day to day, what I refuse to fully automate, and four checks before you add AI replies.",
    description:
      "My reasoning for having a person approve every AI-written customer reply, what I will not fully automate, and four things to check before you add AI replies.",
    ogImage:
      "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    ogAlt:
      "Waseem Nasir at a coworking desk, focused on his phone while reviewing a message",
  },
  {
    slug: "why-trades-are-my-next-focus-and-what-id-build-first",
    title: "Why trades are my next focus, and what I'd build first",
    date: "2026-11-05",
    dateLabel: "November 5, 2026",
    readingTime: "3 min read",
    tag: "Plan",
    kind: "PLAN",
    excerpt:
      "Trades are the direction I am choosing next, not a long client list. Here is the honest plan, why I picked it, and the three first builds I would offer.",
    description:
      "An honest plan for building automations for trades and local service businesses: why I am focusing there and the three first builds I would offer.",
    ogImage:
      "/img/pro/CAFE-WORK-2026-03-29-closeup-laptop-sunglasses-valley-view.jpg",
    ogAlt:
      "Waseem Nasir working on a laptop with a valley view behind him in Bali",
  },
];

export function getPost(slug: string): PostMeta | undefined {
  return POSTS.find((p) => p.slug === slug);
}
