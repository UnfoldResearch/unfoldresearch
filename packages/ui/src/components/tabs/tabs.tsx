import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { mergeClassName } from "../../lib/cn";

import shared from "../../styles/shared.module.css";
import styles from "./tabs.module.css";

export function Tabs({ className, ...props }: BaseTabs.Root.Props) {
  return (
    <BaseTabs.Root
      className={mergeClassName(styles.root, className)}
      {...props}
    />
  );
}

/** Tab list with a sliding active indicator. */
export function TabsList({
  className,
  children,
  ...props
}: BaseTabs.List.Props) {
  return (
    <BaseTabs.List
      className={mergeClassName(styles.list, className)}
      {...props}
    >
      {children}
      <BaseTabs.Indicator className={styles.indicator} />
    </BaseTabs.List>
  );
}

export function Tab({ className, ...props }: BaseTabs.Tab.Props) {
  return (
    <BaseTabs.Tab
      className={mergeClassName(
        [shared.focusRing, shared.disabled, styles.tab],
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({ className, ...props }: BaseTabs.Panel.Props) {
  return (
    <BaseTabs.Panel
      className={mergeClassName(styles.panel, className)}
      {...props}
    />
  );
}
