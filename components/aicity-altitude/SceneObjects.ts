import * as THREE from "three";
import { C, DISTRICTS } from "./tokens";

/* ============================================================
   SCENE OBJECTS — plain three.js builders (no r3f,
   forbidden in this repo — see components/skyline/SceneObjects.ts
   header). Sibling of that file: same {group, update, dispose}
   builder-pattern contract, same instancing discipline, different
   world — a vertical descent corridor instead of a flyover.

   Engineering-scoped simplification vs the concept brief's "shader
   uWakeFront compare, zero matrix churn": district windows and
   tower scale-Y are activated by ordinary InstancedMesh matrix
   writes, but ONLY for the ~150 instances belonging to the district
   that just crossed its threshold, and ONLY for a short 500ms
   power-on animation after the crossing (then writes stop
   entirely). This keeps steady-state per-frame cost at "zero
   matrix writes" (matching the budget's spirit) while avoiding a
   bespoke instanced-attribute shader as the one novel, highest-risk
   surface in a preview build. Bridges (below) DO use a real custom
   ShaderMaterial — that surface is small (<=24 instances, 2
   uniforms) and worth the authenticity.
   ============================================================ */

export type SceneObject = {
  group: THREE.Object3D;
  /** progress = scrollYProgress.get(), clamped 0..1 */
  update: (dt: number, elapsed: number, progress: number) => void;
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

/** Deterministic PRNG (mulberry32) — reproducible district layout instead
    of Math.random(), so the city looks the same on every load and bridge
    endpoints never drift between hydration passes. */
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

/* Shared materials — created once per Scene instance (not module-level
   singletons) so dispose() on unmount never double-frees a material a
   still-mounted second Canvas instance is using. */
function makeMaterials() {
  const building = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    metalness: 0.25,
    roughness: 0.75,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.05,
  });
  const window_ = new THREE.MeshStandardMaterial({
    color: C.jadeBright,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 1.6,
    roughness: 0.4,
    metalness: 0,
    toneMapped: true,
  });
  const beacon = new THREE.MeshStandardMaterial({
    color: C.jadeBright,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 0.55,
    metalness: 0.1,
    roughness: 0.45,
  });
  const ground = new THREE.MeshStandardMaterial({
    color: C.ground,
    metalness: 0.15,
    roughness: 0.55,
  });
  return { building, window_, beacon, ground };
}

type Mats = ReturnType<typeof makeMaterials>;

/* ============================================================
   CLOUD DECK — one plane, one custom ShaderMaterial (fbm-lite
   value noise, 4 octaves), horizontal above the corridor. Camera
   punches through it during the 8-16% band. uFade is written once
   per frame from scroll progress (JS scalar, no allocation); the
   plane is hidden entirely once fully faded to skip the fragment
   cost for the remaining ~84% of the descent.
   ============================================================ */
