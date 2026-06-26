import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/aluno/conquistas")({
  head: () => ({ meta: [{ title: "Conquistas — Catequizando Digital" }] }),
  component: ConquistasPage,
});

type Medalha = {
  id: string;
  nome: string;
  desc: string;
  emoji: string;
  cor: "gold" | "leaf" | "habit" | "sky";
  meta: number;
  alcancado: (p: { xp: number; streak: number; done: number; lirios: number }) => number;
};

const MEDALHAS: Medalha[] = [
  { id: "m1", nome: "Primeiros passos", desc: "Conclua sua primeira atividade", emoji: "👣", cor: "gold", meta: 1, alcancado: (p) => Math.min(p.done, 1) },
  { id: "m2", nome: "Coração orante", desc: "Reze 7 dias seguidos", emoji: "❤️", cor: "leaf", meta: 7, alcancado: (p) => Math.min(p.streak, 7) },
  { id: "m3", nome: "Discípulo da Palavra", desc: "Complete 10 atividades", emoji: "📖", cor: "habit", meta: 10, alcancado: (p) => Math.min(p.done, 10) },
  { id: "m4", nome: "Coletor de lírios", desc: "Junte 20 lírios", emoji: "🪷", cor: "sky", meta: 20, alcancado: (p) => Math.min(p.lirios, 20) },
  { id: "m5", nome: "Caminho de luz", desc: "Acumule 100 XP", emoji: "⭐", cor: "gold", meta: 100, alcancado: (p) => Math.min(p.xp, 100) },
  { id: "m6", nome: "Caçador de baús", desc: "Abra 3 baús do Frei Antônio", emoji: "🎁", cor: "leaf", meta: 3, alcancado: () => 0 },
];

function ConquistasPage() {
  const aluno = useStore((s) =>
    s.session?.kind === "aluno" ? s.alunos.find((a) => a.id === s.session!.id) ?? null : null,
  );
  const prog = useStore((s) => (aluno ? s.progresso[aluno.id] : undefined));

  const p = {
    xp: prog?.xp ?? 0,
    streak: prog?.streak ?? 0,
    done: prog?.completed.length ?? 0,
    lirios: prog?.lirios ?? 0,
  };
  const ganhas = MEDALHAS.filter((m) => m.alcancado(p) >= m.meta).length;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
          Suas conquistas
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
          Estampa de medalhas
        </h1>
        <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
          Cada medalha conta uma parte da sua caminhada de fé.
        </p>
      </header>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <Sumario k="Medalhas" v={`${ganhas}/${MEDALHAS.length}`} emoji="🏅" tone="gold" />
        <Sumario k="XP total" v={String(p.xp)} emoji="⭐" tone="leaf" />
        <Sumario k="Lírios" v={String(p.lirios)} emoji="🪷" tone="sky" />
      </section>

      <section className="mt-8">
        <h3 className="font-display text-xl font-extrabold text-[color:var(--habit-deep)]">Galeria</h3>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MEDALHAS.map((m) => {
            const v = m.alcancado(p);
            const ganha = v >= m.meta;
            return (
              <li key={m.id}>
                <Medalha m={m} valor={v} ganha={ganha} />
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

function Sumario({ k, v, emoji, tone }: { k: string; v: string; emoji: string; tone: "gold" | "leaf" | "sky" }) {
  const cls =
    tone === "gold" ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
    : tone === "leaf" ? "bg-gradient-leaf text-[color:var(--lily)] shadow-pop"
    : "bg-[color:var(--sky)] text-[color:var(--habit-deep)] shadow-pop";
  return (
    <div className={"rounded-2xl border-[3px] border-[color:var(--habit-deep)] p-3 text-center " + cls}>
      <p className="text-xl">{emoji}</p>
      <p className="mt-0.5 font-display text-lg font-extrabold leading-none">{v}</p>
      <p className="mt-0.5 text-[9px] font-black uppercase tracking-wider opacity-80">{k}</p>
    </div>
  );
}

function Medalha({ m, valor, ganha }: { m: Medalha; valor: number; ganha: boolean }) {
  const tone =
    m.cor === "gold" ? "bg-gradient-gold text-[color:var(--habit-deep)]"
    : m.cor === "leaf" ? "bg-gradient-leaf text-[color:var(--lily)]"
    : m.cor === "habit" ? "bg-gradient-habit text-[color:var(--lily)]"
    : "bg-[color:var(--sky)] text-[color:var(--habit-deep)]";
  return (
    <div className="flex h-full flex-col items-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 text-center shadow-pop">
      <div className={"relative flex h-16 w-16 items-center justify-center rounded-full text-3xl ring-4 ring-[color:var(--gold)]/30 " + tone + (ganha ? "" : " grayscale")}>
        <span>{m.emoji}</span>
        {!ganha && (
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--habit-deep)] text-[10px] text-[color:var(--lily)]">🔒</span>
        )}
      </div>
      <p className="mt-2 font-display text-sm font-extrabold leading-tight text-[color:var(--habit-deep)]">{m.nome}</p>
      <p className="mt-0.5 text-[10px] font-semibold leading-snug text-[color:var(--muted-foreground)]">{m.desc}</p>
      <div className="mt-2 w-full">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--habit-deep)]/10">
          <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${Math.min(100, (valor / m.meta) * 100)}%` }} />
        </div>
        <p className="mt-1 text-[10px] font-extrabold text-[color:var(--habit)]">{valor}/{m.meta}</p>
      </div>
    </div>
  );
}
