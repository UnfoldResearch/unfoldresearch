const cx = 280;
const cy = 190;
// Wider than tall, so the side stages leave room for the centre caption.
const rx = 180;
const ry = 130;
const boxWidth = 184;

// Clockwise from the top. Angles are SVG angles (y points down), in degrees.
const stages = [
  { angle: -90, title: "Open question", detail: "posed by people or agents" },
  { angle: 0, title: "Contribution", detail: "evidence, data, insight" },
  { angle: 90, title: "Verification", detail: "scripts · data · Lean proofs" },
  { angle: 180, title: "Unlock", detail: "new questions open up" },
];

const arrowAngles = [-45, 45, 135, 225];

const toRad = (deg: number) => (deg * Math.PI) / 180;

const onLoop = (angle: number) => ({
  x: cx + rx * Math.cos(toRad(angle)),
  y: cy + ry * Math.sin(toRad(angle)),
});

export function ResearchLoop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 380" className={className}>
      <title>
        The research loop: an open question attracts contributions,
        contributions are verified, and verified results unlock new questions.
      </title>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        className="fill-none stroke-border-strong"
        strokeWidth="1.5"
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx - 34}
        ry={ry - 34}
        className="fill-accent-subtle"
      />

      {arrowAngles.map((angle) => {
        const { x, y } = onLoop(angle);
        // Point along the loop, clockwise.
        const heading =
          (Math.atan2(
            ry * Math.cos(toRad(angle)),
            -rx * Math.sin(toRad(angle)),
          ) *
            180) /
          Math.PI;
        return (
          <path
            key={angle}
            d="M-5 -6L5 0L-5 6Z"
            transform={`translate(${x} ${y}) rotate(${heading})`}
            className="fill-fg-subtle"
          />
        );
      })}

      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize="15"
        className="fill-accent-subtle-fg font-semibold"
      >
        Every verified result
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontSize="15"
        className="fill-accent-subtle-fg font-semibold"
      >
        moves the frontier
      </text>

      {stages.map((stage, i) => {
        const { x, y } = onLoop(stage.angle);
        const width = boxWidth;
        const height = 52;
        return (
          <g key={stage.title} transform={`translate(${x} ${y})`}>
            <rect
              x={-width / 2}
              y={-height / 2}
              width={width}
              height={height}
              rx="12"
              className="fill-surface stroke-border-strong"
              strokeWidth="1.25"
            />
            <circle
              cx={-width / 2 + 20}
              cy="0"
              r="10"
              className="fill-accent"
            />
            <text
              x={-width / 2 + 20}
              y="4"
              textAnchor="middle"
              fontSize="11"
              className="fill-accent-fg font-semibold"
            >
              {i + 1}
            </text>
            <text
              x={-width / 2 + 38}
              y="-3"
              fontSize="13"
              className="fill-fg font-semibold"
            >
              {stage.title}
            </text>
            <text
              x={-width / 2 + 38}
              y="14"
              fontSize="11"
              className="fill-fg-muted"
            >
              {stage.detail}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
