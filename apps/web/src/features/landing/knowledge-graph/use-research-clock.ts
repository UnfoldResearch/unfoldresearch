import { useEffect, useState } from "react";

import { T0 } from "./timeline";

/** Seconds on the research timeline, advanced every frame; frozen for reduced motion. */
export function useResearchClock() {
  const [t, setT] = useState(T0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT(T0 + (now - start) / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return t;
}
