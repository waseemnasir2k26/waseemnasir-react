import * as THREE from "three";

/* ============================================================
   CAMERA PATH — plain three.js Catmull-Rom spline, no React.
   Sibling of components/skyline/CameraPath.ts (identical damp3
   utility) — new waypoints for SIGNALGRID's 6 scenes: ENTRY /
   GRID / TOWER FLYBYS / PROOF SUBSTATION / WORKS BOULEVARD /
   UPLINK. Near-static hero, overhead lift into the grid, a
   street-grazing dolly past the service towers, then a pull-out
   past the client works and a tilt up the tallest tower.
   ============================================================ */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [3.4, 3.4, 3.2], look: [0.2, 2.1, -6.5] }, // ENTRY — 3/4 angle straight into the STACK cluster, dense at load
  { pos: [4.2, 6.5, 0.5], look: [0, 1.6, -6] }, // GRID — 35deg overhead lift over the stack
  { pos: [-2.8, 1.5, -12.5], look: [-1.6, 1.3, -16.5] }, // TOWER FLYBYS — street-grazing dolly
  { pos: [1.4, 1.7, -22], look: [-1, 1.4, -26] }, // PROOF SUBSTATION — plaza glide
  { pos: [-1.2, 1.9, -28.5], look: [1.4, 1.4, -32.5] }, // WORKS BOULEVARD — client towers
  { pos: [0, 5.5, -33], look: [0, 9.5, -37] }, // UPLINK — tilt up the tallest tower
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
