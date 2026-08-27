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
  /** OPT-IN (Altitude Zero hero billboards, 2026-08-27) — X-rotation so
      a free-standing plate can be tilted to face a camera that is
      itself pitched down/up, instead of always standing dead vertical.
      No-op for every existing caller (Meridian, district nameplates)
      since they never set it. */
  rotationX?: number;
  /** Scroll progress at which the sign lights up. */
  appearAt: number;
  /** OPT-IN (Altitude Zero hero billboards, 2026-08-27 fix round) —
      scroll progress at which a free-standing plate starts fading back
      OUT (mirrors appearAt's fade-in, same revealSpan). For a plate
      mounted close to the camera's own path early in the descent, world
      distance shrinks fast — left un-bounded it grows to fill/overrun
      the frame a few scroll-percent after its intended stop
      (screenshot-confirmed: the hero-pitch board at the 15% stop,
      oversized and clipped past the left edge). Undefined (default)
      keeps a sign lit forever once revealed, i.e. a no-op for every
      existing caller (Meridian, district nameplates, every other
      Altitude board). */
  hideAfter?: number;

  /* ── OPT-IN "billboard" fields (Altitude Zero, 2026-08-27) ──
     None of these are read unless present, and their presence is what
     switches drawSignTexture into the billboard layout instead of the
     original nameplate layout below — a spec with none of them set
     (every existing Meridian call) renders byte-for-byte the same as
     before. See drawBillboardTexture(). */
  /** Small eyebrow line above the headline (e.g. a category tag). */
  eyebrow?: string;
  /** Paragraph of body copy under the headline — auto word-wrapped to
      fit the plate width, capped at maxBodyLines. */
  body?: string;
  /** Small status pill drawn top-right (e.g. "DELIVERED"/"LIVE"/"DEMO"). */
  chip?: string;
  /** Headline font size as a fraction of plate height. Default 0.16. */
  headlineSize?: number;
  /** Max lines the headline is allowed to wrap to before shrinking
      further. Default 3. */
  maxHeadlineLines?: number;
  /** Max body-copy lines rendered (extra lines are dropped, never
      truncated mid-word — callers should pre-shorten copy that doesn't
      fit rather than rely on silent clipping). Default 5. */
  maxBodyLines?: number;
  /** Per-sign override of the texture's max pixel dimension — some
      hero billboards need more texel density than the default MAX_DIM
      to stay crisp at their larger world-unit size. */
  texDim?: number;
};

