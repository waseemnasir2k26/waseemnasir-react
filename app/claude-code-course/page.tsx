import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogShell, Mono, TagPill, C, SHADOW } from "../blog/_ui";
import { EPISODES } from "./episodes";
import { PlaylistEmbed } from "./PlaylistEmbed";

const SITE = "https://www.waseemnasir.com";
const URL = `${SITE}/claude-code-course`;
const PLAYLIST = "https://www.youtube.com/playlist?list=PLPAJxQ4JXyZo";
const EMBED = "https://www.youtube.com/embed/videoseries?list=PLPAJxQ4JXyZo";
const CONTACT =
  "https://skynetjoe.com/contact?utm_source=waseemnasir.com&utm_medium=course-page&utm_campaign=ccrb";
const TITLE = "Claude Code for Real Business: free 11-part course";
const DESC =
  "A free 11-part YouTube course by Waseem Nasir. Each episode builds one real business job with Claude Code: websites, reports, QA, bookings, support, quotes and invoices.";

export const metadata: Metadata = {
  title: `${TITLE} | Waseem Nasir`,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    siteName: "Waseem Nasir",
    type: "website",
    images: [
      {
        url: "/img/course/ep01.webp",
        width: 960,
        height: 540,
        alt: "Claude Code for Real Business, episode 1 thumbnail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/img/course/ep01.webp"],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Claude Code for Real Business",
    description: DESC,
    url: URL,
    isAccessibleForFree: true,
    inLanguage: "en",
    provider: {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Waseem Nasir",
      url: `${SITE}/about`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Claude Code for Real Business: episodes",
    numberOfItems: EPISODES.length,
    itemListElement: EPISODES.map((e) => ({
      "@type": "ListItem",
      position: e.n,
      name: e.title,
      url: `${URL}#episode-${e.n}`,
    })),
  },
];

const display = {
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  color: C.ink,
} as const;

export default function ClaudeCodeCourse() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogShell>
        {/* intro */}
        <section className="mx-auto max-w-[900px] px-5 pt-16 sm:px-6 sm:pt-24">
          <div className="flex items-center gap-3">
            <Mono color={C.accent}>Free course · 11 videos</Mono>
            <div
              style={{ height: 1, flex: 1, background: C.hairline }}
              aria-hidden
            />
          </div>
          <h1
            className="mt-6"
            style={{
              ...display,
              fontSize: "clamp(2.1rem,5vw,3.5rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.028em",
              maxWidth: "20ch",
            }}
          >
            Claude Code for Real Business
          </h1>
          <p
            className="mt-5"
            style={{
              fontSize: "clamp(1.0625rem,1.4vw,1.1875rem)",
              lineHeight: 1.62,
              color: C.body,
              maxWidth: "58ch",
            }}
          >
            This is a free course on YouTube. It has 10 episodes and 1 bonus. In
            each one I take a real business job and build it with Claude Code,
            from start to finish. I also break it on purpose, so you see where
            it fails and how to fix it.
          </p>
          <p
            className="mt-4"
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.62,
              color: C.body,
              maxWidth: "58ch",
            }}
          >
            It is for freelancers, agency owners and small-business owners who
            want to use AI for client work without losing control of it. You do
            not need to be a developer.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={PLAYLIST}
              target="_blank"
              rel="noopener noreferrer"
              className="bp-cta inline-flex items-center justify-center rounded-full font-semibold"
              style={{
                background: C.accent,
                color: "#fff",
                fontSize: "0.95rem",
                padding: "0.75rem 1.6rem",
                minHeight: 48,
              }}
            >
              Watch the full playlist on YouTube
            </a>
            <Mono color={C.mute} className="!tracking-[0.06em]">
              Episode 1 goes live 28 Nov. One new episode every day.
            </Mono>
          </div>

          <div
            className="mt-10 overflow-hidden"
            style={{
              borderRadius: 20,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW.md,
              background: C.surface,
            }}
          >
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <PlaylistEmbed embed={EMBED} playlist={PLAYLIST} />
            </div>
          </div>
          <p
            className="mt-3"
            style={{ fontSize: "0.9rem", lineHeight: 1.55, color: C.mute }}
          >
            Videos appear in the player as each one goes public.
          </p>

          {/* course rule */}
          <aside
            className="mt-10"
            style={{
              borderLeft: `3px solid ${C.accent}`,
              background: C.accentTint,
              borderRadius: "0 14px 14px 0",
              padding: "1.25rem 1.5rem",
            }}
          >
            <Mono color={C.pillInk}>The rule of this course</Mono>
            <p
              className="mt-2"
              style={{
                ...display,
                fontSize: "clamp(1.15rem,2.2vw,1.4rem)",
                lineHeight: 1.35,
                letterSpacing: "-0.012em",
              }}
            >
              AI prepares the work. A person approves anything that sends, pays,
              cancels or deletes.
            </p>
          </aside>
        </section>

        {/* episodes */}
        <section className="mx-auto max-w-[900px] px-5 py-16 sm:px-6 sm:py-20">
          <h2
            style={{
              ...display,
              fontSize: "clamp(1.5rem,3vw,2rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.022em",
            }}
          >
            All 11 episodes
          </h2>
          <ol
            className="mt-8 flex flex-col gap-6"
            style={{ listStyle: "none", padding: 0 }}
          >
            {EPISODES.map((e) => (
              <li
                key={e.n}
                id={`episode-${e.n}`}
                style={{ scrollMarginTop: 80 }}
              >
                <article
                  className="overflow-hidden"
                  style={{
                    borderRadius: 20,
                    border: `1px solid ${C.hairline}`,
                    background: C.card,
                    boxShadow: SHADOW.sm,
                  }}
                >
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <Image
                      src={`/img/course/ep${String(e.n).padStart(2, "0")}.webp`}
                      alt={`${e.label} thumbnail: ${e.title}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 900px"
                      className="object-cover"
                      priority={e.n === 1}
                    />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <TagPill>{e.label}</TagPill>
                      <Mono color={C.mute} className="!tracking-[0.06em]">
                        Live from {e.live}, 22:00 WITA
                      </Mono>
                    </div>
                    <h3
                      style={{
                        ...display,
                        fontSize: "clamp(1.25rem,2.4vw,1.6rem)",
                        lineHeight: 1.16,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {e.title}
                    </h3>
                    <p
                      className="mt-3"
                      style={{
                        fontSize: "1.0625rem",
                        lineHeight: 1.65,
                        color: C.body,
                      }}
                    >
                      {e.intro}
                    </p>
                    <p
                      className="mt-5 font-mono uppercase"
                      style={{
                        color: C.mute,
                        fontSize: "0.72rem",
                        letterSpacing: "0.08em",
                      }}
                    >
                      You will learn
                    </p>
                    <ul
                      className="mt-2 flex flex-col gap-2"
                      style={{
                        paddingLeft: "1.1rem",
                        listStyle: "disc",
                        color: C.body,
                        lineHeight: 1.6,
                      }}
                    >
                      {e.learn.map((l) => (
                        <li key={l} style={{ overflowWrap: "anywhere" }}>
                          {l}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <a
                        href={PLAYLIST}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bp-cta-outline inline-flex items-center justify-center rounded-full font-semibold"
                        style={{
                          color: C.accent,
                          border: `1px solid ${C.accent}`,
                          fontSize: "0.88rem",
                          padding: "0.5rem 1.2rem",
                          minHeight: 44,
                        }}
                      >
                        Watch on YouTube
                      </a>
                      <a
                        href={e.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bp-link"
                        style={{ color: C.accent, fontSize: "0.92rem" }}
                      >
                        Free repo on GitHub
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>

        {/* disclosures */}
        <section className="mx-auto max-w-[900px] px-5 pb-12 sm:px-6">
          <h2
            style={{
              ...display,
              fontSize: "clamp(1.25rem,2.4vw,1.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Good to know
          </h2>
          <ul
            className="mt-4 flex flex-col gap-3"
            style={{
              paddingLeft: "1.1rem",
              listStyle: "disc",
              color: C.body,
              lineHeight: 1.65,
            }}
          >
            <li>The voice in the videos is an AI clone of my own voice.</li>
            <li>
              The clients in the episodes are fictional examples with synthetic
              data. The only exception is the bonus, which shows one real Upwork
              search run.
            </li>
            <li>
              This course is unofficial. It is not affiliated with or endorsed
              by Anthropic.
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[900px] px-5 pb-20 sm:px-6 sm:pb-28">
          <div
            style={{
              background: C.accentDeep,
              borderRadius: 24,
              padding: "clamp(1.75rem,4vw,3rem)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: C.onDeep,
                fontSize: "clamp(1.5rem,3vw,2rem)",
                lineHeight: 1.12,
                letterSpacing: "-0.022em",
              }}
            >
              Want this built for your business?
            </h2>
            <p
              className="mt-3"
              style={{
                color: C.onDeep,
                lineHeight: 1.6,
                maxWidth: "52ch",
                opacity: 0.9,
              }}
            >
              If you would rather not build it yourself, my team at SkynetLabs
              can do it for you.
            </p>
            <Link
              href={CONTACT}
              className="bp-cta mt-6 inline-flex items-center justify-center rounded-full font-semibold"
              style={{
                background: "#fff",
                color: C.accentDeep,
                fontSize: "0.95rem",
                padding: "0.75rem 1.6rem",
                minHeight: 48,
              }}
            >
              Talk to SkynetLabs
            </Link>
          </div>
        </section>
      </BlogShell>
    </>
  );
}
