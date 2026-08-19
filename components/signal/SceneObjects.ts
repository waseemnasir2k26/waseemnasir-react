import * as THREE from "three";
import { C, STACK, PROOF } from "./tokens";

/* ============================================================
   SCENE OBJECTS — plain three.js builders (no @react-three/fiber).
   Same reason as components/orbit/SceneObjects.ts and components/
   forge/ForgeCanvas.tsx: this Next.js 16 build's client bundle
   vendors its own React (19.x internals) and react-reconciler@0.27
   (what @react-three/fiber@8 ships, the only line compatible with
   this repo's React 18.3.1) can't read that shape — verified failing
   under both Turbopack and webpack by the two sibling variants.
   Plain three.js sidesteps the reconciler entirely.

   Each builder returns a THREE.Group plus an update(dt, elapsed, p)
   tick function; SignalCanvas.tsx owns the render loop and disposal.
   `p` is the 0..1 scroll progress, passed through so objects near
   the camera's current scene can react (e.g. counters, junction
   spin-up) without each builder re-deriving it.
   ============================================================ */

export type SceneObject = {
  group: THREE.Object3D;
  update: (dt: number, elapsed: number, p: number) => void;
  dispose: () => void;
};

function trackDisposables() {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  return {
    geometries,
    materials,
    textures,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}

/* Shared materials — created once per Canvas instance (not module-level
   singletons) so dispose() on unmount is safe and never double-frees a
   material a still-mounted second Canvas instance is using. */
function makeMaterials() {
  const jade = new THREE.MeshStandardMaterial({
    color: C.jade,
    metalness: 0.15,
    roughness: 0.25,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.14,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: C.paper,
    transmission: 0.85,
    roughness: 0.18,
    thickness: 0.6,
    ior: 1.15,
    clearcoat: 0.6,
    transparent: true,
  });
  const ink = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    metalness: 0.2,
    roughness: 0.35,
  });
  const wall = new THREE.MeshPhysicalMaterial({
    color: C.inkJade,
    transmission: 0.9,
    roughness: 0.35,
    thickness: 0.3,
    ior: 1.05,
    transparent: true,
    opacity: 0.16,
    side: THREE.BackSide,
    depthWrite: false,
  });
  return { jade, glass, ink, wall };
}

/** Small dash texture for the light-trail — animate .offset.x each frame
    to fake flow along the tube without a custom shader or postprocessing. */
function buildDashTexture(): THREE.Texture {
  const w = 64;
  const h = 4;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, "rgba(17,126,115,0)");
  grad.addColorStop(0.5, "rgba(17,126,115,0.55)");
  grad.addColorStop(1, "rgba(17,126,115,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(6, 1);
  tex.needsUpdate = true;
  return tex;
}

/* ── the conduit itself: an outer translucent wall tube (seen from
   inside, BackSide) + a thin bright trail tube whose texture offset
   animates to read as light flowing along the packet's path, plus a
   handful of structural rings so the tunnel reads as built, not empty. ── */
export function buildConduitTube(
  curve: THREE.CatmullRomCurve3,
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  const outerGeo = new THREE.TubeGeometry(curve, 220, 1.35, 10, false);
  t.geometries.push(outerGeo);
  const outer = new THREE.Mesh(outerGeo, mats.wall);
  group.add(outer);

  const trailGeo = new THREE.TubeGeometry(curve, 220, 0.045, 8, false);
  t.geometries.push(trailGeo);
  const dashTex = buildDashTexture();
  t.textures.push(dashTex);
  const trailMat = new THREE.MeshBasicMaterial({
    map: dashTex,
    color: C.jade,
    transparent: true,
    opacity: 0.6,
    blending: THREE.NormalBlending,
    depthWrite: false,
  });
  t.materials.push(trailMat);
  const trail = new THREE.Mesh(trailGeo, trailMat);
  group.add(trail);

  const ringGeo = new THREE.TorusGeometry(1.3, 0.012, 6, 32);
  t.geometries.push(ringGeo);
  const RING_COUNT = 14;
  const rings: THREE.Mesh[] = [];
  const tangent = new THREE.Vector3();
  const pos = new THREE.Vector3();
  for (let i = 0; i < RING_COUNT; i++) {
    const ringMesh = new THREE.Mesh(ringGeo, mats.ink);
    const tt = (i + 0.5) / RING_COUNT;
    curve.getPointAt(tt, pos);
    curve.getTangentAt(tt, tangent);
    ringMesh.position.copy(pos);
    ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    group.add(ringMesh);
    rings.push(ringMesh);
  }

  return {
    group,
    update: (dt) => {
      dashTex.offset.x -= dt * 0.35;
    },
    dispose: t.dispose,
  };
}

/* ── particle stream: instanced spheres riding the conduit centerline
   with a small radial jitter, wrapping continuously — the visible
   "data" flowing through the tube. Count kept well under the 2k cap. ── */
