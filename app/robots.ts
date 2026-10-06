import type { MetadataRoute } from "next";

// /v/* and /variants are gone (308 -> /), so they no longer need a Disallow.
// /brand stays out of the index.
const DISALLOW = ["/brand"];
const ALLOW = ["/"];

// Named AI/answer-engine crawlers get an explicit allow block. The wildcard
// rule already permits them, but explicit named allows are (a) weighted by
// some operators and (b) a visible AEO signal on a site that sells AEO.
const AI_BOTS = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Claude-SearchBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google AI
  "Google-Extended",
  "GoogleOther",
  // xAI / Grok
  "GrokBot",
  "xAI-Bot",
  // Common Crawl (training-data feeder)
  "CCBot",
  // Microsoft / Bing
  "Bingbot",
  // Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Meta AI
  "Meta-ExternalAgent",
  "FacebookBot",
  // Others
  "cohere-ai",
  "MistralAI-User",
  "DuckDuckBot",
  "Bytespider",
  "Amazonbot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ALLOW, disallow: DISALLOW },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: ALLOW,
        disallow: DISALLOW,
      })),
    ],
    sitemap: "https://www.waseemnasir.com/sitemap.xml",
  };
}
