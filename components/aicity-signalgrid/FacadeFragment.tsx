/* ============================================================
   FACADE FRAGMENT — twin-source silhouette. The exact same graph
   node data that drives the 3D wireframe (SceneObjects.ts) is
   projected here into a 220x280 inline SVG elevation, generated
   at module/render level (no build script — the JSON graph is
   the single source, both consumers just read it). 2D and 3D can
   never drift because there is only one place the shape lives:
   the node's `shape`, `w`, `h`, `dashed` fields in graph.ts.
   ============================================================ */
import { nodeById, type GraphNode } from "./graph";
import { C } from "./tokens";

const W = 220;
const H = 280;
const BASE_Y = 250;

function scaled(node: GraphNode) {
  const maxH = 6.5;
  const maxW = 2.8;
  const h = Math.min(200, (node.h / maxH) * 200);
  const w = Math.min(140, (node.w / maxW) * 140);
  return { w, h };
}

function laneProps(dashed?: boolean) {
  return dashed
    ? { strokeDasharray: "4 5" }
    : { strokeDasharray: "3 9", className: "sg-lane" };
}

export default function FacadeFragment({ id }: { id: string }) {
  const node = nodeById(id);
  if (!node) return null;
  const { w, h } = scaled(node);
  const cx = W / 2;
  const top = BASE_Y - h;
  const stroke = C.gridHair;
  const lane = laneProps(node.dashed);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label={`${node.id} building silhouette`}
      style={{ display: "block" }}
    >
      <line
        x1={0}
        y1={BASE_Y}
        x2={W}
        y2={BASE_Y}
        stroke={stroke}
        strokeWidth={1}
      />

      {node.shape === "twin" ? (
        <>
          <rect
            x={cx - w / 2 - 14}
            y={top}
            width={w * 0.42}
            height={h}
            fill="none"
            stroke={stroke}
            strokeWidth={1.4}
          />
          <rect
            x={cx + w / 2 - w * 0.42 + 14}
            y={top}
            width={w * 0.42}
            height={h}
            fill="none"
            stroke={stroke}
            strokeWidth={1.4}
          />
          <line
            x1={cx - 14}
            y1={top + h * 0.28}
            x2={cx + 14}
            y2={top + h * 0.28}
            stroke={C.jadeBright}
            strokeWidth={2}
            {...lane}
          />
        </>
      ) : node.shape === "ziggurat" ? (
        <>
          {[0, 1, 2].map((step) => {
            const stepH = h / 3;
            const stepW = w * (1 - step * 0.22);
            const y = top + step * stepH;
            return (
              <rect
                key={step}
                x={cx - stepW / 2}
                y={y}
                width={stepW}
                height={stepH}
                fill="none"
                stroke={stroke}
                strokeWidth={1.2}
              />
            );
          })}
          <line
            x1={cx - w / 2}
            y1={BASE_Y - 6}
            x2={cx + w / 2}
            y2={top + 6}
            stroke={C.jadeBright}
            strokeWidth={1.6}
            {...lane}
          />
        </>
      ) : node.shape === "cylinder" ? (
        <>
          <rect
            x={cx - w / 4}
            y={top}
            width={w / 2}
            height={h}
            fill="none"
            stroke={stroke}
            strokeWidth={1.4}
          />
          <ellipse
            cx={cx}
            cy={top}
            rx={w / 4}
            ry={6}
            fill="none"
            stroke={stroke}
            strokeWidth={1.2}
          />
          {[0.35, 0.6, 0.85].map((f, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={top + h * f}
              rx={w / 4 + 10 + i * 6}
              ry={4}
              fill="none"
              stroke={C.jadeBright}
              strokeWidth={1}
              {...lane}
            />
          ))}
        </>
      ) : node.shape === "slab" ? (
        <>
          <rect
            x={cx - w / 2}
            y={BASE_Y - h * 0.55}
            width={w}
            height={h * 0.55}
            fill="none"
            stroke={stroke}
            strokeWidth={1.4}
          />
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={cx - w / 2 + 8 + i * ((w - 16) / 5)}
              y1={BASE_Y - h * 0.55}
              x2={cx - w / 2 + 8 + i * ((w - 16) / 5)}
              y2={BASE_Y - h * 0.55 - 14}
              stroke={stroke}
              strokeWidth={1}
            />
          ))}
        </>
      ) : (
        <>
          <rect
            x={cx - w / 2}
            y={top}
            width={w}
            height={h}
            fill="none"
            stroke={stroke}
            strokeWidth={1.4}
            {...(node.dashed ? lane : {})}
          />
          {Array.from({ length: Math.max(2, Math.floor(h / 26)) }).map(
            (_, i) => (
              <line
                key={i}
                x1={cx - w / 2}
                y1={top + 24 + i * 26}
                x2={cx + w / 2}
                y2={top + 24 + i * 26}
                stroke={stroke}
                strokeWidth={0.8}
              />
            ),
          )}
        </>
      )}

      {/* lane rule — one live lane entering the facade, matches the
          section-treatment rule (1px jadeBright line plugged into the card) */}
      {node.shape !== "twin" &&
        node.shape !== "ziggurat" &&
        node.shape !== "cylinder" && (
          <line
            x1={0}
            y1={top + 10}
            x2={cx - w / 2}
            y2={top + 10}
            stroke={C.jadeBright}
            strokeWidth={1.5}
            {...lane}
          />
        )}
    </svg>
  );
}
