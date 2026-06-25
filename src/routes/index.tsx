import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import mascot from "@/assets/santo-antonio-mascot.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catequizando Digital — Paróquia Santo Antônio · Jacutinga/MG" },
      { name: "description", content: "Bem-vindo ao Catequizando Digital, o aplicativo de catequese da Paróquia Santo Antônio de Jacutinga. Faça sua matrícula ou conheça nosso aplicativo." },
      { property: "og:title", content: "Catequizando Digital" },
      { property: "og:description", content: "A fé no cotidiano das famílias. Catequese da Paróquia Santo Antônio." },
    ],
  }),
  component: Index,
});

/* ------------------------------------------------------------------ */
/*  Daily Bible verse — rotates by day-of-year (deterministic).        */
/* ------------------------------------------------------------------ */
const VERSES = [
  { ref: "Mc 10,14", text: "Deixai vir a mim as crianças, não as impeçais, porque o Reino de Deus é dos que se parecem com elas." },
  { ref: "Jo 14,6",  text: "Eu sou o caminho, a verdade e a vida. Ninguém vai ao Pai senão por mim." },
  { ref: "Sl 119,105", text: "A vossa palavra é lâmpada para os meus pés, é luz para o meu caminho." },
  { ref: "Pv 22,6",  text: "Educa a criança no caminho em que deve andar, e quando envelhecer, não se desviará dele." },
  { ref: "Mt 28,19", text: "Ide, pois, e fazei discípulos de todas as nações, batizando‑os em nome do Pai, do Filho e do Espírito Santo." },
  { ref: "1Jo 4,16", text: "Nós conhecemos e cremos no amor que Deus nos tem. Deus é amor." },
  { ref: "Fl 4,13",  text: "Tudo posso naquele que me fortalece." },
];

function verseOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return VERSES[day % VERSES.length];
}

