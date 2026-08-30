import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  faixaDe,
  getProgresso,
  refazerQuizDevocional,
  salvarQuizDevocional,
  toggleSantoColecao,
  useStore,
} from "@/lib/store";
import {
  apurarPerfil,
  PERFIS,
  QUIZ,
  SANTOS,
  SANTOS_POR_PERFIL,
  santoPorId,
  type PerfilLetra,
  type Santo,
} from "@/lib/santos";
import { Sparkles, BookHeart, RefreshCw, Check, X } from "lucide-react";

export const Route = createFileRoute("/aluno/devocional")({
  head: () => ({
    meta: [{ title: "Devocional e santos — Catequizando Digital" }, { name: "description", content: "Orações, reflexões diárias e a comunhão dos santos para o catequizando." }, { name: "robots", content: "noindex, nofollow" }],
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
  const aluno = useStore((s) =>
    s.session?.kind === "aluno" ? s.alunos.find((a) => a.id === s.session!.id) ?? null : null,
  );
  const prog = useStore((s) => (aluno ? s.progresso[aluno.id] : undefined));
  const faixa = aluno ? faixaDe(aluno.etapa) : "infantil";
  const isJovem = faixa === "jovem";

  if (isJovem && aluno) return <CrismaDevocional alunoId={aluno.id} prog={prog} />;
  return <InfantilOracoes />;
}

/* ------------------------------------------------------------------ */
/*  Infantil — passos de oração (versão original simplificada)         */
/* ------------------------------------------------------------------ */
function InfantilOracoes() {
  const [passo, setPasso] = useState(0);
  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
          Orações do dia
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

/* ------------------------------------------------------------------ */
/*  Crisma — Quiz + Santo padroeiro + Coleção de santos                */
/* ------------------------------------------------------------------ */
function CrismaDevocional({ alunoId, prog }: { alunoId: string; prog: ReturnType<typeof getProgresso> | undefined }) {
  const respostas = prog?.quizRespostas ?? "";
  const padroeiroId = prog?.santoPadroeiroId ?? null;
  const colecao = prog?.colecaoSantos ?? [];
  const concluiuQuiz = respostas.length === QUIZ.length && !!padroeiroId;

  if (!concluiuQuiz) return <QuizFlow alunoId={alunoId} />;

  const padroeiro = santoPorId(padroeiroId)!;
  const perfil = PERFIS[padroeiro.perfil];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
          Devocional · Crisma
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
          Comunhão dos Santos
        </h1>
        <p className="mt-1 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
          Conheça seu santo padroeiro e colecione intercessores para a sua caminhada.
        </p>
      </header>

      {/* Santo padroeiro */}
      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-6 text-[color:var(--lily)] shadow-pop">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--gold-soft)]">
          <Sparkles className="h-3.5 w-3.5" />
          Seu santo padroeiro
        </div>
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-4xl text-[color:var(--habit-deep)] shadow-gold-pop">
            {padroeiro.emoji}
          </div>
          <div className="flex-1">
            <p className="font-display text-2xl font-extrabold leading-tight">{padroeiro.nome}</p>
            <p className="mt-1 text-[12px] font-bold uppercase tracking-wider text-[color:var(--gold-soft)]">
              Perfil {perfil.letra} · {perfil.nome}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--lily)]/95">
              {padroeiro.descricao}
            </p>
            <p className="mt-2 text-[12px] italic text-[color:var(--gold-soft)]">
              Intercessão: {padroeiro.intercessao}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Refazer o quiz devocional? Seu santo padroeiro pode mudar.")) {
              refazerQuizDevocional(alunoId);
            }
          }}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-2xl border-2 border-[color:var(--lily)]/40 bg-white/10 px-4 text-[11px] font-black uppercase tracking-wider text-[color:var(--lily)]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refazer o quiz
        </button>
      </section>

      {/* Coleção do catequizando */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-xl font-extrabold text-[color:var(--habit-deep)]">
            Minha coleção
          </h3>
          <span className="text-[11px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">
            {colecao.length} / {SANTOS.length}
          </span>
        </div>
        {colecao.length === 0 ? (
          <p className="mt-2 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
            Toque em um santo abaixo para adicioná-lo à sua devoção.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {colecao.map((id) => {
              const s = santoPorId(id);
              if (!s) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-[color:var(--gold)]/50 bg-[color:var(--card)] px-2.5 py-1 text-[11px] font-extrabold text-[color:var(--habit-deep)] shadow-pop"
                >
                  <span>{s.emoji}</span>
                  {s.nome.replace(/^(Santo|São|Santa|Beato|Beata|Venerável|Serva de Deus)\s+/, "")}
                </span>
              );
            })}
          </div>
        )}
      </section>

      {/* Banco de santos */}
      <BancoSantos alunoId={alunoId} colecao={colecao} padroeiroId={padroeiroId} />
    </main>
  );
}

