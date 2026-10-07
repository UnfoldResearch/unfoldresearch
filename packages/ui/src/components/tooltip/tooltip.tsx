import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

import { cn } from "../../lib/cn";

import shared from "../../styles/shared.module.css";
import styles from "./tooltip.module.css";

/** Wrap the app once to share open/close delays between tooltips. */
export const TooltipProvider = BaseTooltip.Provider;

export interface TooltipProps extends Pick<
  BaseTooltip.Positioner.Props,
  "side" | "align" | "sideOffset"
> {
  /** The element that triggers the tooltip. */
  children: ReactElement;
  content: ReactNode;
  className?: string;
}

/** Convenience tooltip: `<Tooltip content="Save"><Button>…</Button></Tooltip>` */
export function Tooltip({
  children,
  content,
  side,
  align,
  sideOffset = 6,
  className,
}: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          className={styles.positioner}
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          <BaseTooltip.Popup
            className={cn(shared.popup, styles.popup, className)}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
