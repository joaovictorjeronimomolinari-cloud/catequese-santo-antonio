import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Catequizando Digital" },
      { name: "description", content: "Acesse sua conta de catequizando ou catequista da Paróquia Santo Antônio." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<"aluno" | "catequista">("aluno");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [mostrar, setMostrar] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!nome.trim() || !senha) {
      setErro("Preencha o nome e a senha.");
      return;
    }
    const r = login(nome.trim(), senha, perfil);
    if (!r.ok) {
      if (r.reason === "nao-encontrado")
        setErro(perfil === "aluno"
          ? "Catequizando não encontrado. Já fez sua matrícula?"
          : "Catequista não encontrado. Já criou sua conta?");
      else if (r.reason === "senha-invalida") setErro("Senha incorreta. Tente novamente.");
      else if (r.reason === "pendente") setErro("Sua conta ainda está aguardando aprovação.");
      else if (r.reason === "rejeitado") setErro("Cadastro não aprovado. Procure a coordenação.");
      return;
    }
    if (r.session.kind === "aluno") navigate({ to: "/aluno" });
    else navigate({ to: "/painel" });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-sky pb-12">
      <div className="pointer-events-none absolute inset-0 texture-cream opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-10 top-24 h-24 w-44 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute right-6 top-10 h-20 w-32 rounded-full bg-white/60 blur-2xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-3xl items-center gap-3 px-5 pt-5">
        <Link
          to="/"
          aria-label="Voltar"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop transition hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
            Catequizando Digital
          </p>
          <h1 className="font-display text-xl font-extrabold leading-none text-[color:var(--habit-deep)]">
            Entrar
          </h1>
        </div>
      </header>

      <section className="relative z-10 mx-auto mt-6 max-w-md px-5">
        {/* Selector de perfil */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] p-1 shadow-pop">
          {(["aluno", "catequista"] as const).map((p) => {
            const sel = perfil === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => { setPerfil(p); setErro(null); }}
                className={
                  "h-11 rounded-xl text-[12px] font-black uppercase tracking-wider transition " +
                  (sel
                    ? p === "aluno"
                      ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
                      : "bg-gradient-habit text-[color:var(--lily)] shadow-pop"
                    : "text-[color:var(--habit-deep)]/70 hover:text-[color:var(--habit-deep)]")
                }
              >
                {p === "aluno" ? "🎒 Catequizando" : "✝️ Catequista"}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-5 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop sm:p-7"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
            Acesso
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
            {perfil === "aluno" ? "Bem-vindo de volta!" : "Paz e Bem, catequista"}
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
            Use o mesmo nome completo do cadastro.
          </p>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
                Nome completo
              </span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={perfil === "aluno" ? "Ex.: Maria Eduarda Silva" : "Ex.: João Victor Jerônimo Molinari"}
                autoComplete="username"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
                Senha
              </span>
              <div className="relative">
                <input
                  type={mostrar ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputCls + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setMostrar((v) => !v)}
                  aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[color:var(--habit-deep)]/60"
                >
                  {mostrar ? "🙈" : "👁️"}
                </button>
              </div>
            </label>

            {erro && (
              <div className="rounded-2xl border-2 border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/10 px-3 py-2 text-[12px] font-bold text-[color:var(--destructive)]">
                {erro}
              </div>
            )}

            <button
              type="submit"
              className={
                "mt-1 inline-flex h-13 h-[52px] items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase tracking-wider transition hover:-translate-y-0.5 " +
                (perfil === "aluno"
                  ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
                  : "bg-gradient-habit text-[color:var(--lily)] shadow-pop")
              }
            >
              Entrar
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-5 border-t border-dashed border-[color:var(--cord)]/40 pt-4 text-center text-[12px] font-semibold text-[color:var(--muted-foreground)]">
            Ainda não tem conta?{" "}
            <Link
              to={perfil === "aluno" ? "/matricula" : "/catequista"}
              className="font-black uppercase tracking-wider text-[color:var(--habit)]"
            >
              {perfil === "aluno" ? "Matricular" : "Criar conta"} →
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3.5 text-[14px] font-semibold text-[color:var(--habit-deep)] shadow-[inset_0_2px_0_oklch(0.30_0.06_50_/_0.06)] outline-none transition focus:border-[color:var(--gold)] focus:ring-4 focus:ring-[color:var(--gold)]/30 placeholder:text-[color:var(--muted-foreground)]/70";
