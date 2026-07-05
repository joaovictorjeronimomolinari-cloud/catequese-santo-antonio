import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { login } from "@/lib/store";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapTestAccounts } from "@/lib/test-accounts.functions";

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
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [mostrar, setMostrar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Bootstrap silencioso: garante que as contas de teste existam antes
  // do primeiro login. Só age quando ainda não há nenhum admin.
  const bootstrapFn = useServerFn(bootstrapTestAccounts);
  useEffect(() => {
    bootstrapFn().catch(() => {});
  }, [bootstrapFn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!identificador.trim() || !senha) {
      setErro("Preencha o e-mail (ou nome de usuário) e a senha.");
      return;
    }
    setEnviando(true);
    const r = await login(identificador.trim(), senha);
    setEnviando(false);
    if (!r.ok) {
      if (r.reason === "nao-encontrado")
        setErro("Conta não encontrada. Confira o e-mail/nome ou faça a matrícula.");
      else if (r.reason === "senha-invalida") setErro("Credenciais incorretas.");
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
        <form
          onSubmit={onSubmit}
          className="mt-5 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop sm:p-7"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
            Acesso
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
            Bem-vindo de volta!
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
            Entre com o e-mail ou nome de usuário e a senha que cadastrou.
          </p>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
                E-mail ou nome de usuário
              </span>
              <input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="familia@email.com ou Maria Silva"
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
              disabled={enviando}
              className={
                "mt-1 inline-flex h-13 h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop transition hover:-translate-y-0.5 disabled:opacity-60"
              }
            >
              {enviando ? "Entrando..." : "Entrar"}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-5 border-t border-dashed border-[color:var(--cord)]/40 pt-4 text-center text-[12px] font-semibold text-[color:var(--muted-foreground)]">
            Ainda não tem conta?{" "}
            <Link to="/matricula" className="font-black uppercase tracking-wider text-[color:var(--habit)]">
              Matricular →
            </Link>
            {" · "}
            <Link to="/catequista" className="font-black uppercase tracking-wider text-[color:var(--habit)]">
              Sou catequista →
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3.5 text-[14px] font-semibold text-[color:var(--habit-deep)] shadow-[inset_0_2px_0_oklch(0.30_0.06_50_/_0.06)] outline-none transition focus:border-[color:var(--gold)] focus:ring-4 focus:ring-[color:var(--gold)]/30 placeholder:text-[color:var(--muted-foreground)]/70";
