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
  PullQuote,
  RelatedLinks,
  C,
  SHADOW,
} from "./_ui";
import { POSTS, type PostMeta } from "./posts";
import type { Block } from "./_content/types";

const SITE = "https://www.waseemnasir.com";
const WA_NUMBER = "+62 813 1607 7185";
const WA_LINK = "https://wa.me/6281316077185";
const EMAIL = "waseem@skynetjoe.com";

export function articleMetadata(post: PostMeta): Metadata {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
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
      images: [
        { url: post.ogImage, width: 1700, height: 956, alt: post.ogAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.ogImage],
    },
  };
}

function jsonLd(post: PostMeta) {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: `${SITE}${post.ogImage}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@id": `${SITE}/#person`,
      "@type": "Person",
      name: "Waseem Nasir",
      url: `${SITE}/about`,
    },
    publisher: {
      "@id": `${SITE}/#person`,
      "@type": "Person",
      name: "Waseem Nasir",
      url: SITE,
    },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.t) {
    case "lead":
      return <Lead key={i}>{b.text}</Lead>;
    case "h2":
      return <H2 key={i}>{b.text}</H2>;
    case "quote":
      return <PullQuote key={i}>{b.text}</PullQuote>;
    default:
      return <P key={i}>{b.text}</P>;
  }
}

export function otherPosts(slug: string): [string, string][] {
  return POSTS.filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => [`/blog/${p.slug}`, p.title] as [string, string]);
}

export function ArticlePage({
  post,
  body,
  related,
}: {
  post: PostMeta;
  body: Block[];
  related: [string, string][];
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(post)) }}
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
            {body.map(renderBlock)}

            <div
              className="mt-4"
              style={{
                border: `1px solid ${C.hairline}`,
                borderRadius: 18,
                padding: "1.5rem",
                boxShadow: SHADOW.md,
              }}
            >
              <Mono color={C.accent}>Talk to me</Mono>
              <p
                className="mt-3"
                style={{ color: C.body, fontSize: "1.02rem", lineHeight: 1.65 }}
              >
                If this sounds like your business, message me on WhatsApp at{" "}
                <a
                  href={WA_LINK}
                  className="bp-link"
                  style={{ color: C.accent }}
                  rel="noopener"
                >
                  {WA_NUMBER}
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="bp-link"
                  style={{ color: C.accent }}
                >
                  {EMAIL}
                </a>
                . I will tell you honestly what I would do first. More about
                what I build is at{" "}
                <a
                  href="https://skynetjoe.com"
                  className="bp-link"
                  style={{ color: C.accent }}
                  rel="noopener"
                >
                  skynetjoe.com
                </a>
                .
              </p>
            </div>
          </div>

          <RelatedLinks items={related} />
          <div className="pb-4" />
        </article>
      </BlogShell>
    </>
  );
}
