"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C, DISTRICTS, H1, SUB, WORK, PROJECTS } from "./tokens";
import {
  buildCameraCurves,
  buildArcLengthLUT,
  damp1,
  damp3,
} from "./CameraPath";
import {
  makeMaterials,
  buildClouds,
  buildDescentDistricts,
  buildBridges,
  buildTouchdown,
  buildEarlyMist,
  buildHeroSpire,
  DISTRICT_THRESHOLDS,
  type SceneObject,
} from "./SceneObjects";
import { buildPhotoBillboards } from "./PhotoBillboards";
import { createCitySignage } from "../aicity-core/CitySignage";
import { createFacadeMaps } from "../aicity-core/Facade";
import {
  applyFilmicRenderer,
  applyEnvResponse,
  createSkyEnvironment,
  createPostChain,
} from "../aicity-core/Realism";

/* ============================================================
   ALTITUDE CANVAS — plain three.js, mounted imperatively in a
   useEffect (no r3f — forbidden in this repo, see
   components/skyline/SkylineCanvas.tsx header for the verified
   failure reason). Fixed, full-viewport, sits behind the real HTML
   content so it never affects layout (no CLS) and never captures
   scroll — native scroll drives the camera via `progress`, read
   every rAF tick (no React re-renders).
   ============================================================ */
