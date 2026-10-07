import { CheckMark } from "../glyphs";
import { ArtifactNode, SpokeLine } from "./artifact-spoke";
import { kindStyles } from "./kind-styles";
import type { NodeState } from "./simulation";
import { ease } from "./simulation";

/**
 * A statement in the graph: an open question that becomes a hypothesis while
 * a team works on it, then a verified claim. Stages cross-fade.
 */
export function StatementNode({ state }: { state: NodeState }) {
  const { x, y, visible, hypothesis, claim, pulse, spokes } = state;
  if (visible === 0) return null;
  const testing = hypothesis * (1 - claim);

  return (
    <g opacity={visible}>
      {spokes.map((spoke) => (
        <SpokeLine key={`line-${spoke.angle}`} x={x} y={y} {...spoke} />
      ))}

      <g opacity={1 - hypothesis}>
        <circle
          cx={x}
          cy={y}
          r="14"
          className="fill-canvas stroke-border-strong"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <text
          x={x}
          y={y + 4.5}
          textAnchor="middle"
          fontSize="13"
          className="fill-fg-subtle font-semibold"
        >
          ?
        </text>
      </g>

      <g opacity={testing}>
        <circle
          cx={x}
          cy={y}
          r="19"
          className="fill-none stroke-accent"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle
          cx={x}
          cy={y}
          r="14"
          className="fill-accent-subtle stroke-accent"
          strokeWidth="1.5"
        />
        <circle cx={x} cy={y} r="4" className="fill-accent" />
      </g>

      <g opacity={claim}>
        <circle
          cx={x}
          cy={y}
          r="14"
          className="fill-success-subtle stroke-success"
          strokeWidth="1.5"
        />
        <g className="stroke-success">
          <CheckMark x={x} y={y} scale={0.6 + 0.4 * ease(claim)} />
        </g>
      </g>

      {pulse > 0 && pulse < 1 && (
        <circle
          cx={x}
          cy={y}
          r={14 + 16 * pulse}
          className="fill-none stroke-success"
          strokeWidth="1.5"
          opacity={0.6 * (1 - pulse)}
        />
      )}

      {spokes.map((spoke) => (
        <ArtifactNode key={`node-${spoke.angle}`} x={x} y={y} {...spoke} />
      ))}

      {testing > 0 && <Tag kind="hypothesis" x={x} y={y} opacity={testing} />}
      {claim > 0 && <Tag kind="claim" x={x} y={y} opacity={claim} />}
    </g>
  );
}

/** A small type tag tucked against the node's lower right. */
function Tag({
  kind,
  x,
  y,
  opacity,
}: {
  kind: "claim" | "hypothesis";
  x: number;
  y: number;
  opacity: number;
}) {
  const style = kindStyles[kind];
  const width = 8 + style.label.length * 4.8;
  return (
    <g opacity={opacity}>
      <rect
        x={x + 8}
        y={y + 6}
        width={width}
        height="12"
        rx="6"
        className={style.shape}
      />
      <text
        x={x + 8 + width / 2}
        y={y + 14.75}
        textAnchor="middle"
        fontSize="8"
        className={`font-semibold ${style.text}`}
      >
        {style.label}
      </text>
    </g>
  );
}