export function buildParticleStream(
  curve: THREE.CatmullRomCurve3,
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const COUNT = 500;
  const geo = new THREE.IcosahedronGeometry(0.03, 0);
  t.geometries.push(geo);
  const mat = new THREE.MeshBasicMaterial({
    color: C.jade,
    transparent: true,
    opacity: 0.85,
  });
  t.materials.push(mat);
  const instanced = new THREE.InstancedMesh(geo, mat, COUNT);
  group.add(instanced);

  const frames = curve.computeFrenetFrames(220, false);
  const seeds = Array.from({ length: COUNT }, (_, i) => ({
    phase: i / COUNT,
    speed: 0.03 + Math.random() * 0.02,
    angle: Math.random() * Math.PI * 2,
    radius: 0.15 + Math.random() * 0.9,
  }));

  const dummy = new THREE.Object3D();
  const pos = new THREE.Vector3();
  function frameAt(tt: number) {
    const idx = Math.min(
      frames.normals.length - 1,
      Math.max(0, Math.round(tt * (frames.normals.length - 1))),
    );
    return { normal: frames.normals[idx], binormal: frames.binormals[idx] };
  }

  return {
    group,
    update: (_dt, elapsed) => {
      for (let i = 0; i < COUNT; i++) {
        const s = seeds[i];
        const tt = (s.phase + elapsed * s.speed) % 1;
        curve.getPointAt(tt, pos);
        const { normal, binormal } = frameAt(tt);
        dummy.position.copy(pos);
        dummy.position.addScaledVector(normal, Math.cos(s.angle) * s.radius);
        dummy.position.addScaledVector(binormal, Math.sin(s.angle) * s.radius);
        const fade = 1 - Math.abs(tt - 0.5) * 0.6;
        dummy.scale.setScalar(Math.max(0.4, fade));
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;
    },
    dispose: t.dispose,
  };
}

/* ── INTAKE: a gate ring at the mouth of the conduit — "a lead lands"
   reads as a small seed of light gathering into the packet. ── */
export function buildIntakeGate(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, 0.2, 10.6);

  const seedGeo = new THREE.IcosahedronGeometry(0.32, 1);
  t.geometries.push(seedGeo);
  const seed = new THREE.Mesh(seedGeo, mats.jade);
  group.add(seed);

  const gateGeo = new THREE.TorusGeometry(1.1, 0.02, 8, 40);
  t.geometries.push(gateGeo);
  const gate = new THREE.Mesh(gateGeo, mats.ink);
  group.add(gate);

  return {
    group,
    update: (dt, elapsed) => {
      seed.rotation.y += dt * 0.4;
      const pulse = 1 + Math.sin(elapsed * 1.6) * 0.08;
      seed.scale.setScalar(pulse);
      gate.rotation.z += dt * 0.05;
    },
    dispose: t.dispose,
  };
}

/* ── ROUTER: the junction — a core node with the 5 stack emblems
   orbiting it as connected systems. ── */
export function buildJunctionNode(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(1.8, 0.7, 3);

  const coreGeo = new THREE.IcosahedronGeometry(0.5, 1);
  t.geometries.push(coreGeo);
  const core = new THREE.Mesh(coreGeo, mats.glass);
  group.add(core);
  const innerGeo = new THREE.OctahedronGeometry(0.28, 0);
  t.geometries.push(innerGeo);
  const inner = new THREE.Mesh(innerGeo, mats.jade);
  group.add(inner);

  const nodeGeo = new THREE.OctahedronGeometry(0.16, 0);
  t.geometries.push(nodeGeo);
  const nodes = STACK.map(() => {
    const mesh = new THREE.Mesh(nodeGeo, mats.jade);
    group.add(mesh);
    return mesh;
  });

  return {
    group,
    update: (dt, elapsed) => {
      core.rotation.y += dt * 0.08;
      inner.rotation.y -= dt * 0.15;
      nodes.forEach((mesh, i) => {
        const angle = (i / nodes.length) * Math.PI * 2 + elapsed * 0.25;
        const r = 1.15;
        mesh.position.set(
          Math.cos(angle) * r,
          Math.sin(angle * 0.8) * 0.35,
          Math.sin(angle) * r,
        );
        mesh.rotation.y += dt * 0.5;
      });
    },
    dispose: t.dispose,
  };
}

/* ── PIPELINE: translucent wall bays with the 4 work panels visible
   through them — "follow-ups fire themselves" reads as running
   systems glimpsed mid-flight, not stopped-and-inspected. ── */
