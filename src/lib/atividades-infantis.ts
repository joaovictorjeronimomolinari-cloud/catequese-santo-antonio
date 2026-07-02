import criacao1 from "@/assets/atividades/criacao-1.jpg";
import criacao2 from "@/assets/atividades/criacao-2.jpg";
import criacao3 from "@/assets/atividades/criacao-3.jpg";
import prodigo1 from "@/assets/atividades/prodigo-1.jpg";
import prodigo2 from "@/assets/atividades/prodigo-2.jpg";
import prodigo3 from "@/assets/atividades/prodigo-3.jpg";
import puzzleMeninoJesus from "@/assets/atividades/puzzle-menino-jesus.jpg";
import puzzleCalice from "@/assets/atividades/puzzle-calice.jpg";

/* ─────────────────────────────────────────────────────────
 * Modelo de atividade interativa infantil
 * ───────────────────────────────────────────────────────── */
export type InfantilKind =
  | "oracao"
  | "missao"
  | "bau"
  | "caca-palavras"
  | "cenas-biblicas"
  | "sete-erros"
  | "quebra-cabeca";

export type Direcao = "H" | "V" | "D"; // horizontal, vertical, diagonal ↘

export type CacaPalavraItem = {
  palavra: string;
  row: number; // 0-based start row
  col: number; // 0-based start col
  dir: Direcao;
};

export type CacaPalavrasData = {
  tamanho: number; // grid quadrado n×n
  grid: string[][]; // letras maiúsculas
  palavras: CacaPalavraItem[];
  dica?: string;
};

export type CenaItem = { src: string; alt: string; legenda: string };
export type CenasBiblicasData = {
  intro: string;
  cenas: CenaItem[]; // já em ordem correta (1,2,3...)
};

export type DiferencaItem = {
  id: string;
  x: number; // 0-100 (%)
  y: number; // 0-100
  r: number; // raio em % da menor dimensão
  simbolo: "estrela" | "coracao" | "flor" | "cruz" | "gota" | "folha" | "circulo";
  cor: "gold" | "leaf" | "sky" | "cord";
};
export type SeteErrosData = {
  imagem: string;
  alt: string;
  diferencas: DiferencaItem[]; // exatamente 7
};

export type QuebraCabecaData = {
  imagem: string;
  alt: string;
  n: 3; // 3x3
  dica?: string;
};

export type AtividadeInterativa =
  | { kind: "caca-palavras"; data: CacaPalavrasData }
  | { kind: "cenas-biblicas"; data: CenasBiblicasData }
  | { kind: "sete-erros"; data: SeteErrosData }
  | { kind: "quebra-cabeca"; data: QuebraCabecaData };

/* ─────────────────────────────────────────────────────────
 * Trilha infantil por etapa
 * ───────────────────────────────────────────────────────── */
export type InfantilNode = {
  id: string;
  titulo: string;
  kind: InfantilKind;
  xp: number;
  descricao?: string;
};

export type InfantilUnidade = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  cor: "gold" | "leaf" | "habit" | "sky";
  nodes: InfantilNode[];
};

/* ── helpers de geração de caça-palavras ── */
function novoGrid(n: number): string[][] {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => ""));
}
function posicionar(grid: string[][], p: CacaPalavraItem) {
  const dx = p.dir === "V" ? 0 : 1;
  const dy = p.dir === "H" ? 0 : 1;
  const n = grid.length;
  const endR = p.row + (p.palavra.length - 1) * dy;
  const endC = p.col + (p.palavra.length - 1) * dx;
  if (p.row < 0 || p.col < 0 || endR >= n || endC >= n) {
    // Palavra fora do tabuleiro — ignora silenciosamente para não quebrar a UI.
    if (typeof console !== "undefined") {
      console.warn(`[caca-palavras] palavra "${p.palavra}" fora do grid ${n}x${n}, ignorada.`);
    }
    return;
  }
  for (let i = 0; i < p.palavra.length; i++) {
    grid[p.row + i * dy]![p.col + i * dx] = p.palavra[i]!;
  }
}
function preencherAleatorio(grid: string[][]) {
  const letras = "ABCDEFGHIJLMNOPRSTUV";
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r]!.length; c++) {
      if (!grid[r]![c]) {
        grid[r]![c] = letras[Math.floor((r * 7 + c * 3 + 11) % letras.length)]!;
      }
    }
  }
}
function montarCaca(palavras: CacaPalavraItem[], n = 8, dica?: string): CacaPalavrasData {
  const grid = novoGrid(n);
  palavras.forEach((p) => posicionar(grid, p));
  preencherAleatorio(grid);
  return { tamanho: n, grid, palavras, dica };
}

