import * as THREE from "three";
import { C, STACK, PROOF, WORK } from "./tokens";

/* ============================================================
   SCENE OBJECTS — plain three.js builders (no @react-three/fiber).
   Same reason as components/orbit/SceneObjects.ts: this repo's
   React 18.3.1 + this Next.js build's client-internals shape is
   incompatible with the only r3f/react-reconciler line available;
   plain imperative three.js is the version-appropriate equivalent.

   World: a vertical DESCENT through five depth bands —
   SURFACE / REEF / TRENCH / STATIONS / FLOOR — built once per
   Canvas instance (materials + geometries are instance-owned, not
   module singletons, so dispose() on unmount is safe).

   Draw-call budget (checked): 1 particle field + 3 god-ray planes +
   5 reef emblems + 4 trench beacons + 4 station windows + 2 floor
   meshes + 1 snowfall field = 20 draws, well under the 100 cap.
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

/* Shared materials — created once per Scene instance, disposed with it. */
function makeMaterials() {
  const jade = new THREE.MeshStandardMaterial({
    color: C.jade,
    metalness: 0.1,
    roughness: 0.3,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.55,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: C.inkJade,
    transmission: 0.75,
    roughness: 0.2,
    thickness: 0.5,
    ior: 1.15,
    clearcoat: 0.5,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.18,
  });
  const ink = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    metalness: 0.15,
    roughness: 0.4,
  });
  const beacon = new THREE.MeshStandardMaterial({
    color: C.live,
    emissive: new THREE.Color(C.live),
    emissiveIntensity: 1.1,
    roughness: 0.3,
  });
  const particle = new THREE.MeshBasicMaterial({
    color: C.jade,
    transparent: true,
    opacity: 0.85,
  });
  return { jade, glass, ink, beacon, particle };
}

/* ── PARTICLE FIELD — bioluminescent jade drift, one InstancedMesh
   (≤2k instances) spanning the full descent so it reads continuously
   from surface to floor; slow upward current + gentle sideways sway. */
