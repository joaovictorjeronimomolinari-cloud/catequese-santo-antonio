import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  HandHeart,
  Star,
  PlayCircle,
  HelpCircle,
  Gift,
  Flame,
  Sparkles,
  Lock,
  Clock,
  Check,
  Compass,
  PartyPopper,
  Search,
  Shuffle,
  Eye,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import {
  completarNode,
  faixaDe,
  useStore,
  type Faixa,
  type CrismaUnidade,
  type Liberacao,
  CRISMA_TRAIL_DEFAULT,
} from "@/lib/store";
import {
  ATIVIDADES_INTERATIVAS,
  trilhaInfantilDe,
  type InfantilUnidade,
} from "@/lib/atividades-infantis";
import { InteractiveActivity } from "@/components/atividades/InteractiveActivity";
import { playSfx } from "@/lib/preferences";

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

type NodeKind =
  | "licao"
  | "oracao"
  | "missao"
  | "video"
  | "quiz"
  | "bau"
  | "caca-palavras"
  | "cenas-biblicas"
  | "sete-erros"
  | "quebra-cabeca";
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

const KIND_META: Record<NodeKind, { Icon: LucideIcon; rotulo: string }> = {
  licao: { Icon: BookOpen, rotulo: "Lição" },
  oracao: { Icon: HandHeart, rotulo: "Oração" },
  missao: { Icon: Star, rotulo: "Missão" },
  video: { Icon: PlayCircle, rotulo: "Vídeo" },
  quiz: { Icon: HelpCircle, rotulo: "Quiz" },
  bau: { Icon: Gift, rotulo: "Baú" },
  "caca-palavras": { Icon: Search, rotulo: "Caça-palavras" },
  "cenas-biblicas": { Icon: Shuffle, rotulo: "Cenas bíblicas" },
  "sete-erros": { Icon: Eye, rotulo: "7 erros" },
  "quebra-cabeca": { Icon: Puzzle, rotulo: "Quebra-cabeça" },
};

function trilhaParaFaixa(f: Faixa): Unidade[] {
  return f === "jovem" ? TRILHA_JOVEM : TRILHA_INFANTIL;
}

/** Converte trilha infantil (por etapa) no formato visual da trilha. */
function infantilParaUnidades(units: InfantilUnidade[]): Unidade[] {
  return units.map((u) => ({
    id: u.id,
    numero: u.numero,
    titulo: u.titulo,
    subtitulo: u.subtitulo,
    cor: u.cor,
    nodes: u.nodes.map<TrilhaNode>((n) => ({
      id: n.id,
      titulo: n.titulo,
      kind: n.kind as NodeKind,
      xp: n.xp,
    })),
  }));
}

/** Converte a trilha de Crisma (editável pelo adm) no formato visual da trilha. */
function crismaParaUnidades(units: CrismaUnidade[]): Unidade[] {
  return units.map((u) => ({
    id: u.id,
    numero: u.numero,
    titulo: u.titulo,
    subtitulo: u.subtitulo,
    cor: u.cor,
    nodes: u.atividades.map<TrilhaNode>((a, i, arr) => ({
      id: a.id,
      titulo: a.titulo,
      kind: i === arr.length - 1 ? "missao" : "licao",
      xp: i === arr.length - 1 ? 30 : 20,
    })),
  }));
}

type NodeStatus = "completo" | "atual" | "bloqueado" | "trancado" | "vencido";

