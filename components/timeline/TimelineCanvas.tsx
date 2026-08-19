"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C } from "./tokens";
import { buildCameraCurves, damp3 } from "./CameraPath";
import {
  makeMaterials,
  buildRailSpine,
  buildGates,
  buildStackDocks,
  buildMonuments,
  buildPlatform,
  buildArrow,
  type SceneObject,
} from "./SceneObjects";

/* ============================================================
   TIMELINE CANVAS — plain three.js, mounted imperatively in a
   useEffect (no @react-three/fiber — same documented reason as
   components/orbit/OrbitCanvas.tsx: react-reconciler@0.27, the
   only line compatible with this repo's React 18.3.1, can't read
   the secret-internals shape this Next.js build's client bundle
   exposes; verified failure under both Turbopack and webpack).

   Fixed, full-viewport, position:fixed behind the real HTML
   content so it never affects document layout (no CLS) and never
   captures scroll — native scroll drives the camera via `progress`,
   read every rAF tick (no React re-renders).

   As progress nears 1 ("the arrow"), fog + point-light warm
   slightly brighter/jade — the only per-frame effect driven by
   scroll progress outside the camera curve itself.
   ============================================================ */
export default function TimelineCanvas({
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
    scene.background = new THREE.Color(C.paper);
    const fogNear = 9;
    const fogFar = 30;
    scene.fog = new THREE.Fog(C.paper, fogNear, fogFar);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      60,
    );

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const directional = new THREE.DirectionalLight(C.paper, 1.1);
    directional.position.set(4, 6, 4);
    const point = new THREE.PointLight(C.jade, 0.6, 0, 2);
    point.position.set(-3, 2, -6);
    scene.add(ambient, directional, point);

    const mats = makeMaterials();
    const objects: SceneObject[] = [
      buildRailSpine(mats),
      buildGates(mats),
      buildStackDocks(mats),
      buildMonuments(mats),
      buildPlatform(mats),
      buildArrow(mats),
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

      // The arrow scene (final ~15% of scroll) brightens the fog/point
      // light toward the jade tint — "the rail continues into light".
      const glow = THREE.MathUtils.smoothstep(p, 0.82, 1);
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.far = THREE.MathUtils.lerp(fogFar, fogFar + 10, glow);
      }
      point.intensity = 0.6 + glow * 1.4;

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
