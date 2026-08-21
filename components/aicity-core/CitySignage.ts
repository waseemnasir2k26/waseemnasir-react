import * as THREE from "three";

/* ============================================================
   CITY SIGNAGE — building names rendered INSIDE the city.

   Not an HTML overlay. An overlay pill projected onto the screen
   reads as a HUD stuck to the glass: it never occludes behind a
   nearer tower, never takes the scene fog, and slides across the
   facade as the camera turns. These are actual meshes parented to
   the district group, so a sign:
     - rotates and drifts with the city it is bolted to,
     - is hidden by any building standing in front of it (depth test),
     - takes the same fog ramp as the facade behind it, and
     - grows/shrinks with real perspective as the camera pushes in.

   Each sign is one PlaneGeometry wearing a CanvasTexture of the
   name. MeshBasicMaterial (unlit) so the lettering reads as lit
   signage after dark rather than dimming with the sun — the way
   real rooftop signage behaves — while `fog: true` keeps it inside
   the same depth haze as everything else.

   Text is drawn once into a 2D canvas at build time; there is no
   per-frame texture work. update() only writes material.opacity.
   ============================================================ */

export type SignSpec = {
  id: string;
  /** Building name — the big line. */
  name: string;
  /** Optional smaller second line (what the building does). */
  sub?: string;
  /** Sign centre, in the parent group's local space. */
  position: THREE.Vector3;
  /** Sign width in world units. */
  width: number;
  /** Sign height in world units. */
  height: number;
  /** Y-rotation so the sign lies flat on the facade it belongs to. */
  rotationY?: number;
  /** Scroll progress at which the sign lights up. */
  appearAt: number;
};

export type CitySignageOptions = {
  /** Colour of the big line. */
  color?: string;
  /** Colour of the sub line + the hairline rule. */
  accent?: string;
  /** Backing-plate fill behind the letters. */
  plate?: string;
  /** Scroll distance over which a sign fades up. */
  revealSpan?: number;
  /** Max opacity — signage should sit just under full white. */
  maxOpacity?: number;
};

export type CitySignageHandle = {
  group: THREE.Group;
  /** Call per frame with the same scroll scalar the scene uses. */
  update: (progress: number) => void;
  dispose: () => void;
};

/** Texel density — px per world unit. 320 puts a 2.5-unit sign at
    800px wide, which stays crisp at the closest camera approach
    without paying for a full 1k texture per building. */
const PX_PER_UNIT = 320;
const MAX_DIM = 1024;
/** Sub line is only drawn when the plate is tall enough to carry it
    legibly; below this the name gets the whole plate instead of two
    unreadable lines. */
const MIN_SUB_PX = 60;

function drawSignTexture(
  spec: SignSpec,
  o: Required<Pick<CitySignageOptions, "color" | "accent" | "plate">>,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = Math.min(MAX_DIM, Math.round(spec.width * PX_PER_UNIT));
  const h = Math.min(MAX_DIM, Math.round(spec.height * PX_PER_UNIT));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Backing plate — a dark panel so the lettering never has to fight
  // the lit window grid behind it.
  ctx.fillStyle = o.plate;
  ctx.fillRect(0, 0, w, h);

  // Accent rule down the left edge: reads as a mounted sign rather
  // than a decal, and gives the eye an entry point at small sizes.
  ctx.fillStyle = o.accent;
  ctx.fillRect(0, 0, Math.max(2, w * 0.012), h);

  const hasSub = Boolean(spec.sub) && h >= MIN_SUB_PX;
  const padX = w * 0.06;
  const usable = w - padX * 2;

  // Fit the name to the plate: start from a height-derived size and
  // shrink until it measures inside the usable width. Bounded loop —
  // never depends on the font actually being loaded.
  const nameText = spec.name.toUpperCase();
  let fontSize = hasSub ? h * 0.46 : h * 0.62;
  const fontFor = (size: number, weight: number) =>
    `${weight} ${size}px "IBM Plex Mono", ui-monospace, "Courier New", monospace`;

  for (let i = 0; i < 24; i++) {
    ctx.font = fontFor(fontSize, 600);
    if (ctx.measureText(nameText).width <= usable) break;
    fontSize *= 0.92;
  }

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = o.color;
  // A soft glow under the letters so the sign reads as emissive at
  // night without needing a second additive pass.
  ctx.shadowColor = o.accent;
  ctx.shadowBlur = Math.max(4, h * 0.06);
  ctx.font = fontFor(fontSize, 600);
  ctx.fillText(nameText, padX, hasSub ? h * 0.38 : h * 0.5);
  ctx.shadowBlur = 0;

  if (spec.sub && hasSub) {
    const subText = spec.sub.toUpperCase();
    let subSize = h * 0.22;
    for (let i = 0; i < 24; i++) {
      ctx.font = fontFor(subSize, 400);
      if (ctx.measureText(subText).width <= usable) break;
      subSize *= 0.92;
    }
    ctx.font = fontFor(subSize, 400);
    ctx.fillStyle = o.accent;
    ctx.globalAlpha = 0.9;
    ctx.fillText(subText, padX, h * 0.72);
    ctx.globalAlpha = 1;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function createCitySignage(
  specs: SignSpec[],
  opts: CitySignageOptions = {},
): CitySignageHandle {
  const {
    color = "#EAF4F1",
    accent = "#1FE7C7",
    plate = "rgba(4,20,18,0.92)",
    revealSpan = 0.05,
    maxOpacity = 0.94,
  } = opts;

  const group = new THREE.Group();
  group.name = "city-signage";

  const textures: THREE.Texture[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const recs = specs.map((spec) => {
    const tex = drawSignTexture(spec, { color, accent, plate });
    textures.push(tex);

    const geo = new THREE.PlaneGeometry(spec.width, spec.height);
    geometries.push(geo);

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0,
      // depthWrite off so a sign never punches a hole in the tower it
      // is mounted on; depthTest stays ON so towers in FRONT still
      // occlude it — that is the whole reason this is a mesh.
      depthWrite: false,
      fog: true,
      toneMapped: false,
    });
    materials.push(mat);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(spec.position);
    if (spec.rotationY) mesh.rotation.y = spec.rotationY;
    // Hidden until its reveal — an invisible mesh still costs a draw
    // call, so kill visibility outright rather than just alpha 0.
    mesh.visible = false;
    group.add(mesh);

    return { mesh, mat, appearAt: spec.appearAt };
  });

  const update = (progress: number) => {
    for (const r of recs) {
      const reveal = THREE.MathUtils.clamp(
        (progress - r.appearAt) / revealSpan,
        0,
        1,
      );
      const on = reveal > 0.01;
      if (r.mesh.visible !== on) r.mesh.visible = on;
      if (!on) continue;
      const target = reveal * maxOpacity;
      if (Math.abs(r.mat.opacity - target) > 0.005) r.mat.opacity = target;
    }
  };

  const dispose = () => {
    recs.forEach((r) => group.remove(r.mesh));
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    recs.length = 0;
  };

  return { group, update, dispose };
}