/* ──────────────────────────────────────────────────────────────── */
/*  Página                                                          */
/* ──────────────────────────────────────────────────────────────── */
function AtividadesPage() {
  const aluno = useStore((s) =>
    s.session?.kind === "aluno" ? s.alunos.find((a) => a.id === s.session!.id) ?? null : null,
  );
  const prog = useStore((s) => (aluno ? s.progresso[aluno.id] : undefined));
  const crismaTrail = useStore((s) => s.crismaTrail);
  const liberacoes = useStore((s) =>
    aluno?.catequistaId ? s.liberacoes[aluno.catequistaId] ?? {} : {},
  );
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);

  if (!aluno) return null;
  const faixa = faixaDe(aluno.etapa);
  const unidades = (() => {
    if (faixa === "jovem") return crismaParaUnidades(crismaTrail ?? CRISMA_TRAIL_DEFAULT);
    const infantilTrilha = trilhaInfantilDe(aluno.etapa);
    if (infantilTrilha) return infantilParaUnidades(infantilTrilha);
    return trilhaParaFaixa(faixa);
  })();
  const completed = new Set(prog?.completed ?? []);
  const now = Date.now();
  const requerLiberacao = faixa === "jovem";

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

  function statusOf(id: string): NodeStatus {
    if (completed.has(id)) return "completo";
    if (id !== firstPending) return "bloqueado";
    if (!requerLiberacao) return "atual";
    const lib: Liberacao | undefined = liberacoes[id];
    if (!lib) return "trancado";
    if (lib.deadline < now) return "vencido";
    return "atual";
  }

  function concluir(node: TrilhaNode) {
    if (!aluno) return;
    if (statusOf(node.id) !== "atual") return;
    completarNode(aluno.id, node.id, node.xp, node.kind === "bau" ? 3 : 1);
    playSfx(node.kind === "bau" ? "achievement" : "success");
    setOpenNodeId(null);
  }

  function libInfo(id: string): Liberacao | null {
    return liberacoes[id] ?? null;
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
              <ArrowLeft className="h-5 w-5" strokeWidth={2.6} />
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
              <StatusChip Icon={Flame} v={String(stats.streak)} k="seq." tone="gold" />
              <StatusChip Icon={Star} v={String(stats.xp)} k="xp" tone="leaf" />
              <StatusChip Icon={Sparkles} v={String(stats.lirios)} k="lírios" tone="sky" />
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

      {requerLiberacao && !aluno.catequistaId && (
        <div className="mx-auto mt-5 max-w-3xl px-5">
          <div className="rounded-3xl border-[3px] border-[color:var(--gold)] bg-[color:var(--gold-soft)]/70 p-5 text-center shadow-pop">
            <Compass className="mx-auto h-7 w-7 text-[color:var(--habit-deep)]" strokeWidth={2.4} />
            <h3 className="mt-1 font-display text-lg font-extrabold text-[color:var(--habit-deep)]">
              Aguardando seu(sua) catequista
            </h3>
            <p className="mt-1 text-[12px] font-bold text-[color:var(--habit-deep)]/80">
              A coordenação ainda não vinculou sua matrícula a uma turma. Assim que houver um(a)
              catequista da sua comunidade, suas atividades começarão a ser liberadas.
            </p>
          </div>
        </div>
      )}

      <section className="mx-auto mt-7 max-w-3xl px-5">
        {unidades.map((u, idx) => (
          <UnidadeBlock
            key={u.id}
            unidade={u}
            statusOf={statusOf}
            libInfo={libInfo}
            onOpen={setOpenNodeId}
            isFirst={idx === 0}
          />
        ))}
        {stats.done === stats.total && (
          <div className="mt-10 rounded-3xl border-[3px] border-[color:var(--gold)] bg-gradient-gold p-6 text-center shadow-gold-pop">
            <PartyPopper className="mx-auto h-8 w-8 text-[color:var(--habit-deep)]" strokeWidth={2.4} />
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
          liberacao={libInfo(openNode.id)}
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
  libInfo,
  onOpen,
  isFirst,
}: {
  unidade: Unidade;
  statusOf: (id: string) => NodeStatus;
  libInfo: (id: string) => Liberacao | null;
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
                <NodeBubble
                  node={node}
                  status={statusOf(node.id)}
                  liberacao={libInfo(node.id)}
                  onOpen={onOpen}
                />
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
  liberacao,
  onOpen,
}: {
  node: TrilhaNode;
  status: NodeStatus;
  liberacao: Liberacao | null;
  onOpen: (id: string) => void;
}) {
  const meta = KIND_META[node.kind];
  const isLocked = status === "bloqueado" || status === "trancado" || status === "vencido";
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

  const LockI = status === "vencido" ? Clock : Lock;
  const KindI = meta.Icon;

  return (
    <div className="relative">
      {isCurrent && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[color:var(--habit-deep)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop">
          ▼ Comece aqui
        </span>
      )}
      <button
        type="button"
        disabled={status === "bloqueado"}
        onClick={() => onOpen(node.id)}
        aria-label={`${meta.rotulo}: ${node.titulo}`}
        className={
          "relative flex h-[76px] w-[76px] items-center justify-center rounded-[28px] border-[3px] border-[color:var(--habit-deep)] shadow-pop ring-4 transition-transform " +
          face + " " + ring +
          (status === "bloqueado" ? " cursor-not-allowed opacity-80" : " hover:-translate-y-0.5 active:translate-y-0")
        }
      >
        {isLocked ? <LockI className="h-8 w-8" strokeWidth={2.4} /> : <KindI className="h-9 w-9" strokeWidth={2.2} />}
        {isDone && (
          <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--lily)] text-[color:var(--leaf)] shadow-pop ring-2 ring-[color:var(--leaf)]/40">
            <Check className="h-4 w-4" strokeWidth={3.5} />
          </span>
        )}
      </button>
      <p className={"mt-1 max-w-[120px] text-center text-[11px] font-extrabold leading-tight " + (isLocked ? "text-[color:var(--muted-foreground)]" : "text-[color:var(--habit-deep)]")}>
        {node.titulo}
      </p>
      {isCurrent && liberacao && (
        <p className="mt-0.5 flex max-w-[140px] items-center justify-center gap-1 text-center text-[10px] font-black uppercase tracking-wider text-[color:var(--habit)]">
          <Clock className="h-3 w-3" strokeWidth={2.6} />
          {formatDeadline(liberacao.deadline)}
        </p>
      )}
      {status === "trancado" && (
        <p className="mt-0.5 max-w-[140px] text-center text-[10px] font-bold text-[color:var(--muted-foreground)]">
          Aguardando liberação
        </p>
      )}
      {status === "vencido" && (
        <p className="mt-0.5 max-w-[140px] text-center text-[10px] font-black uppercase tracking-wider text-[color:var(--destructive)]">
          Prazo encerrado
        </p>
      )}
    </div>
  );
}

