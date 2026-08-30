import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CRISMA_TRAIL_DEFAULT,
  comunidadeNome,
  getCrismaTrail,
  liberarAtividade,
  recolherAtividade,
  resetCrismaTrail,
  setCrismaTrail,
  useStore,
  type CrismaUnidade,
} from "@/lib/store";

export const Route = createFileRoute("/painel/atividades")({
  head: () => ({ meta: [{ title: "Atividades — Painel do Catequista" }, { name: "description", content: "Libere atividades da trilha para a turma e defina prazos de conclusão." }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AtividadesPage,
});

function AtividadesPage() {
  const session = useStore((s) => s.session);
  const catequistas = useStore((s) => s.catequistas);
  const alunos = useStore((s) => s.alunos);
  const liberacoesAll = useStore((s) => s.liberacoes);
  const crismaTrail = useStore((s) => s.crismaTrail);
  const [editando, setEditando] = useState(false);

  const isAdmin = session?.kind === "admin";
  const cat = !isAdmin && session?.kind === "catequista"
    ? catequistas.find((c) => c.id === session.id) ?? null
    : null;

  const trail = crismaTrail ?? CRISMA_TRAIL_DEFAULT;

  // Catequista: vê alunos da sua turma de Crisma; somente turma de crisma usa liberação.
  const turmaCrisma = useMemo(
    () =>
      cat
        ? alunos.filter(
            (a) =>
              a.status === "approved" &&
              a.etapa === "crisma" &&
              a.catequistaId === cat.id,
          )
        : [],
    [alunos, cat],
  );

  const liberacoes = cat ? liberacoesAll[cat.id] ?? {} : {};

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
            {isAdmin ? "Coordenação · Trilha de Crisma" : "Crisma · Liberar atividades"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
            {isAdmin ? "Editar trilha" : "Liberar atividades"}
          </h1>
          <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
            {isAdmin
              ? "Renomeie as atividades das 4 unidades de Crisma. As mudanças aparecem para todas as turmas."
              : cat
              ? `Turma ${comunidadeNome(cat.comunidade)} · ${turmaCrisma.length} catequizando(s) de Crisma.`
              : "Você não está vinculado(a) a uma turma."}
          </p>
        </div>
        {isAdmin && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setEditando((v) => !v)}
              className={
                "rounded-2xl px-3 py-2 text-[11px] font-black uppercase tracking-wider shadow-pop " +
                (editando
                  ? "bg-gradient-leaf text-[color:var(--lily)]"
                  : "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop")
              }
            >
              {editando ? "✓ Concluir" : "✎ Editar"}
            </button>
            <button
              onClick={() => {
                if (confirm("Restaurar a trilha de Crisma para o padrão?")) resetCrismaTrail();
              }}
              className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3 py-2 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop"
            >
              ↺ Restaurar
            </button>
          </div>
        )}
      </header>

      {!isAdmin && !cat && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-5 text-center text-[12px] font-bold text-[color:var(--muted-foreground)]">
          Aguarde a aprovação da sua conta para acessar as atividades da turma.
        </p>
      )}

      {!isAdmin && cat && turmaCrisma.length === 0 && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-5 text-center text-[12px] font-bold text-[color:var(--muted-foreground)]">
          Nenhum catequizando de Crisma alocado na sua turma ainda. As liberações valem para todos os alunos
          de Crisma da comunidade <strong>{comunidadeNome(cat.comunidade)}</strong>.
        </p>
      )}

      <div className="mt-6 grid gap-5">
        {trail.map((unidade) => (
          <UnidadeCard
            key={unidade.id}
            unidade={unidade}
            editando={isAdmin && editando}
            onSave={(novo) => {
              const next = trail.map((u) => (u.id === unidade.id ? novo : u));
              setCrismaTrail(next);
            }}
            podeLiberar={!!cat}
            liberacoes={liberacoes}
            onLiberar={(nodeId, dias) => {
              if (!cat) return;
              liberarAtividade(cat.id, nodeId, dias);
            }}
            onRecolher={(nodeId) => {
              if (!cat) return;
              recolherAtividade(cat.id, nodeId);
            }}
          />
        ))}
      </div>
    </main>
  );
}