export function buildPipelineBays(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();

  const bayGeo = new THREE.CylinderGeometry(1.7, 1.7, 2.6, 16, 1, true);
  t.geometries.push(bayGeo);
  const bayPositions: [number, number, number][] = [
    [-1.4, -0.1, -1.6],
    [-0.6, 0.3, -4.6],
    [0.8, -0.2, -7.6],
  ];
  bayPositions.forEach((p) => {
    const bay = new THREE.Mesh(bayGeo, mats.wall);
    bay.position.set(...p);
    bay.rotation.x = Math.PI / 2;
    group.add(bay);
  });

  const panelGeo = new THREE.BoxGeometry(1.15, 0.75, 0.06);
  t.geometries.push(panelGeo);
  const panelPositions: [number, number, number][] = [
    [-1.9, 0.35, -1.8],
    [-0.1, -0.25, -4.4],
    [1.3, 0.4, -7.4],
    [-1.4, -0.3, -9],
  ];
  const panels = panelPositions.map((pos, i) => {
    const mesh = new THREE.Mesh(panelGeo, mats.glass);
    mesh.position.set(...pos);
    group.add(mesh);
    return { mesh, base: pos, offset: i };
  });

  return {
    group,
    update: (_dt, elapsed) => {
      panels.forEach(({ mesh, base, offset }) => {
        mesh.position.y = base[1] + Math.sin(elapsed * 0.6 + offset) * 0.12;
        mesh.rotation.y = Math.sin(elapsed * 0.22 + offset) * 0.2;
      });
    },
    dispose: t.dispose,
  };
}

/* ── VAULT: proof chamber — a ring plus 4 pedestal beacons, one per
   locked stat; the actual counting is an HTML overlay (CountUp), this
   is just the chamber it counts inside. ── */
export function buildVaultChamber(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(1.4, 0.5, -12);

  const ringGeo = new THREE.TorusGeometry(1.9, 0.03, 8, 48);
  t.geometries.push(ringGeo);
  const ring = new THREE.Mesh(ringGeo, mats.ink);
  group.add(ring);

  const pedestalGeo = new THREE.CylinderGeometry(0.05, 0.09, 0.5, 8);
  t.geometries.push(pedestalGeo);
  const tipGeo = new THREE.SphereGeometry(0.1, 12, 12);
  t.geometries.push(tipGeo);
  const beacons = PROOF.map((_, i) => {
    const angle = (i / PROOF.length) * Math.PI * 2;
    const x = Math.cos(angle) * 1.5;
    const z = Math.sin(angle) * 1.5;
    const pedestal = new THREE.Mesh(pedestalGeo, mats.ink);
    pedestal.position.set(x, -0.3, z);
    const tip = new THREE.Mesh(tipGeo, mats.jade);
    tip.position.set(x, -0.02, z);
    group.add(pedestal, tip);
    return tip;
  });

  return {
    group,
    update: (dt, elapsed, p) => {
      ring.rotation.z += dt * 0.04;
      const active = p > 0.58 && p < 0.82;
      beacons.forEach((tip, i) => {
        const pulse = active ? 1 + Math.sin(elapsed * 2 + i) * 0.2 : 0.85;
        tip.scale.setScalar(pulse);
      });
    },
    dispose: t.dispose,
  };
}

/* ── DELIVERY: the booking dock — a calendar-grid platform with a
   beacon ring, the packet's final resting place. ── */
export function buildDeliveryDock(
  mats: ReturnType<typeof makeMaterials>,
): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, 0.6, -19);

  const baseGeo = new THREE.CylinderGeometry(1.7, 1.9, 0.14, 40);
  t.geometries.push(baseGeo);
  const base = new THREE.Mesh(baseGeo, mats.ink);
  base.rotation.x = 0;
  group.add(base);

  const cellGeo = new THREE.BoxGeometry(0.24, 0.05, 0.24);
  t.geometries.push(cellGeo);
  const CELL_COLS = 5;
  const CELL_ROWS = 5;
  const cells = new THREE.InstancedMesh(
    cellGeo,
    mats.jade,
    CELL_COLS * CELL_ROWS,
  );
  const dummy = new THREE.Object3D();
  let idx = 0;
  for (let r = 0; r < CELL_ROWS; r++) {
    for (let c = 0; c < CELL_COLS; c++) {
      dummy.position.set(
        (c - (CELL_COLS - 1) / 2) * 0.32,
        0.09,
        (r - (CELL_ROWS - 1) / 2) * 0.32,
      );
      dummy.updateMatrix();
      cells.setMatrixAt(idx, dummy.matrix);
      idx++;
    }
  }
  group.add(cells);

  const beaconGeo = new THREE.TorusGeometry(2.1, 0.02, 8, 48);
  t.geometries.push(beaconGeo);
  const beacon = new THREE.Mesh(beaconGeo, mats.jade);
  beacon.rotation.x = Math.PI / 2;
  beacon.position.y = 0.2;
  group.add(beacon);

  return {
    group,
    update: (dt, elapsed, p) => {
      group.rotation.y += dt * 0.03;
      const arrived = p > 0.86;
      const pulse = arrived ? 1 + Math.sin(elapsed * 2.2) * 0.06 : 1;
      beacon.scale.setScalar(pulse);
    },
    dispose: t.dispose,
  };
}

export { makeMaterials };
