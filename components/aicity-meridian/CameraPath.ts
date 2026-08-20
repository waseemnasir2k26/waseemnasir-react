import * as THREE from "three";

/* ============================================================
   CAMERA PATH — plain three.js Catmull-Rom spline, no React.
   Sibling of components/skyline/CameraPath.ts — same damp3
   utility, 6 waypoints (one per STAGE) instead of 5: a single
   continuous descent from a high golden-hour approach down onto
   the midnight dock, passing the stack towers, proof plaza,
   work boulevard and the deep-night interconnection stretch.
   Camera never reverses direction of travel; scrubbing backward
   just re-plays the same spline in reverse (uDayness derives
   everything, including which way is "forward").
   ============================================================ */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [0, 9, 14], look: [0, 1.6, 0] }, // GOLDEN — high approach, sun still up
  { pos: [3.2, 3.4, 2.2], look: [0, 1.4, -4] }, // SUNSET — stack district ignites
  { pos: [-2.4, 1.8, -6.5], look: [-1, 1.1, -10.5] }, // DUSK — proof plaza, streetlamps
  { pos: [1.8, 1.4, -14], look: [-0.3, 1, -18.5] }, // NIGHTFALL — work boulevard billboards
  { pos: [-1, 2.6, -19.5], look: [0.6, 1.2, -24.5] }, // DEEP NIGHT — bridges arc between districts
  { pos: [0, 4.2, -28], look: [0, 0.5, -34] }, // MIDNIGHT — widest pull-back, the dock
];

export function buildCameraCurves() {
  const positions = WAYPOINTS.map((w) => new THREE.Vector3(...w.pos));
  const looks = WAYPOINTS.map((w) => new THREE.Vector3(...w.look));
  return {
    posCurve: new THREE.CatmullRomCurve3(positions, false, "catmullrom", 0.5),
    lookCurve: new THREE.CatmullRomCurve3(looks, false, "catmullrom", 0.5),
  };
}

/** Exponential (framerate-independent) damp toward a target vector, in place. */
export function damp3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number,
) {
  const f = 1 - Math.exp(-lambda * dt);
  current.x += (target.x - current.x) * f;
  current.y += (target.y - current.y) * f;
  current.z += (target.z - current.z) * f;
}
