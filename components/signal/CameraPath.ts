import * as THREE from "three";

/* ============================================================
   CONDUIT PATH — plain three.js Catmull-Rom spline, no React.
   Unlike orbit's camera (third-person, orbiting fixed islands),
   signal's camera IS the packet: it rides the centerline of the
   conduit, looking a fixed arc-length ahead of its own position.
   One curve serves double duty — it's both the camera track and
   the geometry path the light-trail tube is built along, so the
   camera always reads as "inside" the tube it's flying through.

   Waypoints — one per scene: INTAKE / ROUTER / PIPELINE / VAULT / DELIVERY.
   ============================================================ */
export const WAYPOINTS: [number, number, number][] = [
  [0, 0.2, 10], // INTAKE — mouth of the conduit, lead lands here
  [1.8, 0.7, 3], // ROUTER — junction node, stack emblems orbit it
  [-2, -0.3, -4.5], // PIPELINE — first bend, work panels behind glass
  [1.4, 0.5, -12], // VAULT — proof chamber, counters on the walls
  [0, 0.6, -19], // DELIVERY — booking dock, packet arrives
];

export const SCENE_COUNT = WAYPOINTS.length;

export function buildConduitCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p) => new THREE.Vector3(...p));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.55);
}

/**
 * Frenet-ish frames sampled once along the curve so particles/rings can
 * offset radially without recomputing a basis every frame. Uses
 * THREE's built-in computeFrenetFrames (stable enough for this gentle,
 * non-looping curve — no twist correction needed at this segment count).
 */
export function buildConduitFrames(
  curve: THREE.CatmullRomCurve3,
  steps: number,
) {
  return curve.computeFrenetFrames(steps, false);
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

/** Clamp + small forward look-ahead so the camera always noses toward
    where the conduit goes next, never straight down its own track. */
export function lookAheadT(p: number, delta = 0.045): number {
  return THREE.MathUtils.clamp(p + delta, 0, 1);
}