function StatusChip({ Icon, v, k, tone }: { Icon: LucideIcon; v: string; k: string; tone: "gold" | "leaf" | "sky" }) {
  const cls =
    tone === "gold"
      ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
      : tone === "leaf"
      ? "bg-gradient-leaf text-[color:var(--lily)] shadow-pop"
      : "bg-[color:var(--sky)] text-[color:var(--habit-deep)] shadow-pop";
  return (
    <span className={"flex h-9 items-center gap-1 rounded-full px-2.5 text-[11px] font-black " + cls}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.6} />
      <span className="leading-none">{v}</span>
      <span className="text-[9px] font-extrabold uppercase tracking-wider opacity-80">{k}</span>
    </span>
  );
}

function NodeSheet({
  node,
  status,
  liberacao,
  onClose,
  onConcluir,
}: {
  node: TrilhaNode;
  status: NodeStatus;
  liberacao: Liberacao | null;
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
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop">
            <meta.Icon className="h-8 w-8" strokeWidth={2.2} />
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

        {(() => {
          const interativa = ATIVIDADES_INTERATIVAS[node.id];
          const podeJogar = status === "atual" || status === "completo";
          if (interativa && podeJogar) {
            return (
              <div className="mt-4 max-h-[65vh] overflow-y-auto">
                <InteractiveActivity
                  atividade={interativa}
                  concluida={status === "completo"}
                  onCompleta={onConcluir}
                />
              </div>
            );
          }
          return (
            <p className="mt-4 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-3 text-[13px] font-semibold text-[color:var(--habit-deep)]">
              {previewFor(node)}
            </p>
          );
        })()}

        {liberacao && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--gold-soft)] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
            ⏳ Prazo: {formatDeadline(liberacao.deadline)}
          </p>
        )}
        {status === "trancado" && (
          <p className="mt-3 rounded-2xl border-2 border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] p-3 text-[12px] font-bold text-[color:var(--habit-deep)]">
            Esta atividade ainda não foi liberada pelo(a) seu(sua) catequista.
          </p>
        )}
        {status === "vencido" && (
          <p className="mt-3 rounded-2xl border-2 border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/10 p-3 text-[12px] font-bold text-[color:var(--destructive)]">
            O prazo desta atividade encerrou. Procure seu(sua) catequista para reabrir.
          </p>
        )}

        <div className="mt-4 flex gap-2 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop"
          >
            {ATIVIDADES_INTERATIVAS[node.id] ? "Fechar" : "Mais tarde"}
          </button>
          {!ATIVIDADES_INTERATIVAS[node.id] && (
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
          )}
        </div>
      </div>
    </div>
  );
}

function formatDeadline(deadline: number): string {
  const ms = deadline - Date.now();
  if (ms <= 0) return "vencido";
  const dias = Math.floor(ms / 86_400_000);
  const horas = Math.floor((ms % 86_400_000) / 3_600_000);
  if (dias >= 1) return `${dias}d ${horas}h restantes`;
  return `${horas}h restantes`;
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
    case "caca-palavras":
      return "Toque na primeira e na última letra de cada palavra escondida.";
    case "cenas-biblicas":
      return "Toque nas cenas na ordem certa em que a história aconteceu.";
    case "sete-erros":
      return "Encontre os 7 símbolos escondidos na cena.";
    case "quebra-cabeca":
      return "Toque em cada peça pra ver a imagem completa.";
  }
}
