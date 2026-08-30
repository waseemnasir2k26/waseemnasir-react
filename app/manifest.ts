import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Waseem Nasir — AI automation",
    short_name: "Waseem Nasir",
    description:
      "Founder of SkynetLabs. AI automation systems for service businesses.",
    start_url: "/",
    display: "browser",
    background_color: "#0A130E",
    theme_color: "#0B5D3B",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
