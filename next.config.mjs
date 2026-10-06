// Deps verified 2026-09-24: only Calendly widget (assets.calendly.com script,
// calendly.com iframe) + next/font self-hosted fonts. No GTM/GA/Meta pixel scripts.
// 2026-10-07: connect-src also allows n8n.skynetjoe.com (the SxoBeacon funnel
// counter POSTs to /webhook/sxo-event on every page).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://n8n.skynetjoe.com https://calendly.com https://*.calendly.com",
  "frame-src 'self' https://calendly.com https://*.calendly.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // /contact hard-404s here — the booking page is /book, so catch typed and
  // externally-linked hits. Verified 2026-10-01.
  // /variants and /v/* were internal design pages; taken down 2026-10-07
  // (the home page now lives in components/home/BlueprintClient.tsx).
  async redirects() {
    return [
      { source: "/contact", destination: "/book", permanent: true },
      { source: "/variants", destination: "/", permanent: true },
      { source: "/v/:path*", destination: "/", permanent: true },
    ];
  },
};
export default nextConfig;
