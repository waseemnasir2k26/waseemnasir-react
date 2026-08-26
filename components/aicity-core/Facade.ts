import * as THREE from "three";

/* ============================================================
   FACADE — procedural building surface detail.

   The realism ceiling on these scenes was never the render
   pipeline; it was that every building is one flat colour. A
   single untextured MeshStandardMaterial spread across a few
   hundred instanced slabs reads as "3D demo" no matter how good
   the tone mapping and bloom on top of it are.

   Everything here is drawn into a CanvasTexture at runtime. No
   files, no network, nothing to add to the bundle — which is
   what the no-external-asset-host rule requires, and which also
   means the whole facade can be re-keyed by changing two colours
   rather than re-exporting an atlas.

   Two maps come out of one draw:
     · map          — floor slabs, mullions, grime. sRGB.
     · roughnessMap — the same structure as gloss variation, so
                      light catches the panels unevenly. LINEAR,
                      never sRGB (it is data, not colour).

   Both tile. Because the buildings are instanced boxes with
   per-instance non-uniform scale, the tiling stretches by
   building — which is a feature here, not a bug: it makes floor
   bands sit at different heights on different towers, the way a
   real skyline does.
   ============================================================ */

export type FacadeMaps = {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose(): void;
};

/** Deterministic value noise so the city is identical every load. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createFacadeMaps(opts: {
  base: string;
  seam: string;
  size?: number;
  floors?: number;
  bays?: number;
  seed?: number;
}): FacadeMaps {
  const { base, seam, size = 512, floors = 10, bays = 6, seed = 8831 } = opts;
  const rand = seeded(seed);

  const albedo = document.createElement("canvas");
  albedo.width = albedo.height = size;
  const a = albedo.getContext("2d")!;

  const rough = document.createElement("canvas");
  rough.width = rough.height = size;
  const r = rough.getContext("2d")!;

  a.fillStyle = base;
  a.fillRect(0, 0, size, size);
  // Mid grey = the material's own roughness value passes through
  // unchanged; the detail below pushes either side of it.
  r.fillStyle = "#808080";
  r.fillRect(0, 0, size, size);

  // ── Floor slabs. A horizontal band per storey with a bright
  // top lip and a shadowed underside — the single strongest cue
  // that a box is a building rather than a box, because it gives
  // the eye a repeating human-scale unit to read height against.
  const floorH = size / floors;
  for (let f = 0; f < floors; f++) {
    const y = Math.round(f * floorH);
    a.fillStyle = "rgba(0,0,0,0.34)";
    a.fillRect(0, y, size, Math.max(2, floorH * 0.06));
    a.fillStyle = "rgba(255,255,255,0.05)";
    a.fillRect(0, y + Math.max(2, floorH * 0.06), size, 1);

    // Slab edges are cast concrete, not glass — rougher.
    r.fillStyle = "rgba(255,255,255,0.55)";
    r.fillRect(0, y, size, Math.max(2, floorH * 0.06));
  }

  // ── Vertical mullions dividing each floor into bays. Kept
  // subtle: too much contrast here and the facade reads as a
  // wireframe rather than a surface.
  const bayW = size / bays;
  for (let b = 0; b < bays; b++) {
    const x = Math.round(b * bayW);
    a.fillStyle = "rgba(0,0,0,0.2)";
    a.fillRect(x, 0, Math.max(1, bayW * 0.04), size);
    r.fillStyle = "rgba(255,255,255,0.3)";
    r.fillRect(x, 0, Math.max(1, bayW * 0.04), size);
  }

  // ── Per-bay glass variation. Real curtain walling is never one
  // tone: panels age differently, blinds sit at different heights,
  // some units are vacant. This is the cheapest source of the
  // asymmetry that separates a render from a photograph.
  for (let f = 0; f < floors; f++) {
    for (let b = 0; b < bays; b++) {
      const jitter = rand();
      if (jitter < 0.55) continue;
      const x = b * bayW + bayW * 0.08;
      const y = f * floorH + floorH * 0.18;
      const w = bayW * 0.84;
      const h = floorH * 0.64;
      const shade = (jitter - 0.55) * 0.22;
      a.fillStyle = `rgba(255,255,255,${shade.toFixed(3)})`;
      a.fillRect(x, y, w, h);
      // Glazing is glossier than the frame around it.
      r.fillStyle = `rgba(0,0,0,${(0.18 + jitter * 0.2).toFixed(3)})`;
      r.fillRect(x, y, w, h);
    }
  }

  // ── Grime. Soft vertical streaks weighted toward the lower half,
  // because that is where rain-carried dirt actually collects. This
  // is the layer people never consciously notice and always feel.
  for (let i = 0; i < 90; i++) {
    const x = rand() * size;
    const w = 2 + rand() * 14;
    const top = rand() * size * 0.55;
    const grad = a.createLinearGradient(0, top, 0, size);
    const strength = 0.03 + rand() * 0.07;
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(0,0,0,${strength.toFixed(3)})`);
    a.fillStyle = grad;
    a.fillRect(x, top, w, size - top);

    const rg = r.createLinearGradient(0, top, 0, size);
    rg.addColorStop(0, "rgba(255,255,255,0)");
    rg.addColorStop(1, `rgba(255,255,255,${(strength * 3).toFixed(3)})`);
    r.fillStyle = rg;
    r.fillRect(x, top, w, size - top);
  }

  // ── A seam accent so the tint stays tied to the scene palette
  // rather than drifting to neutral grey under the grime.
  a.globalCompositeOperation = "overlay";
  a.fillStyle = seam;
  a.globalAlpha = 0.12;
  a.fillRect(0, 0, size, size);
  a.globalAlpha = 1;
  a.globalCompositeOperation = "source-over";

  const map = new THREE.CanvasTexture(albedo);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;

  const roughnessMap = new THREE.CanvasTexture(rough);
  // NOT sRGB. A roughness map is data; tagging it as colour would
  // push every value through a transfer function and quietly
  // change the material response.
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

/* ------------------------------------------------------------
   ROOFSCAPE

   A skyline is read as a silhouette against the sky long before
   any surface detail registers, and a field of flat-topped boxes
   all terminating in a clean horizontal line is the single most
   artificial thing about these scenes.

   This returns instanced roof clutter — masts, plant housings,
   water tanks — to be scattered across a subset of buildings.
   Two extra draw calls total, against a budget currently sitting
   at roughly a dozen.
   ------------------------------------------------------------ */
