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

const SITE = "https://www.waseemnasir.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Waseem Nasir — AI automation that runs your business",
  description:
    "I'm Waseem Nasir, founder of SkynetLabs. I find where your business leaks time and money, then build AI automation that plugs it. Book a free audit.",
  keywords: [
    "Waseem Nasir",
    "SkynetLabs",
    "AI automation",
    "AI automation agency",
    "business automation",
    "n8n automation",
    "AI agents",
    "Shopify automation",
    "founder",
  ],
  openGraph: {
    title: "Waseem Nasir — AI automation that runs your business",
    description:
      "I find where your business leaks time and money, then build AI automation that plugs it. Live for Takycorp, idea-viaggi & more. Book a free audit.",
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
    title: "Waseem Nasir — AI automation that runs your business",
    description:
      "I find where your business leaks time and money, then build AI automation that plugs it. Book a free audit.",
    images: ["/og.jpg"],
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
  sameAs: [
    "https://www.linkedin.com/in/waseemnasir2k26",
    "https://x.com/skynetlabs",
    "https://youtube.com/@skynetlabs",
    "https://github.com/waseemnasir2k26",
    "https://skynetjoe.com",
  ],
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
