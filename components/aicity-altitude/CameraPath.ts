import * as THREE from "three";

/* ============================================================
   CAMERA PATH — plain three.js Catmull-Rom spline, no React.
   Sibling of components/skyline/CameraPath.ts — same damp3 utility,
   different waypoints: a single continuous DESCENT from above the
   cloud deck down onto a street-level dock, one waypoint per
   scroll band (7 bands = 7 waypoints, matches SCENES.length in
   AltitudeClient.tsx so posCurve.getPoint(progress) always lands
   the camera in the band the HTML is currently showing).

   Note on scale: the concept brief describes altitude in real
   meters (2400m -> 0m). That HUD number is purely a decorative
   HTML overlay (see AltitudeRail) driven straight off scroll
   progress — it is NOT the camera's actual world-space Y. The
   camera itself moves through the same small world-unit range as
   skyline's buildings (~1.5 to ~11 units) so geometry, fog and
   the fixed 0.1/70 clip planes stay in proportion.

   The A -> B waypoint pair (SIGNAL -> PIPELINE) is authored with
   tight X clearance (+-1.1 units either side of x=0) for the one
   authored "through-the-gap" cinematic beat — the camera grazes
   between two Signal Heights towers on its way down. Per the
   approved scope this is a camera-path beat only: no flyby THROUGH
   a modeled gap at close mesh clearance, just two waypoints placed
   so the descent visibly threads the district.
   ============================================================ */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [0, 10.5, 6], look: [0, 6, -2] }, // SKY — above the cloud deck, pitched down
  { pos: [0, 8.2, 3.4], look: [0, 4.6, -3] }, // CLOUD PUNCH — falling through the deck
  { pos: [0, 6.2, 0.4], look: [0.3, 3.4, -3.6] }, // SIGNAL HEIGHTS — district A wakes
  { pos: [0, 4.6, -3.2], look: [-0.3, 2.6, -7.2] }, // PIPELINE ROW — through-the-gap beat
  { pos: [-0.6, 3.3, -7.4], look: [0.2, 2, -11.4] }, // PORTAL QUARTER
  { pos: [0.5, 2.1, -11.6], look: [-0.2, 1.3, -15.8] }, // BROADCAST BASIN
  { pos: [0, 1.55, -16.6], look: [0, 1.15, -20.5] }, // TOUCHDOWN — eye height, street level
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
