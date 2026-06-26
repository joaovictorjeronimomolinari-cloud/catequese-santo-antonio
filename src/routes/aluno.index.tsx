import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { completarNode, faixaDe, getProgresso, useStore, type Faixa } from "@/lib/store";

export const Route = createFileRoute("/aluno/")({
  head: () => ({
    meta: [
      { title: "Atividades — Catequizando Digital" },
      { name: "description", content: "Trilha real de atividades, missões e conquistas da catequese de Santo Antônio." },
    ],
  }),
  component: AtividadesPage,
});

/* ──────────────────────────────────────────────────────────────── */
/*  Dados da trilha — fixos por faixa, persistência via store        */
/* ──────────────────────────────────────────────────────────────── */

type NodeKind = "licao" | "oracao" | "missao" | "video" | "quiz" | "bau";
type TrilhaNode = { id: string; titulo: string; kind: NodeKind; xp: number };
type Unidade = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  cor: "gold" | "leaf" | "habit" | "sky";
  nodes: TrilhaNode[];
};

const TRILHA_INFANTIL: Unidade[] = [
  {
    id: "ui-1", numero: 1, titulo: "Quem é Jesus?", cor: "gold",
    subtitulo: "O Filho de Deus que se fez gente como nós",
    nodes: [
      { id: "ui1-1", titulo: "O Sinal da Cruz", kind: "oracao", xp: 10 },
      { id: "ui1-2", titulo: "Deus criou tudo com amor", kind: "licao", xp: 15 },
      { id: "ui1-3", titulo: "Nasceu em Belém", kind: "video", xp: 10 },
      { id: "ui1-4", titulo: "Quiz: a família de Jesus", kind: "quiz", xp: 20 },
      { id: "ui1-5", titulo: "Missão: rezar em família", kind: "missao", xp: 25 },
      { id: "ui1-6", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
  {
    id: "ui-2", numero: 2, titulo: "A Igreja é nossa casa", cor: "leaf",
    subtitulo: "Sinais sagrados que encontramos na missa",
    nodes: [
      { id: "ui2-1", titulo: "O altar e o sacrário", kind: "licao", xp: 15 },
      { id: "ui2-2", titulo: "Pai Nosso", kind: "oracao", xp: 10 },
      { id: "ui2-3", titulo: "Quiz: cores litúrgicas", kind: "quiz", xp: 20 },
      { id: "ui2-4", titulo: "Missão: visitar a igreja", kind: "missao", xp: 30 },
      { id: "ui2-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
  {
    id: "ui-3", numero: 3, titulo: "Os Sacramentos", cor: "habit",
    subtitulo: "Os sete sinais do amor de Deus por nós",
    nodes: [
      { id: "ui3-1", titulo: "Batismo: a porta da fé", kind: "licao", xp: 15 },
      { id: "ui3-2", titulo: "Eucaristia: o Pão da Vida", kind: "licao", xp: 15 },
      { id: "ui3-3", titulo: "Ave Maria", kind: "oracao", xp: 10 },
      { id: "ui3-4", titulo: "Quiz dos 7 sacramentos", kind: "quiz", xp: 25 },
      { id: "ui3-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
];

const TRILHA_JOVEM: Unidade[] = [
  {
    id: "uj-1", numero: 1, titulo: "Espírito Santo", cor: "habit",
    subtitulo: "Quem é o Paráclito e como Ele age em você",
    nodes: [
      { id: "uj1-1", titulo: "Vinde, Espírito Santo", kind: "oracao", xp: 10 },
      { id: "uj1-2", titulo: "Os 7 dons do Espírito", kind: "licao", xp: 20 },
      { id: "uj1-3", titulo: "Pentecostes", kind: "video", xp: 15 },
      { id: "uj1-4", titulo: "Quiz: dons e frutos", kind: "quiz", xp: 25 },
      { id: "uj1-5", titulo: "Missão: discernir uma escolha", kind: "missao", xp: 30 },
      { id: "uj1-6", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
  {
    id: "uj-2", numero: 2, titulo: "Vocação e missão", cor: "leaf",
    subtitulo: "Para que Deus me chama hoje?",
    nodes: [
      { id: "uj2-1", titulo: "Vocação na Bíblia", kind: "licao", xp: 20 },
      { id: "uj2-2", titulo: "Oração do discernimento", kind: "oracao", xp: 10 },
      { id: "uj2-3", titulo: "Quiz: vocações cristãs", kind: "quiz", xp: 25 },
      { id: "uj2-4", titulo: "Missão: servir alguém esta semana", kind: "missao", xp: 35 },
      { id: "uj2-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 60 },
    ],
  },
  {
    id: "uj-3", numero: 3, titulo: "Doutrina social", cor: "gold",
    subtitulo: "Fé que se faz caridade e justiça",
    nodes: [
      { id: "uj3-1", titulo: "A dignidade humana", kind: "licao", xp: 20 },
      { id: "uj3-2", titulo: "Bem comum e solidariedade", kind: "licao", xp: 20 },
      { id: "uj3-3", titulo: "Vídeo: testemunhos jovens", kind: "video", xp: 15 },
      { id: "uj3-4", titulo: "Quiz: doutrina social", kind: "quiz", xp: 30 },
      { id: "uj3-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 60 },
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

function trilhaParaFaixa(f: Faixa): Unidade[] {
  return f === "jovem" ? TRILHA_JOVEM : TRILHA_INFANTIL;
}

/* ──────────────────────────────────────────────────────────────── */
/*  Página                                                          */
/* ──────────────────────────────────────────────────────────────── */
function AtividadesPage() {
  const aluno = useStore((s) =>
    s.session?.kind === "aluno" ? s.alunos.find((a) => a.id === s.session!.id) ?? null : null,
  );
  const prog = useStore((s) => (aluno ? s.progresso[aluno.id] : undefined));
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);

  if (!aluno) return null;
  const faixa = faixaDe(aluno.etapa);
  const unidades = trilhaParaFaixa(faixa);
  const completed = new Set(prog?.completed ?? []);

  // calcula status sequencial (primeiro não-completo = atual; depois = bloqueado)
  const nodesPlanos = unidades.flatMap((u) => u.nodes);
  const firstPending = nodesPlanos.find((n) => !completed.has(n.id))?.id;

  const stats = {
    total: nodesPlanos.length,
    done: nodesPlanos.filter((n) => completed.has(n.id)).length,
    xp: prog?.xp ?? 0,
    streak: prog?.streak ?? 0,
    lirios: prog?.lirios ?? 0,
  };

  const openNode = useMemo(
    () => nodesPlanos.find((n) => n.id === openNodeId) ?? null,
    [openNodeId, nodesPlanos],
  );

  function statusOf(id: string): "completo" | "atual" | "bloqueado" {
    if (completed.has(id)) return "completo";
    if (id === firstPending) return "atual";
    return "bloqueado";
  }

  function concluir(node: TrilhaNode) {
    if (!aluno) return;
    if (statusOf(node.id) !== "atual") return;
    completarNode(aluno.id, node.id, node.xp, node.kind === "bau" ? 3 : 1);
    setOpenNodeId(null);
  }

  const primeiroNome = aluno.nome.split(" ")[0];
  const etapaLabel =
    aluno.etapa === "pre-catequese"
      ? "Pré-catequese"
      : aluno.etapa === "primeira-comunhao"
      ? "Primeira Comunhão"
      : "Crisma";

  return (
    <main className="relative">
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
                {faixa === "jovem" ? "Catequizando(a)" : "Catequizando(a)"}
              </p>
              <h1 className="truncate font-display text-lg font-extrabold leading-none text-[color:var(--habit-deep)]">
                {primeiroNome}
              </h1>
              <p className="mt-0.5 text-[11px] font-bold text-[color:var(--habit)]">{etapaLabel}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusChip emoji="🔥" v={String(stats.streak)} k="dias" tone="gold" />
              <StatusChip emoji="⭐" v={String(stats.xp)} k="xp" tone="leaf" />
              <StatusChip emoji="🪷" v={String(stats.lirios)} k="lírios" tone="sky" />
            </div>
          </div>

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
                style={{ width: `${Math.round((stats.done / Math.max(1, stats.total)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-7 max-w-3xl px-5">
        {unidades.map((u, idx) => (
          <UnidadeBlock
            key={u.id}
            unidade={u}
            statusOf={statusOf}
            onOpen={setOpenNodeId}
            isFirst={idx === 0}
          />
        ))}
        {stats.done === stats.total && (
          <div className="mt-10 rounded-3xl border-[3px] border-[color:var(--gold)] bg-gradient-gold p-6 text-center shadow-gold-pop">
            <p className="text-3xl">🎉</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-[color:var(--habit-deep)]">
              Trilha concluída!
            </h3>
            <p className="mt-1 text-[12px] font-bold text-[color:var(--habit-deep)]">
              Parabéns por completar todas as atividades desta etapa.
            </p>
          </div>
        )}
      </section>

      {openNode && (
        <NodeSheet
          node={openNode}
          status={statusOf(openNode.id)}
          onClose={() => setOpenNodeId(null)}
          onConcluir={() => concluir(openNode)}
        />
      )}
    </main>
  );
}

function UnidadeBlock({
  unidade,
  statusOf,
  onOpen,
  isFirst,
}: {
  unidade: Unidade;
  statusOf: (id: string) => "completo" | "atual" | "bloqueado";
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
      <div className={"relative overflow-hidden rounded-3xl border-[3px] border-[color:var(--habit-deep)] p-5 shadow-pop " + banner}>
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" aria-hidden />
        <p className="text-[10px] font-black uppercase tracking-[0.28em] opacity-80">
          Unidade {unidade.numero}
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight">{unidade.titulo}</h2>
        <p className="mt-1 text-[12px] font-bold opacity-90">{unidade.subtitulo}</p>
      </div>

      <ol className="relative mx-auto mt-6 max-w-[280px]">
        {unidade.nodes.map((node, i) => {
          const offset = i % 4;
          const x = offset === 1 ? "translate-x-16" : offset === 3 ? "-translate-x-16" : "translate-x-0";
          return (
            <li key={node.id} className="relative flex flex-col items-center pb-8 last:pb-0">
              <div className={"transition-transform " + x}>
                <NodeBubble node={node} status={statusOf(node.id)} onOpen={onOpen} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function NodeBubble({
  node,
  status,
  onOpen,
}: {
  node: TrilhaNode;
  status: "completo" | "atual" | "bloqueado";
  onOpen: (id: string) => void;
}) {
  const meta = KIND_META[node.kind];
  const isLocked = status === "bloqueado";
  const isDone = status === "completo";
  const isCurrent = status === "atual";

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
          face + " " + ring +
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
      <p className={"mt-1 max-w-[120px] text-center text-[11px] font-extrabold leading-tight " + (isLocked ? "text-[color:var(--muted-foreground)]" : "text-[color:var(--habit-deep)]")}>
        {node.titulo}
      </p>
    </div>
  );
}

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

function NodeSheet({
  node,
  status,
  onClose,
  onConcluir,
}: {
  node: TrilhaNode;
  status: "completo" | "atual" | "bloqueado";
  onClose: () => void;
  onConcluir: () => void;
}) {
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
            onClick={onConcluir}
            disabled={status !== "atual"}
            className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-leaf text-sm font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop disabled:opacity-50"
          >
            {status === "completo" ? "Já concluído ✓" : "Marcar como feito"}
            {status !== "completo" && (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function previewFor(node: TrilhaNode): string {
  switch (node.kind) {
    case "oracao":
      return "Pratique a oração com áudio e gestos. Marque como concluída quando rezar.";
    case "licao":
      return "Uma historinha curta com ilustrações e 3 perguntas de revisão.";
    case "video":
      return "Animação curta para assistir com a família.";
    case "quiz":
      return "Perguntas rápidas — acerte tudo para ganhar bônus de lírios.";
    case "missao":
      return "Uma missão para viver em casa esta semana — registre depois com a família.";
    case "bau":
      return "Abra o baú do Frei Antônio: figurinha exclusiva + lírios para colecionar.";
  }
}
