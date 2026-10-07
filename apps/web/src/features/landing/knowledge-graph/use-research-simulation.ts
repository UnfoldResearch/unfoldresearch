import { useEffect, useReducer, useState } from "react";
import type { RefObject } from "react";

import { createSimulation, step, warmUp } from "./simulation";

/**
 * A running research simulation, advanced every frame while `ref`'s element
 * is on screen. It starts with some history already grown; for reduced
 * motion it stays on that first frame.
 */
export function useResearchSimulation(ref: RefObject<Element | null>) {
  const [sim] = useState(() => {
    const created = createSimulation();
    warmUp(created, 30);
    return created;
  });
  const [, rerender] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let frame = 0;
    // Timed from the first frame's own timestamp: it can predate a
    // performance.now() read here, which would give a negative step.
    let last: number | undefined;
    const tick = (now: number) => {
      // Cap the step so a backgrounded tab doesn't jump on return.
      step(sim, Math.min((now - (last ?? now)) / 1000, 0.05));
      last = now;
      rerender();
      frame = requestAnimationFrame(tick);
    };
    // Off screen, skip the per-frame render entirely; resume where it left off.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      last = undefined;
      if (entry?.isIntersecting) frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [sim, ref]);

  return sim;
}
