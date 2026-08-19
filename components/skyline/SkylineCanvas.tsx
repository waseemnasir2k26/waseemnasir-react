"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C } from "./tokens";
import { buildCameraCurves, damp3 } from "./CameraPath";
import {
  makeMaterials,
  buildCityGrid,
  buildStackDistrict,
  buildProofPlaza,
  buildWorksBoulevard,
  buildDock,
  type SceneObject,
} from "./SceneObjects";

/* ============================================================
   SKYLINE CANVAS — plain three.js, mounted imperatively in a
   useEffect (no @react-three/fiber — see components/orbit/
   SceneObjects.ts header for why: react-reconciler@0.27, the only
   line compatible with this repo's React 18.3.1, can't read the
   secret-internals shape this Next.js build's client bundle
   exposes; verified failure under both Turbopack and webpack).

   Fixed, full-viewport, position:fixed behind the real HTML
   content so it never affects document layout (no CLS) and never
   captures scroll — native scroll drives the camera via `progress`,
   read every rAF tick (no React re-renders).
   ============================================================ */
export default function SkylineCanvas({
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
    // Fog uses the paper tone per the brief — a pale haze the city's own
    // jade lights bleach into, but pushed well past the flight path itself
    // (buildings start ~9 units out) so the near-field city stays dark and
    // night-readable; only the horizon at the far clip bleaches pale. Also
    // doubles as draw-distance culling over the ~42-unit-long flyover.
    scene.fog = new THREE.Fog(C.paper, 24, 52);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      70,
    );

    const ambient = new THREE.AmbientLight(0x0e3330, 0.32);
    const moon = new THREE.DirectionalLight(C.paper, 0.18);
    moon.position.set(-4, 10, 6);
    const glow = new THREE.PointLight(C.jadeBright, 0.9, 0, 2);
    glow.position.set(0, 4, -4);
    scene.add(ambient, moon, glow);

    const mats = makeMaterials();
    const objects: SceneObject[] = [
      buildCityGrid(mats),
      buildStackDistrict(mats),
      buildProofPlaza(mats),
      buildWorksBoulevard(mats),
      buildDock(mats),
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

      objects.forEach((o) => o.update(dt, elapsed));
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
