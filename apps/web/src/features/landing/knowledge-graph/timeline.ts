// The research timeline behind the hero graph. Rows of questions scroll
// upward; two teams (a person and their AI agent) each take one question per
// row, test it as a hypothesis, attach supporting artifacts, verify it as a
// claim, and move on to a question it unlocked.
//
// Everything here is a pure function of time `t` (seconds), and the layout
// repeats every three rows, so the loop has no start or end and any moment
// can be rendered on its own (e.g. a still frame for reduced motion).

export type Team = "A" | "B";
export type ArtifactKind = "data" | "evidence" | "proof";

export interface Spoke {
  kind: ArtifactKind;
  /** SVG degrees: 0 = right, 90 = down. */
  angle: number;
}

export interface PatternNode {
  x: number;
  /** The team whose node in the previous row unlocked this one. */
  parent: Team;
  spokes?: Spoke[];
}

interface Row {
  /** Worked by team A. */
  a: PatternNode;
  /** Worked by team B. */
  b: PatternNode;
  /** Unlocked but left open. */
  open: PatternNode[];
}

// Repeating rows. A only takes its own unlocked questions (B's arrive too
// late for it); B, half a step behind, may take either team's.
const pattern: [Row, Row, Row] = [
  {
    a: {
      x: 150,
      parent: "A",
      spokes: [
        { kind: "evidence", angle: 180 },
        { kind: "data", angle: 90 },
      ],
    },
    b: {
      x: 330,
      parent: "B",
      spokes: [
        { kind: "data", angle: 180 },
        { kind: "evidence", angle: 0 },
        { kind: "proof", angle: 90 },
      ],
    },
    open: [{ x: 50, parent: "A" }],
  },
  {
    a: {
      x: 210,
      parent: "A",
      spokes: [
        { kind: "evidence", angle: 180 },
        { kind: "proof", angle: 0 },
      ],
    },
    b: {
      x: 310,
      parent: "B",
      spokes: [
        { kind: "data", angle: 0 },
        { kind: "evidence", angle: 90 },
      ],
    },
    open: [
      { x: 90, parent: "A" },
      { x: 430, parent: "B" },
    ],
  },
  {
    a: {
      x: 130,
      parent: "A",
      spokes: [
        { kind: "data", angle: 180 },
        { kind: "evidence", angle: 90 },
        { kind: "proof", angle: 0 },
      ],
    },
    b: {
      x: 250,
      parent: "A",
      spokes: [
        { kind: "evidence", angle: 0 },
        { kind: "data", angle: 90 },
      ],
    },
    open: [{ x: 380, parent: "B" }],
  },
];

/** Seconds a team spends on one node. */
export const STEP = 6;
/** Vertical distance between rows. */
const ROW = 95;
/** Screen y of team A's row as it starts work. */
const TOP = 115;
export const SPOKE_LENGTH = 28;
/** A moment deep into the timeline, so there is research history below. */
export const T0 = 30 * STEP + 0.62 * STEP;

// Phases within a team's step, as fractions of STEP.
const MOVE_END = 0.15;
const SPOKE_START = 0.28;
const SPOKE_GAP = 0.15;
const VERIFY = 0.72;
const UNLOCK = 0.8;

export const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (t: number, start: number, duration: number) =>
  clamp((t - start) / duration);
export const ease = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const rowOf = (k: number) => pattern[((k % 3) + 3) % 3] ?? pattern[0];
const teamNode = (k: number, team: Team) =>
  team === "A" ? rowOf(k).a : rowOf(k).b;
const teamStart = (k: number, team: Team) =>
  k * STEP + (team === "B" ? STEP / 2 : 0);
const screenY = (k: number, t: number) => TOP - (k - t / STEP) * ROW;

/** Rows worth drawing at time t: some history below, the frontier above. */
export function visibleRows(t: number) {
  const current = Math.floor(t / STEP);
  const rows: number[] = [];
  for (let k = current - 3; k <= current + 2; k++) rows.push(k);
  return rows;
}

export function rowNodes(k: number): { node: PatternNode; team?: Team }[] {
  const row = rowOf(k);
  return [
    { node: row.a, team: "A" },
    { node: row.b, team: "B" },
    ...row.open.map((node) => ({ node })),
  ];
}

/** How far a node has faded in, once its parent is verified. */
const appeared = (k: number, node: PatternNode, t: number) =>
  ramp(t, teamStart(k - 1, node.parent) + UNLOCK * STEP, 0.6);

/** The link from a node's parent, in screen space. */
export function edgeState(
  k: number,
  node: PatternNode,
  team: Team | undefined,
  t: number,
) {
  const parent = teamNode(k - 1, node.parent);
  return {
    x1: parent.x,
    y1: screenY(k - 1, t),
    x2: node.x,
    y2: screenY(k, t),
    visible: appeared(k, node, t),
    /** Solid once a team takes the question on; dashed while open. */
    started: !!team && t >= teamStart(k, team) + MOVE_END * STEP,
  };
}

/** A node's position and how far along each stage of its work it is. */
export function nodeState(
  k: number,
  node: PatternNode,
  team: Team | undefined,
  t: number,
) {
  const base = { x: node.x, y: screenY(k, t), visible: appeared(k, node, t) };
  if (!team) {
    return { ...base, hypothesis: 0, claim: 0, pulse: 0, spokes: [] };
  }
  const s = teamStart(k, team);
  return {
    ...base,
    hypothesis: ramp(t, s + MOVE_END * STEP, 0.4),
    claim: ramp(t, s + VERIFY * STEP, 0.4),
    pulse: ramp(t, s + VERIFY * STEP, 0.8),
    spokes: (node.spokes ?? []).map((spoke, j) => ({
      kind: spoke.kind,
      angle: spoke.angle,
      shown: ease(ramp(t, s + (SPOKE_START + j * SPOKE_GAP) * STEP, 0.4)),
    })),
  };
}

export type NodeState = ReturnType<typeof nodeState>;

/** Where a team is: gliding to its next node, then working beside it. */
export function teamState(team: Team, t: number) {
  const u = (t - (team === "B" ? STEP / 2 : 0)) / STEP;
  const k = Math.floor(u);
  const f = u - k;
  const cur = teamNode(k, team);
  const prev = teamNode(k - 1, team);
  const move = ease(clamp(f / MOVE_END));
  const hubY = screenY(k, t);
  return {
    team,
    x: lerp(prev.x, cur.x, move),
    y: lerp(screenY(k - 1, t), hubY, move),
    hubX: cur.x,
    hubY,
    /** The dotted "working on it" links, shown while at the node. */
    links: clamp((f - MOVE_END) / 0.05) * (1 - clamp((f - 0.93) / 0.07)),
  };
}

export type TeamState = ReturnType<typeof teamState>;
