"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────
   DESIGN 50 — IDE Split-Pane
   VS Code / Zed homage · Code editor chrome as portfolio
   palette: #181A1F bg · #21252B surface · #ABB2BF text
            #5C6370 muted · #61AFEF accent · #E5C07B accent2
   fonts:   Space Grotesk 500/600 · Inter 400/500 · IBM Plex Mono 400/500
───────────────────────────────────────────────────────── */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap";

const CTA = "https://skynetjoe.com/discovery-call";
const GITHUB = "https://github.com/waseemnasir2k26";

// ── Syntax token types ──────────────────────────────────
type TokenType =
  | "keyword"
  | "fn"
  | "string"
  | "comment"
  | "number"
  | "type"
  | "operator"
  | "var"
  | "prop"
  | "plain";

interface Token {
  text: string;
  type: TokenType;
}

type CodeLine = Token[];

// ── File tree nodes ──────────────────────────────────────
interface FileNode {
  name: string;
  icon: string;
  fileId: string;
  lang: string;
  type: "file";
}
interface FolderNode {
  name: string;
  icon: string;
  type: "folder";
  expanded: boolean;
  children: (FileNode | FolderNode)[];
}
type TreeNode = FileNode | FolderNode;

// ── Tab definition ───────────────────────────────────────
interface Tab {
  id: string;
  label: string;
  lang: string;
  icon: string;
  modified?: boolean;
}

// ── Token colors ─────────────────────────────────────────
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "#C678DD",
  fn: "#61AFEF",
  string: "#98C379",
  comment: "#5C6370",
  number: "#D19A66",
  type: "#E5C07B",
  operator: "#56B6C2",
  var: "#E06C75",
  prop: "#ABB2BF",
  plain: "#ABB2BF",
};

// ── Tokenized code blocks per "file" ────────────────────

