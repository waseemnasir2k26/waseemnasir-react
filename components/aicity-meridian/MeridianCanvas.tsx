"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C, DUSK } from "./tokens";
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
  type SceneObject,
} from "./SceneObjects";

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

    const mats = makeMaterials();
    const dockBuild = buildDock(mats);
    const objects: SceneObject[] = [
      buildCityGrid(mats),
      buildStackDistrict(mats),
      buildProofPlaza(mats),
      buildWorksBoulevard(mats),
      buildInterconnect(mats),
      buildSun(mats),
      dockBuild.scene,
    ];
    objects.forEach((o) => scene.add(o.group));

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

    let raf = 0;
    let last = performance.now();
    const clockStart = performance.now();
    let visible = !document.hidden;

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      const frameMs = now - last;
      last = now;
      const elapsed = (now - clockStart) / 1000;

      frameTimes.push(frameMs);
      if (frameTimes.length > 60) frameTimes.shift();
      if (frameTimes.length === 60) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / 60;
        if (avg > 22 && !packetsHalved) {
          packetsHalved = true; // logged via dataset, no UI
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

      objects.forEach((o) => o.update(dt, elapsed, dayness));
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener("webglcontextlost", onContextLost, {
      once: true,
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvasEl.removeEventListener("webglcontextlost", onContextLost);
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
