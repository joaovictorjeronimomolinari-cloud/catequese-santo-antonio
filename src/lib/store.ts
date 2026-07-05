/* ------------------------------------------------------------------ */
/*  Catequizando Digital — store local (localStorage)                  */
/*  Perfis, progresso e trilha em cache local (não sensíveis).         */
/*  Autenticação e sessão vivem no Lovable Cloud (Supabase Auth).      */
/* ------------------------------------------------------------------ */
import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  quizRespostas?: string; // ex.: "ABACDEABCD..." (20 letras quando concluído)
  santoPadroeiroId?: string | null;
  colecaoSantos?: string[]; // ids dos santos colecionados
};

export type Session =
  | { kind: "aluno"; id: string }
  | { kind: "catequista"; id: string }
  | { kind: "admin"; id: string; nome?: string; email?: string }
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
    const parsed = JSON.parse(raw) as Partial<State> & { session?: unknown };
    // Estado antigo pode conter senhas em texto puro e uma sessão de admin
    // gravada no localStorage. Limpamos ambos ao carregar para que nunca mais
    // vivam no navegador — auth agora é 100% servidor (Supabase Auth).
    if (Array.isArray(parsed.alunos)) {
      parsed.alunos = parsed.alunos.map((a) => {
        const clone = { ...(a as Aluno & { senha?: string }) };
        delete clone.senha;
        return clone as Aluno;
      });
    }
    if (Array.isArray(parsed.catequistas)) {
      parsed.catequistas = parsed.catequistas.map((c) => {
        const clone = { ...(c as Catequista & { senha?: string }) };
        delete clone.senha;
        return clone as Catequista;
      });
    }
    delete parsed.session;
    return { ...empty, ...(parsed as Partial<State>) };
  } catch {
    return empty;
  }
}

let cache: State = read();
const listeners = new Set<() => void>();

// Após a migração para Supabase Auth, sanitizamos qualquer estado antigo
// (senhas / sessão salvas em versões anteriores) uma única vez.
if (typeof window !== "undefined") {
  try {
    const { session: _drop, ...persisted } = cache;
    window.localStorage.setItem(KEY, JSON.stringify(persisted));
  } catch {}
}

function write(next: State) {
  cache = next;
  if (typeof window !== "undefined") {
    const { session: _drop, ...persisted } = next;
    window.localStorage.setItem(KEY, JSON.stringify(persisted));
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
    // A sessão vem do Lovable Cloud e fica só em memória. Como `read()` nunca
    // traz sessão do localStorage, preservar a sessão atual evita que a montagem
    // de uma nova rota apague o login recém-feito e redirecione de volta.
    const fresh = { ...read(), session: cache.session };
    if (JSON.stringify(fresh) !== JSON.stringify(cache)) {
      cache = fresh;
      listeners.forEach((l) => l());
    }
  }, []);
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return selector(state);
}

/* ------------------ Admins (derivados do papel no servidor) ------------------ */

export type Admin = {
  id: string;
  nome: string;
  apelido: string;
};

/* ------------------ Sessão (vinda do Supabase Auth) ------------------ */

export type SessionKind = "aluno" | "catequista" | "admin";

/** Chamada pelo bootstrap em __root.tsx sempre que a sessão do Supabase muda. */
export function setSessionFromAuth(session: Session) {
  if (JSON.stringify(cache.session) === JSON.stringify(session)) return;
  write({ ...cache, session });
}

/* ------------------ Auth ------------------ */

export type LoginResult =
  | { ok: true; session: NonNullable<Session> }
  | { ok: false; reason: "nao-encontrado" | "senha-invalida" | "pendente" | "rejeitado" };

/**
 * Autentica via Lovable Cloud (Supabase Auth). Não guarda senha em nenhum
 * lugar — o cliente envia direto para o servidor, que devolve um token de
 * sessão de curta duração assinado.
 */
