/* ============================================================
   /v/347 — shader sources. Plain three.js ShaderMaterial strings
   only (no chunks that vary across three versions besides the
   trivial ones used here). Everything is driven by ONE uniform,
   uProgress (0..1, the scroll-scrubbed night), written once per
   frame from the host component — zero per-instance JS work.
   ============================================================ */

/* ---------- SKY: fullscreen gradient quad ---------- */
export const skyVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

export const skyFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uProgress;

  vec3 stop(int i) {
    // 5 keyframed zenith colors, 03:47 -> 06:58
    if (i == 0) return vec3(0.020, 0.031, 0.063); // night
    if (i == 1) return vec3(0.043, 0.043, 0.114); // indigo
    if (i == 2) return vec3(0.086, 0.121, 0.204); // blue hour
    if (i == 3) return vec3(0.475, 0.353, 0.290); // gold
    return vec3(0.86, 0.80, 0.72); // morning
  }
  vec3 horizonStop(int i) {
    if (i == 0) return vec3(0.031, 0.043, 0.078);
    if (i == 1) return vec3(0.086, 0.078, 0.165);
    if (i == 2) return vec3(0.243, 0.220, 0.290);
    if (i == 3) return vec3(0.914, 0.588, 0.325);
    return vec3(0.98, 0.90, 0.78);
  }

  vec3 rampColor(float t, bool horizon) {
    float scaled = clamp(t, 0.0, 1.0) * 4.0;
    float seg = floor(scaled);
    float f = smoothstep(0.0, 1.0, fract(scaled));
    int i0 = int(seg);
    int i1 = int(min(seg + 1.0, 4.0));
    vec3 a = horizon ? horizonStop(i0) : stop(i0);
    vec3 b = horizon ? horizonStop(i1) : stop(i1);
    return mix(a, b, f);
  }

  void main() {
    vec3 zenith = rampColor(uProgress, false);
    vec3 horizon = rampColor(uProgress, true);
    float h = clamp(vUv.y, 0.0, 1.0);
    vec3 col = mix(horizon, zenith, pow(h, 0.65));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ---------- CITY: instanced window-lit buildings ---------- */
export const cityVertex = /* glsl */ `
  precision highp float;
  attribute float aDistrict;
  attribute float aLitAt;
  attribute float aSeed;
  attribute float aFloorSpread;
  varying vec2 vUv;
  varying float vNormalY;
  varying float vDistrict;
  varying float vLitAt;
  varying float vSeed;
  varying float vFloorSpread;
  varying float vFogDepth;

  void main() {
    vUv = uv;
    vNormalY = abs(normal.y);
    vDistrict = aDistrict;
    vLitAt = aLitAt;
    vSeed = aSeed;
    vFloorSpread = aFloorSpread;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    vFogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const cityFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying float vNormalY;
  varying float vDistrict;
  varying float vLitAt;
  varying float vSeed;
  varying float vFloorSpread;
  varying float vFogDepth;

  uniform float uProgress;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uWindowColor;
  uniform vec3 uBuildingColor;
  uniform vec3 uRoofColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec3 base = mix(uBuildingColor, uRoofColor, step(0.5, vNormalY));

    // window grid — 4 cols x 7 rows per face, roof face excluded. Each
    // cell is inset (a dark mullion margin around it) so lit cells read
    // as individual window panes, never a single flood-filled face.
    vec2 grid = vec2(4.0, 7.0);
    vec2 scaledUv = vUv * grid;
    vec2 cell = floor(scaledUv);
    vec2 cellUv = fract(scaledUv);
    float cellId = cell.x + cell.y * grid.x;
    float jitter = hash(cell + vSeed);

    float paneX = smoothstep(0.0, 0.16, cellUv.x) * (1.0 - smoothstep(0.84, 1.0, cellUv.x));
    float paneY = smoothstep(0.0, 0.16, cellUv.y) * (1.0 - smoothstep(0.84, 1.0, cellUv.y));
    float paneMask = paneX * paneY;

    float litAt;
    if (vDistrict >= 2.5 && vDistrict < 3.5) {
      // insurance inbox tower — floors light bottom -> top in a tight
      // window, then hold steady ("settles calm")
      litAt = vLitAt + (1.0 - vUv.y) * vFloorSpread + jitter * 0.006;
    } else {
      litAt = vLitAt + jitter * 0.05;
    }

    float ignite = smoothstep(litAt, litAt + 0.01, uProgress);
    float dayWash = smoothstep(0.78, 1.0, uProgress);
    float isWindow = step(0.5, vNormalY) < 0.5 ? 1.0 : 0.0;
    float lit = ignite * (1.0 - dayWash) * isWindow * paneMask;

    // unlit panes still read as faintly glazed glass (barely-there),
    // separate from the fully dark mullion gaps around them
    vec3 unlitPane = base + vec3(0.03, 0.032, 0.045) * paneMask * isWindow;
    vec3 color = mix(unlitPane, base + uWindowColor, lit);

    float fogFactor = clamp((vFogDepth - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    color = mix(color, uFogColor, fogFactor);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ---------- GROUND: flat dark plane, tracks sky horizon ---------- */
export const groundVertex = /* glsl */ `
  varying float vFogDepth;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vFogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
export const groundFragment = /* glsl */ `
  precision highp float;
  varying float vFogDepth;
  uniform vec3 uColor;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  void main() {
    float fogFactor = clamp((vFogDepth - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    vec3 color = mix(uColor, uFogColor, fogFactor);
    gl_FragColor = vec4(color, 1.0);
  }
`;
