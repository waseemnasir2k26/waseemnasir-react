import * as THREE from "three";

/* ============================================================
   CAMERA PATH — plain three.js Catmull-Rom spline, no React.
   Sibling of components/orbit/CameraPath.ts — same damp3 utility,
   different waypoints: a single continuous flyover descending
   from a high city approach down onto a landing-pad dock.
   Waypoints — one per scene: ENTRY / STACK / PROOF / WORK / DOCK.
   ============================================================ */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [0, 8.5, 13], look: [0, 1.5, 0] }, // ENTRY — high approach over the skyline
  { pos: [3.4, 3.6, 2.5], look: [0, 1.4, -4] }, // STACK — descending over the stack district
  { pos: [-2.6, 1.9, -6.5], look: [-1.2, 1.2, -10.5] }, // PROOF — gliding through proof plaza
  { pos: [1.6, 1.3, -14.5], look: [-0.4, 1, -19] }, // WORK — passing the billboard signs
  { pos: [0, 3.2, -23.5], look: [0, 0.4, -29] }, // DOCK — pulled back for the landing pad
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
