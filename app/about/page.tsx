import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BlogShell,
  Mono,
  Lead,
  P,
  H2,
  Strong,
  SoftCTA,
  RelatedLinks,
  C,
  CTA,
  SHADOW,
} from "../blog/_ui";

const SITE = "https://www.waseemnasir.com";
const url = `${SITE}/about`;
const HEADSHOT =
  "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg";

/* The one-liner is the canonical identity string (2026-09-05 entity audit).
   It must stay byte-identical here, in the Person JSON-LD in app/layout.tsx,
   and on every external profile. */
const ONE_LINER =
  "AI automation founder — builds n8n and Claude Code systems for service businesses, from Bali.";

export const metadata: Metadata = {
  title:
    "About Waseem Nasir — founder of SkynetLabs | AI automation, from Bali",
  description:
    "Who Waseem Nasir is: founder of SkynetLabs, an AI automation studio. He builds n8n and Claude Code systems for service businesses, from Bali. Background, what he builds, and where to find him.",
  alternates: { canonical: url },
  openGraph: {
    title: "About Waseem Nasir — founder of SkynetLabs",
    description: ONE_LINER,
    url,
    siteName: "Waseem Nasir",
    type: "profile",
    images: [
      {
        url: HEADSHOT,
        width: 956,
        height: 1700,
        alt: "Waseem Nasir, founder of SkynetLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Waseem Nasir — founder of SkynetLabs",
    description: ONE_LINER,
    images: [HEADSHOT],
  },
};

/* ProfilePage -> mainEntity Person is the chain Google's docs describe for a
   page whose primary focus is one person affiliated with the site. The Person
   itself is emitted once in app/layout.tsx as <SITE>/#person; this node only
   references it, so the page graph holds exactly one Person.
   Ref: developers.google.com/search/docs/appearance/structured-data/profile-page
   NOTE: this is disambiguation markup, not a Knowledge Panel trigger. Google
   publishes no such guarantee and none is claimed anywhere on this site. */
const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${url}#profilepage`,
  url,
  name: "Waseem Nasir",
  dateCreated: "2026-09-06",
  dateModified: "2026-09-06",
  mainEntity: { "@id": `${SITE}/#person` },
  isPartOf: { "@id": `${SITE}/#website` },
};

const TIMELINE: [string, string][] = [
  [
    "Before",
    "Accounting firms — payroll runs, QuickBooks, reconciliations. Where the instinct started: most of the work a business does is not thinking, it is copying.",
  ],
  [
    "Since 2019",
    "Building automation for clients. 180+ workflows built, 40+ sites shipped, 9 countries served — the four numbers this site publishes, and the only ones it will.",
  ],
  [
    "Now",
    "Runs SkynetLabs from Bali. A few projects a month, hands-on with each: n8n flows, Next.js front-ends, inbox triage, WhatsApp agents, and video pipelines driven from Claude Code.",
  ],
];

const PROFILES: [string, string][] = [
  ["https://www.linkedin.com/in/waseemnasir2k26", "LinkedIn"],
  ["https://github.com/waseemnasir2k26", "GitHub"],
  [
    "https://www.youtube.com/@vibecodewithwaseemnasir",
    "YouTube — vibe coding with Waseem Nasir",
  ],
  ["https://x.com/Skynetjoe1", "X (Twitter)"],
  ["https://www.facebook.com/Waseemskynetjoe", "Facebook"],
  ["https://www.instagram.com/waseemnasir2k27", "Instagram"],
  ["https://skynetjoe.com", "SkynetLabs — skynetjoe.com"],
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <BlogShell>
        <article className="mx-auto max-w-[760px] px-5 pt-14 sm:px-6 sm:pt-20">
          <Mono color={C.accent}>About</Mono>

          <h1
            className="mt-5 font-serif"
            style={{
              color: C.ink,
              fontSize: "clamp(2rem, 5vw, 3.1rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 700,
            }}
          >
            Waseem Nasir — founder of SkynetLabs.
          </h1>

          {/* Extractable definition block: one plain paragraph answering
              "who is this?" in a form an answer engine can lift verbatim. */}
          <Lead>
            Waseem Nasir is the founder of SkynetLabs, an AI automation studio.
            He builds n8n and Claude Code systems for service businesses, from
            Bali. He has been building automation for clients since 2019, across
            nine countries, and works hands-on with a few projects a month
            rather than running a team.
          </Lead>

          <div
            className="mt-10"
            style={{
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: SHADOW.md,
            }}
          >
            <Image
              src={HEADSHOT}
              alt="Waseem Nasir, founder of SkynetLabs"
              width={956}
              height={1700}
              sizes="(max-width: 760px) 100vw, 760px"
              loading="eager"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          <div className="mt-12">
            <H2>What he builds</H2>
            <P>
              The systems that run behind a business so the owner stops doing
              robot work: n8n flows, booking front-ends, lead routing, inbox
              triage, WhatsApp agents, and video pipelines driven from the
              terminal with Claude Code. They run in the background, monitor
              themselves, and recover from their own errors.
            </P>
            <P>
              He works with owners and operators of growing service businesses —
              clinics, travel, real estate, freight, agencies — who are losing
              time and revenue to manual busywork and want it gone without
              hiring a team.{" "}
              <Strong>If he cannot prove it, he will not claim it:</Strong> the
              four numbers on this site are the only ones it publishes, and
              client names stay private unless permission exists.
            </P>

            <H2>How he got here</H2>
            <div className="mt-6 flex flex-col gap-6">
              {TIMELINE.map(([when, what]) => (
                <div key={when}>
                  <Mono color={C.accent}>{when}</Mono>
                  <p
                    className="mt-2"
                    style={{ color: C.body, lineHeight: 1.7 }}
                  >
                    {what}
                  </p>
                </div>
              ))}
            </div>

            <H2>Background</H2>
            <P>
              BSc in Computer &amp; Electrical Engineering, COMSATS University
              Islamabad. Speaks English and Urdu. Based in Bali, Indonesia;
              clients are in Europe, the US, and Asia.
            </P>

            <H2>Where to find him</H2>
            <p className="mt-4" style={{ color: C.body, lineHeight: 1.8 }}>
              {ONE_LINER}
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {PROFILES.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bp-link"
                    style={{ color: C.accent }}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:waseem@skynetjoe.com"
                  className="bp-link"
                  style={{ color: C.accent }}
                >
                  waseem@skynetjoe.com
                </a>
              </li>
            </ul>
          </div>

          <RelatedLinks
            title="Elsewhere on this site"
            items={[
              ["/mentorship", "1:1 Claude Code mentorship"],
              ["/inbox-ops", "Inbox Ops Autopilot — the 9-step map"],
              ["/blog", "Field notes from the builds"],
              ["/book", "Book a free 30-minute automation audit"],
            ]}
          />

          <div className="mt-12">
            <SoftCTA
              href={CTA}
              label="Book a free 30-min call →"
              note="Bring your messiest manual process and leave with a 1-page automation map."
            />
            <p className="mt-6 text-center">
              <Link
                href="/"
                className="bp-link"
                style={{ color: C.mute, fontSize: "0.85rem" }}
              >
                ← Back to the homepage
              </Link>
            </p>
          </div>
        </article>
      </BlogShell>
    </>
  );
}
