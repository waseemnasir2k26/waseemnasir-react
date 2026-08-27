"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C, DISTRICTS } from "./tokens";
import { buildCameraCurves, damp3 } from "./CameraPath";
import {
  makeMaterials,
  buildClouds,
  buildDescentDistricts,
  buildBridges,
  buildTouchdown,
  buildEarlyMist,
  DISTRICT_THRESHOLDS,
  type SceneObject,
} from "./SceneObjects";
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    const objects: SceneObject[] = [
      buildClouds(),
      districts,
      buildBridges(pipelineAnchor),
      buildTouchdown(mats),
      // OWNER FIX (08-27) — see buildEarlyMist's own header comment.
      buildEarlyMist(),
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
          appearAt: threshold + 0.03,
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
      },
    );
    districts.group.add(signage.group);

    const { posCurve, lookCurve } = buildCameraCurves();
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();
    const currentLook = new THREE.Vector3();
    let initialised = false;

    let raf = 0;
    let last = performance.now();
    const clockStart = performance.now();

    // Rolling frame-time monitor: sustained slow frames degrade the two
    // GPU-heaviest, least-essential surfaces (bridges + cloud shader)
    // before anything else, per the approved perf budget's degrade ladder.
    let frameSampleStart = performance.now();
    let frameSampleCount = 0;
    let degraded = false;
    let postReduced = false;

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

      const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
      posCurve.getPoint(p, targetPos);
      lookCurve.getPoint(p, targetLook);

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
      post.render(dt);

      frameSampleCount++;
      if (now - frameSampleStart > 2000) {
        const avgFrameMs =
          (now - frameSampleStart) / Math.max(1, frameSampleCount);
        // Post sheds FIRST, before any content degrades — bloom is the
        // most expensive thing on screen and the least load-bearing.
        if (!postReduced && avgFrameMs > 20) {
          postReduced = true;
          post.setQuality("reduced");
          mount.dataset.governor = "post-reduced";
        }
        if (!degraded && avgFrameMs > 22) {
          // Clouds' fade/visibility is a pure function of `p`, recomputed
          // every frame — freezing mid-transition (update simply skipped
          // from here on) would strand whatever opacity/visible state it
          // last had, regardless of how far the user keeps scrolling.
          // Snap it once to its clean end-of-life state (progress=1 ->
          // fade 0, mesh hidden) before the degrade ladder starts
          // skipping its update entirely. Bridges don't need this: their
          // geometry never depends on `p`, only their pulse shader's
          // uTime, so freezing them just stops the pulse animation in
          // place — the documented, intended "packet frozen mid-span".
          objects[0].update(0, elapsed, 1);
          degraded = true;
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
