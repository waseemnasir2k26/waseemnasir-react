"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import {
  buildCity,
  buildGround,
  buildSky,
  buildSun,
  buildHarborBeacon,
} from "./CitySceneBuild";

/* ============================================================
   NightCityCanvas — plain three.js, imperative mount (no r3f/drei —
   forbidden in this repo, see AGENTS.md + the sibling aicity-*
   canvases). Camera is stationary (only a ±0.5° pointermove
   parallax nudge); scroll never moves it. One uniform, uProgress,
   is written every rAF tick from a damped lerp toward the live
   scroll fraction — this is the entire "scroll scrubs time" engine.
   ============================================================ */

export default function NightCityCanvas({
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

    let disposed = false;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      120,
    );
    const baseCamPos = new THREE.Vector3(0, 5.4, 12);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 4, -20);

    const sky = buildSky();
    scene.add(sky.mesh);

    const ground = buildGround();
    scene.add(ground.mesh);

    const city = buildCity();
    scene.add(city.mesh);

    const sun = buildSun();
    scene.add(sun.disc);
    scene.add(sun.glow);

    const beacon = buildHarborBeacon();
    scene.add(beacon.mesh);

    const dirLight = new THREE.DirectionalLight(0x6b7ea8, 0.4);
    dirLight.position.set(-8, 10, 6);
    scene.add(dirLight);
    const ambLight = new THREE.AmbientLight(0x0d1220, 0.6);
    scene.add(ambLight);

    // ---- pointer parallax: ±0.5° max, damped ----
    let targetYaw = 0;
    let targetPitch = 0;
    let curYaw = 0;
    let curPitch = 0;
    const MAX_RAD = THREE.MathUtils.degToRad(0.5);
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetYaw = -nx * MAX_RAD;
      targetPitch = -ny * MAX_RAD;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ---- resize ----
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ---- rAF: damp uProgress toward live scroll fraction, butter-smooth
    let uProgress = 0;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const target = progress.get();
      // exponential damp — reversible either direction, no one-way state
      const damp = 1 - Math.pow(0.001, dt);
      uProgress += (target - uProgress) * damp;

      curYaw += (targetYaw - curYaw) * 0.06;
      curPitch += (targetPitch - curPitch) * 0.06;
      camera.position.copy(baseCamPos);
      camera.lookAt(0, 4, -20);
      camera.rotation.y += curYaw;
      camera.rotation.x += curPitch;

      (sky.mesh.material as THREE.ShaderMaterial).uniforms.uProgress.value =
        uProgress;
      (city.mesh.material as THREE.ShaderMaterial).uniforms.uProgress.value =
        uProgress;
      sun.update(uProgress);
      beacon.update(uProgress, now);

      // directional light + fog follow the same timeline as the sky
      const warm = THREE.MathUtils.smoothstep(uProgress, 0.65, 1.0);
      dirLight.color.setRGB(
        0.42 + warm * 0.58,
        0.49 + warm * 0.38,
        0.66 - warm * 0.28,
      );
      dirLight.intensity = 0.4 + warm * 1.1;
      dirLight.position.set(-8 + warm * 4, 6 + warm * 10, 6);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      city.dispose();
      ground.dispose();
      sky.dispose();
      sun.dispose();
      beacon.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      void disposed;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
