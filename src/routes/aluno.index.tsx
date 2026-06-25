import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/aluno/")({
  head: () => ({
    meta: [
      { title: "Trilha de Atividades — Catequizando Digital" },
      { name: "description", content: "Sua trilha de aulas, missões e conquistas na catequese de Santo Antônio." },
    ],
  }),
  component: TrilhaPage,
});

/* ──────────────────────────────────────────────────────────────── */
/*  Dados da trilha (mock — pronto para virar dados do backend)     */
/* ──────────────────────────────────────────────────────────────── */

type NodeKind = "licao" | "oracao" | "missao" | "video" | "quiz" | "bau";
type NodeStatus = "completo" | "atual" | "bloqueado";

type TrilhaNode = {
  id: string;
  titulo: string;
  kind: NodeKind;
  status: NodeStatus;
  xp: number;
  estrelas?: 0 | 1 | 2 | 3;
};

type Unidade = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  cor: "gold" | "leaf" | "habit" | "sky";
  nodes: TrilhaNode[];
};

const UNIDADES: Unidade[] = [
  {
    id: "u1",
    numero: 1,
    titulo: "Quem é Jesus?",
    subtitulo: "O Filho de Deus que se fez gente como nós",
    cor: "gold",
    nodes: [
      { id: "u1-1", titulo: "O Sinal da Cruz", kind: "oracao", status: "completo", xp: 10, estrelas: 3 },
      { id: "u1-2", titulo: "Deus criou tudo com amor", kind: "licao", status: "completo", xp: 15, estrelas: 3 },
      { id: "u1-3", titulo: "Nasceu em Belém", kind: "video", status: "completo", xp: 10, estrelas: 2 },
      { id: "u1-4", titulo: "Quiz: A família de Jesus", kind: "quiz", status: "atual", xp: 20 },
      { id: "u1-5", titulo: "Missão: rezar com a família", kind: "missao", status: "bloqueado", xp: 25 },
      { id: "u1-6", titulo: "Baú do Frei Antônio", kind: "bau", status: "bloqueado", xp: 50 },
    ],
  },
  {
    id: "u2",
    numero: 2,
    titulo: "A Igreja é nossa casa",
    subtitulo: "Os sinais sagrados que encontramos na missa",
    cor: "leaf",
    nodes: [
      { id: "u2-1", titulo: "O altar e o sacrário", kind: "licao", status: "bloqueado", xp: 15 },
      { id: "u2-2", titulo: "Pai Nosso", kind: "oracao", status: "bloqueado", xp: 10 },
      { id: "u2-3", titulo: "Quiz: cores litúrgicas", kind: "quiz", status: "bloqueado", xp: 20 },
      { id: "u2-4", titulo: "Missão: visitar a igreja", kind: "missao", status: "bloqueado", xp: 30 },
      { id: "u2-5", titulo: "Baú do Frei Antônio", kind: "bau", status: "bloqueado", xp: 50 },
    ],
  },
  {
    id: "u3",
    numero: 3,
    titulo: "Os Sacramentos",
    subtitulo: "Os sete sinais do amor de Deus por nós",
    cor: "habit",
    nodes: [
      { id: "u3-1", titulo: "Batismo: a porta da fé", kind: "licao", status: "bloqueado", xp: 15 },
      { id: "u3-2", titulo: "Eucaristia: o Pão da Vida", kind: "licao", status: "bloqueado", xp: 15 },
      { id: "u3-3", titulo: "Ave Maria", kind: "oracao", status: "bloqueado", xp: 10 },
      { id: "u3-4", titulo: "Quiz dos 7 sacramentos", kind: "quiz", status: "bloqueado", xp: 25 },
      { id: "u3-5", titulo: "Baú do Frei Antônio", kind: "bau", status: "bloqueado", xp: 50 },
    ],
  },
];

