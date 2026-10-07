import {
  Button,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Tooltip,
} from "@unfoldresearch/ui";

import { type ColorMode, usePreferences } from "../stores/preferences";

const modes: { value: ColorMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ColorModeMenu() {
  const colorMode = usePreferences((s) => s.colorMode);
  const setColorMode = usePreferences((s) => s.setColorMode);

  return (
    <Menu>
      <Tooltip content="Colour mode">
        <MenuTrigger
          render={<Button variant="ghost" tone="neutral" size="sm" />}
        >
          {modes.find((m) => m.value === colorMode)?.label}
        </MenuTrigger>
      </Tooltip>
      <MenuContent align="end">
        {modes.map((mode) => (
          <MenuItem key={mode.value} onClick={() => setColorMode(mode.value)}>
            {mode.label}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}
