import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/aluno/perfil")({
  head: () => ({
    meta: [{ title: "Perfil — Catequizando Digital" }],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      {/* Cartão de identidade */}
      <section className="overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold text-3xl text-[color:var(--habit-deep)] shadow-gold-pop ring-4 ring-[color:var(--lily)]">
              👧
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--leaf)] text-[10px] font-black text-[color:var(--lily)] ring-2 ring-[color:var(--lily)]">
              N1
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
              Catequizanda
            </p>
            <h1 className="font-display text-2xl font-extrabold leading-tight">Maria Eduarda Silva</h1>
            <p className="mt-0.5 text-[12px] font-bold text-[color:var(--lily)]/90">8 anos · Pré‑catequese</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Mini k="Sequência" v="3 dias" emoji="🔥" />
          <Mini k="XP" v="35" emoji="⭐" />
          <Mini k="Lírios" v="12" emoji="🪷" />
        </div>
      </section>

      {/* Informações da turma */}
      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Minha turma</h2>
        <div className="mt-3 grid gap-2">
          <Linha k="Catequista" v="Tia Joana Oliveira" />
          <Linha k="Encontro" v="Sábados · 14h" />
          <Linha k="Sala" v="Salão paroquial · Sala 3" />
          <Linha k="Etapa" v="Pré‑catequese (1 ano)" />
        </div>
      </section>

      {/* Família */}
      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Família</h2>
        <div className="mt-3 grid gap-2">
          <Linha k="Responsável" v="Carla Silva (mãe)" />
          <Linha k="WhatsApp" v="(35) 9 9999‑0000" />
          <Linha k="E‑mail" v="familia.silva@email.com" />
          <Linha k="Bairro" v="Centro · Jacutinga/MG" />
        </div>
      </section>

      {/* Ações */}
      <section className="mt-6 grid gap-3">
        <button className="inline-flex h-12 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop">
          ⚙️ Configurações da conta
        </button>
        <button className="inline-flex h-12 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop">
          🔔 Notificações
        </button>
        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-habit text-sm font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop"
        >
          Sair da conta
        </Link>
      </section>
    </main>
  );
}

function Mini({ k, v, emoji }: { k: string; v: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2 text-center backdrop-blur">
      <p className="text-lg leading-none">{emoji}</p>
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