import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/painel/")({
  head: () => ({
    meta: [{ title: "Início — Painel do Catequista" }],
  }),
  component: PainelHome,
});

const TURMA = {
  nome: "Pré‑catequese · Turma do Frei Antônio",
  encontro: "Sábados · 14h às 15h30",
  proximoTema: "Quem é Jesus? — A família de Nazaré",
  proxima: "Sábado, 28 de junho",
  presentes: 12,
  total: 14,
};

const ALUNOS = [
  { nome: "Maria Eduarda Silva", xp: 35, sequencia: 3, ultima: "Quiz: A família de Jesus", status: "ativa" as const },
  { nome: "João Pedro Almeida", xp: 50, sequencia: 5, ultima: "Lição: Nasceu em Belém", status: "ativa" as const },
  { nome: "Ana Clara Rocha", xp: 20, sequencia: 1, ultima: "Sinal da Cruz", status: "ativa" as const },
  { nome: "Lucas Pereira", xp: 10, sequencia: 0, ultima: "—", status: "pendente" as const },
  { nome: "Sofia Mendes", xp: 45, sequencia: 4, ultima: "Vídeo: Nasceu em Belém", status: "ativa" as const },
];

function PainelHome() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      {/* Cabeçalho com saudação */}
      <header className="flex items-start gap-3">
        <Link
          to="/"
          aria-label="Voltar"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
            Paz e Bem, catequista 🙏
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
            Olá, Tia Joana!
          </h1>
          <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
            Tudo pronto para o próximo encontro com a sua turminha?
          </p>
        </div>
      </header>

      {/* Card do próximo encontro */}
      <section className="mt-6 overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          Próximo encontro
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight">{TURMA.proximoTema}</h2>
        <p className="mt-1 text-[12px] font-bold text-[color:var(--lily)]/90">
          {TURMA.proxima} · {TURMA.encontro}
        </p>
        <div className="mt-4 flex gap-2">
          <button className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-gradient-gold text-[12px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop">
            ▶ Abrir roteiro
          </button>
          <button className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border-2 border-[color:var(--lily)]/40 bg-white/10 text-[12px] font-black uppercase tracking-wider text-[color:var(--lily)]">
            ✅ Fazer chamada
          </button>
        </div>
      </section>

      {/* Métricas rápidas */}
      <section className="mt-6 grid grid-cols-3 gap-3">
        <Stat k="Turma" v={TURMA.nome.split("·")[0].trim()} emoji="🎒" />
        <Stat k="Inscritos" v={`${TURMA.total}`} emoji="👨‍👩‍👧" />
        <Stat k="Presença" v={`${TURMA.presentes}/${TURMA.total}`} emoji="✅" />
      </section>

      {/* Atalhos */}
      <section className="mt-6 grid grid-cols-2 gap-3">
        <Atalho emoji="📝" titulo="Nova atividade" desc="Criar lição, quiz ou missão" tone="gold" />
        <Atalho emoji="📣" titulo="Mandar recado" desc="Para a família dos catequizandos" tone="leaf" />
        <Atalho emoji="📚" titulo="Biblioteca" desc="Roteiros e materiais da paróquia" tone="habit" />
        <Atalho emoji="📊" titulo="Relatórios" desc="Presença, XP e progresso" tone="sky" />
      </section>

      {/* Lista dos catequizandos com progresso */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-xl font-extrabold text-[color:var(--habit-deep)]">Seus catequizandos</h3>
          <Link to="/painel/turma" className="text-[11px] font-black uppercase tracking-wider text-[color:var(--habit)]">
            Ver todos →
          </Link>
        </div>
        <ul className="mt-3 grid gap-2.5">
          {ALUNOS.map((a) => (
            <li key={a.nome}>
              <div className="flex items-center gap-3 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 shadow-pop">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold text-base font-black text-[color:var(--habit-deep)] shadow-gold-pop">
                  {a.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-extrabold text-[color:var(--habit-deep)]">{a.nome}</p>
                  <p className="truncate text-[11px] font-semibold text-[color:var(--muted-foreground)]">
                    Última atividade: {a.ultima}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="rounded-full bg-[color:var(--gold-soft)] px-2 py-0.5 text-[10px] font-black text-[color:var(--habit-deep)]">⭐ {a.xp}</span>
                  <span className="rounded-full bg-[color:var(--leaf)]/15 px-2 py-0.5 text-[10px] font-black text-[color:var(--leaf)]">🔥 {a.sequencia}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Stat({ k, v, emoji }: { k: string; v: string; emoji: string }) {
  return (
    <div className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 text-center shadow-pop">
      <p className="text-lg">{emoji}</p>
      <p className="mt-0.5 font-display text-base font-extrabold leading-none text-[color:var(--habit-deep)]">{v}</p>
      <p className="mt-0.5 text-[9px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">{k}</p>
    </div>
  );
}

function Atalho({ emoji, titulo, desc, tone }: { emoji: string; titulo: string; desc: string; tone: "gold" | "leaf" | "habit" | "sky" }) {
  const cls =
    tone === "gold" ? "bg-gradient-gold text-[color:var(--habit-deep)]"
    : tone === "leaf" ? "bg-gradient-leaf text-[color:var(--lily)]"
    : tone === "habit" ? "bg-gradient-habit text-[color:var(--lily)]"
    : "bg-[color:var(--sky)] text-[color:var(--habit-deep)]";
  return (
    <button className={"flex items-start gap-3 rounded-2xl border-[3px] border-[color:var(--habit-deep)] p-3 text-left shadow-pop transition hover:-translate-y-0.5 " + cls}>
      <span className="text-2xl">{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-extrabold leading-tight">{titulo}</span>
        <span className="mt-0.5 block text-[10px] font-bold opacity-90">{desc}</span>
      </span>
    </button>
  );
}