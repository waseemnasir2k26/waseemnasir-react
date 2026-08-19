import * as THREE from "three";
import { C, STACK, PROOF } from "./tokens";

/* ============================================================
   SCENE OBJECTS — plain three.js builders (no @react-three/fiber).
   See OrbitCanvas.tsx for why: this Next.js build's client bundle
   resolves React's secret internals to a shape react-reconciler
   0.27 (what @react-three/fiber@8 ships, the only line compatible
   with this repo's React 18.3.1) can't read, so the renderer throws
   at import time under both Turbopack and webpack. @react-three/
   fiber@9 needs React 19 as an actual dependency, which breaks
   shared components (verified: bumping to it flips @types/react
   and breaks components/TextReveal.tsx — out of scope to touch).
   Plain three.js sidesteps the reconciler entirely and is the
   version-appropriate equivalent for this repo today.

   Each builder returns a THREE.Group plus an update(dt, elapsed)
   tick function; SceneRig.tsx owns the render loop and disposal.
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
  const jade = new THREE.MeshStandardMaterial({
    color: C.jade,
    metalness: 0.15,
    roughness: 0.25,
    emissive: new THREE.Color(C.jade),
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
  const ink = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    metalness: 0.2,
    roughness: 0.35,
  });
  return { jade, glass, ink };
}

export function buildEntryCore(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  const outerGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const innerGeo = new THREE.IcosahedronGeometry(1, 0);
  t.geometries.push(outerGeo, innerGeo);

  const outer = new THREE.Mesh(outerGeo, mats.glass);
  const inner = new THREE.Mesh(innerGeo, mats.jade);
  inner.scale.setScalar(0.5);
  group.add(outer, inner);

  return {
    group,
    update: (dt) => {
      group.rotation.y += dt * 0.06;
    },
    dispose: t.dispose,
  };
}

function orbitPosition(i: number, total: number, radius: number, t: number) {
  const angle = (i / total) * Math.PI * 2 + t;
  return new THREE.Vector3(
    3.2 + Math.cos(angle) * radius,
    1.1 + Math.sin(angle * 0.7) * 0.5,
    3.6 + Math.sin(angle) * radius,
  );
}
export function buildStackOrbit(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.OctahedronGeometry(0.32, 0);
  t.geometries.push(geo);
  const nodes = STACK.map(() => {
    const mesh = new THREE.Mesh(geo, mats.jade);
    group.add(mesh);
    return mesh;
  });
  let clock = 0;
  return {
    group,
    update: (dt) => {
      clock += dt * 0.15;
      nodes.forEach((mesh, i) => {
        mesh.position.copy(orbitPosition(i, nodes.length, 1.7, clock));
        mesh.rotation.y += dt * 0.4;
      });
    },
    dispose: t.dispose,
  };
}

export function buildProofField(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const positions = PROOF.map(
    (_, i) =>
      new THREE.Vector3(
        -3.5 + Math.cos((i / PROOF.length) * Math.PI * 2) * 1.6,
        Math.sin((i / PROOF.length) * Math.PI * 2) * 0.9,
        -4.5 + Math.sin((i / PROOF.length) * Math.PI * 2) * 1.6,
      ),
  );
  const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const instanced = new THREE.InstancedMesh(sphereGeo, mats.jade, PROOF.length);
  t.geometries.push(sphereGeo);
  group.add(instanced);

  const torusGeo = new THREE.TorusGeometry(1.6, 0.015, 8, 48);
  t.geometries.push(torusGeo);
  const ring = new THREE.Mesh(torusGeo, mats.ink);
  ring.position.set(-3.5, 0, -4.5);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const dummy = new THREE.Object3D();
  return {
    group,
    update: (_dt, elapsed) => {
      positions.forEach((p, i) => {
        const pulse = 1 + Math.sin(elapsed * 1.4 + i) * 0.12;
        dummy.position.copy(p);
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      });
      instanced.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

export function buildWorkIslands(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const positions: [number, number, number][] = [
    [-2.1, 0.6, -7.2],
    [1.6, -0.4, -9.4],
    [-1.4, -1.1, -11.6],
    [1.9, 0.5, -13.4],
  ];
  const geo = new THREE.BoxGeometry(1.5, 1, 0.08);
  t.geometries.push(geo);
  const panels = positions.map((pos, i) => {
    const mesh = new THREE.Mesh(geo, mats.glass);
    mesh.position.set(...pos);
    group.add(mesh);
    return { mesh, base: pos, offset: i };
  });
  return {
    group,
    update: (_dt, elapsed) => {
      panels.forEach(({ mesh, base, offset }) => {
        mesh.position.y = base[1] + Math.sin(elapsed * 0.6 + offset) * 0.15;
        mesh.rotation.y = Math.sin(elapsed * 0.2 + offset) * 0.15;
      });
    },
    dispose: t.dispose,
  };
}

export function buildDockPlatform(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, -0.3, -18);

  const baseGeo = new THREE.CylinderGeometry(2.1, 2.3, 0.18, 48);
  const knotGeo = new THREE.TorusKnotGeometry(0.55, 0.16, 96, 12);
  t.geometries.push(baseGeo, knotGeo);

  const base = new THREE.Mesh(baseGeo, mats.ink);
  base.rotation.x = -Math.PI / 2;
  const knot = new THREE.Mesh(knotGeo, mats.jade);
  knot.position.y = 0.9;
  group.add(base, knot);

  return {
    group,
    update: (dt) => {
      group.rotation.y += dt * 0.05;
    },
    dispose: t.dispose,
  };
}

export { makeMaterials };