export function buildClouds(): SceneObject {
  const t = trackDisposables();
  const geo = new THREE.PlaneGeometry(26, 26, 1, 1);
  t.geometries.push(geo);

  // Depth fix (08-20 screenshot audit): a single flat plane with
  // opacity-only alpha reads as a "washed grey smear" — no sense of a
  // deck you're falling through. Two changes give it real depth: (1)
  // the fragment shader now mixes toward a darker, desaturated
  // "shadowed" tone in the low-noise valleys (uColorDeep) instead of a
  // flat uColor everywhere, so the deck has visible volume/undulation
  // instead of a uniform grey wash; (2) three co-planar layers at
  // different heights/scales/opacities (near/mid/far) reused from the
  // SAME geometry+material via distinct Mesh instances (zero extra
  // shader compiles) stack a soft parallax gradient as the camera
  // falls through, instead of one paper-thin sheet.
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uFade: { value: 1 },
      uColor: { value: new THREE.Color(C.paper) },
      uColorDeep: { value: new THREE.Color("#5E7A78") },
      uLayerAlpha: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uFade;
      uniform vec3 uColor;
      uniform vec3 uColorDeep;
      uniform float uLayerAlpha;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          v += amp * noise(p);
          p *= 2.02;
          amp *= 0.55;
        }
        return v;
      }
      void main() {
        vec2 uv = vUv * 3.0 + vec2(uTime * 0.02, uTime * 0.008);
        float n = fbm(uv);
        // Radial falloff toward the plane's own edges reads as a cloud
        // deck thinning at its horizon rather than a hard-edged card.
        float edge = 1.0 - smoothstep(0.32, 0.5, distance(vUv, vec2(0.5)));
        float alpha = smoothstep(0.3, 0.8, n) * uFade * uLayerAlpha * edge;
        vec3 col = mix(uColorDeep, uColor, smoothstep(0.15, 0.95, n));
        gl_FragColor = vec4(col, alpha * 0.88);
      }
    `,
  });
  t.materials.push(mat);

  const group = new THREE.Group();
  // near/mid/far layers: closer to camera = brighter + larger; farther =
  // dimmer + smaller, sitting slightly lower — a cheap parallax stack
  // instead of one flat sheet.
  const layers = [
    { y: 9.4, z: 5.2, scale: 1.15, alpha: 1.0 },
    { y: 8.9, z: 3.2, scale: 1.0, alpha: 0.7 },
    { y: 8.3, z: 1.0, scale: 0.82, alpha: 0.45 },
  ];
  const meshes = layers.map((l) => {
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, l.y, l.z);
    m.scale.setScalar(l.scale);
    group.add(m);
    return m;
  });

  return {
    group,
    update: (_dt, elapsed, progress) => {
      mat.uniforms.uTime.value = elapsed;
      // Fully visible above 2%, punches through and is gone by ~19%.
      const fade = THREE.MathUtils.clamp(1 - (progress - 0.02) / 0.17, 0, 1);
      mat.uniforms.uFade.value = fade;
      const visible = fade > 0.005;
      // Per-layer alpha is baked at build time (see `layers` above); the
      // shared material only carries the shared uFade/uTime — draw each
      // layer's own alpha via its own material instance would triple the
      // shader compiles, so instead each mesh gets a tiny per-draw alpha
      // multiplier by toggling uLayerAlpha immediately before its draw
      // call (three.js renders meshes sharing a material sequentially,
      // uniform writes between draws are honoured).
      meshes.forEach((m, i) => {
        m.visible = visible;
        m.onBeforeRender = () => {
          mat.uniforms.uLayerAlpha.value = layers[i].alpha;
        };
      });
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   DESCENT DISTRICTS — the four service districts you fall past.
   ONE InstancedMesh for every tower across all four districts, ONE
   for every window — matching skyline's citywide-instancing
   pattern. Each district "wakes" (tower scale-Y 0.85->1.0, its
   windows power on bottom-to-top) the moment scroll progress
   crosses that district's altitude-band threshold; the wave is a
   real per-frame matrix update but only for ~500ms right after the
   crossing, only for that district's own instances. Building
   heights below are explicitly decorative — never tied to any
   metric shown on a placard (same honesty rule as skyline).
   ============================================================ */

// Progress thresholds = the start of each district's altitude band,
// taken straight from the approved scroll choreography (16/34/52/68%).
export const DISTRICT_THRESHOLDS = [0.16, 0.34, 0.52, 0.68] as const;
const WAKE_DURATION = 0.5; // seconds

type TowerRec = {
  x: number;
  z: number;
  h: number;
  districtIndex: number;
};
type WindowRec = {
  x: number;
  y: number;
  z: number;
  row: number;
  rows: number;
  districtIndex: number;
};

/** Where a district's name-plate hangs, in world space. Index = district. */
export type LandmarkAnchor = { x: number; y: number; z: number };

export function buildDescentDistricts(
  mats: Mats,
): SceneObject & { landmarkAnchors: LandmarkAnchor[] } {
  const t = trackDisposables();
  const group = new THREE.Group();
  const rand = mulberry32(2400);

  // Z centre + spread per district, walking down the corridor in lockstep
  // with the camera waypoints in CameraPath.ts.
  const districtZ = [-1.8, -6.2, -10.4, -14.6];
  const towerXs = [-3.2, -1.6, 1.6, 3.2, -2.4, 2.4];

  const towers: TowerRec[] = [];
  DISTRICTS.forEach((_d, di) => {
    const count = 5 + (di % 2); // 5 or 6 towers per district
    for (let i = 0; i < count; i++) {
      const x = towerXs[i % towerXs.length] + (rand() - 0.5) * 0.4;
      const z = districtZ[di] + (rand() - 0.5) * 1.6;
      const h = 1.8 + rand() * 2.6 + (di === 0 ? 1.4 : 0); // Signal Heights tallest
      towers.push({ x, z, h, districtIndex: di });
    }
  });

  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  t.geometries.push(boxGeo);
  const towerMesh = new THREE.InstancedMesh(
    boxGeo,
    mats.building,
    towers.length,
  );
  const dummy = new THREE.Object3D();
  const towerBaseScaleY = (r: TowerRec) => r.h * 0.85; // dark, pre-wake massing
  // Fix (08-20 screenshot audit): towers used to be written at full
  // pre-wake massing height from the very first frame, so Signal
  // Heights' towers (closest district, z=-1.8) sat there from progress
  // 0 — visible in the SKY hero beat with no ground/horizon nearby to
  // anchor them, reading as a disconnected floating panel. Every tower
  // now starts fully collapsed (matches the windows' zero-scale init
  // below) and only rises into its dark pre-wake massing during a short
  // lead-in window right before its district's threshold (see
  // `appearLead` in update()), then continues into the existing
  // elapsed-based wake animation once that threshold is crossed.
  towers.forEach((r, i) => {
    dummy.position.set(r.x, 0, r.z);
    dummy.scale.set(1.1, 0.0001, 1.1);
    dummy.updateMatrix();
    towerMesh.setMatrixAt(i, dummy.matrix);
  });
  towerMesh.instanceMatrix.needsUpdate = true;
  group.add(towerMesh);

  // Windows — small grid per tower, some skipped ("dark") for texture.
  const winGeo = new THREE.BoxGeometry(0.15, 0.2, 0.05);
  t.geometries.push(winGeo);
  const windows: WindowRec[] = [];
  const rowsMax = 5;
  towers.forEach((r) => {
    const rows = Math.max(2, Math.min(rowsMax, Math.floor(r.h / 0.6)));
    const halfW = 1.1 / 2;
    for (const faceSign of [1, -1]) {
      for (let row = 0; row < rows; row++) {
        for (let c = 0; c < 2; c++) {
          if (rand() < 0.2) continue;
          const xOff = -halfW * 0.55 + c * halfW * 1.1;
          windows.push({
            x: r.x + xOff,
            y: 0.45 + row * 0.6,
            z: r.z + faceSign * (halfW * 0.85 + 0.03),
            row,
            rows,
            districtIndex: r.districtIndex,
          });
        }
      }
    }
  });
  const windowMesh = new THREE.InstancedMesh(
    winGeo,
    mats.window_,
    windows.length,
  );
  const wDummy = new THREE.Object3D();
  const zeroDummy = new THREE.Object3D();
  zeroDummy.scale.setScalar(0);
  zeroDummy.updateMatrix();
  windows.forEach((_w, i) => {
    // Everything starts collapsed (unlit) — buildDescentDistricts wakes
    // each district's windows in on threshold crossing.
    windowMesh.setMatrixAt(i, zeroDummy.matrix);
  });
  windowMesh.instanceMatrix.needsUpdate = true;
  group.add(windowMesh);

  const activated = [false, false, false, false];
  const wakeStart = [0, 0, 0, 0];
  // How far (in scroll-progress units) before a district's threshold its
  // towers start rising from fully collapsed to their dark pre-wake
  // massing — keeps every district invisible until it's actually about
  // to be relevant, instead of visible for the whole preceding descent.
  const APPEAR_LEAD = 0.06;
  const appearSettled = [false, false, false, false];

  const writeWindow = (i: number, w: WindowRec, on: boolean) => {
    if (on) {
      wDummy.position.set(w.x, w.y, w.z);
      wDummy.scale.setScalar(1);
    } else {
      wDummy.position.set(w.x, w.y, w.z);
      wDummy.scale.setScalar(0);
    }
    wDummy.updateMatrix();
    windowMesh.setMatrixAt(i, wDummy.matrix);
  };

  const writeTower = (i: number, r: TowerRec, wakeT: number) => {
    const scaleY = THREE.MathUtils.lerp(towerBaseScaleY(r), r.h, wakeT);
    dummy.position.set(r.x, scaleY / 2, r.z);
    dummy.scale.set(1.1, scaleY, 1.1);
    dummy.updateMatrix();
    towerMesh.setMatrixAt(i, dummy.matrix);
  };

  // Each district's name-plate hangs off its TALLEST tower — the one
  // that reads as the district's landmark from the descent corridor.
  // Derived from the same seeded `towers` array the geometry uses, so
  // the plate can never end up over a building that isn't there.
  const landmarkAnchors: LandmarkAnchor[] = DISTRICTS.map((_d, di) => {
    // Tall AND near the corridor centre. Height alone picks the outer
    // towers (x = +/-3.2), which sit at the screen edge on a camera that
    // falls straight down the middle — the sign then flies off-frame.
    // Penalising |x| keeps the plate inside the descent view.
    const score = (r: TowerRec) => r.h - Math.abs(r.x) * 0.8;
    let best: TowerRec | null = null;
    for (const r of towers) {
      if (r.districtIndex !== di) continue;
      if (!best || score(r) > score(best)) best = r;
    }
    const r = best ?? { x: 0, z: districtZ[di] ?? 0, h: 3, districtIndex: di };
    // +0.5 clears the roofline; the tower's final (woken) height is r.h.
    return { x: r.x, y: r.h + 0.5, z: r.z };
  });

  return {
    group,
    landmarkAnchors,
    update: (_dt, elapsed, progress) => {
      let anyDirty = false;
      let anyTowerDirty = false;
      DISTRICT_THRESHOLDS.forEach((threshold, di) => {
        if (!activated[di] && progress >= threshold) {
          activated[di] = true;
          wakeStart[di] = elapsed;
        }
        if (!activated[di]) {
          // Pre-wake lead-in: rise from fully collapsed to dark massing
          // only inside the short window right before this district's
          // threshold — stays invisible (and cheap: no writes at all)
          // for the rest of the descent above it.
          const appearStart = threshold - APPEAR_LEAD;
          if (progress < appearStart) return;
          if (appearSettled[di]) return; // already at full pre-wake massing, no threshold crossing yet
          const preT = THREE.MathUtils.clamp(
            (progress - appearStart) / APPEAR_LEAD,
            0,
            1,
          );
          towers.forEach((r, i) => {
            if (r.districtIndex !== di) return;
            const scaleY = Math.max(0.0001, towerBaseScaleY(r) * preT);
            dummy.position.set(r.x, scaleY / 2, r.z);
            dummy.scale.set(1.1, scaleY, 1.1);
            dummy.updateMatrix();
            towerMesh.setMatrixAt(i, dummy.matrix);
            anyTowerDirty = true;
          });
          if (preT >= 1) appearSettled[di] = true;
          return;
        }
        const t01 = THREE.MathUtils.clamp(
          (elapsed - wakeStart[di]) / WAKE_DURATION,
          0,
          1,
        );
        if (t01 >= 1 && wakeStart[di] < 0) return; // already settled, skip

        // Tower scale-Y ease for this district only.
        towers.forEach((r, i) => {
          if (r.districtIndex !== di) return;
          writeTower(i, r, t01);
          anyTowerDirty = true;
        });

        // Windows: bottom-to-top reveal keyed off row / rows vs t01.
        windows.forEach((w, i) => {
          if (w.districtIndex !== di) return;
          const rowFrac = w.rows <= 1 ? 0 : w.row / (w.rows - 1);
          writeWindow(i, w, t01 >= rowFrac);
          anyDirty = true;
        });

        if (t01 >= 1) wakeStart[di] = -1; // mark settled, stop future writes
      });
      if (anyDirty) windowMesh.instanceMatrix.needsUpdate = true;
      if (anyTowerDirty) towerMesh.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   INTERCONNECTION — light-bridges. ONE InstancedMesh of thin beams
   strung between adjacent districts, ONE custom ShaderMaterial: a
   moving gaussian "packet" of full-brightness jadeBright travels
   each beam, phase staggered per instance so a pulse visibly leaves
   the district you just read and arrives at the one you're falling
   toward. Base glow stays on at all times (rgba jadeBright 0.10) so
   the shape reads even before any packet reaches it.
   ============================================================ */
export function buildBridges(): SceneObject {
  const t = trackDisposables();
  const rand = mulberry32(77);

  // Beam endpoints: one bridge chain linking each district centre to the
  // next, matching the canonical relay described in the concept (intake
  // -> n8n -> GHL -> storefront/portal), ~4-6 beams, well under the <=24
  // instance budget.
  const centres: [number, number, number][] = [
    [0, 3.2, -1.8],
    [0, 2.4, -6.2],
    [0, 1.7, -10.4],
    [0, 1.1, -14.6],
  ];
  const beams: { from: THREE.Vector3; to: THREE.Vector3; phase: number }[] = [];
  for (let i = 0; i < centres.length - 1; i++) {
    beams.push({
      from: new THREE.Vector3(...centres[i]),
      to: new THREE.Vector3(...centres[i + 1]),
      phase: rand(),
    });
  }

  const geo = new THREE.BoxGeometry(1, 1, 1);
  t.geometries.push(geo);

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uBase: { value: new THREE.Color(C.jadeBright) },
    },
    vertexShader: /* glsl */ `
      // instanceMatrix is auto-declared by three.js (USE_INSTANCING prefix)
      // for any material on an InstancedMesh — declaring it again here
      // would be a duplicate-attribute compile error.
      attribute float aPhase;
      // BoxGeometry's per-face UV isn't consistent across a thin beam's
      // six faces (u/v swap depending on face normal), so the "position
      // along the beam" varying is derived from local-space position.z
      // instead (box spans z in [-0.5, 0.5] before the instance scale) —
      // consistent on every face, cheap, no extra attribute needed.
      varying float vLenFrac;
      varying float vPhase;
      void main() {
        vLenFrac = position.z + 0.5;
        vPhase = aPhase;
        vec4 world = instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vLenFrac;
      varying float vPhase;
      uniform float uTime;
      uniform vec3 uBase;
      void main() {
        float packet = fract(uTime * 0.28 - vPhase);
        float d = abs(vLenFrac - packet);
        float glow = smoothstep(0.16, 0.0, d);
        float alpha = 0.10 + glow * 0.85;
        gl_FragColor = vec4(uBase, alpha);
      }
    `,
  });
  t.materials.push(mat);

  const mesh = new THREE.InstancedMesh(geo, mat, beams.length);
  const phases = new Float32Array(beams.length);
  const dummy = new THREE.Object3D();
  beams.forEach((b, i) => {
    const mid = b.from.clone().add(b.to).multiplyScalar(0.5);
    const len = b.from.distanceTo(b.to);
    dummy.position.copy(mid);
    dummy.lookAt(b.to);
    dummy.scale.set(0.05, 0.05, len);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    phases[i] = b.phase;
  });
  mesh.instanceMatrix.needsUpdate = true;
  geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));

  const group = new THREE.Group();
  group.add(mesh);

  return {
    group,
    update: (_dt, elapsed) => {
      mat.uniforms.uTime.value = elapsed;
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   STREET + TOUCHDOWN DOOR — final landing beat. A ground plane
   (planar-gradient fake for "wet reflective street," no real
   reflections) and a lit doorway the dock CTA sits behind
   thematically. Reuses skyline's proven torus-knot beacon motif.
   ============================================================ */
export function buildTouchdown(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, 0, -18);

  const groundGeo = new THREE.PlaneGeometry(30, 20);
  const doorGeo = new THREE.BoxGeometry(1.4, 2.4, 0.15);
  const beaconGeo = new THREE.TorusKnotGeometry(0.4, 0.12, 90, 12);
  t.geometries.push(groundGeo, doorGeo, beaconGeo);

  const ground = new THREE.Mesh(groundGeo, mats.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, 2);
  group.add(ground);

  const door = new THREE.Mesh(doorGeo, mats.beacon);
  door.position.set(0, 1.2, 0);
  group.add(door);

  const beacon = new THREE.Mesh(beaconGeo, mats.beacon);
  beacon.position.set(0, 1.2, 0.2);
  group.add(beacon);

  return {
    group,
    update: (dt, _elapsed, progress) => {
      beacon.rotation.y += dt * 0.06;
      // Door beacon breathes brighter as touchdown approaches (>=84%).
      const near = THREE.MathUtils.clamp((progress - 0.84) / 0.16, 0, 1);
      (mats.beacon as THREE.MeshStandardMaterial).emissiveIntensity =
        0.55 + near * 0.5;
    },
    dispose: t.dispose,
  };
}

export { makeMaterials };
