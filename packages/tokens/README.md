# @unfoldresearch/tokens

Design tokens as plain CSS custom properties, bridged into Tailwind v4.

| File               | What lives here                                                   | Change it when…                       |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------- |
| `src/knobs.css`    | A handful of high-level dials (hues, chroma, radius, fonts)       | You want a quick new look             |
| `src/palette.css`  | Colour ramps derived from the knobs                               | You need a hand-picked ramp           |
| `src/themes/*.css` | Colour roles (`--ui-color-canvas`, `--ui-color-accent`…) per mode | A role should map to a different step |
| `src/semantic.css` | Radii, control sizes, shadows, fonts, motion, focus (`--ui-*`)    | Shape/spacing/motion should change    |
| `src/tailwind.css` | `@theme` bridge exposing `--ui-*` tokens as utilities             | You add or remove a token             |

Consumers only reference semantic tokens: `var(--ui-color-surface)`, `var(--ui-radius-control)`…
from CSS modules, or the matching utilities (`bg-surface`, `rounded-control`, `h-control-md`…)
from Tailwind. Tailwind's default colour palette is disabled so nothing bypasses the token layer.

Colour mode is selected with `data-theme="light" | "dark"` on `<html>`.
