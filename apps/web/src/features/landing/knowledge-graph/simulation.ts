// A live simulation of the hero's research graph. Nothing is scripted: the
// graph grows as it goes. Four independent actors (two people, two AI agents)
// each pick an open question near the frontier on their own, or join others
// already on it. Work accumulates; supporting artifacts appear along the way; once
// there is enough the question is verified as a claim and unlocks new
// questions above it (occasionally building on two nearby claims at once).
// The workers then move on, together or apart, to whatever is open. The view drifts up with the
// frontier, and old research scrolls away.

export type ArtifactKind = "data" | "evidence" | "proof";

export const SPOKE_LENGTH = 28;
const WIDTH = 480;
/** Workers stand this far above the node they work on. */
const WORKER_RISE = 34;
/** Spacing between workers sharing a node. */
const WORKER_GAP = 26;
const MAX_PER_NODE = 3;
/** Where the topmost open question sits on screen. */
const FRONTIER_Y = 105;

interface SimSpoke {
  kind: ArtifactKind;
  angle: number;
  at: number;
  box: Box;
}

interface SimNode {
  id: number;
  x: number;
  /** World y; up is negative. */
  y: number;
  /** The claim(s) whose verification unlocked this question. */
  parents: number[];
  createdAt: number;
  startedAt?: number;
  verifiedAt?: number;
  work: number;
  needed: number;
  plannedSpokes: number;
  spokes: SimSpoke[];
}

interface SimWorker {
  id: number;
  kind: "human" | "agent";
  x: number;
  y: number;
  /** Seconds to reach the next node, however far it is. */
  travel: number;
  /** Where and when the current trip began. */
  departX: number;
  departY: number;
  departAt: number;
  /** Work per second. */
  rate: number;
  target?: number;
  working: boolean;
  arrivedAt: number;
  idleUntil: number;
  /** When this worker will feel like moving on, finished or not. */
  stintUntil: number;
  /** 0–1: how drawn this worker is to joining others rather than going solo. */
  sociability: number;
  /** The node this worker last worked on, to drift apart from co-workers. */
  lastNode?: number;
}

export interface Simulation {
  time: number;
  /** World y at the top of the view. */
  cameraY: number;
  nodes: Map<number, SimNode>;
  workers: SimWorker[];
  nextId: number;
}

type Box = [left: number, top: number, right: number, bottom: number];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
export const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (t: number, start: number | undefined, duration: number) =>
  start === undefined ? 0 : clamp((t - start) / duration);
export const ease = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;

// ---------------------------------------------------------------------------
// Setup and stepping.

export function createSimulation(): Simulation {
  const sim: Simulation = {
    time: 0,
    cameraY: -300,
    nodes: new Map(),
    workers: [],
    nextId: 1,
  };
  const root = addNode(sim, 240, 0, []);
  root.startedAt = -2;
  root.verifiedAt = -1;
  root.work = root.needed;
  spawnQuestions(sim, root, 3);

  // Kind, travel time (s), work rate, sociability.
  const crew: [SimWorker["kind"], number, number, number][] = [
    ["agent", 0.9, 1, 0.85],
    ["agent", 1, 1.1, 0.2],
    ["human", 1.2, 0.8, 0.55],
    ["human", 1.3, 0.75, 0.35],
  ];
  sim.workers = crew.map(([kind, travel, rate, sociability], i) => ({
    id: i,
    kind,
    x: rand(80, 400),
    y: rand(-20, 40),
    travel,
    departX: 0,
    departY: 0,
    departAt: 0,
    rate,
    working: false,
    arrivedAt: 0,
    idleUntil: rand(0, 2.5),
    stintUntil: 0,
    sociability,
  }));
  return sim;
}

/** Runs the simulation ahead, e.g. so the first frame already has history. */
export function warmUp(sim: Simulation, seconds: number) {
  for (let t = 0; t < seconds; t += 1 / 30) step(sim, 1 / 30);
}

