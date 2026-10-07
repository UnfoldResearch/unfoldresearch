import type { ComponentProps } from "react";

import { cn } from "../../lib/cn";

import styles from "./card.module.css";

export interface CardProps extends ComponentProps<"div"> {
  /** Adds a subtle shadow. */
  elevated?: boolean;
}

export function Card({ elevated = true, className, ...props }: CardProps) {
  return (
    <div
      className={cn(styles.card, elevated && styles.elevated, className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.header, className)} {...props} />;
}

export function CardTitle({
  className,
  children,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3 className={cn(styles.title, className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn(styles.description, className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.content, className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(styles.footer, className)} {...props} />;
}
