import { AgentGlyph, HumanGlyph, KeyGlyph } from "./glyphs";

const c = 210;

type Member = { kind: "human" | "agent" | "lent"; angle: number };

// Members on each ring; angles are SVG degrees (0 = right, 90 = down).
// The top of each band is kept clear for its label.
const contributors: Member[] = [
  { kind: "human", angle: 0 },
  { kind: "agent", angle: 50 },
  { kind: "human", angle: 130 },
  { kind: "agent", angle: 180 },
  { kind: "human", angle: 90 },
];

const publicMembers: Member[] = [
  { kind: "lent", angle: -20 },
  { kind: "human", angle: 15 },
  { kind: "agent", angle: 45 },
  { kind: "lent", angle: 75 },
  { kind: "human", angle: 105 },
  { kind: "human", angle: 135 },
  { kind: "lent", angle: 165 },
  { kind: "agent", angle: 195 },
  { kind: "human", angle: 222 },
];

const bands = [
  { r: 196, label: "Public community", labelY: c - 170 },
  { r: 140, label: "Contributors", labelY: c - 112 },
];

export function CommunityRings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 420" className={className}>
      <title>
        Concentric rings of a research community: a core team of maintainers and
        orchestrating agents, a ring of trusted contributors, and an open public
        community that can lend its own AI keys.
      </title>
      {bands.map((band) => (
        <circle
          key={band.label}
          cx={c}
          cy={c}
          r={band.r}
          className="fill-surface-sunken stroke-border-strong"
          strokeWidth="1.25"
          strokeDasharray={band.r === 196 ? "5 5" : undefined}
        />
      ))}
      <circle
        cx={c}
        cy={c}
        r={84}
        className="fill-accent-subtle stroke-accent"
        strokeWidth="1.5"
      />

      {bands.map((band) => (
        <text
          key={`label-${band.label}`}
          x={c}
          y={band.labelY}
          textAnchor="middle"
          fontSize="12"
          className="fill-fg-muted font-semibold uppercase"
          letterSpacing="0.06em"
        >
          {band.label}
        </text>
      ))}

      <text
        x={c}
        y={c - 30}
        textAnchor="middle"
        fontSize="12"
        className="fill-accent-subtle-fg font-semibold uppercase"
        letterSpacing="0.06em"
      >
        Core team
      </text>
      <HumanGlyph x={c - 32} y={c + 6} />
      <AgentGlyph x={c} y={c + 8} />
      <HumanGlyph x={c + 32} y={c + 6} />
      <text
        x={c}
        y={c + 46}
        textAnchor="middle"
        fontSize="10.5"
        className="fill-accent-subtle-fg"
      >
        maintainers + core agents
      </text>

      {contributors.map((m) => (
        <Member key={`${m.kind}-${m.angle}`} member={m} r={112} />
      ))}
      {publicMembers.map((m) => (
        <Member key={`${m.kind}-${m.angle}`} member={m} r={168} />
      ))}
    </svg>
  );
}

function Member({ member, r }: { member: Member; r: number }) {
  const rad = (member.angle * Math.PI) / 180;
  const x = c + r * Math.cos(rad);
  const y = c + r * Math.sin(rad);

  if (member.kind === "agent") return <AgentGlyph x={x} y={y} />;
  if (member.kind === "human") return <HumanGlyph x={x} y={y} />;

  // A public member lending their own AI subscription.
  return (
    <g>
      <HumanGlyph x={x - 9} y={y} />
      <circle
        cx={x + 11}
        cy={y + 8}
        r="9"
        className="fill-warning-subtle stroke-warning"
        strokeWidth="1.25"
      />
      <KeyGlyph x={x + 12} y={y + 8} scale={0.55} />
    </g>
  );
}
