"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   /d — Chooser index for all 50 founder landing-page directions.
   Self-contained. Dark gallery. Links to /d/01 .. /d/50.
   "pick" = scored 8.7-9.0 by the independent design critic.
   ============================================================ */

type Design = {
  id: string;
  name: string;
  mv: string;
  img: string;
  c: string[];
  pick?: boolean;
};

const DESIGNS: Design[] = [
  {
    id: "01",
    name: "International Typographic",
    mv: "Swiss / International Style — Müller-Brockmann modular grid",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    c: ["#F4F2EC", "#0A0A0A", "#E5251A", "#1A1AFF"],
    pick: true,
  },
  {
    id: "02",
    name: "Glitch Brutalist",
    mv: "Maximalist neo-brutalism — ASCII / CRT",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#0B0B0B", "#161616", "#39FF14", "#FF00A8"],
  },
  {
    id: "03",
    name: "Swiss-Punk Zine",
    mv: "Swiss grid corrupted by punk / Emigre, photocopied",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#FFFFFF", "#111111", "#FF3B00", "#888888"],
  },
  {
    id: "04",
    name: "Mono-Grid Minimalist",
    mv: "Austere systems brutalism — developer-grade restraint",
    img: "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    c: ["#171717", "#FAFAFA", "#0070F3", "#9B9B9B"],
  },
  {
    id: "05",
    name: "Signal-Color Editorial",
    mv: "Contemporary editorial brutalism — Bloomberg / Pentagram",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    c: ["#111111", "#1C1C1C", "#F2F2F2", "#FFE600"],
    pick: true,
  },
  {
    id: "06",
    name: "Terminal / System",
    mv: "Functional brutalism — command-line aesthetic",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#0D0F0C", "#C9D1C9", "#14170F", "#2A2E28"],
  },
  {
    id: "07",
    name: "Dada Constructivist",
    mv: "Russian Constructivism × neo-brutalism — diagonals, primary blocks",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#EDE8DF", "#000000", "#E5251A", "#1A1AFF"],
    pick: true,
  },
  {
    id: "08",
    name: "Voltage",
    mv: "Mat-Voyce illustrative-kinetic — neon-on-black",
    img: "/img/pro/LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
    c: ["#DFFF6B", "#0A0A0B", "#00D3FF", "#6B6B73"],
  },
  {
    id: "09",
    name: "Broadsheet",
    mv: "Neo-brutalist editorial / Swiss broadsheet — text-as-architecture",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#F3EFE6", "#FFFFFF", "#16140F", "#8A8275"],
  },
  {
    id: "10",
    name: "Oxblood Circular",
    mv: "Warm cinematic editorial — oxblood / burgundy + cream",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#1C0E0E", "#2A1414", "#F2E7D8", "#9C7A6E"],
  },
  {
    id: "11",
    name: "Terminal Drift",
    mv: "Dark cyber-monochrome + single acid interrupt",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#0B0D0C", "#C6F432", "#5A6360", "#E8EDEA"],
  },
  {
    id: "12",
    name: "Sideways",
    mv: "Horizontal-scroll gallery / kinetic showcase",
    img: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    c: ["#6D5CFF", "#FF5C8A", "#1A1A26", "#F5F4FB"],
  },
  {
    id: "13",
    name: "Ink Bleed",
    mv: "Clip-mask reveal / liquid type — Klein-blue accent",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#FAF7F2", "#EFEAE2", "#111111", "#0033FF"],
  },
  {
    id: "14",
    name: "Marquee Machine",
    mv: "Velocity marquee / type-loop maximalism",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    c: ["#0E0E0E", "#FFE600", "#FF2D55", "#FFFFFF"],
  },
  {
    id: "15",
    name: "Acid Terminal",
    mv: "Acid graphics / cyber-grotesk",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    c: ["#0B0B0C", "#16161A", "#C6FF3D", "#6E6E78"],
    pick: true,
  },
  {
    id: "16",
    name: "Riso Misprint",
    mv: "Risograph / two-ink overprint",
    img: "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    c: ["#F3EFE4", "#FF4F00", "#0050FF", "#1A1A1A"],
    pick: true,
  },
  {
    id: "17",
    name: "Chrome Keychain",
    mv: "Y2K-revival / liquid-metal sticker UI",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#C8D2DC", "#EAF0F4", "#0A0E12", "#5B6672"],
  },
  {
    id: "18",
    name: "Swiss Poison",
    mv: "Neo-brutalist / acid-Swiss",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    c: ["#1500FF", "#E8FF00", "#050505", "#FFFFFF"],
  },
  {
    id: "19",
    name: "Vapor Atlas",
    mv: "Retro-future maximalist / dithered cyber-monochrome",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#07070F", "#E6E6FF", "#00E5FF", "#FF2E97"],
  },
  {
    id: "20",
    name: "Hyperpop Collage",
    mv: "Maximalist sticker-collage / hyperpop",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    c: ["#FFE600", "#FF5DA2", "#120016", "#00FFB3"],
  },
  {
    id: "21",
    name: "Oxide Print",
    mv: "Acid-risograph hybrid / industrial retro-future",
    img: "/img/pro/PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    c: ["#14130F", "#211F18", "#F4E9C9", "#FF6A1A"],
  },
  {
    id: "22",
    name: "Maison Blanc",
    mv: "Quiet-luxury fashion-house minimalism — Jacquemus / The Row",
    img: "/img/pro/PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    c: ["#F4F1EA", "#FFFFFF", "#1A1A18", "#8C887E"],
  },
  {
    id: "23",
    name: "Vitrine",
    mv: "Gallery-rail editorial / horizontal museum hang",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#EDEAE3", "#E2DDD2", "#222019", "#6B2C1F"],
  },
  {
    id: "24",
    name: "Encre",
    mv: "High-fashion editorial spread / Vogue contents-page",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#0E0E0C", "#17160F", "#F2EFE6", "#C9A24B"],
  },
  {
    id: "25",
    name: "Atelier Paper",
    mv: "Swiss-editorial meets couture spec-sheet",
    img: "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    c: ["#FBFAF7", "#101010", "#1E3A2F", "#D6CFC0"],
  },
  {
    id: "26",
    name: "Soie",
    mv: "Soft quiet-luxury — beauty-brand tactility",
    img: "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    c: ["#EFE7E1", "#F7F2ED", "#2B2521", "#9A6A55"],
  },
  {
    id: "27",
    name: "Marbre",
    mv: "Architectural luxe / stone-and-serif monumentalism",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#E8E6E1", "#1C1C1A", "#33403A", "#8E8C85"],
  },
  {
    id: "28",
    name: "Editorial Noir",
    mv: "Cinematic fashion-film / film-serif title sequence",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#0B0B0B", "#141414", "#EDEAE3", "#76726A"],
  },
  {
    id: "29",
    name: "Noir Dossier",
    mv: "Cinematic neo-noir / investigative editorial",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#C8A24B", "#0A0A0B", "#EDEAE3", "#6E6A63"],
  },
  {
    id: "30",
    name: "16mm Light Leak",
    mv: "Analog film / Super-16 warmth",
    img: "/img/pro/TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    c: ["#11100D", "#1C1A15", "#F2EDE3", "#7A7264"],
  },
  {
    id: "31",
    name: "Duotone Spotlight",
    mv: "Bauhaus-duotone / gallery monograph",
    img: "/img/pro/PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    c: ["#0C0F1A", "#EAEFFF", "#5B6CFF", "#FF5DA2"],
  },
  {
    id: "32",
    name: "Void Horizontal Reel",
    mv: "Black-void minimalism / horizontal cinema",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#000000", "#FFFFFF", "#00E5C7", "#9A6BFF"],
  },
  {
    id: "33",
    name: "Terminal Chiaroscuro",
    mv: "Hacker-editorial / dark IDE meets Renaissance lighting",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#08090A", "#D6F5E3", "#4A5C52", "#39FF7A"],
  },
  {
    id: "34",
    name: "Ashen Dust",
    mv: "Brutalist-cinematic / concrete + ember",
    img: "/img/pro/WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    c: ["#121110", "#6B6358", "#FF4D1C", "#E7E2DA"],
  },
  {
    id: "35",
    name: "Midnight Glass Aurora",
    mv: "Cinematic glassmorphism / nocturne",
    img: "/img/pro/EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
    c: ["#070B16", "#0F1626", "#EAF0FF", "#5A6788"],
  },
  {
    id: "36",
    name: "Aurora Borealis",
    mv: "Aurora gradient / ethereal dark editorial",
    img: "/img/pro/PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    c: ["#070A14", "#0E1426", "#F2F5FF", "#5EEAD4"],
  },
  {
    id: "37",
    name: "Liquid Glass",
    mv: "Apple Liquid Glass — SVG feDisplacementMap refraction",
    img: "/img/pro/PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
    c: ["#0B0D10", "#10141A", "#FFFFFF", "#7DD3FC"],
  },
  {
    id: "38",
    name: "Iridescent Foil",
    mv: "Iridescence / thin-film interference — oil-slick foil",
    img: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    c: ["#08070C", "#13101C", "#FBFAFF", "#FF8FD8"],
    pick: true,
  },
  {
    id: "39",
    name: "Clay Aurora Depth",
    mv: "Soft-3D / claymorphic depth with aurora backlight",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#0D1018", "#161B27", "#EDF1F7", "#86EFAC"],
  },
  {
    id: "40",
    name: "Gradient Mesh Minimal",
    mv: "Tasteful light gradient-mesh — anti-dark-mode",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#F7F6F3", "#16151A", "#4F46E5", "#6B6A75"],
  },
  {
    id: "41",
    name: "Obsidian Glass Terminal",
    mv: "Dark glass + technical / mono — founder-engineer hybrid",
    img: "/img/pro/PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    c: ["#0A0C0E", "#0F1614", "#E6F1EC", "#34D399"],
  },
  {
    id: "42",
    name: "The Broadsheet",
    mv: "Newspaper masthead / classic broadsheet — NYT / FT lineage",
    img: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    c: ["#0D0C0A", "#1A1714", "#F2EFE6", "#EDE9DC"],
    pick: true,
  },
  {
    id: "43",
    name: "Kinfolk Quiet",
    mv: "Slow-living editorial / Kinfolk minimalism",
    img: "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    c: ["#EDE8DF", "#F7F4EF", "#2B2B28", "#7C6A52"],
    pick: true,
  },
  {
    id: "44",
    name: "The Monocle Dossier",
    mv: "Premium magazine / Monocle-style affairs brief",
    img: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    c: ["#C04A1E", "#F2EEE6", "#23211C", "#E4DCCB"],
    pick: true,
  },
  {
    id: "45",
    name: "Risograph Press",
    mv: "Indie zine / risograph two-ink print",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#F2E8D8", "#E8341A", "#1A3AD4", "#E8D8C0"],
    pick: true,
  },
  {
    id: "46",
    name: "Le Monde Noir",
    mv: "Luxury supplement / inverted broadsheet at night",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#16130F", "#211C16", "#D9A441", "#F0E9DC"],
    pick: true,
  },
  {
    id: "47",
    name: "The Swiss Gazette",
    mv: "International Typographic Style meets newspaper",
    img: "/img/pro/PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    c: ["#EFEBE3", "#FFFFFF", "#E5341C", "#111110"],
    pick: true,
  },
  {
    id: "48",
    name: "Terracotta Review",
    mv: "Warm editorial / New Yorker long-read, 2026 warm palette",
    img: "/img/pro/CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    c: ["#EDE3D3", "#A8552F", "#241C15", "#FAF4EA"],
    pick: true,
  },
  {
    id: "49",
    name: "Command-K",
    mv: "Command-palette-as-interface — Linear / Raycast lineage",
    img: "/img/pro/PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    c: ["#0A0B0F", "#13141A", "#7C5CFF", "#F0F0F2"],
    pick: true,
  },
  {
    id: "50",
    name: "IDE Split-Pane",
    mv: "Code editor chrome as portfolio — VS Code / Zed homage",
    img: "/img/pro/PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    c: ["#181A1F", "#21252B", "#61AFEF", "#98C379"],
    pick: true,
  },
];

