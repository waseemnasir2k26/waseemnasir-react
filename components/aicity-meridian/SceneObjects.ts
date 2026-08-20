import * as THREE from "three";
import { C, DUSK, DISTRICT, WORK } from "./tokens";

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
function makeIgnitionMaterial(dimHex: string, brightHex: string) {
  const uDim = new THREE.Color(dimHex);
  const uBright = new THREE.Color(brightHex);
  return new THREE.ShaderMaterial({
    uniforms: {
      uDayness: { value: 0 },
      uDim: { value: uDim },
      uBright: { value: uBright },
    },
    vertexShader: /* glsl */ `
      attribute float aThreshold;
      varying float vLit;
      uniform float uDayness;
      void main() {
        vLit = smoothstep(aThreshold - 0.05, aThreshold + 0.05, uDayness);
        vec3 transformed = position;
        #ifdef USE_INSTANCING
          transformed = (instanceMatrix * vec4(transformed, 1.0)).xyz;
        #endif
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDim;
      uniform vec3 uBright;
      varying float vLit;
      void main() {
        vec3 col = mix(uDim, uBright, vLit);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}

function makeMaterials() {
  const building = new THREE.MeshStandardMaterial({
    color: C.inkJade,
    metalness: 0.25,
    roughness: 0.75,
    emissive: new THREE.Color(C.jade),
    emissiveIntensity: 0.03,
  });
  const window_ = makeIgnitionMaterial(C.inkJade, C.jadeBright);
  const lamp = makeIgnitionMaterial("#0A2622", C.jadeBright);
  const landmark = makeIgnitionMaterial(C.inkJade, C.jadeBright);
  const billboard = makeIgnitionMaterial(C.inkJade, C.jadeBright);
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

  return {
    group,
    update: (_dt, _elapsed, dayness) =>
      setIgnitionUniform(mats.window_, dayness),
    dispose: t.dispose,
  };
}

/* ============================================================
   STACK DISTRICT — 5 landmark towers, one per DISTRICT entry
   (Switchboard / Gatehouse / Conveyor / Radio Mast / Projection
   House). Ignite floor-by-floor visually via the shared shader as
   a unit per tower, staggered left-to-right, entirely within the
   14-30% SUNSET band ("stack district wakes").
   ============================================================ */
export function buildStackDistrict(mats: Mats): SceneObject {
  const t = trackDisposables();
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  t.geometries.push(geo);
  const towers = new THREE.InstancedMesh(geo, mats.landmark, DISTRICT.length);
  const heights = [3.2, 4.6, 3.8, 5.2, 4.0];
  const positions: [number, number][] = [
    [-3.4, -2.5],
    [-1.6, -4.2],
    [0.6, -3.0],
    [2.4, -5.0],
    [3.8, -3.4],
  ];
  const dummy = new THREE.Object3D();
  const thresholds = new Float32Array(DISTRICT.length);
  DISTRICT.forEach((_d, i) => {
    const h = heights[i] ?? 4;
    const [x, z] = positions[i] ?? [0, -4];
    dummy.position.set(x, h / 2, z);
    dummy.scale.set(0.9, h, 0.9);
    dummy.updateMatrix();
    towers.setMatrixAt(i, dummy.matrix);
    thresholds[i] = 0.16 + (i / DISTRICT.length) * 0.12; // staggered across the sunset band
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
  const towers = new THREE.InstancedMesh(geo, mats.beacon, 4);
  const positions: [number, number][] = [
    [-4.6, -11],
    [-1.6, -13.2],
    [2.2, -11.6],
    [4.4, -13.6],
  ];
  const dummy = new THREE.Object3D();
  positions.forEach(([x, z], i) => {
    const h = 2.4 + i * 0.5;
    dummy.position.set(x, h / 2, z);
    dummy.scale.set(1, h, 1);
    dummy.updateMatrix();
    towers.setMatrixAt(i, dummy.matrix);
  });
  towers.instanceMatrix.needsUpdate = true;
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
  const geo = new THREE.BoxGeometry(2.2, 1.3, 0.1);
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
export function buildInterconnect(mats: Mats): SceneObject {
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

  return {
    group,
    update: (dt, _elapsed, dayness) => {
      // smoothstep(0.6, 0.75, dayness) — the narrative gate: below deep
      // night, bridges + packets are fully invisible.
      const x = THREE.MathUtils.clamp((dayness - 0.6) / (0.75 - 0.6), 0, 1);
      const gate = x * x * (3 - 2 * x);
      (mats.bridge as THREE.MeshBasicMaterial).opacity = gate * 0.06;
      (mats.packet as THREE.MeshBasicMaterial).opacity = gate;

      if (gate > 0.001) {
        states.forEach((s, i) => {
          s.phase = (s.phase + dt * s.speed) % 1;
          samplePoint(s.arc, s.phase, dummy.position);
          dummy.scale.setScalar(gate);
          dummy.updateMatrix();
          packets.setMatrixAt(i, dummy.matrix);
        });
        packets.instanceMatrix.needsUpdate = true;
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
export function buildDock(mats: Mats): {
  scene: SceneObject;
  isLastWindowLit: () => boolean;
} {
  const t = trackDisposables();
  const group = new THREE.Group();
  group.position.set(0, 0, -27);

  const baseGeo = new THREE.CylinderGeometry(3, 3.3, 0.2, 48);
  const knotGeo = new THREE.TorusKnotGeometry(0.5, 0.15, 96, 12);
  t.geometries.push(baseGeo, knotGeo);

  const base = new THREE.Mesh(baseGeo, mats.building);
  const beacon = new THREE.Mesh(knotGeo, mats.beacon);
  beacon.position.y = 1.4;
  group.add(base, beacon);

  const lastWinGeo = new THREE.BoxGeometry(0.3, 0.42, 0.08);
  t.geometries.push(lastWinGeo);
  const lastWindow = new THREE.Mesh(lastWinGeo, mats.lastWindow);
  lastWindow.position.set(1.6, 1.1, 2.4);
  group.add(lastWindow);

  let lit = false;

  return {
    scene: {
      group,
      update: (dt, _elapsed, dayness) => {
        group.rotation.y += dt * 0.05;
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
