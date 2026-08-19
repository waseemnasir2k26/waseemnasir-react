import * as THREE from "three";

/* ============================================================
   CAMERA PATH — plain three.js Catmull-Rom spline, no React.
   Pattern lifted directly from components/orbit/CameraPath.ts.

   Unlike orbit (which orbits a static core), timeline is a
   straight FORWARD journey: every waypoint's z is more negative
   than the last, so scrolling always reads as travel deeper into
   the scene, alongside the glowing rail.

   Waypoints — one per scene: START / RAIL / MILESTONES / PLATFORM / ARROW.
   ============================================================ */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [0, 1.3, 9], look: [0, 0.6, 3] }, // START — the 2019 gate, dead ahead
  { pos: [1.6, 0.9, -1], look: [-0.8, 0.5, -6] }, // RAIL — passing the docked stack emblems
  { pos: [-1.4, 0.5, -11], look: [0.9, 0.1, -16] }, // MILESTONES — weaving past the work monuments
  { pos: [0, 3, -15], look: [0, -0.1, -24] }, // PLATFORM — kept far enough back (~10 units)
  // that the dock reads as a small island the counters sit beside, not a
  // wall filling the frame (same distance discipline as orbit's DOCK beat).
  { pos: [0.4, 1.6, -30], look: [0, 1.0, -38] }, // ARROW — rail keeps going, into the light
];

/* The rail spine itself — a second, independent curve the camera
   travels alongside (not on top of), used to build the emissive
   tube geometry in SceneObjects.ts. Slightly below/offset from the
   camera curve so the glow reads as a real physical object under
   the flight path, not a rail the camera is welded to. */
export const RAIL_POINTS: [number, number, number][] = [
  [0, -0.4, 10],
  [1.1, -0.3, 2],
  [-0.7, -0.5, -6],
  [0.5, -0.4, -14],
  [-0.3, -0.3, -22],
  [0.2, 0.1, -30],
  [0, 0.5, -40], // continues into the arrow's light — deliberately unfinished
];

export function buildCameraCurves() {
  const positions = WAYPOINTS.map((w) => new THREE.Vector3(...w.pos));
  const looks = WAYPOINTS.map((w) => new THREE.Vector3(...w.look));
  return {
    posCurve: new THREE.CatmullRomCurve3(positions, false, "catmullrom", 0.5),
    lookCurve: new THREE.CatmullRomCurve3(looks, false, "catmullrom", 0.5),
  };
}

export function buildRailCurve() {
  const points = RAIL_POINTS.map((p) => new THREE.Vector3(...p));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
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
