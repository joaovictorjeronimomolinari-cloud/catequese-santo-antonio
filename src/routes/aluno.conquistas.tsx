import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/aluno/conquistas")({
  head: () => ({
    meta: [{ title: "Conquistas — Catequizando Digital" }],
  }),
  component: ConquistasPage,
});

type Medalha = {
  id: string;
  nome: string;
  desc: string;
  emoji: string;
  cor: "gold" | "leaf" | "habit" | "sky";
  ganha: boolean;
  progresso?: { atual: number; meta: number };
};

const MEDALHAS: Medalha[] = [
  { id: "m1", nome: "Primeiros passos", desc: "Conclua sua primeira lição", emoji: "👣", cor: "gold", ganha: true },
  { id: "m2", nome: "Coração orante", desc: "Reze 7 dias seguidos", emoji: "❤️", cor: "leaf", ganha: false, progresso: { atual: 3, meta: 7 } },
  { id: "m3", nome: "Discípulo da Palavra", desc: "Complete 10 lições", emoji: "📖", cor: "habit", ganha: false, progresso: { atual: 2, meta: 10 } },
  { id: "m4", nome: "Amigo de Santo Antônio", desc: "Reze a oração a Santo Antônio", emoji: "🪷", cor: "sky", ganha: true },
  { id: "m5", nome: "Família reunida", desc: "Complete 3 missões em família", emoji: "🏡", cor: "leaf", ganha: false, progresso: { atual: 1, meta: 3 } },
  { id: "m6", nome: "Caçador de baús", desc: "Abra 5 baús do Frei", emoji: "🎁", cor: "gold", ganha: false, progresso: { atual: 0, meta: 5 } },
];

function ConquistasPage() {
  const ganhas = MEDALHAS.filter((m) => m.ganha).length;

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

      {/* Painel de resumo */}
      <section className="mt-5 grid grid-cols-3 gap-3">
        <Sumario k="Medalhas" v={`${ganhas}/${MEDALHAS.length}`} emoji="🏅" tone="gold" />
        <Sumario k="XP total" v="35" emoji="⭐" tone="leaf" />
        <Sumario k="Lírios" v="12" emoji="🪷" tone="sky" />
      </section>

      {/* Próxima recompensa */}
      <section className="mt-6 overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          Próxima recompensa
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold">Figurinha do Menino Jesus</h2>
        <p className="mt-1 text-[12px] font-bold text-[color:var(--lily)]/90">
          Faltam <strong className="text-[color:var(--gold-soft)]">15 XP</strong> — você consegue!
        </p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-[70%] rounded-full bg-gradient-gold" />
        </div>
      </section>

      {/* Grid de medalhas */}
      <section className="mt-8">
        <h3 className="font-display text-xl font-extrabold text-[color:var(--habit-deep)]">Galeria</h3>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MEDALHAS.map((m) => (
            <li key={m.id}>
              <Medalha m={m} />
            </li>
          ))}
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

function Medalha({ m }: { m: Medalha }) {
  const tone =
    m.cor === "gold" ? "bg-gradient-gold text-[color:var(--habit-deep)]"
    : m.cor === "leaf" ? "bg-gradient-leaf text-[color:var(--lily)]"
    : m.cor === "habit" ? "bg-gradient-habit text-[color:var(--lily)]"
    : "bg-[color:var(--sky)] text-[color:var(--habit-deep)]";
  return (
    <div className={"flex h-full flex-col items-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 text-center shadow-pop " + (m.ganha ? "" : "opacity-90")}>
      <div className={"relative flex h-16 w-16 items-center justify-center rounded-full text-3xl ring-4 ring-[color:var(--gold)]/30 " + tone + (m.ganha ? "" : " grayscale")}>
        <span>{m.emoji}</span>
        {!m.ganha && (
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--habit-deep)] text-[10px] text-[color:var(--lily)]">🔒</span>
        )}
      </div>
      <p className="mt-2 font-display text-sm font-extrabold leading-tight text-[color:var(--habit-deep)]">{m.nome}</p>
      <p className="mt-0.5 text-[10px] font-semibold leading-snug text-[color:var(--muted-foreground)]">{m.desc}</p>
      {m.progresso && (
        <div className="mt-2 w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--habit-deep)]/10">
            <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${(m.progresso.atual / m.progresso.meta) * 100}%` }} />
          </div>
          <p className="mt-1 text-[10px] font-extrabold text-[color:var(--habit)]">
            {m.progresso.atual}/{m.progresso.meta}
          </p>
        </div>
      )}
    </div>
  );
}