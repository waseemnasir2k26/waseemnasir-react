import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

/* ============================================================
   REALISM — shared photographic layer for the AI City variants.

   Everything here is plain imperative three.js pulled from
   `three/examples/jsm/*`. NOTHING in this file may reach for
   @react-three/fiber, drei, or @react-three/postprocessing:
   react-reconciler@0.27 (the only line compatible with this
   repo's React 18.3.1) cannot read the secret-internals shape
   this Next build exposes — verified broken under BOTH Turbopack
   and webpack. See components/orbit/OrbitCanvas.tsx:17-24.

   Second hard rule this file exists to honour: NO EXTERNAL ASSET
   FETCHES. drei's <Environment preset> and every RGBELoader HDR
   workflow pull a .hdr off a CDN at runtime. The image-based
   lighting below is generated procedurally on the GPU at mount
   and never touches the network.

   Three pieces, each independently adoptable:
     1. applyFilmicRenderer  — tone mapping + colour management
     2. createSkyEnvironment — procedural IBL, PMREM-prefiltered
     3. createPostChain      — composer, bloom, grain/vignette
   ============================================================ */

/* ------------------------------------------------------------
   1. FILMIC RENDERER

   The single highest realism-per-line change available to these
   scenes. Without tone mapping three clips every value above 1.0
   flat to white, which is exactly why Altitude's bridge beam
   (emissiveIntensity 1.6) reads as a blown-out sticker rather
   than a bright light. ACES gives a filmic shoulder instead:
   highlights roll off, saturated dusk colour survives.

   NOTE FOR THE CALLER: enabling this re-keys every colour in
   tokens.ts at once. Emissive intensities that were tuned against
   a clipping pipeline will read dimmer and need a pass by eye.
   ------------------------------------------------------------ */
export function applyFilmicRenderer(
  renderer: THREE.WebGLRenderer,
  exposure = 1.0,
) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
}

/* ------------------------------------------------------------
   2. PROCEDURAL SKY ENVIRONMENT (image-based lighting)

   The buildings are MeshStandardMaterial with metalness 0.25 and
   no envMap, which means that metalness currently does nothing
   but darken them — metal with nothing to reflect is just a dull
   surface. This builds a tiny throwaway scene (sky dome + ground
   disc + a warm sun panel), renders it through PMREMGenerator to
   get a correctly prefiltered mip chain, and hands back a cube
   texture usable as scene.environment.

   Baked ONCE PER STOP, not per frame — PMREM is a real GPU cost
   and this is a checkpoint operation. Three stops across the
   day/night cycle, cross-faded by picking the nearest; the scene
   background and fog already lerp continuously, so the IBL
   stepping underneath is not perceptible in motion.
   ------------------------------------------------------------ */
export type SkyEnvironment = {
  /** Nearest baked environment for a 0..1 dayness scalar. */
  get(dayness: number): THREE.Texture;
  dispose(): void;
};

type SkyStop = {
  at: number;
  sky: THREE.ColorRepresentation;
  ground: THREE.ColorRepresentation;
  sun: THREE.ColorRepresentation;
  sunIntensity: number;
};

export function createSkyEnvironment(
  renderer: THREE.WebGLRenderer,
  stops: SkyStop[],
): SkyEnvironment {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const baked = stops.map((stop) => {
    // A disposable scene standing in for an HDR probe. Emissive
    // basic materials only — this scene is never lit, it IS the
    // light, so its colours go straight into the convolution.
    const probe = new THREE.Scene();

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(10, 16, 12),
      new THREE.MeshBasicMaterial({
        color: stop.sky,
        side: THREE.BackSide,
        fog: false,
      }),
    );
    probe.add(dome);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(10, 24),
      new THREE.MeshBasicMaterial({ color: stop.ground, fog: false }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.6;
    probe.add(ground);

    // The key light. Kept low on the horizon so facades catch a
    // rim rather than a top-down wash — this is what sells "late
    // afternoon" over "showroom".
    const sun = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({
        color: stop.sun,
        fog: false,
        transparent: true,
        opacity: stop.sunIntensity,
      }),
    );
    sun.position.set(-6, 1.6, 5);
    sun.lookAt(0, 0, 0);
    probe.add(sun);

    const target = pmrem.fromScene(probe, 0.04);

    dome.geometry.dispose();
    (dome.material as THREE.Material).dispose();
    ground.geometry.dispose();
    (ground.material as THREE.Material).dispose();
    sun.geometry.dispose();
    (sun.material as THREE.Material).dispose();

    return { at: stop.at, texture: target.texture, target };
  });

  pmrem.dispose();

  return {
    get(dayness: number) {
      let best = baked[0];
      let bestGap = Math.abs(dayness - baked[0].at);
      for (let i = 1; i < baked.length; i++) {
        const gap = Math.abs(dayness - baked[i].at);
        if (gap < bestGap) {
          best = baked[i];
          bestGap = gap;
        }
      }
      return best.texture;
    },
    dispose() {
      baked.forEach((b) => b.target.dispose());
    },
  };
}

