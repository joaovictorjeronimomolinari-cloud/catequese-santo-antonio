import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel do Catequista — Catequizando Digital" },
      { name: "description", content: "Acompanhe sua turma, atividades e formação no painel do catequista." },
    ],
  }),
  component: PainelLayout,
});

type Tab = { to: "/painel" | "/painel/turma" | "/painel/atividades" | "/painel/perfil" | "/aprovacoes"; label: string; emoji: string };

function PainelLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const session = useStore((s) => s.session);

  useEffect(() => {
    if (!session || (session.kind !== "catequista" && session.kind !== "admin")) {
      navigate({ to: "/login" });
    }
  }, [session, navigate]);

  if (!session || (session.kind !== "catequista" && session.kind !== "admin")) return null;

  const isAdmin = session.kind === "admin";
  const TABS: Tab[] = isAdmin
    ? [
        { to: "/painel", label: "Início", emoji: "🏠" },
        { to: "/aprovacoes", label: "Aprovar", emoji: "✅" },
        { to: "/painel/atividades", label: "Trilha", emoji: "📋" },
        { to: "/painel/perfil", label: "Perfil", emoji: "🙂" },
      ]
    : [
        { to: "/painel", label: "Início", emoji: "🏠" },
        { to: "/painel/turma", label: "Turma", emoji: "👨‍👩‍👧" },
        { to: "/painel/atividades", label: "Atividades", emoji: "📋" },
        { to: "/painel/perfil", label: "Perfil", emoji: "🙂" },
      ];
  return (
    <div className="relative min-h-screen bg-gradient-sky pb-24">
      <div className="pointer-events-none fixed inset-0 texture-cream opacity-60" aria-hidden />
      <div className="relative">
        <Outlet />
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)]/95 backdrop-blur"
        aria-label="Navegação do catequista"
      >
        <ul className="mx-auto grid max-w-3xl grid-cols-4 px-2 py-2">
          {TABS.map((t) => {
            const active = t.to === "/painel" ? pathname === "/painel" : pathname.startsWith(t.to);
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className={
                    "group flex flex-col items-center gap-0.5 rounded-2xl py-1.5 transition " +
                    (active ? "text-[color:var(--habit-deep)]" : "text-[color:var(--muted-foreground)] hover:text-[color:var(--habit-deep)]")
                  }
                >
                  <span
                    className={
                      "flex h-10 w-12 items-center justify-center rounded-xl text-lg transition " +
                      (active ? "bg-gradient-gold shadow-gold-pop" : "group-hover:bg-[color:var(--habit-deep)]/5")
                    }
                  >
                    {t.emoji}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider">{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}