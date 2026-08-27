import * as THREE from "three";
import type { SceneObject } from "./SceneObjects";

/* ============================================================
   PHOTO BILLBOARDS — Waseem's own professional photos mounted on
   tower faces (OWNER FIX, 08-27 portfolio expansion). Same
   "flush-mounted city sign" family as CitySignage.ts's boards — a
   dark plate + thin jade frame baked into ONE CanvasTexture — but the
   plate content is a real photo instead of drawn type.

   Aspect-ratio safety: the source photo's natural width/height is
   unknown until the browser decodes it (a plain lazy `new Image()`
   fetch, off the render loop — never blocks first paint or a rAF
   tick). Nothing about this billboard's geometry is guessed ahead of
   that: the plane is a 1x1 zero-opacity placeholder until onload,
   then both the canvas AND the PlaneGeometry are built from the
   photo's own aspect ratio (`cover`-fit into the framed inner rect),
   so the image can never stretch or squash regardless of source shape.
   ============================================================ */

export type PhotoBillboardSpec = {
  id: string;
  /** Local path under /public — served from the SAME origin, no
      network/CORS surface, e.g. "/img/pro/FOO.jpg". */
  url: string;
  /** World-space mount anchor — a LandmarkAnchor from
      SceneObjects.ts' `freeAnchors` pool ({x, roofY, z}). Undefined
      (pool exhausted) skips this billboard rather than crashing. */
  anchor: { x: number; y: number; z: number } | undefined;
  /** Fraction (0-1) of the tower's own height the plate CENTRE sits
      at — 0.5 matches CitySignage's own "mid-facade" nameplate
      convention (the safe default; the 0.8 exception elsewhere in
      this route was hand-verified for one specific taller tower only,
      never assume it generalises). */
  heightFrac: number;
  /** Target world-unit HEIGHT of the finished plate (frame included).
      Width is derived from the photo's own aspect ratio once it
      loads. */
  targetHeight: number;
  appearAt: number;
};

const TOWER_HALF = 0.55; // towers are 1.1 wide — matches AltitudeCanvas.tsx
const inboardOf = (ax: number, w: number) =>
  (ax < 0 ? 1 : -1) * (w / 2 - TOWER_HALF) * 0.9;

/** Frame thickness as a fraction of the plate's own texture width —
    thin jade border, same family as CitySignage's "lightbox" plates. */
const FRAME_FRAC = 0.035;
const FRAME_FILL = "#0F2E2A";
const FRAME_STROKE = "#1FE7C7";
const TEX_DIM = 1024;
const REVEAL_SPAN = 0.05;
const MAX_OPACITY = 0.96;

export function buildPhotoBillboards(specs: PhotoBillboardSpec[]): SceneObject {
  const group = new THREE.Group();
  const materials: THREE.MeshBasicMaterial[] = [];
  const textures: THREE.Texture[] = [];
  let disposed = false;

  const recs: {
    mesh: THREE.Mesh;
    mat: THREE.MeshBasicMaterial;
    appearAt: number;
    geo: THREE.BufferGeometry;
  }[] = [];

  specs.forEach((spec) => {
    if (!spec.anchor) return; // tower pool exhausted for this district — skip, don't crash
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: true,
      toneMapped: false,
    });
    materials.push(mat);

    // 1x1 placeholder — invisible (mesh.visible=false) so it costs
    // nothing to sit in the graph for the brief window before the image
    // decodes; real size/position land once the aspect ratio is known.
    let geo: THREE.BufferGeometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = false;
    group.add(mesh);
    const rec = { mesh, mat, appearAt: spec.appearAt, geo };
    recs.push(rec);

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
      const plateH = spec.targetHeight;
      const plateW = plateH * aspect;

      const cw = TEX_DIM;
      const ch = Math.max(1, Math.round(TEX_DIM / aspect));
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const fpx = Math.max(4, cw * FRAME_FRAC);
      // Frame fill, full canvas — reads as the mounted casing behind
      // the photo's own edge.
      ctx.fillStyle = FRAME_FILL;
      ctx.fillRect(0, 0, cw, ch);

      // Photo — cover-fit into the inset rect (frame margin on all
      // sides) so the source image is cropped, never stretched, to
      // fill its own frame.
      const ix = fpx;
      const iy = fpx;
      const iw = cw - fpx * 2;
      const ih = ch - fpx * 2;
      const dstAspect = iw / ih;
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (aspect > dstAspect) {
        sw = img.naturalHeight * dstAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / dstAspect;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, ix, iy, iw, ih);

      // Thin jade hairline frame, stroked on top of the photo edge.
      ctx.strokeStyle = FRAME_STROKE;
      ctx.lineWidth = Math.max(2, fpx * 0.4);
      ctx.globalAlpha = 0.92;
      ctx.strokeRect(fpx * 0.5, fpx * 0.5, cw - fpx, ch - fpx);
      ctx.globalAlpha = 1;

      const tex = new THREE.CanvasTexture(canvas);
      // Photo pixels are colour data, same as Facade.ts's own albedo
      // map — untagged reads as linear and washes out under this
      // scene's ACES filmic response without this.
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      textures.push(tex);

      mat.map = tex;
      mat.needsUpdate = true;

      const oldGeo = rec.geo;
      const newGeo = new THREE.PlaneGeometry(plateW, plateH);
      mesh.geometry = newGeo;
      rec.geo = newGeo;
      oldGeo.dispose();

      const a = spec.anchor!;
      const towerH = a.y - 0.5;
      mesh.position.set(
        a.x + inboardOf(a.x, plateW),
        towerH * spec.heightFrac,
        a.z + TOWER_HALF + 0.02,
      );
    };
    img.onerror = () => {
      // Fail-soft: never show a broken-image quad in the city — leave
      // this billboard permanently hidden (mat has no map, visible
      // stays false forever in update() below).
    };
    img.src = spec.url;
  });

  return {
    group,
    update: (_dt, _elapsed, progress) => {
      recs.forEach((r) => {
        if (!r.mat.map) return; // still loading (or failed) — stay hidden
        const reveal = THREE.MathUtils.clamp(
          (progress - r.appearAt) / REVEAL_SPAN,
          0,
          1,
        );
        const on = reveal > 0.01;
        if (r.mesh.visible !== on) r.mesh.visible = on;
        if (!on) return;
        const target = reveal * MAX_OPACITY;
        if (Math.abs(r.mat.opacity - target) > 0.005) r.mat.opacity = target;
      });
    },
    dispose: () => {
      disposed = true;
      recs.forEach((r) => r.geo.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
