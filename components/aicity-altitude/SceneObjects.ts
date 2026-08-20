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

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uFade: { value: 1 },
      uColor: { value: new THREE.Color(C.paper) },
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
        float alpha = smoothstep(0.32, 0.78, n) * uFade;
        gl_FragColor = vec4(uColor, alpha * 0.88);
      }
    `,
  });
  t.materials.push(mat);

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 8.9, 3.5);
  const group = new THREE.Group();
  group.add(mesh);

  return {
    group,
    update: (_dt, elapsed, progress) => {
      mat.uniforms.uTime.value = elapsed;
      // Fully visible above 2%, punches through and is gone by ~19%.
      const fade = THREE.MathUtils.clamp(1 - (progress - 0.02) / 0.17, 0, 1);
      mat.uniforms.uFade.value = fade;
      mesh.visible = fade > 0.005;
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
const DISTRICT_THRESHOLDS = [0.16, 0.34, 0.52, 0.68] as const;
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

export function buildDescentDistricts(mats: Mats): SceneObject {
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
  towers.forEach((r, i) => {
    dummy.position.set(r.x, towerBaseScaleY(r) / 2, r.z);
    dummy.scale.set(1.1, towerBaseScaleY(r), 1.1);
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

  return {
    group,
    update: (_dt, elapsed, progress) => {
      let anyDirty = false;
      let anyTowerDirty = false;
      DISTRICT_THRESHOLDS.forEach((threshold, di) => {
        if (!activated[di] && progress >= threshold) {
          activated[di] = true;
          wakeStart[di] = elapsed;
        }
        if (!activated[di]) return;
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
