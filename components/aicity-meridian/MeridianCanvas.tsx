"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C, DUSK, DISTRICT } from "./tokens";
import { buildCameraCurves, damp3 } from "./CameraPath";
import {
  makeMaterials,
  buildCityGrid,
  buildStackDistrict,
  buildProofPlaza,
  buildWorksBoulevard,
  buildInterconnect,
  buildSun,
  buildDock,
  disposeFacade,
  STACK_LAYOUT,
  stackThreshold,
  type SceneObject,
} from "./SceneObjects";
import { createCitySignage } from "../aicity-core/CitySignage";
import {
  applyFilmicRenderer,
  applyEnvResponse,
  createSkyEnvironment,
  createPostChain,
} from "../aicity-core/Realism";

/* ============================================================
   MERIDIAN CANVAS — plain three.js, mounted imperatively in a
   useEffect (fiber/drei forbidden repo-wide — see
   components/skyline/SkylineCanvas.tsx header for why). Sibling
   architecture, rebuilt around ONE master scroll-driven scalar,
   `dayness` (0 = golden hour entry, 1 = midnight dock), which this
   file computes once per frame from scroll `progress` and passes
   into every scene object's update() — the whole day/night cycle
   is a single number flowing downstream, nothing else reads scroll.

   Sky + fog: a 3-stop JS Color lerp (duskA -> duskB -> duskC across
   the first 30% of the cycle, then duskC -> skyDark for the rest) —
   cheap, allocation-free (Color.lerpColors reuses scratch objects),
   and the fog color always matches the sky so the horizon never
   seams. This is the "one uniform drives sky/fog" mechanic; window/
   streetlamp/landmark ignition is genuine GLSL (see SceneObjects).

   Fixed, full-viewport, position:fixed behind the real HTML content
   so it never affects document layout (no CLS) and never captures
   scroll — native scroll drives everything, read every rAF tick.
   ============================================================ */
