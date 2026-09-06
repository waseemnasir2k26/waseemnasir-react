import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MotionProvider from "@/components/MotionProvider";
import SxoBeacon from "@/components/SxoBeacon";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = "https://www.waseemnasir.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title:
    "Waseem Nasir — AI automation founder · n8n + Claude Code · Bali",
  description:
    "Waseem Nasir is the founder of SkynetLabs, an AI automation studio. He builds n8n and Claude Code systems for service businesses, from Bali. Book a free audit.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Waseem Nasir — AI automation that runs your business",
    description:
      "I find where your business leaks time and money, then build AI automation that plugs it. Live for an insurance retainer client, idea-viaggi & more. Book a free audit.",
    url: SITE,
    siteName: "Waseem Nasir",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Waseem Nasir — AI automation that pays for itself",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Skynetjoe1",
    creator: "@Skynetjoe1",
    title: "Waseem Nasir — AI automation that runs your business",
    description:
      "I find where your business leaks time and money, then build AI automation that plugs it. Book a free audit.",
    images: ["/og.jpg"],
  },
  alternates: { canonical: SITE },
};

const HEADSHOT = "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: "Waseem Nasir",
  givenName: "Waseem",
  familyName: "Nasir",
  jobTitle: "Founder & Automation Engineer",
  description:
    "AI automation founder — builds n8n and Claude Code systems for service businesses, from Bali.",
  url: SITE,
  mainEntityOfPage: { "@id": `${SITE}/about#profilepage` },
  image: {
    "@type": "ImageObject",
    url: `${SITE}${HEADSHOT}`,
    width: 956,
    height: 1700,
    caption: "Waseem Nasir, founder of SkynetLabs",
  },
  email: "mailto:waseem@skynetjoe.com",
  // sameAs must match the visible footer links exactly — entity consolidation.
  // One string per platform; YouTube in the www + lowercase-handle form.
  // Company channels (@Skynetlabs2k25) belong to the Organization node on
  // skynetjoe.com, never to this Person.
  // RULED 2026-09-06 (Waseem, R11 option A): the canonical X handle is
  // @Skynetjoe1 everywhere. GitHub profile twitter_username was repointed
  // from "waseemnasir" to "Skynetjoe1" the same day; skynetjoe.com's
  // SITE.social.twitter moved off x.com/skynetlabs to match.
  // TODO(waseem-ruling): company YouTube channel — @Skynetlabs2k25 vs
  // @skynetlabs. Not listed here either way (Organization, not Person).
  sameAs: [
    "https://www.linkedin.com/in/waseemnasir2k26",
    "https://github.com/waseemnasir2k26",
    "https://www.youtube.com/@vibecodewithwaseemnasir",
    "https://x.com/Skynetjoe1",
    "https://www.facebook.com/Waseemskynetjoe",
    "https://www.instagram.com/waseemnasir2k27",
    "https://skynetjoe.com",
  ],
  knowsAbout: [
    "AI automation",
    "n8n",
    "Claude Code",
    "GoHighLevel",
    "WhatsApp automation",
    "Video pipelines",
    "Next.js",
    "Answer Engine Optimization",
    "Workflow design",
  ],
  knowsLanguage: [
    { "@type": "Language", name: "English", alternateName: "en" },
    { "@type": "Language", name: "Urdu", alternateName: "ur" },
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "COMSATS University Islamabad",
    url: "https://www.comsats.edu.pk/",
  },
  homeLocation: {
    "@type": "Place",
    name: "Bali, Indonesia",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
  },
  worksFor: {
    "@type": "Organization",
    // @id matches the Organization node served on skynetjoe.com (verified
    // 2026-09-06: skynetjoe.com/#organization is present in its JSON-LD).
    "@id": "https://skynetjoe.com/#organization",
    name: "SkynetLabs",
    url: "https://skynetjoe.com",
  },
};

// WebSite entity — names the site for Knowledge Graph / sitelinks and ties it
// to the Person via publisher. No SearchAction: the site has no search UI.
const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "Waseem Nasir",
  alternateName: "Waseem Nasir — SkynetLabs founder",
  url: SITE,
  inLanguage: "en",
  publisher: { "@id": `${SITE}/#person` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}
    >
      <body className="grain font-sans antialiased">
        {/* Skip to content — first focusable element */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <div className="aurora" aria-hidden />
        <SmoothScroll />

        <MotionProvider>
          {/* ScrollProgress mounts inside MotionProvider so it inherits reducedMotion */}
          <ScrollProgress />
          {children}
        </MotionProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <SxoBeacon />
      </body>
    </html>
  );
}
