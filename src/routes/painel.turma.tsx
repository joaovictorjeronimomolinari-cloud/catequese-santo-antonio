import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRightLeft, X, Check } from "lucide-react";
import { comunidadeNome, moverAluno, useStore, type Aluno, type Catequista } from "@/lib/store";

export const Route = createFileRoute("/painel/turma")({
  head: () => ({
    meta: [
      { title: "Turma — Painel do Catequista" },
      {
        name: "description",
        content:
          "Gestão da turma de catequese: visualize os catequizandos aprovados, acompanhe a comunidade e mova alunos entre turmas.",
      },
      { property: "og:title", content: "Turma — Painel do Catequista" },
      {
        property: "og:description",
        content:
          "Gestão da turma de catequese: visualize os catequizandos aprovados, acompanhe a comunidade e mova alunos entre turmas.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
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

  const [movendo, setMovendo] = useState<Aluno | null>(null);
  const catequistasAprovados = catequistas.filter((c) => c.status === "approved");

  function catNome(id?: string | null) {
    if (!id) return "Sem turma";
    const c = catequistas.find((x) => x.id === id);
    return c ? c.apelido ?? c.nome.split(" ")[0] : "Sem turma";
  }

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
                  {ETAPA_LABEL[a.etapa] ?? a.etapa} · {comunidadeNome(a.comunidade)} · Turma: {catNome(a.catequistaId)}
                </p>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setMovendo(a)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3 py-2 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop transition hover:-translate-y-0.5"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" strokeWidth={2.6} />
                  Mover
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAdmin && movendo && (
        <MoverAlunoModal
          aluno={movendo}
          catequistas={catequistasAprovados}
          onClose={() => setMovendo(null)}
        />
      )}
    </main>
  );
}

function MoverAlunoModal({
  aluno,
  catequistas,
  onClose,
}: {
  aluno: Aluno;
  catequistas: Catequista[];
  onClose: () => void;
}) {
  const [selecionado, setSelecionado] = useState<string | null>(aluno.catequistaId ?? null);

  // Filtra catequistas que dão a etapa do aluno
  const compativeis = catequistas.filter((c) => c.etapas.includes(aluno.etapa));
  const outros = catequistas.filter((c) => !c.etapas.includes(aluno.etapa));

  function salvar() {
    moverAluno(aluno.id, selecionado);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-3xl border-[3px] border-[color:var(--habit-deep)] bg-[color:var(--lily)] shadow-pop sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b-[3px] border-[color:var(--habit-deep)]/10 bg-gradient-habit px-5 py-4 text-[color:var(--lily)]">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
              Mover de turma
            </p>
            <h2 className="mt-1 truncate font-display text-lg font-extrabold">{aluno.nome}</h2>
            <p className="text-[11px] font-bold text-[color:var(--lily)]/85">
              {ETAPA_LABEL[aluno.etapa] ?? aluno.etapa} · {comunidadeNome(aluno.comunidade)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-[color:var(--lily)]"
          >
            <X className="h-4 w-4" strokeWidth={2.8} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          <p className="text-[11px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">
            Selecionar catequista
          </p>

          <button
            type="button"
            onClick={() => setSelecionado(null)}
            className={
              "mt-2 flex w-full items-center gap-3 rounded-2xl border-[3px] p-3 text-left transition " +
              (selecionado === null
                ? "border-[color:var(--habit-deep)] bg-[color:var(--gold-soft)]"
                : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)]")
            }
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--habit-deep)]/10 text-[color:var(--habit-deep)]">
              <X className="h-4 w-4" strokeWidth={2.6} />
            </span>
            <span className="flex-1">
              <span className="block font-display text-sm font-extrabold text-[color:var(--habit-deep)]">
                Sem turma
              </span>
              <span className="block text-[11px] font-semibold text-[color:var(--muted-foreground)]">
                Remover o aluno da turma atual
              </span>
            </span>
          </button>

          {compativeis.length > 0 && (
            <>
              <p className="mt-4 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit)]">
                Catequistas da etapa
              </p>
              <ul className="mt-2 grid gap-2">
                {compativeis.map((c) => (
                  <CatOption
                    key={c.id}
                    c={c}
                    ativo={selecionado === c.id}
                    onClick={() => setSelecionado(c.id)}
                  />
                ))}
              </ul>
            </>
          )}

          {outros.length > 0 && (
            <>
              <p className="mt-4 text-[11px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">
                Outras etapas
              </p>
              <ul className="mt-2 grid gap-2">
                {outros.map((c) => (
                  <CatOption
                    key={c.id}
                    c={c}
                    ativo={selecionado === c.id}
                    onClick={() => setSelecionado(c.id)}
                  />
                ))}
              </ul>
            </>
          )}

          {catequistas.length === 0 && (
            <p className="mt-4 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-4 text-center text-[12px] font-bold text-[color:var(--muted-foreground)]">
              Nenhum catequista aprovado.
            </p>
          )}
        </div>

        <div className="grid grid-cols-[1fr_1.4fr] gap-2 border-t-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-4">
          <button
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[12px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-leaf text-[12px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop"
          >
            <Check className="h-4 w-4" strokeWidth={2.8} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function CatOption({
  c,
  ativo,
  onClick,
}: {
  c: Catequista;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={
          "flex w-full items-center gap-3 rounded-2xl border-[3px] p-3 text-left transition " +
          (ativo
            ? "border-[color:var(--habit-deep)] bg-[color:var(--gold-soft)]"
            : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] hover:-translate-y-0.5")
        }
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-habit text-[color:var(--lily)]">
          {c.foto ? (
            <img src={c.foto} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-black">
              {c.nome.split(" ").map((x) => x[0]).slice(0, 2).join("")}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-sm font-extrabold text-[color:var(--habit-deep)]">
            {c.nome}
          </span>
          <span className="block truncate text-[11px] font-semibold text-[color:var(--muted-foreground)]">
            {comunidadeNome(c.comunidade ?? null)} · {c.etapas.map((e) => ETAPA_LABEL[e] ?? e).join(", ")}
          </span>
        </span>
        {ativo && <Check className="h-5 w-5 shrink-0 text-[color:var(--habit-deep)]" strokeWidth={2.8} />}
      </button>
    </li>
  );
}
