import { cn } from "../../lib/cn";

import shared from "../../styles/shared.module.css";
import styles from "./button.module.css";

export interface ButtonStyleProps {
  variant?: "solid" | "soft" | "outline" | "ghost";
  tone?: "accent" | "neutral" | "danger";
  size?: "sm" | "md" | "lg";
  /** Square button sized to its height, for a lone icon. */
  iconOnly?: boolean;
}

/** Button classes, for styling a non-button element (prefer the `render` prop). */
export function buttonClassName({
  variant = "solid",
  tone = "accent",
  size = "md",
  iconOnly = false,
}: ButtonStyleProps = {}): string {
  return cn(
    shared.focusRing,
    shared.disabled,
    styles.button,
    styles[variant],
    styles[tone],
    styles[size],
    iconOnly && styles.iconOnly,
  );
}
