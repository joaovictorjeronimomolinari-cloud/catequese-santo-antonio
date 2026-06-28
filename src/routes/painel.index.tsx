import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Cross, Clock, Check, Star, Flame, type LucideIcon } from "lucide-react";
import { ADMINS, useStore } from "@/lib/store";

export const Route = createFileRoute("/painel/")({
  head: () => ({ meta: [{ title: "Início — Painel do Catequista" }] }),
  component: PainelHome,
});

const ETAPA_LABEL: Record<string, string> = {
  "pre-catequese": "Pré-catequese",
  "primeira-comunhao": "Primeira Comunhão",
  crisma: "Crisma",
};

function PainelHome() {
  const session = useStore((s) => s.session);
  const alunos = useStore((s) => s.alunos);
  const catequistas = useStore((s) => s.catequistas);
  const progresso = useStore((s) => s.progresso);

  const isAdmin = session?.kind === "admin";
  const admin = isAdmin ? ADMINS.find((a) => a.id === session.id) ?? null : null;
  const cat = !isAdmin && session?.kind === "catequista"
    ? catequistas.find((c) => c.id === session.id) ?? null
    : null;

  const alunosAprovados = alunos.filter((a) => {
    if (a.status !== "approved") return false;
    if (isAdmin) return true;
    return cat ? a.catequistaId === cat.id : false;
  });
  const pendentes = alunos.filter((a) => a.status === "pending").length
    + catequistas.filter((c) => c.status === "pending").length;

  const nome = admin?.apelido ?? cat?.apelido ?? cat?.nome.split(" ")[0] ?? "catequista";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header className="flex items-start gap-3">
        <Link
          to="/"
          aria-label="Voltar"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.6} />
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
            {isAdmin ? "Coordenação" : "Paz e Bem, catequista"}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
            Olá, {nome}!
          </h1>
          <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
            {isAdmin
              ? "Aprove novas contas e acompanhe a catequese."
              : "Acompanhe sua turma e atividades."}
          </p>
        </div>
      </header>

      {isAdmin && (
        <section className="mt-6 overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            Caixa de aprovações
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight">
            {pendentes} cadastro(s) pendente(s)
          </h2>
          <p className="mt-1 text-[12px] font-bold text-[color:var(--lily)]/90">
            Revise as novas matrículas e contas de catequista.
          </p>
          <Link
            to="/aprovacoes"
            className="mt-4 inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-gradient-gold px-4 text-[12px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop"
          >
            <Check className="h-4 w-4" strokeWidth={2.8} />
            Abrir aprovações
          </Link>
        </section>
      )}

      <section className="mt-6 grid grid-cols-3 gap-3">
        <Stat k="Catequizandos" v={String(alunosAprovados.length)} Icon={GraduationCap} />
        <Stat k="Catequistas" v={String(catequistas.filter((c) => c.status === "approved").length)} Icon={Cross} />
        <Stat k="Pendentes" v={String(pendentes)} Icon={Clock} />
      </section>

      <section className="mt-8">
        <h3 className="font-display text-xl font-extrabold text-[color:var(--habit-deep)]">
          Catequizandos ativos
        </h3>
        {alunosAprovados.length === 0 ? (
          <p className="mt-3 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-4 text-center text-[12px] font-bold text-[color:var(--muted-foreground)]">
            Ainda não há catequizandos aprovados.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2.5">
            {alunosAprovados.map((a) => {
              const p = progresso[a.id];
              return (
                <li key={a.id}>
                  <div className="flex items-center gap-3 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 shadow-pop">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold text-base font-black text-[color:var(--habit-deep)] shadow-gold-pop">
                      {a.nome.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-extrabold text-[color:var(--habit-deep)]">{a.nome}</p>
                      <p className="truncate text-[11px] font-semibold text-[color:var(--muted-foreground)]">
                        {ETAPA_LABEL[a.etapa] ?? a.etapa} · {a.responsavel}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--gold-soft)] px-2 py-0.5 text-[10px] font-black text-[color:var(--habit-deep)]">
                        <Star className="h-3 w-3" strokeWidth={2.6} /> {p?.xp ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--leaf)]/15 px-2 py-0.5 text-[10px] font-black text-[color:var(--leaf)]">
                        <Flame className="h-3 w-3" strokeWidth={2.6} /> {p?.streak ?? 0}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

function Stat({ k, v, Icon }: { k: string; v: string; Icon: LucideIcon }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 text-center shadow-pop">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--habit-deep)]/8 text-[color:var(--habit-deep)]">
        <Icon className="h-4 w-4" strokeWidth={2.6} />
      </span>
      <p className="mt-0.5 font-display text-base font-extrabold leading-none text-[color:var(--habit-deep)]">{v}</p>
      <p className="mt-0.5 text-[9px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">{k}</p>
    </div>
  );
}
