import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogShell, Mono, TagPill, C, SHADOW } from "./_ui";
import { POSTS } from "./posts";

const SITE = "https://www.waseemnasir.com";

export const metadata: Metadata = {
  title: "Blog — Waseem Nasir | Notes from an automation founder in Bali",
  description:
    "Field notes from Waseem Nasir, founder of SkynetLabs — how real AI automation and video systems get built, shipped, and kept running from Bali and Lahore.",
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    title: "Blog — Waseem Nasir",
    description:
      "Field notes from an automation founder — how real systems get built, shipped, and kept running from Bali and Lahore.",
    url: `${SITE}/blog`,
    siteName: "Waseem Nasir",
    type: "website",
    images: [
      {
        url: "/img/pro/CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
        width: 1700,
        height: 956,
        alt: "Waseem Nasir working late at a Bali cafe",
      },
    ],
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Waseem Nasir — Blog",
  url: `${SITE}/blog`,
  author: {
    "@type": "Person",
    name: "Waseem Nasir",
    url: SITE,
  },
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    datePublished: p.date,
    url: `${SITE}/blog/${p.slug}`,
    description: p.description,
  })),
};

export default function BlogIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogShell>
        {/* header */}
        <section className="mx-auto max-w-[900px] px-5 pt-16 sm:px-6 sm:pt-24">
          <div className="flex items-center gap-3">
            <Mono color={C.accent}>Blog — field notes</Mono>
            <div
              style={{ height: 1, flex: 1, background: C.hairline }}
              aria-hidden
            />
          </div>
          <h1
            className="mt-6"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.25rem,5vw,3.5rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.028em",
              color: C.ink,
              maxWidth: "18ch",
            }}
          >
            How the systems actually get built.
          </h1>
          <p
            className="mt-5"
            style={{
              fontSize: "clamp(1.0625rem,1.4vw,1.1875rem)",
              lineHeight: 1.62,
              color: C.body,
              maxWidth: "56ch",
            }}
          >
            No thought-leadership. Just honest notes from inside the work — the
            client fires, the pipelines, and the days behind the automation I
            ship from Bali and Lahore.
          </p>
        </section>

        {/* list */}
        <section className="mx-auto max-w-[900px] px-5 py-16 sm:px-6 sm:py-20">
          <ul
            className="flex flex-col gap-6"
            style={{ listStyle: "none", padding: 0 }}
          >
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <article
                    className="bp-postcard grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-[1fr_240px]"
                    style={{
                      borderRadius: 20,
                      border: `1px solid ${C.hairline}`,
                      background: C.card,
                      boxShadow: SHADOW.sm,
                    }}
                  >
                    <div className="flex flex-col p-7 sm:p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <TagPill>{p.kind}</TagPill>
                        <Mono color={C.mute} className="!tracking-[0.06em]">
                          {p.dateLabel} · {p.readingTime}
                        </Mono>
                      </div>
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: "clamp(1.3rem,2.4vw,1.7rem)",
                          lineHeight: 1.14,
                          letterSpacing: "-0.02em",
                          color: C.ink,
                        }}
                      >
                        {p.title}
                      </h2>
                      <p
                        className="mt-3"
                        style={{
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          color: C.body,
                          maxWidth: "60ch",
                        }}
                      >
                        {p.excerpt}
                      </p>
                      <div className="mt-auto pt-6">
                        <span
                          className="font-mono uppercase"
                          style={{
                            color: C.accent,
                            fontSize: "0.72rem",
                            fontWeight: 500,
                            letterSpacing: "0.08em",
                          }}
                        >
                          Read the post{" "}
                          <span className="bp-postcard-arrow">→</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className="relative hidden sm:block"
                      style={{ borderLeft: `1px solid ${C.hairline}` }}
                    >
                      <Image
                        src={p.ogImage}
                        alt={p.ogAlt}
                        fill
                        sizes="240px"
                        className="object-cover"
                        style={{ filter: "saturate(0.96)" }}
                      />
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </BlogShell>
    </>
  );
}
