import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, taught the custom token scales from @unfoldresearch/tokens so that
 * e.g. `rounded-control` and `rounded-none` are recognised as conflicting.
 * Keep in sync with packages/tokens/src/tailwind.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["control", "card", "popup", "pill"],
      shadow: ["card", "popup"],
      spacing: ["control-sm", "control-md", "control-lg"],
      font: ["sans", "display", "mono"],
      ease: ["standard"],
    },
  },
});

/**
 * Compose class names (clsx syntax: strings, arrays, `{ class: condition }`) and
 * resolve conflicting Tailwind utilities (last one wins).
 * CSS module class names pass through untouched.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };

/**
 * Base UI accepts `className` as a string or a function of component state.
 * Prepends a component's own classes to either form.
 */
export function mergeClassName<State>(
  base: ClassValue,
  className: string | ((state: State) => string | undefined) | undefined,
): string | ((state: State) => string) {
  if (typeof className === "function") {
    return (state) => cn(base, className(state));
  }
  return cn(base, className);
}