/* ------------------------------------------------------------
   GRAIN + VIGNETTE

   Runs AFTER OutputPass, i.e. in display space, because film
   grain applied in linear space reads as coloured noise rather
   than emulsion. Amplitude is deliberately tiny — the point is
   to break the mathematical cleanliness that makes web 3D look
   computed, not to be visible as an effect.

   The noise is time-seeded but spatially hashed, so it does not
   crawl coherently and does not need frame accumulation (which
   would smear under fast scroll scrubbing).
   ------------------------------------------------------------ */
const GrainVignetteShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uGrain: { value: 0.035 },
    uVignette: { value: 0.86 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);

      // Vignette: normalised corner distance (0 at centre, 1 at the
      // corners), then a soft falloff that only bites in the outer
      // third. uVignette is the amount of light retained at the very
      // corner, so 1.0 = no vignette at all.
      vec2 d = vUv - 0.5;
      float r = length(d) * 1.41421356;
      float falloff = smoothstep(0.62, 1.0, r);
      col.rgb *= mix(1.0, uVignette, falloff);

      // Grain, scaled by luminance so shadows stay grainy and
      // highlights stay clean — the way real film behaves.
      float n = hash(vUv * 1024.0 + fract(uTime) * 91.7) - 0.5;
      float luma = dot(col.rgb, vec3(0.299, 0.587, 0.114));
      col.rgb += n * uGrain * (1.0 - luma * 0.7);

      gl_FragColor = col;
    }
  `,
};

/* ------------------------------------------------------------
   3. POST CHAIN

   Order matters and is not negotiable:
     RenderPass -> UnrealBloomPass -> OutputPass -> Grain

   OutputPass is what re-applies tone mapping and the output
   colour space at the end of the chain. Tone mapping is only
   applied on the canvas draw buffer, NOT when rendering into an
   offscreen target, so a composer without OutputPass silently
   throws away everything applyFilmicRenderer set up.

   MSAA TRAP: renderer `antialias: true` is bypassed the moment
   rendering goes through a composer's own render target. Rather
   than bolt an SMAA pass on the end, the composer is handed an
   explicitly multisampled target — same result, one less
   full-screen pass, and edges stay as clean as they are today.
   ------------------------------------------------------------ */
export type PostChain = {
  render(dt: number): void;
  setSize(w: number, h: number): void;
  /** Governor hook: shed the expensive passes before content. */
  setQuality(level: "full" | "reduced" | "off"): void;
  dispose(): void;
};

export function createPostChain(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  opts: {
    bloomStrength?: number;
    bloomRadius?: number;
    bloomThreshold?: number;
    grain?: number;
    /** Light retained at the frame corner. 1.0 disables the vignette. */
    vignette?: number;
    samples?: number;
  } = {},
): PostChain {
  const {
    bloomStrength = 0.32,
    bloomRadius = 0.5,
    bloomThreshold = 0.86,
    grain = 0.028,
    vignette = 0.86,
    samples = 4,
  } = opts;

  const size = new THREE.Vector2();
  renderer.getSize(size);

  const target = new THREE.WebGLRenderTarget(size.x, size.y, {
    type: THREE.HalfFloatType,
    samples,
  });

  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(size.x, size.y);

  const renderPass = new RenderPass(scene, camera);
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(size.x, size.y),
    bloomStrength,
    bloomRadius,
    bloomThreshold,
  );
  const output = new OutputPass();
  const grainPass = new ShaderPass(GrainVignetteShader);
  grainPass.uniforms.uGrain.value = grain;
  grainPass.uniforms.uVignette.value = vignette;

  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(output);
  composer.addPass(grainPass);

  let elapsed = 0;
  let quality: "full" | "reduced" | "off" = "full";

  return {
    render(dt: number) {
      if (quality === "off") {
        renderer.render(scene, camera);
        return;
      }
      elapsed += dt;
      grainPass.uniforms.uTime.value = elapsed;
      composer.render(dt);
    },
    setSize(w: number, h: number) {
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(w, h);
      bloom.setSize(w, h);
    },
    setQuality(level) {
      quality = level;
      // Bloom is the expensive pass (a blur pyramid over several
      // render targets); grain is a single cheap full-screen read,
      // so it survives one tier longer.
      bloom.enabled = level === "full";
      grainPass.enabled = level !== "off";
    },
    dispose() {
      // The composer owns intermediate targets the scene teardown
      // knows nothing about — leaking these is invisible until a
      // few route navigations in, then the tab falls over.
      bloom.dispose();
      grainPass.dispose?.();
      output.dispose?.();
      composer.dispose();
      target.dispose();
    },
  };
}

/* ------------------------------------------------------------
   MATERIAL UPGRADE

   Applies image-based lighting response to every standard
   material in a variant's material bag. Called once after
   makeMaterials(); the envMap itself is assigned via
   scene.environment so individual materials only need their
   intensity set.
   ------------------------------------------------------------ */
export function applyEnvResponse(
  mats: Record<string, THREE.Material>,
  intensity = 0.55,
) {
  Object.values(mats).forEach((m) => {
    if (
      m instanceof THREE.MeshStandardMaterial ||
      m instanceof THREE.MeshPhysicalMaterial
    ) {
      m.envMapIntensity = intensity;
      m.needsUpdate = true;
    }
  });
}