export function buildParticleField(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const COUNT = 1400;
  const geo = new THREE.IcosahedronGeometry(0.028, 0);
  t.geometries.push(geo);
  const mesh = new THREE.InstancedMesh(geo, mats.particle, COUNT);
  const group = new THREE.Group();
  group.add(mesh);

  const seeds = new Float32Array(COUNT * 4); // x, y0(top), z, phase
  for (let i = 0; i < COUNT; i++) {
    seeds[i * 4 + 0] = (Math.random() - 0.5) * 14;
    seeds[i * 4 + 1] = 8 - Math.random() * 26; // spread across the whole descent
    seeds[i * 4 + 2] = (Math.random() - 0.5) * 14;
    seeds[i * 4 + 3] = Math.random() * Math.PI * 2;
  }

  const dummy = new THREE.Object3D();
  return {
    group,
    update: (_dt, elapsed) => {
      for (let i = 0; i < COUNT; i++) {
        const x = seeds[i * 4 + 0];
        const baseY = seeds[i * 4 + 1];
        const z = seeds[i * 4 + 2];
        const phase = seeds[i * 4 + 3];
        // slow upward current, wrapped, plus a gentle sway
        const y = ((((baseY + elapsed * 0.18) % 34) + 34) % 34) - 26;
        dummy.position.set(
          x + Math.sin(elapsed * 0.2 + phase) * 0.4,
          y,
          z + Math.cos(elapsed * 0.15 + phase) * 0.4,
        );
        const s = 0.6 + Math.sin(elapsed * 1.6 + phase) * 0.4;
        dummy.scale.setScalar(Math.max(0.2, s));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

/* ── GOD-RAY CONES — transparent gradient planes near the surface,
   double-sided, additively-lit look via vertex-alpha gradient. */
export function buildGodRays(): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const rays = [
    { x: -3, rot: -0.28, h: 16 },
    { x: 0.5, rot: 0.05, h: 20 },
    { x: 3.4, rot: 0.32, h: 14 },
  ];
  rays.forEach(({ x, rot, h }) => {
    const geo = new THREE.PlaneGeometry(2.2, h, 1, 12);
    t.geometries.push(geo);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 4);
    for (let i = 0; i < pos.count; i++) {
      const v = (pos.getY(i) + h / 2) / h; // 0 bottom .. 1 top
      colors[i * 4 + 0] = 0.07;
      colors[i * 4 + 1] = 0.49;
      colors[i * 4 + 2] = 0.45;
      colors[i * 4 + 3] = v * 0.16;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    t.materials.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 2, -1 - Math.abs(x) * 0.4);
    mesh.rotation.z = rot;
    mesh.rotation.x = -0.08;
    group.add(mesh);
  });
  return {
    group,
    update: (_dt, elapsed) => {
      group.children.forEach((c, i) => {
        c.position.x += Math.sin(elapsed * 0.1 + i) * 0.0006;
      });
    },
    dispose: t.dispose,
  };
}

/* ── THE REEF — 5 coral-like emblems, one per STACK entry, gently
   swaying like coral in a current. */
export function buildReefEmblems(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(1.6, 1.2, 0);
  const geo = new THREE.OctahedronGeometry(0.36, 1);
  t.geometries.push(geo);
  const nodes = STACK.map((_, i) => {
    const mesh = new THREE.Mesh(geo, mats.jade);
    const angle = (i / STACK.length) * Math.PI * 2;
    mesh.position.set(
      Math.cos(angle) * 1.9,
      Math.sin(angle * 0.6) * 0.5,
      Math.sin(angle) * 1.9,
    );
    group.add(mesh);
    return { mesh, angle, offset: i };
  });
  return {
    group,
    update: (dt, elapsed) => {
      nodes.forEach(({ mesh, offset }) => {
        mesh.rotation.y += dt * 0.3;
        mesh.rotation.x = Math.sin(elapsed * 0.5 + offset) * 0.25;
        mesh.position.y += Math.sin(elapsed * 0.8 + offset) * 0.0009;
      });
    },
    dispose: t.dispose,
  };
}

/* ── THE TRENCH — 4 depth-marker beacons, one per PROOF entry;
   pulsing glow, slow bob, count matches the 4 locked numbers. */
export function buildTrenchBeacons(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(-1.4, -4.2, -2);
  const geo = new THREE.SphereGeometry(0.22, 20, 20);
  const ringGeo = new THREE.TorusGeometry(0.36, 0.012, 8, 32);
  t.geometries.push(geo, ringGeo);
  const nodes = PROOF.map((_, i) => {
    const g = new THREE.Group();
    const sphere = new THREE.Mesh(geo, mats.beacon);
    const ring = new THREE.Mesh(ringGeo, mats.jade);
    ring.rotation.x = Math.PI / 2;
    g.add(sphere, ring);
    const angle = (i / PROOF.length) * Math.PI * 2;
    g.position.set(
      Math.cos(angle) * 2.1,
      (i - 1.5) * 0.35,
      Math.sin(angle) * 2.1,
    );
    group.add(g);
    return { g, sphere, offset: i };
  });
  return {
    group,
    update: (_dt, elapsed) => {
      nodes.forEach(({ sphere, offset }) => {
        const pulse = 1 + Math.sin(elapsed * 1.5 + offset) * 0.18;
        sphere.scale.setScalar(pulse);
      });
    },
    dispose: t.dispose,
  };
}

/* ── STATIONS — the "wrecks turned stations": 4 illuminated windows,
   one per WORK entry, drifting gently like structures resting on a
   ledge in the dark. */
export function buildStationWindows(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(1.1, -9.4, -5.6);
  const geo = new THREE.BoxGeometry(1.6, 1.05, 0.1);
  t.geometries.push(geo);
  const panels = WORK.map((_, i) => {
    const mesh = new THREE.Mesh(geo, mats.glass);
    const angle = (i / WORK.length) * Math.PI * 2;
    mesh.position.set(
      Math.cos(angle) * 2.3,
      i % 2 === 0 ? 0.4 : -0.4,
      Math.sin(angle) * 2.3,
    );
    mesh.lookAt(group.position);
    group.add(mesh);
    return { mesh, base: mesh.position.clone(), offset: i };
  });
  return {
    group,
    update: (_dt, elapsed) => {
      panels.forEach(({ mesh, base, offset }) => {
        mesh.position.y = base.y + Math.sin(elapsed * 0.5 + offset) * 0.12;
      });
    },
    dispose: t.dispose,
  };
}

/* ── THE FLOOR — landing platform + slow "snowfall" of sediment-like
   particles drifting down onto it. */
export function buildFloorPlatform(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, -14.6, -10);

  const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.16, 48);
  const knotGeo = new THREE.TorusKnotGeometry(0.5, 0.15, 96, 12);
  t.geometries.push(baseGeo, knotGeo);
  const base = new THREE.Mesh(baseGeo, mats.ink);
  base.rotation.x = -Math.PI / 2;
  const knot = new THREE.Mesh(knotGeo, mats.jade);
  knot.position.y = 0.85;
  group.add(base, knot);

  const SNOW_COUNT = 500;
  const snowGeo = new THREE.IcosahedronGeometry(0.02, 0);
  t.geometries.push(snowGeo);
  const snow = new THREE.InstancedMesh(snowGeo, mats.particle, SNOW_COUNT);
  group.add(snow);
  const seeds = new Float32Array(SNOW_COUNT * 3);
  for (let i = 0; i < SNOW_COUNT; i++) {
    seeds[i * 3 + 0] = (Math.random() - 0.5) * 6;
    seeds[i * 3 + 1] = Math.random() * 6;
    seeds[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  const dummy = new THREE.Object3D();

  return {
    group,
    update: (_dt, elapsed) => {
      group.rotation.y += _dt * 0.04;
      for (let i = 0; i < SNOW_COUNT; i++) {
        const x = seeds[i * 3 + 0];
        const y0 = seeds[i * 3 + 1];
        const z = seeds[i * 3 + 2];
        const y = ((((y0 - elapsed * 0.15) % 6) + 6) % 6) - 0.1;
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(0.5);
        dummy.updateMatrix();
        snow.setMatrixAt(i, dummy.matrix);
      }
      snow.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

export { makeMaterials };
