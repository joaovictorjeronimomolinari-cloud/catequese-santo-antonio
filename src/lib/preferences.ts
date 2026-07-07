// Preferências client-side (tema + som). Persistência em localStorage.
// Isomórfico: nenhuma leitura de window/localStorage acontece em módulo
// de topo — apenas dentro das funções, chamadas do cliente.

export type Theme = "light" | "dark";

const THEME_KEY = "cd:theme";
const SFX_KEY = "cd:sfx";

export function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(THEME_KEY);
  return v === "dark" ? "dark" : "light";
}

export function writeTheme(t: Theme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, t);
  document.documentElement.classList.toggle("dark", t === "dark");
}

export function readSfxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SFX_KEY) === "1";
}

export function writeSfxEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SFX_KEY, on ? "1" : "0");
}

// SFX sintetizados via WebAudio — nada de arquivos.
type SfxKind = "success" | "achievement" | "click" | "error";

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC: typeof AudioContext | undefined =
    (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
      .AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function tone(freq: number, duration: number, when = 0, type: OscillatorType = "sine", gain = 0.15) {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(g).connect(c.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playSfx(kind: SfxKind) {
  if (!readSfxEnabled()) return;
  switch (kind) {
    case "success":
      tone(660, 0.12, 0, "triangle");
      tone(880, 0.18, 0.09, "triangle");
      return;
    case "achievement":
      tone(523, 0.14, 0, "triangle");
      tone(659, 0.14, 0.1, "triangle");
      tone(784, 0.2, 0.2, "triangle");
      tone(1046, 0.28, 0.3, "sine", 0.18);
      return;
    case "click":
      tone(440, 0.05, 0, "square", 0.08);
      return;
    case "error":
      tone(220, 0.15, 0, "sawtooth", 0.1);
      return;
  }
}