export default function MeridianCanvas({
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
    // Filmic response BEFORE anything reads a colour. Without it
    // every emissive above 1.0 clips flat to white and the dusk
    // palette has no highlight shoulder to roll off into.
    applyFilmicRenderer(renderer, 0.98);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const skyColor = new THREE.Color(DUSK.duskA);
    scene.background = skyColor;
    scene.fog = new THREE.Fog(DUSK.duskA, 22, 50);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      70,
    );

    const ambient = new THREE.AmbientLight(0x0e3330, 0.32);
    const sunLight = new THREE.DirectionalLight("#F3D9B8", 0.6);
    sunLight.position.set(-4, 6, 6);
    const moon = new THREE.DirectionalLight(C.paper, 0);
    moon.position.set(-4, 10, 6);
    const glow = new THREE.PointLight(C.jadeBright, 0.4, 0, 2);
    glow.position.set(0, 4, -4);
    scene.add(ambient, sunLight, moon, glow);

    // ── Image-based lighting, generated on the GPU at mount. Three
    // probes across the cycle (golden hour / dusk / night), baked
    // once each and swapped at the nearest stop — the sky and fog
    // already lerp continuously above this, so the stepping
    // underneath is invisible in motion. No .hdr, no network.
    const skyEnv = createSkyEnvironment(renderer, [
      {
        at: 0.0,
        sky: DUSK.duskA,
        ground: C.inkJade,
        sun: "#F3D9B8",
        sunIntensity: 1.0,
      },
      {
        at: 0.35,
        sky: DUSK.duskC,
        ground: C.inkJade,
        sun: "#C9885E",
        sunIntensity: 0.55,
      },
      {
        at: 1.0,
        sky: C.skyDark,
        ground: C.inkJade,
        sun: C.jadeBright,
        sunIntensity: 0.22,
      },
    ]);
    scene.environment = skyEnv.get(0);
    let envStop = 0;

    const mats = makeMaterials();
    // metalness 0.25 with no environment to reflect was only ever
    // darkening these surfaces. Now it has something to catch.
    applyEnvResponse(mats, 0.45);
    const dockBuild = buildDock(mats);
    // Mutable governor ref shared with buildInterconnect — flipping
    // packetsReduced actually halves the drawn/animated packet
    // instances (see buildInterconnect in SceneObjects.ts), not just a
    // cosmetic dataset flag.
    const packetGovernor = { packetsReduced: false };
    const objects: SceneObject[] = [
      buildCityGrid(mats),
      buildStackDistrict(mats),
      buildProofPlaza(mats),
      buildWorksBoulevard(mats),
      buildInterconnect(mats, packetGovernor),
      buildSun(mats),
      dockBuild.scene,
    ];
    objects.forEach((o) => scene.add(o.group));

    // ── Building signage. Mounted on the STACK DISTRICT group itself
    // (objects[1]) rather than the scene, so every sign inherits the
    // district's slow drift and stays welded to its tower. Each sign
    // sits proud of the +Z facade in the upper third of the building
    // and lights on the same threshold that ignites that tower, so a
    // name never arrives before the building it belongs to. ──
    const signage = createCitySignage(
      DISTRICT.map((d, i) => {
        const slot = STACK_LAYOUT[i] ?? { x: 0, z: -4, h: 4 };
        const SIGN_W = 2.2;
        const TOWER_HALF = 0.45; // towers are scaled 0.9 in x/z
        // A sign wide enough to read is wider than the tower carrying
        // it, so a centred plate runs straight into the neighbouring
        // tower (verified: Switchboard and Projection House were both
        // half-eaten at 2.5 centred). Hang each sign OUTBOARD — left of
        // the corridor extends left, right extends right — so the
        // overhang always falls into open air, never into a neighbour.
        const outboard =
          (slot.x < 0 ? -1 : 1) * (SIGN_W / 2 - TOWER_HALF) * 0.9;
        return {
          id: d.id,
          name: d.name,
          sub: d.service,
          // Near the roofline (0.88) so the sign clears the shorter
          // city-grid blocks standing in front of the district, and
          // and standing well proud of the +Z facade (tower front is at
          // z + 0.45) so the plate reads as a mounted marquee and never
          // loses letters to its own tower body at a glancing angle.
          position: new THREE.Vector3(
            slot.x + outboard,
            slot.h * 0.88,
            slot.z + 1.15,
          ),
          width: SIGN_W,
          height: 0.6,
          appearAt: stackThreshold(i),
        };
      }),
      { color: C.ink, accent: C.jadeBright },
    );
    objects[1].group.add(signage.group);

    const { posCurve, lookCurve } = buildCameraCurves();
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();
    const currentLook = new THREE.Vector3();
    let initialised = false;

    // Scratch colors reused every frame — zero per-frame allocation.
    const cA = new THREE.Color(DUSK.duskA);
    const cB = new THREE.Color(DUSK.duskB);
    const cC = new THREE.Color(DUSK.duskC);
    const night = new THREE.Color(C.skyDark);
    const scratch = new THREE.Color();

    // ── frame-budget governor: rolling average, sheds decoration
    // before content if sustained >22ms/frame (~<45fps). ──
    const frameTimes: number[] = [];
    let packetsHalved = false;
    let dprLowered = false;
    let postReduced = false;

    // ── Photographic post chain. Bloom is what makes an emissive
    // window read as a light source rather than a bright rectangle,
    // and it only works honestly on top of the filmic curve set
    // above — bloom without tone mapping just smears clipped white.
    const post = createPostChain(renderer, scene, camera, {
      // Threshold sits high on purpose: the sun disc and the window
      // emissives are the only things that should bleed. Drop it and
      // the whole dusk sky starts glowing, which reads as fog on the
      // lens rather than light in the scene.
      bloomStrength: 0.3,
      bloomRadius: 0.5,
      bloomThreshold: 0.88,
      grain: 0.026,
      vignette: 0.88,
    });

    let raf = 0;
    let last = performance.now();
    const clockStart = performance.now();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      const frameMs = now - last;
      last = now;
      const elapsed = (now - clockStart) / 1000;

      frameTimes.push(frameMs);
      if (frameTimes.length > 60) frameTimes.shift();
      if (frameTimes.length === 60) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / 60;
        // Decoration sheds before content, and the composer sheds
        // before the decoration — bloom is the most expensive thing
        // on screen and the least load-bearing.
        if (avg > 20 && !postReduced) {
          postReduced = true;
          post.setQuality("reduced");
          mount.dataset.governor = "post-reduced";
        }
        if (avg > 22 && !packetsHalved) {
          packetsHalved = true;
          packetGovernor.packetsReduced = true; // real instance-count cut
          mount.dataset.governor = "packets-reduced";
        }
        if (avg > 26 && !dprLowered) {
          dprLowered = true;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
          mount.dataset.governor = "dpr-lowered";
        }
      }

      const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
      const dayness = p; // the single master scalar

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

      // Sky/fog: 3-stop desaturated dusk ramp (0-30%) folding into the
      // shipped night state (30-100%) — the same scalar as everything else.
      if (dayness < 0.15) {
        scratch.copy(cA).lerp(cB, dayness / 0.15);
      } else if (dayness < 0.3) {
        scratch.copy(cB).lerp(cC, (dayness - 0.15) / 0.15);
      } else {
        scratch.copy(cC).lerp(night, (dayness - 0.3) / 0.7);
      }
      skyColor.copy(scratch);
      (scene.fog as THREE.Fog).color.copy(scratch);

      // Sun -> moon light handoff, same scalar.
      sunLight.intensity = Math.max(0, 0.6 * (1 - dayness / 0.28));
      moon.intensity =
        0.18 * THREE.MathUtils.clamp((dayness - 0.4) / 0.3, 0, 1);
      ambient.intensity = 0.18 + dayness * 0.2;

      // Swap the baked probe at the nearest stop. Comparing the
      // texture identity rather than the scalar means this assigns
      // at most twice across the whole scroll, not every frame.
      const nextEnv = skyEnv.get(dayness);
      if (nextEnv !== scene.environment) {
        scene.environment = nextEnv;
        envStop = dayness;
      }
      void envStop;

      objects.forEach((o) => o.update(dt, elapsed, dayness));
      // After the camera is final for this frame, before the draw — the
      // plates project off the same matrix the render uses.
      signage.update(dayness);
      post.render(dt);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      // The composer keeps its own render targets. Resizing the
      // renderer alone leaves every pass sampling at the old size,
      // which shows up as a misregistered, soft frame after a
      // window resize or a device-rotation.
      post.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Stop the rAF loop entirely while the tab is hidden (mirrors
    // AltitudeCanvas) instead of scheduling-then-early-returning every
    // frame, which kept the loop alive (and the browser's hidden-tab
    // throttling still ticking it) for no work done.
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
      post.dispose();
      skyEnv.dispose();
      scene.environment = null;
      objects.forEach((o) => {
        o.dispose();
        scene.remove(o.group);
      });
      Object.values(mats).forEach((m) => m.dispose());
      // After the materials that reference them, never before.
      disposeFacade();
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
