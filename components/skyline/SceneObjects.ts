import * as THREE from "three";
import { C, STACK, PROOF, WORK } from "./tokens";

/* ============================================================
   SCENE OBJECTS — plain three.js builders (no @react-three/fiber).
   Sibling of components/orbit/SceneObjects.ts — same reason for
   plain three.js (see that file's header: react-reconciler/React 19
   mismatch under this repo's React 18.3.1). Instancing is mandatory
   here (mission: city = 1-3 draw calls, <=120 total) since this
   world is a full city grid, not a handful of orbiting emblems.

   Each builder returns a THREE.Group plus an update(dt, elapsed)
   tick function; SkylineCanvas.tsx owns the render loop and disposal.
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

/** Deterministic PRNG (mulberry32) — reproducible city layout instead of
    Math.random(), purely so the skyline looks the same on every load. */
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
   singletons) so dispose() on unmount is safe and never double-frees
   a material a still-mounted second Canvas instance is using. */
function makeMaterials() {
  const building = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    metalness: 0.25,
    roughness: 0.75,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.03,
  });
  const window_ = new THREE.MeshStandardMaterial({
    color: C.jadeBright,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 1.6,
    roughness: 0.4,
    metalness: 0,
    toneMapped: true,
  });
  const landmark = new THREE.MeshStandardMaterial({
    color: C.jade,
    metalness: 0.3,
    roughness: 0.3,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 0.5,
  });
  const ground = new THREE.MeshStandardMaterial({
    color: C.ground,
    metalness: 0.1,
    roughness: 0.9,
  });
  const beacon = new THREE.MeshStandardMaterial({
    color: C.jadeBright,
    emissive: new THREE.Color(C.jadeBright),
    emissiveIntensity: 0.55,
    metalness: 0.1,
    roughness: 0.45,
  });
  return { building, window_, landmark, ground, beacon };
}

type Mats = ReturnType<typeof makeMaterials>;

/* ============================================================
   CITY GRID — the whole flyover corridor, x in [-9,9], z from
   +4 (behind entry) to -28 (past the dock). Two InstancedMeshes
   total: building volumes + emissive window studs. This is the
   "1-3 draw calls" instancing the mission requires.
   ============================================================ */
export function buildCityGrid(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const rand = mulberry32(1337);

  type Slot = { x: number; z: number; h: number };
  const slots: Slot[] = [];
  for (let zi = 0; zi <= 10; zi++) {
    const z = 4 - zi * 3.2;
    for (let xi = -3; xi <= 3; xi++) {
      const x = xi * 2.6 + (rand() - 0.5) * 0.6;
      // Clear a corridor around the flight path so buildings never occlude
      // the camera's own lookAt target.
      if (Math.abs(x) < 1.1) continue;
      const h = 1.2 + rand() * 3.4;
      slots.push({ x, z, h });
    }
  }

  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  t.geometries.push(boxGeo);
  const buildings = new THREE.InstancedMesh(
    boxGeo,
    mats.building,
    slots.length,
  );
  const dummy = new THREE.Object3D();
  slots.forEach((s, i) => {
    dummy.position.set(s.x, s.h / 2, s.z);
    dummy.scale.set(1.5 + (i % 3) * 0.15, s.h, 1.5 + ((i + 1) % 3) * 0.12);
    dummy.updateMatrix();
    buildings.setMatrixAt(i, dummy.matrix);
  });
  buildings.instanceMatrix.needsUpdate = true;
  group.add(buildings);

  // Window studs — a fixed small grid per building face, single instanced
  // mesh for every window in the city (draw call #2).
  const winGeo = new THREE.BoxGeometry(0.16, 0.22, 0.05);
  t.geometries.push(winGeo);
  const rowsMax = 6;
  const colsPerFace = 2;
  const totalWindows = slots.length * rowsMax * colsPerFace * 2; // 2 faces
  const windows = new THREE.InstancedMesh(winGeo, mats.window_, totalWindows);
  let wi = 0;
  const wDummy = new THREE.Object3D();
  slots.forEach((s) => {
    const rows = Math.max(2, Math.min(rowsMax, Math.floor(s.h / 0.65)));
    const halfW = (1.5 + (rand() - 0.5) * 0.1) / 2;
    for (const faceSign of [1, -1]) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < colsPerFace; c++) {
          if (rand() < 0.22) continue; // some windows dark
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
          wi++;
        }
      }
    }
  });
  // Unused instances (skipped "dark" windows) — collapse to zero scale so
  // they don't render as stray lit boxes at the origin.
  const zeroDummy = new THREE.Object3D();
  zeroDummy.scale.setScalar(0);
  zeroDummy.updateMatrix();
  for (let i = wi; i < totalWindows; i++)
    windows.setMatrixAt(i, zeroDummy.matrix);
  windows.instanceMatrix.needsUpdate = true;
  group.add(windows);

  // Ground plane — draw call #3, unlit dark ink-jade street level.
  const groundGeo = new THREE.PlaneGeometry(40, 60);
  t.geometries.push(groundGeo);
  const ground = new THREE.Mesh(groundGeo, mats.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, -13);
  group.add(ground);

  return {
    group,
    update: () => {},
    dispose: t.dispose,
  };
}

