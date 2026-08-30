import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getCurrentAdmin, logout, useStore } from "@/lib/store";
import { PreferenciasCard } from "@/components/PreferenciasCard";

export const Route = createFileRoute("/painel/perfil")({
  head: () => ({ meta: [{ title: "Perfil do Catequista — Catequizando Digital" }, { name: "description", content: "Dados da conta do catequista, preferências do app e encerramento de sessão." }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const navigate = useNavigate();
  const session = useStore((s) => s.session);
  const cat = useStore((s) =>
    s.session?.kind === "catequista" ? s.catequistas.find((c) => c.id === s.session!.id) ?? null : null,
  );
  const admin = session?.kind === "admin" ? getCurrentAdmin() : null;

  async function sair() {
    await logout();
    navigate({ to: "/" });
  }

  const nome = admin?.nome ?? cat?.nome ?? "—";
  const subtitulo = admin
    ? "Coordenação · Paróquia Santo Antônio"
    : cat
    ? `${cat.comunidade ?? "Paróquia Santo Antônio"} · ${cat.anos ?? 0} ano(s) de serviço`
    : "";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <section className="overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-5 text-[color:var(--lily)] shadow-pop">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-gold text-3xl text-[color:var(--habit-deep)] shadow-gold-pop ring-4 ring-[color:var(--lily)]">
            {cat?.foto ? <img src={cat.foto} alt="" className="h-full w-full object-cover" /> : admin ? "👑" : "✝️"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
              {admin ? "Coordenação" : "Catequista"}
            </p>
            <h1 className="font-display text-2xl font-extrabold leading-tight">{nome}</h1>
            <p className="mt-0.5 text-[12px] font-bold text-[color:var(--lily)]/90">{subtitulo}</p>
          </div>
        </div>
      </section>

      {cat && (
        <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop">
          <h2 className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">Dados</h2>
          <div className="mt-3 grid gap-2">
            <Linha k="E-mail" v={cat.email} />
            <Linha k="WhatsApp" v={cat.telefone} />
            <Linha k="Comunidade" v={cat.comunidade ?? "—"} />
            <Linha k="Etapas" v={cat.etapas.join(", ") || "—"} />
          </div>
        </section>
      )}

      <div className="mt-6">
        <PreferenciasCard />
      </div>

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

function Linha({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-[color:var(--cord)]/40 pb-2 text-[13px] last:border-0 last:pb-0">
      <span className="text-[11px] font-black uppercase tracking-wider text-[color:var(--habit)]">{k}</span>
      <span className="text-right font-extrabold text-[color:var(--habit-deep)]">{v}</span>
    </div>
  );
}
