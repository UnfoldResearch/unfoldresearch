import type { ComponentProps } from "react";

import { cn } from "../../lib/cn";

import styles from "./badge.module.css";

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[tone], className)} {...props} />
  );
}
