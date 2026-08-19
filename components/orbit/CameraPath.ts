import * as THREE from "three";

/* ============================================================
   CAMERA PATH — plain three.js Catmull-Rom spline, no React.
   Waypoints — one per scene: ENTRY / STACK / PROOF / WORK / DOCK.
   ============================================================ */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [0, 0.4, 9], look: [0, 0, 0] }, // ENTRY — establishing shot of the core
  { pos: [3.2, 1.1, 3.6], look: [0.4, 0.2, 0] }, // STACK — orbiting the emblem cluster
  { pos: [-2.6, 0.6, -1.4], look: [-3.5, 0, -4.5] }, // PROOF — sliding toward the constellation
  { pos: [-1.2, -0.5, -8.4], look: [-1.2, -0.5, -12] }, // WORK — passing the floating panels
  { pos: [0, 2.4, -9], look: [0, -0.3, -18] }, // DOCK — pulled back so the platform reads
  // as a small island in the distance, not a wall filling the frame
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
