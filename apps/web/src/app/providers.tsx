import { TooltipProvider } from "@unfoldresearch/ui";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
      <TooltipProvider delay={400}>{children}</TooltipProvider>
    </SWRConfig>
  );
}
