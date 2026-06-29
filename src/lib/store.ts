/* ------------------------------------------------------------------ */
/*  Catequizando Digital — store local (localStorage)                  */
/*  Implementação client-side enquanto não há backend conectado.       */
/* ------------------------------------------------------------------ */
import { useEffect, useSyncExternalStore } from "react";

export type Faixa = "infantil" | "jovem";
export type EtapaId = "pre-catequese" | "primeira-comunhao" | "crisma";

export function faixaDe(etapa: EtapaId): Faixa {
  return etapa === "crisma" ? "jovem" : "infantil";
}

/* ------------------ Comunidades (turmas paroquiais) ------------------ */
export type Comunidade = { id: string; nome: string; emoji: string };
export const COMUNIDADES: Comunidade[] = [
  { id: "matriz", nome: "Igreja Matriz", emoji: "⛪" },
  { id: "santuario", nome: "Santuário", emoji: "🕯️" },
  { id: "santa-rita", nome: "Santa Rita de Cássia", emoji: "🌹" },
  { id: "guadalupe", nome: "N. Sra. de Guadalupe", emoji: "🌺" },
  { id: "sao-benedito", nome: "São Benedito", emoji: "🙏" },
  { id: "sagrada-familia", nome: "Sagrada Família", emoji: "👨‍👩‍👧" },
  { id: "sao-francisco", nome: "São Francisco de Assis", emoji: "🕊️" },
  { id: "sao-judas", nome: "São Judas Tadeu", emoji: "✨" },
];

export function comunidadeNome(id?: string | null) {
  if (!id) return "—";
  return COMUNIDADES.find((c) => c.id === id)?.nome ?? id;
}

export type Aluno = {
  id: string;
  nome: string;
  senha: string;
  nascimento: string;
  sexo: "F" | "M" | "";
  etapa: EtapaId;
  responsavel: string;
  telefone: string;
  email?: string;
  comunidade: string;
  catequistaId?: string | null;
  batizado?: "sim" | "nao" | "";
  batismoParoquia?: string;
  batismoData?: string;
  eucaristia?: boolean;
  crisma?: boolean;
  observacoes?: string;
  status: "pending" | "approved" | "rejected";
  criadoEm: number;
  seed?: boolean;
};

export type Catequista = {
  id: string;
  nome: string;
  apelido?: string;
  senha: string;
  nascimento: string;
  email: string;
  telefone: string;
  endereco?: string;
  bairro?: string;
  comunidade?: string;
  anos?: number;
  etapas: EtapaId[];
  diasDisponiveis?: string[];
  sacBatismo?: boolean;
  sacEucaristia?: boolean;
  sacCrisma?: boolean;
  biblia?: boolean;
  foto?: string | null;
  status: "pending" | "approved" | "rejected";
  criadoEm: number;
};

export type ProgressoAluno = {
  completed: string[]; // node ids
  xp: number;
  lirios: number;
  streak: number;
  lastDay: string; // YYYY-MM-DD
};

export type Session =
  | { kind: "aluno"; id: string }
  | { kind: "catequista"; id: string }
  | { kind: "admin"; id: "joao-victor" | "responsavel" }
  | null;

export type State = {
  alunos: Aluno[];
  catequistas: Catequista[];
  progresso: Record<string, ProgressoAluno>;
  session: Session;
  liberacoes: Record<string, Record<string, Liberacao>>; // por catequistaId -> nodeId
  crismaTrail?: CrismaUnidade[];
};

/* ------------------ Trilha de Crisma (editável por adm) ------------------ */
export type CrismaAtividade = { id: string; titulo: string };
export type CrismaUnidade = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  cor: "gold" | "leaf" | "habit" | "sky";
  atividades: CrismaAtividade[];
};

