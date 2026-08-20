/* ============================================================
   GRAPH — the single hand-authored source of truth for SIGNALGRID.
   One static graph (nodes = buildings, edges = light-bridges)
   drives BOTH the three.js wireframe geometry (SceneObjects.ts)
   AND the inline SVG facade fragments (FacadeFragment.tsx) — the
   "twin-source silhouettes" addition. No build script: both
   consumers import this module and derive their output at module
   evaluation / render time, so 2D and 3D can never drift.

   Edge topology is honest: lanes between towers mirror the real
   integrations (WhatsApp -> n8n -> GHL, etc.) so hovering the grid
   teaches the actual architecture, not a decorative diagram.
   Deterministic mulberry32(1337) is used ONLY for the decorative
   filler skyline (never for a named service/client/stack tower).
   ============================================================ */

export type NodeKind = "stack" | "service" | "client" | "leak" | "filler";

export type GraphNode = {
  id: string;
  kind: NodeKind;
  /** world position — x across, z along the flight path (negative = deeper) */
  x: number;
  z: number;
  /** footprint */
  w: number;
  d: number;
  /** wireframe height */
  h: number;
  /** scroll progress (0..1) at which a STACK tower ignites gridHair -> jadeBright; -1 = never (already at rest brightness) */
  powerOnAt: number;
  /** dashed silhouette (dental demo — spec-demo truth made visual) */
  dashed?: boolean;
  /** silhouette shape hint consumed by the SVG facade generator */
  shape?: "slab" | "twin" | "ziggurat" | "cylinder" | "tower" | "block";
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  lane: number;
  speed: number;
  dutyCycle: number;
  /** carries the honesty chip in HTML (real client traffic, not filler) */
  honest?: boolean;
  /** The Leak — pulses die mid-bridge, dimmed jade, no amber */
  broken?: boolean;
};

/* ---- STACK district (5 landmark towers, GRID band 16-32%) ---- */
export const STACK_NODES: GraphNode[] = [
  {
    id: "n8n",
    kind: "stack",
    x: 0,
    z: -6,
    w: 1.1,
    d: 1.1,
    h: 5.6,
    powerOnAt: 0.22,
    shape: "tower",
  },
  {
    id: "whatsapp",
    kind: "stack",
    x: -3.2,
    z: -4.6,
    w: 0.9,
    d: 0.9,
    h: 3.4,
    powerOnAt: 0.17,
    shape: "block",
  },
  {
    id: "wordpress",
    kind: "stack",
    x: 3.2,
    z: -4.6,
    w: 0.9,
    d: 0.9,
    h: 3.8,
    powerOnAt: 0.19,
    shape: "block",
  },
  {
    id: "ghl",
    kind: "stack",
    x: -2.0,
    z: -8.2,
    w: 0.9,
    d: 0.9,
    h: 4.4,
    powerOnAt: 0.26,
    shape: "block",
  },
  {
    id: "ai",
    kind: "stack",
    x: 2.0,
    z: -8.2,
    w: 0.9,
    d: 0.9,
    h: 4.0,
    powerOnAt: 0.29,
    shape: "tower",
  },
];

/* ---- SITE A service towers (TOWER FLYBYS band 32-50%) ---- */
export const SERVICE_NODES: GraphNode[] = [
  {
    id: "exchange",
    kind: "service",
    x: -2.6,
    z: -12.5,
    w: 2.4,
    d: 1.0,
    h: 2.6,
    powerOnAt: -1,
    shape: "slab",
  },
  {
    id: "gatehouse",
    kind: "service",
    x: 2.6,
    z: -15.2,
    w: 1.7,
    d: 0.9,
    h: 3.8,
    powerOnAt: -1,
    shape: "twin",
  },
  {
    id: "relayyard",
    kind: "service",
    x: -2.4,
    z: -18.0,
    w: 1.3,
    d: 1.3,
    h: 3.2,
    powerOnAt: -1,
    shape: "ziggurat",
  },
  {
    id: "speaker",
    kind: "service",
    x: 2.2,
    z: -20.6,
    w: 0.9,
    d: 0.9,
    h: 4.6,
    powerOnAt: -1,
    shape: "cylinder",
  },
];

/* ---- WORKS BOULEVARD (client towers, 64-82% band) — dental dashed ---- */
export const CLIENT_NODES: GraphNode[] = [
  {
    id: "idea-viaggi",
    kind: "client",
    x: -2.8,
    z: -24.5,
    w: 1.2,
    d: 1.2,
    h: 3.4,
    powerOnAt: -1,
    shape: "twin",
  },
  {
    id: "insurance",
    kind: "client",
    x: 2.8,
    z: -26.8,
    w: 1.2,
    d: 1.2,
    h: 3.0,
    powerOnAt: -1,
    shape: "block",
  },
  {
    id: "christelle",
    kind: "client",
    x: -2.6,
    z: -29.2,
    w: 1.1,
    d: 1.1,
    h: 3.8,
    powerOnAt: -1,
    shape: "tower",
  },
  {
    id: "dental",
    kind: "client",
    x: 2.6,
    z: -31.4,
    w: 1.1,
    d: 1.1,
    h: 2.8,
    powerOnAt: -1,
    dashed: true,
    shape: "block",
  },
];

/* ---- The Leak — decorative dead-end node the broken lane dies into ---- */
export const LEAK_NODE: GraphNode = {
  id: "the-leak",
  kind: "leak",
  x: -5.4,
  z: -13.6,
  w: 0.6,
  d: 0.6,
  h: 1.1,
  powerOnAt: -1,
  shape: "block",
};

