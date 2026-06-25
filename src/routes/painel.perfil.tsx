import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/painel/perfil")({
  head: () => ({ meta: [{ title: "Perfil do Catequista — Catequizando Digital" }] }),
  component: CatequistaPerfilPage,
});

function CatequistaPerfilPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <section className="overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold text-3xl text-[color:var(--habit-deep)] shadow-gold-pop ring-4 ring-[color:var(--lily)]">
            🧕
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
              Catequista · 7 anos de serviço
            </p>
            <h1 className="font-display text-2xl font-extrabold leading-tight">Joana Oliveira</h1>
            <p className="mt-0.5 text-[12px] font-bold text-[color:var(--lily)]/90">
              Paróquia Santo Antônio · Matriz
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Mini k="Turmas" v="1" emoji="🎒" />
          <Mini k="Catequizandos" v="14" emoji="👨‍👩‍👧" />
          <Mini k="Encontros" v="38" emoji="📅" />
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Vínculo paroquial</h2>
        <div className="mt-3 grid gap-2">
          <Linha k="Comunidade" v="Matriz Santo Antônio" />
          <Linha k="Etapa que leciona" v="Pré‑catequese (7–9)" />
          <Linha k="Coordenadora" v="Dona Helena Marques" />
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
        <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Caminho de fé</h2>
        <div className="mt-3 grid gap-2">
          <Linha k="Batismo" v="Sim" />
          <Linha k="Eucaristia" v="Sim" />
          <Linha k="Crisma" v="Sim" />
          <Linha k="Formação bíblica" v="Curso paroquial · 2023" />
        </div>
      </section>

      <section className="mt-6 grid gap-3">
        <button className="inline-flex h-12 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop">
          ⚙️ Configurações
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