/* ─────────────────── PRÉ-CATEQUESE (7–9 anos) ─────────────────── */
/* Tema geral: descobrir Deus Pai, Jesus amigo e a oração em família. */
export const TRILHA_PRE_CATEQUESE: InfantilUnidade[] = [
  {
    id: "pc-u1", numero: 1, cor: "gold",
    titulo: "Deus me criou por amor",
    subtitulo: "Tudo o que existe é presente de Deus Pai",
    nodes: [
      { id: "pc1-1", titulo: "Sinal da Cruz", kind: "oracao", xp: 10 },
      { id: "pc1-2", titulo: "Organize a Criação", kind: "cenas-biblicas", xp: 25 },
      { id: "pc1-3", titulo: "Caça-palavras: dons de Deus", kind: "caca-palavras", xp: 25 },
      { id: "pc1-4", titulo: "Missão: agradecer 3 coisas", kind: "missao", xp: 20 },
      { id: "pc1-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
  {
    id: "pc-u2", numero: 2, cor: "leaf",
    titulo: "Jesus, meu melhor amigo",
    subtitulo: "Ele nasceu, cresceu e ama cada criança",
    nodes: [
      { id: "pc2-1", titulo: "Oração ao Anjo da Guarda", kind: "oracao", xp: 10 },
      { id: "pc2-2", titulo: "Quebra-cabeça: em Nazaré", kind: "quebra-cabeca", xp: 30 },
      { id: "pc2-3", titulo: "7 erros: Jesus e a família", kind: "sete-erros", xp: 30 },
      { id: "pc2-4", titulo: "Missão: ajudar em casa", kind: "missao", xp: 20 },
      { id: "pc2-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
  {
    id: "pc-u3", numero: 3, cor: "habit",
    titulo: "Rezar todos os dias",
    subtitulo: "Falar com Deus é ficar pertinho dele",
    nodes: [
      { id: "pc3-1", titulo: "Pai Nosso", kind: "oracao", xp: 10 },
      { id: "pc3-2", titulo: "Caça-palavras: da oração", kind: "caca-palavras", xp: 25 },
      { id: "pc3-3", titulo: "7 erros: cantinho de oração", kind: "sete-erros", xp: 30 },
      { id: "pc3-4", titulo: "Missão: rezar em família", kind: "missao", xp: 25 },
      { id: "pc3-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
];

/* ─────────────────── PRIMEIRA COMUNHÃO (10–13 anos) ─────────────────── */
export const TRILHA_PRIMEIRA_COMUNHAO: InfantilUnidade[] = [
  {
    id: "pe-u1", numero: 1, cor: "gold",
    titulo: "O Pai que me perdoa",
    subtitulo: "Deus corre ao meu encontro quando volto pra Ele",
    nodes: [
      { id: "pe1-1", titulo: "Ato de contrição", kind: "oracao", xp: 10 },
      { id: "pe1-2", titulo: "Organize: o Filho Pródigo", kind: "cenas-biblicas", xp: 25 },
      { id: "pe1-3", titulo: "Caça-palavras: do perdão", kind: "caca-palavras", xp: 25 },
      { id: "pe1-4", titulo: "Missão: pedir e dar perdão", kind: "missao", xp: 25 },
      { id: "pe1-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
  {
    id: "pe-u2", numero: 2, cor: "leaf",
    titulo: "A Santa Missa é festa",
    subtitulo: "Reconheço os sinais sagrados do altar",
    nodes: [
      { id: "pe2-1", titulo: "Glória a Deus", kind: "oracao", xp: 10 },
      { id: "pe2-2", titulo: "7 erros: altar da Missa", kind: "sete-erros", xp: 30 },
      { id: "pe2-3", titulo: "Quebra-cabeça: cálice e hóstia", kind: "quebra-cabeca", xp: 30 },
      { id: "pe2-4", titulo: "Missão: participar da Missa", kind: "missao", xp: 25 },
      { id: "pe2-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
  {
    id: "pe-u3", numero: 3, cor: "habit",
    titulo: "Pão da Vida — Eucaristia",
    subtitulo: "Jesus se dá de comer para o meu coração",
    nodes: [
      { id: "pe3-1", titulo: "Oração antes da comunhão", kind: "oracao", xp: 10 },
      { id: "pe3-2", titulo: "Caça-palavras: Eucaristia", kind: "caca-palavras", xp: 25 },
      { id: "pe3-3", titulo: "7 erros: a Última Ceia", kind: "sete-erros", xp: 30 },
      { id: "pe3-4", titulo: "Missão: visitar o sacrário", kind: "missao", xp: 25 },
      { id: "pe3-5", titulo: "Baú do Frei Antônio", kind: "bau", xp: 50 },
    ],
  },
];

/* ─────────────────── Payloads de atividade por node id ─────────────────── */

// PC1-3 · dons de Deus
const CACA_PC1: CacaPalavrasData = montarCaca(
  [
    { palavra: "AMOR", row: 0, col: 0, dir: "H" },
    { palavra: "FAMILIA", row: 2, col: 1, dir: "H" },
    { palavra: "VIDA", row: 5, col: 4, dir: "H" },
    { palavra: "SOL", row: 1, col: 6, dir: "V" },
    { palavra: "AGUA", row: 4, col: 0, dir: "V" },
    { palavra: "FLOR", row: 0, col: 3, dir: "V" },
  ],
  8,
  "Encontre 6 presentes que Deus fez pra você.",
);

// PC3-2 · da oração
const CACA_PC3: CacaPalavrasData = montarCaca(
  [
    { palavra: "PAI", row: 0, col: 0, dir: "H" },
    { palavra: "NOSSO", row: 2, col: 0, dir: "H" },
    { palavra: "AVE", row: 0, col: 5, dir: "V" },
    { palavra: "MARIA", row: 5, col: 2, dir: "H" },
    { palavra: "AMEM", row: 6, col: 0, dir: "V" }, // vertical curto
    { palavra: "REZAR", row: 1, col: 3, dir: "V" },
  ],
  8,
  "Palavras que aparecem quando você reza.",
);

// PE1-3 · do perdão
const CACA_PE1: CacaPalavrasData = montarCaca(
  [
    { palavra: "PERDAO", row: 0, col: 0, dir: "H" },
    { palavra: "PAI", row: 2, col: 1, dir: "H" },
    { palavra: "FILHO", row: 4, col: 0, dir: "H" },
    { palavra: "ABRACO", row: 1, col: 7, dir: "V" }, // 6 letras cabe (rows 1..6)
    { palavra: "AMOR", row: 3, col: 5, dir: "V" },
    { palavra: "VOLTAR", row: 6, col: 0, dir: "H" },
  ],
  8,
  "Encontre palavras do coração que se converte.",
);

// PE3-2 · Eucaristia
const CACA_PE3: CacaPalavrasData = montarCaca(
  [
    { palavra: "PAO", row: 0, col: 0, dir: "H" },
    { palavra: "VINHO", row: 2, col: 0, dir: "H" },
    { palavra: "CORPO", row: 4, col: 0, dir: "H" },
    { palavra: "JESUS", row: 6, col: 0, dir: "H" },
    { palavra: "ALTAR", row: 0, col: 6, dir: "V" }, // rows 0..4
    { palavra: "CALICE", row: 1, col: 4, dir: "V" }, // rows 1..6
  ],
  8,
  "Palavras da Santa Missa e da Eucaristia.",
);

// PC1-2 · Criação
const CENAS_PC1: CenasBiblicasData = {
  intro: "Coloque as cenas da Criação na ordem certa. Toque na 1ª, depois na 2ª, depois na 3ª.",
  cenas: [
    { src: criacao1, alt: "Luz surge sobre as águas", legenda: "1º dia — a luz" },
    { src: criacao2, alt: "A terra e as plantas", legenda: "3º dia — a terra e as plantas" },
    { src: criacao3, alt: "O ser humano no jardim", legenda: "6º dia — o ser humano" },
  ],
};

// PE1-2 · Filho Pródigo
const CENAS_PE1: CenasBiblicasData = {
  intro: "Organize a parábola do Filho Pródigo na ordem que Jesus contou.",
  cenas: [
    { src: prodigo1, alt: "O filho sai de casa", legenda: "1º — o filho vai embora" },
    { src: prodigo2, alt: "Sozinho no campo", legenda: "2º — se arrepende" },
    { src: prodigo3, alt: "O pai o abraça", legenda: "3º — o pai o recebe" },
  ],
};

// PC2-2 · Quebra-cabeça em Nazaré
const PUZZLE_PC2: QuebraCabecaData = {
  imagem: puzzleMeninoJesus, alt: "Jesus aprende com Maria em Nazaré", n: 3,
  dica: "Toque em uma peça pra colocá-la no lugar certo.",
};

// PE2-3 · Cálice e hóstia
const PUZZLE_PE2: QuebraCabecaData = {
  imagem: puzzleCalice, alt: "Cálice, hóstia, uvas e trigo sobre o altar", n: 3,
  dica: "Monte a imagem do altar da Santa Missa.",
};

/* 7 erros: as “diferenças” são pequenos símbolos coloridos escondidos
   sobre a imagem — a criança toca em cada um pra descobrir. */
function difs(cs: Array<[number, number, DiferencaItem["simbolo"], DiferencaItem["cor"]]>): DiferencaItem[] {
  return cs.map(([x, y, simbolo, cor], i) => ({
    id: `d${i + 1}`, x, y, r: 5, simbolo, cor,
  }));
}

const SETE_PC2: SeteErrosData = {
  imagem: puzzleMeninoJesus, alt: "Cena da Sagrada Família em casa",
  diferencas: difs([
    [12, 18, "estrela", "gold"], [50, 8, "cruz", "cord"],
    [82, 24, "flor", "leaf"], [22, 60, "coracao", "gold"],
    [70, 70, "folha", "leaf"], [40, 88, "gota", "sky"],
    [90, 55, "circulo", "gold"],
  ]),
};

const SETE_PC3: SeteErrosData = {
  imagem: criacao3, alt: "Cantinho de oração no jardim",
  diferencas: difs([
    [10, 10, "cruz", "cord"], [55, 12, "estrela", "gold"],
    [90, 30, "flor", "leaf"], [22, 45, "coracao", "gold"],
    [65, 55, "folha", "leaf"], [15, 82, "gota", "sky"],
    [82, 85, "circulo", "gold"],
  ]),
};

const SETE_PE2: SeteErrosData = {
  imagem: puzzleCalice, alt: "Altar preparado para a Missa",
  diferencas: difs([
    [15, 15, "estrela", "gold"], [50, 8, "cruz", "cord"],
    [88, 20, "flor", "leaf"], [20, 55, "coracao", "gold"],
    [78, 60, "folha", "leaf"], [45, 85, "gota", "sky"],
    [92, 82, "circulo", "gold"],
  ]),
};

const SETE_PE3: SeteErrosData = {
  imagem: puzzleCalice, alt: "A Última Ceia representada no altar",
  diferencas: difs([
    [8, 25, "flor", "leaf"], [30, 10, "estrela", "gold"],
    [60, 20, "cruz", "cord"], [85, 40, "coracao", "gold"],
    [15, 70, "folha", "leaf"], [50, 78, "gota", "sky"],
    [80, 85, "circulo", "gold"],
  ]),
};

export const ATIVIDADES_INTERATIVAS: Record<string, AtividadeInterativa> = {
  "pc1-2": { kind: "cenas-biblicas", data: CENAS_PC1 },
  "pc1-3": { kind: "caca-palavras", data: CACA_PC1 },
  "pc2-2": { kind: "quebra-cabeca", data: PUZZLE_PC2 },
  "pc2-3": { kind: "sete-erros", data: SETE_PC2 },
  "pc3-2": { kind: "caca-palavras", data: CACA_PC3 },
  "pc3-3": { kind: "sete-erros", data: SETE_PC3 },
  "pe1-2": { kind: "cenas-biblicas", data: CENAS_PE1 },
  "pe1-3": { kind: "caca-palavras", data: CACA_PE1 },
  "pe2-2": { kind: "sete-erros", data: SETE_PE2 },
  "pe2-3": { kind: "quebra-cabeca", data: PUZZLE_PE2 },
  "pe3-2": { kind: "caca-palavras", data: CACA_PE3 },
  "pe3-3": { kind: "sete-erros", data: SETE_PE3 },
};

export function trilhaInfantilDe(etapa: string): InfantilUnidade[] | null {
  if (etapa === "pre-catequese") return TRILHA_PRE_CATEQUESE;
  if (etapa === "primeira-comunhao") return TRILHA_PRIMEIRA_COMUNHAO;
  return null;
}