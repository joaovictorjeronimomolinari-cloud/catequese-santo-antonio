import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import { playSfx } from "@/lib/preferences";

export function PreferenciasCard() {
  const { theme, sfx, ready, toggleTheme, toggleSfx } = usePreferences();

  return (
    <section className="rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
      <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">
        Preferências
      </h2>
      <p className="mt-0.5 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
        Ajuste a aparência e o som do aplicativo.
      </p>

      <div className="mt-4 grid gap-3">
        <Toggle
          label="Modo escuro"
          hint="Cores suaves para leitura noturna."
          on={theme === "dark"}
          disabled={!ready}
          onClick={() => {
            toggleTheme();
            playSfx("click");
          }}
          IconOn={Moon}
          IconOff={Sun}
        />
        <Toggle
          label="Efeitos sonoros"
          hint="Sons curtos ao concluir atividades."
          on={sfx}
          disabled={!ready}
          onClick={() => {
            const willBeOn = !sfx;
            toggleSfx();
            if (willBeOn) {
              // toca uma prévia só quando liga
              setTimeout(() => playSfx("success"), 60);
            }
          }}
          IconOn={Volume2}
          IconOff={VolumeX}
        />
      </div>
    </section>
  );
}

function Toggle({
  label,
  hint,
  on,
  disabled,
  onClick,
  IconOn,
  IconOff,
}: {
  label: string;
  hint: string;
  on: boolean;
  disabled?: boolean;
  onClick: () => void;
  IconOn: typeof Moon;
  IconOff: typeof Sun;
}) {
  const Icon = on ? IconOn : IconOff;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className={
        "flex items-center gap-3 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 p-3 text-left transition hover-scale " +
        (on
          ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
          : "bg-[color:var(--card)] text-[color:var(--habit-deep)]")
      }
    >
      <span
        className={
          "flex h-10 w-10 items-center justify-center rounded-xl " +
          (on
            ? "bg-[color:var(--habit-deep)] text-[color:var(--gold-soft)]"
            : "bg-[color:var(--habit-deep)]/5")
        }
      >
        <Icon className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-extrabold leading-none">{label}</span>
        <span className="mt-1 block text-[11px] font-semibold opacity-80">{hint}</span>
      </span>
      <span
        className={
          "flex h-6 w-11 items-center rounded-full border-2 border-[color:var(--habit-deep)] p-0.5 transition " +
          (on ? "bg-[color:var(--habit-deep)]" : "bg-[color:var(--muted)]")
        }
        aria-hidden
      >
        <span
          className={
            "h-4 w-4 rounded-full bg-[color:var(--lily)] shadow transition " +
            (on ? "translate-x-5" : "translate-x-0")
          }
        />
      </span>
    </button>
  );
}