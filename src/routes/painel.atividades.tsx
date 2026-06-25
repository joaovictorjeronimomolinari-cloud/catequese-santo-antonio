import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/painel/atividades")({
  head: () => ({ meta: [{ title: "Atividades — Painel do Catequista" }] }),
  component: AtividadesPage,
});

const ATIVIDADES = [
  { titulo: "Quiz: A família de Jesus", tipo: "Quiz", entregues: 8, total: 14, status: "ativa" },
  { titulo: "Missão: rezar com a família", tipo: "Missão", entregues: 5, total: 14, status: "ativa" },
  { titulo: "Lição: Nasceu em Belém", tipo: "Lição", entregues: 14, total: 14, status: "concluida" },
];

function AtividadesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">Atividades</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
            O que está acontecendo
          </h1>
          <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
            Acompanhe as atividades em andamento e crie novas.
          </p>
        </div>
        <button className="shrink-0 rounded-2xl bg-gradient-gold px-4 py-3 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop">
          + Nova
        </button>
      </header>

      <ul className="mt-6 grid gap-3">
        {ATIVIDADES.map((a) => {
          const pct = Math.round((a.entregues / a.total) * 100);
          return (
            <li key={a.titulo} className="rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-4 shadow-pop">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">{a.titulo}</p>
                <span className={"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider " + (a.status === "concluida" ? "bg-[color:var(--leaf)]/15 text-[color:var(--leaf)]" : "bg-[color:var(--gold-soft)] text-[color:var(--habit-deep)]")}>
                  {a.status === "concluida" ? "Concluída" : "Em andamento"}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-[color:var(--habit)]">
                {a.tipo} · {a.entregues}/{a.total} entregues
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--habit-deep)]/10">
                <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}