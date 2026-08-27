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

   FIX ROUND (motion judge, M8) — the four district waypoints
   (SIGNAL/PIPELINE/PORTAL/BROADCAST) are pulled back ~1 world unit
   further from their board wall along the same look-direction they
   already had (pos moved away from look, same aim), so a settled
   board never eats more than ~70% of the frame width. Derived with
   THREE.Vector3 math (direction = pos-look, normalized, scaled by
   PULL_BACK), not eyeballed — see PULL_BACK below.
   ============================================================ */
const RAW_WAYPOINTS: {
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

/** How far (world units) each district waypoint's camera is pulled back
    away from its board wall, along its own existing look direction —
    only the 4 district stops (indices 2-5) get this; SKY/PUNCH/TOUCHDOWN
    keep their original, separately-tuned framing.

    VERIFY-LOOP FIX (2026-08-27) — set to 0 (disabled) after a live
    screenshot at the Signal Heights stop showed the message board's
    headline bleeding off the RIGHT edge with PULL_BACK=1.0: every board
    position (and the "through-the-gap" tight-X-clearance beat) in this
    file was hand-tuned against the ORIGINAL waypoints across many prior
    fix rounds (see the FIX-ROUND/ROUND-N comments throughout
    AltitudeCanvas.tsx and SceneObjects.ts) — moving the camera without
    re-deriving every one of those positions traded one framing defect
    for another. The arc-length LUT below (buildArcLengthLUT, motion fix
    M8's OTHER half) is unaffected by this and stays active — it doesn't
    move a single waypoint, only how the existing ones are SAMPLED, so
    it carries zero regression risk against the prior tuning. Frame-width
    safety for oversized boards is handled at the board level (width
    values in AltitudeCanvas.tsx) instead of by moving the camera. */
const PULL_BACK = 0;
const DISTRICT_WAYPOINT_INDICES = new Set([2, 3, 4, 5]);

export const WAYPOINTS: {
  pos: [number, number, number];
  look: [number, number, number];
}[] = RAW_WAYPOINTS.map((w, i) => {
  if (!DISTRICT_WAYPOINT_INDICES.has(i)) return w;
  const pos = new THREE.Vector3(...w.pos);
  const look = new THREE.Vector3(...w.look);
  const dir = pos.clone().sub(look).normalize();
  const pulled = pos.clone().addScaledVector(dir, PULL_BACK);
  return { pos: [pulled.x, pulled.y, pulled.z], look: w.look };
});

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

/** Same damp, one scalar — used for the single shared smoothed-progress
    value (motion fix M2) instead of letting every consumer (fog, atmo
    colour, signage, boards, districts...) read raw scroll progress
    independently and jitter out of sync with each other. */
export function damp1(
  current: number,
  target: number,
  lambda: number,
  dt: number,
): number {
  const f = 1 - Math.exp(-lambda * dt);
  return current + (target - current) * f;
}

/* ============================================================
   ARC-LENGTH LUT (motion fix M8) — CatmullRomCurve3.getPoint(u) is
   parameterized by WAYPOINT INDEX, not by distance travelled: two
   waypoints spaced far apart in world space eat the same [0,1] slice
   of `u` as two waypoints spaced close together. Sampling the curve
   directly with a uniform scroll-progress scalar therefore makes the
   camera visibly speed up through the widely-spaced late-descent
   waypoints (the documented "late-descent speed doesn't accelerate
   ~45%" defect is exactly this — it's not that the camera keeps
   accelerating, it's that the SAME scroll-progress delta covers more
   world distance in that stretch of the curve). A LUT (not
   getPointAt's own per-call arc-length walk) is precomputed ONCE at
   build time — this is the "LUT preferred for perf" branch, no
   per-frame integration cost.
   ============================================================ */
export type ArcLengthRemap = (t: number) => number;

export function buildArcLengthLUT(
  curve: THREE.CatmullRomCurve3,
  samples = 200,
): ArcLengthRemap {
  const cum = new Float32Array(samples + 1);
  let total = 0;
  let prev = curve.getPoint(0);
  const tmp = new THREE.Vector3();
  for (let i = 1; i <= samples; i++) {
    const u = i / samples;
    curve.getPoint(u, tmp);
    total += tmp.distanceTo(prev);
    cum[i] = total;
    prev = prev.copy(tmp);
  }
  const safeTotal = total || 1;

  return (t: number) => {
    const target = THREE.MathUtils.clamp(t, 0, 1) * safeTotal;
    // Binary search the cumulative-length table for the bracketing pair.
    let lo = 0;
    let hi = samples;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const i1 = Math.max(1, Math.min(samples, lo));
    const i0 = i1 - 1;
    const segLen = cum[i1] - cum[i0] || 1;
    const frac = (target - cum[i0]) / segLen;
    return (i0 + frac) / samples;
  };
}
