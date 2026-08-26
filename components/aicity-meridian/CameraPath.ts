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
/* Altitude notes (fix for the 08-20 screenshot audit): the original
   waypoints 1-5 sat at y 1.4-4.2 — at/below the ~1.2-5.2 unit rooftop
   band of the city-grid + stack towers, so mid-flight the camera was
   effectively INSIDE the skyline: giant near-clipped building/ground
   faces filled the frame and overlapped the HTML card layer, and the
   final approach flew the camera straight through the interconnect
   bridge arcs (see buildInterconnect). Every waypoint below now keeps
   at least ~1.5 units of clearance over the tallest nearby geometry
   (city grid max h=4.6, stack towers max h=5.2, bridge apex ~4.2) so
   towers/bridges always read as a skyline/arcs *below and ahead* of
   the camera, never as walls it flies through. x stays inside the
   ±1.1 clear flight corridor (see buildCityGrid) at every waypoint. */
/* Round-2 fix (08-20 re-audit, 30% "stack district" beat): waypoint 1
   still sat only ~6-9 units in front of the 5.2-tall landmark towers
   (z=4 vs towers at z -2.5..-5) at a fairly low y=7.6 — close enough
   that the towers filled the whole viewport as blown-out near-camera
   slabs and crossed the HTML card. Because this is a Catmull-Rom
   spline (not a straight line between waypoints), the camera's actual
   sampled position at t=0.3 sits well short of waypoint 1 itself
   (verified numerically + via a live in-browser camera dump, not just
   projected on paper) — pulling the waypoint back much further, to
   z=30, y=34, was needed so the spline's t=0.3 sample (verified
   pos ~[0, 22, 13.7], look ~[-0.3, 1.7, -7]) keeps the towers small
   and confined to a dim mid-distance skyline glimpsed through the
   translucent glass card (matching the GOLDEN hero's own city-behind-
   card treatment), not a wall the camera sits inside of. */
export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = [
  { pos: [0, 9, 14], look: [0, 1.6, 0] }, // GOLDEN — high approach, sun still up
  { pos: [0.9, 34, 30], look: [0, 1, -3] }, // SUNSET — stack district ignites, seen as a mid-distance skyline, well clear of the card above the fold
  { pos: [-0.8, 6.8, -5.5], look: [-0.6, 2.4, -11.5] }, // DUSK — proof plaza, streetlamps, from above
  { pos: [0.7, 6.2, -12.5], look: [-0.2, 2.2, -18] }, // NIGHTFALL — work boulevard billboards below
  { pos: [-0.6, 6.6, -19], look: [0.4, 2.6, -24.5] }, // DEEP NIGHT — bridge arcs pass well underneath
  { pos: [0, 9.5, -21], look: [0, 1.6, -28] }, // MIDNIGHT — dock fix (08-27): the previous waypoint
  // (pos [0,7.8,-29] look [0,2,-36]) put the camera PAST the dock's own
  // z=-27 centre with a look target another 9 units beyond that — the
  // vector from camera to the dock beacon/last-window pointed backward
  // (+z), so the entire dock, and every building behind the camera, sat
  // outside the view frustum: nothing left to render around the CTA card
  // but empty fogged ground, which is the reported "black void" (verified
  // by projecting world points through this exact camera/look pair — see
  // fix-ai-city verification script, not guessed). This waypoint instead
  // sits BEHIND the dock and looks AT it: dock knot, last-window, the
  // final interconnect arc anchor and three rows of city-grid buildings
  // (z -24.8/-28/-31.2) all project inside the frustum, plus the new
  // dock-side lamp ring + receding pier beacons (SceneObjects.ts
  // buildDock) fill the periphery instead of flat night ground.
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
