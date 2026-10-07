import { useId } from "react";

import { Worker, WorkerLink } from "./research-worker";
import { nodeViews, workerViews } from "./simulation";
import { StatementNode } from "./statement-node";
import { useResearchSimulation } from "./use-research-simulation";

/** The hero's live research graph. See simulation.ts for how it grows. */
export function KnowledgeGraph({ className }: { className?: string }) {
  const sim = useResearchSimulation();
  const id = useId().replace(/[^\w-]/g, "");
  const nodes = nodeViews(sim);
  const workers = workerViews(sim);

  return (
    <svg viewBox="0 0 480 400" className={className}>
      <title>
        A live research graph: people and AI agents pick up open questions,
        alone or together, test them as hypotheses, attach data, evidence and
        proofs, verify them as claims, and move on to the questions they unlock.
      </title>
      <defs>
        {/* Luminance masks (white keeps, black hides): older rows fade out
            at the bottom, and the sides feather instead of clipping. */}
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="black" />
          <stop offset="0.05" stopColor="white" />
          <stop offset="0.75" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <linearGradient id={`${id}-sides`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="black" />
          <stop offset="0.04" stopColor="white" />
          <stop offset="0.96" stopColor="white" />
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
        <mask
          id={`${id}-sides-mask`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="480"
          height="400"
        >
          <rect width="480" height="400" fill={`url(#${id}-sides)`} />
        </mask>
      </defs>

      {/* Nested so the two fades multiply at the corners. */}
      <g mask={`url(#${id}-mask)`}>
        <g mask={`url(#${id}-sides-mask)`}>
          {nodes.flatMap(({ edges }) =>
            edges.map((edge) =>
              edge.visible === 0 ? null : (
                <line
                  key={`edge-${edge.key}`}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  opacity={edge.visible}
                  // Cross-links between lanes stay lighter than the main lines.
                  className={
                    edge.started && !edge.crossLink
                      ? "stroke-fg-subtle"
                      : "stroke-border-strong"
                  }
                  strokeWidth={edge.crossLink ? 1.25 : 1.5}
                  strokeDasharray={edge.started ? undefined : "4 4"}
                />
              ),
            ),
          )}

          {workers.map((worker) => (
            <WorkerLink key={`link-${worker.key}`} state={worker} />
          ))}

          {nodes.map(({ id: nodeId, state }) => (
            <StatementNode key={`node-${nodeId}`} state={state} />
          ))}

          {workers.map((worker) => (
            <Worker key={`worker-${worker.key}`} state={worker} />
          ))}
        </g>
      </g>
    </svg>
  );
}
