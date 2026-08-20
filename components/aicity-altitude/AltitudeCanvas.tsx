"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C } from "./tokens";
import { buildCameraCurves, damp3 } from "./CameraPath";
import {
  makeMaterials,
  buildClouds,
  buildDescentDistricts,
  buildBridges,
  buildTouchdown,
  type SceneObject,
} from "./SceneObjects";

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
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(C.skyDark);
    // Fog sharpens as you descend: starts hazy (cloud deck era) and pulls
    // in tighter by touchdown — updated per-frame below (two scalars, no
    // allocation) so the city visibly "comes into focus" as you fall.
    scene.fog = new THREE.Fog(C.paper, 20, 46);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      60,
    );

    const ambient = new THREE.AmbientLight(0x0e3330, 0.34);
    const sky = new THREE.DirectionalLight(C.paper, 0.2);
    sky.position.set(-3, 12, 4);
    const glow = new THREE.PointLight(C.jadeBright, 0.85, 0, 2);
    glow.position.set(0, 3, -6);
    scene.add(ambient, sky, glow);

    const mats = makeMaterials();
    const objects: SceneObject[] = [
      buildClouds(),
      buildDescentDistricts(mats),
      buildBridges(),
      buildTouchdown(mats),
    ];
    objects.forEach((o) => scene.add(o.group));

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
        scene.fog.near = THREE.MathUtils.lerp(20, 14, p);
        scene.fog.far = THREE.MathUtils.lerp(46, 34, p);
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
      renderer.render(scene, camera);

      frameSampleCount++;
      if (now - frameSampleStart > 2000) {
        const avgFrameMs =
          (now - frameSampleStart) / Math.max(1, frameSampleCount);
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
