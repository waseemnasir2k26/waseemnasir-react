"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { C } from "./tokens";
import { buildCameraCurves, damp3 } from "./CameraPath";
import {
  makeMaterials,
  buildBuildings,
  buildBridgeCore,
  buildBridgeUnderlay,
  buildWindowFlicker,
  buildGroundGrid,
  type SceneObject,
} from "./SceneObjects";
import { NAMED_NODES, NAMED_NODE_INDEX } from "./graph";
import { SERVICES, WORK, STACK, LANE_HONESTY_CHIP, LEAK_CHIP } from "./tokens";

/* ============================================================
   SIGNALGRID CANVAS — plain three.js, mounted imperatively (no
   r3f — forbidden in this repo, see components/
   skyline/SkylineCanvas.tsx). Fixed, full-viewport, behind the
   real HTML content. Native scroll drives the camera + uProgress
   every rAF tick; nothing here triggers a React re-render.

   Adds three things skyline's canvas doesn't need:
   - uFocusBuilding isolation, driven by rAF-throttled raycast
     hover (desktop, fine-pointer only — this component only ever
     mounts when the page's eligibility gate already passed) AND
     by keyboard focus on the HTML tower list (setFocus() ref API).
   - A tooltip DOM node updated via direct style.transform writes
     (no React re-render per pointermove).
   - An FPS governor: <48fps/2s -> drop window flicker + uDensity
     0.5; <30fps sustained 3s -> dispose + flip to static. One-way
     ratchet, never re-upgrades mid-session.
   ============================================================ */

const SECTION_FOR_BUILDING: Record<string, string> = {};
STACK.forEach((s) => (SECTION_FOR_BUILDING[s.id] = "grid"));
SERVICES.forEach((s) => (SECTION_FOR_BUILDING[s.id] = "flybys"));
WORK.forEach((w) => (SECTION_FOR_BUILDING[w.id] = "works"));
SECTION_FOR_BUILDING["uplink"] = "uplink";
SECTION_FOR_BUILDING["the-leak"] = "uplink";

const BUILDING_LABEL: Record<string, string> = {};
STACK.forEach((s) => (BUILDING_LABEL[s.id] = `${s.label} — ${s.sub}`));
SERVICES.forEach((s) => (BUILDING_LABEL[s.id] = `${s.label} — ${s.kicker}`));
WORK.forEach((w) => (BUILDING_LABEL[w.id] = w.client));
BUILDING_LABEL["uplink"] = "Uplink — every lane bends here";
BUILDING_LABEL["the-leak"] = LEAK_CHIP;

export type SignalGridCanvasHandle = {
  setFocus: (id: string | null) => void;
};

const SignalGridCanvas = forwardRef<
  SignalGridCanvasHandle,
  {
    progress: MotionValue<number>;
    onContextLost: () => void;
  }
