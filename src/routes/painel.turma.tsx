import { createFileRoute } from "@tanstack/react-router";
import { comunidadeNome, useStore } from "@/lib/store";

export const Route = createFileRoute("/painel/turma")({
  head: () => ({ meta: [{ title: "Turma — Painel do Catequista" }] }),
  component: TurmaPage,
});

const ETAPA_LABEL: Record<string, string> = {
  "pre-catequese": "Pré-catequese",
  "primeira-comunhao": "Primeira Comunhão",
  crisma: "Crisma",
};

function TurmaPage() {
  const session = useStore((s) => s.session);
  const allAlunos = useStore((s) => s.alunos);
  const catequistas = useStore((s) => s.catequistas);

  const isAdmin = session?.kind === "admin";
  const cat =
    !isAdmin && session?.kind === "catequista"
      ? catequistas.find((c) => c.id === session.id) ?? null
      : null;

  const alunos = allAlunos.filter((a) => {
    if (a.status !== "approved") return false;
    if (isAdmin) return true;
    return cat ? a.catequistaId === cat.id : false;
  });

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
          {isAdmin ? "Coordenação" : "Sua turma"}
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
          {isAdmin ? "Turmas ativas" : `${comunidadeNome(cat?.comunidade)}`}
        </h1>
        <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
          {alunos.length} catequizando(s) {isAdmin ? "aprovado(s)" : "na sua turma"}.
        </p>
      </header>

      {alunos.length === 0 ? (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-5 text-center text-[12px] font-bold text-[color:var(--muted-foreground)]">
          Ainda não há catequizandos aprovados.
        </p>
      ) : (
        <ul className="mt-6 grid gap-2.5">
          {alunos.map((a) => (
            <li key={a.id} className="flex items-center gap-3 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 shadow-pop">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-sm font-black text-[color:var(--habit-deep)] shadow-gold-pop">
                {a.nome.split(" ").map((x) => x[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-extrabold text-[color:var(--habit-deep)]">{a.nome}</p>
                <p className="truncate text-[11px] font-semibold text-[color:var(--muted-foreground)]">
                  {ETAPA_LABEL[a.etapa] ?? a.etapa} · {comunidadeNome(a.comunidade)} · {a.telefone}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
