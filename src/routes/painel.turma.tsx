import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/painel/turma")({
  head: () => ({ meta: [{ title: "Turma — Painel do Catequista" }] }),
  component: TurmaPage,
});

const ALUNOS = [
  { nome: "Maria Eduarda Silva", idade: 8, resp: "Carla Silva", whats: "(35) 9 9999‑0000", xp: 35 },
  { nome: "João Pedro Almeida", idade: 9, resp: "Roberto Almeida", whats: "(35) 9 9888‑1111", xp: 50 },
  { nome: "Ana Clara Rocha", idade: 7, resp: "Patrícia Rocha", whats: "(35) 9 9777‑2222", xp: 20 },
  { nome: "Lucas Pereira", idade: 8, resp: "Diego Pereira", whats: "(35) 9 9666‑3333", xp: 10 },
  { nome: "Sofia Mendes", idade: 9, resp: "Renata Mendes", whats: "(35) 9 9555‑4444", xp: 45 },
];

function TurmaPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">Turma</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
          Pré‑catequese · Frei Antônio
        </h1>
        <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
          {ALUNOS.length} catequizandos · sábados às 14h
        </p>
      </header>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <Mini k="Presença média" v="86%" emoji="✅" />
        <Mini k="XP da turma" v="160" emoji="⭐" />
        <Mini k="Missões feitas" v="9" emoji="🏆" />
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Catequizandos</h2>
        <ul className="mt-3 grid gap-2.5">
          {ALUNOS.map((a) => (
            <li key={a.nome} className="flex items-center gap-3 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 shadow-pop">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-sm font-black text-[color:var(--habit-deep)] shadow-gold-pop">
                {a.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-extrabold text-[color:var(--habit-deep)]">{a.nome}</p>
                <p className="truncate text-[11px] font-semibold text-[color:var(--muted-foreground)]">
                  {a.idade} anos · {a.resp} · {a.whats}
                </p>
              </div>
              <span className="rounded-full bg-[color:var(--gold-soft)] px-2 py-0.5 text-[10px] font-black text-[color:var(--habit-deep)]">
                ⭐ {a.xp}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Mini({ k, v, emoji }: { k: string; v: string; emoji: string }) {
  return (
    <div className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 text-center shadow-pop">
      <p className="text-lg">{emoji}</p>
      <p className="mt-0.5 font-display text-base font-extrabold leading-none text-[color:var(--habit-deep)]">{v}</p>
      <p className="mt-0.5 text-[9px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">{k}</p>
    </div>
  );
}