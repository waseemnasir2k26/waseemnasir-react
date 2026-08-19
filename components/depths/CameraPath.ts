import * as THREE from "three";
export { damp3 } from "@/components/orbit/CameraPath";

/* ============================================================
   CAMERA PATH — plain three.js Catmull-Rom spline, no React.
   Vertical DESCENT: unlike orbit's lateral fly-through, every
   waypoint here sinks in Y (and drifts gently in X/Z for a living
   current feel) — SURFACE / REEF / TRENCH / STATIONS / FLOOR.
   damp3() is the one generic helper reused from components/orbit
   (framerate-independent exponential damping); the waypoints and
   curve-build below are this world's own, per scope.
   ============================================================ */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [0, 6, 10], look: [0, 5.4, 2] }, // SURFACE — bright paper light, looking down into the water
  { pos: [1.6, 1.2, 5.6], look: [0.5, 0.4, 0] }, // THE REEF — coral emblem cluster
  { pos: [-1.4, -4.2, 1.4], look: [-0.6, -4.8, -2.4] }, // THE TRENCH — depth-marker beacons
  { pos: [1.1, -9.4, -3.6], look: [0.4, -9.8, -7.6] }, // STATIONS — illuminated work windows
  { pos: [0, -14.6, -8.4], look: [0, -15.2, -13] }, // THE FLOOR — final landing, pulled back
  // so the platform reads as a small lit clearing in the dark, not a wall
];

export function buildCameraCurves() {
  const positions = WAYPOINTS.map((w) => new THREE.Vector3(...w.pos));
  const looks = WAYPOINTS.map((w) => new THREE.Vector3(...w.look));
  return {
    posCurve: new THREE.CatmullRomCurve3(positions, false, "catmullrom", 0.5),
    lookCurve: new THREE.CatmullRomCurve3(looks, false, "catmullrom", 0.5),
  };
}
