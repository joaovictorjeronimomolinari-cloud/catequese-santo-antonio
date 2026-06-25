import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/aluno/devocional")({
  head: () => ({
    meta: [{ title: "Devocional — Catequizando Digital" }],
  }),
  component: DevocionalPage,
});

const ORACOES = [
  { id: "pn", nome: "Pai Nosso", emoji: "🙏", duracao: "1 min" },
  { id: "am", nome: "Ave Maria", emoji: "🌹", duracao: "1 min" },
  { id: "gp", nome: "Glória ao Pai", emoji: "✨", duracao: "30 s" },
  { id: "an", nome: "Anjo da Guarda", emoji: "👼", duracao: "30 s" },
  { id: "sa", nome: "A Santo Antônio", emoji: "🪷", duracao: "1 min" },
];

const PASSOS = [
  { titulo: "Faça o Sinal da Cruz", texto: "Em nome do Pai, do Filho e do Espírito Santo. Amém." },
  { titulo: "Acolha a Palavra", texto: "“Deixai vir a mim as crianças, não as impeçais.” (Mc 10,14)" },
  { titulo: "Reflita comigo", texto: "Jesus tem um carinho especial por você. O que você quer contar pra Ele hoje?" },
  { titulo: "Reze uma oração", texto: "Escolha abaixo a oração que está no seu coração." },
  { titulo: "Agradeça e siga em paz", texto: "Termine com um sorriso. Hoje você foi mais perto de Deus!" },
];

function DevocionalPage() {
  const [passo, setPasso] = useState(0);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
          Devocional do dia
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
          5 minutinhos com Jesus
        </h1>
        <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
          Reze em paz, no seu ritmo. Cada dia uma faísca a mais de fé.
        </p>
      </header>

      {/* Card do passo atual */}
      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-6 text-[color:var(--lily)] shadow-pop">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          <span>Passo {passo + 1} de {PASSOS.length}</span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <span
              className="block h-full rounded-full bg-gradient-gold transition-all"
              style={{ width: `${((passo + 1) / PASSOS.length) * 100}%` }}
            />
          </span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-extrabold">{PASSOS[passo].titulo}</h2>
        <p className="mt-2 font-display text-lg italic leading-relaxed text-[color:var(--lily)]/95">
          “{PASSOS[passo].texto}”
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => setPasso((p) => Math.max(0, p - 1))}
            disabled={passo === 0}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border-2 border-[color:var(--lily)]/40 bg-white/10 text-[12px] font-black uppercase tracking-wider text-[color:var(--lily)] disabled:opacity-40"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => setPasso((p) => Math.min(PASSOS.length - 1, p + 1))}
            disabled={passo === PASSOS.length - 1}
            className="inline-flex h-11 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-[12px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop disabled:opacity-50"
          >
            Próximo passo
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>

      {/* Orações */}
      <section className="mt-8">
        <h3 className="font-display text-xl font-extrabold text-[color:var(--habit-deep)]">Orações do coração</h3>
        <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
          Toque para escutar e acompanhar.
        </p>
        <ul className="mt-4 grid gap-2.5">
          {ORACOES.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 text-left shadow-pop transition hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-xl shadow-gold-pop">
                  {o.emoji}
                </span>
                <div className="flex-1">
                  <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">{o.nome}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                    ▶ Áudio · {o.duracao}
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--habit-deep)]/8 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
                  +5 XP
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Selo de hoje */}
      <section className="mt-8 rounded-3xl border-[3px] border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-5 text-center">
        <p className="text-3xl">🕯️</p>
        <p className="mt-1 font-display text-lg font-extrabold text-[color:var(--habit-deep)]">
          Selo de hoje: <span className="text-[color:var(--habit)]">Coração orante</span>
        </p>
        <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
          Complete os 5 passos para colar este selo na sua estampa de devoção.
        </p>
      </section>
    </main>
  );
}