import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  X,
  Inbox,
  GraduationCap,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
} from "lucide-react";
import {
  useStore,
  aprovarAluno,
  aprovarCatequista,
  reprovarAluno,
  reprovarCatequista,
  comunidadeNome,
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
  "pre-catequese": "Pré-catequese · 7 a 9 anos",
  "primeira-comunhao": "Primeira Comunhão · 10 a 13 anos",
  crisma: "Crisma · 14 a 17 anos",
};

type Filtro = "todos" | "alunos" | "catequistas";

function AprovacoesPage() {
  const navigate = useNavigate();
  const session = useStore((s) => s.session);
  const alunos = useStore((s) => s.alunos);
  const catequistas = useStore((s) => s.catequistas);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(() => {
    if (session?.kind !== "admin") navigate({ to: "/login" });
  }, [session, navigate]);

  if (session?.kind !== "admin") return null;

  const alunosPend = useMemo(
    () => alunos.filter((a) => a.status === "pending").sort((a, b) => b.criadoEm - a.criadoEm),
    [alunos],
  );
  const cateqPend = useMemo(
    () => catequistas.filter((c) => c.status === "pending").sort((a, b) => b.criadoEm - a.criadoEm),
    [catequistas],
  );
  const totalPend = alunosPend.length + cateqPend.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-sky pb-20">
      <div className="pointer-events-none absolute inset-0 texture-cream opacity-70" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center gap-3 px-5 pt-6">
        <Link
          to="/painel"
          aria-label="Voltar ao painel"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop transition hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.6} />
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
            Coordenação
          </p>
          <h1 className="font-display text-xl font-extrabold leading-none text-[color:var(--habit-deep)]">
            Aprovações
          </h1>
        </div>
      </header>

      {/* Resumo */}
      <section className="relative z-10 mx-auto mt-5 max-w-3xl px-5">
        <div className="overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-[color:var(--lily)] ring-2 ring-white/30">
              <Inbox className="h-7 w-7" strokeWidth={2.4} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
                Caixa de entrada
              </p>
              <h2 className="font-display text-2xl font-extrabold leading-tight">
                {totalPend} {totalPend === 1 ? "cadastro" : "cadastros"} pendente{totalPend === 1 ? "" : "s"}
              </h2>
              <p className="mt-0.5 text-[12px] font-bold text-[color:var(--lily)]/85">
                Revise os pedidos abaixo e aprove para liberar o acesso ao app.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[color:var(--habit-deep)]">
            <Contador Icon={GraduationCap} label="Catequizandos" valor={alunosPend.length} />
            <Contador Icon={UserPlus} label="Catequistas" valor={cateqPend.length} />
          </div>
        </div>

        {/* Filtro */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] p-1 shadow-pop">
          {(
            [
              { id: "todos" as const, label: `Todos · ${totalPend}` },
              { id: "alunos" as const, label: `Catequizandos · ${alunosPend.length}` },
              { id: "catequistas" as const, label: `Catequistas · ${cateqPend.length}` },
            ]
          ).map((opt) => {
            const ativo = filtro === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFiltro(opt.id)}
                className={
                  "h-10 truncate rounded-xl px-2 text-[11px] font-black uppercase tracking-wider transition " +
                  (ativo
                    ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
                    : "text-[color:var(--habit-deep)]/70 hover:text-[color:var(--habit-deep)]")
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-6 grid max-w-3xl gap-7 px-5">
        {(filtro === "todos" || filtro === "alunos") && (
          <div>
            <SectionTitle Icon={GraduationCap} title="Catequizandos" count={alunosPend.length} />
            {alunosPend.length === 0 ? (
              <Vazio texto="Nenhuma matrícula aguardando aprovação." />
            ) : (
              <ul className="mt-3 grid gap-3">
                {alunosPend.map((a) => (
                  <AlunoCard key={a.id} aluno={a} />
                ))}
              </ul>
            )}
          </div>
        )}

        {(filtro === "todos" || filtro === "catequistas") && (
          <div>
            <SectionTitle Icon={UserPlus} title="Catequistas" count={cateqPend.length} />
            {cateqPend.length === 0 ? (
              <Vazio texto="Nenhuma conta de catequista para aprovar." />
            ) : (
              <ul className="mt-3 grid gap-3">
                {cateqPend.map((c) => (
                  <CatequistaCard key={c.id} c={c} />
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function SectionTitle({
  Icon,
  title,
  count,
}: {
  Icon: typeof Inbox;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--habit-deep)]/8 text-[color:var(--habit-deep)]">
        <Icon className="h-4 w-4" strokeWidth={2.6} />
      </span>
      <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">{title}</h2>
      <span className="ml-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[color:var(--habit-deep)]/10 px-2 text-[10px] font-black text-[color:var(--habit-deep)]">
        {count}
      </span>
    </div>
  );
}

function Contador({ Icon, label, valor }: { Icon: typeof Inbox; label: string; valor: number }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25 text-[color:var(--lily)]">
        <Icon className="h-4 w-4" strokeWidth={2.6} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-base font-extrabold leading-none text-[color:var(--lily)]">{valor}</p>
        <p className="text-[9px] font-black uppercase tracking-wider text-[color:var(--lily)]/80">{label}</p>
      </div>
    </div>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="mt-3 flex flex-col items-center rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-6 text-center">
      <Inbox className="h-7 w-7 text-[color:var(--muted-foreground)]" strokeWidth={2.2} />
      <p className="mt-2 text-[12px] font-bold text-[color:var(--muted-foreground)]">{texto}</p>
    </div>
  );
}

function AlunoCard({ aluno }: { aluno: Aluno }) {
  const dt = aluno.criadoEm ? new Date(aluno.criadoEm).toLocaleDateString("pt-BR") : "—";
  return (
    <li className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-4 shadow-pop transition hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-sm font-black text-[color:var(--habit-deep)] shadow-gold-pop">
          {aluno.nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">{aluno.nome}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--habit)]">
            {ETAPA_LABEL[aluno.etapa] ?? aluno.etapa}
          </p>
        </div>
      </div>
      <ul className="mt-3 grid gap-1.5 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
        <InfoLine Icon={MapPin}>{comunidadeNome(aluno.comunidade)}</InfoLine>
        <InfoLine Icon={UserPlus}>{aluno.responsavel}</InfoLine>
        <InfoLine Icon={Phone}>{aluno.telefone}</InfoLine>
        <InfoLine Icon={CalendarDays}>Solicitado em {dt}</InfoLine>
      </ul>
      <CardActions
        onApprove={() => aprovarAluno(aluno.id)}
        onReject={() => reprovarAluno(aluno.id)}
      />
    </li>
  );
}

function CatequistaCard({ c }: { c: Catequista }) {
  const dt = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString("pt-BR") : "—";
  return (
    <li className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-4 shadow-pop transition hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-habit text-[color:var(--lily)] shadow-pop">
          {c.foto ? (
            <img src={c.foto} alt="" className="h-full w-full object-cover" />
          ) : (
            <UserPlus className="h-5 w-5" strokeWidth={2.4} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">{c.nome}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--habit)]">
            {c.etapas.map((e) => ETAPA_LABEL[e]?.split(" ")[0] ?? e).join(" · ") || "Etapas não definidas"}
          </p>
        </div>
      </div>
      <ul className="mt-3 grid gap-1.5 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
        <InfoLine Icon={MapPin}>{comunidadeNome(c.comunidade ?? null)}</InfoLine>
        {c.email && <InfoLine Icon={Mail}>{c.email}</InfoLine>}
        {c.telefone && <InfoLine Icon={Phone}>{c.telefone}</InfoLine>}
        <InfoLine Icon={CalendarDays}>Solicitado em {dt}</InfoLine>
      </ul>
      <CardActions
        onApprove={() => aprovarCatequista(c.id)}
        onReject={() => reprovarCatequista(c.id)}
      />
    </li>
  );
}

function InfoLine({ Icon, children }: { Icon: typeof Phone; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--habit)]" strokeWidth={2.4} />
      <span className="truncate">{children}</span>
    </li>
  );
}

function CardActions({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) {
  return (
    <div className="mt-4 grid grid-cols-[1fr_1.4fr] gap-2">
      <button
        onClick={onReject}
        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border-[3px] border-[color:var(--destructive)]/40 bg-[color:var(--card)] text-[12px] font-black uppercase tracking-wider text-[color:var(--destructive)] shadow-pop transition hover:-translate-y-0.5"
      >
        <X className="h-4 w-4" strokeWidth={2.8} />
        Recusar
      </button>
      <button
        onClick={onApprove}
        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-leaf text-[12px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop transition hover:-translate-y-0.5"
      >
        <Check className="h-4 w-4" strokeWidth={2.8} />
        Aprovar
      </button>
    </div>
  );
}
