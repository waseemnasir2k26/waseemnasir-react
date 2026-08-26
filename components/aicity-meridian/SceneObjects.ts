import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { createFacadeMaps, createRoofscape } from "../aicity-core/Facade";
import { C, DUSK, WARM, DISTRICT, WORK } from "./tokens";

/* ============================================================
   MERIDIAN SCENE OBJECTS — plain three.js builders (no
   r3f — forbidden in this repo, see
   components/skyline/SkylineCanvas.tsx header). Sibling of
   components/skyline/SceneObjects.ts, rebuilt around ONE master
   scalar `uDayness` (0 = golden hour, 1 = midnight) that drives:
     - sun elevation/color (JS, this file's updateSun)
     - sky background + fog color (JS Color lerp, MeridianCanvas)
     - every window / streetlamp / landmark ignition (GLSL, this
       file's window shader — a per-instance `aThreshold` attribute
       compared against `uDayness` in the FRAGMENT shader; zero
       per-frame JS loop over individual windows)
     - light-bridge packet visibility (JS scalar gate)
   Every builder returns a THREE.Group + update(dt, elapsed, dayness)
   + dispose(); MeridianCanvas.tsx owns the render loop + disposal.
   ============================================================ */

export type SceneObject = {
  group: THREE.Object3D;
  update: (dt: number, elapsed: number, dayness: number) => void;
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

/** Deterministic PRNG (mulberry32) — reproducible city layout, no Math.random. */
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

/* ============================================================
   WINDOW / IGNITION SHADER — one ShaderMaterial reused across every
   instanced "lights that turn on" mesh (city windows, streetlamps,
   stack towers, work billboards). Each instance carries a single
   `aThreshold` float (0..1, the point on the 0->1 uDayness ramp at
   which it ignites); the fragment shader does a smoothstep compare
   against the single uDayness uniform. No per-instance JS work at
   render time — only one uniform write per frame for the whole mesh.
   ============================================================ */
/* Optional near-camera fade + brightness cap: used by the stack-district
   landmark towers (round-2 fix, 08-20 re-audit) so a camera beat that
   passes close to a tower never renders it as a blown-out, near-clipped
   full-viewport slab — the tower fades toward transparent as the camera
   gets within `fadeEnd` units and is fully gone by `fadeStart` units,
   and its lit color is capped below pure uBright so it never reads as a
   flat, oversaturated fill even at full ignition. */
function makeIgnitionMaterial(
  dimHex: string,
  brightHex: string,
  opts?: {
    nearFade?: { fadeStart: number; fadeEnd: number };
    brightCap?: number;
  },
) {
  const uDim = new THREE.Color(dimHex);
  const uBright = new THREE.Color(brightHex);
  const nearFade = opts?.nearFade;
  const brightCap = opts?.brightCap ?? 1;
  return new THREE.ShaderMaterial({
    transparent: !!nearFade,
    uniforms: {
      uDayness: { value: 0 },
      uDim: { value: uDim },
      uBright: { value: uBright },
      uBrightCap: { value: brightCap },
      uFadeStart: { value: nearFade?.fadeStart ?? 0 },
      uFadeEnd: { value: nearFade?.fadeEnd ?? 0 },
    },
    vertexShader: /* glsl */ `
      attribute float aThreshold;
      varying float vLit;
      varying float vCamDist;
      uniform float uDayness;
      void main() {
        vLit = smoothstep(aThreshold - 0.05, aThreshold + 0.05, uDayness);
        vec3 transformed = position;
        #ifdef USE_INSTANCING
          transformed = (instanceMatrix * vec4(transformed, 1.0)).xyz;
        #endif
        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
        vCamDist = distance(worldPos.xyz, cameraPosition);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDim;
      uniform vec3 uBright;
      uniform float uBrightCap;
      uniform float uFadeStart;
      uniform float uFadeEnd;
      varying float vLit;
      varying float vCamDist;
      void main() {
        vec3 col = mix(uDim, uBright * uBrightCap, vLit);
        float fade = 1.0;
        if (uFadeEnd > uFadeStart) {
          fade = smoothstep(uFadeStart, uFadeEnd, vCamDist);
        }
        gl_FragColor = vec4(col, fade);
      }
    `,
  });
}

/** Shared across every building surface — built once, disposed with the grid. */
let facade: ReturnType<typeof createFacadeMaps> | null = null;

/** Shared ground/plaza treatment — built once, disposed with the facade. */
let asphalt: {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose(): void;
} | null = null;

/* Ground plane was one flat MeshStandardMaterial colour — reads as
   felt from any distance, let alone up close. This draws a cheap
   speckle-grain + expansion-joint plaza surface into a canvas at
   runtime (no assets), same no-network rule as Facade.ts. Kept
   deliberately low-contrast: texture the eye feels, not a pattern
   it consciously reads. */
function createAsphaltTexture(baseColor: string) {
  const size = 256;
  const albedo = document.createElement("canvas");
  albedo.width = albedo.height = size;
  const a = albedo.getContext("2d")!;
  const rough = document.createElement("canvas");
  rough.width = rough.height = size;
  const r = rough.getContext("2d")!;

  a.fillStyle = baseColor;
  a.fillRect(0, 0, size, size);
  r.fillStyle = "#9c9c9c";
  r.fillRect(0, 0, size, size);

  const rand = mulberry32(5150);
  // Fine speckle grain — the cheapest way to stop a flat plate from
  // reading as felt at any distance.
  for (let i = 0; i < 3200; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const s = 0.6 + rand() * 1.4;
    const dark = rand() < 0.5;
    a.fillStyle = dark
      ? `rgba(0,0,0,${(0.05 + rand() * 0.08).toFixed(3)})`
      : `rgba(255,255,255,${(0.03 + rand() * 0.05).toFixed(3)})`;
    a.fillRect(x, y, s, s);
    r.fillStyle = `rgba(255,255,255,${(0.05 + rand() * 0.12).toFixed(3)})`;
    r.fillRect(x, y, s, s);
  }

  // Sparse expansion-joint lines — a plaza is poured in slabs, never
  // one seamless sheet. Kept faint: this is texture, not a grid overlay.
  a.strokeStyle = "rgba(0,0,0,0.14)";
  a.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = Math.round((i + 0.5) * (size / 5));
    a.beginPath();
    a.moveTo(0, y);
    a.lineTo(size, y);
    a.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const x = Math.round((i + 0.5) * (size / 4));
    a.beginPath();
    a.moveTo(x, 0);
    a.lineTo(x, size);
    a.stroke();
  }

  // Soft centre-out darkening so the plate recedes at its own edges
  // instead of reading as one flat, evenly lit rectangle.
  const grad = a.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.1,
    size / 2,
    size / 2,
    size * 0.7,
  );
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.12)");
  a.fillStyle = grad;
  a.fillRect(0, 0, size, size);

  const map = new THREE.CanvasTexture(albedo);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;

  const roughnessMap = new THREE.CanvasTexture(rough);
  // NOT sRGB — data, not colour, same rule as Facade.ts.
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = 4;

  return {
    map,
    roughnessMap,
    dispose() {
      map.dispose();
      roughnessMap.dispose();
    },
  };
}