export const CRISMA_TRAIL_DEFAULT: CrismaUnidade[] = [
  {
    id: "u1", numero: 1, titulo: "Fé professada", cor: "habit",
    subtitulo: "Aquilo que cremos como Igreja",
    atividades: [
      { id: "u1-1", titulo: "A fé como dom de Deus" },
      { id: "u1-2", titulo: "Nossa resposta ao dom de Deus" },
      { id: "u1-3", titulo: "Creio em Deus, Pai amoroso" },
      { id: "u1-4", titulo: "Creio em Jesus Cristo" },
      { id: "u1-5", titulo: "Creio no Espírito Santo" },
      { id: "u1-6", titulo: "Conclusão: o que aprendi, quais dúvidas ainda tenho?" },
    ],
  },
  {
    id: "u2", numero: 2, titulo: "Fé celebrada", cor: "gold",
    subtitulo: "Os sacramentos na vida cristã",
    atividades: [
      { id: "u2-1", titulo: "Atividade 1" },
      { id: "u2-2", titulo: "Atividade 2" },
      { id: "u2-3", titulo: "Atividade 3" },
      { id: "u2-4", titulo: "Atividade 4" },
      { id: "u2-5", titulo: "Conclusão: o que aprendi, quais dúvidas ainda tenho?" },
    ],
  },
  {
    id: "u3", numero: 3, titulo: "Fé vivida", cor: "leaf",
    subtitulo: "A vida segundo o Evangelho",
    atividades: [
      { id: "u3-1", titulo: "Atividade 1" },
      { id: "u3-2", titulo: "Atividade 2" },
      { id: "u3-3", titulo: "Atividade 3" },
      { id: "u3-4", titulo: "Atividade 4" },
      { id: "u3-5", titulo: "Atividade 5" },
      { id: "u3-6", titulo: "Conclusão: o que aprendi, quais dúvidas ainda tenho?" },
    ],
  },
  {
    id: "u4", numero: 4, titulo: "Fé rezada", cor: "sky",
    subtitulo: "A oração que sustenta o discípulo",
    atividades: [
      { id: "u4-1", titulo: "Atividade 1" },
      { id: "u4-2", titulo: "Atividade 2" },
      { id: "u4-3", titulo: "Atividade 3" },
      { id: "u4-4", titulo: "Atividade 4" },
      { id: "u4-5", titulo: "Atividade 5" },
      { id: "u4-6", titulo: "Conclusão: o que aprendi, quais dúvidas ainda tenho?" },
    ],
  },
];

/* ------------------ Liberações (por turma = catequistaId) ------------------ */
export type Liberacao = { releasedAt: number; deadline: number };

const KEY = "cd:state:v2";

const empty: State = {
  alunos: [],
  catequistas: [],
  progresso: {},
  session: null,
  liberacoes: {},
};

