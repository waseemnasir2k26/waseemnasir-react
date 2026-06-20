import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // keep duplicate / internal design pages out of the index so they
      // don't dilute the homepage's ranking signals
      disallow: ["/v/", "/variants", "/brand"],
    },
    sitemap: "https://www.waseemnasir.com/sitemap.xml",
    host: "https://www.waseemnasir.com",
  };
}
