/* ============================================================
   /v/347 — plain three.js scene builder. Pure functions that
   construct geometry/materials and return disposable handles; no
   React, no rAF loop (that lives in NightCityCanvas.tsx).
   ============================================================ */
import * as THREE from "three";
import {
  cityVertex,
  cityFragment,
  skyVertex,
  skyFragment,
  groundVertex,
  groundFragment,
} from "./shaders";
import { minutesToProgress } from "./tokens";

export type Districts = {
  leadNurture: number;
  harbor: number;
  inboxTower: number;
  clinic: number;
};

/** District ignition anchors — tight ripple windows centred on each
    beat's own progress marker (see tokens.ts BEATS), independent of
    the ambient background scatter. */
const DISTRICT_P = {
  leadNurture: minutesToProgress(4 * 60 + 10),
  harbor: minutesToProgress(4 * 60 + 40),
  inboxTower: minutesToProgress(5 * 60 + 15),
  clinic: minutesToProgress(5 * 60 + 45),
};

export type CityHandle = {
  mesh: THREE.InstancedMesh;
  dispose: () => void;
};

export function buildCity(): CityHandle {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: cityVertex,
    fragmentShader: cityFragment,
    uniforms: {
      uProgress: { value: 0 },
      uFogColor: { value: new THREE.Color(0x0a0c14) },
      uFogNear: { value: 18 },
      uFogFar: { value: 55 },
      uWindowColor: { value: new THREE.Color(0xffb35c) },
      uBuildingColor: { value: new THREE.Color(0x11141e) },
      uRoofColor: { value: new THREE.Color(0x161a26) },
    },
  });

  const COUNT = 720;
  const mesh = new THREE.InstancedMesh(geo, material, COUNT);

  const aDistrict = new Float32Array(COUNT);
  const aLitAt = new Float32Array(COUNT);
  const aSeed = new Float32Array(COUNT);
  const aFloorSpread = new Float32Array(COUNT);

  const dummy = new THREE.Object3D();
  const rand = mulberry32(347);

  // Named landmark clusters get reserved index ranges so their ripple
  // ignition reads as one coherent district, not scattered dots.
  const clusters: {
    name: keyof typeof DISTRICT_P | "preDawn";
    from: number;
    to: number;
    district: number;
  }[] = [
    { name: "leadNurture", from: 0, to: 60, district: 1 },
    { name: "harbor", from: 60, to: 110, district: 2 },
    { name: "inboxTower", from: 110, to: 113, district: 3 }, // 3 tall inbox towers
    { name: "clinic", from: 113, to: 150, district: 4 },
    // pre-dawn — already-lit window clusters scattered across the hook
    // frame (p=0) so the opening beat reads composed, not an empty
    // void with two accidental lit slabs. Not a ripple district: just
    // ordinary ambient buildings that start lit.
    { name: "preDawn", from: 150, to: 156, district: 0 },
  ];
  // manual x spread for the preDawn cluster, kept within the visible
  // frustum at its (close) z depth — see NightCityCanvas camera setup
  const PRE_DAWN_X = [-22, -13, -4, 6, 15, 24];

  for (let i = 0; i < COUNT; i++) {
    const cluster = clusters.find((c) => i >= c.from && i < c.to);
    let x: number,
      z: number,
      h: number,
      district: number,
      litAt: number,
      floorSpread: number;

    if (cluster && cluster.name === "preDawn") {
      x = PRE_DAWN_X[i - cluster.from] + (rand() - 0.5) * 1.2;
      z = -16 - rand() * 9; // close + low fog so it reads at p=0
      district = 0;
      h = 3 + rand() * 4;
      litAt = -0.05; // already lit before the track starts
      floorSpread = 0;
    } else if (cluster) {
      const t = (i - cluster.from) / Math.max(1, cluster.to - cluster.from - 1);
      const spreadX =
        cluster.name === "leadNurture"
          ? [-26, -14]
          : cluster.name === "harbor"
            ? [10, 26]
            : cluster.name === "inboxTower"
              ? [-4, 4]
              : [-9, 5];
      x = spreadX[0] + t * (spreadX[1] - spreadX[0]) + (rand() - 0.5) * 1.4;
      z = -18 - rand() * 26;
      district = cluster.district;
      const centre = DISTRICT_P[cluster.name as keyof typeof DISTRICT_P];
      if (cluster.name === "inboxTower") {
        h = 9 + rand() * 2;
        litAt = centre - 0.01;
        floorSpread = 0.05;
      } else {
        h = 3 + rand() * 5;
        litAt = centre + (rand() - 0.5) * 0.028;
        floorSpread = 0;
      }
    } else {
      // ambient background city — fills the rest of the skyline, lights
      // ignite in a slow city-wide cascade across the whole night; a
      // small handful start already lit (the "few amber windows" at
      // 03:47 in the hook beat).
      x = -34 + rand() * 68;
      z = -14 - rand() * 40;
      h = 2 + rand() * 6.5;
      district = 0;
      const seedLit = rand();
      // Exponent < 1 biases toward litAt near 1 (most windows ignite
      // LATE, close to dawn) with a thin early tail — a slow city-wide
      // cascade rather than the whole skyline blazing by the first beat.
      litAt = seedLit < 0.02 ? -0.05 : Math.pow(rand(), 0.4) * 0.95;
      floorSpread = 0;
    }

    const w = 1.1 + rand() * 0.9;
    dummy.position.set(x, h / 2, z);
    dummy.scale.set(w, h, w);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    aDistrict[i] = district;
    aLitAt[i] = litAt;
    aSeed[i] = rand() * 100;
    aFloorSpread[i] = floorSpread;
  }

  geo.setAttribute(
    "aDistrict",
    new THREE.InstancedBufferAttribute(aDistrict, 1),
  );
  geo.setAttribute("aLitAt", new THREE.InstancedBufferAttribute(aLitAt, 1));
  geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(aSeed, 1));
  geo.setAttribute(
    "aFloorSpread",
    new THREE.InstancedBufferAttribute(aFloorSpread, 1),
  );
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;

  return {
    mesh,
    dispose: () => {
      geo.dispose();
      material.dispose();
    },
  };
}