function read(): State {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

let cache: State = read();
const listeners = new Set<() => void>();

/* ------------------------------------------------------------------ */
/*  ⚠️  CONTAS DE TESTE TEMPORÁRIAS                                    */
/*  Para remover: apague o array TEST_ALUNOS e a chamada               */
/*  ensureTestAccounts() abaixo.                                       */
/* ------------------------------------------------------------------ */
const TEST_ALUNOS: Aluno[] = [
  {
    id: "seed-pedro-teste",
    nome: "Pedro teste",
    senha: "pedro182",
    nascimento: "2014-01-01",
    sexo: "M",
    etapa: "primeira-comunhao",
    responsavel: "Responsável teste",
    telefone: "(00) 00000-0000",
    email: "",
    comunidade: "matriz",
    catequistaId: null,
    batizado: "sim",
    batismoParoquia: "Paróquia Santo Antônio",
    batismoData: "",
    eucaristia: false,
    crisma: false,
    observacoes: "Conta temporária de teste — Primeira Comunhão.",
    status: "approved",
    criadoEm: 0,
    seed: true,
  },
  {
    id: "seed-joao-teste",
    nome: "João teste",
    senha: "joao182",
    nascimento: "2010-01-01",
    sexo: "M",
    etapa: "crisma",
    responsavel: "Responsável teste",
    telefone: "(00) 00000-0000",
    email: "",
    comunidade: "matriz",
    catequistaId: null,
    batizado: "sim",
    batismoParoquia: "Paróquia Santo Antônio",
    batismoData: "",
    eucaristia: true,
    crisma: false,
    observacoes: "Conta temporária de teste — Crisma.",
    status: "approved",
    criadoEm: 0,
    seed: true,
  },
];

function ensureTestAccounts(state: State): State {
  const existentes = new Map(state.alunos.map((a) => [a.id, a] as const));
  let mudou = false;
  for (const t of TEST_ALUNOS) {
    if (!existentes.has(t.id)) {
      existentes.set(t.id, t);
      mudou = true;
    }
  }
  return mudou ? { ...state, alunos: Array.from(existentes.values()) } : state;
}

cache = ensureTestAccounts(cache);
if (typeof window !== "undefined") {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {}
}

function write(next: State) {
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return cache;
}

function getServerSnapshot() {
  return empty;
}

export function useStore<T>(selector: (s: State) => T): T {
  // sync local cache with localStorage on mount to survive reloads
  useEffect(() => {
    const fresh = read();
    if (JSON.stringify(fresh) !== JSON.stringify(cache)) {
      cache = fresh;
      listeners.forEach((l) => l());
    }
  }, []);
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return selector(state);
}

/* ------------------ Admins fixos (não persistidos) ------------------ */

export type Admin = {
  id: "joao-victor" | "responsavel";
  nome: string;
  senha: string;
  apelido: string;
};

export const ADMINS: Admin[] = [
  { id: "joao-victor", nome: "João Victor Jerônimo Molinari", senha: "adm182", apelido: "João Victor" },
  { id: "responsavel", nome: "Responsável da catequese", senha: "paroquia2026", apelido: "Responsável" },
];

function norm(s: string) {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ------------------ Auth ------------------ */

export type LoginResult =
  | { ok: true; session: NonNullable<Session> }
  | { ok: false; reason: "nao-encontrado" | "senha-invalida" | "pendente" | "rejeitado" };

export function login(nome: string, senha: string, perfil: "aluno" | "catequista"): LoginResult {
  const n = norm(nome);

  if (perfil === "catequista") {
    const admin = ADMINS.find((a) => norm(a.nome) === n);
    if (admin) {
      if (admin.senha !== senha) return { ok: false, reason: "senha-invalida" };
      const s: Session = { kind: "admin", id: admin.id };
      write({ ...cache, session: s });
      return { ok: true, session: s! };
    }
    const c = cache.catequistas.find((x) => norm(x.nome) === n);
    if (!c) return { ok: false, reason: "nao-encontrado" };
    if (c.senha !== senha) return { ok: false, reason: "senha-invalida" };
    if (c.status === "pending") return { ok: false, reason: "pendente" };
    if (c.status === "rejeitado" as never) return { ok: false, reason: "rejeitado" };
    const s: Session = { kind: "catequista", id: c.id };
    write({ ...cache, session: s });
    return { ok: true, session: s! };
  }

  const a = cache.alunos.find((x) => norm(x.nome) === n);
  if (!a) return { ok: false, reason: "nao-encontrado" };
  if (a.senha !== senha) return { ok: false, reason: "senha-invalida" };
  if (a.status === "pending") return { ok: false, reason: "pendente" };
  if (a.status === "rejected") return { ok: false, reason: "rejeitado" };
  const s: Session = { kind: "aluno", id: a.id };
  write({ ...cache, session: s });
  return { ok: true, session: s! };
}

export function logout() {
  write({ ...cache, session: null });
}

/* ------------------ Registros pendentes ------------------ */

export function registrarAluno(input: Omit<Aluno, "id" | "status" | "criadoEm">): Aluno {
  const novo: Aluno = {
    ...input,
    catequistaId: input.catequistaId ?? null,
    id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    criadoEm: Date.now(),
  };
  write({ ...cache, alunos: [...cache.alunos, novo] });
  return novo;
}

export function registrarCatequista(
  input: Omit<Catequista, "id" | "status" | "criadoEm">,
): Catequista {
  const novo: Catequista = {
    ...input,
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    criadoEm: Date.now(),
  };
  write({ ...cache, catequistas: [...cache.catequistas, novo] });
  return novo;
}

export function aprovarAluno(id: string) {
  const aluno = cache.alunos.find((a) => a.id === id);
  // Aloca automaticamente na turma do catequista da mesma comunidade + etapa
  let catequistaId: string | null = aluno?.catequistaId ?? null;
  if (aluno && !catequistaId) {
    const cat = cache.catequistas.find(
      (c) =>
        c.status === "approved" &&
        c.comunidade === aluno.comunidade &&
        c.etapas.includes(aluno.etapa),
    );
    catequistaId = cat?.id ?? null;
  }
  write({
    ...cache,
    alunos: cache.alunos.map((a) =>
      a.id === id ? { ...a, status: "approved", catequistaId } : a,
    ),
  });
}

export function reprovarAluno(id: string) {
  write({
    ...cache,
    alunos: cache.alunos.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)),
  });
}

