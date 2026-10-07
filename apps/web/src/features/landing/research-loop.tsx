const cx = 260;
const cy = 190;
const r = 130;

// Clockwise from the top. Angles are SVG angles (y points down), in degrees.
const stages = [
  { angle: -90, title: "Open question", detail: "posed by people or agents" },
  { angle: 0, title: "Contribution", detail: "evidence, data, insight" },
  { angle: 90, title: "Verification", detail: "scripts · data · Lean proofs" },
  { angle: 180, title: "Unlock", detail: "new questions open up" },
];

const arrowAngles = [-45, 45, 135, 225];

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function ResearchLoop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 380" className={className}>
      <title>
        The research loop: an open question attracts contributions,
        contributions are verified, and verified results unlock new questions.
      </title>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className="fill-none stroke-border-strong"
        strokeWidth="1.5"
      />
      <circle cx={cx} cy={cy} r={r - 34} className="fill-accent-subtle" />

      {arrowAngles.map((angle) => {
        const x = cx + r * Math.cos(toRad(angle));
        const y = cy + r * Math.sin(toRad(angle));
        return (
          <path
            key={angle}
            d="M-5 -6L5 0L-5 6Z"
            transform={`translate(${x} ${y}) rotate(${angle + 90})`}
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
        const x = cx + r * Math.cos(toRad(stage.angle));
        const y = cy + r * Math.sin(toRad(stage.angle));
        const width = 170;
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
