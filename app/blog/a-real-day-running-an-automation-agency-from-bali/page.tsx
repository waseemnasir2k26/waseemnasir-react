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
  SoftCTA,
  C,
  CTA,
  SHADOW,
} from "../_ui";
import { getPost } from "../posts";

const SITE = "https://www.waseemnasir.com";
const post = getPost("a-real-day-running-an-automation-agency-from-bali")!;
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
  "@type": "Article",
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
  publisher: {
    "@type": "Person",
    name: "Waseem Nasir",
    url: SITE,
  },
};

export default function StoryPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogShell>
        <article className="mx-auto max-w-[760px] px-5 pt-14 sm:px-6 sm:pt-20">
          {/* breadcrumb + meta */}
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

          {/* hero image */}
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

          {/* body */}
          <div className="mt-10 flex flex-col gap-6">
            <Lead>
              It&apos;s 5:40 in the morning and the only light in the cafe is my
              laptop. The espresso machine isn&apos;t on yet. Bali is still dark
              outside, the roosters have started, and I have maybe two hours
              before the messages begin — the quietest, most useful window of my
              day.
            </Lead>

            <P>
              People imagine running an automation agency from Bali as a
              postcard: a laptop on a beach, a coconut, passive income while the
              robots work. The truth is closer to this — a dim room, a strong
              coffee, and a list of things that are quietly on fire. I want to
              walk you through one actual day, because I think the honest
              version is more useful than the postcard.
            </P>

            <H2>The morning fire</H2>

            <P>
              Today it starts with Italy. I build and maintain a WordPress
              booking plugin for Idea Viaggi, a family travel agency — the one
              that gates each customer so they only ever see the trips they
              actually booked. I&apos;d shipped version 2.9 the week before.
              Overnight, their site went to load it and hit a wall: the hosting
              firewall was silently blocking the plugin&apos;s update call.
              Nothing in the logs said &quot;firewall.&quot; It just failed, the
              way the worst bugs do: silently, and only on their server, never
              on mine.
            </P>

            <P>
              This is the part of the job nobody sees. The code was fine. The
              plugin was fine. The problem lived in the gap between my machine
              and theirs, in a security rule someone set two years ago and
              forgot. So the first hour of my day isn&apos;t building anything.
              It&apos;s reading a WAF ruleset in a language I half-read,
              reproducing a failure I can&apos;t see, and messaging a client on
              the other side of the world who is about to wake up and want to
              know why.
            </P>

            <PullQuote>
              Most of what I actually do isn&apos;t writing clever code.
              It&apos;s standing in the gap between how a business thinks it
              works and how it really does.
            </PullQuote>

            <P>
              I trace it, confirm it&apos;s the firewall stripping the request,
              and write up the exact rule they need their host to allow. Not
              glamorous. But their booking flow is breathing again by the time
              Lombardy is drinking its first coffee, and that&apos;s the whole
              job, really — being the person who makes the fire go out before
              the client has to panic about it.
            </P>

            <H2>The quiet middle</H2>

            <P>
              By mid-morning the room has filled and the espresso machine is
              screaming. This is when the day gets strange in a good way.
              I&apos;m not typing every line anymore. I run a lot of my build
              work through Claude Code now — I describe the system I want,
              review what it drafts, correct it, and run it. So while one agent
              is scaffolding a piece of a client&apos;s workflow, I&apos;m
              across the room with a DJI Pocket camera, filming b-roll for a
              video that has nothing to do with that build.
            </P>

            <P>
              It still catches me off guard. Two years ago a task like that was
              a full afternoon of me hunched over a keyboard. Now the machine
              drafts while I&apos;m shooting a clip of the rice fields, and I
              come back, read what it wrote, and fix the three things it got
              wrong. That&apos;s the actual shape of &quot;AI automation&quot;
              in my day: not magic, not hands-off, but a second pair of hands
              that never gets tired, that I still have to supervise like
              anything else.
            </P>

            <P>
              The rest of the middle is ordinary and I&apos;ve made peace with
              that. Takycorp&apos;s email triage — the system that reads their
              inbox, sorts it, and drafts replies — needed a new rule for a case
              it hadn&apos;t seen. A Lahore dental practice&apos;s front-desk
              flow needed a reminder message reworded. None of it is a headline.
              All of it is someone&apos;s Tuesday getting a little easier
              because a system I built is doing the boring part.
            </P>

            <H2>The ship, and the honest cost</H2>

            <P>
              Evening is when I ship. Today it&apos;s a batch of social content
              going out through GHL — I&apos;ve pushed a couple thousand posts
              through that pipeline over the last few months, and watching a
              scheduled queue fill up is one of the small satisfactions of this
              work. Something you built runs without you in the room.
              That&apos;s the entire point.
            </P>

            <P>
              But I said I&apos;d be honest, so here&apos;s the cost. Bali is
              beautiful and Bali is far. My clients are in Italy, the US,
              Pakistan, and my closest collaborators are a laptop screen and a
              queue of unread messages that arrive while I sleep. There are
              nights the work is done and the room is warm and I still feel the
              distance of it — everyone I&apos;m building for is asleep on the
              other side of the planet. Nobody tells you that the freedom and
              the loneliness are the same feeling wearing two shirts.
            </P>

            <P>
              So I keep one rule and I don&apos;t break it:{" "}
              <Strong>no eight-hour days.</Strong> Not because I&apos;m lazy —
              because the work I do is the kind that will happily eat every hour
              you feed it. There is always another leak to close, another
              workflow to harden. If I let it, this job becomes the whole life.
              The cap isn&apos;t a productivity hack. It&apos;s the thing that
              keeps me a person who happens to run systems, instead of a system
              that happens to be a person.
            </P>

            <H2>How I actually got here</H2>

            <P>
              None of this was the plan. Before the agency, before Bali, I
              worked inside accounting firms. QuickBooks, payroll runs,
              spreadsheets that had grown into small unmaintained cities.
              That&apos;s where the whole thing started, though I didn&apos;t
              know it at the time.
            </P>

            <P>
              Because when you do payroll by hand, you learn something in your
              bones: most of the work a business does isn&apos;t thinking,
              it&apos;s copying. Numbers from one sheet to another. The same
              reminder, retyped. The same reconciliation, every month, forever.
              I kept catching myself thinking,{" "}
              <em>a machine should be doing this.</em> Not to replace the people
              — to give them back the hours the copying was stealing.
            </P>

            <P>
              I never lost that instinct. I just changed the tools. The
              spreadsheets became n8n flows and booking front-ends and inbox
              triage bots, and the firm became a few clients a month, scattered
              across a handful of time zones. But the actual skill is the same
              one I learned doing payroll: sitting with how a business really
              runs, finding the part that&apos;s quietly bleeding time, and
              closing it. Accounting taught me to see the leak. Code just lets
              me weld it shut.
            </P>

            <P>
              That&apos;s a day. A fire in the morning, a strange quiet build in
              the middle, a ship in the evening, and a rule I keep so the whole
              thing stays worth it. Not a postcard. But I wouldn&apos;t trade
              it.
            </P>
          </div>

          {/* single soft CTA */}
          <div className="mt-12">
            <SoftCTA
              href={CTA}
              label="Book a free 30-min call →"
              note="If your business has a leak like the ones in this story, I'll help you find it."
            />
            <p
              className="mt-4 text-center"
              style={{ color: C.mute, fontSize: "0.85rem" }}
            >
              No pitch. Bring your messiest manual process and leave with a
              1-page automation map.
            </p>
          </div>
        </article>
      </BlogShell>
    </>
  );
}