const FONT =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=JetBrains+Mono:wght@400;500&display=swap";

export default function ChooserIndex() {
  const reduce = useReducedMotion();
  const picks = DESIGNS.filter((d) => d.pick).length;

  return (
    <div className="d-root">
      <style>{`
        @import url('${FONT}');
        .d-root{ position:relative; z-index:2; min-height:100vh; background:#08090B; color:#ECECEC;
          font-family:'Space Grotesk',system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
        .d-root *{ box-sizing:border-box; }
        .d-wrap{ max-width:1320px; margin:0 auto; padding:clamp(28px,6vw,80px) clamp(18px,4vw,40px) 120px; }
        .d-eyebrow{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.28em;
          text-transform:uppercase; color:#7CF0C0; margin:0 0 18px; }
        .d-h1{ font-family:'Fraunces',serif; font-weight:600; line-height:.98; letter-spacing:-.02em;
          font-size:clamp(40px,7vw,84px); margin:0 0 18px; }
        .d-h1 em{ font-style:italic; color:#9aa0a6; }
        .d-sub{ max-width:62ch; color:#9aa0a6; font-size:clamp(15px,1.6vw,18px); line-height:1.6; margin:0 0 14px; }
        .d-meta{ font-family:'JetBrains Mono',monospace; font-size:12.5px; color:#6b7177;
          display:flex; gap:18px; flex-wrap:wrap; margin:22px 0 0; padding-top:22px;
          border-top:1px solid rgba(255,255,255,.08); }
        .d-meta b{ color:#ECECEC; font-weight:500; }
        .d-grid{ margin-top:clamp(34px,6vw,64px); display:grid; gap:18px;
          grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); }
        .d-card{ position:relative; display:flex; flex-direction:column; text-decoration:none;
          border:1px solid rgba(255,255,255,.09); border-radius:16px; overflow:hidden;
          background:#0E1013; transition:transform .35s cubic-bezier(.2,.8,.2,1),border-color .35s,box-shadow .35s; }
        .d-card:hover{ transform:translateY(-6px); border-color:rgba(255,255,255,.22);
          box-shadow:0 24px 60px -28px rgba(0,0,0,.9); }
        .d-card:focus-visible{ outline:2px solid #7CF0C0; outline-offset:3px; }
        .d-thumb{ position:relative; aspect-ratio:4/3; overflow:hidden; }
        .d-thumb img{ width:100%; height:100%; object-fit:cover; display:block;
          transition:transform .6s cubic-bezier(.2,.8,.2,1),filter .6s; filter:saturate(1.02); }
        .d-card:hover .d-thumb img{ transform:scale(1.06); }
        .d-tint{ position:absolute; inset:0; mix-blend-mode:soft-light; opacity:.5; }
        .d-num{ position:absolute; top:12px; left:12px; font-family:'JetBrains Mono',monospace;
          font-size:12px; letter-spacing:.1em; padding:5px 9px; border-radius:999px;
          background:rgba(8,9,11,.72); backdrop-filter:blur(6px); color:#ECECEC; }
        .d-pick{ position:absolute; top:12px; right:12px; font-family:'JetBrains Mono',monospace;
          font-size:11px; letter-spacing:.12em; padding:5px 9px; border-radius:999px;
          background:rgba(124,240,192,.16); border:1px solid rgba(124,240,192,.5); color:#7CF0C0; }
        .d-body{ padding:16px 16px 18px; display:flex; flex-direction:column; gap:9px; flex:1; }
        .d-name{ font-family:'Fraunces',serif; font-weight:600; font-size:21px; line-height:1.08;
          letter-spacing:-.01em; color:#FBFBFB; }
        .d-mv{ font-size:13px; line-height:1.45; color:#8b9197; min-height:36px;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .d-foot{ margin-top:auto; padding-top:12px; display:flex; align-items:center;
          justify-content:space-between; border-top:1px solid rgba(255,255,255,.07); }
        .d-swatch{ display:flex; gap:5px; }
        .d-dot{ width:15px; height:15px; border-radius:5px; border:1px solid rgba(255,255,255,.18); }
        .d-open{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.06em;
          color:#cfd3d7; display:inline-flex; align-items:center; gap:6px; }
        .d-card:hover .d-open{ color:#7CF0C0; }
        @media (prefers-reduced-motion: reduce){
          .d-card,.d-thumb img{ transition:none !important; }
        }
      `}</style>

      <main className="d-wrap" id="main-content">
        <header>
          <p className="d-eyebrow">
            Waseem Nasir · Founder Site · {DESIGNS.length} Directions
          </p>
          <h1 className="d-h1">
            Fifty ways to
            <br /> <em>introduce yourself.</em>
          </h1>
          <p className="d-sub">
            Fifty hand-built landing-page directions for the same founder —
            different branding, fonts, copy and motion in each. Researched
            against Awwwards / Godly / Land-book winners, then built and
            critic-graded. Open any one full-screen, then pick your favourite.
          </p>
          <p className="d-sub" style={{ color: "#6b7177", fontSize: 14 }}>
            Same real proof in every design: 180+ builds · 40+ clients · 9
            countries · since 2019. No fabricated metrics.
          </p>
          <div className="d-meta">
            <span>
              <b>{DESIGNS.length}</b> directions
            </span>
            <span>
              <b>{picks}</b> critic top-picks ★
            </span>
            <span>
              <b>8</b> design movements
            </span>
            <span>Built by Claude Code</span>
          </div>
        </header>

        <section className="d-grid" aria-label="All 50 design directions">
          {DESIGNS.map((d, i) => (
            <motion.div
              key={d.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.018, 0.4),
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <Link
                href={`/d/${d.id}`}
                className="d-card"
                aria-label={`Open design ${d.id}: ${d.name}`}
              >
                <div className="d-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={`${d.name} — preview`} loading="lazy" />
                  <span
                    className="d-tint"
                    style={{ background: d.c[2] || d.c[0] }}
                    aria-hidden
                  />
                  <span className="d-num">{d.id}</span>
                  {d.pick && <span className="d-pick">★ PICK</span>}
                </div>
                <div className="d-body">
                  <span className="d-name">{d.name}</span>
                  <span className="d-mv">{d.mv}</span>
                  <div className="d-foot">
                    <span className="d-swatch" aria-hidden>
                      {d.c.slice(0, 4).map((col, k) => (
                        <span
                          className="d-dot"
                          key={k}
                          style={{ background: col }}
                        />
                      ))}
                    </span>
                    <span className="d-open">Open ↗</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        <footer
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,.08)",
            color: "#6b7177",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12.5,
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <span>Waseem Nasir — Founder, SkynetLabs</span>
          <a
            href="https://skynetjoe.com/discovery-call"
            style={{ color: "#7CF0C0", textDecoration: "none" }}
          >
            Book a 30-min call ↗
          </a>
        </footer>
      </main>
    </div>
  );
}
