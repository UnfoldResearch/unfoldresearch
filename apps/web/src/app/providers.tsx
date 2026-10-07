import { TooltipProvider } from "@unfoldresearch/ui";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";

import { useColorModeSync } from "./use-color-mode";

export function Providers({ children }: { children: ReactNode }) {
  useColorModeSync();

  return (
    <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
      <TooltipProvider delay={400}>{children}</TooltipProvider>
    </SWRConfig>
  );
}
