import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { faixaDe, useStore } from "@/lib/store";

export const Route = createFileRoute("/aluno")({
  head: () => ({
    meta: [
      { title: "Área do Catequizando — Catequizando Digital" },
      { name: "description", content: "Trilha de atividades, devocional, conquistas e perfil do catequizando." },
    ],
  }),
  component: AlunoLayout,
});

type Tab = {
  to: "/aluno" | "/aluno/devocional" | "/aluno/conquistas" | "/aluno/perfil";
  label: string;
  emoji: string;
};

function AlunoLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const session = useStore((s) => s.session);
  const aluno = useStore((s) =>
    s.session?.kind === "aluno" ? s.alunos.find((a) => a.id === s.session!.id) ?? null : null,
  );

  useEffect(() => {
    if (!session || session.kind !== "aluno") navigate({ to: "/login" });
  }, [session, navigate]);

  if (!aluno) return null;

  const faixa = faixaDe(aluno.etapa);
  const TABS: Tab[] = [
    { to: "/aluno", label: "Atividades", emoji: "🗺️" },
    {
      to: "/aluno/devocional",
      label: faixa === "jovem" ? "Devocional" : "Orações",
      emoji: faixa === "jovem" ? "📖" : "🙏",
    },
    { to: "/aluno/conquistas", label: "Conquistas", emoji: "🏆" },
    { to: "/aluno/perfil", label: "Perfil", emoji: "🙂" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-sky pb-24">
      <div className="pointer-events-none fixed inset-0 texture-cream opacity-60" aria-hidden />
      <div className="relative">
        <Outlet />
      </div>

      {/* Bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)]/95 backdrop-blur"
        aria-label="Navegação do catequizando"
      >
        <ul className="mx-auto grid max-w-3xl grid-cols-4 px-2 py-2">
          {TABS.map((t) => {
            const active = t.to === "/aluno" ? pathname === "/aluno" : pathname.startsWith(t.to);
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className={
                    "group flex flex-col items-center gap-0.5 rounded-2xl py-1.5 transition " +
                    (active
                      ? "text-[color:var(--habit-deep)]"
                      : "text-[color:var(--muted-foreground)] hover:text-[color:var(--habit-deep)]")
                  }
                >
                  <span
                    className={
                      "flex h-10 w-12 items-center justify-center rounded-xl text-lg transition " +
                      (active
                        ? "bg-gradient-gold shadow-gold-pop"
                        : "bg-transparent group-hover:bg-[color:var(--habit-deep)]/5")
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