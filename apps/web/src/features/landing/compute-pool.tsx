import { AgentGlyph, HumanGlyph, KeyGlyph } from "./glyphs";

// Each contributor lends either an API key for an AI subscription or a model
// running on their own machine.
const lenders = [
  { y: 50, via: "key" },
  { y: 120, via: "local" },
  { y: 190, via: "key" },
] as const;
const tasks = [
  { y: 62, label: "Reproduce Table 3", state: "done" },
  { y: 120, label: "Find counterexample", state: "running" },
  { y: 178, label: "Formalise Lemma 4.2", state: "queued" },
] as const;

export function ComputePool({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 240" className={className}>
      <title>
        Community members lend their AI API keys or locally running models to a
        shared pool, which the community's orchestrating agents use to work
        through open research tasks.
      </title>
      {lenders.map(({ y, via }) => (
        <g key={y}>
          <path
            d={`M86 ${y} C140 ${y}, 150 120, 204 120`}
            className="fill-none stroke-warning"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <HumanGlyph x={30} y={y} />
          {via === "key" ? (
            <>
              <rect
                x="48"
                y={y - 11}
                width="34"
                height="22"
                rx="11"
                className="fill-warning-subtle stroke-warning"
                strokeWidth="1.25"
              />
              <KeyGlyph x={66} y={y} scale={0.7} />
            </>
          ) : (
            <>
              <rect
                x="48"
                y={y - 11}
                width="34"
                height="22"
                rx="11"
                className="fill-success-subtle stroke-success"
                strokeWidth="1.25"
              />
              <g
                className="fill-none stroke-success"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <rect x="58" y={y - 6} width="14" height="9" rx="1.5" />
                <path d={`M62 ${y + 6}h6M65 ${y + 3}v3`} />
              </g>
            </>
          )}
        </g>
      ))}

      <rect
        x="204"
        y="70"
        width="136"
        height="100"
        rx="14"
        className="fill-surface stroke-border-strong"
        strokeWidth="1.5"
      />
      <AgentGlyph x={240} y={108} />
      <AgentGlyph x={272} y={108} />
      <AgentGlyph x={304} y={108} />
      <text
        x="272"
        y="146"
        textAnchor="middle"
        fontSize="12"
        className="fill-fg font-semibold"
      >
        Shared AI pool
      </text>
      <text
        x="272"
        y="161"
        textAnchor="middle"
        fontSize="10.5"
        className="fill-fg-muted"
      >
        orchestrated by core agents
      </text>

      {tasks.map((task) => (
        <g key={task.label}>
          <path
            d={`M340 120 C380 120, 380 ${task.y}, 404 ${task.y}`}
            className="fill-none stroke-accent"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <rect
            x="404"
            y={task.y - 18}
            width="148"
            height="36"
            rx="8"
            className="fill-surface stroke-border"
            strokeWidth="1.25"
          />
          <circle
            cx="420"
            cy={task.y}
            r="5"
            className={
              task.state === "done"
                ? "fill-success"
                : task.state === "running"
                  ? "fill-accent"
                  : "fill-none stroke-fg-subtle"
            }
            strokeWidth="1.5"
          />
          <text x="432" y={task.y + 4} fontSize="11" className="fill-fg">
            {task.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