>(function SignalGridCanvas({ progress, onContextLost }, ref) {
  const mountRef = useRef<HTMLDivElement>(null);
  const keyboardFocusRef = useRef<string | null>(null);
  const setFocusFn = useRef<(id: string | null) => void>(() => {});

  useImperativeHandle(ref, () => ({
    setFocus: (id) => setFocusFn.current(id),
  }));

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
    // Fog dissolves the grid into near-black (not paper) — SIGNALGRID's
    // horizon reads as signal density fading out, not a lit skyline.
    scene.fog = new THREE.Fog(C.skyDark, 18, 40);

    const camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / window.innerHeight,
      0.1,
      55,
    );

    const mats = makeMaterials();
    const objects: SceneObject[] = [
      buildGroundGrid(mats),
      buildBuildings(mats),
      buildBridgeUnderlay(mats),
      buildBridgeCore(mats),
      buildWindowFlicker(mats),
    ];
    objects.forEach((o) => scene.add(o.group));
    const flickerGroup = objects[4].group;

    const { posCurve, lookCurve } = buildCameraCurves();
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();
    const currentLook = new THREE.Vector3();
    let initialised = false;

    /* ---- hover / focus / tooltip ---- */
    const boxes: { id: string; box: THREE.Box3 }[] = NAMED_NODES.map((n) => ({
      id: n.id,
      box: new THREE.Box3(
        new THREE.Vector3(n.x - n.w / 2 - 0.25, -0.2, n.z - n.d / 2 - 0.25),
        new THREE.Vector3(
          n.x + n.w / 2 + 0.25,
          n.h + 0.4,
          n.z + n.d / 2 + 0.25,
        ),
      ),
    }));
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2(-2, -2);
    let pointerHoverId: string | null = null;
    let activeId: string | null = null;
    let currentFocus = -1;

    const tooltip = document.createElement("div");
    tooltip.setAttribute("aria-hidden", "true");
    Object.assign(tooltip.style, {
      position: "absolute",
      left: "0",
      top: "0",
      transform: "translate(-9999px,-9999px)",
      background: "rgba(3,17,15,0.82)",
      border: `1px solid ${C.hairline}`,
      borderRadius: "10px",
      padding: "6px 10px",
      fontFamily: "var(--font-mono, monospace)",
      fontSize: "11px",
      letterSpacing: "0.02em",
      color: C.ink,
      pointerEvents: "none",
      whiteSpace: "nowrap",
      backdropFilter: "blur(8px)",
      zIndex: "5",
      transition: "opacity .15s ease",
      opacity: "0",
    } as CSSStyleDeclaration);
    mount.appendChild(tooltip);

    const projected = new THREE.Vector3();
    function updateTooltip() {
      if (!activeId) {
        tooltip.style.opacity = "0";
        return;
      }
      const node = boxes.find((b) => b.id === activeId);
      if (!node) return;
      const c = node.box.getCenter(new THREE.Vector3());
      c.y = node.box.max.y;
      projected.copy(c).project(camera);
      const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-projected.y * 0.5 + 0.5) * window.innerHeight - 14;
      tooltip.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      tooltip.textContent = BUILDING_LABEL[activeId] ?? activeId;
      tooltip.style.opacity = projected.z < 1 ? "1" : "0";
    }

    function onPointerMove(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    function onPointerLeave() {
      pointerNDC.set(-2, -2);
    }
    function onClick() {
      if (!activeId) return;
      const sectionId = SECTION_FOR_BUILDING[activeId];
      const el = sectionId ? document.getElementById(sectionId) : null;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("click", onClick);

    setFocusFn.current = (id) => {
      keyboardFocusRef.current = id;
    };

    /* ---- FPS governor — rolling window, one-way ratchet ---- */
    let frameCount = 0;
    let windowStart = performance.now();
    let flickerDropped = false;
    let densityHalved = false;
    let sustainedBadStart = 0;
    let disposed = false;

    let raf = 0;
    let last = performance.now();
    let elapsedAccum = 0;
    let hidden = document.hidden;

    const onVisibility = () => {
      hidden = document.hidden;
      if (!hidden) last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (hidden) return; // clock frozen — no uTime advance, no render

      elapsedAccum += dt;
      frameCount++;
      const windowElapsed = now - windowStart;
      if (windowElapsed >= 2000) {
        const fps = (frameCount * 1000) / windowElapsed;
        frameCount = 0;
        windowStart = now;
        if (fps < 48 && !flickerDropped) {
          flickerDropped = true;
          scene.remove(flickerGroup);
          mats.uniforms.uDensity.value = 0.5;
          densityHalved = true;
        }
        if (fps < 30) {
          if (!sustainedBadStart) sustainedBadStart = now;
          if (now - sustainedBadStart > 3000) {
            disposed = true;
            onContextLost();
            return;
          }
        } else {
          sustainedBadStart = 0;
        }
      }
      void densityHalved;

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

      // hover raycast — rAF-throttled by construction (once per tick)
      if (pointerNDC.x > -1.5) {
        raycaster.setFromCamera(pointerNDC, camera);
        let nearest: { id: string; dist: number } | null = null;
        const hitPoint = new THREE.Vector3();
        boxes.forEach((b) => {
          const hit = raycaster.ray.intersectBox(b.box, hitPoint);
          if (hit) {
            const dist = camera.position.distanceTo(hit);
            if (!nearest || dist < nearest.dist) nearest = { id: b.id, dist };
          }
        });
        pointerHoverId = nearest ? (nearest as { id: string }).id : null;
      } else {
        pointerHoverId = null;
      }
      activeId = pointerHoverId ?? keyboardFocusRef.current;

      const focusIdx = activeId ? (NAMED_NODE_INDEX[activeId] ?? -1) : -1;
      currentFocus +=
        (focusIdx - currentFocus) * Math.min(1, dt * (1000 / 240));
      mats.uniforms.uFocusBuilding.value =
        Math.abs(currentFocus - focusIdx) < 0.05 ? focusIdx : currentFocus;

      mats.uniforms.uTime.value = elapsedAccum;
      mats.uniforms.uProgress.value = p;

      updateTooltip();
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
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvasEl.removeEventListener("webglcontextlost", onContextLost);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerleave", onPointerLeave);
      canvasEl.removeEventListener("click", onClick);
      objects.forEach((o) => {
        o.dispose();
        scene.remove(o.group);
      });
      Object.values(mats).forEach((m) => {
        if (m && typeof (m as THREE.Material).dispose === "function") {
          (m as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (tooltip.parentElement) tooltip.parentElement.removeChild(tooltip);
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
});

export default SignalGridCanvas;
export { LANE_HONESTY_CHIP };
