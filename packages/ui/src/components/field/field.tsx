import { Field as BaseField } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";

import { mergeClassName } from "../../lib/cn";

import shared from "../../styles/shared.module.css";
import styles from "./field.module.css";

export function Field({ className, ...props }: BaseField.Root.Props) {
  return (
    <BaseField.Root
      className={mergeClassName(styles.field, className)}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: BaseField.Label.Props) {
  return (
    <BaseField.Label
      className={mergeClassName(styles.label, className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: BaseField.Description.Props) {
  return (
    <BaseField.Description
      className={mergeClassName(styles.description, className)}
      {...props}
    />
  );
}

export function FieldError({ className, ...props }: BaseField.Error.Props) {
  return (
    <BaseField.Error
      className={mergeClassName(styles.error, className)}
      {...props}
    />
  );
}

export interface InputProps extends Omit<BaseInput.Props, "size"> {
  size?: "sm" | "md" | "lg";
}

export function Input({ size = "md", className, ...props }: InputProps) {
  return (
    <BaseInput
      className={mergeClassName(
        [shared.focusRing, shared.disabled, styles.input, styles[size]],
        className,
      )}
      {...props}
    />
  );
}