const ABOUT_TS: CodeLine[] = [
  [{ text: "/**", type: "comment" }],
  [
    { text: " * @file", type: "comment" },
    { text: "  waseem.ts", type: "comment" },
  ],
  [
    { text: " * @author", type: "comment" },
    { text: " Waseem Nasir", type: "comment" },
  ],
  [
    { text: " * @since", type: "comment" },
    { text: "  2019 — still shipping", type: "comment" },
  ],
  [{ text: " */", type: "comment" }],
  [],
  [
    { text: "import", type: "keyword" },
    { text: " { ", type: "plain" },
    { text: "Automation", type: "type" },
    { text: ", ", type: "plain" },
    { text: "AIStack", type: "type" },
    { text: " } ", type: "plain" },
    { text: "from", type: "keyword" },
    { text: ' "', type: "plain" },
    { text: "@skynetlabs/core", type: "string" },
    { text: '"', type: "plain" },
  ],
  [],
  [
    {
      text: "// 180+ builds. 40+ clients. 9 countries. One rule:",
      type: "comment",
    },
  ],
  [{ text: "// if it ships, it ships *working*.", type: "comment" }],
  [],
  [
    { text: "const", type: "keyword" },
    { text: " waseem", type: "var" },
    { text: " = ", type: "operator" },
    { text: "()", type: "plain" },
    { text: " =>", type: "operator" },
    { text: " automation", type: "fn" },
    { text: ".thatActuallyShips", type: "fn" },
    { text: "()", type: "plain" },
  ],
  [],
  [
    { text: "interface", type: "keyword" },
    { text: " Founder", type: "type" },
    { text: " {", type: "plain" },
  ],
  [
    { text: "  name", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: '"Waseem Nasir"', type: "string" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  entity", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: '"SkynetLabs"', type: "string" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  base", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: '"Bali / Lahore"', type: "string" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  since", type: "prop" },
    { text: ":   ", type: "plain" },
    { text: "2019", type: "number" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  builds", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: "number", type: "keyword" },
    { text: "; ", type: "plain" },
    { text: "// ≥180", type: "comment" },
  ],
  [
    { text: "  clients", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "number", type: "keyword" },
    { text: "; ", type: "plain" },
    { text: "// ≥40", type: "comment" },
  ],
  [
    { text: "  countries", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "number", type: "keyword" },
    { text: "; ", type: "plain" },
    { text: "// 9", type: "comment" },
  ],
  [{ text: "}", type: "plain" }],
  [],
  [
    { text: "const", type: "keyword" },
    { text: " me", type: "var" },
    { text: ": ", type: "plain" },
    { text: "Founder", type: "type" },
    { text: " = {", type: "plain" },
  ],
  [
    { text: "  name", type: "prop" },
    { text: ":     ", type: "plain" },
    { text: '"Waseem Nasir"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  entity", type: "prop" },
    { text: ":   ", type: "plain" },
    { text: '"SkynetLabs"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  base", type: "prop" },
    { text: ":     ", type: "plain" },
    { text: '"Bali / Lahore"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  since", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: "2019", type: "number" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  builds", type: "prop" },
    { text: ":   ", type: "plain" },
    { text: "180", type: "number" },
    { text: ",  ", type: "plain" },
    { text: "// and counting", type: "comment" },
  ],
  [
    { text: "  clients", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: "40", type: "number" },
    { text: ",   ", type: "plain" },
    { text: "// across 9 countries", type: "comment" },
  ],
  [
    { text: "  countries", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "9", type: "number" },
    { text: ",", type: "plain" },
  ],
  [{ text: "}", type: "plain" }],
];

const SERVICES_TS: CodeLine[] = [
  [{ text: "// services.ts — what actually gets built", type: "comment" }],
  [],
  [
    { text: "type", type: "keyword" },
    { text: " Service", type: "type" },
    { text: " = {", type: "plain" },
  ],
  [
    { text: "  id", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: "string", type: "keyword" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  name", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: "string", type: "keyword" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  kills", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "string", type: "keyword" },
    { text: "[];", type: "plain" },
    { text: " // the busywork it eliminates", type: "comment" },
  ],
  [{ text: "}", type: "plain" }],
  [],
  [
    { text: "export const", type: "keyword" },
    { text: " SERVICES", type: "var" },
    { text: ": ", type: "plain" },
    { text: "Service[]", type: "type" },
    { text: " = [", type: "plain" },
  ],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    id", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: '"ai-automation"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    name", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: '"AI Automation"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    kills", type: "prop" },
    { text: ": [", type: "plain" },
    { text: '"dead follow-ups"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"missed leads"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"manual ops"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    id", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: '"n8n-pipelines"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    name", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: '"n8n Pipelines"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    kills", type: "prop" },
    { text: ": [", type: "plain" },
    { text: '"context-switching"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"copy-paste hell"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    id", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: '"voice-bots"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    name", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: '"WhatsApp / Voice Bots"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    kills", type: "prop" },
    { text: ": [", type: "plain" },
    { text: '"midnight support shifts"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"ghosted leads"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    id", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: '"aeo-systems"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    name", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: '"AEO / AI Visibility"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    kills", type: "prop" },
    { text: ": [", type: "plain" },
    { text: '"zero AI mentions"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"invisible brand"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    id", type: "prop" },
    { text: ":    ", type: "plain" },
    { text: '"next-apps"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    name", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: '"Next.js Systems"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    kills", type: "prop" },
    { text: ": [", type: "plain" },
    { text: '"slow shipping"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"spaghetti backends"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [{ text: "]", type: "plain" }],
];

const WORK_TS: CodeLine[] = [
  [{ text: "// selected-work.ts — proof, not promises", type: "comment" }],
  [],
  [
    { text: "interface", type: "keyword" },
    { text: " Project", type: "type" },
    { text: " {", type: "plain" },
  ],
  [
    { text: "  client", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "string", type: "keyword" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  stack", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: "string[]", type: "type" },
    { text: ";", type: "plain" },
  ],
  [
    { text: "  shipped", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "boolean", type: "keyword" },
    { text: "; ", type: "plain" },
    { text: "// always true", type: "comment" },
  ],
  [{ text: "}", type: "plain" }],
  [],
  [
    { text: "const", type: "keyword" },
    { text: " selectedWork", type: "var" },
    { text: ": ", type: "plain" },
    { text: "Project[]", type: "type" },
    { text: " = [", type: "plain" },
  ],
  [
    {
      text: "  // Inspire Health PT — $27 Stripe funnel + WP theme",
      type: "comment",
    },
  ],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    client", type: "prop" },
    { text: ": ", type: "plain" },
    { text: '"Inspire Health PT"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    stack", type: "prop" },
    { text: ":  [", type: "plain" },
    { text: '"WordPress"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"Stripe"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"n8n"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [
    { text: "    shipped", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "true", type: "keyword" },
    { text: ",", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [
    {
      text: "  // FreightOps — AI voice receptionist for trucking",
      type: "comment",
    },
  ],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    client", type: "prop" },
    { text: ": ", type: "plain" },
    { text: '"FreightOps"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    stack", type: "prop" },
    { text: ":  [", type: "plain" },
    { text: '"Voice AI"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"WhatsApp"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"Meta Ads"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [
    { text: "    shipped", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "true", type: "keyword" },
    { text: ",", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [
    {
      text: "  // Takycorp — email automation, survived 2 outages",
      type: "comment",
    },
  ],
  [{ text: "  {", type: "plain" }],
  [
    { text: "    client", type: "prop" },
    { text: ": ", type: "plain" },
    { text: '"Takycorp"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    stack", type: "prop" },
    { text: ":  [", type: "plain" },
    { text: '"OpenAI"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"Gmail API"', type: "string" },
    { text: ", ", type: "plain" },
    { text: '"n8n"', type: "string" },
    { text: "],", type: "plain" },
  ],
  [
    { text: "    shipped", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "true", type: "keyword" },
    { text: ",", type: "plain" },
  ],
  [{ text: "  },", type: "plain" }],
  [{ text: "]", type: "plain" }],
  [],
  [
    {
      text: "// Note: shipped = always true is not a coincidence.",
      type: "comment",
    },
  ],
  [{ text: "// It is a constraint, not a boast.", type: "comment" }],
];

const CONTACT_TS: CodeLine[] = [
  [{ text: "// contact.ts — let's cut the small talk", type: "comment" }],
  [],
  [
    { text: "const", type: "keyword" },
    { text: " bookCall", type: "fn" },
    { text: " = ", type: "operator" },
    { text: "async", type: "keyword" },
    { text: " () => {", type: "plain" },
  ],
  [
    { text: "  ", type: "plain" },
    { text: "const", type: "keyword" },
    { text: " session", type: "var" },
    { text: " = ", type: "operator" },
    { text: "await", type: "keyword" },
    { text: " calendar", type: "fn" },
    { text: ".book({", type: "plain" },
  ],
  [
    { text: "    duration", type: "prop" },
    { text: ": ", type: "plain" },
    { text: "30", type: "number" },
    { text: ", ", type: "plain" },
    { text: "// minutes", type: "comment" },
  ],
  [
    { text: "    agenda", type: "prop" },
    { text: ":  ", type: "plain" },
    { text: '"your automation gap"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "    outcome", type: "prop" },
    { text: ": ", type: "plain" },
    { text: '"clarity or no call"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [{ text: "  })", type: "plain" }],
  [],
  [
    { text: "  ", type: "plain" },
    { text: "return", type: "keyword" },
    { text: " session.confirmed", type: "prop" },
    { text: " ? ", type: "operator" },
  ],
  [
    { text: "    ", type: "plain" },
    { text: '"we build next week"', type: "string" },
  ],
  [
    { text: "    : ", type: "plain" },
    { text: '"you wasted 30 min — rare"', type: "string" },
  ],
  [{ text: "}", type: "plain" }],
  [],
  [{ text: "// → skynetjoe.com/discovery-call", type: "comment" }],
  [{ text: "// → github.com/waseemnasir2k26", type: "comment" }],
  [],
  [
    { text: "export default", type: "keyword" },
    { text: " bookCall", type: "fn" },
  ],
];

// ── File tree structure ──────────────────────────────────
const FILE_TREE: TreeNode[] = [
  {
    name: "waseem-nasir",
    icon: "📁",
    type: "folder",
    expanded: true,
    children: [
      {
        name: "src",
        icon: "📂",
        type: "folder",
        expanded: true,
        children: [
          {
            name: "waseem.ts",
            icon: "🟦",
            fileId: "about",
            lang: "TypeScript",
            type: "file",
          },
          {
            name: "services.ts",
            icon: "🟦",
            fileId: "services",
            lang: "TypeScript",
            type: "file",
          },
          {
            name: "selected-work.ts",
            icon: "🟦",
            fileId: "work",
            lang: "TypeScript",
            type: "file",
          },
          {
            name: "contact.ts",
            icon: "🟦",
            fileId: "contact",
            lang: "TypeScript",
            type: "file",
          },
        ],
      },
      {
        name: "README.md",
        icon: "📄",
        fileId: "readme",
        lang: "Markdown",
        type: "file",
      },
      {
        name: "package.json",
        icon: "📦",
        fileId: "package",
        lang: "JSON",
        type: "file",
      },
    ],
  },
];

const FILE_CONTENT: Record<string, CodeLine[]> = {
  about: ABOUT_TS,
  services: SERVICES_TS,
  work: WORK_TS,
  contact: CONTACT_TS,
};

// README and package.json as plain text lines
const README_LINES: CodeLine[] = [
  [{ text: "# waseem-nasir", type: "fn" }],
  [],
  [
    {
      text: "> Independent founder. AI + automation systems that ship.",
      type: "comment",
    },
  ],
  [],
  [{ text: "## Quick stats", type: "fn" }],
  [],
  [{ text: "| Metric    | Value |", type: "plain" }],
  [{ text: "|-----------|-------|", type: "muted" as TokenType }],
  [{ text: "| Builds    | 180+  |", type: "plain" }],
  [{ text: "| Clients   | 40+   |", type: "plain" }],
  [{ text: "| Countries | 9     |", type: "plain" }],
  [{ text: "| Since     | 2019  |", type: "plain" }],
  [],
  [{ text: "## Book a call", type: "fn" }],
  [],
  [{ text: "30 minutes. No pitch deck. Just your problem.", type: "plain" }],
  [{ text: "→ skynetjoe.com/discovery-call", type: "string" }],
];

const PACKAGE_LINES: CodeLine[] = [
  [{ text: "{", type: "plain" }],
  [
    { text: '  "name"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"waseem-nasir"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: '  "version"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"2019.6.0"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: '  "description"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"AI automation that actually ships"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: '  "author"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"Waseem Nasir <SkynetLabs>"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: '  "dependencies"', type: "string" },
    { text: ": {", type: "plain" },
  ],
  [
    { text: '    "n8n"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"*"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: '    "openai"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"*"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: '    "next"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"14.x"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: '    "whatsapp-cloud-api"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"*"', type: "string" },
  ],
  [{ text: "  },", type: "plain" }],
  [
    { text: '  "scripts"', type: "string" },
    { text: ": {", type: "plain" },
  ],
  [
    { text: '    "build"', type: "string" },
    { text: ": ", type: "plain" },
    { text: '"ship --clients=40 --countries=9"', type: "string" },
  ],
  [{ text: "  }", type: "plain" }],
  [{ text: "}", type: "plain" }],
];

FILE_CONTENT["readme"] = README_LINES;
FILE_CONTENT["package"] = PACKAGE_LINES;

// ── Image mapping ────────────────────────────────────────
const PHOTOS = [
  "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
  "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
  "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
  "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
  "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
  "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
  "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
  "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
  "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
  "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
  "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
  "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
];

// ── Token renderer ───────────────────────────────────────
function renderLine(line: CodeLine, idx: number) {
  if (line.length === 0) return <span key={idx}>&nbsp;</span>;
  return (
    <span key={idx}>
      {line.map((tok, ti) => (
        <span key={ti} style={{ color: TOKEN_COLORS[tok.type] }}>
          {tok.text}
        </span>
      ))}
    </span>
  );
}

// ── Flatten file tree for iteration ─────────────────────
function flattenFiles(nodes: TreeNode[]): FileNode[] {
  const result: FileNode[] = [];
  for (const n of nodes) {
    if (n.type === "file") result.push(n);
    else result.push(...flattenFiles(n.children));
  }
  return result;
}

// ── Tab labels mapping ───────────────────────────────────
const FILE_TABS: Record<string, Tab> = {
  about: { id: "about", label: "waseem.ts", lang: "TypeScript", icon: "🟦" },
  services: {
    id: "services",
    label: "services.ts",
    lang: "TypeScript",
    icon: "🟦",
  },
  work: {
    id: "work",
    label: "selected-work.ts",
    lang: "TypeScript",
    icon: "🟦",
  },
  contact: {
    id: "contact",
    label: "contact.ts",
    lang: "TypeScript",
    icon: "🟦",
  },
  readme: { id: "readme", label: "README.md", lang: "Markdown", icon: "📄" },
  package: { id: "package", label: "package.json", lang: "JSON", icon: "📦" },
};

// ── TreeItem component ───────────────────────────────────
function TreeItem({
  node,
  depth,
  activeFile,
  onFileClick,
}: {
  node: TreeNode;
  depth: number;
  activeFile: string;
  onFileClick: (id: string) => void;
}) {
  const [open, setOpen] = useState(
    node.type === "folder" ? (node as FolderNode).expanded : false,
  );

  if (node.type === "file") {
    const isActive = node.fileId === activeFile;
    return (
      <button
        onClick={() => onFileClick(node.fileId)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingLeft: depth * 16 + 8,
          paddingTop: 3,
          paddingBottom: 3,
          paddingRight: 8,
          width: "100%",
          background: isActive ? "rgba(97,175,239,0.12)" : "transparent",
          border: "none",
          cursor: "pointer",
          color: isActive ? "#61AFEF" : "#ABB2BF",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          textAlign: "left",
          borderLeft: isActive ? "2px solid #61AFEF" : "2px solid transparent",
          transition: "all 0.15s ease",
        }}
        aria-label={`Open ${node.name}`}
      >
        <span style={{ fontSize: 11 }}>{node.icon}</span>
        <span>{node.name}</span>
      </button>
    );
  }

  const folder = node as FolderNode;
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingLeft: depth * 16 + 8,
          paddingTop: 4,
          paddingBottom: 4,
          paddingRight: 8,
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#ABB2BF",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        <span style={{ color: "#5C6370", fontSize: 10 }}>
          {open ? "▾" : "▸"}
        </span>
        <span style={{ fontSize: 11 }}>{open ? "📂" : "📁"}</span>
        <span style={{ color: "#E5C07B" }}>{folder.name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            {folder.children.map((child, i) => (
              <TreeItem
                key={i}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onFileClick={onFileClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────
export default function Design50() {
  const prefersReduced = useReducedMotion();
  const [activeFile, setActiveFile] = useState("about");
  const [openTabs, setOpenTabs] = useState<string[]>(["about"]);
  const [selectionLine, setSelectionLine] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [mobileView, setMobileView] = useState<"tree" | "editor">("editor");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Simulated cursor blink
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    if (prefersReduced) return;
    const t = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, [prefersReduced]);

  // Open file in tab + activate
  const openFile = useCallback(
    (fileId: string) => {
      setOpenTabs((tabs) => (tabs.includes(fileId) ? tabs : [...tabs, fileId]));
      setActiveFile(fileId);
      if (editorRef.current) editorRef.current.scrollTop = 0;
      if (isMobile) setMobileView("editor");
    },
    [isMobile],
  );

  const closeTab = useCallback(
    (fileId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenTabs((tabs) => {
        const next = tabs.filter((t) => t !== fileId);
        if (activeFile === fileId && next.length > 0) {
          setActiveFile(next[next.length - 1]);
        }
        return next;
      });
    },
    [activeFile],
  );

  const currentLines = FILE_CONTENT[activeFile] ?? [];
  const currentTab = FILE_TABS[activeFile];

  // ── Status bar breadcrumb ───────────────────────────────
  const breadcrumb =
    activeFile === "readme"
      ? "waseem-nasir / README.md"
      : activeFile === "package"
        ? "waseem-nasir / package.json"
        : `waseem-nasir / src / ${currentTab?.label ?? ""}`;

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        .root-50 {
          font-family: 'Inter', sans-serif;
          background: #181A1F;
          color: #ABB2BF;
          min-height: 100vh;
          position: relative;
          z-index: 2;
        }

        /* Skip nav */
        .root-50 .skip-link {
          position: absolute;
          top: -40px;
          left: 8px;
          background: #61AFEF;
          color: #181A1F;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          z-index: 9999;
          transition: top 0.2s;
        }
        .root-50 .skip-link:focus {
          top: 8px;
        }

        /* IDE shell */
        .root-50 .ide-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          min-height: 100vh;
          overflow: hidden;
        }

        /* Title bar */
        .root-50 .title-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          height: 38px;
          background: #21252B;
          border-bottom: 1px solid #181A1F;
          flex-shrink: 0;
          user-select: none;
        }
        .root-50 .title-bar-dots {
          display: flex;
          gap: 6px;
          margin-right: 8px;
        }
        .root-50 .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .root-50 .dot-red   { background: #FF5F57; }
        .root-50 .dot-yellow{ background: #FFBD2E; }
        .root-50 .dot-green { background: #28C840; }
        .root-50 .title-bar-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          color: #5C6370;
          flex: 1;
          text-align: center;
        }

        /* Activity bar */
        .root-50 .workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        .root-50 .activity-bar {
          width: 48px;
          background: #1C1F24;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 8px;
          gap: 4px;
          border-right: 1px solid #181A1F;
          flex-shrink: 0;
        }
        .root-50 .act-btn {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #5C6370;
          transition: all 0.15s;
        }
        .root-50 .act-btn:hover,
        .root-50 .act-btn.active {
          color: #ABB2BF;
          background: rgba(255,255,255,0.06);
        }
        .root-50 .act-btn:focus-visible {
          outline: 2px solid #61AFEF;
          outline-offset: 2px;
        }

        /* Sidebar / file tree */
        .root-50 .sidebar {
          width: 220px;
          background: #21252B;
          border-right: 1px solid #181A1F;
          flex-shrink: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .root-50 .sidebar-header {
          padding: 10px 8px 6px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: #5C6370;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid #181A1F;
          margin-bottom: 4px;
        }

        /* Editor area */
        .root-50 .editor-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* Tabs */
        .root-50 .tab-bar {
          display: flex;
          background: #21252B;
          border-bottom: 1px solid #181A1F;
          overflow-x: auto;
          flex-shrink: 0;
          scrollbar-width: none;
        }
        .root-50 .tab-bar::-webkit-scrollbar { display: none; }
        .root-50 .tab-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          height: 35px;
          border-right: 1px solid #181A1F;
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          white-space: nowrap;
          border: none;
          background: transparent;
          color: #5C6370;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .root-50 .tab-item:hover {
          color: #ABB2BF;
          background: rgba(255,255,255,0.04);
        }
        .root-50 .tab-item.active {
          color: #ABB2BF;
          background: #282C34;
          border-bottom: 2px solid #61AFEF;
        }
        .root-50 .tab-item:focus-visible {
          outline: 2px solid #61AFEF;
          outline-offset: -2px;
        }
        .root-50 .tab-close {
          font-size: 10px;
          color: #5C6370;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 3px;
          border: none;
          background: transparent;
          line-height: 1;
          transition: all 0.15s;
        }
        .root-50 .tab-close:hover {
          color: #E06C75;
          background: rgba(224,108,117,0.15);
        }

        /* Code editor scroll container */
        .root-50 .editor-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: auto;
          background: #282C34;
          position: relative;
        }
        .root-50 .editor-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .root-50 .editor-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .root-50 .editor-scroll::-webkit-scrollbar-thumb {
          background: #3E4452;
          border-radius: 3px;
        }

        /* Code grid: gutter + lines */
        .root-50 .code-table {
          display: table;
          min-width: 100%;
          padding-bottom: 200px;
        }
        .root-50 .code-row {
          display: table-row;
          cursor: default;
        }
        .root-50 .code-row:hover .line-num {
          color: #ABB2BF;
        }
        .root-50 .code-row.selected {
          background: rgba(97, 175, 239, 0.10);
        }
        .root-50 .line-num {
          display: table-cell;
          width: 44px;
          min-width: 44px;
          padding: 1px 16px 1px 0;
          text-align: right;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #3E4452;
          user-select: none;
          position: sticky;
          left: 0;
          background: #282C34;
          border-right: 1px solid #3E4452;
          vertical-align: top;
          transition: color 0.1s;
        }
        .root-50 .line-content {
          display: table-cell;
          padding: 1px 0 1px 16px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre;
          vertical-align: top;
        }

        /* Selection sweep animation */
        @keyframes sweep50 {
          0%   { background: transparent; }
          40%  { background: rgba(97,175,239,0.15); }
          100% { background: transparent; }
        }
        .root-50 .code-row.sweep {
          animation: sweep50 0.8s ease forwards;
        }

        /* Minimap */
        .root-50 .minimap {
          width: 60px;
          background: #21252B;
          border-left: 1px solid #181A1F;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          padding: 4px 4px;
          gap: 1px;
          overflow: hidden;
        }
        .root-50 .mini-line {
          height: 2px;
          border-radius: 1px;
          opacity: 0.4;
        }

        /* Status bar */
        .root-50 .status-bar {
          height: 22px;
          background: #21252B;
          border-top: 1px solid #181A1F;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 16px;
          flex-shrink: 0;
        }
        .root-50 .status-item {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #5C6370;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .root-50 .status-branch {
          color: #61AFEF;
        }

        /* Below-fold content panels */
        .root-50 .content-section {
          padding: 48px 0;
          background: #21252B;
          border-top: 1px solid #181A1F;
        }
        .root-50 .section-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .root-50 .section-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #5C6370;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }
        .root-50 .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 600;
          color: #ABB2BF;
          margin: 0 0 32px;
        }
        .root-50 .section-title span {
          color: #61AFEF;
        }

        /* Stats row */
        .root-50 .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #181A1F;
          border: 1px solid #181A1F;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0;
        }
        .root-50 .stat-cell {
          background: #21252B;
          padding: 28px 20px;
          text-align: center;
        }
        .root-50 .stat-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 36px;
          font-weight: 500;
          color: #61AFEF;
          line-height: 1;
          margin-bottom: 6px;
        }
        .root-50 .stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #5C6370;
        }
        .root-50 .stat-comment {
          font-size: 10px;
          color: #3E4452;
          margin-top: 4px;
        }

        /* Services */
        .root-50 .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .root-50 .service-card {
          background: #282C34;
          border: 1px solid #3E4452;
          border-radius: 6px;
          padding: 20px 20px 16px;
          transition: border-color 0.2s;
        }
        .root-50 .service-card:hover {
          border-color: #61AFEF;
        }
        .root-50 .service-id {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #5C6370;
          margin-bottom: 6px;
        }
        .root-50 .service-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #E5C07B;
          margin-bottom: 8px;
        }
        .root-50 .service-kills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .root-50 .kill-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #5C6370;
          background: #1C1F24;
          border: 1px solid #3E4452;
          border-radius: 3px;
          padding: 2px 8px;
        }
        .root-50 .kill-tag::before {
          content: "- ";
          color: #E06C75;
        }

        /* Work grid */
        .root-50 .work-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #181A1F;
          border: 1px solid #181A1F;
          border-radius: 8px;
          overflow: hidden;
        }
        .root-50 .work-card {
          background: #21252B;
          overflow: hidden;
          position: relative;
        }
        .root-50 .work-img {
          width: 100%;
          aspect-ratio: 16/10;
          object-fit: cover;
          display: block;
          opacity: 0.75;
          transition: opacity 0.3s;
        }
        .root-50 .work-card:hover .work-img {
          opacity: 1;
        }
        .root-50 .work-meta {
          padding: 12px 14px;
        }
        .root-50 .work-client {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #ABB2BF;
          margin-bottom: 4px;
        }
        .root-50 .work-stack-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .root-50 .stack-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #61AFEF;
          background: rgba(97,175,239,0.08);
          border: 1px solid rgba(97,175,239,0.2);
          border-radius: 3px;
          padding: 1px 6px;
        }

        /* About section */
        .root-50 .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .root-50 .about-photo {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #3E4452;
        }
        .root-50 .about-text p {
          font-size: 15px;
          line-height: 1.75;
          color: #ABB2BF;
          margin: 0 0 14px;
        }
        .root-50 .about-text p strong {
          color: #E5C07B;
          font-weight: 500;
        }
        .root-50 .about-comment {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #5C6370;
          border-left: 2px solid #3E4452;
          padding-left: 12px;
          margin: 16px 0;
          font-style: italic;
        }
        .root-50 .loc-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .root-50 .loc-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #ABB2BF;
          background: #282C34;
          border: 1px solid #3E4452;
          border-radius: 3px;
          padding: 4px 10px;
        }

        /* CTA section */
        .root-50 .cta-section {
          padding: 64px 0 80px;
          background: #1C1F24;
          border-top: 1px solid #181A1F;
          text-align: center;
        }
        .root-50 .cta-pre {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #5C6370;
          margin-bottom: 12px;
        }
        .root-50 .cta-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 32px;
          font-weight: 600;
          color: #ABB2BF;
          margin: 0 0 8px;
        }
        .root-50 .cta-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #5C6370;
          margin: 0 0 32px;
        }
        .root-50 .cta-btn {
          display: inline-block;
          background: #61AFEF;
          color: #181A1F;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .root-50 .cta-btn:hover {
          background: #73BEFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(97,175,239,0.25);
        }
        .root-50 .cta-btn:focus-visible {
          outline: 2px solid #E5C07B;
          outline-offset: 3px;
        }

        /* Footer */
        .root-50 .footer {
          padding: 20px 32px;
          background: #21252B;
          border-top: 1px solid #181A1F;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .root-50 .footer-left {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #5C6370;
        }
        .root-50 .footer-links {
          display: flex;
          gap: 16px;
        }
        .root-50 .footer-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #5C6370;
          text-decoration: none;
          transition: color 0.15s;
        }
        .root-50 .footer-link:hover {
          color: #61AFEF;
        }
        .root-50 .footer-link:focus-visible {
          outline: 1px solid #61AFEF;
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Mobile overrides */
        @media (max-width: 767px) {
          .root-50 .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #181A1F;
          }
          .root-50 .activity-bar { display: none; }
          .root-50 .minimap { display: none; }
          .root-50 .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .root-50 .services-grid { grid-template-columns: 1fr; }
          .root-50 .work-grid { grid-template-columns: 1fr; }
          .root-50 .about-grid { grid-template-columns: 1fr; }
          .root-50 .section-title { font-size: 20px; }
          .root-50 .footer { flex-direction: column; gap: 8px; text-align: center; }
          .root-50 .ide-shell { height: auto; overflow: visible; }
          .root-50 .editor-scroll { max-height: 60vh; }
        }

        @media (min-width: 768px) {
          .root-50 .mobile-toggle { display: none !important; }
        }

        .root-50 .mobile-toggle {
          padding: 8px 16px;
          background: #21252B;
          border-bottom: 1px solid #181A1F;
          display: flex;
          gap: 8px;
        }
        .root-50 .mob-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid #3E4452;
          background: transparent;
          color: #5C6370;
          cursor: pointer;
          transition: all 0.15s;
        }
        .root-50 .mob-btn.active {
          color: #61AFEF;
          border-color: #61AFEF;
          background: rgba(97,175,239,0.08);
        }

        /* Cursor blink */
        .root-50 .cursor {
          display: inline-block;
          width: 8px;
          height: 14px;
          background: #61AFEF;
          vertical-align: text-bottom;
          transition: opacity 0.05s;
        }
      `}</style>

      <div className="root-50">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {/* ── IDE CHROME ── */}
        <div className="ide-shell">
          {/* Title bar */}
          <div className="title-bar" role="banner">
            <div className="title-bar-dots" aria-hidden="true">
              <div className="dot dot-red" title="Close" />
              <div className="dot dot-yellow" title="Minimize" />
              <div className="dot dot-green" title="Maximize" />
            </div>
            <span className="title-bar-name">
              waseem-nasir — {currentTab?.label ?? ""}
            </span>
          </div>

          {/* Mobile toggle */}
          <div
            className="mobile-toggle"
            role="navigation"
            aria-label="Mobile panel toggle"
          >
            <button
              className={`mob-btn${mobileView === "tree" ? " active" : ""}`}
              onClick={() => setMobileView("tree")}
            >
              Explorer
            </button>
            <button
              className={`mob-btn${mobileView === "editor" ? " active" : ""}`}
              onClick={() => setMobileView("editor")}
            >
              Editor
            </button>
          </div>

          <div className="workspace">
            {/* Activity bar */}
            <nav className="activity-bar" aria-label="Activity bar">
              <button
                className="act-btn active"
                title="Explorer"
                aria-label="File explorer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button className="act-btn" title="Search" aria-label="Search">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <button
                className="act-btn"
                title="Source Control"
                aria-label="Source control"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <circle cx="18" cy="6" r="3" />
                  <path d="M6 9v3a3 3 0 003 3h3M18 9v3" />
                </svg>
              </button>
            </nav>

            {/* Sidebar — file tree */}
            {(!isMobile || mobileView === "tree") && (
              <nav className="sidebar" aria-label="File explorer">
                <div className="sidebar-header">Explorer</div>
                {FILE_TREE.map((node, i) => (
                  <TreeItem
                    key={i}
                    node={node}
                    depth={0}
                    activeFile={activeFile}
                    onFileClick={openFile}
                  />
                ))}
              </nav>
            )}

            {/* Editor area */}
            {(!isMobile || mobileView === "editor") && (
              <main className="editor-area" id="main-content">
                <h1 className="sr-only">Waseem Nasir — Portfolio</h1>

                {/* Tab bar */}
                <div className="tab-bar" role="tablist" aria-label="Open files">
                  {openTabs.map((tabId) => {
                    const tab = FILE_TABS[tabId];
                    if (!tab) return null;
                    return (
                      <button
                        key={tabId}
                        role="tab"
                        aria-selected={tabId === activeFile}
                        className={`tab-item${tabId === activeFile ? " active" : ""}`}
                        onClick={() => setActiveFile(tabId)}
                      >
                        <span aria-hidden="true">{tab.icon}</span>
                        {tab.label}
                        <button
                          className="tab-close"
                          onClick={(e) => closeTab(tabId, e)}
                          aria-label={`Close ${tab.label}`}
                        >
                          ×
                        </button>
                      </button>
                    );
                  })}
                </div>

                {/* Code pane */}
                <div
                  className="editor-scroll"
                  ref={editorRef}
                  role="region"
                  aria-label={`Code: ${currentTab?.label ?? ""}`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFile}
                      className="code-table"
                      initial={prefersReduced ? {} : { opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={prefersReduced ? {} : { opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {currentLines.map((line, idx) => (
                        <div
                          key={idx}
                          className={`code-row${selectionLine === idx ? " selected" : ""}`}
                          onClick={() =>
                            setSelectionLine(idx === selectionLine ? null : idx)
                          }
                        >
                          <span className="line-num" aria-hidden="true">
                            {idx + 1}
                          </span>
                          <span className="line-content">
                            {renderLine(line, idx)}
                            {idx === currentLines.length - 1 && (
                              <span
                                className="cursor"
                                aria-hidden="true"
                                style={{ opacity: cursorVisible ? 1 : 0 }}
                              />
                            )}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            )}

            {/* Minimap */}
            {!isMobile && (
              <div className="minimap" aria-hidden="true">
                {currentLines.map((line, i) => (
                  <div
                    key={i}
                    className="mini-line"
                    style={{
                      width: `${Math.min(100, Math.max(10, line.length * 4))}%`,
                      background:
                        line.length === 0
                          ? "transparent"
                          : line[0]?.type === "comment"
                            ? "#5C6370"
                            : line[0]?.type === "keyword"
                              ? "#C678DD"
                              : "#61AFEF",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Status bar */}
          <div
            className="status-bar"
            role="contentinfo"
            aria-label="Editor status"
          >
            <span className="status-item status-branch">
              <svg
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 019 8.5H7a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 017 7h2a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
              </svg>
              main
            </span>
            <span className="status-item">{currentTab?.lang ?? ""}</span>
            <span className="status-item" style={{ marginLeft: "auto" }}>
              {breadcrumb}
            </span>
            <span className="status-item">
              Ln{" "}
              {selectionLine !== null ? selectionLine + 1 : currentLines.length}
              , Col 1
            </span>
            <span className="status-item" style={{ color: "#98C379" }}>
              UTF-8
            </span>
          </div>
        </div>

        {/* ── BELOW FOLD — full landing content ── */}

        {/* Stats */}
        <section className="content-section" aria-labelledby="stats-heading">
          <div className="section-inner">
            <p className="section-tag">// proof</p>
            <h2 className="section-title" id="stats-heading">
              <span>const</span> proof = <span>{"{"}</span>
            </h2>
            <motion.div
              className="stats-grid"
              initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {[
                {
                  num: "180+",
                  label: "builds shipped",
                  comment: "// still counting",
                },
                {
                  num: "40+",
                  label: "clients served",
                  comment: "// across 9 countries",
                },
                {
                  num: "9",
                  label: "countries remote",
                  comment: "// Bali → Lahore → world",
                },
                {
                  num: "2019",
                  label: "year zero",
                  comment: "// still committed",
                },
              ].map((s) => (
                <div className="stat-cell" key={s.num}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-comment">{s.comment}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section
          className="content-section"
          style={{ background: "#282C34" }}
          aria-labelledby="services-heading"
        >
          <div className="section-inner">
            <p className="section-tag">// services.ts</p>
            <h2 className="section-title" id="services-heading">
              What <span>ships</span>
            </h2>
            <div className="services-grid">
              {[
                {
                  id: "01",
                  name: "AI Automation",
                  desc: "n8n workflows that run overnight and scale sideways. Dead follow-ups and missed leads become history.",
                  kills: ["dead follow-ups", "missed leads", "manual ops"],
                },
                {
                  id: "02",
                  name: "n8n Pipelines",
                  desc: "Multi-step integrations across every API you throw at it. CRM, email, Slack, WhatsApp — wired once, runs forever.",
                  kills: [
                    "context-switching",
                    "copy-paste hell",
                    "fragile Zapier chains",
                  ],
                },
                {
                  id: "03",
                  name: "WhatsApp / Voice Bots",
                  desc: "AI receptionists that answer 24/7. Leads get qualified before you finish your coffee.",
                  kills: [
                    "midnight support shifts",
                    "ghosted leads",
                    "response lag",
                  ],
                },
                {
                  id: "04",
                  name: "AEO + AI Visibility",
                  desc: "Get cited by ChatGPT, Perplexity, and Gemini. The next SEO moat, built now.",
                  kills: [
                    "zero AI mentions",
                    "invisible brand",
                    "last-mover disadvantage",
                  ],
                },
                {
                  id: "05",
                  name: "Next.js Systems",
                  desc: "Full-stack products on Next.js 14. Stripe, auth, real data — production-ready, not demo-ready.",
                  kills: [
                    "slow shipping",
                    "spaghetti backends",
                    "demo-only builds",
                  ],
                },
                {
                  id: "06",
                  name: "Funnel Engineering",
                  desc: "End-to-end revenue funnels — landing page, payment, email sequence, analytics. One system that converts.",
                  kills: [
                    "leaky funnels",
                    "manual onboarding",
                    "disconnected tools",
                  ],
                },
              ].map((svc, i) => (
                <motion.div
                  className="service-card"
                  key={svc.id}
                  initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="service-id">// service_{svc.id}</div>
                  <div className="service-name">{svc.name}</div>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontSize: 13,
                      color: "#ABB2BF",
                      lineHeight: 1.6,
                      margin: "0 0 12px",
                    }}
                  >
                    {svc.desc}
                  </p>
                  <div className="service-kills">
                    {svc.kills.map((k) => (
                      <span className="kill-tag" key={k}>
                        {k}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Work */}
        <section className="content-section" aria-labelledby="work-heading">
          <div className="section-inner">
            <p className="section-tag">// selected-work.ts</p>
            <h2 className="section-title" id="work-heading">
              Recent <span>commits</span>
            </h2>
            <div className="work-grid">
              {[
                {
                  img: PHOTOS[0],
                  client: "Inspire Health PT",
                  stack: ["WordPress", "Stripe", "n8n"],
                  desc: "$27 funnel + custom WP theme, live in production",
                },
                {
                  img: PHOTOS[2],
                  client: "FreightOps",
                  stack: ["Voice AI", "WhatsApp", "Meta Ads"],
                  desc: "AI receptionist for US trucking operators",
                },
                {
                  img: PHOTOS[3],
                  client: "Takycorp",
                  stack: ["OpenAI", "Gmail API", "n8n"],
                  desc: "Email automation — survived 2 outages, still running",
                },
                {
                  img: PHOTOS[6],
                  client: "IdeaViaggi",
                  stack: ["WordPress", "REST API", "PHP"],
                  desc: "Per-customer trip visibility system via CTM",
                },
                {
                  img: PHOTOS[9],
                  client: "SkynetJoe.com",
                  stack: ["Next.js 14", "AEO", "Framer Motion"],
                  desc: "Personal AI visibility engine + founder site",
                },
                {
                  img: PHOTOS[10],
                  client: "Meta Ads — SG/US",
                  stack: ["WhatsApp Biz", "Meta Ads", "GHL"],
                  desc: "Dual-geo AI receptionist ad campaign",
                },
              ].map((w, i) => (
                <motion.div
                  className="work-card"
                  key={i}
                  initial={prefersReduced ? {} : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <img
                    src={`/img/pro/${w.img}`}
                    alt={`${w.client} — ${w.desc}`}
                    className="work-img"
                  />
                  <div className="work-meta">
                    <div className="work-client">{w.client}</div>
                    <p
                      style={{
                        fontFamily: "IBM Plex Mono",
                        fontSize: 11,
                        color: "#5C6370",
                        margin: "0 0 8px",
                        lineHeight: 1.5,
                      }}
                    >
                      // {w.desc}
                    </p>
                    <div className="work-stack-tags">
                      {w.stack.map((s) => (
                        <span className="stack-tag" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section
          className="content-section"
          style={{ background: "#282C34" }}
          aria-labelledby="about-heading"
        >
          <div className="section-inner">
            <p className="section-tag">// waseem.ts — author</p>
            <h2 className="section-title" id="about-heading">
              <span>export default</span> founder
            </h2>
            <div className="about-grid">
              <div>
                <img
                  src={`/img/pro/${PHOTOS[5]}`}
                  alt="Waseem Nasir — founder of SkynetLabs, arms crossed, confident"
                  className="about-photo"
                />
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <img
                    src={`/img/pro/${PHOTOS[7]}`}
                    alt="Waseem at Nusa Penida cliffs, Bali"
                    style={{
                      width: "48%",
                      borderRadius: 4,
                      objectFit: "cover",
                      aspectRatio: "4/3",
                      border: "1px solid #3E4452",
                    }}
                  />
                  <img
                    src={`/img/pro/${PHOTOS[8]}`}
                    alt="Waseem — glass building portrait"
                    style={{
                      width: "48%",
                      borderRadius: 4,
                      objectFit: "cover",
                      aspectRatio: "4/3",
                      border: "1px solid #3E4452",
                    }}
                  />
                </div>
              </div>
              <div className="about-text">
                <p>
                  <strong>Waseem Nasir</strong> is the independent founder of{" "}
                  <strong>SkynetLabs</strong> — a one-person studio that builds
                  AI and automation systems for businesses that have stopped
                  tolerating busywork.
                </p>
                <div className="about-comment">
                  /* Started in 2019. Not pivoting. Not raising. Just shipping.
                  */
                </div>
                <p>
                  The work covers the full stack: <strong>n8n pipelines</strong>
                  , <strong>WhatsApp and voice bots</strong>,{" "}
                  <strong>Next.js products</strong>, and{" "}
                  <strong>AEO systems</strong> that get you cited by the AI
                  tools your customers already use.
                </p>
                <p>
                  180+ builds shipped across 40+ clients in 9 countries. The
                  pattern is consistent: define the bottleneck, build the fix,
                  deploy, move on.
                </p>
                <div className="about-comment">
                  /* Remote-first since before it was a personality trait. */
                </div>
                <p>
                  Currently operating from <strong>Bali and Lahore</strong>,
                  depending on which timezone makes the call work.
                </p>
                <div className="loc-tags">
                  {["🌴 Bali", "🏙️ Lahore", "🌍 Remote since 2019"].map((l) => (
                    <span className="loc-tag" key={l}>
                      {l}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: 24 }}>
                  <img
                    src={`/img/pro/${PHOTOS[4]}`}
                    alt="Waseem working at cafe with olive jacket"
                    style={{
                      width: "100%",
                      borderRadius: 4,
                      objectFit: "cover",
                      aspectRatio: "16/7",
                      border: "1px solid #3E4452",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo strip */}
        <section
          aria-label="Behind the work"
          style={{
            overflow: "hidden",
            background: "#181A1F",
            display: "flex",
            gap: 2,
          }}
        >
          {[PHOTOS[1], PHOTOS[11], PHOTOS[4]].map((ph, i) => (
            <div key={i} style={{ flex: 1, overflow: "hidden" }}>
              <img
                src={`/img/pro/${ph}`}
                alt={`Waseem — working remotely, scene ${i + 1}`}
                style={{
                  width: "100%",
                  display: "block",
                  aspectRatio: "3/2",
                  objectFit: "cover",
                  opacity: 0.7,
                }}
              />
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="cta-section" aria-labelledby="cta-heading">
          <div className="cta-pre">
            // ready to ship something that actually runs?
          </div>
          <h2 className="cta-headline" id="cta-heading">
            bookCall<span style={{ color: "#61AFEF" }}>()</span>
          </h2>
          <p className="cta-sub">
            {`// 30 minutes · no pitch deck · just your automation gap`}
          </p>
          <a href={CTA} className="cta-btn" rel="noopener noreferrer">
            Book a 30-min call
          </a>
          <div style={{ marginTop: 24 }}>
            <a
              href={GITHUB}
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: "#5C6370",
              }}
            >
              github.com/waseemnasir2k26 →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-left">
            <span style={{ color: "#5C6370" }}>// </span>
            <span style={{ color: "#61AFEF" }}>waseem-nasir</span>
            <span style={{ color: "#5C6370" }}>
              {" "}
              · SkynetLabs · 2019–{new Date().getFullYear()}
            </span>
          </div>
          <div className="footer-links">
            <a href={CTA} className="footer-link">
              book call
            </a>
            <a
              href={GITHUB}
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              github
            </a>
            <Link href="/" className="footer-link">
              ← back
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
