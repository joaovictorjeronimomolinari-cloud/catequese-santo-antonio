import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
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
function LilyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2c1.5 2 2 3.5 1.6 5.2C15 6.5 16.6 6.5 18 7.3c-1 1-2.7 1.6-4.2 1.4 1.6 1.1 2.2 2.6 2 4.1-1.2-1-2.6-1.6-3.8-1.4-1.2-.2-2.6.4-3.8 1.4.2-1.5.8-3 2.4-4.1-1.5.2-3.2-.4-4.2-1.4 1.4-.8 3-.8 4.4-.1C10.4 5.5 10.5 4 12 2Z" fill="currentColor"/>
      <path d="M12 12v9M9.5 16c.8.6 1.7.9 2.5.9s1.7-.3 2.5-.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2 14 10l8 2-8 2-2 8-2-8-8-2 8-2z" />
    </svg>
  );
}

function FlourishDivider() {
  return (
    <div className="flex items-center justify-center gap-3 text-[color:var(--gold)]" aria-hidden="true">
      <span className="h-1 w-10 rounded-full bg-[color:var(--gold)]/40" />
      <StarIcon className="h-3 w-3" />
      <span className="h-1 w-10 rounded-full bg-[color:var(--gold)]/40" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Splash screen — 1.8s, then fades into the welcome.                 */
/* ------------------------------------------------------------------ */
function Splash({ verse }: { verse: { ref: string; text: string } }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-habit px-6 text-center text-[color:var(--lily)] animate-in fade-in duration-500">
      {/* Floating halo + mascot */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -m-10 rounded-full bg-[color:var(--gold)]/25 blur-3xl animate-pulse" />
        <div className="relative h-36 w-36 overflow-hidden rounded-full ring-4 ring-[color:var(--gold)]/60 shadow-gold-glow">
          <img src={mascot} alt="" width={1024} height={1024} className="h-full w-full object-cover" />
        </div>
        <span className="absolute -right-2 -top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop">
          <LilyIcon className="h-5 w-5" />
        </span>
      </div>

      <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Catequizando <span className="text-[color:var(--gold-soft)]">Digital</span>
      </p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.32em] text-[color:var(--gold-soft)]/90">
        Paróquia Santo Antônio · Jacutinga/MG
      </p>

      <div className="mt-10 max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--gold-soft)]/80">
          Palavra do dia
        </p>
        <p className="mt-3 font-display text-lg italic leading-relaxed text-[color:var(--lily)]/95 sm:text-xl">
          “{verse.text}”
        </p>
        <p className="mt-2 text-sm font-bold tracking-wide text-[color:var(--gold-soft)]">— {verse.ref}</p>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--lily)]/60">
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
      {/* Decorative dotted cream */}
      <div className="pointer-events-none absolute inset-0 texture-cream opacity-70" aria-hidden="true" />

      {/* Floating clouds & sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-10 top-24 h-24 w-44 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute right-6 top-10 h-20 w-32 rounded-full bg-white/60 blur-2xl" />
        <div className="absolute left-1/3 top-[42%] h-3 w-3 rotate-45 rounded-sm bg-[color:var(--gold)]/70" />
        <div className="absolute right-12 top-1/3 h-2 w-2 rounded-full bg-[color:var(--gold)]" />
        <div className="absolute left-8 bottom-40 h-2.5 w-2.5 rotate-45 rounded-sm bg-[color:var(--leaf)]/70" />
      </div>

      {/* Top brand bar */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-10 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-habit text-[color:var(--gold-soft)] shadow-pop">
              <LilyIcon className="h-5 w-5" />
            </div>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-gold text-[8px] font-black text-[color:var(--habit-deep)] shadow">
              ✦
            </span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">
              Catequizando <span className="text-[color:var(--habit)]">Digital</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
              Paróquia Santo Antônio
            </p>
          </div>
        </div>

        {/* Streak chip */}
        <div className="hidden items-center gap-2 rounded-full border-2 border-[color:var(--gold)]/40 bg-[color:var(--card)] px-3 py-1.5 text-[11px] font-extrabold text-[color:var(--habit-deep)] shadow-pop sm:inline-flex">
          <span className="text-base leading-none">🔥</span>
          <span>0 dias</span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pt-8 pb-28 sm:px-10 md:grid-cols-[1fr_1fr] md:items-center md:pt-14">
        {/* Mascot card — order first on mobile */}
        <div className="order-1 md:order-2">
          <figure className="relative mx-auto w-full max-w-sm">
            {/* Glow + clouds */}
            <div className="absolute -inset-6 rounded-[40px] bg-[color:var(--gold)]/25 blur-3xl" aria-hidden="true" />
            <span aria-hidden className="absolute -left-6 top-10 text-2xl">✨</span>
            <span aria-hidden className="absolute -right-3 top-4 text-2xl">⭐</span>
            <span aria-hidden className="absolute -right-6 bottom-12 text-xl">✨</span>

            {/* Frame — chunky game card */}
            <div className="relative overflow-hidden rounded-[32px] border-[3px] border-[color:var(--habit-deep)] bg-[color:var(--lily)] shadow-pop">
              <div className="relative aspect-square w-full bg-gradient-to-b from-[color:var(--sky)]/60 to-[color:var(--cream)]">
                <img
                  src={mascot}
                  alt="Santo Antônio de Pádua segurando uma açucena branca e o Menino Jesus"
                  width={1024}
                  height={1024}
                  className="block h-full w-full object-cover"
                />
              </div>

              {/* Verse stamp */}
              <figcaption className="border-t-[3px] border-dashed border-[color:var(--cord)]/60 bg-[color:var(--lily)] p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 items-center justify-center rounded-full bg-gradient-gold px-2 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
                    Palavra do dia
                  </span>
                  <span className="ml-auto text-[11px] font-extrabold text-[color:var(--habit)]">{verse.ref}</span>
                </div>
                <p className="mt-2 font-display text-[15px] italic leading-snug text-[color:var(--habit-deep)]">
                  “{verse.text}”
                </p>
              </figcaption>
            </div>

            {/* XP medallion */}
            <div className="absolute -left-3 -top-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop ring-4 ring-[color:var(--cream)]">
              <div className="text-center leading-none">
                <p className="font-display text-lg font-black">+10</p>
                <p className="text-[8px] font-extrabold uppercase tracking-widest">XP</p>
              </div>
            </div>
            {/* Lily badge — sits above the card, away from the verse stamp */}
            <div className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--lily)] text-[color:var(--leaf)] shadow-pop ring-4 ring-[color:var(--leaf)]/30">
              <LilyIcon className="h-7 w-7" />
            </div>
          </figure>
        </div>

        {/* Copy & CTAs */}
        <div className="order-2 md:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--habit)]/15 bg-[color:var(--card)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--habit-deep)] shadow-pop">
            <span className="h-2 w-2 rounded-full bg-[color:var(--leaf)]" />
            Catequese · Jacutinga/MG
          </p>

          <h1 className="mt-5 font-display text-[44px] leading-[1.02] tracking-tight text-[color:var(--habit-deep)] sm:text-6xl md:text-[64px]">
            Aprenda a fé{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic text-[color:var(--habit)]">brincando</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-full bg-[color:var(--gold)]/60" />
            </span>
            <br />com Santo Antônio.
          </h1>

          <p className="mt-5 max-w-xl text-[15px] font-semibold leading-relaxed text-[color:var(--muted-foreground)] sm:text-base">
            O <strong className="font-extrabold text-[color:var(--habit-deep)]">Catequizando Digital</strong> é o app oficial da
            Paróquia Santo Antônio de Jacutinga. Lições curtinhas, conquistas, devocional e missões em família —
            tudo para guardar o Evangelho no coração da criançada.
          </p>

          {/* CTAs — chunky Duolingo buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/matricula"
              className="group relative inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-gold px-7 text-sm font-black uppercase tracking-[0.14em] text-[color:var(--habit-deep)] shadow-gold-pop transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:shadow-pop focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/50"
            >
              <span>🎒 Matricular catequizando</span>
              <svg viewBox="0 0 24 24" className="ml-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              to="/catequista"
              className="inline-flex h-14 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit px-6 text-sm font-black uppercase tracking-[0.14em] text-[color:var(--lily)] shadow-pop transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--habit)]/30"
            >
              ✝️ Sou catequista — criar conta
            </Link>

            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-4 text-[12px] font-black uppercase tracking-[0.14em] text-[color:var(--habit-deep)] shadow-pop transition-transform hover:-translate-y-0.5"
            >
              🔑 Já tenho conta — Entrar
            </Link>
          </div>

          {/* Pillar trio — game tiles */}
          <ul className="mt-9 grid grid-cols-3 gap-3 sm:max-w-md">
            {[
              { k: "Fé", d: "Palavra de Deus", emoji: "📖", tone: "gold" as const },
              { k: "Família", d: "Junto em casa", emoji: "🏡", tone: "leaf" as const },
              { k: "Missões", d: "Conquiste XP", emoji: "⭐", tone: "habit" as const },
            ].map((p) => (
              <li
                key={p.k}
                className="rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-3 text-center shadow-pop"
              >
                <div
                  className={
                    "mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl text-base " +
                    (p.tone === "gold"
                      ? "bg-gradient-gold"
                      : p.tone === "leaf"
                      ? "bg-gradient-leaf text-[color:var(--lily)]"
                      : "bg-gradient-habit text-[color:var(--lily)]")
                  }
                >
                  <span>{p.emoji}</span>
                </div>
                <p className="font-display text-sm font-extrabold text-[color:var(--habit-deep)]">{p.k}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                  {p.d}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer id="entrar" className="relative z-10 mx-auto max-w-6xl px-5 pb-10 sm:px-10">
        <FlourishDivider />
        <p className="mt-5 text-center text-[11px] font-bold text-[color:var(--muted-foreground)]">
          © {new Date().getFullYear()} Paróquia Santo Antônio · Jacutinga/MG ·{" "}
          <span className="italic">Pax et bonum</span>
        </p>
      </footer>
    </main>
  );
}
