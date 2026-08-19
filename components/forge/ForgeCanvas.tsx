"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { C } from "./tokens";
import { BUILD_END, HERO_END, bandLocal, lerp } from "./bands";

/* ============================================================
   Plain three.js, mounted imperatively — NOT @react-three/fiber.

   Next.js 16's App Router client bundle vendors its own React build
   (React 19.2 canary, per node_modules/next/dist/docs/.../version-16.md
   "React 19.2" section) regardless of this repo's own react@18.3.1 in
   package.json — Turbopack aliases every `require("react")` (including
   the one inside react-reconciler, which @react-three/fiber's renderer
   is built on) to that vendored copy. react-reconciler@0.27.0 — the only
   line that supports React 18 internals, and the version @react-three/
   fiber@8.x pins — reads `React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_
   WILL_BE_FIRED.ReactCurrentOwner`; Next's vendored build exports
   `__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`
   instead (React 19's renamed/restructured internals, no ReactCurrentOwner)
   — so the reconciler crashes on the very first render. Verified failing
   under both Turbopack and webpack; matches the sibling /v/orbit build's
   independent finding (components/orbit/OrbitCanvas.tsx). No fiber major
   bridges this without moving the whole repo to React 19, which is out of
   scope here. Plain three.js never touches react-reconciler, so it's
   unaffected — same trick as OrbitCanvas.
   ============================================================ */

const JADE = 0x117e73;
const JADE_DEEP = 0x0a3d38;

type Getter = () => number;

type Part = {
  mesh: THREE.Mesh;
  start: THREE.Vector3;
  startRot: THREE.Euler;
  delay: number;
};