export default function AltitudeCanvas({
  progress,
  onContextLost,
}: {
  progress: MotionValue<number>;
  onContextLost: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    // 2 (was 1.5): the 1.5 cap read visibly soft/pixelated on standard
    // displays — owner called it out. Frame governor still sheds DPR
    // under load, so the ceiling only costs GPUs that can afford it.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // The route's REAL font families (next/font mangles the names, so a
    // literal "Bricolage Grotesque" string never matches) — read from
    // the CSS vars the client component sets on this subtree. Canvas
    // signage textures bake whatever family resolves at draw time.
    const rootStyle = getComputedStyle(mount);
    const displayStack =
      rootStyle.getPropertyValue("--font-display").trim() ||
      '"Bricolage Grotesque", sans-serif';
    const bodyStack =
      rootStyle.getPropertyValue("--font-body").trim() ||
      '"Hanken Grotesk", sans-serif';
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // MOTION FIX M6 (2026-08-27) — kills the black-flash-into-bright-pop
    // load defect. The cloud-deck dusk colour (same formula as
    // `cloudDusk` below) is computed FIRST and painted straight onto the
    // mount div's own background, before the renderer's canvas element
    // is even appended — so whatever the user sees for the one-or-two
    // frames between this effect running and the first real WebGL frame
    // painting is already the right colour, not the route's near-black
    // body background showing through a transparent fixed div. The
    // canvas itself starts at opacity 0 and is faded up over ~600ms
    // once the first frame has actually rendered (see the `tick`
    // function's `revealCanvas` below) — a bright flash of an
    // UNRENDERED frame would be worse than the solid dusk colour it's
    // covering.
    const cloudDuskEarly = new THREE.Color(C.paper).lerp(
      new THREE.Color(C.jade),
      0.4,
    );
    mount.style.background = `#${cloudDuskEarly.getHexString()}`;
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 600ms ease";
    // Filmic response BEFORE anything reads a colour. Without it every
    // emissive above 1.0 clips flat to white — the documented root cause
    // of the bright-bridge-beam artefact at cards 30-90%: window
    // emissiveIntensity 1.6 had no shoulder to roll off into. Exposure
    // sits a touch below Meridian's 0.98 because Altitude's windows are
    // brighter to start with (1.6 vs Meridian's) and this is a tighter,
    // denser corridor where a hot highlight reads worse.
    applyFilmicRenderer(renderer, 0.86);
    mount.appendChild(renderer.domElement);

    // ── Atmosphere grade (08-27 visual-quality pass) ──
    // Before this pass, scene.background stayed a constant near-black and
    // scene.fog was a constant near-white (C.paper) — neither ever moved
    // with descent progress. Fog only paints geometry that is INSIDE its
    // near/far band, so a static near-white fog color read as a flat
    // gray-white wash across every distant surface regardless of how far
    // into the "night city" descent the camera had travelled — the
    // documented "cheap, washed-out gray" defect. Both are now a 3-stop
    // dusk gradient (cloud-deck paper -> jade transition -> ink-teal
    // night), driven by the same `p` scalar as the IBL probe swap below,
    // so sky/fog/environment always agree with each other.
    // Stop0 is deliberately NOT raw C.paper — pure near-white paper read as
    // literal neutral gray at the top of the descent (the "flat washed-out
    // gray" complaint held even here, where a gray cloud deck is
    // thematically defensible but a colourless one still isn't). Blending
    // in a touch of the brand jade keeps the cloud-deck era pale and
    // hazy while still visibly on-palette from frame one.
    const cloudDusk = new THREE.Color(C.paper).lerp(
      new THREE.Color(C.jade),
      0.4,
    );
    const ATMO_STOPS: [number, THREE.Color][] = [
      [0.0, cloudDusk],
      [0.5, new THREE.Color(C.jade)],
      [1.0, new THREE.Color(C.skyDark)],
    ];
    const atmoColor = (out: THREE.Color, p: number) => {
      if (p <= 0.5) {
        return out.lerpColors(ATMO_STOPS[0][1], ATMO_STOPS[1][1], p / 0.5);
      }
      return out.lerpColors(
        ATMO_STOPS[1][1],
        ATMO_STOPS[2][1],
        (p - 0.5) / 0.5,
      );
    };
    const _bgColor = new THREE.Color();
    const _fogColor = new THREE.Color();
    const _keyColor = new THREE.Color();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(C.paper);
    // Fog sharpens as you descend: starts hazy (cloud deck era) and pulls
    // in tighter by touchdown — near/far AND color are updated per-frame
    // below (all scalar writes, no allocation). Near is kept well beyond
    // the towers' actual camera-relative distance (they sit ~1-6 units
    // out) at every point in the descent, so fog never mutes the
    // buildings' own silhouette/contrast up close — it only atmospheres
    // the distant corridor behind them.
    scene.fog = new THREE.Fog(C.paper, 24, 50);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      60,
    );

    const ambient = new THREE.AmbientLight(0x0e3330, 0.34);
    // Key light used to be a constant near-white (C.paper) at a constant
    // intensity for the entire descent — the second half of the "gray
    // wash" defect, and the direct cause of the touchdown ground plane
    // blowing out to a flat neon-mint fill (a near-white directional
    // light raking a large near-horizontal plane at grazing incidence,
    // then re-blown by UnrealBloomPass's 0.88 threshold). It now tints
    // and dims across the same dusk gradient as the fog/background, so
    // by street level it reads as jade night-light instead of noon sun.
    const sky = new THREE.DirectionalLight(C.paper, 0.2);
    sky.position.set(-3, 12, 4);
    const glow = new THREE.PointLight(C.jadeBright, 0.85, 0, 2);
    glow.position.set(0, 3, -6);
    scene.add(ambient, sky, glow);

    // ── Image-based lighting, generated on the GPU at mount. Unlike
    // Meridian's day->night arc, Altitude's stops trace a DESCENT: high
    // altitude reads bright and hazy (cloud-deck paper white), street
    // level reads dark and dense (jade night). `p` (scroll progress) is
    // used directly as the stop key, same as Meridian keys off `dayness`
    // — no reinterpretation needed, descent IS the master scalar here.
    // No .hdr, no network — three probe scenes baked once each.
    const skyEnv = createSkyEnvironment(renderer, [
      {
        at: 0.0,
        sky: C.paper,
        ground: C.ground,
        sun: C.paper,
        sunIntensity: 1.0,
      },
      {
        at: 0.5,
        sky: C.jade,
        ground: C.ground,
        sun: C.jadeBright,
        sunIntensity: 0.5,
      },
      {
        at: 1.0,
        sky: C.skyDark,
        ground: C.ground,
        sun: C.jadeBright,
        sunIntensity: 0.18,
      },
    ]);
    scene.environment = skyEnv.get(0);

    const mats = makeMaterials();
    // metalness (building) with no environment to reflect was only ever
    // darkening that surface — now it has something to catch.
    // ROUND-3 FIX (jury defect #1, MAJOR — paired with the metalness/
    // roughness pull in SceneObjects.ts makeMaterials): was 0.45. At low
    // scroll progress skyEnv.get(p) still serves its brightest baked
    // stop (sunIntensity 1.0, sky=paper) — combined with the old, more
    // reflective building material this mirrored a near-white sky patch
    // onto any flat-topped box the descending camera looked down on,
    // read as a blank white polygon. Cut further so the facade
    // texture/colour stays the dominant surface signal at every stop.
    applyEnvResponse(mats, 0.22);
    // Procedural facade detail (floor slabs, mullions, per-bay glass
    // variation, grime) — one CanvasTexture, no network fetch, applied to
    // the single shared building material so every tower in the
    // InstancedMesh picks it up for free. Without this every tower was
    // one flat MeshStandardMaterial colour, the documented "flat dark
    // slab" defect; this is the cheapest available fix (one texture
    // upload, zero extra draw calls, zero extra instancing work) so it's
    // safe to try after the lighting/atmosphere pass above.
    const facade = createFacadeMaps({
      base: C.inkJade,
      seam: C.jade,
      size: 512,
      floors: 9,
      bays: 5,
      seed: 4102,
    });
    mats.building.map = facade.map;
    mats.building.roughnessMap = facade.roughnessMap;
    mats.building.needsUpdate = true;
    const districts = buildDescentDistricts(mats);
    // DISTRICTS[1] = Pipeline Row — its landmark anchor feeds the riser
    // conduit added to buildBridges() (round-3, defect #2: "a building
    // that IS a connection" needs a visible connection motif on the hero
    // building itself, not just the background rail).
    const pipelineAnchor = districts.landmarkAnchors[1];
    const heroSpire = buildHeroSpire(mats);
    // OWNER FIX (08-27 portfolio expansion) — Waseem's own professional
    // photos, mounted on free (unclaimed) towers via districts.freeAnchors.
    // One PORTRAIT near the FIRST district (Signal Heights) so his face
    // reads early in the descent, one CAFE-WORK/founder-at-work board in
    // Pipeline Row. Both picks are named files in public/img/pro/ — see
    // that folder's own filename convention (CATEGORY-date-scene.jpg).
    // VERIFY-LOOP FIX (08-27): heightFrac 0.3 + appearAt tight to
    // threshold, matching the exact proven convention every other
    // secondary-tower board in this file uses (board-pipeline,
    // board-portal, proofAnchors) — see the project-boards comment
    // below for the screenshot-confirmed failure of the first cut's
    // 0.5/wide-offset guess (huge, clipped, overlapping boards).
    // targetHeight trimmed to stay inside the same footprint proof
    // boards use (height 1.55 there) rather than the oversized 1.6-1.7
    // first attempt.
    // VERIFY-LOOP FIX ROUND 4 (08-27): the previous cut mounted each
    // photo on its OWN 3rd free tower — screenshot-confirmed landing
    // inside the fixed AltimeterRailLive's own left-column footprint
    // (same root cause as the project-boards fix above: any far-left
    // free tower's ndcX falls inside the rail). Fixed by co-mounting
    // each photo on the SAME tower/face as its district's own low-band
    // project board (freeAnchors[di][0] — "AI Voice Calling Agents" /
    // "End-to-End CRM Automation"), just at a much higher heightFrac —
    // the exact "share a wall, stack by height" convention this file's
    // nameplate + message board already use on every landmark tower.
    // Every ndcX/ndcY re-checked against the real camera curve.
    const photoBillboards = buildPhotoBillboards([
      {
        id: "photo-portrait",
        url: "/img/pro/PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
        // SAME tower as "AI Voice Calling Agents" (freeIndex 0) — stacked
        // well above it (heightFrac 1.1 vs the board's 0.5).
        anchor: districts.freeAnchors[0]?.[0],
        heightFrac: 1.1,
        targetHeight: 0.95,
        appearAt: DISTRICT_THRESHOLDS[0] + 0.05,
      },
      {
        id: "photo-work",
        url: "/img/pro/CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
        // SAME tower as "End-to-End CRM Automation" (freeIndex 0).
        anchor: districts.freeAnchors[1]?.[0],
        heightFrac: 1.1,
        targetHeight: 0.95,
        appearAt: DISTRICT_THRESHOLDS[1] + 0.06,
      },
    ]);
    const objects: SceneObject[] = [
      buildClouds(),
      districts,
      buildBridges(pipelineAnchor),
      buildTouchdown(mats),
      // OWNER FIX (08-27) — see buildEarlyMist's own header comment.
      buildEarlyMist(),
      // OWNER FIX (08-27) — see buildHeroSpire's own header comment: a
      // static, always-built mounting surface for the hero billboards.
      heroSpire,
      // Appended LAST — the perf-degrade ladder below indexes into this
      // array by fixed position (objects[0]=clouds, [1]=districts,
      // [3]=touchdown); adding this at the end keeps every existing
      // index correct. Same fate as bridges/clouds under degrade: it
      // simply stops fading in further, never crashes.
      photoBillboards,
    ];
    objects.forEach((o) => scene.add(o.group));

    // ── District signage, bolted to each district's tallest tower.
    // Parented to the district group (not the scene) so the signs are
    // part of the city: occluded by towers in front, fogged with the
    // facade behind, shrinking with real perspective as you fall past.
    // Lights just AFTER its DISTRICT_THRESHOLD so the tower has already
    // risen out of the deck — a sign never hangs in empty air. ──
    const signage = createCitySignage(
      DISTRICTS.map((d, i) => {
        const a = districts.landmarkAnchors[i] ?? { x: 0, y: 3, z: 0 };
        const threshold = DISTRICT_THRESHOLDS[i] ?? 0.2;
        const SIGN_W = 1.5;
        const TOWER_HALF = 0.55; // towers are 1.1 wide
        // INBOARD here, unlike /v/ai-city. Meridian looks at the
        // district from outside, so its plates hang outward into open
        // air. This camera falls straight down the corridor with the
        // towers close on both sides, so an outward-hung plate lands at
        // the frame edge (verified: The Portal Gate was clipped off the
        // top-right corner). Hanging it INTO the corridor instead puts
        // it in front of the falling camera, the way a street sign
        // projects over the street rather than away from it.
        const inboard = (a.x < 0 ? 1 : -1) * (SIGN_W / 2 - TOWER_HALF) * 0.9;
        // `a.y` is roof + 0.5, i.e. tower height h = a.y - 0.5.
        const towerH = a.y - 0.5;
        return {
          id: d.id,
          name: d.landmark,
          // The district NAME would just echo the landmark name on the
          // plate ("PIPELINE ROW HQ / PIPELINE ROW"). Take the service
          // clause off the front of the pitch instead — the pitches are
          // written as "<service>: <promise>" (or "<service> — <promise>"),
          // so the head of the string is the discipline the building runs.
          sub: d.pitch.split(/[:—]/)[0].trim(),
          // OWNER FIX (08-27 — "signs float above/on top of buildings,
          // not on them"): the sign used to stand proud of the front
          // face by 0.72 (0.17 beyond the tower's own half-width) and
          // sit one storey below the roofline (a.y - 1.7) — from a
          // camera that is looking down and forward through most of the
          // descent, that proud offset plus near-roofline height read as
          // a card hovering just above/in front of the roof cap rather
          // than signage bolted to the wall. Now flush (tower half 0.55
          // + a 0.02 physical standoff, same as a real sign's mounting
          // bracket depth) and at mid-facade height (55% up the body)
          // so it unambiguously reads as mounted on the building, not
          // near its cap.
          position: new THREE.Vector3(
            a.x + inboard,
            towerH * 0.55,
            a.z + TOWER_HALF + 0.02,
          ),
          width: SIGN_W,
          height: 0.4,
          // FIX-ROUND (08-27, diegetic conversion FAIL 2): Signal
          // Heights (i===0) is the one district whose message board
          // (board-signal below) shares the SAME tower/wall as this
          // small nameplate — its +1.4 tower-height bonus means, at
          // whatever fraction keeps this nameplate off the bottom
          // frame edge, it lands squarely inside the message board's
          // own footprint (screenshot-verified: two overlapping signs,
          // one dim/one bright, on the identical wall). The message
          // board's headline already carries this exact landmark name +
          // pitch verbatim, so nothing is lost — appearAt pushed past 1
          // suppresses only this one nameplate (reveal can never clear
          // 0 within the 0-1 scroll range) rather than duplicating and
          // overlapping content the brighter board already shows.
          // MOTION FIX M5 (dead zone, 2026-08-27) — Portal Quarter
          // (i===2) previously lit at threshold+0.03 (0.55), leaving a
          // gap between its towers finishing their wake (threshold 0.52)
          // and any text appearing. Pulled forward to ~0.50 so the
          // nameplate is already lit as the district itself settles in.
          appearAt: i === 0 ? 2 : i === 2 ? 0.5 : threshold + 0.03,
        };
      }),
      // ROUND-2 FIX (jury defect #1a — 3D billboard text double-exposed
      // with the HTML headline saying the same thing): maxOpacity was
      // left at CitySignage's default (0.94, near-full white) — bright
      // enough that at the Broadcast Basin stop it reads as a second,
      // competing headline rather than ambient city signage behind the
      // card. Dropped to 0.5, then 0.32 in round 3 (still a legible ghost
      // behind the Broadcast Basin headline). The double-exposure defence
      // now lives in the near-opaque card Scrim (0.94 in AltitudeClient.tsx)
      // instead of dim signage, so OWNER FIX (08-27) raises this back up —
      // signage needs to read as genuinely LIT department boards, not a
      // ghost — to 0.55, and adds a dark lightbox plate + jade hairline
      // border so each sign reads as a physical mounted sign, not a
      // decal. Re-verified at the 70% stop: no double-exposure regression
      // (Scrim, not signage dimness, carries that defence now).
      {
        color: C.ink,
        accent: C.jadeBright,
        maxOpacity: 0.55,
        plate: "rgba(3,12,11,0.95)",
        border: "rgba(31,231,199,0.55)",
        headlineFont: displayStack,
        // TYPOGRAPHY FIX T1 + MOTION FIX M4 (2026-08-27) — tight glow
        // rim instead of the old wide halo, eased reveal. Opt-in only:
        // Meridian's own nameplate call never sets these.
        tightGlow: true,
        easedReveal: true,
      },
    );
    districts.group.add(signage.group);

    // ============================================================
    // NARRATIVE BILLBOARDS — OWNER FIX (08-27, diegetic-copy rebuild).
    // Owner ruling: "ALT 2400M · V 0.0 M/S and all other such texts,
    // should not [come] on top of website, better place them on those
    // buildings." Every scroll-section's copy that used to live in a
    // floating HTML Scrim card now has a matching board mounted flush
    // on an actual building face — hero + punch on the always-built
    // heroSpire, one message board per district near its existing
    // name-plate, 4 client-proof boards on 4 Broadcast Basin towers
    // (mirroring the "BLDG 01-04" fiction those proof cards already
    // were), and a landing-pad board at touchdown. Claims text is
    // copied verbatim from components/aicity-altitude/tokens.ts in
    // every case below — nothing here re-types a number or a locked
    // phrase from memory.
    // ============================================================
    const TOWER_HALF = 0.55; // towers are 1.1 wide (matches signage above)
    const inboardOf = (ax: number, w: number) =>
      (ax < 0 ? 1 : -1) * (w / 2 - TOWER_HALF) * 0.9;

    const signalD = DISTRICTS[0];
    const pipelineD = DISTRICTS[1];
    const portalD = DISTRICTS[2];
    const broadcastD = DISTRICTS[3];
    const signalA = districts.landmarkAnchors[0];
    const pipelineA = districts.landmarkAnchors[1];
    const portalA = districts.landmarkAnchors[2];
    const broadcastA = districts.landmarkAnchors[3];
    const portalW = WORK[0];

    const MSG_W = 1.9;
    // Camera pitch at the SKY waypoint (p=0), computed once from the
    // real curve — see CameraPath.ts WAYPOINTS[0]: pos (0,10.5,6), look
    // (0,6,-2). fwd = normalize(look-pos); this is atan2(-fwd.y,-fwd.z),
    // the rotation-about-world-X that turns a default +Z-facing plate
    // into a true billboard facing that settled camera. Stays accurate
    // through progress ~0.15 (the curve barely bends over that span —
    // verified point-by-point against CatmullRomCurve3.getPoint()), so
    // every board mounted on the hero spire reuses it.
    const HERO_ROTATION_X = -0.512;
    // TYPOGRAPHY FIX T6 (de-duplicate copy, 2026-08-27) — every district
    // board headline used to repeat `${landmark} — ${pitch}` verbatim,
    // i.e. the same landmark name its own nameplate (a few frames away
    // on the identical wall) already carries, PLUS the pitch's own
    // "<service clause>: <promise>" prefix, which the district's own
    // sub-line (signage.ts's `sub`, split off that same colon) also
    // already shows. Strips both down to just the outcome clause after
    // the LAST colon-or-em-dash — matches the fix brief's own worked
    // example verbatim ("Every lead answered before it goes cold.").
    // Never touches PROOF/locked numbers (those boards build their
    // headline from WORK[].metric, untouched below).
    const pitchTail = (pitch: string): string => {
      const parts = pitch.split(/[:—]/);
      const tail = (parts.length > 1 ? parts[parts.length - 1] : pitch).trim();
      return tail.charAt(0).toUpperCase() + tail.slice(1);
    };
    const boardSpecs = [
      // ── HERO — SKY band. Owner-supplied copy, verbatim H1/eyebrow.
      // FIX-ROUND (08-27, diegetic conversion FAIL 1): the previous cut
      // left this board's rotation at the default (facing world +Z)
      // while the p=0 waypoint (pos (0,10.5,6), look (0,6,-2)) pitches
      // the camera down ~29deg — a flat, unrotated plate viewed from
      // that far off its own normal rendered as the reported
      // "edge-on/sharply angled" trapezoid, screenshot-confirmed. Fixed
      // by giving the whole hero-mast set of boards `rotationX` equal to
      // the camera's own pitch at p=0 (HERO_ROTATION_X below, derived
      // from THREE.CatmullRomCurve3.getPoint(0) directly, not guessed) —
      // that makes each plate a true billboard facing the settled
      // camera, not a wall-mounted sign facing a fixed compass
      // direction. Position also re-centred (world-space math verified
      // against the real curve, not eyeballed) so the headline sits as
      // the clear rule-of-thirds subject of the settled 0% frame
      // instead of pinned into the top-left corner.
      {
        id: "board-hero",
        name: H1,
        eyebrow: "AI automation that pays for itself",
        position: new THREE.Vector3(-0.58, 9.28, 2.32),
        width: 1.9,
        height: 1.1,
        rotationX: HERO_ROTATION_X,
        // Negative appearAt (paired with a tight revealSpan below via
        // the shared `boards` options) so this board is ALREADY fully
        // lit at literal scroll-progress 0 — the hero stop's settled
        // screenshot — rather than fading in from nothing over the
        // first couple of scroll-percent the way every other district
        // board does. There is no earlier moment to fade in from at
        // the very top of the page.
        // VERIFY-LOOP FIX (2026-08-27) — was -0.05, tuned against the
        // group's OLD revealSpan (0.05): appearAt+revealSpan=0 landed
        // reveal=1 exactly at p=0. M4 widened the shared revealSpan to
        // 0.08 (boards options below), which silently underlit this
        // board at the literal p=0 screenshot (reveal~0.68, not 1) —
        // pixel-contrast-verified. -0.09 restores appearAt+revealSpan<0
        // so it's fully lit again at p=0.
        appearAt: -0.09,
        // FIX-ROUND (found during the 08-27 sweep, adjacent to FAIL 1):
        // this plate sits close to the camera's own early path, so world
        // distance shrinks fast — left permanently lit (CitySignage's
        // old behaviour) it overran the frame and clipped past the left
        // edge by the 15% stop, screenshot-confirmed. Fades back out
        // just before board-punch (appearAt 0.155) takes over the same
        // mast as the next beat.
        hideAfter: 0.08,
        headlineSize: 0.155,
        maxHeadlineLines: 3,
        texDim: 2048,
        // TYPOGRAPHY FIX T2 (2026-08-27) — dark-glass plate (lighter +
        // more translucent than the shared near-opaque city-signage
        // plate) for contrast headroom against near-white headline text.
        plateOverride: "rgba(2,10,9,0.97)",
        bodyColorOverride: "#F2F7F5",
      },
      // ── HERO PITCH — same spire, below the headline board. SUB is the
      // only copy shortened to fit a board (long-form site copy, not a
      // locked claim) — original vs. shortened text is in the PR notes.
      // FIX-ROUND (FAIL 1): appearAt used to be 0.02 with a 0.05
      // revealSpan, so at the literal progress-0 screenshot
      // reveal = (0-0.02)/0.05 clamps to 0 — the board was fully
      // transparent (mesh.visible stays false) at the exact stop the
      // verify loop checks, independent of any position issue. Matched
      // to the hero board's own -0.05 so it is already lit at p=0, and
      // repositioned directly under the headline board (same rotation,
      // same rule-of-thirds column) so it reads as the hero card's
      // sub-panel rather than a separate, half-visible plate.
      {
        id: "board-hero-pitch",
        name: "How it works",
        body: "Intake, follow-up, scheduling, reporting, publishing — each runs without a person in the seat. One AI system, wired end to end. — Waseem Nasir, founder, SkynetLabs.",
        // z=2.30 (not flush with the mast's own z=1.7 +- 0.275 half-
        // depth): a first pass at z=1.58 sat INSIDE the mast's solid
        // box footprint (x also overlapped its [-2.075,-1.525] span),
        // so the mast physically occluded the plate's left edge —
        // screenshot-confirmed as the headline's leading "H" eaten by
        // the mast. Matches the hero board's own clearance (z=2.32) in
        // front of the mast instead.
        position: new THREE.Vector3(-0.86, 7.35, 2.3),
        width: 1.75,
        height: 1.35,
        rotationX: HERO_ROTATION_X,
        // VERIFY-LOOP FIX (2026-08-27) — same revealSpan-widening fix as
        // board-hero above.
        appearAt: -0.09,
        // Same overrun defect as board-hero above, same fix — fades out
        // just ahead of board-punch.
        hideAfter: 0.09,
        headlineSize: 0.1,
        maxHeadlineLines: 1,
        maxBodyLines: 6,
        // TYPOGRAPHY FIX T2/T3 (2026-08-27) — same dark-glass plate as
        // board-hero (contrast headroom), plus a +20% body font bump
        // (this board's paragraph is the longest/smallest-reading body
        // copy in the whole descent).
        plateOverride: "rgba(2,10,9,0.97)",
        bodyColorOverride: "#F2F7F5",
        bodySizeFrac: 0.06,
      },
      // ── CLOUD PUNCH band — same spire, lower board. Same billboard
      // rotation as the two boards above (camera orientation barely
      // moves between p=0 and this board's own appearAt=0.155 — verified
      // against the curve, fwd/up within ~0.01 of the p=0 values), so it
      // stops this board keystoning too when it lights up.
      {
        id: "board-punch",
        name: "Through the deck. The city is real.",
        body: "180+ workflows · 40+ sites · 9 countries · since 2019",
        position: new THREE.Vector3(-1.05, 1.7, heroSpire.anchor.z + 0.35),
        width: 1.55,
        height: 1.05,
        rotationX: HERO_ROTATION_X,
        // MOTION FIX M5 (dead zone, 2026-08-27) — was 0.155, leaving a
        // gap between board-hero/board-hero-pitch fading out (hideAfter
        // 0.08/0.09) and this board lighting.
        appearAt: 0.1,
        headlineSize: 0.16,
        maxHeadlineLines: 2,
        maxBodyLines: 2,
        texDim: 1536,
      },
      // ── SIGNAL HEIGHTS — message board near the existing name-plate.
      {
        id: "board-signal",
        // TYPOGRAPHY FIX T6 — the nameplate on this same wall already
        // shows "The Signal Spire"; this headline is just the outcome.
        name: pitchTail(signalD.pitch),
        body: "Five landmark towers, one system that runs itself — the utilities this whole city runs on.",
        // 0.8 (not the 0.3 the other 3 districts use): Signal Heights'
        // towers carry a +1.4 height bonus (see SceneObjects.ts,
        // `di === 0 ? 1.4 : 0`) — at 0.3, and even at the previously
        // "fixed" 0.42, of that taller tower's own height the board
        // still landed below the settled 30% stop's visible frustum
        // (screenshot-confirmed FAIL 2 of the 08-27 fix round: bottom
        // edge clipped, second line of text cut mid-line). Re-derived
        // against the real camera curve (CatmullRomCurve3.getPoint(0.3))
        // rather than eyeballed: 0.42 projected the plate's own centre
        // BELOW the bottom edge; 0.8 lands the whole plate inside the
        // frame with clearance above the CTA pill, and still under the
        // tower's own roofline (h~4.93 at this seed), at both 1440x900
        // and 1280x800 (same 16:10 aspect, so the fraction carries over).
        position: new THREE.Vector3(
          signalA.x + inboardOf(signalA.x, MSG_W),
          (signalA.y - 0.5) * 0.8,
          signalA.z + TOWER_HALF + 0.02,
        ),
        width: MSG_W,
        height: 1.3,
        appearAt: DISTRICT_THRESHOLDS[0] + 0.06,
        // VERIFY-LOOP FIX (2026-08-27) — 0.1 -> 0.085: the T6 dedupe cut
        // this headline down to one short clause, which the wrap/shrink
        // fit-loop then rendered at a LARGER effective size (fewer lines
        // needed), tight enough at some settled beats to clip the last
        // glyph past the plate's own right edge. Capping the size keeps
        // the shorter copy from re-expanding into the margin it freed up.
        headlineSize: 0.085,
        maxHeadlineLines: 3,
        maxBodyLines: 3,
      },
      // ── PIPELINE ROW.
      {
        id: "board-pipeline",
        // TYPOGRAPHY FIX T6 — dropped the landmark name (its nameplate
        // already carries "Pipeline Row HQ").
        name: "A building that IS a connection.",
        body: `${pipelineD.pitch} System: WhatsApp intake → n8n → GHL.`,
        position: new THREE.Vector3(
          pipelineA.x + inboardOf(pipelineA.x, MSG_W),
          (pipelineA.y - 0.5) * 0.3,
          pipelineA.z + TOWER_HALF + 0.02,
        ),
        width: MSG_W,
        height: 1.3,
        appearAt: DISTRICT_THRESHOLDS[1] + 0.06,
        headlineSize: 0.09,
        maxHeadlineLines: 3,
        maxBodyLines: 3,
      },
      // ── PORTAL QUARTER.
      {
        id: "board-portal",
        // TYPOGRAPHY FIX T6 — nameplate already carries "The Portal Gate".
        name: pitchTail(portalD.pitch),
        body: `${portalW.outcome} ${portalW.metric}.`,
        position: new THREE.Vector3(
          portalA.x + inboardOf(portalA.x, MSG_W),
          (portalA.y - 0.5) * 0.3,
          portalA.z + TOWER_HALF + 0.02,
        ),
        width: MSG_W,
        height: 1.3,
        // MOTION FIX M5 (dead zone, 2026-08-27) — was threshold+0.06
        // (0.58); pulled to ~0.50 to match the nameplate's own pre-lit
        // fix above (both now light together as the district settles).
        appearAt: 0.5,
        // VERIFY-LOOP FIX (2026-08-27) — same headline-re-expansion fix
        // as board-signal above.
        headlineSize: 0.085,
        maxHeadlineLines: 3,
        maxBodyLines: 3,
      },
      // ── BROADCAST BASIN — district message board.
      {
        id: "board-broadcast",
        // TYPOGRAPHY FIX T6 — dropped the landmark name (its nameplate
        // already carries "The Cutting House") AND the old two-em-dash
        // headline (`landmark — pitch`, where pitch itself has its own
        // em-dash) down to one clause, zero em-dashes.
        name: pitchTail(broadcastD.pitch),
        body: "Proof — 180+ workflows · 40+ sites · 9 countries · since 2019",
        position: new THREE.Vector3(
          broadcastA.x + inboardOf(broadcastA.x, MSG_W),
          (broadcastA.y - 0.5) * 0.3,
          broadcastA.z + TOWER_HALF + 0.02,
        ),
        width: MSG_W,
        height: 1.3,
        // Matches the existing nameplate's own appearAt (threshold+0.03)
        // rather than +0.06 — the owner's verify loop checks the literal
        // 70% stop, which is only ~0.003 past Broadcast Basin's 0.7143
        // threshold, so this board needs to already be revealing there
        // too, not just the nameplate above it.
        appearAt: DISTRICT_THRESHOLDS[3] + 0.03,
        // VERIFY-LOOP FIX (2026-08-27) — same headline-re-expansion fix
        // as board-signal above (screenshot-confirmed clipped "Claude
        // Code." at the 75% stop before this reduction).
        headlineSize: 0.078,
        maxHeadlineLines: 3,
        maxBodyLines: 2,
      },
      // ── BROADCAST BASIN — 4 client-proof boards, one per proof
      // anchor tower (the "BLDG 01-04" fiction already used by the
      // proof cards). Staggered appearAt so all 4 don't pop at once.
      ...WORK.map((w, i) => {
        const a = districts.proofAnchors[i];
        if (!a) return null;
        return {
          id: `board-proof-${i}`,
          name: w.metric,
          eyebrow: w.client,
          body: `${w.note} ${w.outcome}`,
          chip: w.status,
          position: new THREE.Vector3(
            a.x + inboardOf(a.x, 1.3),
            (a.y - 0.5) * 0.3,
            a.z + TOWER_HALF + 0.02,
          ),
          width: 1.3,
          height: 1.55,
          appearAt: DISTRICT_THRESHOLDS[3] + 0.07 + i * 0.03,
          headlineSize: 0.15,
          maxHeadlineLines: 2,
          maxBodyLines: 4,
        };
      }).filter((s): s is NonNullable<typeof s> => s !== null),
      // ── PORTFOLIO PROJECT BOARDS (OWNER FIX, 08-27 expansion) — "what
      // I'm building now." Each mounted on a free (previously-unused)
      // tower via districts.freeAnchors, matched thematically to its
      // district (Signal Heights = lead response -> voice/nurture
      // agents; Pipeline Row = ops/CRM -> CRM automation + the Slack
      // chief-of-staff bot; Portal Quarter = customer portals -> the
      // club platform; Broadcast Basin = video/publishing -> the video
      // pipeline).
      //
      // VERIFY-LOOP FIX ROUND 4 (08-27): round 3's vertical-only stagger
      // fixed board-vs-board overlap but missed a second collision
      // surface — the fixed HTML AltimeterRailLive (left ~4-270px,
      // vertically centred) occupies real screen space too, and every
      // free tower far enough left/negative-x to clear the OTHER board
      // on its side of the corridor also lands ITS OWN ndcX inside the
      // rail's own footprint (screenshot-confirmed: "Lead Nurture
      // Agents"' chip pill under the "150M — TOUCHDOWN" nav pill).
      // Root cause: Signal Heights only has ONE free tower on the
      // corridor's right side (freeIndex 3, x=+3.28) — piling 2 boards
      // on the left (freeIndex 0/1, both x<-1.5) always pushes one of
      // them into the rail's column. Fixed by moving the SECOND board on
      // each side-heavy district onto the FAR side (mirrors how Pipeline
      // Row's own CRM/chief-of-staff boards already split left/right),
      // and moving both PHOTO billboards onto the SAME tower/face as
      // their district's low-band project board (same "share a wall,
      // stack by height" convention board-signal/board-signal-nameplate
      // already use) instead of a 3rd separate tower whose x nobody had
      // re-verified. Every ndcX/ndcY value re-checked against the real
      // camera curve before landing here.
      ...(
        [
          {
            districtIndex: 0,
            freeIndex: 0,
            project: PROJECTS[0],
            offset: 0.03,
            heightFrac: 0.5,
          }, // Signal: AI Voice Calling Agents (low band, left tower)
          {
            districtIndex: 0,
            freeIndex: 3,
            project: PROJECTS[2],
            offset: 0.02,
            heightFrac: 0.55,
          }, // Signal: Lead Nurture Agents (right tower — clears the Altimeter Rail on the left)
          {
            districtIndex: 1,
            freeIndex: 0,
            project: PROJECTS[1],
            offset: 0.03,
            heightFrac: 0.2,
          }, // Pipeline: End-to-End CRM Automation (low band, left tower)
          {
            districtIndex: 1,
            freeIndex: 1,
            project: PROJECTS[3],
            offset: 0.05,
            heightFrac: 0.3,
          }, // Pipeline: Slack Chief-of-Staff Bot (right tower)
          {
            districtIndex: 2,
            freeIndex: 0,
            project: PROJECTS[5],
            offset: 0.05,
            heightFrac: 0.3,
          }, // Portal: Club Platform (only free tower — no collision risk)
          {
            districtIndex: 3,
            freeIndex: 0,
            project: PROJECTS[4],
            offset: 0.04,
            heightFrac: 0.3,
          }, // Broadcast: AI Video Pipeline (only free tower — no collision risk)
        ] as const
      )
        .map(({ districtIndex, freeIndex, project, offset, heightFrac }) => {
          const a = districts.freeAnchors[districtIndex]?.[freeIndex];
          if (!a) return null;
          const w = 1.0;
          return {
            id: `board-project-${project.id}`,
            name: project.name,
            chip: project.chip,
            body: project.pitch,
            position: new THREE.Vector3(
              a.x + inboardOf(a.x, w),
              (a.y - 0.5) * heightFrac,
              a.z + TOWER_HALF + 0.02,
            ),
            width: w,
            height: 0.95,
            appearAt: DISTRICT_THRESHOLDS[districtIndex] + offset,
            headlineSize: 0.12,
            maxHeadlineLines: 2,
            maxBodyLines: 3,
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null),
      // ── TOUCHDOWN — landing-pad board. Positioned beside the lit
      // doorway (touchdown group sits at world z=-18, door at local
      // z=-2.5 -> world z=-20.5). No CTA button text here — in-world
      // text can't be clicked, so the click action stays on the fixed
      // nav button + the DescentCTAPill (AltitudeClient.tsx).
      {
        id: "board-touchdown",
        name: "Find your leak. I'll engineer it shut.",
        eyebrow: "ALT 0M · LANDED",
        body: "Free · 30 min · no pitch",
        // x=2.1 (was 1.35): the touchdown door is a 1.4-wide box
        // centred on x=0 (spans -0.7 to 0.7) — at 1.35 this board's own
        // left edge (1.35-0.85=0.5) fell INSIDE the door's footprint,
        // screenshot-confirmed clipping the headline's wrapped lines.
        // 2.1 clears the door's right edge (0.7) with real margin.
        position: new THREE.Vector3(2.1, 1.3, -20.5 + 0.12),
        width: 1.7,
        height: 1.5,
        appearAt: 0.9,
        headlineSize: 0.12,
        maxHeadlineLines: 3,
        maxBodyLines: 2,
      },
    ];

    const boards = createCitySignage(boardSpecs, {
      color: C.ink,
      accent: C.jadeBright,
      // Higher than the nameplate signage's 0.55 — the double-exposure
      // defence that capped nameplate opacity lived against the DOM
      // Scrim cards, which are sr-only (invisible) in 3D mode now, so
      // there is nothing left for a bright board to double-expose
      // against. These boards ARE the readable copy in 3D mode.
      maxOpacity: 0.94,
      plate: "rgba(3,10,9,0.97)",
      border: "rgba(31,231,199,0.6)",
      bodyColor: C.body,
      headlineFont: displayStack,
      bodyFont: bodyStack,
      // MOTION FIX M4 (2026-08-27) — revealSpan widened 0.05 -> 0.08 (a
      // slightly longer fade window reads less like a pop, paired with
      // the smoothstep ease below) and both new opt-in easing flags
      // turned on for this call only. Meridian's own createCitySignage
      // call never sets these, so its rendered output is unaffected.
      revealSpan: 0.08,
      easedReveal: true,
      arriveTransform: true,
    });
    scene.add(boards.group);

    const { posCurve, lookCurve } = buildCameraCurves();
    // MOTION FIX M8 (2026-08-27) — precompute an arc-length LUT ONCE off
    // the (already waypoint-pulled-back) position curve. Both position
    // and look are then sampled through the SAME remapped parameter so
    // they stay in lockstep — see `sampleU` in `tick` below.
    const arcRemap = buildArcLengthLUT(posCurve, 200);
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();
    const currentLook = new THREE.Vector3();
    let initialised = false;
    // MOTION FIX M2 — the single shared damped scalar every downstream
    // consumer (camera targets, fog, atmo colour, IBL swap, signage,
    // boards, districts, mist, photo billboards) reads instead of each
    // one independently damping (or not damping) raw scroll progress on
    // its own. The Altimeter HUD (AltitudeClient.tsx) intentionally
    // keeps reading raw progress — it's a numeric readout, not a visual
    // element that benefits from being smoothed a frame behind the
    // user's actual scroll position.
    let smoothP = 0;
    let smoothPInitialised = false;

    // MOTION FIX M3 — hold-and-travel remap. Splits the descent into the
    // same 7 equal bands SCENES.length uses (AltitudeClient.tsx), and
    // within each band eases the camera's own sample point through a
    // fast->flat->fast curve: the first 40% of a band's own scroll
    // range covers the first half of the band's visual travel, the
    // middle 20% barely moves the camera at all (the "hold," framed on
    // whatever waypoint/board sits mid-band), and the final 40% covers
    // the back half — so the camera visibly PAUSES on each district's
    // board wall instead of sweeping past it at a constant rate tied
    // 1:1 to scroll pixels.
    const HOLD_BANDS = 7; // matches SCENES.length in AltitudeClient.tsx
    // Owner-jank fix (08-28): the mid-band hold was a DEAD-FLAT plateau —
    // wheel input produced zero camera motion for 20% of every band,
    // which against native scroll reads as "the page stuttered/hung",
    // not as a cinematic pause. The hold is now a SLOW ZONE (0.6x of
    // average slope), never zero — always some visual response to input.
    const holdEase = (local: number): number => {
      const t = THREE.MathUtils.clamp(local, 0, 1);
      if (t <= 0.4) {
        return THREE.MathUtils.smoothstep(t, 0, 0.4) * 0.44;
      }
      if (t <= 0.6) {
        return 0.44 + ((t - 0.4) / 0.2) * 0.12;
      }
      return 0.56 + THREE.MathUtils.smoothstep(t, 0.6, 1) * 0.44;
    };
    const bandRemap = (t: number): number => {
      const seg = 1 / HOLD_BANDS;
      const bandIdx = Math.min(HOLD_BANDS - 1, Math.floor(t / seg));
      const bandStart = bandIdx * seg;
      const local = (t - bandStart) / seg;
      return bandStart + seg * holdEase(local);
    };

    let raf = 0;
    let last = performance.now();
    const clockStart = performance.now();

    // MOTION FIX M6 — fade the canvas in once (opacity 0 -> 1, CSS
    // transition set on the element above) right after the first real
    // frame has been rendered, not before.
    let firstFrameRevealed = false;

    // MOTION FIX M7 — governor: skip the first two 2s sample windows
    // (letting shader/texture warm-up jank settle before any decision is
    // made off it), shed a quality level only after 2 CONSECUTIVE bad
    // windows (one slow window is noise, not a trend), and restore a
    // level after 4 CONSECUTIVE good windows (hysteresis — restoring too
    // eagerly just re-triggers the same shed a few seconds later).
    let frameSampleStart = performance.now();
    let frameSampleCount = 0;
    let degraded = false;
    let postReduced = false;
    let sampleWindowIndex = 0;
    let postBadStreak = 0;
    let postGoodStreak = 0;
    let contentBadStreak = 0;
    let contentGoodStreak = 0;
    const SHED_STREAK = 2;
    const RESTORE_STREAK = 4;
    const POST_SHED_MS = 20;
    const POST_RESTORE_MS = 15;
    const CONTENT_SHED_MS = 22;
    const CONTENT_RESTORE_MS = 17;

    // ── Photographic post chain. Bloom is what makes a window emissive
    // read as a light source rather than a bright rectangle, and it only
    // works honestly on top of the filmic curve applied above — bloom
    // without tone mapping just smears clipped white. Threshold sits
    // high on purpose (0.88, matching Meridian): only the sun disc and
    // the window emissives should bleed. Drop it and the cloud deck
    // itself starts glowing, which reads as a dirty lens.
    const post = createPostChain(renderer, scene, camera, {
      bloomStrength: 0.3,
      bloomRadius: 0.5,
      bloomThreshold: 0.88,
      grain: 0.026,
      vignette: 0.88,
    });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = (now - clockStart) / 1000;

      const rawP = THREE.MathUtils.clamp(progress.get(), 0, 1);
      if (!smoothPInitialised) {
        smoothP = rawP;
        smoothPInitialised = true;
      } else {
        smoothP = damp1(smoothP, rawP, 4.5, dt);
      }
      const p = smoothP;

      // VERIFY-LOOP FINDING (2026-08-27) — M8 asks for BOTH a
      // hold-and-travel band remap (M3, `bandRemap` above — verified
      // working, no framing regressions) AND arc-length-uniform camera
      // speed (`arcRemap`, built above via buildArcLengthLUT). Chaining
      // them (`arcRemap(bandRemap(p))`) was screenshot-verified to
      // reintroduce the exact defect M8 was meant to fix elsewhere: the
      // Signal Heights message board (and likely others) bled off the
      // right edge, because every board's position/rotation in this
      // file was hand-tuned across many prior fix rounds against the
      // ORIGINAL direct index-based `posCurve.getPoint(rawProgress)`
      // mapping — re-parameterizing by arc length moves the camera to a
      // materially different point at the same scroll progress, which
      // silently invalidates that tuning. Re-deriving all ~20 board
      // positions against the arc-length-corrected curve is a real,
      // separate pass this fix round's budget didn't cover. Landing on
      // `bandRemap` alone (screenshot-confirmed clean at the same
      // checkpoint) rather than shipping a visible regression — the
      // LUT (`arcRemap`) stays exported and ready for that follow-up
      // pass. See CameraPath.ts's own PULL_BACK=0 note for the sibling
      // finding on M8's waypoint-pull-back half.
      const sampleU = bandRemap(p);
      posCurve.getPoint(sampleU, targetPos);
      lookCurve.getPoint(sampleU, targetLook);

      if (!initialised) {
        camera.position.copy(targetPos);
        currentLook.copy(targetLook);
        initialised = true;
      } else {
        damp3(camera.position, targetPos, 4.5, dt);
        damp3(currentLook, targetLook, 4.5, dt);
      }
      camera.lookAt(currentLook);

      if (scene.fog instanceof THREE.Fog) {
        scene.fog.near = THREE.MathUtils.lerp(24, 15, p);
        scene.fog.far = THREE.MathUtils.lerp(50, 32, p);
        scene.fog.color.copy(atmoColor(_fogColor, p));
      }
      (scene.background as THREE.Color).copy(atmoColor(_bgColor, p));
      // Key light dims and tints from cloud-deck white toward jade night
      // across the same descent scalar — this is what stops the touchdown
      // ground plane (and every other near-horizontal surface) from
      // blowing out under a constant near-white directional light.
      sky.color.copy(atmoColor(_keyColor, p));
      sky.intensity = THREE.MathUtils.lerp(0.22, 0.05, p);

      // Swap the baked probe at the nearest stop. Comparing texture
      // identity rather than the scalar means this assigns at most twice
      // across the whole descent, not every frame.
      const nextEnv = skyEnv.get(p);
      if (nextEnv !== scene.environment) {
        scene.environment = nextEnv;
      }

      if (!degraded) {
        objects.forEach((o) => o.update(dt, elapsed, p));
      } else {
        // Degraded: keep camera + touchdown door alive, freeze clouds and
        // bridges (skip their update — leaves them at last-written state,
        // effectively "constant glow, packet frozen mid-span").
        objects[1].update(dt, elapsed, p); // districts (content, not decoration)
        objects[3].update(dt, elapsed, p); // touchdown door
      }
      // Plates project off the same camera matrix the draw uses. They
      // are content (district names), so they keep updating even when
      // the perf governor has degraded the decorative layers.
      signage.update(p);
      boards.update(p);
      post.render(dt);

      if (!firstFrameRevealed) {
        firstFrameRevealed = true;
        requestAnimationFrame(() => {
          renderer.domElement.style.opacity = "1";
        });
      }

      frameSampleCount++;
      if (now - frameSampleStart > 2000) {
        const avgFrameMs =
          (now - frameSampleStart) / Math.max(1, frameSampleCount);
        sampleWindowIndex++;
        // Skip the first two windows outright — shader/texture warm-up
        // jank in the first ~4s is not a sustained-load signal.
        if (sampleWindowIndex > 2) {
          // Post sheds FIRST, before any content degrades — bloom is the
          // most expensive thing on screen and the least load-bearing.
          if (avgFrameMs > POST_SHED_MS) {
            postBadStreak++;
            postGoodStreak = 0;
          } else if (avgFrameMs < POST_RESTORE_MS) {
            postGoodStreak++;
            postBadStreak = 0;
          } else {
            postBadStreak = 0;
            postGoodStreak = 0;
          }
          if (!postReduced && postBadStreak >= SHED_STREAK) {
            postReduced = true;
            post.setQuality("reduced");
            mount.dataset.governor = "post-reduced";
            postBadStreak = 0;
          } else if (postReduced && postGoodStreak >= RESTORE_STREAK) {
            postReduced = false;
            post.setQuality("full");
            delete mount.dataset.governor;
            postGoodStreak = 0;
          }

          if (avgFrameMs > CONTENT_SHED_MS) {
            contentBadStreak++;
            contentGoodStreak = 0;
          } else if (avgFrameMs < CONTENT_RESTORE_MS) {
            contentGoodStreak++;
            contentBadStreak = 0;
          } else {
            contentBadStreak = 0;
            contentGoodStreak = 0;
          }
          if (!degraded && contentBadStreak >= SHED_STREAK) {
            // Clouds' fade/visibility is a pure function of `p`,
            // recomputed every frame — freezing mid-transition (update
            // simply skipped from here on) would strand whatever
            // opacity/visible state it last had, regardless of how far
            // the user keeps scrolling. Snap it once to its clean
            // end-of-life state (progress=1 -> fade 0, mesh hidden)
            // before the degrade ladder starts skipping its update
            // entirely.
            objects[0].update(0, elapsed, 1);
            degraded = true;
            contentBadStreak = 0;
          } else if (degraded && contentGoodStreak >= RESTORE_STREAK) {
            // Un-degrade: the next full objects.forEach pass recomputes
            // clouds' live fade/visibility off the real `p` again, so
            // nothing needs to be manually restored here beyond the flag.
            degraded = false;
            contentGoodStreak = 0;
          }
        }
        frameSampleStart = now;
        frameSampleCount = 0;
      }
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      // The composer keeps its own render targets. Resizing the renderer
      // alone leaves every pass sampling at the old size, which shows up
      // as a misregistered, soft frame after a resize/rotation.
      post.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener("webglcontextlost", onContextLost, {
      once: true,
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvasEl.removeEventListener("webglcontextlost", onContextLost);
      signage.dispose();
      boards.dispose();
      facade.dispose();
      post.dispose();
      skyEnv.dispose();
      scene.environment = null;
      objects.forEach((o) => {
        o.dispose();
        scene.remove(o.group);
      });
      Object.values(mats).forEach((m) => m.dispose());
      renderer.dispose();
      if (canvasEl.parentElement) canvasEl.parentElement.removeChild(canvasEl);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  }, [progress, onContextLost]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    />
  );
}
