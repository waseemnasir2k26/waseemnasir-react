import * as THREE from "three";
import { C, STACK, WORK, PROOF } from "./tokens";
import { buildRailCurve } from "./CameraPath";

/* ============================================================
   SCENE OBJECTS — plain three.js builders (no @react-three/fiber).
   Same reason as components/orbit/SceneObjects.ts: react-reconciler
   0.27 (what @react-three/fiber@8 ships, the only line compatible
   with this repo's React 18.3.1) can't read the secret-internals
   shape this Next.js build's client bundle exposes, and fiber@9
   needs React 19 as a real dependency — out of scope to bump.
   Plain three.js is the version-appropriate equivalent here.

   Each builder returns a THREE.Group plus an update(dt, elapsed)
   tick; TimelineCanvas.tsx owns the render loop and disposal.
   Gates + docked emblems + monuments are each ONE InstancedMesh
   (one draw call per group) to keep total draw calls low:
   rail(1) + gates(1) + stack(1) + monuments(1) + platform(3) +
   arrow(2) = 9 draw calls, well under the 100-call budget.
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

/* Shared materials — created once per Scene instance (not module-level
   singletons) so dispose() on unmount is safe and never double-frees
   a material a still-mounted second Canvas instance is using. */
function makeMaterials() {
  const rail = new THREE.MeshStandardMaterial({
    color: C.jade,
    metalness: 0.1,
    roughness: 0.2,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.85,
  });
  // Ink-jade, but transmissive (glass-like) rather than opaque — the gates
  // sit close to the camera at each scene boundary and an opaque material
  // there would black out the HTML overlay text sitting on top of the
  // canvas. Transmission keeps the structural silhouette without hiding
  // copy behind it (same legibility trick as orbit's glass entry core).
  const gate = new THREE.MeshPhysicalMaterial({
    color: C.inkJade,
    transmission: 0.7,
    roughness: 0.3,
    thickness: 0.3,
    ior: 1.1,
    emissive: new THREE.Color(C.inkJade),
    emissiveIntensity: 0.12,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: C.paper,
    transmission: 0.85,
    roughness: 0.18,
    thickness: 0.6,
    ior: 1.15,
    clearcoat: 0.6,
  });
  const jade = new THREE.MeshStandardMaterial({
    color: C.jade,
    metalness: 0.15,
    roughness: 0.25,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.12,
  });
  const ink = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    metalness: 0.2,
    roughness: 0.35,
  });
  return { rail, gate, glass, jade, ink };
}

/* ── THE RAIL — one emissive tube along the full journey. This is
   the "luminous jade spine" the whole route travels beside. ── */
export function buildRailSpine(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const curve = buildRailCurve();
  const geo = new THREE.TubeGeometry(curve, 128, 0.05, 10, false);
  t.geometries.push(geo);
  const mesh = new THREE.Mesh(geo, mats.rail);
  const group = new THREE.Group();
  group.add(mesh);

  return {
    group,
    update: (_dt, elapsed) => {
      // Gentle pulse — the spine "breathes" so it reads as alive/energised,
      // not a static prop.
      mats.rail.emissiveIntensity = 0.7 + Math.sin(elapsed * 1.1) * 0.15;
    },
    dispose: t.dispose,
  };
}

/* ── STRUCTURAL GATES — ink-jade rings the rail passes through at
   each scene boundary. Instanced: one draw call for all five. ── */
// Kept well clear of each waypoint's camera z (5-6 unit gap, not the ~2-3
// unit gap tried earlier) and biased to the right (positive x) so the
// gates read as structural silhouettes beside the copy column, the way
// orbit keeps its decorative geometry right-of-text — never dead-center
// over the HTML overlay's headline.
const GATE_Z = [3, -6, -16, -26, -34];
const GATE_X = [2.4, 2.6, 2.8, 2.2, 0];
export function buildGates(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.TorusGeometry(1.2, 0.05, 12, 40);
  t.geometries.push(geo);
  const instanced = new THREE.InstancedMesh(geo, mats.gate, GATE_Z.length);
  group.add(instanced);

  const dummy = new THREE.Object3D();
  GATE_Z.forEach((z, i) => {
    // No rotation: TorusGeometry's hole axis is Z by default, so as the
    // camera flies down -Z it sees each gate face-on as a hoop with an
    // open, legible center — never an edge-on solid bar blocking the
    // HTML overlay text sitting on top of it.
    dummy.position.set(GATE_X[i] ?? 0, 0.3, z);
    dummy.updateMatrix();
    instanced.setMatrixAt(i, dummy.matrix);
  });
  instanced.instanceMatrix.needsUpdate = true;

  return {
    group,
    update: (_dt, elapsed) => {
      mats.gate.emissiveIntensity = 0.1 + Math.sin(elapsed * 0.8) * 0.05;
    },
    dispose: t.dispose,
  };
}