/* ---- UPLINK tower — the tallest tower, dock band 82-100% ---- */
export const UPLINK_NODE: GraphNode = {
  id: "uplink",
  kind: "stack",
  x: 0,
  z: -37,
  w: 1.4,
  d: 1.4,
  h: 8.5,
  powerOnAt: -1,
  shape: "tower",
};

export const NAMED_NODES: GraphNode[] = [
  ...STACK_NODES,
  ...SERVICE_NODES,
  ...CLIENT_NODES,
  LEAK_NODE,
  UPLINK_NODE,
];

/* ---- Deterministic filler skyline — background density only, never
   hit-testable, never carries a service label. mulberry32(1337). ---- */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const FILLER_NODES: GraphNode[] = (() => {
  const rand = mulberry32(1337);
  const out: GraphNode[] = [];
  for (let zi = 0; zi <= 13; zi++) {
    const z = 3 - zi * 3.1;
    for (let xi = -3; xi <= 3; xi++) {
      const x = xi * 2.7 + (rand() - 0.5) * 0.6;
      if (Math.abs(x) < 1.2) continue; // keep the flight corridor clear
      // skip cells too close to a named tower so filler never overlaps it
      const tooClose = NAMED_NODES.some(
        (n) => Math.abs(n.x - x) < 1.6 && Math.abs(n.z - z) < 1.6,
      );
      if (tooClose) continue;
      const h = 0.8 + rand() * 2.6;
      out.push({
        id: `filler-${zi}-${xi}`,
        kind: "filler",
        x,
        z,
        w: 1.1 + rand() * 0.5,
        d: 1.1 + rand() * 0.5,
        h,
        powerOnAt: -1,
        shape: "block",
      });
    }
  }
  return out;
})();

export const ALL_NODES: GraphNode[] = [...NAMED_NODES, ...FILLER_NODES];

/* ---- Edges — honest integration topology ---- */
export const EDGES: GraphEdge[] = [
  {
    id: "e1",
    from: "whatsapp",
    to: "n8n",
    lane: 0,
    speed: 0.42,
    dutyCycle: 0.85,
  },
  { id: "e2", from: "n8n", to: "ghl", lane: 1, speed: 0.5, dutyCycle: 0.9 },
  {
    id: "e3",
    from: "n8n",
    to: "wordpress",
    lane: 2,
    speed: 0.3,
    dutyCycle: 0.6,
  },
  { id: "e4", from: "n8n", to: "ai", lane: 3, speed: 0.46, dutyCycle: 0.8 },
  { id: "e5", from: "ai", to: "ghl", lane: 4, speed: 0.38, dutyCycle: 0.55 },
  {
    id: "e6",
    from: "exchange",
    to: "n8n",
    lane: 5,
    speed: 0.55,
    dutyCycle: 0.95,
  },
  {
    id: "e7",
    from: "n8n",
    to: "exchange",
    lane: 6,
    speed: 0.55,
    dutyCycle: 0.7,
  },
  {
    id: "e8",
    from: "gatehouse",
    to: "wordpress",
    lane: 7,
    speed: 0.28,
    dutyCycle: 0.5,
  },
  {
    id: "e9",
    from: "relayyard",
    to: "ghl",
    lane: 8,
    speed: 0.34,
    dutyCycle: 0.6,
  },
  {
    id: "e10",
    from: "speaker",
    to: "ghl",
    lane: 9,
    speed: 0.32,
    dutyCycle: 0.5,
  },
  {
    id: "e11",
    from: "ai",
    to: "speaker",
    lane: 10,
    speed: 0.4,
    dutyCycle: 0.45,
  },
  {
    id: "e12",
    from: "n8n",
    to: "christelle",
    lane: 11,
    speed: 0.5,
    dutyCycle: 1,
    honest: true,
  },
  {
    id: "e13",
    from: "n8n",
    to: "insurance",
    lane: 12,
    speed: 0.36,
    dutyCycle: 0.8,
    honest: true,
  },
  {
    id: "e14",
    from: "n8n",
    to: "dental",
    lane: 13,
    speed: 0.26,
    dutyCycle: 0.4,
    honest: true,
  },
  {
    id: "e15",
    from: "n8n",
    to: "idea-viaggi",
    lane: 14,
    speed: 0.3,
    dutyCycle: 0.55,
    honest: true,
  },
  {
    id: "e16",
    from: "ghl",
    to: "uplink",
    lane: 15,
    speed: 0.5,
    dutyCycle: 0.9,
  },
  {
    id: "e17",
    from: "ai",
    to: "uplink",
    lane: 16,
    speed: 0.44,
    dutyCycle: 0.8,
  },
  {
    id: "e18",
    from: "n8n",
    to: "uplink",
    lane: 17,
    speed: 0.5,
    dutyCycle: 0.95,
  },
  // The Leak — dies mid-bridge, dimmed jade only, no red/amber.
  {
    id: "leak",
    from: "exchange",
    to: "the-leak",
    lane: 18,
    speed: 0.5,
    dutyCycle: 1,
    broken: true,
  },
];

export function nodeById(id: string): GraphNode | undefined {
  return ALL_NODES.find((n) => n.id === id);
}

/** Stable numeric id per node (used as the shader-side building index for
    hit-testing / uFocusBuilding comparisons). Filler buildings sit outside
    this range and are never focusable. */
export const NAMED_NODE_INDEX: Record<string, number> = Object.fromEntries(
  NAMED_NODES.map((n, i) => [n.id, i]),
);