/* ------------------------------------------------------------------ */
/*  Inline iconography (no extra deps, perfectly tunable).             */
/* ------------------------------------------------------------------ */
function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 2.5h4v6.5h6.5v4H14V21h-4v-8H3.5V9H10V2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FlourishDivider() {
  return (
    <div className="flex items-center justify-center gap-3 text-[color:var(--gold)]" aria-hidden="true">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[color:var(--gold)]/60" />
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
        <path d="M12 2 14 10l8 2-8 2-2 8-2-8-8-2 8-2z" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[color:var(--gold)]/60" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Splash screen — 1.8s, then fades into the welcome.                 */
/* ------------------------------------------------------------------ */
function Splash({ verse }: { verse: { ref: string; text: string } }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-sanctuary px-6 text-center text-[color:var(--parchment)] animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 -m-8 rounded-full bg-[color:var(--gold)]/15 blur-2xl animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--parchment)]/10 ring-1 ring-[color:var(--gold)]/40 backdrop-blur-sm">
          <CrossIcon className="h-12 w-12 text-[color:var(--gold-soft)]" />
        </div>
      </div>

      <p className="font-display text-4xl font-medium tracking-wide sm:text-5xl">
        Catequizando <span className="text-[color:var(--gold-soft)]">Digital</span>
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.32em] text-[color:var(--parchment)]/70">
        Paróquia Santo Antônio · Jacutinga/MG
      </p>

      <div className="mt-10 max-w-md">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold-soft)]/80">
          Palavra do dia
        </p>
        <p className="mt-3 font-display text-lg italic leading-relaxed text-[color:var(--parchment)]/90 sm:text-xl">
          “{verse.text}”
        </p>
        <p className="mt-2 text-sm tracking-wide text-[color:var(--gold-soft)]">— {verse.ref}</p>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[color:var(--parchment)]/50">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--gold)]" />
        Preparando o coração
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Module A · Welcome screen (Tela Inicial — usuário não logado).     */
/* ------------------------------------------------------------------ */
function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [verse] = useState(verseOfTheDay);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) return <Splash verse={verse} />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-sky">
      {/* Decorative parchment grain */}
      <div className="pointer-events-none absolute inset-0 texture-parchment opacity-60" aria-hidden="true" />

      {/* Top brand bar */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-sanctuary text-[color:var(--gold-soft)] shadow-sacred">
            <CrossIcon className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold text-[color:var(--marian-deep)]">
              Catequizando Digital
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
              Paróquia Santo Antônio
            </p>
          </div>
        </div>

        <a
          href="#entrar"
          className="hidden text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--marian-deep)]/80 transition-colors hover:text-[color:var(--marian-deep)] sm:inline-flex"
        >
          Já tenho conta →
        </a>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pt-10 pb-24 sm:px-10 md:grid-cols-[1.05fr_1fr] md:items-center md:pt-16">
        {/* Left — copy & CTAs */}
        <div className="order-2 md:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--card)]/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[color:var(--marian-deep)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
            Catequese · Jacutinga/MG
          </p>

          <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight text-[color:var(--marian-deep)] sm:text-6xl md:text-[68px]">
            A fé no <span className="italic text-[color:var(--marian)]">cotidiano</span><br />
            das famílias.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">
            O <strong className="text-[color:var(--marian-deep)] font-semibold">Catequizando Digital</strong> é o aplicativo oficial da
            Paróquia Santo Antônio de Jacutinga. Ele prolonga as aulas presenciais e torna o aprendizado do
            Evangelho parte da rotina do catequizando e da sua família.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-sanctuary px-8 text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--parchment)] shadow-sacred transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--parchment)]"
            >
              <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-[color:var(--gold)]/0 via-[color:var(--gold)]/25 to-[color:var(--gold)]/0" />
              <span className="relative">Fazer matrícula</span>
              <svg viewBox="0 0 24 24" className="relative ml-3 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              className="inline-flex h-14 items-center justify-center rounded-full border border-[color:var(--marian-deep)]/20 bg-[color:var(--card)]/80 px-7 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--marian-deep)] backdrop-blur transition-colors hover:border-[color:var(--marian-deep)]/40 hover:bg-[color:var(--card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marian-deep)]/40"
            >
              Conheça nosso aplicativo
            </button>
          </div>

          {/* Tiny pillars */}
          <ul className="mt-10 grid grid-cols-3 gap-4 text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)] sm:max-w-md">
            {[
              { k: "Fé", d: "Palavra de Deus" },
              { k: "Família", d: "Junto em casa" },
              { k: "Comunidade", d: "Catequista próximo" },
            ].map((p) => (
              <li key={p.k} className="border-l border-[color:var(--gold)]/40 pl-3 leading-relaxed">
                <span className="block font-display text-base font-semibold normal-case tracking-normal text-[color:var(--marian-deep)]">
                  {p.k}
                </span>
                {p.d}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — sacred image card with verse stamp */}
        <div className="order-1 md:order-2">
          <figure className="relative mx-auto max-w-md">
            {/* Glow */}
            <div className="absolute -inset-6 rounded-[36px] bg-[color:var(--gold)]/20 blur-3xl" aria-hidden="true" />

            {/* Frame */}
            <div className="relative overflow-hidden rounded-[28px] border border-[color:var(--gold)]/30 bg-[color:var(--marian-deep)] shadow-sacred">
              <img
                src={doveHero}
                alt="Pomba do Espírito Santo descendo entre raios de luz dourada"
                width={1280}
                height={1280}
                className="block h-full w-full object-cover"
              />
              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[color:var(--marian-deep)] via-[color:var(--marian-deep)]/70 to-transparent" />

              {/* Verse stamp */}
              <figcaption className="absolute inset-x-5 bottom-5 rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--marian-deep)]/70 p-5 text-[color:var(--parchment)] backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
                  Palavra do dia
                </p>
                <p className="mt-2 font-display text-base italic leading-snug">
                  “{verse.text}”
                </p>
                <p className="mt-2 text-xs tracking-wide text-[color:var(--gold-soft)]">— {verse.ref}</p>
              </figcaption>
            </div>

            {/* Corner medallion */}
            <div className="absolute -left-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--marian-deep)] shadow-gold-glow ring-4 ring-[color:var(--parchment)]">
              <CrossIcon className="h-6 w-6" />
            </div>
          </figure>
        </div>
      </section>

      {/* Footer / sign-in link */}
      <footer id="entrar" className="relative z-10 mx-auto max-w-6xl px-6 pb-10 sm:px-10">
        <FlourishDivider />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center text-xs text-[color:var(--muted-foreground)] sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Paróquia Santo Antônio · Jacutinga/MG ·{" "}
            <span className="italic">Ad maiorem Dei gloriam</span>
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-medium text-[color:var(--marian-deep)] underline decoration-[color:var(--gold)] decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--marian)]"
          >
            Já tenho conta — Entrar
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}
