import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

import { CheckIcon } from "../../icons/icons";
import { mergeClassName } from "../../lib/cn";

import shared from "../../styles/shared.module.css";
import styles from "./checkbox.module.css";

export type CheckboxProps = BaseCheckbox.Root.Props;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      className={mergeClassName(
        [shared.focusRing, shared.disabled, styles.root],
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className={styles.indicator}>
        <CheckIcon strokeWidth={3} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
