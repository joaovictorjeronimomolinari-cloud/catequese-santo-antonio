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
  endereco?: string;
  bairro?: string;
  batizado?: "sim" | "nao" | "";
  batismoParoquia?: string;
  batismoData?: string;
  eucaristia?: boolean;
  crisma?: boolean;
  observacoes?: string;
  status: "pending" | "approved" | "rejected";
  criadoEm: number;
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
};

const KEY = "cd:state:v1";

const empty: State = {
  alunos: [],
  catequistas: [],
  progresso: {},
  session: null,
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
  return useSyncExternalStore(subscribe, () => selector(cache), () => selector(empty));
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
  write({
    ...cache,
    alunos: cache.alunos.map((a) => (a.id === id ? { ...a, status: "approved" } : a)),
  });
}

export function reprovarAluno(id: string) {
  write({
    ...cache,
    alunos: cache.alunos.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)),
  });
}

export function aprovarCatequista(id: string) {
  write({
    ...cache,
    catequistas: cache.catequistas.map((c) =>
      c.id === id ? { ...c, status: "approved" } : c,
    ),
  });
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
  const delta = diffDays(prev.lastDay, today);
  const streak = !prev.lastDay ? 1 : delta === 0 ? prev.streak : delta === 1 ? prev.streak + 1 : 1;
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