/* ============================================================
   STACK DISTRICT — 5 landmark towers, one per STACK entry, camera
   descends past them (waypoint 2). Single InstancedMesh.
   ============================================================ */
export function buildStackDistrict(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  t.geometries.push(geo);
  const towers = new THREE.InstancedMesh(geo, mats.landmark, STACK.length);
  const heights = [3.2, 4.6, 3.8, 5.2, 4.0];
  const positions: [number, number][] = [
    [-3.4, -2.5],
    [-1.6, -4.2],
    [0.6, -3.0],
    [2.4, -5.0],
    [3.8, -3.4],
  ];
  const dummy = new THREE.Object3D();
  STACK.forEach((_node, i) => {
    const h = heights[i] ?? 4;
    const [x, z] = positions[i] ?? [0, -4];
    dummy.position.set(x, h / 2, z);
    dummy.scale.set(0.9, h, 0.9);
    dummy.updateMatrix();
    towers.setMatrixAt(i, dummy.matrix);
  });
  towers.instanceMatrix.needsUpdate = true;
  group.add(towers);

  return {
    group,
    update: (dt) => {
      group.rotation.y = Math.sin(performance.now() * 0.00005) * 0.02;
      void dt;
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   PROOF PLAZA — 4 illuminated towers, heights purely decorative
   (never tied to the numeric values — those live in the HTML
   count-up). Single InstancedMesh + a slow pulse.
   ============================================================ */
export function buildProofPlaza(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.CylinderGeometry(0.5, 0.6, 1, 12);
  t.geometries.push(geo);
  const towers = new THREE.InstancedMesh(geo, mats.beacon, PROOF.length);
  // Kept well off the camera's own path (waypoint pos [-2.6, 1.9, -6.5],
  // look [-1.2, 1.2, -10.5]) and spread wide so a radius-0.5 cylinder never
  // fills the frame the way a close-up tower did in an earlier pass.
  const positions: [number, number][] = [
    [-4.6, -11],
    [-1.6, -13.2],
    [2.2, -11.6],
    [4.4, -13.6],
  ];
  const dummy = new THREE.Object3D();
  PROOF.forEach((_p, i) => {
    const [x, z] = positions[i] ?? [0, -12];
    const h = 2.4 + i * 0.5;
    dummy.position.set(x, h / 2, z);
    dummy.scale.set(1, h, 1);
    dummy.updateMatrix();
    towers.setMatrixAt(i, dummy.matrix);
  });
  towers.instanceMatrix.needsUpdate = true;
  group.add(towers);

  return {
    group,
    update: (_dt, elapsed) => {
      const pulse = 1 + Math.sin(elapsed * 1.2) * 0.03;
      towers.scale.setScalar(pulse);
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   WORKS BOULEVARD — 4 billboard panels, one per WORK entry, the
   camera passes them at waypoint 4. Single InstancedMesh.
   ============================================================ */
export function buildWorksBoulevard(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(2.2, 1.3, 0.1);
  t.geometries.push(geo);
  const panels = new THREE.InstancedMesh(geo, mats.landmark, WORK.length);
  const positions: [number, number, number][] = [
    [-2.6, 1.6, -13],
    [2.6, 1.2, -15.4],
    [-2.6, 1.8, -17.2],
    [2.6, 1.3, -19.2],
  ];
  const dummy = new THREE.Object3D();
  const base: THREE.Vector3[] = [];
  WORK.forEach((_w, i) => {
    const [x, y, z] = positions[i] ?? [0, 1.5, -14];
    base.push(new THREE.Vector3(x, y, z));
    dummy.position.set(x, y, z);
    dummy.rotation.y = x < 0 ? 0.35 : -0.35;
    dummy.updateMatrix();
    panels.setMatrixAt(i, dummy.matrix);
  });
  panels.instanceMatrix.needsUpdate = true;
  group.add(panels);

  return {
    group,
    update: (_dt, elapsed) => {
      base.forEach((b, i) => {
        dummy.position.set(b.x, b.y + Math.sin(elapsed * 0.5 + i) * 0.08, b.z);
        dummy.rotation.y =
          (b.x < 0 ? 0.35 : -0.35) + Math.sin(elapsed * 0.2 + i) * 0.05;
        dummy.updateMatrix();
        panels.setMatrixAt(i, dummy.matrix);
      });
      panels.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

/* ============================================================
   DOCK — final landing pad, waypoint 5. Base + beacon knot.
   ============================================================ */
export function buildDock(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, 0, -25);

  const baseGeo = new THREE.CylinderGeometry(3, 3.3, 0.2, 48);
  const knotGeo = new THREE.TorusKnotGeometry(0.5, 0.15, 96, 12);
  t.geometries.push(baseGeo, knotGeo);

  const base = new THREE.Mesh(baseGeo, mats.building);
  const beacon = new THREE.Mesh(knotGeo, mats.beacon);
  beacon.position.y = 1.4;
  group.add(base, beacon);

  return {
    group,
    update: (dt) => {
      group.rotation.y += dt * 0.05;
    },
    dispose: t.dispose,
  };
}

export { makeMaterials };