export type Roofscape = {
  group: THREE.Group;
  dispose(): void;
};

export function createRoofscape(
  slots: { x: number; z: number; h: number; w: number; d: number }[],
  material: THREE.Material,
  rand: () => number,
): Roofscape {
  const group = new THREE.Group();

  // Pass 1: masts. Thin, tall, and the only thing that breaks the
  // roofline vertically — disproportionately effective per triangle.
  const mastSlots = slots.filter(() => rand() < 0.26);
  const mastGeo = new THREE.BoxGeometry(0.045, 1, 0.045);
  const masts = new THREE.InstancedMesh(mastGeo, material, mastSlots.length);
  const d = new THREE.Object3D();
  mastSlots.forEach((s, i) => {
    const hh = 0.35 + rand() * 0.85;
    d.position.set(
      s.x + (rand() - 0.5) * s.w * 0.5,
      s.h + hh / 2,
      s.z + (rand() - 0.5) * s.d * 0.5,
    );
    d.scale.set(1, hh, 1);
    d.rotation.set(0, 0, 0);
    d.updateMatrix();
    masts.setMatrixAt(i, d.matrix);
  });
  masts.instanceMatrix.needsUpdate = true;
  masts.frustumCulled = true;
  group.add(masts);

  // Pass 2: plant housings — the low blocks that sit on real roofs
  // holding lift motors and air handling. Slightly rotated off the
  // building's own axis, because nothing on a real roof is square
  // to the tower, and that misalignment is what stops a scattered
  // detail pass from looking like a scattered detail pass.
  const plantSlots = slots.filter(() => rand() < 0.4);
  const plantGeo = new THREE.BoxGeometry(1, 1, 1);
  const plant = new THREE.InstancedMesh(plantGeo, material, plantSlots.length);
  plantSlots.forEach((s, i) => {
    const pw = s.w * (0.2 + rand() * 0.3);
    const pd = s.d * (0.2 + rand() * 0.3);
    const ph = 0.08 + rand() * 0.18;
    d.position.set(
      s.x + (rand() - 0.5) * s.w * 0.35,
      s.h + ph / 2,
      s.z + (rand() - 0.5) * s.d * 0.35,
    );
    d.scale.set(pw, ph, pd);
    d.rotation.set(0, (rand() - 0.5) * 0.5, 0);
    d.updateMatrix();
    plant.setMatrixAt(i, d.matrix);
  });
  plant.instanceMatrix.needsUpdate = true;
  plant.frustumCulled = true;
  group.add(plant);

  return {
    group,
    dispose() {
      mastGeo.dispose();
      plantGeo.dispose();
    },
  };
}
