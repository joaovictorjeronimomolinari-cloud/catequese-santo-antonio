import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flame, Star, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { comunidadeNome, faixaDe, logout, useStore } from "@/lib/store";

export const Route = createFileRoute("/aluno/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Catequizando Digital" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const navigate = useNavigate();
  const aluno = useStore((s) =>
    s.session?.kind === "aluno" ? s.alunos.find((a) => a.id === s.session!.id) ?? null : null,
  );
  const prog = useStore((s) => (aluno ? s.progresso[aluno.id] : undefined));

  if (!aluno) return null;
  const faixa = faixaDe(aluno.etapa);
  const etapaLabel =
    aluno.etapa === "pre-catequese" ? "Pré-catequese"
    : aluno.etapa === "primeira-comunhao" ? "Primeira Comunhão"
    : "Crisma";

  const idade = aluno.nascimento
    ? Math.max(0, Math.floor((Date.now() - new Date(aluno.nascimento).getTime()) / (365.25 * 86_400_000)))
    : null;

  function sair() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <section className="overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop ring-4 ring-[color:var(--lily)]">
              <UserRound className="h-10 w-10" strokeWidth={2.2} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
              Catequizando(a)
            </p>
            <h1 className="font-display text-2xl font-extrabold leading-tight">{aluno.nome}</h1>
            <p className="mt-0.5 text-[12px] font-bold text-[color:var(--lily)]/90">
              {idade !== null ? `${idade} anos · ` : ""}{etapaLabel}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Mini k="Sequência" v={String(prog?.streak ?? 0)} Icon={Flame} />
          <Mini k="XP" v={String(prog?.xp ?? 0)} Icon={Star} />
          <Mini k="Lírios" v={String(prog?.lirios ?? 0)} Icon={Sparkles} />
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Minha catequese</h2>
        <div className="mt-3 grid gap-2">
          <Linha k="Etapa" v={`${etapaLabel} (1 ano)`} />
          <Linha k="Batizado" v={aluno.batizado === "sim" ? "Sim" : "Ainda não"} />
          {aluno.batizado === "sim" && (
            <Linha k="Paróquia do batismo" v={aluno.batismoParoquia || "Não informada"} />
          )}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Família</h2>
        <div className="mt-3 grid gap-2">
          <Linha k="Responsável" v={aluno.responsavel} />
          <Linha k="WhatsApp" v={aluno.telefone} />
          {aluno.email && <Linha k="E-mail" v={aluno.email} />}
          <Linha k="Comunidade" v={comunidadeNome(aluno.comunidade)} />
        </div>
      </section>

      <section className="mt-6 grid gap-3">
        <button
          onClick={sair}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-habit text-sm font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop"
        >
          Sair da conta
        </button>
      </section>
    </main>
  );
}

function Mini({ k, v, Icon }: { k: string; v: string; Icon: LucideIcon }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 px-3 py-2 text-center backdrop-blur">
      <Icon className="h-4 w-4" strokeWidth={2.6} />
      <p className="mt-1 font-display text-base font-extrabold leading-none">{v}</p>
      <p className="mt-0.5 text-[9px] font-black uppercase tracking-wider text-[color:var(--lily)]/80">{k}</p>
    </div>
  );
}

function Linha({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-[color:var(--cord)]/40 pb-2 text-[13px] last:border-0 last:pb-0">
      <span className="text-[11px] font-black uppercase tracking-wider text-[color:var(--habit)]">{k}</span>
      <span className="text-right font-extrabold text-[color:var(--habit-deep)]">{v}</span>
    </div>
  );
}