/* ── STACK DOCKS — 5 capability emblems docked onto the rail
   (STACK tokens, no years). Instanced: one draw call. ── */
export function buildStackDocks(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.OctahedronGeometry(0.34, 0);
  t.geometries.push(geo);
  const instanced = new THREE.InstancedMesh(geo, mats.jade, STACK.length);
  group.add(instanced);

  const basePositions = STACK.map(
    (_, i) =>
      new THREE.Vector3(
        i % 2 === 0 ? 1.3 : -1.1,
        0.6 + (i % 3) * 0.15,
        1 - i * 2.2,
      ),
  );
  const dummy = new THREE.Object3D();

  return {
    group,
    update: (_dt, elapsed) => {
      basePositions.forEach((base, i) => {
        dummy.position.set(
          base.x,
          base.y + Math.sin(elapsed * 0.9 + i) * 0.12,
          base.z,
        );
        dummy.rotation.y = elapsed * 0.5 + i;
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      });
      instanced.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

/* ── MILESTONE MONUMENTS — real work panels beside the rail,
   undated. Instanced: one draw call. ── */
export function buildMonuments(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(1.4, 1.7, 0.1);
  t.geometries.push(geo);
  const instanced = new THREE.InstancedMesh(geo, mats.glass, WORK.length);
  group.add(instanced);

  const basePositions: [number, number, number][] = [
    [-2.1, 0.5, -9.5],
    [1.8, -0.2, -12],
    [-1.6, -0.6, -14.6],
    [1.9, 0.3, -17.2],
  ];
  const dummy = new THREE.Object3D();

  return {
    group,
    update: (_dt, elapsed) => {
      basePositions.forEach((base, i) => {
        dummy.position.set(
          base[0],
          base[1] + Math.sin(elapsed * 0.6 + i) * 0.14,
          base[2],
        );
        dummy.rotation.y = Math.sin(elapsed * 0.2 + i) * 0.18;
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      });
      instanced.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

/* ── THE PRESENT PLATFORM — where the rail widens into a dock
   carrying the 4 locked counters (180+ / 40+ / 9 / 2019), "so far". ── */
export function buildPlatform(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, -0.3, -24);

  const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.2, 48);
  const pylonGeo = new THREE.CylinderGeometry(0.14, 0.14, 1, 12);
  const knotGeo = new THREE.TorusKnotGeometry(0.5, 0.15, 96, 12);
  t.geometries.push(baseGeo, pylonGeo, knotGeo);

  const base = new THREE.Mesh(baseGeo, mats.ink);
  base.rotation.x = -Math.PI / 2;
  group.add(base);

  // One pylon per PROOF counter — a physical stand-in for "180+ / 40+ / 9 / 2019"
  const pylons = new THREE.InstancedMesh(pylonGeo, mats.jade, PROOF.length);
  group.add(pylons);
  const dummy = new THREE.Object3D();
  PROOF.forEach((_, i) => {
    const angle = (i / PROOF.length) * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * 1.5, 0.5, Math.sin(angle) * 1.5);
    dummy.updateMatrix();
    pylons.setMatrixAt(i, dummy.matrix);
  });
  pylons.instanceMatrix.needsUpdate = true;

  const knot = new THREE.Mesh(knotGeo, mats.jade);
  knot.position.y = 1.1;
  group.add(knot);

  return {
    group,
    update: (dt) => {
      group.rotation.y += dt * 0.04;
    },
    dispose: t.dispose,
  };
}

/* ── THE ARROW — the rail keeps going, into the light, toward the
   final CTA. A simple cone + expanding halo pointed further along -z. ── */
export function buildArrow(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, 1, -34);

  const coneGeo = new THREE.ConeGeometry(0.5, 1.4, 24);
  const haloGeo = new THREE.RingGeometry(1.1, 1.3, 48);
  t.geometries.push(coneGeo, haloGeo);

  const cone = new THREE.Mesh(coneGeo, mats.rail);
  cone.rotation.x = -Math.PI / 2;
  group.add(cone);

  const halo = new THREE.Mesh(haloGeo, mats.jade);
  halo.position.z = -1;
  group.add(halo);

  return {
    group,
    update: (dt, elapsed) => {
      halo.scale.setScalar(1 + Math.sin(elapsed * 1.6) * 0.08);
      group.position.z = -34 - Math.sin(elapsed * 0.3) * 0.3;
      void dt;
    },
    dispose: t.dispose,
  };
}

export { makeMaterials };