function makeMaterials() {
  // Drawn at runtime into a canvas: floor slabs, mullions, per-bay
  // glass variation and rain grime. One flat colour across a few
  // hundred instanced slabs is what made these read as a demo; no
  // amount of tone mapping on top of a flat surface fixes that.
  facade = createFacadeMaps({
    base: C.inkJade,
    seam: C.jade,
    floors: 11,
    bays: 5,
  });
  facade.map.repeat.set(1, 1.6);
  facade.roughnessMap.repeat.set(1, 1.6);

  // Metalness dropped from 0.25 — at that level the warm sky-probe
  // specular reflected straight off every facade regardless of the
  // dark teal albedo underneath, which is what read as "muddy brown
  // slabs": a warm glaze sitting on top of the ink, not a rim on it.
  // Lower metalness keeps the facade reading as cool ink with the sun
  // only catching the bevelled edges (08-27 grade pass).
  const building = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    map: facade.map,
    roughnessMap: facade.roughnessMap,
    metalness: 0.12,
    roughness: 0.8,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.03,
  });
  // Ordinary inhabited-city lighting (windows, streetlamps) ignites
  // warm, not jade — jade is reserved for the SkynetLabs "systems"
  // signal (stack towers, plaza beacons, light-bridges). Two
  // intentional colour families instead of one teal note bleeding
  // into everything (08-27 grade pass).
  const window_ = makeIgnitionMaterial(C.inkJade, WARM.windowBright);
  const lamp = makeIgnitionMaterial("#0A2622", WARM.lampBright);
  // Landmark towers get near-camera fade + a brightness cap (round-2 fix,
  // 08-20 re-audit): the only ignition surfaces large/tall enough for a
  // close camera pass to read as a blown-out full-viewport slab.
  const landmark = makeIgnitionMaterial(C.inkJade, C.jadeBright, {
    nearFade: { fadeStart: 2.2, fadeEnd: 5 },
    brightCap: 0.82,
  });
  // Near-camera fade + brightness cap — part of the 08-27 "clipped teal
  // blob" fix at the ~45% DUSK->NIGHTFALL camera stop. Panel 0 (see its
  // position below) and plaza tower 1 (buildProofPlaza) sit close
  // enough to each other AND to that in-between Catmull-Rom point (not
  // an authored waypoint) that their glows visually overlap — dimming
  // either ALONE left the other rendering the full shape, which is why
  // both need a stronger fade together. Tight range (5.2-6.5) sits
  // between the ~4.8-unit transit distance (fully faded) and the real
  // NIGHTFALL showcase waypoint (pos [0.7,6.2,-12.5], ~5.7 units from
  // this panel) — a compromise: the showcase read is dimmer than
  // before, but the mid-flight blowout is gone.
  const billboard = makeIgnitionMaterial(C.inkJade, C.jadeBright, {
    nearFade: { fadeStart: 5.2, fadeEnd: 6.5 },
    brightCap: 0.8,
  });
  asphalt = createAsphaltTexture(C.ground);
  asphalt.map.repeat.set(10, 16);
  asphalt.roughnessMap.repeat.set(10, 16);
  const ground = new THREE.MeshStandardMaterial({
    color: C.ground,
    map: asphalt.map,
    roughnessMap: asphalt.roughnessMap,
    metalness: 0.06,
    roughness: 0.96,
  });
  const beacon = new THREE.MeshStandardMaterial({
    color: C.jadeBright,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 0.55,
    metalness: 0.1,
    roughness: 0.45,
  });
  // Proof-plaza beacon towers get the SAME near-camera fade + brightness
  // cap as the landmark towers (round-2 fix, 08-20), widened further as
  // part of the 08-27 "clipped teal blob" fix. Debugging note, since
  // this took several wrong turns: raycasting the offending screen
  // pixel at the ~45% DUSK->NIGHTFALL stop hit tower 1, and pushing
  // ONLY this material's fade to fully-invisible (fadeStart 100) did
  // NOT remove the visible blob — WORK BOULEVARD panel 0 sits close
  // enough to the same mid-flight point that it alone was rendering the
  // same shape underneath, camouflaging the tower's real contribution.
  // Confirmed by isolating every other scene object one at a time
  // (bloom strength included — a bloomStrength≈0 test ruled that out
  // too). Fixed by widening + repositioning BOTH this tower (see
  // buildProofPlaza position below) AND the billboard together.
  const plazaBeacon = makeIgnitionMaterial(C.inkJade, C.jadeBright, {
    nearFade: { fadeStart: 5.5, fadeEnd: 8.0 },
    brightCap: 0.65,
  });
  // Dock beacon knot — the ACTUAL source of the 08-27 "clipped teal
  // blob" defect (verified by isolating scene objects one at a time,
  // not guessed): the TorusKnotGeometry at full `beacon` brightness
  // (0.55 emissive, uncapped) is bright and detailed enough that
  // UnrealBloomPass smears it into a large soft mask-shaped blob —
  // both when it's still small/far (the ~45% DUSK->NIGHTFALL camera
  // stop, where the knot sits near the top of frame) and when the
  // midnight waypoint finally arrives close to it (where the same
  // over-bloom read as the "black void" screenshot's only visible
  // shape, not a legible beacon). Same jade colour, tamed brightness +
  // smaller radius so it blooms as a beacon, not a blown-out mask.
  const dockBeacon = new THREE.MeshStandardMaterial({
    color: C.jadeBright,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 0.2,
    metalness: 0.1,
    roughness: 0.4,
  });
  const packet = new THREE.MeshBasicMaterial({
    color: C.jadeBright,
    transparent: true,
    opacity: 0,
  });
  const bridge = new THREE.MeshBasicMaterial({
    color: C.jadeBright,
    transparent: true,
    opacity: 0,
  });
  const sun = new THREE.MeshBasicMaterial({
    color: DUSK.duskA,
    transparent: true,
    opacity: 1,
  });
  const lastWindow = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 0,
    roughness: 0.4,
  });
  return {
    building,
    window_,
    lamp,
    landmark,
    billboard,
    ground,
    beacon,
    plazaBeacon,
    dockBeacon,
    packet,
    bridge,
    sun,
    lastWindow,
  };
}