export async function login(email: string, senha: string): Promise<LoginResult> {
  const identificador = email.trim();
  // Se não parece e-mail, tenta resolver por nome cadastrado (aluno ou catequista).
  let emailReal = identificador.toLowerCase();
  if (!identificador.includes("@")) {
    const alvo = identificador.toLowerCase();
    const aluno = cache.alunos.find(
      (a) => a.nome.trim().toLowerCase() === alvo && !!a.email,
    );
    const cateq = cache.catequistas.find(
      (c) => c.nome.trim().toLowerCase() === alvo && !!c.email,
    );
    const encontrado = aluno?.email ?? cateq?.email;
    if (!encontrado) return { ok: false, reason: "nao-encontrado" };
    emailReal = encontrado.toLowerCase();
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailReal,
    password: senha,
  });
  if (error || !data.user) {
    const msg = (error?.message ?? "").toLowerCase();
    if (msg.includes("invalid")) return { ok: false, reason: "senha-invalida" };
    if (msg.includes("email not confirmed")) return { ok: false, reason: "pendente" };
    return { ok: false, reason: "nao-encontrado" };
  }
  const kind = await resolveKindFromRoles(data.user.id);
  const nome = (data.user.user_metadata?.nome as string | undefined) ?? data.user.email ?? "";
  const s: NonNullable<Session> =
    kind === "admin"
      ? { kind: "admin", id: data.user.id, nome, email: data.user.email ?? undefined }
      : { kind, id: data.user.id };

  // Bloqueia acesso de aluno/catequista com cadastro local pendente ou rejeitado.
  if (kind === "aluno") {
    const a = cache.alunos.find((x) => x.id === data.user!.id);
    if (a?.status === "pending") { await supabase.auth.signOut(); return { ok: false, reason: "pendente" }; }
    if (a?.status === "rejected") { await supabase.auth.signOut(); return { ok: false, reason: "rejeitado" }; }
  } else if (kind === "catequista") {
    const c = cache.catequistas.find((x) => x.id === data.user!.id);
    if (c?.status === "pending") { await supabase.auth.signOut(); return { ok: false, reason: "pendente" }; }
    if (c?.status === "rejected") { await supabase.auth.signOut(); return { ok: false, reason: "rejeitado" }; }
  }

  write({ ...cache, session: s });
  return { ok: true, session: s };
}

async function resolveKindFromRoles(userId: string): Promise<SessionKind> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const roles = (data ?? []).map((r) => r.role as SessionKind);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("catequista")) return "catequista";
  return "aluno";
}

export async function logout() {
  await supabase.auth.signOut();
  write({ ...cache, session: null });
}

/* ------------------ Registros pendentes ------------------ */

export type RegistrarAlunoInput = Omit<Aluno, "id" | "status" | "criadoEm"> & {
  email: string;
  password: string;
};

export type RegistrarResult<T> =
  | { ok: true; record: T }
  | { ok: false; reason: "email-em-uso" | "email-invalido" | "senha-fraca" | "erro" };

export async function registrarAluno(input: RegistrarAlunoInput): Promise<RegistrarResult<Aluno>> {
  const { email, password, ...rest } = input;
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: { kind: "aluno", nome: rest.nome },
    },
  });
  if (error || !data.user) return { ok: false, reason: mapSignupError(error?.message) };
  const novo: Aluno = {
    ...rest,
    email,
    catequistaId: rest.catequistaId ?? null,
    id: data.user.id,
    status: "pending",
    criadoEm: Date.now(),
  };
  write({ ...cache, alunos: [...cache.alunos, novo] });
  return { ok: true, record: novo };
}

export type RegistrarCatequistaInput = Omit<Catequista, "id" | "status" | "criadoEm"> & {
  password: string;
};

export async function registrarCatequista(
  input: RegistrarCatequistaInput,
): Promise<RegistrarResult<Catequista>> {
  const { password, ...rest } = input;
  const { data, error } = await supabase.auth.signUp({
    email: rest.email.trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: { kind: "catequista", nome: rest.nome },
    },
  });
  if (error || !data.user) return { ok: false, reason: mapSignupError(error?.message) };
  const novo: Catequista = {
    ...rest,
    id: data.user.id,
    status: "pending",
    criadoEm: Date.now(),
  };
  write({ ...cache, catequistas: [...cache.catequistas, novo] });
  return { ok: true, record: novo };
}

function mapSignupError(msg?: string): "email-em-uso" | "email-invalido" | "senha-fraca" | "erro" {
  const m = (msg ?? "").toLowerCase();
  if (m.includes("already") || m.includes("registered") || m.includes("exists")) return "email-em-uso";
  if (m.includes("email")) return "email-invalido";
  if (m.includes("password") || m.includes("weak") || m.includes("pwned")) return "senha-fraca";
  return "erro";
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
  quizRespostas: "",
  santoPadroeiroId: null,
  colecaoSantos: [],
};