function UnidadeCard({
  unidade,
  editando,
  onSave,
  podeLiberar,
  liberacoes,
  onLiberar,
  onRecolher,
}: {
  unidade: CrismaUnidade;
  editando: boolean;
  onSave: (novo: CrismaUnidade) => void;
  podeLiberar: boolean;
  liberacoes: Record<string, { releasedAt: number; deadline: number }>;
  onLiberar: (nodeId: string, dias: number) => void;
  onRecolher: (nodeId: string) => void;
}) {
  const banner =
    unidade.cor === "gold"
      ? "bg-gradient-gold text-[color:var(--habit-deep)]"
      : unidade.cor === "leaf"
      ? "bg-gradient-leaf text-[color:var(--lily)]"
      : unidade.cor === "habit"
      ? "bg-gradient-habit text-[color:var(--lily)]"
      : "bg-[color:var(--sky)] text-[color:var(--habit-deep)]";

  function updateAtividade(id: string, titulo: string) {
    onSave({
      ...unidade,
      atividades: unidade.atividades.map((a) => (a.id === id ? { ...a, titulo } : a)),
    });
  }

  return (
    <article className="overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] shadow-pop">
      <header className={"px-5 py-4 " + banner}>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] opacity-80">
          Unidade {unidade.numero}
        </p>
        {editando ? (
          <input
            value={unidade.titulo}
            onChange={(e) => onSave({ ...unidade, titulo: e.target.value })}
            className="mt-1 w-full rounded-xl border-2 border-white/40 bg-white/20 px-2 py-1 font-display text-xl font-extrabold outline-none focus:border-white"
          />
        ) : (
          <h2 className="mt-1 font-display text-xl font-extrabold leading-tight">{unidade.titulo}</h2>
        )}
        <p className="mt-0.5 text-[12px] font-bold opacity-90">{unidade.subtitulo}</p>
      </header>

      <ul className="divide-y divide-[color:var(--habit-deep)]/10">
        {unidade.atividades.map((a, i) => {
          const lib = liberacoes[a.id];
          return (
            <li key={a.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--habit-deep)]/8 text-sm font-black text-[color:var(--habit-deep)]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                {editando ? (
                  <input
                    value={a.titulo}
                    onChange={(e) => updateAtividade(a.id, e.target.value)}
                    className="w-full rounded-xl border-2 border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3 py-2 text-[13px] font-semibold text-[color:var(--habit-deep)] outline-none focus:border-[color:var(--gold)]"
                  />
                ) : (
                  <p className="text-[13px] font-extrabold leading-snug text-[color:var(--habit-deep)]">
                    {a.titulo}
                  </p>
                )}
                {lib && (
                  <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit)]">
                    ⏳ até {new Date(lib.deadline).toLocaleDateString("pt-BR")}{" "}
                    {lib.deadline < Date.now() && (
                      <span className="text-[color:var(--destructive)]">· vencido</span>
                    )}
                  </p>
                )}
              </div>
              {podeLiberar && !editando && (
                <LiberarControls
                  liberada={!!lib}
                  onLiberar={(d) => onLiberar(a.id, d)}
                  onRecolher={() => onRecolher(a.id)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function LiberarControls({
  liberada,
  onLiberar,
  onRecolher,
}: {
  liberada: boolean;
  onLiberar: (dias: number) => void;
  onRecolher: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [dias, setDias] = useState(7);

  if (liberada && !open) {
    return (
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setOpen(true)}
          className="h-9 rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop"
        >
          Reagendar
        </button>
        <button
          onClick={onRecolher}
          className="h-9 rounded-xl border-[3px] border-[color:var(--destructive)]/40 bg-[color:var(--card)] px-3 text-[10px] font-black uppercase tracking-wider text-[color:var(--destructive)] shadow-pop"
        >
          Recolher
        </button>
      </div>
    );
  }

  if (!liberada && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="h-9 shrink-0 rounded-xl bg-gradient-gold px-3 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop"
      >
        Liberar
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] p-1.5 shadow-pop">
      <label className="flex items-center gap-1 px-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
        Prazo
        <select
          value={dias}
          onChange={(e) => setDias(Number(e.target.value))}
          className="rounded-md border border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-1.5 py-1 text-[11px] font-extrabold"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <option key={d} value={d}>
              {d}d
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={() => {
          onLiberar(dias);
          setOpen(false);
        }}
        className="h-8 rounded-lg bg-gradient-leaf px-3 text-[10px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop"
      >
        ✓ OK
      </button>
      <button
        onClick={() => setOpen(false)}
        className="h-8 rounded-lg border-2 border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-2 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]"
      >
        ✕
      </button>
    </div>
  );
}