const KIND_META: Record<NodeKind, { emoji: string; rotulo: string }> = {
  licao: { emoji: "📘", rotulo: "Lição" },
  oracao: { emoji: "🙏", rotulo: "Oração" },
  missao: { emoji: "⭐", rotulo: "Missão" },
  video: { emoji: "🎬", rotulo: "Vídeo" },
  quiz: { emoji: "❓", rotulo: "Quiz" },
  bau: { emoji: "🎁", rotulo: "Baú" },
};

/* ──────────────────────────────────────────────────────────────── */
/*  Página                                                          */
/* ──────────────────────────────────────────────────────────────── */
function TrilhaPage() {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const all = UNIDADES.flatMap((u) => u.nodes);
    const done = all.filter((n) => n.status === "completo");
    const xp = done.reduce((sum, n) => sum + n.xp, 0);
    return { total: all.length, done: done.length, xp };
  }, []);

  const openNode = useMemo(
    () => UNIDADES.flatMap((u) => u.nodes).find((n) => n.id === openNodeId) ?? null,
    [openNodeId],
  );

  return (
    <main className="relative">
      {/* Topo: identidade do catequizando + status de jogo */}
      <header className="sticky top-0 z-20 border-b-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)]/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-5 pb-3 pt-5">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Voltar ao início"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                Catequizanda
              </p>
              <h1 className="truncate font-display text-lg font-extrabold leading-none text-[color:var(--habit-deep)]">
                Maria Eduarda
              </h1>
              <p className="mt-0.5 text-[11px] font-bold text-[color:var(--habit)]">
                Pré‑catequese · Turma do Frei Antônio
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusChip emoji="🔥" v="3" k="dias" tone="gold" />
              <StatusChip emoji="⭐" v={String(stats.xp)} k="xp" tone="leaf" />
              <StatusChip emoji="🪷" v="12" k="lírios" tone="sky" />
            </div>
          </div>

          {/* Barra de progresso da etapa */}
          <div className="mt-4">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
                Progresso da etapa
              </span>
              <span className="text-[10px] font-extrabold text-[color:var(--muted-foreground)]">
                {stats.done}/{stats.total} atividades
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-[color:var(--habit-deep)]/10">
              <div
                className="h-full rounded-full bg-gradient-gold transition-all"
                style={{ width: `${Math.round((stats.done / stats.total) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Verso do dia — banner curtinho */}
      <section className="mx-auto mt-5 max-w-3xl px-5">
        <div className="flex items-stretch gap-3 rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-3 shadow-pop">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-habit text-2xl text-[color:var(--gold-soft)]">
            📖
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--habit)]">
              Palavra do dia · Mc 10,14
            </p>
            <p className="mt-0.5 truncate font-display text-[13px] italic leading-snug text-[color:var(--habit-deep)]">
              “Deixai vir a mim as crianças…”
            </p>
          </div>
          <Link
            to="/aluno/devocional"
            className="flex shrink-0 items-center justify-center rounded-2xl bg-gradient-gold px-3 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop"
          >
            Rezar
          </Link>
        </div>
      </section>

      {/* Trilha */}
      <section className="mx-auto mt-7 max-w-3xl px-5">
        {UNIDADES.map((u, idx) => (
          <UnidadeBlock key={u.id} unidade={u} onOpen={setOpenNodeId} isFirst={idx === 0} />
        ))}
      </section>

      {/* Sheet do nó */}
      {openNode && <NodeSheet node={openNode} onClose={() => setOpenNodeId(null)} />}
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  Unidade — banner colorido + trilha em zigue‑zague               */
/* ──────────────────────────────────────────────────────────────── */
function UnidadeBlock({
  unidade,
  onOpen,
  isFirst,
}: {
  unidade: Unidade;
  onOpen: (id: string) => void;
  isFirst: boolean;
}) {
  const banner =
    unidade.cor === "gold"
      ? "bg-gradient-gold text-[color:var(--habit-deep)]"
      : unidade.cor === "leaf"
      ? "bg-gradient-leaf text-[color:var(--lily)]"
      : unidade.cor === "habit"
      ? "bg-gradient-habit text-[color:var(--lily)]"
      : "bg-[color:var(--sky)] text-[color:var(--habit-deep)]";

  return (
    <div className={isFirst ? "" : "mt-12"}>
      {/* Banner da unidade */}
      <div className={"relative overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] p-5 shadow-pop " + banner}>
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" aria-hidden />
        <p className="text-[10px] font-black uppercase tracking-[0.28em] opacity-80">
          Unidade {unidade.numero}
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight">{unidade.titulo}</h2>
        <p className="mt-1 text-[12px] font-bold opacity-90">{unidade.subtitulo}</p>
      </div>

      {/* Trilha em zigue‑zague */}
      <ol className="relative mx-auto mt-6 max-w-[280px]">
        {unidade.nodes.map((node, i) => {
          const offset = i % 4; // 0 → centro, 1 → direita, 2 → centro, 3 → esquerda
          const x = offset === 1 ? "translate-x-16" : offset === 3 ? "-translate-x-16" : "translate-x-0";
          const next = unidade.nodes[i + 1];
          return (
            <li key={node.id} className="relative flex flex-col items-center pb-8 last:pb-0">
              <div className={"transition-transform " + x}>
                <NodeBubble node={node} onOpen={onOpen} />
              </div>
              {next && <Connector from={offset} to={(i + 1) % 4} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* Linha pontilhada entre dois nós */
function Connector({ from, to }: { from: number; to: number }) {
  // posição horizontal em pixels para cada offset 0,1,2,3
  const map = [0, 64, 0, -64];
  const x1 = map[from];
  const x2 = map[to];
  const left = Math.min(x1, x2);
  const width = Math.abs(x2 - x1) + 2;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-[88px] h-10 text-[color:var(--cord)]"
      style={{ left: `calc(50% + ${left}px - 1px)`, width: `${Math.max(width, 2)}px` }}
      viewBox={`0 0 ${Math.max(width, 2)} 40`}
      preserveAspectRatio="none"
    >
      <path
        d={`M1 0 C ${width / 2} 16, ${width / 2} 24, ${width - 1} 40`}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 8"
      />
    </svg>
  );
}

/* Nó (botão circular gigante, estilo Duolingo) */
function NodeBubble({ node, onOpen }: { node: TrilhaNode; onOpen: (id: string) => void }) {
  const meta = KIND_META[node.kind];
  const isLocked = node.status === "bloqueado";
  const isDone = node.status === "completo";
  const isCurrent = node.status === "atual";

  const ring =
    isCurrent
      ? "ring-[color:var(--gold)] animate-pulse"
      : isDone
      ? "ring-[color:var(--leaf)]/70"
      : "ring-[color:var(--habit-deep)]/15";

  const face =
    isLocked
      ? "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
      : isDone
      ? "bg-gradient-leaf text-[color:var(--lily)]"
      : node.kind === "bau"
      ? "bg-gradient-gold text-[color:var(--habit-deep)]"
      : "bg-gradient-gold text-[color:var(--habit-deep)]";

  return (
    <div className="relative">
      {isCurrent && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[color:var(--habit-deep)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop">
          ▼ Comece aqui
        </span>
      )}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => onOpen(node.id)}
        aria-label={`${meta.rotulo}: ${node.titulo}`}
        className={
          "relative flex h-[76px] w-[76px] items-center justify-center rounded-[28px] border-[3px] border-[color:var(--habit-deep)] text-3xl shadow-pop ring-4 transition-transform " +
          face +
          " " +
          ring +
          (isLocked ? " cursor-not-allowed opacity-80" : " hover:-translate-y-0.5 active:translate-y-0")
        }
      >
        <span>{isLocked ? "🔒" : meta.emoji}</span>
        {isDone && (
          <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--lily)] text-[color:var(--leaf)] shadow-pop ring-2 ring-[color:var(--leaf)]/40">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </button>
      {/* Estrelas (se houver) */}
      {typeof node.estrelas === "number" && (
        <div className="mt-1.5 flex justify-center gap-0.5" aria-label={`${node.estrelas} de 3 estrelas`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={
                "text-[11px] " +
                (i < (node.estrelas ?? 0) ? "text-[color:var(--gold)]" : "text-[color:var(--habit-deep)]/15")
              }
            >
              ★
            </span>
          ))}
        </div>
      )}
      <p className={"mt-1 max-w-[120px] text-center text-[11px] font-extrabold leading-tight " + (isLocked ? "text-[color:var(--muted-foreground)]" : "text-[color:var(--habit-deep)]")}>
        {node.titulo}
      </p>
    </div>
  );
}

/* Chip de status do topo */
function StatusChip({ emoji, v, k, tone }: { emoji: string; v: string; k: string; tone: "gold" | "leaf" | "sky" }) {
  const cls =
    tone === "gold"
      ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
      : tone === "leaf"
      ? "bg-gradient-leaf text-[color:var(--lily)] shadow-pop"
      : "bg-[color:var(--sky)] text-[color:var(--habit-deep)] shadow-pop";
  return (
    <span className={"flex h-9 items-center gap-1 rounded-full px-2.5 text-[11px] font-black " + cls}>
      <span className="text-sm leading-none">{emoji}</span>
      <span className="leading-none">{v}</span>
      <span className="text-[9px] font-extrabold uppercase tracking-wider opacity-80">{k}</span>
    </span>
  );
}

/* Sheet inferior do nó — preview da atividade */
function NodeSheet({ node, onClose }: { node: TrilhaNode; onClose: () => void }) {
  const meta = KIND_META[node.kind];
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute inset-0 bg-[color:var(--habit-deep)]/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-3xl rounded-t-[32px] border-t-[3px] border-[color:var(--habit-deep)] bg-[color:var(--lily)] p-5 shadow-pop">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[color:var(--habit-deep)]/15" />
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold text-3xl shadow-gold-pop">
            {meta.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--habit)]">
              {meta.rotulo}
            </p>
            <h3 className="font-display text-xl font-extrabold leading-tight text-[color:var(--habit-deep)]">
              {node.titulo}
            </h3>
            <p className="mt-1 text-[12px] font-bold text-[color:var(--muted-foreground)]">
              Ganhe <strong className="text-[color:var(--habit-deep)]">+{node.xp} XP</strong>
              {node.kind === "bau" && " · prêmio surpresa"}
            </p>
          </div>
        </div>

        {/* Pré-visualização de conteúdo */}
        <p className="mt-4 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-3 text-[13px] font-semibold text-[color:var(--habit-deep)]">
          {previewFor(node)}
        </p>

        <div className="mt-4 flex gap-2 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop"
          >
            Mais tarde
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={node.status === "bloqueado"}
            className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop disabled:opacity-50"
          >
            {node.status === "completo" ? "Praticar de novo" : "Começar atividade"}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function previewFor(node: TrilhaNode): string {
  switch (node.kind) {
    case "oracao":
      return "Você aprenderá a oração com áudio, gestos e um joguinho de completar as palavras.";
    case "licao":
      return "Uma historinha bem curtinha com ilustrações, seguida de 3 perguntas de revisão.";
    case "video":
      return "Animação de 2 minutos da turminha de Santo Antônio. Assista com a família!";
    case "quiz":
      return "5 perguntinhas rápidas. Acerte tudo para ganhar 3 estrelas e bônus de lírios.";
    case "missao":
      return "Uma missão para viver em casa esta semana — registre uma foto ou bilhete depois.";
    case "bau":
      return "Você abrirá o baú do Frei Antônio: figurinha exclusiva + lírios para colecionar.";
  }
}