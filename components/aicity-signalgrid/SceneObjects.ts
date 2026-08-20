import * as THREE from "three";
import { C } from "./tokens";
import {
  ALL_NODES,
  EDGES,
  NAMED_NODE_INDEX,
  nodeById,
  type GraphNode,
} from "./graph";

/* ============================================================
   SCENE OBJECTS — plain three.js builders (no r3f,
   see components/skyline/SceneObjects.ts header for why). Nothing
   here moves per-frame on the CPU: buildings and bridges are
   STATIC geometry built once; all animation (pulses, ignition,
   window flicker, focus isolation) runs entirely in GLSL off
   uTime / uProgress / uFocusBuilding, written once per rAF tick
   by SignalGridCanvas. Target = 5 rendered draw calls:
     1. building wireframes   (LineSegments, one buffer, all towers)
     2. bridge underlay       (Mesh ribbon — the "wide" glow stroke)
     3. bridge core           (LineSegments — the "thin" crisp stroke)
     4. window-flicker        (Points)
     5. ground grid           (LineSegments, static, unlit)
   ============================================================ */

export type SceneObject = {
  group: THREE.Object3D;
  update: (dt: number, elapsed: number) => void;
  dispose: () => void;
};

function trackDisposables() {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  return {
    geometries,
    materials,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}

function rgbaToVec4(str: string): [number, number, number, number] {
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return [1, 1, 1, 1];
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  return [parts[0] / 255, parts[1] / 255, parts[2] / 255, parts[3] ?? 1];
}

/* ============================================================
   MATERIALS — created once per Scene instance (not module-level
   singletons) so dispose() on unmount is always safe.
   ============================================================ */
export function makeMaterials() {
  const gridHair = rgbaToVec4(C.gridHair);
  const signalDim = rgbaToVec4(C.signalDim);
  const jadeBright = new THREE.Color(C.jadeBright);
  const signalHot = new THREE.Color(C.signalHot);
  const jade = new THREE.Color(C.jade);

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uFocusBuilding: { value: -1 },
    uDensity: { value: 1 },
    uGridHair: {
      value: new THREE.Color(gridHair[0], gridHair[1], gridHair[2]),
    },
    uJadeBright: { value: jadeBright },
    uSignalHot: { value: signalHot },
    uSignalDim: {
      value: new THREE.Color(signalDim[0], signalDim[1], signalDim[2]),
    },
    uJade: { value: jade },
  };

  const buildingMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aPowerOnAt;
      attribute float aNamed;
      varying float vPowerOnAt;
      varying float vNamed;
      void main() {
        vPowerOnAt = aPowerOnAt;
        vNamed = aNamed;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uProgress;
      uniform vec3 uGridHair;
      uniform vec3 uJadeBright;
      varying float vPowerOnAt;
      varying float vNamed;
      void main() {
        float ignite = vPowerOnAt < 0.0 ? 0.0 : smoothstep(vPowerOnAt - 0.03, vPowerOnAt + 0.02, uProgress);
        vec3 col = mix(uGridHair, uJadeBright, ignite);
        float alpha = mix(0.28, 0.85, vNamed) * mix(0.62, 1.0, vNamed) + ignite * 0.35;
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `,
  });

  const bridgePulseChunk = /* glsl */ `
    uniform float uTime;
    uniform float uFocusBuilding;
    uniform float uDensity;
    uniform vec3 uSignalDim;
    uniform vec3 uSignalHot;
    uniform vec3 uJade;
    varying float vPathT;
    varying float vSpeed;
    varying float vPhase;
    varying float vA;
    varying float vB;
    varying float vBroken;

    vec4 pulseColor(float baseAlpha, float widePass) {
      float laneT = fract(uTime * vSpeed + vPhase);
      float d = vPathT - laneT;
      d = d - floor(d + 0.5);
      float pw = widePass > 0.5 ? 0.09 : 0.045;
      float pulse = smoothstep(pw, 0.0, abs(d)) * uDensity;

      float deathFade = 1.0;
      if (vBroken > 0.5) {
        deathFade = 1.0 - smoothstep(0.4, 0.55, vPathT);
        pulse *= deathFade;
      }

      vec3 hot = vBroken > 0.5 ? uJade * 0.9 : uSignalHot;
      vec3 col = mix(uSignalDim, hot, pulse);

      bool touches = (abs(vA - uFocusBuilding) < 0.5) || (abs(vB - uFocusBuilding) < 0.5);
      float focus = uFocusBuilding < -0.5 ? 1.0 : (touches ? 1.0 : 0.12);

      float alpha = (baseAlpha + pulse * 0.9) * focus;
      return vec4(col * alpha, alpha);
    }
  `;

  const bridgeVertexShader = /* glsl */ `
    attribute float aPathT;
    attribute float aSpeed;
    attribute float aPhase;
    attribute float aA;
    attribute float aB;
    attribute float aBroken;
    varying float vPathT;
    varying float vSpeed;
    varying float vPhase;
    varying float vA;
    varying float vB;
    varying float vBroken;
    void main() {
      vPathT = aPathT;
      vSpeed = aSpeed;
      vPhase = aPhase;
      vA = aA;
      vB = aB;
      vBroken = aBroken;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const bridgeCoreMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: bridgeVertexShader,
    fragmentShader: `${bridgePulseChunk}
      void main() { gl_FragColor = pulseColor(0.55, 0.0); }
    `,
  });

  const bridgeUnderlayMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: bridgeVertexShader,
    fragmentShader: `${bridgePulseChunk}
      void main() { gl_FragColor = pulseColor(0.08, 1.0); }
    `,
  });

  const windowMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSpeed;
      attribute float aPhase;
      uniform float uTime;
      varying float vFlicker;
      void main() {
        vFlicker = smoothstep(0.55, 1.0, 0.5 + 0.5 * sin(uTime * aSpeed + aPhase));
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 2.4;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uJadeBright;
      varying float vFlicker;
      void main() {
        float a = vFlicker * 0.8;
        gl_FragColor = vec4(uJadeBright * a, a);
      }
    `,
  });

  const groundMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(C.jade),
    transparent: true,
    opacity: 0.14,
  });

  return {
    uniforms,
    buildingMat,
    bridgeCoreMat,
    bridgeUnderlayMat,
    windowMat,
    groundMat,
  };
}

export type Mats = ReturnType<typeof makeMaterials>;

/* ============================================================
   BUILDINGS — one LineSegments buffer for every wireframe box in
   the city (STACK + SERVICE + CLIENT + LEAK + UPLINK + filler).
   Dashed silhouettes (dental) are real dashed geometry — every
   other dash segment is simply omitted at build time, no shader
   dashing needed.
   ============================================================ */
function boxEdges(node: GraphNode): [THREE.Vector3, THREE.Vector3][] {
  const hw = node.w / 2;
  const hd = node.d / 2;
  const x = node.x;
  const z = node.z;
  const y0 = 0;
  const y1 = node.h;
  const corners = [
    new THREE.Vector3(x - hw, y0, z - hd),
    new THREE.Vector3(x + hw, y0, z - hd),
    new THREE.Vector3(x + hw, y0, z + hd),
    new THREE.Vector3(x - hw, y0, z + hd),
    new THREE.Vector3(x - hw, y1, z - hd),
    new THREE.Vector3(x + hw, y1, z - hd),
    new THREE.Vector3(x + hw, y1, z + hd),
    new THREE.Vector3(x - hw, y1, z + hd),
  ];
  const idx: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // bottom
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // top
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // verticals
  ];
  const edges: [THREE.Vector3, THREE.Vector3][] = idx.map(([a, b]) => [
    corners[a],
    corners[b],
  ]);
  if (!node.dashed) return edges;

  // Real dashed geometry: subdivide each edge into 6 dashes, keep half.
  const dashed: [THREE.Vector3, THREE.Vector3][] = [];
  edges.forEach(([a, b]) => {
    const dashes = 6;
    for (let i = 0; i < dashes; i += 2) {
      const t0 = i / dashes;
      const t1 = (i + 1) / dashes;
      dashed.push([a.clone().lerp(b, t0), a.clone().lerp(b, t1)]);
    }
  });
  return dashed;
}

export function buildBuildings(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  const positions: number[] = [];
  const powerOnAt: number[] = [];
  const named: number[] = [];

  ALL_NODES.forEach((node) => {
    const isNamed = node.kind !== "filler" ? 1 : 0;
    boxEdges(node).forEach(([a, b]) => {
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      powerOnAt.push(node.powerOnAt, node.powerOnAt);
      named.push(isNamed, isNamed);
    });
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute(
    "aPowerOnAt",
    new THREE.Float32BufferAttribute(powerOnAt, 1),
  );
  geo.setAttribute("aNamed", new THREE.Float32BufferAttribute(named, 1));
  t.geometries.push(geo);

  const lines = new THREE.LineSegments(geo, mats.buildingMat);
  group.add(lines);

  return { group, update: () => {}, dispose: t.dispose };
}

/* ============================================================
   BRIDGES — catenary light-bridges. Two draw calls sharing the
   same per-vertex attribute layout: a wide translucent underlay
   ribbon (real width, built once as static geometry, no per-
   frame recompute) + a thin GL_LINES core. All animation is the
   GPU pulse in the shared shader chunk above.
   ============================================================ */
function topOf(node: GraphNode): THREE.Vector3 {
  return new THREE.Vector3(node.x, node.h, node.z);
}

function catenarySamples(a: THREE.Vector3, b: THREE.Vector3, samples = 16) {
  const dist = a.distanceTo(b);
  const sag = Math.min(0.9, 0.14 * dist);
  const pts: { p: THREE.Vector3; t: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = new THREE.Vector3().lerpVectors(a, b, t);
    p.y -= sag * Math.sin(Math.PI * t);
    pts.push({ p, t });
  }
  return pts;
}

export function buildBridgeCore(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  const positions: number[] = [];
  const aPathT: number[] = [];
  const aSpeed: number[] = [];
  const aPhase: number[] = [];
  const aA: number[] = [];
  const aB: number[] = [];
  const aBroken: number[] = [];

  EDGES.forEach((edge) => {
    const from = nodeById(edge.from);
    const to = nodeById(edge.to);
    if (!from || !to) return;
    const samples = catenarySamples(topOf(from), topOf(to));
    const idA = NAMED_NODE_INDEX[edge.from] ?? -1;
    const idB = NAMED_NODE_INDEX[edge.to] ?? -1;
    const phase = ((edge.lane * 37) % 97) / 97;
    for (let i = 0; i < samples.length - 1; i++) {
      const p0 = samples[i];
      const p1 = samples[i + 1];
      positions.push(p0.p.x, p0.p.y, p0.p.z, p1.p.x, p1.p.y, p1.p.z);
      aPathT.push(p0.t, p1.t);
      aSpeed.push(edge.speed, edge.speed);
      aPhase.push(phase, phase);
      aA.push(idA, idA);
      aB.push(idB, idB);
      aBroken.push(edge.broken ? 1 : 0, edge.broken ? 1 : 0);
    }
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aPathT", new THREE.Float32BufferAttribute(aPathT, 1));
  geo.setAttribute("aSpeed", new THREE.Float32BufferAttribute(aSpeed, 1));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(aPhase, 1));
  geo.setAttribute("aA", new THREE.Float32BufferAttribute(aA, 1));
  geo.setAttribute("aB", new THREE.Float32BufferAttribute(aB, 1));
  geo.setAttribute("aBroken", new THREE.Float32BufferAttribute(aBroken, 1));
  t.geometries.push(geo);

  const lines = new THREE.LineSegments(geo, mats.bridgeCoreMat);
  group.add(lines);

  return { group, update: () => {}, dispose: t.dispose };
}

export function buildBridgeUnderlay(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const width = 0.075;

  const positions: number[] = [];
  const aPathT: number[] = [];
  const aSpeed: number[] = [];
  const aPhase: number[] = [];
  const aA: number[] = [];
  const aB: number[] = [];
  const aBroken: number[] = [];
  const indices: number[] = [];
  let vi = 0;

  EDGES.forEach((edge) => {
    const from = nodeById(edge.from);
    const to = nodeById(edge.to);
    if (!from || !to) return;
    const samples = catenarySamples(topOf(from), topOf(to));
    const idA = NAMED_NODE_INDEX[edge.from] ?? -1;
    const idB = NAMED_NODE_INDEX[edge.to] ?? -1;
    const phase = ((edge.lane * 37) % 97) / 97;

    const leftRight: [THREE.Vector3, THREE.Vector3][] = samples.map((s, i) => {
      const next = samples[Math.min(i + 1, samples.length - 1)].p;
      const prev = samples[Math.max(i - 1, 0)].p;
      const tangent = next.clone().sub(prev);
      tangent.y = 0;
      if (tangent.lengthSq() < 1e-6) tangent.set(1, 0, 0);
      tangent.normalize();
      const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(
        width,
      );
      return [s.p.clone().add(perp), s.p.clone().sub(perp)];
    });

    leftRight.forEach(([l, r], i) => {
      positions.push(l.x, l.y, l.z, r.x, r.y, r.z);
      const tv = samples[i].t;
      aPathT.push(tv, tv);
      aSpeed.push(edge.speed, edge.speed);
      aPhase.push(phase, phase);
      aA.push(idA, idA);
      aB.push(idB, idB);
      aBroken.push(edge.broken ? 1 : 0, edge.broken ? 1 : 0);
    });

    for (let i = 0; i < leftRight.length - 1; i++) {
      const base = vi + i * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
    vi += leftRight.length * 2;
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aPathT", new THREE.Float32BufferAttribute(aPathT, 1));
  geo.setAttribute("aSpeed", new THREE.Float32BufferAttribute(aSpeed, 1));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(aPhase, 1));
  geo.setAttribute("aA", new THREE.Float32BufferAttribute(aA, 1));
  geo.setAttribute("aB", new THREE.Float32BufferAttribute(aB, 1));
  geo.setAttribute("aBroken", new THREE.Float32BufferAttribute(aBroken, 1));
  geo.setIndex(indices);
  t.geometries.push(geo);

  const mesh = new THREE.Mesh(geo, mats.bridgeUnderlayMat);
  group.add(mesh);

  return { group, update: () => {}, dispose: t.dispose };
}

/* ============================================================
   WINDOW FLICKER — sparse Points on named + filler building tops,
   reads as terminals receiving packets. One draw call.
   ============================================================ */
export function buildWindowFlicker(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  const positions: number[] = [];
  const speeds: number[] = [];
  const phases: number[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  ALL_NODES.forEach((node) => {
    const rows = Math.max(1, Math.min(5, Math.floor(node.h / 0.9)));
    for (let r = 0; r < rows; r++) {
      if (rnd() < 0.35) continue;
      const y = 0.4 + r * 0.8;
      const side = rnd() < 0.5 ? 1 : -1;
      positions.push(
        node.x + (rnd() - 0.5) * node.w * 0.7,
        y,
        node.z + side * (node.d / 2 + 0.02),
      );
      speeds.push(0.6 + rnd() * 1.8);
      phases.push(rnd() * Math.PI * 2);
    }
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aSpeed", new THREE.Float32BufferAttribute(speeds, 1));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  t.geometries.push(geo);

  const points = new THREE.Points(geo, mats.windowMat);
  group.add(points);

  return { group, update: () => {}, dispose: t.dispose };
}

/* ============================================================
   GROUND GRID — faint static street-level grid, unlit, no shader.
   ============================================================ */
export function buildGroundGrid(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  const positions: number[] = [];
  const zMin = -40;
  const zMax = 4;
  const xMin = -9;
  const xMax = 9;
  for (let x = xMin; x <= xMax; x += 1.35) {
    positions.push(x, 0, zMin, x, 0, zMax);
  }
  for (let z = zMin; z <= zMax; z += 1.6) {
    positions.push(xMin, 0, z, xMax, 0, z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  t.geometries.push(geo);

  const lines = new THREE.LineSegments(geo, mats.groundMat);
  group.add(lines);

  return { group, update: () => {}, dispose: t.dispose };
}
