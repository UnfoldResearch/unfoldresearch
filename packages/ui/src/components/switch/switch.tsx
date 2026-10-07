import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { cn, mergeClassName } from "../../lib/cn";

import shared from "../../styles/shared.module.css";
import styles from "./switch.module.css";

export interface SwitchProps extends BaseSwitch.Root.Props {
  thumbClassName?: string;
}

export function Switch({ className, thumbClassName, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      className={mergeClassName(
        [shared.focusRing, shared.disabled, styles.root],
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb className={cn(styles.thumb, thumbClassName)} />
    </BaseSwitch.Root>
  );
}
