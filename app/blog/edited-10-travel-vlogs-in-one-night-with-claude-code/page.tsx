import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BlogShell,
  Mono,
  TagPill,
  Lead,
  P,
  H2,
  Strong,
  StepList,
  SoftCTA,
  C,
  SHADOW,
} from "../_ui";
import { getPost } from "../posts";

const SITE = "https://www.waseemnasir.com";
const VIDEO_LINK = "https://skynetjoe.com/discovery-call";
const post = getPost("edited-10-travel-vlogs-in-one-night-with-claude-code")!;
const url = `${SITE}/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} | Waseem Nasir`,
  description: post.description,
  alternates: { canonical: url },
  openGraph: {
    title: post.title,
    description: post.description,
    url,
    siteName: "Waseem Nasir",
    type: "article",
    publishedTime: post.date,
    authors: ["Waseem Nasir"],
    images: [{ url: post.ogImage, width: 1700, height: 956, alt: post.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
    images: [post.ogImage],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  dateModified: post.date,
  image: `${SITE}${post.ogImage}`,
  mainEntityOfPage: { "@type": "WebPage", "@id": url },
  author: {
    "@type": "Person",
    name: "Waseem Nasir",
    url: SITE,
    jobTitle: "Founder & Automation Engineer",
    worksFor: {
      "@type": "Organization",
      name: "SkynetLabs",
      url: "https://skynetjoe.com",
    },
  },
  publisher: { "@type": "Person", name: "Waseem Nasir", url: SITE },
};

export default function NewsPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogShell>
        <article className="mx-auto max-w-[760px] px-5 pt-14 sm:px-6 sm:pt-20">
          <div className="flex items-center gap-3">
            <Link href="/blog" className="bp-link">
              <Mono color={C.accent}>← Blog</Mono>
            </Link>
            <div
              style={{ height: 1, flex: 1, background: C.hairline }}
              aria-hidden
            />
          </div>

          <header className="mt-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <TagPill>{post.kind}</TagPill>
              <Mono color={C.mute} className="!tracking-[0.06em]">
                {post.dateLabel} · {post.readingTime}
              </Mono>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(2rem,4.6vw,3.1rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.028em",
                color: C.ink,
              }}
            >
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="relative overflow-hidden"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  border: `1px solid ${C.hairline}`,
                  display: "inline-block",
                }}
              >
                <Image
                  src="/img/pro/PORTRAIT-restaurant-closeup-glasses-beige-shirt.jpg"
                  alt="Waseem Nasir"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span style={{ color: C.body, fontSize: "0.92rem" }}>
                By <Strong>Waseem Nasir</Strong> · Founder, SkynetLabs
              </span>
            </div>
          </header>

          <figure
            className="relative mt-9 overflow-hidden"
            style={{
              borderRadius: 20,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW.md,
              aspectRatio: "16/9",
            }}
          >
            <Image
              src={post.ogImage}
              alt={post.ogAlt}
              fill
              priority
              sizes="(max-width:768px) 92vw, 760px"
              className="object-cover"
              style={{ filter: "saturate(0.95) contrast(1.02)" }}
            />
          </figure>

          <div className="mt-10 flex flex-col gap-6">
            <Lead>
              This week we cut, captioned, and rendered ten full travel vlogs —
              plus a short teaser for each — in a single overnight session. The
              footage was from Ubud, Bali. The editor was Claude Code, driven
              from the terminal, wired to an ffmpeg render pipeline.
            </Lead>

            <P>
              The reason it&apos;s worth writing down: editing ten videos by
              hand is a week of work. Timeline scrubbing, cutting, matching
              captions, exporting, re-exporting when the export is wrong. We ran
              the whole batch as one pipeline and let it render while we slept —
              twenty deliverables, one night.
            </P>

            <P>
              Nothing here is a fancy demo. It&apos;s the same automation-first
              approach I use for client systems, pointed at video instead of
              inboxes: describe the job, let the machine do the mechanical part,
              stay on the hook for taste and quality.
            </P>

            <H2>How the system works, in three steps</H2>

            <StepList
              steps={[
                {
                  h: "Describe the edit, don't scrub a timeline.",
                  d: (
                    <>
                      Each vlog gets a plain-language brief — the cold open, the
                      chapter beats, where captions land, the pace. Claude Code
                      reads it and assembles the edit decisions as code, not as
                      manual clicks on a timeline.
                    </>
                  ),
                },
                {
                  h: "ffmpeg does the cutting and captioning.",
                  d: (
                    <>
                      The pipeline hands the plan to ffmpeg — trims,
                      transitions, burned-in captions, color, the teaser
                      cut-down. Because it&apos;s code, all ten videos run the
                      exact same recipe, so the batch stays consistent instead
                      of drifting video-to-video.
                    </>
                  ),
                },
                {
                  h: "Render on the GPU, overnight, unattended.",
                  d: (
                    <>
                      Final renders run on an NVIDIA RTX GPU using NVENC
                      hardware encoding, which is the part that makes &quot;ten
                      videos in one night&quot; real rather than aspirational.
                      The queue runs while I&apos;m asleep; the files are
                      waiting in the morning.
                    </>
                  ),
                },
              ]}
            />

            <P>
              The honest caveat: this is a first pass, not a finished-forever
              button. I still watch every render and fix what taste catches. But
              the mechanical bulk of it — the cutting, the captioning, the
              exporting ten times — is handled. What used to be a week is now a
              review session over coffee.
            </P>

            <P>
              <Strong>Why it matters if you make content:</Strong> the wall was
              never ideas, it was editing time. When editing stops being the
              bottleneck, a founder or a small team can actually keep a channel
              fed — because the boring part runs itself.
            </P>
          </div>

          <div className="mt-12">
            <SoftCTA
              href={VIDEO_LINK}
              label="Get this for your footage →"
              note="Want a pipeline like this for your own content? Bring your footage and let's talk."
            />
          </div>
        </article>
      </BlogShell>
    </>
  );
}