type Mats = ReturnType<typeof makeMaterials>;

function setIgnitionUniform(mat: THREE.ShaderMaterial, dayness: number) {
  mat.uniforms.uDayness.value = dayness;
}

/* ============================================================
   CITY GRID — the flyover corridor, x in [-9,9], z from +4 (behind
   entry) to -32 (past the dock). Two InstancedMeshes: building
   volumes (draw call #1, unlit day silhouettes) + window studs
   (draw call #2, ignition shader). Windows ignite bottom-up per
   building in a staggered wave (per-instance threshold biased by
   floor row) as uDayness rises through the sunset/nightfall bands.
   ============================================================ */
export function buildCityGrid(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const rand = mulberry32(1337);

  type Slot = { x: number; z: number; h: number; base: number };
  const slots: Slot[] = [];
  for (let zi = 0; zi <= 11; zi++) {
    const z = 4 - zi * 3.2;
    for (let xi = -3; xi <= 3; xi++) {
      const x = xi * 2.6 + (rand() - 0.5) * 0.6;
      if (Math.abs(x) < 1.1) continue; // clear flight corridor
      const h = 1.2 + rand() * 3.4;
      // Each building's own ignition window: 0.18-0.62 of the cycle
      // (sunset through nightfall) so the whole city is lit by the
      // time the deep-night interconnection beat begins.
      const base = 0.18 + rand() * 0.44;
      slots.push({ x, z, h, base });
    }
  }

  // A hard 90-degree edge is the tell that a shape came out of a
  // primitive constructor. A small bevel gives every vertical
  // corner a highlight to catch the low sun on, which is what the
  // eye actually uses to judge that a surface is real.
  const boxGeo = new RoundedBoxGeometry(1, 1, 1, 1, 0.04);
  t.geometries.push(boxGeo);
  const buildings = new THREE.InstancedMesh(
    boxGeo,
    mats.building,
    slots.length,
  );
  const dummy = new THREE.Object3D();
  const footprints: {
    x: number;
    z: number;
    h: number;
    w: number;
    d: number;
  }[] = [];
  slots.forEach((s, i) => {
    const w = 1.5 + (i % 3) * 0.15;
    const d = 1.5 + ((i + 1) % 3) * 0.12;
    dummy.position.set(s.x, s.h / 2, s.z);
    dummy.scale.set(w, s.h, d);
    dummy.updateMatrix();
    buildings.setMatrixAt(i, dummy.matrix);
    footprints.push({ x: s.x, z: s.z, h: s.h, w, d });
  });
  buildings.instanceMatrix.needsUpdate = true;
  group.add(buildings);

  // Roofscape: masts and plant housings. A skyline is read as a
  // silhouette against the sky long before any surface detail
  // registers, and a field of boxes all ending on one clean
  // horizontal line is the most artificial thing in the frame.
  // Two draw calls against a budget of about a dozen.
  const roofscape = createRoofscape(footprints, mats.building, rand);
  group.add(roofscape.group);

  const winGeo = new THREE.BoxGeometry(0.16, 0.22, 0.05);
  t.geometries.push(winGeo);
  const rowsMax = 6;
  const colsPerFace = 2;
  const totalWindows = slots.length * rowsMax * colsPerFace * 2;
  const windows = new THREE.InstancedMesh(winGeo, mats.window_, totalWindows);
  const thresholds = new Float32Array(totalWindows);
  let wi = 0;
  const wDummy = new THREE.Object3D();
  slots.forEach((s) => {
    const rows = Math.max(2, Math.min(rowsMax, Math.floor(s.h / 0.65)));
    const halfW = (1.5 + (rand() - 0.5) * 0.1) / 2;
    for (const faceSign of [1, -1]) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < colsPerFace; c++) {
          if (rand() < 0.22) continue; // some windows stay permanently dark
          const y = 0.5 + r * 0.62;
          const xOff = -halfW * 0.55 + c * halfW * 1.1;
          wDummy.position.set(
            s.x + xOff,
            y,
            s.z + faceSign * (halfW * 0.85 + 0.03),
          );
          wDummy.scale.setScalar(1);
          wDummy.updateMatrix();
          windows.setMatrixAt(wi, wDummy.matrix);
          // Bottom-up wave: lower rows ignite first, upper rows lag
          // slightly, all clustered around this building's own `base`.
          const rowLag = (r / rows) * 0.08;
          thresholds[wi] = Math.min(
            0.98,
            s.base + rowLag + (rand() - 0.5) * 0.04,
          );
          wi++;
        }
      }
    }
  });
  const zeroDummy = new THREE.Object3D();
  zeroDummy.scale.setScalar(0);
  zeroDummy.updateMatrix();
  for (let i = wi; i < totalWindows; i++) {
    windows.setMatrixAt(i, zeroDummy.matrix);
    thresholds[i] = 2; // never ignites (scale is already zero anyway)
  }
  windows.instanceMatrix.needsUpdate = true;
  windows.geometry.setAttribute(
    "aThreshold",
    new THREE.InstancedBufferAttribute(thresholds, 1),
  );
  group.add(windows);

  const groundGeo = new THREE.PlaneGeometry(40, 64);
  t.geometries.push(groundGeo);
  const ground = new THREE.Mesh(groundGeo, mats.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, -14);
  group.add(ground);

  // Ground never reads as a flat neon field: it starts at the C.ground
  // dusk teal and folds into C.skyDark by the time DUSK begins (30%),
  // matching the sky/fog ramp so the horizon and the street never seam,
  // and so a close/low camera angle never catches a bright flat plane.
  const groundLit = new THREE.Color(C.ground);
  // Lifted off C.skyDark for the same reason as the canvas night sky —
  // pure-black ground at midnight reads as void, not asphalt.
  const groundNight = new THREE.Color("#0A1B18");
  const groundScratch = new THREE.Color();

  return {
    group,
    update: (_dt, _elapsed, dayness) => {
      setIgnitionUniform(mats.window_, dayness);
      const t01 = THREE.MathUtils.clamp(dayness / 0.3, 0, 1);
      groundScratch.copy(groundLit).lerp(groundNight, t01);
      (mats.ground as THREE.MeshStandardMaterial).color.copy(groundScratch);
    },
    dispose: () => {
      // The roofscape owns two geometries the shared tracker never
      // saw, because they are created inside createRoofscape.
      roofscape.dispose();
      t.dispose();
    },
  };
}

