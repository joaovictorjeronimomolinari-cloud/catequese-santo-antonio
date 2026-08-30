import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, ShieldCheck, ClipboardList, Users, UserRound } from "lucide-react";
import { setSessionFromAuth, useStore, type Session } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel do Catequista — Catequizando Digital" },
      { name: "description", content: "Acompanhe sua turma, atividades e formação no painel do catequista." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PainelLayout,
});

type Tab = {
  to: "/painel" | "/painel/turma" | "/painel/atividades" | "/painel/perfil" | "/aprovacoes";
  label: string;
  Icon: typeof Home;
};

function PainelLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const session = useStore((s) => s.session);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (session?.kind === "catequista" || session?.kind === "admin") {
      setCheckingAuth(false);
      return;
    }

    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (cancelled) return;
      if (!user) {
        setCheckingAuth(false);
        navigate({ to: "/login" });
        return;
      }

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (cancelled) return;
      const roles = (rolesData ?? []).map((r) => r.role as "admin" | "catequista" | "aluno");
      const nextSession: Session = roles.includes("admin")
        ? {
            kind: "admin",
            id: user.id,
            nome: (user.user_metadata?.nome as string | undefined) ?? user.email ?? undefined,
            email: user.email ?? undefined,
          }
        : roles.includes("catequista")
        ? { kind: "catequista", id: user.id }
        : { kind: "aluno", id: user.id };

      setSessionFromAuth(nextSession);
      setCheckingAuth(false);
      if (nextSession.kind !== "catequista" && nextSession.kind !== "admin") {
        navigate({ to: "/login" });
      }
    })();

    return () => { cancelled = true; };
  }, [session, navigate]);

  if (checkingAuth || !session || (session.kind !== "catequista" && session.kind !== "admin")) return null;

  const isAdmin = session.kind === "admin";
  const TABS: Tab[] = isAdmin
    ? [
        { to: "/painel", label: "Início", Icon: Home },
        { to: "/aprovacoes", label: "Aprovar", Icon: ShieldCheck },
        { to: "/painel/atividades", label: "Trilha", Icon: ClipboardList },
        { to: "/painel/perfil", label: "Perfil", Icon: UserRound },
      ]
    : [
        { to: "/painel", label: "Início", Icon: Home },
        { to: "/painel/turma", label: "Turma", Icon: Users },
        { to: "/painel/atividades", label: "Atividades", Icon: ClipboardList },
        { to: "/painel/perfil", label: "Perfil", Icon: UserRound },
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
                      "flex h-10 w-12 items-center justify-center rounded-xl transition " +
                      (active
                        ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
                        : "group-hover:bg-[color:var(--habit-deep)]/5")
                    }
                  >
                    <t.Icon className="h-5 w-5" strokeWidth={2.5} aria-hidden />
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