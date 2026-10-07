import { Button as BaseButton } from "@base-ui/react/button";

import { mergeClassName } from "../../lib/cn";
import { buttonClassName, type ButtonStyleProps } from "./button-class-name";

export interface ButtonProps extends BaseButton.Props, ButtonStyleProps {}

export function Button({
  variant,
  tone,
  size,
  iconOnly,
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={mergeClassName(
        buttonClassName({ variant, tone, size, iconOnly }),
        className,
      )}
      {...props}
    />
  );
}