export function step(sim: Simulation, dt: number) {
  // Time only moves forward; a zero or negative step would divide by zero
  // in the walking maths below and leave workers at NaN.
  if (!(dt > 0)) return;
  sim.time += dt;
  for (const worker of sim.workers) stepWorker(sim, worker, dt);

  for (const node of sim.nodes.values()) {
    if (node.startedAt === undefined || node.verifiedAt !== undefined) continue;
    const next = node.spokes.length;
    if (
      next < node.plannedSpokes &&
      node.work >= node.needed * (0.2 + 0.24 * next)
    ) {
      addSpoke(sim, node);
    }
    if (node.work >= node.needed) {
      node.verifiedAt = sim.time;
      const open = unverified(sim).length;
      const count =
        open >= 5
          ? 1
          : open <= 2
            ? 2 + (Math.random() < 0.4 ? 1 : 0)
            : 1 + (Math.random() < 0.5 ? 1 : 0);
      spawnQuestions(sim, node, count);
    }
  }

  // Drift up with the frontier; never back down.
  const frontier = Math.min(...unverified(sim).map((node) => node.y));
  if (Number.isFinite(frontier)) {
    const target = frontier - FRONTIER_Y;
    if (target < sim.cameraY)
      sim.cameraY += (target - sim.cameraY) * Math.min(1, dt * 0.6);
  }

  // Forget what has scrolled well out of view.
  for (const [id, node] of sim.nodes) {
    if (node.y - sim.cameraY > 560) sim.nodes.delete(id);
  }
}

const unverified = (sim: Simulation) =>
  [...sim.nodes.values()].filter(
    (node) => node.verifiedAt === undefined && node.y - sim.cameraY < 330,
  );

function stepWorker(sim: Simulation, worker: SimWorker, dt: number) {
  let node =
    worker.target === undefined ? undefined : sim.nodes.get(worker.target);
  // Move on when the node is done, or (now and then, after a stint of their
  // own length) leave unfinished work for someone else to pick up.
  const restless =
    worker.working && sim.time > worker.stintUntil && Math.random() < dt * 0.6;
  if (
    node?.verifiedAt !== undefined ||
    (worker.target !== undefined && !node) ||
    restless
  ) {
    if (worker.working) worker.lastNode = worker.target;
    worker.target = undefined;
    worker.working = false;
    worker.idleUntil = sim.time + rand(0.2, 2);
    node = undefined;
  }
  if (!node && sim.time >= worker.idleUntil) {
    node = pickQuestion(sim, worker);
    worker.target = node?.id;
    if (node) {
      worker.departX = worker.x;
      worker.departY = worker.y;
      worker.departAt = sim.time;
    } else {
      worker.idleUntil = sim.time + 0.5;
    }
  }
  if (!node) return;

  // Stand in a slot above the node, side by side with anyone else there.
  const crew = sim.workers
    .filter((other) => other.target === node.id)
    .toSorted((a, b) => a.id - b.id);
  const index = crew.indexOf(worker);
  const tx = node.x + (index - (crew.length - 1) / 2) * WORKER_GAP;
  const ty = node.y - WORKER_RISE;
  if (worker.working) {
    // Already there: glide to a new slot as others come and go.
    const glide = Math.min(1, dt * 8);
    worker.x += (tx - worker.x) * glide;
    worker.y += (ty - worker.y) * glide;
  } else {
    // A trip takes the same time whatever the distance, easing in and out.
    const trip = ease(clamp((sim.time - worker.departAt) / worker.travel));
    worker.x = worker.departX + (tx - worker.departX) * trip;
    worker.y = worker.departY + (ty - worker.departY) * trip;
  }

  if (!worker.working && sim.time - worker.departAt >= worker.travel) {
    worker.working = true;
    worker.arrivedAt = sim.time;
    worker.stintUntil = sim.time + rand(3, 9);
    node.startedAt ??= sim.time;
  }
  if (worker.working) node.work += worker.rate * dt;
}

/**
 * Each worker decides alone: a fresh question near the frontier, or one
 * someone is already on (at most three to a node), by their own temperament.
 */