export type GroundHandle = { mesh: THREE.Mesh; dispose: () => void };
export function buildGround(): GroundHandle {
  const geo = new THREE.PlaneGeometry(240, 240, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const material = new THREE.ShaderMaterial({
    vertexShader: groundVertex,
    fragmentShader: groundFragment,
    uniforms: {
      uColor: { value: new THREE.Color(0x070810) },
      uFogColor: { value: new THREE.Color(0x0a0c14) },
      uFogNear: { value: 18 },
      uFogFar: { value: 55 },
    },
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.y = 0;
  return {
    mesh,
    dispose: () => {
      geo.dispose();
      material.dispose();
    },
  };
}

export type SkyHandle = { mesh: THREE.Mesh; dispose: () => void };
export function buildSky(): SkyHandle {
  const geo = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    uniforms: { uProgress: { value: 0 } },
    depthWrite: false,
    depthTest: false,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return {
    mesh,
    dispose: () => {
      geo.dispose();
      material.dispose();
    },
  };
}

/** Procedural radial-glow sprite texture for the sun — canvas-generated,
    no remote asset, per spec ("no EffectComposer/bloom — glow is the
    sprite"). */
function makeGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grd = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grd.addColorStop(0, "rgba(255,220,170,0.95)");
  grd.addColorStop(0.35, "rgba(255,190,120,0.45)");
  grd.addColorStop(1, "rgba(255,180,110,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export type SunHandle = {
  disc: THREE.Mesh;
  glow: THREE.Sprite;
  update: (p: number) => void;
  dispose: () => void;
};
export function buildSun(): SunHandle {
  const discGeo = new THREE.CircleGeometry(1.1, 32);
  const discMat = new THREE.MeshBasicMaterial({
    color: 0xfff2d8,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const disc = new THREE.Mesh(discGeo, discMat);

  const glowTex = makeGlowTexture();
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(18, 18, 1);

  const update = (p: number) => {
    // sun crests the skyline starting beat 6 (~06:20, p≈0.80) and is
    // fully risen by 06:58 (p=1)
    const rise = THREE.MathUtils.smoothstep(p, 0.72, 1.0);
    const y = -6 + rise * 22;
    const z = -46;
    disc.position.set(0, y, z);
    glow.position.set(0, y, z);
    const visibility = THREE.MathUtils.smoothstep(p, 0.7, 0.86);
    disc.material.opacity = visibility * 0.9;
    glowMat.opacity = visibility * 0.85;
    const scale = 16 + rise * 10;
    glow.scale.set(scale, scale, 1);
  };

  return {
    disc,
    glow,
    update,
    dispose: () => {
      discGeo.dispose();
      discMat.dispose();
      glowMat.dispose();
      glowTex.dispose();
    },
  };
}

/** Harbor beacon — a single blinking emissive point, per beat 3
    ("harbor district + blinking beacon"). Blinks on real elapsed time
    (not uProgress) so it reads as a live beacon once revealed; gated
    on/off by the same district ignition window + daylight wash. */
export type BeaconHandle = {
  mesh: THREE.Mesh;
  update: (progress: number, nowMs: number) => void;
  dispose: () => void;
};
export function buildHarborBeacon(): BeaconHandle {
  const geo = new THREE.SphereGeometry(0.28, 12, 12);
  const material = new THREE.MeshBasicMaterial({
    color: 0xfff0c8,
    transparent: true,
    opacity: 0,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(18, 6.4, -22);
  const revealAt = DISTRICT_P.harbor;

  const update = (progress: number, nowMs: number) => {
    const revealed = THREE.MathUtils.smoothstep(
      progress,
      revealAt - 0.01,
      revealAt + 0.005,
    );
    const dayWash = THREE.MathUtils.smoothstep(progress, 0.78, 1.0);
    const blink = Math.sin(nowMs * 0.005) * 0.5 + 0.5;
    material.opacity = revealed * (1 - dayWash) * (0.35 + blink * 0.65);
  };

  return {
    mesh,
    update,
    dispose: () => {
      geo.dispose();
      material.dispose();
    },
  };
}

/** Deterministic seeded PRNG — same city layout every load/SSR pass. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