/**
 * Releases the shared facade canvases. Call from the canvas teardown
 * AFTER every scene object has been disposed — the building material
 * references these textures, and the material bag is disposed last.
 * Without this the two CanvasTextures survive every remount, which is
 * invisible until a few route navigations in.
 */
export function disposeFacade() {
  facade?.dispose();
  facade = null;
  asphalt?.dispose();
  asphalt = null;
}

/* ============================================================
   STACK DISTRICT — 5 landmark towers, one per DISTRICT entry
   (Switchboard / Gatehouse / Conveyor / Radio Mast / Projection
   House). Ignite floor-by-floor visually via the shared shader as
   a unit per tower, staggered left-to-right, entirely within the
   14-30% SUNSET band ("stack district wakes").
   ============================================================ */
/* Tower layout is exported so the name-plate layer (aicity-core/
   CityLabels) can hang each DISTRICT name on the exact building it
   belongs to. Single source of truth — geometry and labels read the
   same array, so they can never drift apart. Index matches DISTRICT. */
export const STACK_LAYOUT: { x: number; z: number; h: number }[] = [
  { x: -3.4, z: -2.5, h: 3.2 },
  { x: -1.6, z: -4.2, h: 4.6 },
  { x: 0.6, z: -3.0, h: 3.8 },
  { x: 2.4, z: -5.0, h: 5.2 },
  { x: 3.8, z: -3.4, h: 4.0 },
];

