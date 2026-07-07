import { useEffect, useState } from "react";
import {
  readSfxEnabled,
  readTheme,
  writeSfxEnabled,
  writeTheme,
  type Theme,
} from "@/lib/preferences";

/**
 * Hook client-side para tema e SFX.
 * A leitura acontece dentro de useEffect para evitar mismatch de hidratação
 * (regra do template TanStack Start).
 */
export function usePreferences() {
  const [theme, setTheme] = useState<Theme>("light");
  const [sfx, setSfx] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setSfx(readSfxEnabled());
    setReady(true);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    writeTheme(next);
  }

  function toggleSfx() {
    const next = !sfx;
    setSfx(next);
    writeSfxEnabled(next);
  }

  return { theme, sfx, ready, toggleTheme, toggleSfx };
}