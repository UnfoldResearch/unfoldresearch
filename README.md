# Unfold Research

Turborepo + Yarn workspaces monorepo: a Vite/React app and a decoupled design system.

## Setup

```sh
nvm use            # Node 24 (from .nvmrc)
yarn install       # Yarn 4 is checked in at .yarn/releases (yarnPath), no Corepack needed
yarn dev           # http://localhost:5173
```

| Script       | What it does                                          |
| ------------ | ----------------------------------------------------- |
| `yarn dev`   | Run all `dev` tasks via Turborepo                     |
| `yarn build` | Production build                                      |
| `yarn ts`    | `tsc` (TypeScript 7) in every workspace               |
| `yarn lint`  | oxlint (`--fix` via `yarn lint:fix`)                  |
| `yarn fmt`   | oxfmt (sorts imports, Tailwind classes, package.json) |
| `yarn check` | format check + lint + typecheck                       |

To upgrade Yarn: `yarn set version stable`.

## Layout

```
apps/
  web/                 Vite + React + React Router + zustand + SWR + zod
packages/
  tokens/              Design tokens (CSS custom properties → Tailwind @theme)
  ui/                  Components: Base UI behaviour + CSS modules
  tsconfig/            Shared tsconfig presets
```

The workspace packages ship TypeScript/CSS source (no build step); Vite compiles them directly.

### No barrel files

Import from the module that defines the thing (`../button/button`, `./schema`),
never via an `index.ts` that re-exports a folder. Barrel files are only allowed at a package
boundary, i.e. the file a package's `exports` field points to (e.g. `packages/ui/src/index.ts`),
and should list exports explicitly rather than `export *`.

## Design iteration

Styling has three layers, each in one place. Change the layer that matches the size of the change:

1. **Knobs** (`packages/tokens/src/knobs.css`): hues, chroma, radius, density, fonts.
   One number changes the whole look. The Playground page (`/playground`) has live sliders for these;
   copy the CSS it prints back into the file.
2. **Semantic tokens** (`packages/tokens/src/themes/{light,dark}.css`, `semantic.css`): which
   palette step each colour role uses per mode, plus radii, control sizes, shadows, motion.
   All exposed as `--ui-*` custom properties.
3. **Component styles** (`packages/ui/src/components/*/*.module.css`): one CSS module per
   component. Behaviour (`*.tsx`) is kept separate and rarely needs changing.

### How to style

- **CSS modules for anything non-trivial**: components, variants, states (`[data-checked]`,
  `[data-highlighted]` from Base UI), animations. Use `var(--ui-…)` tokens only, never raw
  colours. Wrap rules in `@layer components` so Tailwind utilities passed via `className`
  still override them.
- **Variants** are classes picked in TSX (`styles[variant]`, `styles[tone]`). Prefer tones that
  set private custom properties (`--_bg`, `--_fg`) which variants consume, so a new tone or
  variant is one rule rather than one per combination (see `button.module.css`).
- **Tailwind for simple layout and one-offs** in app code (`flex gap-4`, `text-fg-muted`).
  Tailwind's default colour palette is **disabled**; only semantic utilities exist.
- **`cn(...)`** (`clsx` + `tailwind-merge`) composes classes everywhere. Base UI's
  function-form `className` is handled by `mergeClassName`.
- Shared behaviour (focus ring, popup motion, disabled state) lives in
  `packages/ui/src/styles/shared.module.css`; components opt in via `cn(shared.focusRing, …)`.
- Adding a token: define it in `packages/tokens` and, if it should be a utility, map it in
  `tailwind.css`. New radius/shadow/spacing utility names also go in
  `packages/ui/src/lib/cn.ts` so tailwind-merge resolves conflicts correctly.
- Colour mode is `data-theme="light" | "dark"` on `<html>`, driven by the zustand
  `usePreferences` store (persisted, follows the OS when set to "system").

## App conventions (`apps/web`)

- Use relative imports within a workspace; no path aliases (`@/…`).
- Routes live in `src/app/router.tsx` and are lazily loaded from `src/routes/`.
- Data fetching: `useApi(url, zodSchema)` in `src/lib/use-api.ts` gives typed, validated SWR
  data. See `src/features/users/` for an example.
- Client state: zustand stores in `src/stores/`.
