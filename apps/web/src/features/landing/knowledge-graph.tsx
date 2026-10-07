import { AgentGlyph, CheckMark, HumanGlyph } from "./glyphs";

// Graph nodes are statements: verified claims, hypotheses being tested and
// open questions. Supporting artifacts are smaller spokes off the node they back.
type NodeKind = "topic" | "claim" | "hypothesis" | "question";
type ArtifactKind = "data" | "evidence" | "proof";

interface GraphNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  parent?: string;
  /** Hide the type tag where the frontier is too tight for one. */
  untagged?: boolean;
}

// A research topic grows upward: verified claims at the base, hypotheses in
// progress in the middle, and open questions along the frontier at the top.
const nodes: GraphNode[] = [
  { id: "root", kind: "topic", x: 240, y: 360 },
  { id: "a", kind: "claim", x: 140, y: 270, parent: "root" },
  { id: "b", kind: "claim", x: 340, y: 270, parent: "root" },
  { id: "a1", kind: "claim", x: 70, y: 175, parent: "a" },
  { id: "a2", kind: "claim", x: 190, y: 175, parent: "a" },
  { id: "b1", kind: "hypothesis", x: 290, y: 175, parent: "b" },
  { id: "b2", kind: "claim", x: 410, y: 175, parent: "b" },
  { id: "f1", kind: "question", x: 50, y: 80, parent: "a1" },
  { id: "f2", kind: "hypothesis", x: 150, y: 80, parent: "a2" },
  { id: "f3", kind: "question", x: 240, y: 80, parent: "a2", untagged: true },
  { id: "f4", kind: "question", x: 370, y: 80, parent: "b2", untagged: true },
  { id: "f5", kind: "question", x: 450, y: 80, parent: "b2", untagged: true },
];

const byId = new Map(nodes.map((node) => [node.id, node]));

// Supporting artifacts are spokes around the claim or hypothesis they back
// (the hub). Angles are SVG degrees (0 = right, 90 = down), picked to keep
// clear of the hub's edges and tag; `label` is where the caption sits.
const spokes: {
  kind: ArtifactKind;
  of: string;
  angle: number;
  label: "left" | "right" | "below";
}[] = [
  { kind: "evidence", of: "a", angle: 180, label: "left" },
  { kind: "data", of: "a", angle: 140, label: "left" },
  { kind: "evidence", of: "a1", angle: 165, label: "below" },
  { kind: "proof", of: "a2", angle: 150, label: "left" },
  { kind: "evidence", of: "b", angle: -15, label: "right" },
  { kind: "data", of: "b", angle: 95, label: "right" },
  { kind: "data", of: "b1", angle: -30, label: "right" },
  { kind: "evidence", of: "b1", angle: -150, label: "left" },
  { kind: "proof", of: "b2", angle: -15, label: "right" },
  { kind: "data", of: "b2", angle: 90, label: "right" },
];

const spokeLength = 30;

function spokePosition(hub: GraphNode, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: hub.x + spokeLength * Math.cos(rad),
    y: hub.y + spokeLength * Math.sin(rad),
  };
}

// Who is working on what: dotted links from contributors to active nodes.
const contributors = [
  { kind: "human", x: 296, y: 232, to: "b1" },
  { kind: "agent", x: 296, y: 120, to: "b1" },
  { kind: "human", x: 104, y: 30, to: "f2" },
  { kind: "agent", x: 196, y: 30, to: "f2" },
] as const;