export function getProgresso(alunoId: string): ProgressoAluno {
  return { ...emptyProg, ...(cache.progresso[alunoId] ?? {}) };
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

/* ------------------ Devocional (Crisma) ------------------ */

export function salvarQuizDevocional(
  alunoId: string,
  respostas: string,
  padroeiroId: string,
) {
  const prev = getProgresso(alunoId);
  const colecao = prev.colecaoSantos ?? [];
  const next: ProgressoAluno = {
    ...prev,
    quizRespostas: respostas,
    santoPadroeiroId: padroeiroId,
    colecaoSantos: colecao.includes(padroeiroId) ? colecao : [...colecao, padroeiroId],
  };
  write({ ...cache, progresso: { ...cache.progresso, [alunoId]: next } });
}

export function refazerQuizDevocional(alunoId: string) {
  const prev = getProgresso(alunoId);
  const next: ProgressoAluno = {
    ...prev,
    quizRespostas: "",
    santoPadroeiroId: null,
  };
  write({ ...cache, progresso: { ...cache.progresso, [alunoId]: next } });
}

export function toggleSantoColecao(alunoId: string, santoId: string) {
  const prev = getProgresso(alunoId);
  const colecao = prev.colecaoSantos ?? [];
  const novo = colecao.includes(santoId)
    ? colecao.filter((s) => s !== santoId)
    : [...colecao, santoId];
  const next: ProgressoAluno = { ...prev, colecaoSantos: novo };
  write({ ...cache, progresso: { ...cache.progresso, [alunoId]: next } });
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
  const s = cache.session;
  const nome = s.nome ?? s.email ?? "Coordenação";
  const apelido = (nome.split(" ")[0] ?? "Coordenação") as string;
  return { id: s.id, nome, apelido };
}

/* ------------------ Admin: mover aluno de turma ------------------ */
export function moverAluno(alunoId: string, catequistaId: string | null) {
  write({
    ...cache,
    alunos: cache.alunos.map((a) =>
      a.id === alunoId ? { ...a, catequistaId: catequistaId ?? null } : a,
    ),
  });
}

/* ------------------ Sync com contas de teste (semeadas no servidor) ------------------ */

export type SeedProfile = {
  id: string;
  email: string;
  nome: string;
  kind: "admin" | "catequista" | "aluno";
  etapa?: EtapaId;
};

/**
 * Garante que os perfis locais (aluno/catequista) das contas semeadas existam
 * no cache — assim os cards aparecem no painel do admin mesmo em dispositivos
 * onde ninguém preencheu o formulário. Idempotente.
 */
export function upsertSeededProfiles(profiles: SeedProfile[]) {
  let alunos = cache.alunos;
  let catequistas = cache.catequistas;
  const agora = Date.now();
  for (const p of profiles) {
    if (p.kind === "aluno") {
      const existe = alunos.some((a) => a.id === p.id);
      if (!existe) {
        alunos = [
          ...alunos,
          {
            id: p.id,
            nome: p.nome,
            nascimento: "",
            sexo: "",
            etapa: (p.etapa ?? "primeira-comunhao") as EtapaId,
            responsavel: "Conta de teste",
            telefone: "",
            email: p.email,
            comunidade: "matriz",
            catequistaId: null,
            status: "approved",
            criadoEm: agora,
            seed: true,
          },
        ];
      }
    } else if (p.kind === "catequista") {
      const existe = catequistas.some((c) => c.id === p.id);
      if (!existe) {
        catequistas = [
          ...catequistas,
          {
            id: p.id,
            nome: p.nome,
            email: p.email,
            nascimento: "",
            telefone: "",
            comunidade: "matriz",
            etapas: (p.etapa ? [p.etapa] : ["primeira-comunhao", "crisma"]) as EtapaId[],
            status: "approved",
            criadoEm: agora,
          },
        ];
      }
    }
  }
  if (alunos !== cache.alunos || catequistas !== cache.catequistas) {
    write({ ...cache, alunos, catequistas });
  }
}

/** Remove o perfil local (aluno/catequista) associado ao user id. */
export function removerPerfilLocal(userId: string) {
  const alunos = cache.alunos.filter((a) => a.id !== userId);
  const catequistas = cache.catequistas.filter((c) => c.id !== userId);
  if (alunos.length !== cache.alunos.length || catequistas.length !== cache.catequistas.length) {
    write({ ...cache, alunos, catequistas });
  }
}