export function aprovarCatequista(id: string) {
  const next: State = {
    ...cache,
    catequistas: cache.catequistas.map((c) =>
      c.id === id ? { ...c, status: "approved" as const } : c,
    ),
  };
  // Realoca alunos órfãos (sem catequista) que combinem com a comunidade/etapa
  const cat = next.catequistas.find((c) => c.id === id);
  if (cat) {
    next.alunos = next.alunos.map((a) =>
      a.status === "approved" &&
      !a.catequistaId &&
      a.comunidade === cat.comunidade &&
      cat.etapas.includes(a.etapa)
        ? { ...a, catequistaId: cat.id }
        : a,
    );
  }
  write(next);
}

export function reprovarCatequista(id: string) {
  write({
    ...cache,
    catequistas: cache.catequistas.map((c) =>
      c.id === id ? { ...c, status: "rejected" } : c,
    ),
  });
}

/* ------------------ Progressão ------------------ */

const emptyProg: ProgressoAluno = {
  completed: [],
  xp: 0,
  lirios: 0,
  streak: 0,
  lastDay: "",
};

export function getProgresso(alunoId: string): ProgressoAluno {
  return cache.progresso[alunoId] ?? emptyProg;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function diffDays(a: string, b: string) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export function completarNode(alunoId: string, nodeId: string, xp: number, lirios = 1) {
  const prev = getProgresso(alunoId);
  if (prev.completed.includes(nodeId)) return prev;
  const today = todayStr();
  // Streak = sequência de atividades concluídas (não diária)
  const streak = prev.streak + 1;
  const next: ProgressoAluno = {
    completed: [...prev.completed, nodeId],
    xp: prev.xp + xp,
    lirios: prev.lirios + lirios,
    streak,
    lastDay: today,
  };
  write({ ...cache, progresso: { ...cache.progresso, [alunoId]: next } });
  return next;
}

/* ------------------ Liberações & Trilha custom ------------------ */

export function getLiberacoes(catequistaId: string | null | undefined): Record<string, Liberacao> {
  if (!catequistaId) return {};
  return cache.liberacoes[catequistaId] ?? {};
}

export function liberarAtividade(
  catequistaId: string,
  nodeId: string,
  prazoDias: number,
) {
  const dias = Math.max(1, Math.min(7, Math.round(prazoDias)));
  const now = Date.now();
  const atual = cache.liberacoes[catequistaId] ?? {};
  const next: Liberacao = { releasedAt: now, deadline: now + dias * 86_400_000 };
  write({
    ...cache,
    liberacoes: { ...cache.liberacoes, [catequistaId]: { ...atual, [nodeId]: next } },
  });
}

export function recolherAtividade(catequistaId: string, nodeId: string) {
  const atual = { ...(cache.liberacoes[catequistaId] ?? {}) };
  delete atual[nodeId];
  write({
    ...cache,
    liberacoes: { ...cache.liberacoes, [catequistaId]: atual },
  });
}

export function getCrismaTrail(): CrismaUnidade[] {
  return cache.crismaTrail ?? CRISMA_TRAIL_DEFAULT;
}

export function setCrismaTrail(units: CrismaUnidade[]) {
  write({ ...cache, crismaTrail: units });
}

export function resetCrismaTrail() {
  const { crismaTrail: _drop, ...rest } = cache;
  write({ ...rest });
}

export function resetProgresso(alunoId: string) {
  const { [alunoId]: _drop, ...rest } = cache.progresso;
  write({ ...cache, progresso: rest });
}

/* ------------------ Helpers ------------------ */

export function getCurrentAluno(): Aluno | null {
  if (cache.session?.kind !== "aluno") return null;
  return cache.alunos.find((a) => a.id === cache.session?.id) ?? null;
}

export function getCurrentCatequista(): Catequista | null {
  if (cache.session?.kind !== "catequista") return null;
  return cache.catequistas.find((c) => c.id === cache.session?.id) ?? null;
}

export function getCurrentAdmin(): Admin | null {
  if (cache.session?.kind !== "admin") return null;
  return ADMINS.find((a) => a.id === cache.session?.id) ?? null;
}