export function KnowledgeGraph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" className={className}>
      <title>
        A research graph of claims, hypotheses and open questions, each backed
        by data, evidence and proofs: verified claims at the base unlock open
        questions at the frontier, which humans and AI agents work on together.
      </title>
      {nodes.map((node) => {
        const parent = node.parent && byId.get(node.parent);
        if (!parent) return null;
        const open = node.kind === "question";
        return (
          <line
            key={`edge-${node.id}`}
            x1={parent.x}
            y1={parent.y}
            x2={node.x}
            y2={node.y}
            className={open ? "stroke-border-strong" : "stroke-fg-subtle"}
            strokeWidth="1.5"
            strokeDasharray={open ? "4 4" : undefined}
          />
        );
      })}

      {spokes.map((spoke) => {
        const hub = byId.get(spoke.of);
        if (!hub) return null;
        const { x, y } = spokePosition(hub, spoke.angle);
        return (
          <line
            key={`spoke-${spoke.of}-${spoke.angle}`}
            x1={hub.x}
            y1={hub.y}
            x2={x}
            y2={y}
            className="stroke-border-strong"
            strokeWidth="1"
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
        <Node key={node.id} node={node} />
      ))}

      {nodes.map((node) =>
        node.kind === "topic" || node.untagged ? null : (
          <Pill
            key={`tag-${node.id}`}
            kind={node.kind}
            // Tucked against the node's lower right.
            x={node.x + 8 + pillWidth(node.kind) / 2}
            y={node.y + 12}
          />
        ),
      )}

      {spokes.map((spoke) => {
        const hub = byId.get(spoke.of);
        if (!hub) return null;
        return (
          <Spoke
            key={`${spoke.of}-${spoke.angle}`}
            kind={spoke.kind}
            label={spoke.label}
            {...spokePosition(hub, spoke.angle)}
          />
        );
      })}

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

function Node({ node }: { node: GraphNode }) {
  const { x, y, kind } = node;

  if (kind === "topic") {
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r="20"
          className="fill-neutral-subtle stroke-fg-subtle"
          strokeWidth="1.5"
        />
        <circle cx={x} cy={y} r="6" className="fill-fg-muted" />
      </g>
    );
  }

  if (kind === "claim") {
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r="14"
          className="fill-success-subtle stroke-success"
          strokeWidth="1.5"
        />
        <g className="stroke-success">
          <CheckMark x={x} y={y} />
        </g>
      </g>
    );
  }

  if (kind === "hypothesis") {
    return (
      <g>
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
    );
  }

  return (
    <g>
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
  );
}

type TaggedKind = Exclude<NodeKind, "topic"> | ArtifactKind;

// Each kind gets its own tone so classes read apart at a glance. `shape` is
// the pill or spoke node; `text` is its label.
const kindStyles: Record<
  TaggedKind,
  { label: string; shape: string; text: string; dashed?: boolean }
> = {
  claim: {
    label: "Claim",
    shape: "fill-success-subtle stroke-success",
    text: "fill-success-subtle-fg",
  },
  hypothesis: {
    label: "Hypothesis",
    shape: "fill-warning-subtle stroke-warning",
    text: "fill-warning-subtle-fg",
  },
  question: {
    label: "Question",
    shape: "fill-canvas stroke-border-strong",
    text: "fill-fg-subtle",
    dashed: true,
  },
  data: {
    label: "Data",
    shape: "fill-neutral-subtle stroke-fg-subtle",
    text: "fill-fg-muted",
  },
  evidence: {
    label: "Evidence",
    shape: "fill-danger-subtle stroke-danger",
    text: "fill-danger-subtle-fg",
  },
  proof: {
    label: "Proof",
    shape: "fill-accent-subtle stroke-accent",
    text: "fill-accent-subtle-fg",
  },
};

const pillHeight = 12;
const pillWidth = (kind: TaggedKind) => 8 + kindStyles[kind].label.length * 4.8;

/** A small type tag centred on (x, y). */
function Pill({ kind, x, y }: { kind: TaggedKind; x: number; y: number }) {
  const style = kindStyles[kind];
  const width = pillWidth(kind);
  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - pillHeight / 2}
        width={width}
        height={pillHeight}
        rx={pillHeight / 2}
        className={style.shape}
        strokeDasharray={style.dashed ? "3 2" : undefined}
      />
      <text
        x={x}
        y={y + 2.75}
        textAnchor="middle"
        fontSize="8"
        className={`font-semibold ${style.text}`}
      >
        {style.label}
      </text>
    </g>
  );
}

/** A small, faded supporting artifact at the end of a spoke. */
function Spoke({
  kind,
  label,
  x,
  y,
}: {
  kind: ArtifactKind;
  label: "left" | "right" | "below";
  x: number;
  y: number;
}) {
  const style = kindStyles[kind];
  const text =
    label === "below"
      ? { x, y: y + 15, anchor: "middle" as const }
      : label === "left"
        ? { x: x - 9, y: y + 3, anchor: "end" as const }
        : { x: x + 9, y: y + 3, anchor: "start" as const };
  return (
    <g opacity="0.75">
      <circle
        cx={x}
        cy={y}
        r="5.5"
        className={style.shape}
        strokeWidth="1.25"
      />
      <text
        x={text.x}
        y={text.y}
        textAnchor={text.anchor}
        fontSize="8.5"
        className={`font-medium ${style.text}`}
      >
        {style.label}
      </text>
    </g>
  );
}
