import { AgentGlyph, HumanGlyph } from "../glyphs";
import type { TeamState } from "./timeline";

// The pair sits just above the node they are working on.
const HUMAN = { dx: -18, dy: -34 };
const AGENT = { dx: 18, dy: -34 };

/** Dotted "working on it" links from the pair to their node; drawn under nodes. */
export function TeamLinks({ state }: { state: TeamState }) {
  if (state.links === 0) return null;
  return (
    <g
      opacity={state.links}
      strokeWidth="1.25"
      strokeDasharray="1 4"
      strokeLinecap="round"
    >
      <line
        x1={state.x + HUMAN.dx}
        y1={state.y + HUMAN.dy}
        x2={state.hubX}
        y2={state.hubY}
        className="stroke-fg-muted"
      />
      <line
        x1={state.x + AGENT.dx}
        y1={state.y + AGENT.dy}
        x2={state.hubX}
        y2={state.hubY}
        className="stroke-accent"
      />
    </g>
  );
}

/** A person and their AI agent, working as a team. */
export function ResearchTeam({ state }: { state: TeamState }) {
  return (
    <g>
      <HumanGlyph x={state.x + HUMAN.dx} y={state.y + HUMAN.dy} />
      <AgentGlyph x={state.x + AGENT.dx} y={state.y + AGENT.dy} />
    </g>
  );
}
