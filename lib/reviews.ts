/**
 * Real client reviews — verbatim from Waseem's public profiles.
 * Source: skynet-web/data/reviews-2026-11-10.json (scraped 2026-11-10).
 * Never paraphrase quotes; "…" marks a cut. No usernames are stored here.
 * Upwork is private — do not add it.
 */
export const RATINGS = {
  fiverr: {
    url: "https://www.fiverr.com/agencies/skynetjoellc",
    rating: 4.8,
    count: 320,
  },
  google: {
    url: "https://maps.google.com/?cid=7844488395285612642",
    rating: 4.7,
    count: 16,
  },
} as const;

export type Review = {
  text: string;
  stars: number;
  country: string;
  /** "Mon YYYY" */
  date: string;
};

/** Order matters: lead with the review that names Waseem. */
export const FEATURED_REVIEWS: Review[] = [
  {
    text: "Waseem did a phenomenal job and is very reliable! If he says he’ll get it done, he gets it done. Definitely ordering again!",
    stars: 5,
    country: "Netherlands",
    date: "Jan 2026",
  },
  {
    text: "Seller delivered exactly what I needed for N8N social media automation. The workflow was set up quickly and works smoothly. Clear communication throughout. Would definitely order again. Highly recommended",
    stars: 5,
    country: "Canada",
    date: "Oct 2025",
  },
  {
    text: "They created a great website for our moving company. Very professional, excellent communication, a speedy delivery, and ended up with a high quality product for a very good price. I would definitely consider using them again for future website building projects.",
    stars: 5,
    country: "United States",
    date: "Apr 2026",
  },
];
