import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MotionProvider from "@/components/MotionProvider";

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

const SITE = "https://waseemnasir.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Waseem Nasir — AI automation that runs your business",
  description:
    "I'm Waseem Nasir, founder of SkynetLabs. I build n8n automations, AI agents, and Shopify systems that ship to production and stay shipped — live for Takycorp, idea-viaggi, Christelle, and a Lahore dental practice. Book a 30-minute call.",
  keywords: [
    "Waseem Nasir",
    "SkynetLabs",
    "AI automation",
    "n8n",
    "AI agents",
    "workflow automation",
    "Shopify",
    "WhatsApp bots",
    "founder",
  ],
  openGraph: {
    title: "Waseem Nasir — AI automation that runs your business",
    description:
      "Founder of SkynetLabs. n8n automations, AI agents, and Shopify systems that ship to production and stay shipped. Book a 30-minute call.",
    url: SITE,
    siteName: "Waseem Nasir",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waseem Nasir — AI automation that runs your business",
    description:
      "n8n, AI agents & Shopify systems that run in production. Book a 30-minute call.",
  },
  alternates: { canonical: SITE },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Waseem Nasir",
  jobTitle: "Founder & Automation Engineer",
  url: SITE,
  email: "mailto:waseem@skynetjoe.com",
  sameAs: ["https://github.com/waseemnasir2k26", "https://skynetjoe.com"],
  knowsAbout: [
    "AI automation",
    "n8n",
    "Next.js",
    "Answer Engine Optimization",
    "Workflow design",
  ],
  worksFor: {
    "@type": "Organization",
    name: "SkynetLabs",
    url: "https://skynetjoe.com",
  },
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
      </body>
    </html>
  );
}
