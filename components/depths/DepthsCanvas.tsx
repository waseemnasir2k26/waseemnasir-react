"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C } from "./tokens";
import { buildCameraCurves, damp3 } from "./CameraPath";
import {
  makeMaterials,
  buildParticleField,
  buildGodRays,
  buildReefEmblems,
  buildTrenchBeacons,
  buildStationWindows,
  buildFloorPlatform,
  type SceneObject,
} from "./SceneObjects";

/* ============================================================
   DEPTHS CANVAS — plain three.js, mounted imperatively in a
   useEffect (no @react-three/fiber — same architecture law as
   components/orbit/OrbitCanvas.tsx: react-reconciler@0.27, the
   only line compatible with this repo's React 18.3.1, can't read
   the secret-internals shape this Next.js build's client bundle
   exposes; verified failure under both Turbopack and webpack).

   Fixed, full-viewport, position:fixed behind the real HTML
   content so it never affects document layout (no CLS) and never
   captures scroll — native scroll drives the camera via `progress`,
   read every rAF tick (no React re-renders).

   The descent's signature move vs. orbit: scene.background and
   scene.fog color are lerped every frame from paper (#FBFCFD) to
   deep ink-jade (#0A3D38) as `progress` advances, so the world
   itself visibly brightens→darkens instead of just the camera
   moving through a fixed-color fog.
   ============================================================ */
export default function DepthsCanvas({
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

    const paperColor = new THREE.Color(C.paper);
    const deepColor = new THREE.Color(C.deep);
    const bgColor = paperColor.clone();

    const scene = new THREE.Scene();
    scene.background = bgColor;
    scene.fog = new THREE.Fog(bgColor.getHex(), 6, 22);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      60,
    );

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    const surfaceLight = new THREE.DirectionalLight(C.paper, 1.1);
    surfaceLight.position.set(2, 10, 6);
    const glow = new THREE.PointLight(C.jade, 0.9, 0, 2);
    glow.position.set(-2, -6, -3);
    scene.add(ambient, surfaceLight, glow);

    const mats = makeMaterials();
    const objects: SceneObject[] = [
      buildParticleField(mats),
      buildGodRays(),
      buildReefEmblems(mats),
      buildTrenchBeacons(mats),
      buildStationWindows(mats),
      buildFloorPlatform(mats),
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

      // gradient descent: surface light -> deep ink-jade as p advances
      bgColor.copy(paperColor).lerp(deepColor, p);
      (scene.fog as THREE.Fog).color.copy(bgColor);
      scene.background = bgColor;
      surfaceLight.intensity = 1.1 * (1 - p * 0.75);
      ambient.intensity = 0.55 * (1 - p * 0.6) + 0.08;
      glow.intensity = 0.9 + p * 1.4;

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
