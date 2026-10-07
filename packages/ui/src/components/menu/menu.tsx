import { Menu as BaseMenu } from "@base-ui/react/menu";

import { mergeClassName } from "../../lib/cn";

import shared from "../../styles/shared.module.css";
import styles from "./menu.module.css";

export const Menu = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;
export const MenuGroup = BaseMenu.Group;

type PositionerProps = Pick<
  BaseMenu.Positioner.Props,
  "side" | "align" | "sideOffset" | "alignOffset"
>;

export interface MenuContentProps
  extends BaseMenu.Popup.Props, PositionerProps {}

/** Portal + positioner + popup. */
export function MenuContent({
  side,
  align = "start",
  sideOffset = 6,
  alignOffset,
  className,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        className={styles.positioner}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <BaseMenu.Popup
          className={mergeClassName([shared.popup, styles.popup], className)}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export interface MenuItemProps extends BaseMenu.Item.Props {
  tone?: "neutral" | "danger";
}

export function MenuItem({ tone, className, ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item
      className={mergeClassName(
        [styles.item, tone === "danger" && styles.danger],
        className,
      )}
      {...props}
    />
  );
}

export function MenuSeparator({
  className,
  ...props
}: BaseMenu.Separator.Props) {
  return (
    <BaseMenu.Separator
      className={mergeClassName(styles.separator, className)}
      {...props}
    />
  );
}

export function MenuGroupLabel({
  className,
  ...props
}: BaseMenu.GroupLabel.Props) {
  return (
    <BaseMenu.GroupLabel
      className={mergeClassName(styles.groupLabel, className)}
      {...props}
    />
  );
}
