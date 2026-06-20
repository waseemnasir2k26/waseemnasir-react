import type { MetadataRoute } from "next";

const SITE = "https://www.waseemnasir.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date("2026-06-20"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
