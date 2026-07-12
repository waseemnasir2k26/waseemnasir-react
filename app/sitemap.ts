import type { MetadataRoute } from "next";
import { POSTS } from "./blog/posts";

const SITE = "https://www.waseemnasir.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date("2026-06-20"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/blog`,
      lastModified: new Date("2026-07-04"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE}/mentorship`,
      lastModified: new Date("2026-07-13"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...POSTS.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