function pickQuestion(sim: Simulation, worker: SimWorker) {
  let best: SimNode | undefined;
  let bestScore = -Infinity;
  for (const node of unverified(sim)) {
    const screenY = node.y - sim.cameraY;
    if (screenY < 20) continue;
    const crew = sim.workers.filter((other) => other.target === node.id);
    if (crew.length >= MAX_PER_NODE) continue;
    // Sociable workers lean towards joining; others towards fresh questions.
    // Everyone drifts slightly apart from whoever they last worked beside,
    // and avoids going straight back to work they just left.
    const join =
      crew.length === 0
        ? 0.45 - worker.sociability * 0.2
        : 0.1 + worker.sociability * (crew.length === 1 ? 0.45 : 0.2);
    const sameCrew = crew.some(
      (other) =>
        worker.lastNode !== undefined && other.lastNode === worker.lastNode,
    );
    const score =
      Math.random() * 1.2 +
      join -
      (sameCrew ? 0.2 : 0) -
      (node.id === worker.lastNode ? 0.4 : 0) -
      screenY / 700 -
      Math.hypot(node.x - worker.x, node.y - worker.y) / 1500;
    if (score > bestScore) {
      bestScore = score;
      best = node;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Growing the graph.

function addNode(sim: Simulation, x: number, y: number, parents: number[]) {
  const node: SimNode = {
    id: sim.nextId++,
    x,
    y,
    parents,
    createdAt: sim.time,
    work: 0,
    needed: rand(3, 4.5),
    plannedSpokes: Math.random() < 0.3 ? 3 : 2,
    spokes: [],
  };
  sim.nodes.set(node.id, node);
  return node;
}

/** Unlocks new questions above a freshly verified claim, where there's room. */
function spawnQuestions(sim: Simulation, parent: SimNode, count: number) {
  let placed = 0;
  for (let attempt = 0; attempt < 24 && placed < count; attempt++) {
    const x = Math.min(440, Math.max(40, parent.x + rand(-115, 115)));
    const y = parent.y - rand(70, 115);
    const minGap = attempt < 18 ? 82 : 62;
    const crowded = [...sim.nodes.values()].some(
      (other) => Math.hypot(other.x - x, other.y - y) < minGap,
    );
    if (crowded) continue;

    // Sometimes a question builds on two nearby claims, merging branches.
    const parents = [parent.id];
    if (Math.random() < 0.35) {
      const partner = [...sim.nodes.values()].find(
        (other) =>
          other !== parent &&
          other.verifiedAt !== undefined &&
          other.y > y + 40 &&
          Math.abs(other.y - parent.y) < 70 &&
          Math.abs(other.x - x) < 170,
      );
      if (partner) parents.push(partner.id);
    }
    addNode(sim, x, y, parents);
    placed++;
  }
}

/** Rough caption widths, for keeping spokes clear of their neighbours. */
const captionWidth: Record<ArtifactKind, number> = {
  data: 20,
  evidence: 38,
  proof: 24,
};

/** Smallest difference between two directions, in degrees (0–180). */
const angleBetween = (a: number, b: number) =>
  Math.abs(((((a - b) % 360) + 540) % 360) - 180);

const overlaps = (a: Box, b: Box) =>
  a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

/** The type tag at a node's lower right. */
const tagBox = (node: SimNode): Box => [
  node.x + 6,
  node.y + 4,
  node.x + 58,
  node.y + 20,
];

/** The spoke's artifact and caption, as artifact-spoke.tsx draws them. */
function spokeBox(node: SimNode, angle: number, kind: ArtifactKind): Box {
  const rad = (angle * Math.PI) / 180;
  const cx = node.x + SPOKE_LENGTH * Math.cos(rad);
  const cy = node.y + SPOKE_LENGTH * Math.sin(rad);
  const w = captionWidth[kind];
  const dx = Math.cos(rad);
  if (dx > 0.4) return [cx - 7, cy - 8, cx + 9 + w + 2, cy + 8];
  if (dx < -0.4) return [cx - 9 - w - 2, cy - 8, cx + 7, cy + 8];
  return [
    cx - Math.max(7, w / 2 + 2),
    cy - 7,
    cx + Math.max(7, w / 2 + 2),
    cy + 21,
  ];
}

/** Adds an artifact where its caption fits clear of everything nearby. */
function addSpoke(sim: Simulation, node: SimNode) {
  const used = new Set(node.spokes.map((spoke) => spoke.kind));
  const kinds = (["data", "evidence", "proof"] as const).filter(
    (kind) => !used.has(kind),
  );
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  if (!kind) return;

  // Directions of the node's own lines, which spokes shouldn't run along.
  const lines = [...sim.nodes.values()]
    .filter(
      (other) =>
        node.parents.includes(other.id) || other.parents.includes(node.id),
    )
    .map(
      (other) =>
        (Math.atan2(other.y - node.y, other.x - node.x) * 180) / Math.PI,
    );

  const angles = [180, 0, 90, 60, 120, 150, 30].toSorted(
    () => Math.random() - 0.5,
  );
  for (const angle of angles) {
    if (lines.some((line) => angleBetween(line, angle) < 32)) continue;
    const box = spokeBox(node, angle, kind);
    if (box[0] < 2 || box[2] > WIDTH - 2) continue;
    if (overlaps(box, tagBox(node))) continue;
    const clash = [...sim.nodes.values()].some(
      (other) =>
        (other !== node &&
          (overlaps(box, [
            other.x - 18,
            other.y - 18,
            other.x + 18,
            other.y + 18,
          ]) ||
            overlaps(box, tagBox(other)))) ||
        other.spokes.some((spoke) => overlaps(box, spoke.box)),
    );
    if (clash) continue;
    node.spokes.push({ kind, angle, at: sim.time, box });
    return;
  }
  // No room: skip this artifact rather than draw it over something.
  node.plannedSpokes--;
}

// ---------------------------------------------------------------------------
// Views for drawing, in graph space: the scene shifts them by -cameraY as a
// whole, so a node only changes when its own state does.

export function nodeViews(sim: Simulation) {
  const { time: t } = sim;
  return [...sim.nodes.values()].map((node) => ({
    id: node.id,
    state: {
      x: node.x,
      y: node.y,
      visible: ramp(t, node.createdAt, 0.6),
      hypothesis: ramp(t, node.startedAt, 0.4),
      claim: ramp(t, node.verifiedAt, 0.4),
      pulse: ramp(t, node.verifiedAt, 0.8),
      spokes: node.spokes.map((spoke) => ({
        kind: spoke.kind,
        angle: spoke.angle,
        shown: ease(ramp(t, spoke.at, 0.4)),
      })),
    },
    edges: node.parents.flatMap((parentId, i) => {
      const parent = sim.nodes.get(parentId);
      if (!parent) return [];
      return [
        {
          key: `${parentId}-${node.id}`,
          x1: parent.x,
          y1: parent.y,
          x2: node.x,
          y2: node.y,
          visible: ramp(t, node.createdAt, 0.6),
          /** Solid once someone takes the question on; dashed while open. */
          started: node.startedAt !== undefined,
          /** A second parent, where branches merge. */
          crossLink: i > 0,
        },
      ];
    }),
  }));
}

export type NodeState = ReturnType<typeof nodeViews>[number]["state"];

export function workerViews(sim: Simulation) {
  return sim.workers.map((worker) => {
    const node =
      worker.target === undefined ? undefined : sim.nodes.get(worker.target);
    return {
      key: worker.id,
      kind: worker.kind,
      x: worker.x,
      y: worker.y,
      hubX: node?.x ?? worker.x,
      hubY: node?.y ?? worker.y,
      /** The dotted "working on it" link. */
      link: worker.working ? ramp(sim.time, worker.arrivedAt, 0.3) : 0,
    };
  });
}

export type WorkerState = ReturnType<typeof workerViews>[number];