function buildSparkTexture(): THREE.Texture {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "rgba(234,244,241,1)");
  grad.addColorStop(1, "rgba(17,126,115,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function ForgeCanvas({
  getP,
  active,
  onContextLost,
}: {
  getP: Getter;
  active: boolean;
  onContextLost: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost, false);

    // ── lights ──
    scene.add(new THREE.AmbientLight(0xeaf4f1, 0.45));
    const keyLight = new THREE.PointLight(JADE, 22, 0);
    keyLight.position.set(3, 3, 4);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(JADE_DEEP, 8, 0);
    fillLight.position.set(-3, -2, -2);
    scene.add(fillLight);

    // ── the core ──
    const coreMat = new THREE.MeshStandardMaterial({
      color: JADE_DEEP,
      emissive: JADE,
      emissiveIntensity: 1,
      roughness: 0.28,
      metalness: 0.35,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), coreMat);
    scene.add(core);

    // ── raw parts — scattered halo that flies in and gets absorbed ──
    const PART_COUNT = 20;
    const partGeoms = [
      new THREE.TorusGeometry(0.32, 0.12, 8, 16),
      new THREE.CylinderGeometry(0.14, 0.14, 0.7, 10),
      new THREE.BoxGeometry(0.36, 0.36, 0.36),
    ];
    const partMat = new THREE.MeshStandardMaterial({
      color: C.card,
      emissive: JADE,
      emissiveIntensity: 0.35,
      roughness: 0.5,
      metalness: 0.15,
    });
    const parts: Part[] = [];
    for (let i = 0; i < PART_COUNT; i++) {
      const geom = partGeoms[i % 3];
      const mesh = new THREE.Mesh(geom, partMat);
      const radius = 5.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const start = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
      mesh.position.copy(start);
      const startRot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );
      mesh.rotation.copy(startRot);
      scene.add(mesh);
      parts.push({ mesh, start, startRot, delay: (i / PART_COUNT) * 0.55 });
    }

    // ── the proof — the finished machine, multiplied ──
    const GRID_MAX = 48;
    const gridGeom = new THREE.IcosahedronGeometry(1, 0);
    const gridMat = new THREE.MeshStandardMaterial({
      color: JADE_DEEP,
      emissive: JADE,
      emissiveIntensity: 1.1,
      roughness: 0.3,
      metalness: 0.3,
    });
    const grid = new THREE.InstancedMesh(gridGeom, gridMat, GRID_MAX);
    scene.add(grid);
    const gridPositions: THREE.Vector3[] = [];
    {
      const cols = 8;
      const spacing = 1.15;
      for (let i = 0; i < GRID_MAX; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        gridPositions.push(
          new THREE.Vector3(
            (col - (cols - 1) / 2) * spacing,
            (row - 2.5) * spacing,
            -2.2,
          ),
        );
      }
    }
    const dummy = new THREE.Object3D();

    // ── sparks — ambient rising particles, well under the 2k budget ──
    const SPARK_COUNT = 140;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i++) {
      const r = Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sparkPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sparkPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sparkPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    sparkGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(sparkPositions, 3),
    );
    const sparkTexture = buildSparkTexture();
    const sparkMat = new THREE.PointsMaterial({
      size: 0.09,
      map: sparkTexture,
      color: JADE,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.Points(sparkGeom, sparkMat);
    scene.add(sparks);

    // ── resize ──
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── animation loop ──
    let raf = 0;
    const clockStart = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!activeRef.current) return;

      const t = (performance.now() - clockStart) / 1000;
      const p = getP();
      const buildLocal = bandLocal(p, HERO_END, BUILD_END);
      const proofLocal = bandLocal(p, BUILD_END, 1);

      // camera rig — dolly out through Proof, gentle idle drift always
      camera.position.set(
        Math.sin(t * 0.08) * 0.35,
        Math.cos(t * 0.07) * 0.2 + lerp(0, 0.6, proofLocal),
        lerp(6.4, 13.5, proofLocal),
      );
      camera.lookAt(0, 0, 0);

      // core — during Proof, slide it toward the right edge so it never
      // sits directly behind the stat numbers (same jade hue as the core
      // material — dead-center overlap made "9" unreadable in review).
      core.rotation.y = t * 0.22;
      core.rotation.x = Math.sin(t * 0.15) * 0.12;
      const bob = Math.sin(t * 0.6) * 0.12;
      core.position.y = bob - proofLocal * 0.3;
      core.position.x = lerp(0, 3.4, proofLocal);
      core.scale.setScalar(lerp(1, 0.72, proofLocal));
      coreMat.emissiveIntensity =
        lerp(0.9, 2.2, buildLocal) * (1 - proofLocal * 0.15);

      // parts — fly in from the halo and get absorbed into the core
      const window_ = 0.45;
      for (const part of parts) {
        const local = bandLocal(
          buildLocal,
          part.delay,
          Math.min(1, part.delay + window_),
        );
        part.mesh.position.lerpVectors(
          part.start,
          new THREE.Vector3(0, 0, 0),
          local,
        );
        part.mesh.rotation.set(
          part.startRot.x + t * (1 - local) * 0.6,
          part.startRot.y,
          part.startRot.z,
        );
        const absorb = bandLocal(local, 0.82, 1);
        const s = local > 0 ? lerp(1, 0, absorb) : 0;
        part.mesh.scale.setScalar(s);
        part.mesh.visible = local > 0.001 && absorb < 1;
      }

      // machine grid — multiply into a body of work
      const visibleCount = Math.floor(lerp(0, GRID_MAX, proofLocal));
      for (let i = 0; i < GRID_MAX; i++) {
        const on = i < visibleCount;
        dummy.position.copy(gridPositions[i]);
        dummy.scale.setScalar(on ? 0.42 : 0);
        dummy.rotation.set(0, i * 0.35, 0);
        dummy.updateMatrix();
        grid.setMatrixAt(i, dummy.matrix);
      }
      grid.instanceMatrix.needsUpdate = true;

      sparks.rotation.y = t * 0.015;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      sparkTexture.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
      gridGeom.dispose();
      gridMat.dispose();
      partGeoms.forEach((g) => g.dispose());
      partMat.dispose();
      core.geometry.dispose();
      coreMat.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    />
  );
}
