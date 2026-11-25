"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// The playlist embed returns 404 until the first episode is public.
const LIVE_AT = Date.parse("2026-11-28T14:05:00Z");

export function PlaylistEmbed({ embed, playlist }: { embed: string; playlist: string }) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    setLive(Date.now() >= LIVE_AT);
  }, []);

  if (live) {
    return (
      <iframe
        src={embed}
        title="Claude Code for Real Business: YouTube playlist"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
      />
    );
  }
  return (
    <a href={playlist} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
      <Image
        src="/img/course/ep01.webp"
        alt="Thumbnail of Episode 1, Claude Code for Real Business"
        fill
        sizes="(max-width: 900px) 100vw, 900px"
        style={{ objectFit: "cover" }}
        priority
      />
      <span
        style={{
          position: "absolute",
          left: 16,
          bottom: 16,
          background: "rgba(26,26,26,0.88)",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: 999,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Starts 28 November on YouTube
      </span>
    </a>
  );
}
