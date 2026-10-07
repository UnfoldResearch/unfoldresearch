import { AgentGlyph, HumanGlyph } from "../glyphs";
import type { WorkerState } from "./simulation";

/** Dotted "working on it" link from a worker to their node; drawn under nodes. */
export function WorkerLink({ state }: { state: WorkerState }) {
  if (state.link === 0) return null;
  return (
    <line
      x1={state.x}
      y1={state.y}
      x2={state.hubX}
      y2={state.hubY}
      opacity={state.link}
      className={state.kind === "agent" ? "stroke-accent" : "stroke-fg-muted"}
      strokeWidth="1.25"
      strokeDasharray="1 4"
      strokeLinecap="round"
    />
  );
}

/** A person or an AI agent. */
export function Worker({ state }: { state: WorkerState }) {
  return state.kind === "agent" ? (
    <AgentGlyph x={state.x} y={state.y} />
  ) : (
    <HumanGlyph x={state.x} y={state.y} />
  );
}
