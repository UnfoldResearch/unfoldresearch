import { kindStyles } from "./kind-styles";
import type { ArtifactKind } from "./simulation";
import { SPOKE_LENGTH } from "./simulation";

interface ArtifactSpokeProps {
  kind: ArtifactKind;
  /** The hub: the claim or hypothesis this artifact supports. */
  x: number;
  y: number;
  angle: number;
  /** 0–1: how far the spoke has grown out. */
  shown: number;
}

const tip = ({ x, y, angle }: ArtifactSpokeProps, length: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: x + length * Math.cos(rad), y: y + length * Math.sin(rad) };
};

/** The line from a hub out to a supporting artifact; drawn under the hub. */
export function SpokeLine(props: ArtifactSpokeProps) {
  if (props.shown === 0) return null;
  const end = tip(props, SPOKE_LENGTH * props.shown);
  return (
    <line
      x1={props.x}
      y1={props.y}
      x2={end.x}
      y2={end.y}
      opacity={props.shown}
      className="stroke-border-strong"
      strokeWidth="1"
    />
  );
}

/** A small, faded supporting artifact, named on the side away from its hub. */
export function ArtifactNode(props: ArtifactSpokeProps) {
  if (props.shown === 0) return null;
  const style = kindStyles[props.kind];
  const { x, y } = tip(props, SPOKE_LENGTH);
  const label = labelPlacement(props.angle, x, y);
  return (
    <g opacity={0.8 * props.shown}>
      <circle
        cx={x}
        cy={y}
        r={5.5 * props.shown}
        className={style.shape}
        strokeWidth="1.25"
      />
      <text
        x={label.x}
        y={label.y}
        textAnchor={label.anchor}
        fontSize="8.5"
        className={`font-medium ${style.text}`}
      >
        {style.label}
      </text>
    </g>
  );
}

/**
 * Puts the caption past the artifact, continuing the spoke's direction:
 * beside it for sideways and diagonal spokes, above or below for vertical ones.
 */
function labelPlacement(angle: number, x: number, y: number) {
  const dx = Math.cos((angle * Math.PI) / 180);
  if (dx > 0.4) return { x: x + 9, y: y + 3, anchor: "start" as const };
  if (dx < -0.4) return { x: x - 9, y: y + 3, anchor: "end" as const };
  const below = Math.sin((angle * Math.PI) / 180) >= 0;
  return { x, y: below ? y + 17 : y - 10, anchor: "middle" as const };
}
