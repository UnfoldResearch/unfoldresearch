import { AgentGlyph, CheckMark, HumanGlyph } from "./glyphs";

type NodeState = "verified" | "active" | "open";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  state: NodeState;
  parent?: string;
}

// A research topic grows upward: verified results at the base, active work
// in the middle, and open questions along the frontier at the top.
const nodes: GraphNode[] = [
  { id: "root", x: 240, y: 360, state: "verified" },
  { id: "a", x: 140, y: 270, state: "verified", parent: "root" },
  { id: "b", x: 340, y: 270, state: "verified", parent: "root" },
  { id: "a1", x: 70, y: 175, state: "verified", parent: "a" },
  { id: "a2", x: 190, y: 175, state: "verified", parent: "a" },
  { id: "b1", x: 290, y: 175, state: "active", parent: "b" },
  { id: "b2", x: 410, y: 175, state: "verified", parent: "b" },
  { id: "f1", x: 50, y: 80, state: "open", parent: "a1" },
  { id: "f2", x: 150, y: 80, state: "active", parent: "a2" },
  { id: "f3", x: 240, y: 80, state: "open", parent: "a2" },
  { id: "f4", x: 370, y: 80, state: "open", parent: "b2" },
  { id: "f5", x: 450, y: 80, state: "open", parent: "b2" },
];

const byId = new Map(nodes.map((node) => [node.id, node]));

// Who is working on what: dotted links from contributors to active nodes.
const contributors = [
  { kind: "human", x: 236, y: 222, to: "b1" },
  { kind: "agent", x: 296, y: 120, to: "b1" },
  { kind: "human", x: 104, y: 30, to: "f2" },
  { kind: "agent", x: 196, y: 30, to: "f2" },
] as const;

export function KnowledgeGraph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" className={className}>
      <title>
        A research graph: verified results at the base unlock open questions at
        the frontier, which humans and AI agents work on together.
      </title>
      {nodes.map((node) => {
        const parent = node.parent && byId.get(node.parent);
        if (!parent) return null;
        return (
          <line
            key={`edge-${node.id}`}
            x1={parent.x}
            y1={parent.y}
            x2={node.x}
            y2={node.y}
            className={
              node.state === "open"
                ? "stroke-border-strong"
                : "stroke-fg-subtle"
            }
            strokeWidth="1.5"
            strokeDasharray={node.state === "open" ? "4 4" : undefined}
          />
        );
      })}

      {contributors.map((c) => {
        const target = byId.get(c.to);
        if (!target) return null;
        return (
          <line
            key={`link-${c.kind}-${c.to}`}
            x1={c.x}
            y1={c.y}
            x2={target.x}
            y2={target.y}
            className={c.kind === "agent" ? "stroke-accent" : "stroke-fg-muted"}
            strokeWidth="1.25"
            strokeDasharray="1 4"
            strokeLinecap="round"
          />
        );
      })}

      {nodes.map((node) => (
        <Node key={node.id} node={node} r={node.id === "root" ? 20 : 14} />
      ))}

      {contributors.map((c) =>
        c.kind === "human" ? (
          <HumanGlyph key={`${c.kind}-${c.to}`} x={c.x} y={c.y} />
        ) : (
          <AgentGlyph key={`${c.kind}-${c.to}`} x={c.x} y={c.y} />
        ),
      )}

      <text
        x="240"
        y="396"
        textAnchor="middle"
        fontSize="12"
        className="fill-fg-muted font-medium"
      >
        Your research topic
      </text>
    </svg>
  );
}

function Node({ node, r }: { node: GraphNode; r: number }) {
  const { x, y, state } = node;

  if (state === "verified") {
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={r}
          className="fill-success-subtle stroke-success"
          strokeWidth="1.5"
        />
        <g className="stroke-success">
          <CheckMark x={x} y={y} scale={r / 14} />
        </g>
      </g>
    );
  }

  if (state === "active") {
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={r + 5}
          className="fill-none stroke-accent"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle
          cx={x}
          cy={y}
          r={r}
          className="fill-accent-subtle stroke-accent"
          strokeWidth="1.5"
        />
        <circle cx={x} cy={y} r="4" className="fill-accent" />
      </g>
    );
  }

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
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
  );
}