function BancoSantos({
  alunoId,
  colecao,
  padroeiroId,
}: {
  alunoId: string;
  colecao: string[];
  padroeiroId: string | null;
}) {
  const [filtro, setFiltro] = useState<PerfilLetra | "todos">("todos");
  const lista = filtro === "todos" ? SANTOS : SANTOS_POR_PERFIL[filtro];

  return (
    <section className="mt-8">
      <h3 className="font-display text-xl font-extrabold text-[color:var(--habit-deep)]">
        Banco de santos
      </h3>
      <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
        50 intercessores divididos em 5 perfis. Adicione à sua coleção.
      </p>

      {/* Filtros */}
      <div className="mt-3 flex flex-wrap gap-2">
        <FiltroChip ativo={filtro === "todos"} onClick={() => setFiltro("todos")}>
          Todos
        </FiltroChip>
        {(Object.keys(PERFIS) as PerfilLetra[]).map((l) => (
          <FiltroChip key={l} ativo={filtro === l} onClick={() => setFiltro(l)}>
            <span className="mr-1">{PERFIS[l].emoji}</span>
            {PERFIS[l].nome}
          </FiltroChip>
        ))}
      </div>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {lista.map((s) => (
          <SantoCard
            key={s.id}
            santo={s}
            colecionado={colecao.includes(s.id)}
            padroeiro={padroeiroId === s.id}
            onToggle={() => toggleSantoColecao(alunoId, s.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function FiltroChip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex h-8 items-center rounded-full border-2 px-3 text-[11px] font-black uppercase tracking-wider transition " +
        (ativo
          ? "border-[color:var(--habit-deep)] bg-gradient-habit text-[color:var(--lily)] shadow-pop"
          : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
      }
    >
      {children}
    </button>
  );
}

function SantoCard({
  santo,
  colecionado,
  padroeiro,
  onToggle,
}: {
  santo: Santo;
  colecionado: boolean;
  padroeiro: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <article className="relative flex h-full flex-col rounded-2xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-4 shadow-pop">
        {padroeiro && (
          <span className="absolute -right-1 -top-1 inline-flex items-center gap-1 rounded-full bg-gradient-gold px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop">
            <Sparkles className="h-3 w-3" />
            Padroeiro
          </span>
        )}
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-2xl text-[color:var(--habit-deep)] shadow-gold-pop">
            {santo.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-extrabold leading-tight text-[color:var(--habit-deep)]">
              {santo.nome}
            </p>
            <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit)]">
              {PERFIS[santo.perfil].nome}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[12px] leading-snug text-[color:var(--muted-foreground)]">
          {santo.descricao}
        </p>
        <p className="mt-1 text-[11px] italic text-[color:var(--habit-deep)]/80">
          <BookHeart className="mr-1 inline h-3 w-3" />
          {santo.intercessao}
        </p>
        <button
          type="button"
          onClick={onToggle}
          disabled={padroeiro}
          className={
            "mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider transition " +
            (colecionado
              ? "border-[color:var(--leaf)] bg-gradient-leaf text-[color:var(--lily)]"
              : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] hover:-translate-y-0.5") +
            (padroeiro ? " opacity-70" : "")
          }
        >
          {colecionado ? (
            <>
              <Check className="h-3.5 w-3.5" />
              {padroeiro ? "Padroeiro" : "Na coleção"}
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Adicionar à devoção
            </>
          )}
        </button>
      </article>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Quiz Flow                                                          */
/* ------------------------------------------------------------------ */
function QuizFlow({ alunoId }: { alunoId: string }) {
  const [iniciou, setIniciou] = useState(false);
  const [idx, setIdx] = useState(0);
  const [respostas, setRespostas] = useState<PerfilLetra[]>([]);

  if (!iniciou) {
    return (
      <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
            Devocional · Crisma
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
            Qual santo caminha com você?
          </h1>
          <p className="mt-2 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
            Antes de abrir o banco de santos, responda 20 perguntas para descobrir o santo padroeiro
            que mais se parece com o seu jeito de viver a fé.
          </p>
        </header>
        <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-6 text-[color:var(--lily)] shadow-pop">
          <p className="font-display text-xl font-extrabold">Quiz devocional</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--lily)]/95">
            Cada pergunta tem 5 alternativas (A–E). Responda com o que mais combina com você hoje.
            Ao final, mostraremos o seu perfil dominante e 10 santos sugeridos para a sua devoção.
          </p>
          <button
            type="button"
            onClick={() => setIniciou(true)}
            className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-gold px-6 text-[12px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop"
          >
            <Sparkles className="h-4 w-4" />
            Começar o quiz
          </button>
        </section>
      </main>
    );
  }

  const total = QUIZ.length;
  const pergunta = QUIZ[idx];

  const responder = (letra: PerfilLetra) => {
    const novas = [...respostas, letra];
    if (novas.length === total) {
      const perfil = apurarPerfil(novas);
      const sugeridos = SANTOS_POR_PERFIL[perfil];
      const padroeiro = sugeridos[Math.floor(Math.random() * sugeridos.length)];
      const respostasStr = novas.join("");
      salvarQuizDevocional(alunoId, respostasStr, padroeiro.id);
      return;
    }
    setRespostas(novas);
    setIdx(idx + 1);
  };

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (idx === 0) {
              setIniciou(false);
              return;
            }
            setIdx(idx - 1);
            setRespostas(respostas.slice(0, -1));
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]"
          aria-label="Voltar"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--habit)]">
            Pergunta {idx + 1} de {total}
          </p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[color:var(--habit-deep)]/10">
            <div
              className="h-full rounded-full bg-gradient-gold transition-all"
              style={{ width: `${((idx + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <section className="mt-6 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-6 shadow-pop">
        <h2 className="font-display text-xl font-extrabold leading-snug text-[color:var(--habit-deep)]">
          {pergunta.titulo}
        </h2>
        <ul className="mt-5 grid gap-2.5">
          {pergunta.opcoes.map((op) => (
            <li key={op.letra}>
              <button
                type="button"
                onClick={() => responder(op.letra)}
                className="flex w-full items-start gap-3 rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-3 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--gold)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-habit font-display text-base font-black text-[color:var(--lily)]">
                  {op.letra}
                </span>
                <span className="flex-1 pt-1 text-[13px] font-semibold leading-snug text-[color:var(--habit-deep)]">
                  {op.texto}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}