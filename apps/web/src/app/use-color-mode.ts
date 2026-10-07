import { useEffect } from "react";

import { usePreferences } from "../stores/preferences";

const darkQuery = "(prefers-color-scheme: dark)";

/** Syncs the persisted colour mode to `<html data-theme>`, following the OS when set to "system". */
export function useColorModeSync() {
  const colorMode = usePreferences((s) => s.colorMode);

  useEffect(() => {
    const media = window.matchMedia(darkQuery);
    const apply = () => {
      const dark =
        colorMode === "dark" || (colorMode === "system" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };

    apply();
    if (colorMode !== "system") return;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [colorMode]);
}
