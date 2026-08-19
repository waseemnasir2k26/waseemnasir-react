"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C } from "./tokens";
import { buildConduitCurve, damp3, lookAheadT } from "./CameraPath";
import {
  makeMaterials,
  buildConduitTube,
  buildParticleStream,
  buildIntakeGate,
  buildJunctionNode,
  buildPipelineBays,
  buildVaultChamber,
  buildDeliveryDock,
  type SceneObject,
} from "./SceneObjects";

/* ============================================================
   SIGNAL CANVAS — plain three.js, mounted imperatively in a
   useEffect (no @react-three/fiber — see SceneObjects.ts header;
   same finding as the sibling /v/orbit and /v/forge canvases).

   Fixed, full-viewport, position:fixed behind the real HTML
   content so it never affects document layout (no CLS) and never
   captures scroll — native scroll drives the camera via `progress`,
   read every rAF tick (no React re-renders).

   Unlike orbit's third-person camera, this one rides the conduit's
   own centerline curve: position = curve.getPoint(p), look-at a
   short arc-length ahead of it — the packet flying itself.
   ============================================================ */
export default function SignalCanvas({
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
    scene.fog = new THREE.Fog(C.paper, 6, 22);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      60,
    );

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    const directional = new THREE.DirectionalLight(C.paper, 1.0);
    directional.position.set(4, 6, 4);
    const point = new THREE.PointLight(C.jade, 0.7, 0, 2);
    point.position.set(0, 2, 4);
    scene.add(ambient, directional, point);

    const curve = buildConduitCurve();
    const mats = makeMaterials();
    const objects: SceneObject[] = [
      buildConduitTube(curve, mats),
      buildParticleStream(curve, mats),
      buildIntakeGate(mats),
      buildJunctionNode(mats),
      buildPipelineBays(mats),
      buildVaultChamber(mats),
      buildDeliveryDock(mats),
    ];
    objects.forEach((o) => scene.add(o.group));

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
      curve.getPoint(p, targetPos);
      curve.getPoint(lookAheadT(p), targetLook);

      if (!initialised) {
        camera.position.copy(targetPos);
        currentLook.copy(targetLook);
        initialised = true;
      } else {
        damp3(camera.position, targetPos, 4.2, dt);
        damp3(currentLook, targetLook, 4.2, dt);
      }
      camera.lookAt(currentLook);

      objects.forEach((o) => o.update(dt, elapsed, p));
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