/** Ignition threshold for tower `i` — also when its name-plate appears. */
export const stackThreshold = (i: number) =>
  0.16 + (i / DISTRICT.length) * 0.12;

export function buildStackDistrict(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  t.geometries.push(geo);
  const towers = new THREE.InstancedMesh(geo, mats.landmark, DISTRICT.length);
  const dummy = new THREE.Object3D();
  const thresholds = new Float32Array(DISTRICT.length);
  DISTRICT.forEach((_d, i) => {
    const slot = STACK_LAYOUT[i] ?? { x: 0, z: -4, h: 4 };
    const h = slot.h;
    const x = slot.x;
    const z = slot.z;
    dummy.position.set(x, h / 2, z);
    dummy.scale.set(0.9, h, 0.9);
    dummy.updateMatrix();
    towers.setMatrixAt(i, dummy.matrix);
    thresholds[i] = stackThreshold(i); // staggered across the sunset band
  });
  towers.instanceMatrix.needsUpdate = true;
  towers.geometry.setAttribute(
    "aThreshold",
    new THREE.InstancedBufferAttribute(thresholds, 1),
  );
  group.add(towers);

  return {
    group,
    update: (dt, _elapsed, dayness) => {
      group.rotation.y = Math.sin(performance.now() * 0.00005) * 0.02;
      setIgnitionUniform(mats.landmark, dayness);
      void dt;
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   PROOF PLAZA + STREETLAMPS — 4 illuminated beacon towers (heights
   purely decorative, never tied to the numeric values — those live
   in the HTML CountUp) plus a ring of ~24 emissive streetlamp studs
   that pop on in a radial wave from the plaza centre during DUSK.
   ============================================================ */
export function buildProofPlaza(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.CylinderGeometry(0.5, 0.6, 1, 12);
  t.geometries.push(geo);
  const towers = new THREE.InstancedMesh(geo, mats.plazaBeacon, 4);
  const positions: [number, number][] = [
    [-4.6, -11],
    [-1.6, -13.2],
    [2.2, -11.6],
    [4.4, -13.6],
  ];
  const dummy = new THREE.Object3D();
  // Lit almost immediately (threshold ~0.05, same "always-on beacon"
  // read the plain material gave, just gated through the ignition
  // shader so the near-fade/brightCap below can apply).
  const towerThresholds = new Float32Array(4).fill(0.05);
  positions.forEach(([x, z], i) => {
    const h = 2.4 + i * 0.5;
    dummy.position.set(x, h / 2, z);
    dummy.scale.set(1, h, 1);
    dummy.updateMatrix();
    towers.setMatrixAt(i, dummy.matrix);
  });
  towers.instanceMatrix.needsUpdate = true;
  towers.geometry.setAttribute(
    "aThreshold",
    new THREE.InstancedBufferAttribute(towerThresholds, 1),
  );
  group.add(towers);

  const plazaCenter = new THREE.Vector2(-0.6, -12.3);
  const lampCount = 24;
  const lampGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6);
  t.geometries.push(lampGeo);
  const lamps = new THREE.InstancedMesh(lampGeo, mats.lamp, lampCount);
  const lampThresholds = new Float32Array(lampCount);
  const rand = mulberry32(88);
  const lDummy = new THREE.Object3D();
  let maxDist = 0;
  const lampPos: [number, number][] = [];
  for (let i = 0; i < lampCount; i++) {
    const angle = (i / lampCount) * Math.PI * 2;
    const radius = 3.2 + rand() * 2.2;
    const x = plazaCenter.x + Math.cos(angle) * radius;
    const z = plazaCenter.y + Math.sin(angle) * radius * 0.6;
    lampPos.push([x, z]);
    maxDist = Math.max(maxDist, radius);
  }
  lampPos.forEach(([x, z], i) => {
    lDummy.position.set(x, 0.25, z);
    lDummy.updateMatrix();
    lamps.setMatrixAt(i, lDummy.matrix);
    const dist = Math.hypot(x - plazaCenter.x, (z - plazaCenter.y) / 0.6);
    // Radial wave outward from plaza centre, entirely within DUSK (30-46%).
    lampThresholds[i] = 0.3 + (dist / maxDist) * 0.14;
  });
  lamps.instanceMatrix.needsUpdate = true;
  lamps.geometry.setAttribute(
    "aThreshold",
    new THREE.InstancedBufferAttribute(lampThresholds, 1),
  );
  group.add(lamps);

  return {
    group,
    update: (_dt, elapsed, dayness) => {
      const pulse = 1 + Math.sin(elapsed * 1.2) * 0.03;
      towers.scale.setScalar(pulse);
      setIgnitionUniform(mats.plazaBeacon, dayness);
      setIgnitionUniform(mats.lamp, dayness);
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   WORKS BOULEVARD — 4 billboard panels, one per WORK entry, lit
   one-per-case during the 46-64% NIGHTFALL band via the shared
   ignition shader.
   ============================================================ */
export function buildWorksBoulevard(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  // Shrunk from (2.2, 1.3, 0.1) — modest size trim, part of the 08-27
  // "clipped teal blob" fix (see billboard material comment above).
  const geo = new THREE.BoxGeometry(1.8, 1.05, 0.1);
  t.geometries.push(geo);
  const panels = new THREE.InstancedMesh(geo, mats.billboard, WORK.length);
  const positions: [number, number, number][] = [
    [-2.6, 1.6, -13],
    [2.6, 1.2, -15.4],
    [-2.6, 1.8, -17.2],
    [2.6, 1.3, -19.2],
  ];
  const dummy = new THREE.Object3D();
  const base: THREE.Vector3[] = [];
  const thresholds = new Float32Array(WORK.length);
  WORK.forEach((_w, i) => {
    const [x, y, z] = positions[i] ?? [0, 1.5, -14];
    base.push(new THREE.Vector3(x, y, z));
    dummy.position.set(x, y, z);
    dummy.rotation.y = x < 0 ? 0.35 : -0.35;
    dummy.updateMatrix();
    panels.setMatrixAt(i, dummy.matrix);
    thresholds[i] = 0.46 + (i / WORK.length) * 0.16;
  });
  panels.instanceMatrix.needsUpdate = true;
  panels.geometry.setAttribute(
    "aThreshold",
    new THREE.InstancedBufferAttribute(thresholds, 1),
  );
  group.add(panels);

  return {
    group,
    update: (_dt, elapsed, dayness) => {
      base.forEach((b, i) => {
        dummy.position.set(b.x, b.y + Math.sin(elapsed * 0.5 + i) * 0.08, b.z);
        dummy.rotation.y =
          (b.x < 0 ? 0.35 : -0.35) + Math.sin(elapsed * 0.2 + i) * 0.05;
        dummy.updateMatrix();
        panels.setMatrixAt(i, dummy.matrix);
      });
      panels.instanceMatrix.needsUpdate = true;
      setIgnitionUniform(mats.billboard, dayness);
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   LIGHT-BRIDGES + PACKETS — "the city thinks at night." One static
   tube per bridge (drawn once, near-invisible base opacity) plus one
   shared InstancedMesh of ~36 emissive packet studs advancing along
   precomputed arc lookup tables, pure array math per frame (no
   allocation). Everything gated by smoothstep(0.6,0.75,uDayness) —
   bridges cannot exist before deep night: connections ARE the
   automation, invisible during the manual day.
   ============================================================ */
export function buildInterconnect(
  mats: Mats,
  // Mutable governor ref, set by MeridianCanvas's frame-budget monitor.
  // When packetsReduced flips true, half the packet instances stop
  // advancing and are scaled to 0 (hidden) — a real instance-count
  // reduction, not just a cosmetic dataset flag.
  governor?: { packetsReduced: boolean },
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  // Anchor points: stack district centre -> proof plaza centre ->
  // work boulevard centre -> dock. Mirrors the real flow (lead ->
  // CRM -> ops -> published outcome), matching the building map.
  const anchors: THREE.Vector3[] = [
    new THREE.Vector3(0.6, 3.2, -3.4), // stack district
    new THREE.Vector3(-0.6, 2.0, -12.3), // proof plaza
    new THREE.Vector3(0, 1.6, -16.5), // work boulevard
    new THREE.Vector3(0, 2.2, -25), // dock
  ];

  const arcs: THREE.Vector3[][] = [];
  const SAMPLES = 24;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    const mid = a.clone().lerp(b, 0.5);
    mid.y += 1.6; // arc bows upward — reads as a bridge, not a straight cable
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    arcs.push(curve.getPoints(SAMPLES));
  }

  // Static tube geometry per arc, drawn once at low base opacity.
  const tubeGroup = new THREE.Group();
  arcs.forEach((pts) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.012, 5, false);
    t.geometries.push(tubeGeo);
    const tube = new THREE.Mesh(tubeGeo, mats.bridge);
    tubeGroup.add(tube);
  });
  group.add(tubeGroup);

  // Packets: one InstancedMesh shared across all arcs. Each packet
  // owns an arc index + phase; per frame we advance phase and read
  // the position from that arc's point array (linear-interpolated).
  const PACKETS_PER_ARC = 9;
  const totalPackets = arcs.length * PACKETS_PER_ARC;
  const packetGeo = new THREE.SphereGeometry(0.05, 6, 6);
  t.geometries.push(packetGeo);
  const packets = new THREE.InstancedMesh(packetGeo, mats.packet, totalPackets);
  const dummy = new THREE.Object3D();

  type PacketState = { arc: number; phase: number; speed: number };
  const states: PacketState[] = [];
  const rand = mulberry32(4242);
  for (let a = 0; a < arcs.length; a++) {
    for (let p = 0; p < PACKETS_PER_ARC; p++) {
      states.push({
        arc: a,
        phase: rand(),
        speed: 0.18 + rand() * 0.14,
      });
    }
  }

  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const samplePoint = (arcIdx: number, t01: number, out: THREE.Vector3) => {
    const pts = arcs[arcIdx];
    const f = t01 * (pts.length - 1);
    const i0 = Math.min(pts.length - 2, Math.floor(f));
    const frac = f - i0;
    tmpA.copy(pts[i0]);
    tmpB.copy(pts[i0 + 1]);
    out.copy(tmpA).lerp(tmpB, frac);
  };

  group.add(packets);

  // Tracks which odd-indexed instances have already been zero-scaled so
  // the hide write happens once per reduction, not every frame.
  let culledApplied = false;

  return {
    group,
    update: (dt, _elapsed, dayness) => {
      // smoothstep(0.6, 0.75, dayness) — the narrative gate: below deep
      // night, bridges + packets are fully invisible.
      const x = THREE.MathUtils.clamp((dayness - 0.6) / (0.75 - 0.6), 0, 1);
      const gate = x * x * (3 - 2 * x);
      (mats.bridge as THREE.MeshBasicMaterial).opacity = gate * 0.06;
      (mats.packet as THREE.MeshBasicMaterial).opacity = gate;

      const reduced = governor?.packetsReduced ?? false;

      if (gate > 0.001) {
        let changed = false;
        states.forEach((s, i) => {
          // Governor "packets-reduced" tier: every other packet stops
          // advancing and is hidden (scale 0) — a real halving of the
          // instances actually animated/drawn each frame, not cosmetic.
          if (reduced && i % 2 === 1) {
            if (!culledApplied) {
              dummy.position.set(0, 0, 0);
              dummy.scale.setScalar(0);
              dummy.updateMatrix();
              packets.setMatrixAt(i, dummy.matrix);
              changed = true;
            }
            return;
          }
          s.phase = (s.phase + dt * s.speed) % 1;
          samplePoint(s.arc, s.phase, dummy.position);
          dummy.scale.setScalar(gate);
          dummy.updateMatrix();
          packets.setMatrixAt(i, dummy.matrix);
          changed = true;
        });
        if (reduced) culledApplied = true;
        if (changed) packets.instanceMatrix.needsUpdate = true;
      }
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   SUN / MOON DISC — single emissive sprite whose elevation, color
   and opacity are entirely uDayness-driven. Warm 3200K-ish disc at
   golden hour, sinks below the horizon by ~28% and fades to 0
   opacity (the DUSK desaturated ramp lives in the sky, not here).
   ============================================================ */
export function buildSun(mats: Mats): SceneObject {
  const t = trackDisposables();
  const geo = new THREE.CircleGeometry(0.9, 24);
  t.geometries.push(geo);
  const mesh = new THREE.Mesh(geo, mats.sun);
  mesh.position.set(-4, 5, -6);
  const group = new THREE.Group();
  group.add(mesh);

  const warm = new THREE.Color("#F3D9B8");
  const cool = new THREE.Color(DUSK.duskC);

  return {
    group,
    update: (_dt, elapsed, dayness) => {
      // Elevation arc: high at 0, touches horizon ~0.20, below by 0.30.
      const elev = 1 - THREE.MathUtils.clamp(dayness / 0.28, 0, 1);
      mesh.position.y = 1.2 + elev * 6.5;
      mesh.position.x = -4 + dayness * 2;
      mesh.lookAt(0, mesh.position.y, 4);
      const fade = 1 - THREE.MathUtils.clamp((dayness - 0.14) / 0.16, 0, 1);
      const mat = mats.sun as THREE.MeshBasicMaterial;
      mat.color
        .copy(warm)
        .lerp(cool, THREE.MathUtils.clamp(dayness / 0.3, 0, 1));
      // Slow 4s breathing bloom via scale, not post-processing.
      const breathe = 1 + Math.sin(elapsed * (Math.PI / 2)) * 0.06;
      mesh.scale.setScalar(breathe);
      mat.opacity = Math.max(0, fade);
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   DOCK — final landing pad, waypoint 6, plus the LAST DARK WINDOW
   (approved ADDITION 3): a single office window near the final
   camera position that stays conspicuously unlit through the whole
   night sequence and blinks on at 96% — the last manual task,
   automated, landing right beside the CTA.
   ============================================================ */
export function buildDock(
  mats: Mats,
  // Shared mutable camera-position ref, written by MeridianCanvas every
  // frame BEFORE objects.forEach runs (same "governor" pattern as
  // packetGovernor in buildInterconnect) — lets the beacon fade with
  // distance the way a real light source would, without changing the
  // shared SceneObject.update(dt, elapsed, dayness) signature.
  camRef: { x: number; y: number; z: number },
): {
  scene: SceneObject;
  isLastWindowLit: () => boolean;
} {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, 0, -27);

  // Slow drift lives on this inner group only — the lamp ring + pier
  // beacons added below sit on the outer (non-spinning) `group` so a
  // receding line of pier lights reads as a fixed pier, not something
  // orbiting the dock.
  const spin = new THREE.Group();
  group.add(spin);

  const baseGeo = new THREE.CylinderGeometry(3, 3.3, 0.2, 48);
  // Shrunk from (0.5, 0.15) alongside the dimmer `dockBeacon` material
  // (see makeMaterials) — the fix for the 08-27 "clipped teal blob" /
  // "black void" defect. A smaller, less-bright knot still reads as a
  // beacon under bloom without smearing into a shapeless mask.
  const knotGeo = new THREE.TorusKnotGeometry(0.34, 0.1, 96, 12);
  t.geometries.push(baseGeo, knotGeo);

  const base = new THREE.Mesh(baseGeo, mats.building);
  const beacon = new THREE.Mesh(knotGeo, mats.dockBeacon);
  beacon.position.y = 1.4;
  spin.add(base, beacon);

  const lastWinGeo = new THREE.BoxGeometry(0.3, 0.42, 0.08);
  t.geometries.push(lastWinGeo);
  const lastWindow = new THREE.Mesh(lastWinGeo, mats.lastWindow);
  lastWindow.position.set(1.6, 1.1, 2.4);
  spin.add(lastWindow);

  /* ── 08-27 void fix: the final camera stop now looks AT the dock
     (see CameraPath.ts) instead of past it, but the periphery around
     the card was still reading flat/empty. A ring of always-on dock
     lamps (reuses the shared `lamp` ignition material — cheap, one
     more InstancedMesh, no new shader) plus a short line of receding
     pier beacons (reuses the dimmer `dockBeacon` material, same one
     the dock's own knot now uses after the 08-27 bloom-blowout fix)
     gives the frame something lit on every side of the card instead
     of fogged black ground. ── */
  const lampRingCount = 10;
  const lampRingGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.42, 6);
  t.geometries.push(lampRingGeo);
  const lampRing = new THREE.InstancedMesh(
    lampRingGeo,
    mats.lamp,
    lampRingCount,
  );
  const ringThresholds = new Float32Array(lampRingCount).fill(0.55);
  const ringDummy = new THREE.Object3D();
  for (let i = 0; i < lampRingCount; i++) {
    const angle = (i / lampRingCount) * Math.PI * 2 + 0.3;
    const radius = 3.6;
    ringDummy.position.set(
      Math.cos(angle) * radius,
      0.21,
      Math.sin(angle) * radius,
    );
    ringDummy.updateMatrix();
    lampRing.setMatrixAt(i, ringDummy.matrix);
  }
  lampRing.instanceMatrix.needsUpdate = true;
  lampRing.geometry.setAttribute(
    "aThreshold",
    new THREE.InstancedBufferAttribute(ringThresholds, 1),
  );
  group.add(lampRing);

  const pierGeo = new THREE.CylinderGeometry(0.06, 0.08, 1, 6);
  t.geometries.push(pierGeo);
  const pierSpecs: { x: number; z: number; h: number }[] = [
    { x: 2.5, z: -3, h: 1.9 },
    { x: -2.3, z: -6, h: 1.6 },
    { x: 2.1, z: -9, h: 1.3 },
    { x: -1.8, z: -12, h: 1.05 },
  ];
  const pierBeacons = new THREE.InstancedMesh(
    pierGeo,
    mats.dockBeacon,
    pierSpecs.length,
  );
  const pierDummy = new THREE.Object3D();
  pierSpecs.forEach((s, i) => {
    pierDummy.position.set(s.x, s.h / 2, s.z);
    pierDummy.scale.set(1, s.h, 1);
    pierDummy.updateMatrix();
    pierBeacons.setMatrixAt(i, pierDummy.matrix);
  });
  pierBeacons.instanceMatrix.needsUpdate = true;
  group.add(pierBeacons);

  let lit = false;

  return {
    scene: {
      group,
      update: (dt, _elapsed, dayness) => {
        spin.rotation.y += dt * 0.05;
        setIgnitionUniform(mats.lamp, dayness);
        // Far-distance fade — the OTHER half of the 08-27 "clipped teal
        // blob" fix, confirmed by sampling actual rendered pixel values
        // (not guessed): at the ~45% DUSK->NIGHTFALL camera pass the
        // knot sits 17-25 units away, far past any near-fade range, but
        // `dockBeacon` is a plain MeshStandardMaterial — its emissive
        // brightness never dims with distance the way a real light
        // does, so bloom kept reading it as a bright, shapeless "mask"
        // glimpsed near the top of frame even from that far away.
        // Ramping emissiveIntensity down for distant cameras and back
        // up for the close midnight approach (dist ~10 there) fixes
        // both ends with one control instead of a second shader.
        const dx = camRef.x - 0;
        const dy = camRef.y - 1.4;
        const dz = camRef.z + 27;
        const distToBeacon = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const farFade =
          1 - THREE.MathUtils.clamp((distToBeacon - 11) / (24 - 11), 0, 1);
        (mats.dockBeacon as THREE.MeshStandardMaterial).emissiveIntensity =
          0.3 * farFade;
        const mat = mats.lastWindow as THREE.MeshStandardMaterial;
        if (dayness >= 0.96 && !lit) {
          lit = true;
        }
        // Smooth blink-on over a short window right at the 96% mark
        // rather than a hard cut, so it reads as a deliberate beat.
        const target = dayness >= 0.96 ? 1.4 : 0;
        mat.emissiveIntensity +=
          (target - mat.emissiveIntensity) * Math.min(1, dt * 6);
      },
      dispose: t.dispose,
    },
    isLastWindowLit: () => lit,
  };
}

export { makeMaterials, DUSK as DUSK_RAMP };
