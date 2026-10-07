import { useId } from "react";

import { ResearchTeam, TeamLinks } from "./research-team";
import { StatementNode } from "./statement-node";
import {
  edgeState,
  nodeState,
  rowNodes,
  teamState,
  visibleRows,
} from "./timeline";
import { useResearchClock } from "./use-research-clock";

/** The hero's animated research graph. See timeline.ts for the choreography. */
export function KnowledgeGraph({ className }: { className?: string }) {
  const t = useResearchClock();
  const id = useId().replace(/[^\w-]/g, "");

  const nodes = visibleRows(t).flatMap((k) =>
    rowNodes(k).map(({ node, team }) => ({
      key: `${k}-${node.x}`,
      edge: edgeState(k, node, team, t),
      state: nodeState(k, node, team, t),
    })),
  );
  const teams = (["A", "B"] as const).map((team) => teamState(team, t));

  return (
    <svg viewBox="0 0 480 400" className={className}>
      <title>
        An endless research graph: people and their AI agents take on open
        questions, test them as hypotheses, attach data, evidence and proofs,
        verify them as claims, and move on to the questions they unlock.
      </title>
      <defs>
        {/* Luminance mask (white keeps, black hides): older rows fade out. */}
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="black" />
          <stop offset="0.06" stopColor="white" />
          <stop offset="0.68" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask
          id={`${id}-mask`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="480"
          height="400"
        >
          <rect width="480" height="400" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <g mask={`url(#${id}-mask)`}>
        {nodes.map(({ key, edge }) =>
          edge.visible === 0 ? null : (
            <line
              key={`edge-${key}`}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              opacity={edge.visible}
              className={
                edge.started ? "stroke-fg-subtle" : "stroke-border-strong"
              }
              strokeWidth="1.5"
              strokeDasharray={edge.started ? undefined : "4 4"}
            />
          ),
        )}

        {teams.map((team) => (
          <TeamLinks key={`links-${team.team}`} state={team} />
        ))}

        {nodes.map(({ key, state }) => (
          <StatementNode key={`node-${key}`} state={state} />
        ))}

        {teams.map((team) => (
          <ResearchTeam key={`team-${team.team}`} state={team} />
        ))}
      </g>
    </svg>
  );
}
