import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  useStore,
  aprovarAluno,
  aprovarCatequista,
  reprovarAluno,
  reprovarCatequista,
  type Aluno,
  type Catequista,
} from "@/lib/store";

export const Route = createFileRoute("/aprovacoes")({
  head: () => ({
    meta: [{ title: "Aprovações — Catequizando Digital" }],
  }),
  component: AprovacoesPage,
});

const ETAPA_LABEL: Record<string, string> = {
  "pre-catequese": "Pré-catequese (7–9)",
  "primeira-comunhao": "Primeira Comunhão (10–13)",
  crisma: "Crisma (14–17)",
};

function AprovacoesPage() {
  const navigate = useNavigate();
  const session = useStore((s) => s.session);
  const alunos = useStore((s) => s.alunos);
  const catequistas = useStore((s) => s.catequistas);

  useEffect(() => {
    if (session?.kind !== "admin") navigate({ to: "/login" });
  }, [session, navigate]);

  if (session?.kind !== "admin") return null;

  const alunosPend = alunos.filter((a) => a.status === "pending");
  const cateqPend = catequistas.filter((c) => c.status === "pending");

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-sky pb-16">
      <div className="pointer-events-none absolute inset-0 texture-cream opacity-70" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center gap-3 px-5 pt-5">
        <Link
          to="/painel"
          aria-label="Voltar ao painel"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
            Coordenação
          </p>
          <h1 className="font-display text-xl font-extrabold leading-none text-[color:var(--habit-deep)]">
            Aprovações pendentes
          </h1>
        </div>
        <span className="inline-flex h-9 items-center gap-1 rounded-full bg-gradient-gold px-3 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop">
          {alunosPend.length + cateqPend.length} pendente(s)
        </span>
      </header>

      <section className="relative z-10 mx-auto mt-6 max-w-3xl px-5">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">
          Catequizandos ({alunosPend.length})
        </h2>
        {alunosPend.length === 0 ? (
          <Vazio texto="Nenhuma matrícula aguardando aprovação." />
        ) : (
          <ul className="mt-3 grid gap-3">
            {alunosPend.map((a) => (
              <AlunoCard key={a.id} aluno={a} />
            ))}
          </ul>
        )}

        <h2 className="mt-8 font-display text-lg font-extrabold text-[color:var(--habit-deep)]">
          Catequistas ({cateqPend.length})
        </h2>
        {cateqPend.length === 0 ? (
          <Vazio texto="Nenhuma conta de catequista para aprovar." />
        ) : (
          <ul className="mt-3 grid gap-3">
            {cateqPend.map((c) => (
              <CatequistaCard key={c.id} c={c} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="mt-3 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-5 text-center text-[12px] font-bold text-[color:var(--muted-foreground)]">
      {texto}
    </div>
  );
}

function AlunoCard({ aluno }: { aluno: Aluno }) {
  return (
    <li className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-4 shadow-pop">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-sm font-black text-[color:var(--habit-deep)] shadow-gold-pop">
          {aluno.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">{aluno.nome}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--habit)]">
            {ETAPA_LABEL[aluno.etapa] ?? aluno.etapa}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
            Nasc.: {aluno.nascimento} · Responsável: {aluno.responsavel} · {aluno.telefone}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => reprovarAluno(aluno.id)}
          className="h-11 rounded-xl border-[3px] border-[color:var(--destructive)]/40 bg-[color:var(--card)] text-[12px] font-black uppercase tracking-wider text-[color:var(--destructive)] shadow-pop"
        >
          Recusar
        </button>
        <button
          onClick={() => aprovarAluno(aluno.id)}
          className="h-11 rounded-xl bg-gradient-leaf text-[12px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop"
        >
          ✓ Aprovar
        </button>
      </div>
    </li>
  );
}

function CatequistaCard({ c }: { c: Catequista }) {
  return (
    <li className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-4 shadow-pop">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-habit text-sm font-black text-[color:var(--lily)] shadow-pop">
          {c.foto ? <img src={c.foto} alt="" className="h-full w-full object-cover" /> : "✝️"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">{c.nome}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--habit)]">
            {c.email} · {c.telefone}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
            Comunidade: {c.comunidade ?? "—"} · Etapas: {c.etapas.map((e) => ETAPA_LABEL[e]?.split(" ")[0] ?? e).join(", ") || "—"}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => reprovarCatequista(c.id)}
          className="h-11 rounded-xl border-[3px] border-[color:var(--destructive)]/40 bg-[color:var(--card)] text-[12px] font-black uppercase tracking-wider text-[color:var(--destructive)] shadow-pop"
        >
          Recusar
        </button>
        <button
          onClick={() => aprovarCatequista(c.id)}
          className="h-11 rounded-xl bg-gradient-leaf text-[12px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop"
        >
          ✓ Aprovar
        </button>
      </div>
    </li>
  );
}