export type CitySignageOptions = {
  /** Colour of the big line. */
  color?: string;
  /** Colour of the sub line + the hairline rule. */
  accent?: string;
  /** Backing-plate fill behind the letters. */
  plate?: string;
  /** Full CSS font-family stack for headlines/eyebrows/chips. Default =
      the original mono stack, so existing callers render unchanged.
      Pass the route's real (next/font-mangled) family — read it from
      the CSS var at runtime — or the canvas bakes a Courier fallback. */
  headlineFont?: string;
  /** Full CSS font-family stack for billboard body copy. Defaults to
      headlineFont. */
  bodyFont?: string;
  /** Scroll distance over which a sign fades up. */
  revealSpan?: number;
  /** Max opacity — signage should sit just under full white. */
  maxOpacity?: number;
  /** Opt-in hairline border drawn around the whole plate edge, so the
      sign reads as a physical lightbox bolted to the facade rather than
      a decal — a full rectangle stroke, on top of the existing left-edge
      accent rule. Undefined (default) keeps the old left-rule-only look,
      i.e. this is a no-op for any caller that doesn't pass it (Meridian
      never does — its rendered output is unchanged). */
  border?: string;
  /** Body-copy text colour for billboard-variant signs. Defaults to
      `color` at reduced alpha. No-op for nameplate-variant signs. */
  bodyColor?: string;
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
const PX_PER_UNIT = 512;
const MAX_DIM = 2048;
/** Default type stack — kept as the fallback so callers that never pass
    fonts (Meridian) keep their existing look. */
const MONO_STACK = '"IBM Plex Mono", ui-monospace, "Courier New", monospace';
/** Sub line is only drawn when the plate is tall enough to carry it
    legibly; below this the name gets the whole plate instead of two
    unreadable lines. */
const MIN_SUB_PX = 60;

function drawSignTexture(
  spec: SignSpec,
  o: Required<Pick<CitySignageOptions, "color" | "accent" | "plate">> &
    Pick<CitySignageOptions, "border" | "headlineFont">,
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

  // Opt-in hairline border around the whole plate — closes the box so
  // the sign reads as a physical lightbox casing (bolted signage) rather
  // than a name floating in front of the facade. Inset by half its own
  // width so the stroke stays fully inside the plate's own texture (a
  // stroke centred on the edge would bleed half its width off-canvas).
  if (o.border) {
    const lw = Math.max(2, w * 0.01);
    ctx.strokeStyle = o.border;
    ctx.lineWidth = lw;
    ctx.globalAlpha = 0.85;
    ctx.strokeRect(lw / 2, lw / 2, w - lw, h - lw);
    ctx.globalAlpha = 1;
  }

  const hasSub = Boolean(spec.sub) && h >= MIN_SUB_PX;
  const padX = w * 0.06;
  const usable = w - padX * 2;

  // Fit the name to the plate: start from a height-derived size and
  // shrink until it measures inside the usable width. Bounded loop —
  // never depends on the font actually being loaded.
  const nameText = spec.name.toUpperCase();
  let fontSize = hasSub ? h * 0.46 : h * 0.62;
  const fontFor = (size: number, weight: number) =>
    `${weight} ${size}px ${o.headlineFont ?? MONO_STACK}`;

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
  ctx.shadowBlur = Math.max(2, h * 0.02);
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

/** Greedy word-wrap: splits `text` into lines that each measure within
    `maxWidth` under whatever font is currently set on `ctx`. A single
    word wider than maxWidth is placed on its own line rather than
    split mid-word (this module never truncates a syllable). */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (cur && ctx.measureText(test).width > maxWidth) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/* ============================================================
   BILLBOARD VARIANT — larger multi-line message plate: eyebrow +
   wrapped headline + wrapped body copy + an optional status chip.
   Only entered when a SignSpec carries `eyebrow` and/or `body`
   (drawSignTexture's plain nameplate layout above is untouched and
   stays the default for every spec that doesn't). Same backing-plate
   + accent-rule + border treatment as the nameplate variant, so a
   billboard still reads as the same family of mounted signage.
   ============================================================ */
function drawBillboardTexture(
  spec: SignSpec,
  o: Required<
    Pick<CitySignageOptions, "color" | "accent" | "plate" | "bodyColor">
  > &
    Pick<CitySignageOptions, "border" | "headlineFont" | "bodyFont">,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const dim = spec.texDim ?? MAX_DIM;
  const w = Math.min(dim, Math.round(spec.width * PX_PER_UNIT));
  const h = Math.min(dim, Math.round(spec.height * PX_PER_UNIT));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = o.plate;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = o.accent;
  ctx.fillRect(0, 0, Math.max(2, w * 0.012), h);

  if (o.border) {
    const lw = Math.max(2, w * 0.008);
    ctx.strokeStyle = o.border;
    ctx.lineWidth = lw;
    ctx.globalAlpha = 0.85;
    ctx.strokeRect(lw / 2, lw / 2, w - lw, h - lw);
    ctx.globalAlpha = 1;
  }

  const fontFor = (size: number, weight: number, body = false) =>
    `${weight} ${size}px ${
      body
        ? (o.bodyFont ?? o.headlineFont ?? MONO_STACK)
        : (o.headlineFont ?? MONO_STACK)
    }`;

  const padX = w * 0.055;
  const usable = w - padX * 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  let cursorY = h * 0.16;

  // Status chip — measured first (top-right) so the eyebrow/headline
  // width budget can steer clear of it, but drawn last so it always
  // sits on top of any text that runs long.
  let chipReserve = 0;
  if (spec.chip) {
    ctx.font = fontFor(Math.max(10, h * 0.05), 600);
    chipReserve = ctx.measureText(spec.chip.toUpperCase()).width + h * 0.14;
  }

  if (spec.eyebrow) {
    const eyebrowSize = Math.max(9, h * 0.052);
    ctx.font = fontFor(eyebrowSize, 600);
    ctx.fillStyle = o.accent;
    ctx.globalAlpha = 0.95;
    ctx.fillText(
      spec.eyebrow.toUpperCase(),
      padX,
      cursorY,
      usable - chipReserve,
    );
    ctx.globalAlpha = 1;
    cursorY += eyebrowSize * 1.9;
  }

  // Headline — wrap + shrink until it fits within maxHeadlineLines.
  let headSize = Math.max(12, h * (spec.headlineSize ?? 0.16));
  const maxHeadLines = spec.maxHeadlineLines ?? 3;
  let headLines: string[] = [spec.name];
  for (let i = 0; i < 10; i++) {
    ctx.font = fontFor(headSize, 700);
    headLines = wrapText(ctx, spec.name, usable);
    if (headLines.length <= maxHeadLines) break;
    headSize *= 0.9;
  }
  ctx.font = fontFor(headSize, 700);
  ctx.fillStyle = o.color;
  ctx.shadowColor = o.accent;
  ctx.shadowBlur = Math.max(3, h * 0.018);
  headLines.slice(0, maxHeadLines).forEach((line) => {
    cursorY += headSize * 0.95;
    ctx.fillText(line, padX, cursorY);
    cursorY += headSize * 0.28;
  });
  ctx.shadowBlur = 0;
  cursorY += headSize * 0.3;

  if (spec.body) {
    const bodySize = Math.max(9, h * 0.044);
    ctx.font = fontFor(bodySize, 400, true);
    const bodyLines = wrapText(ctx, spec.body, usable).slice(
      0,
      spec.maxBodyLines ?? 5,
    );
    ctx.fillStyle = o.bodyColor;
    ctx.globalAlpha = 0.92;
    bodyLines.forEach((line) => {
      cursorY += bodySize * 1.4;
      ctx.fillText(line, padX, cursorY);
    });
    ctx.globalAlpha = 1;
  }

  if (spec.chip) {
    const chipText = spec.chip.toUpperCase();
    const chipFontSize = Math.max(10, h * 0.05);
    ctx.font = fontFor(chipFontSize, 600);
    const tw = ctx.measureText(chipText).width;
    const chipPadX = h * 0.045;
    const chipW = tw + chipPadX * 2;
    const chipH = h * 0.1;
    const chipX = w - padX - chipW;
    const chipY = h * 0.09;
    const draw = () => {
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(chipX, chipY, chipW, chipH, chipH / 2);
      } else {
        ctx.beginPath();
        ctx.rect(chipX, chipY, chipW, chipH);
      }
    };
    ctx.fillStyle = o.accent;
    ctx.globalAlpha = 0.18;
    draw();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = o.accent;
    ctx.lineWidth = Math.max(1, h * 0.0035);
    draw();
    ctx.stroke();
    ctx.fillStyle = o.accent;
    ctx.textBaseline = "middle";
    ctx.fillText(chipText, chipX + chipPadX, chipY + chipH / 2 + chipH * 0.03);
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
    border,
    bodyColor = color,
    headlineFont,
    bodyFont,
  } = opts;
  const drawOpts = {
    color,
    accent,
    plate,
    border,
    bodyColor,
    headlineFont,
    bodyFont,
  };

  const group = new THREE.Group();
  group.name = "city-signage";

  const textures: THREE.Texture[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const recs = specs.map((spec) => {
    // Billboard variant (eyebrow/body present) vs the original nameplate
    // layout — every existing caller (Meridian) never sets eyebrow/body,
    // so it always takes the untouched drawSignTexture path below.
    const tex =
      spec.eyebrow || spec.body
        ? drawBillboardTexture(spec, drawOpts)
        : drawSignTexture(spec, drawOpts);
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
    if (spec.rotationX) mesh.rotation.x = spec.rotationX;
    // Hidden until its reveal — an invisible mesh still costs a draw
    // call, so kill visibility outright rather than just alpha 0.
    mesh.visible = false;
    group.add(mesh);

    return {
      mesh,
      mat,
      appearAt: spec.appearAt,
      hideAfter: spec.hideAfter,
    };
  });

  // Canvas textures are drawn synchronously at build time — if the web
  // fonts haven't finished loading yet, the browser bakes the FALLBACK
  // face (Courier) into every plate permanently. Redraw once the route's
  // fonts are actually ready so the plates carry the real typography.
  let disposed = false;
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      if (disposed) return;
      specs.forEach((spec, i) => {
        const rec = recs[i];
        const old = textures[i];
        if (!rec || !old) return;
        const fresh =
          spec.eyebrow || spec.body
            ? drawBillboardTexture(spec, drawOpts)
            : drawSignTexture(spec, drawOpts);
        rec.mat.map = fresh;
        rec.mat.needsUpdate = true;
        textures[i] = fresh;
        old.dispose();
      });
    });
  }

  const update = (progress: number) => {
    for (const r of recs) {
      const revealIn = THREE.MathUtils.clamp(
        (progress - r.appearAt) / revealSpan,
        0,
        1,
      );
      // hideAfter mirrors the fade-in as a fade-out over the same span —
      // undefined (every caller except the hero-mast boards) leaves
      // revealOut permanently at 1, i.e. no behaviour change.
      const revealOut =
        r.hideAfter === undefined
          ? 1
          : THREE.MathUtils.clamp(
              (r.hideAfter + revealSpan - progress) / revealSpan,
              0,
              1,
            );
      const reveal = revealIn * revealOut;
      const on = reveal > 0.01;
      if (r.mesh.visible !== on) r.mesh.visible = on;
      if (!on) continue;
      const target = reveal * maxOpacity;
      if (Math.abs(r.mat.opacity - target) > 0.005) r.mat.opacity = target;
    }
  };

  const dispose = () => {
    disposed = true;
    recs.forEach((r) => group.remove(r.mesh));
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    recs.length = 0;
  };

  return { group, update, dispose };
}
