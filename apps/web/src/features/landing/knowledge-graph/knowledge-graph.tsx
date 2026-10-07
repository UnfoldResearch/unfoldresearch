import { cn } from "@unfoldresearch/ui";
import { useRef } from "react";

import { Worker, WorkerLink } from "./research-worker";
import { nodeViews, workerViews } from "./simulation";
import { StatementNode } from "./statement-node";
import { useResearchSimulation } from "./use-research-simulation";

/** The hero's live research graph. See simulation.ts for how it grows. */
export function KnowledgeGraph({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const sim = useResearchSimulation(ref);
  const nodes = nodeViews(sim);
  const workers = workerViews(sim);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <svg viewBox="0 0 480 400" className="block h-auto w-full">
        <title>
          A live research graph: people and AI agents pick up open questions,
          alone or together, test them as hypotheses, attach data, evidence and
          proofs, verify them as claims, and move on to the questions they
          unlock.
        </title>

        {/* The camera: one transform instead of shifting every element. */}
        <g transform={`translate(0 ${-sim.cameraY})`}>
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
      </svg>
      {/* Edge fades: older rows sink away at the bottom and the sides feather.
          Painted over the graph in the page colour rather than masking it,
          since an SVG mask re-composites the whole graph every frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to bottom, var(--color-canvas), transparent 5%)",
            "linear-gradient(to top, var(--color-canvas), transparent 25%)",
            "linear-gradient(to right, var(--color-canvas), transparent 4%)",
            "linear-gradient(to left, var(--color-canvas), transparent 4%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
