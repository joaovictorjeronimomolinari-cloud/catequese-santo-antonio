import { useMemo, useState } from "react";
import { Check, HelpCircle, RefreshCw } from "lucide-react";
import type {
  AtividadeInterativa,
  CacaPalavrasData,
  CenasBiblicasData,
  SeteErrosData,
  QuebraCabecaData,
  DiferencaItem,
  CacaPalavraItem,
} from "@/lib/atividades-infantis";

/**
 * Renderiza uma das 4 atividades interativas infantis.
 * Chama onCompleta quando a criança conclui o desafio.
 */
export function InteractiveActivity({
  atividade,
  onCompleta,
  concluida,
}: {
  atividade: AtividadeInterativa;
  onCompleta: () => void;
  concluida: boolean;
}) {
  switch (atividade.kind) {
    case "caca-palavras":
      return <CacaPalavras data={atividade.data} onCompleta={onCompleta} concluida={concluida} />;
    case "cenas-biblicas":
      return <CenasBiblicas data={atividade.data} onCompleta={onCompleta} concluida={concluida} />;
    case "sete-erros":
      return <SeteErros data={atividade.data} onCompleta={onCompleta} concluida={concluida} />;
    case "quebra-cabeca":
      return <QuebraCabeca data={atividade.data} onCompleta={onCompleta} concluida={concluida} />;
  }
}

function SuccessBanner({ mensagem }: { mensagem: string }) {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-2xl border-[3px] border-[color:var(--leaf)] bg-gradient-leaf px-4 py-3 text-[color:var(--lily)] shadow-pop">
      <Check className="h-5 w-5" strokeWidth={3} />
      <p className="font-display text-sm font-extrabold">{mensagem}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * 1) Caça-palavras
 *    Regra: toque na primeira letra e depois na última letra
 *    da palavra na direção certa (linha, coluna ou diagonal ↘).
 * ───────────────────────────────────────────── */
function CacaPalavras({
  data,
  onCompleta,
  concluida,
}: {
  data: CacaPalavrasData;
  onCompleta: () => void;
  concluida: boolean;
}) {
  const [encontradas, setEncontradas] = useState<Set<string>>(new Set());
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [erroFlash, setErroFlash] = useState(false);

  const celulasAcertadas = useMemo(() => {
    const s = new Set<string>();
    data.palavras
      .filter((p) => encontradas.has(p.palavra))
      .forEach((p) => {
        for (let i = 0; i < p.palavra.length; i++) {
          const r = p.row + (p.dir === "H" ? 0 : i);
          const c = p.col + (p.dir === "V" ? 0 : i);
          s.add(`${r},${c}`);
        }
      });
    return s;
  }, [encontradas, data.palavras]);

  function match(a: [number, number], b: [number, number]): CacaPalavraItem | null {
    for (const p of data.palavras) {
      if (encontradas.has(p.palavra)) continue;
      const endRow = p.row + (p.dir === "H" ? 0 : p.palavra.length - 1);
      const endCol = p.col + (p.dir === "V" ? 0 : p.palavra.length - 1);
      const start: [number, number] = [p.row, p.col];
      const end: [number, number] = [endRow, endCol];
      const eq = (x: [number, number], y: [number, number]) => x[0] === y[0] && x[1] === y[1];
      if ((eq(a, start) && eq(b, end)) || (eq(a, end) && eq(b, start))) return p;
    }
    return null;
  }

  function tocar(r: number, c: number) {
    if (concluida) return;
    if (!sel) return setSel([r, c]);
    if (sel[0] === r && sel[1] === c) return setSel(null);
    const found = match(sel, [r, c]);
    if (found) {
      const novo = new Set(encontradas);
      novo.add(found.palavra);
      setEncontradas(novo);
      setSel(null);
      if (novo.size === data.palavras.length) onCompleta();
    } else {
      setErroFlash(true);
      setTimeout(() => setErroFlash(false), 250);
      setSel([r, c]);
    }
  }

  return (
    <div>
      {data.dica && (
        <p className="mb-3 flex items-center gap-2 text-[12px] font-bold text-[color:var(--habit-deep)]">
          <HelpCircle className="h-4 w-4 text-[color:var(--habit)]" strokeWidth={2.6} />
          {data.dica}
        </p>
      )}
      <div
        className={
          "grid gap-1 rounded-2xl bg-[color:var(--cream)] p-2 transition " +
          (erroFlash ? "ring-2 ring-[color:var(--destructive)]" : "")
        }
        style={{ gridTemplateColumns: `repeat(${data.tamanho}, minmax(0, 1fr))` }}
      >
        {data.grid.map((row, r) =>
          row.map((ch, c) => {
            const acertada = celulasAcertadas.has(`${r},${c}`);
            const selecionada = sel && sel[0] === r && sel[1] === c;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => tocar(r, c)}
                disabled={concluida}
                className={
                  "flex aspect-square items-center justify-center rounded-md text-[13px] font-black transition " +
                  (acertada
                    ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
                    : selecionada
                    ? "bg-gradient-habit text-[color:var(--lily)] scale-105"
                    : "bg-[color:var(--lily)] text-[color:var(--habit-deep)] hover:bg-[color:var(--gold-soft)]/60")
                }
              >
                {ch}
              </button>
            );
          }),
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {data.palavras.map((p) => {
          const ok = encontradas.has(p.palavra);
          return (
            <li
              key={p.palavra}
              className={
                "rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider transition " +
                (ok
                  ? "bg-gradient-leaf text-[color:var(--lily)] line-through"
                  : "border-2 border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
              }
            >
              {p.palavra}
            </li>
          );
        })}
      </ul>

      {encontradas.size === data.palavras.length && (
        <SuccessBanner mensagem="Você achou todas as palavras!" />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * 2) Cenas bíblicas — ordenar
 * ───────────────────────────────────────────── */
function CenasBiblicas({
  data,
  onCompleta,
  concluida,
}: {
  data: CenasBiblicasData;
  onCompleta: () => void;
  concluida: boolean;
}) {
  // Ordem embaralhada fixa (por índice)
  const embaralhada = useMemo(() => {
    const idx = data.cenas.map((_, i) => i);
    // rotação simples pra não usar Math.random em SSR
    return [...idx.slice(1), idx[0]!];
  }, [data.cenas]);

  const [ordem, setOrdem] = useState<number[]>([]); // sequência tocada de índices originais
  const [erroFlash, setErroFlash] = useState(false);

  function tocar(iOriginal: number) {
    if (concluida) return;
    const proximoEsperado = ordem.length; // 0-based
    if (iOriginal !== proximoEsperado) {
      setErroFlash(true);
      setTimeout(() => setErroFlash(false), 250);
      setOrdem([]); // recomeça
      return;
    }
    const nova = [...ordem, iOriginal];
    setOrdem(nova);
    if (nova.length === data.cenas.length) onCompleta();
  }

  return (
    <div>
      <p className="mb-3 text-[12px] font-bold text-[color:var(--habit-deep)]">{data.intro}</p>
      <div
        className={
          "grid grid-cols-3 gap-2 rounded-2xl p-1 transition " +
          (erroFlash ? "ring-2 ring-[color:var(--destructive)]" : "")
        }
      >
        {embaralhada.map((iOriginal) => {
          const cena = data.cenas[iOriginal]!;
          const ordemIndex = ordem.indexOf(iOriginal); // 0,1,2 se já tocada
          const tocada = ordemIndex >= 0;
          return (
            <button
              key={iOriginal}
              type="button"
              onClick={() => tocar(iOriginal)}
              disabled={concluida || tocada}
              className={
                "group relative overflow-hidden rounded-2xl border-[3px] shadow-pop transition " +
                (tocada
                  ? "border-[color:var(--leaf)] scale-95"
                  : "border-[color:var(--habit-deep)]/15 hover:-translate-y-0.5")
              }
            >
              <img
                src={cena.src}
                alt={cena.alt}
                loading="lazy"
                width={768}
                height={768}
                className="aspect-square w-full object-cover"
              />
              {tocada && (
                <span className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-sm font-black text-[color:var(--habit-deep)] shadow-gold-pop">
                  {ordemIndex + 1}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:var(--habit-deep)]/85 to-transparent p-2 pt-6 text-left text-[10px] font-extrabold text-[color:var(--lily)]">
                {cena.legenda}
              </span>
            </button>
          );
        })}
      </div>
      {ordem.length === data.cenas.length && (
        <SuccessBanner mensagem="Na ordem certinha! Bíblia sabida." />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * 3) 7 erros — encontrar os símbolos escondidos
 * ───────────────────────────────────────────── */
function SimboloSvg({ tipo, color }: { tipo: DiferencaItem["simbolo"]; color: string }) {
  const props = { fill: color, stroke: "white", strokeWidth: 1.2 } as const;
  switch (tipo) {
    case "estrela":
      return <path d="M12 2l2.6 6.4 6.9.6-5.2 4.6 1.6 6.8L12 16.9 6.1 20.4l1.6-6.8L2.5 9l6.9-.6z" {...props} />;
    case "coracao":
      return <path d="M12 21s-7-4.5-9-9.2C1.5 8 3.8 4 7.5 4 9.5 4 11 5 12 6.5 13 5 14.5 4 16.5 4 20.2 4 22.5 8 21 11.8 19 16.5 12 21 12 21z" {...props} />;
    case "flor":
      return <path d="M12 3a3 3 0 013 3 3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 01-3-3 3 3 0 013-3 3 3 0 013-3zm0 6a2 2 0 100 4 2 2 0 000-4z" {...props} />;
    case "cruz":
      return <path d="M10 3h4v6h6v4h-6v8h-4v-8H4V9h6z" {...props} />;
    case "gota":
      return <path d="M12 3s6 7 6 12a6 6 0 11-12 0c0-5 6-12 6-12z" {...props} />;
    case "folha":
      return <path d="M20 4c-8 0-14 5-14 12 0 2 1 3 2 4 3 0 12-4 12-16zM6 20l6-6" {...props} />;
    case "circulo":
    default:
      return <circle cx="12" cy="12" r="9" {...props} />;
  }
}

const COR_MAP: Record<DiferencaItem["cor"], string> = {
  gold: "oklch(0.78 0.15 80)",
  leaf: "oklch(0.70 0.13 145)",
  sky: "oklch(0.55 0.12 235)",
  cord: "oklch(0.78 0.08 75)",
};

function SeteErros({
  data,
  onCompleta,
  concluida,
}: {
  data: SeteErrosData;
  onCompleta: () => void;
  concluida: boolean;
}) {
  const [achadas, setAchadas] = useState<Set<string>>(new Set());

  function tocarSimbolo(id: string) {
    if (concluida || achadas.has(id)) return;
    const novo = new Set(achadas);
    novo.add(id);
    setAchadas(novo);
    if (novo.size === data.diferencas.length) onCompleta();
  }

  return (
    <div>
      <p className="mb-3 text-[12px] font-bold text-[color:var(--habit-deep)]">
        Encontre os <strong>7 símbolos escondidos</strong> na cena. Toque em cada um.
      </p>
      <div className="relative overflow-hidden rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 shadow-pop">
        <img
          src={data.imagem}
          alt={data.alt}
          loading="lazy"
          width={768}
          height={768}
          className="block w-full"
        />
        {data.diferencas.map((d) => {
          const found = achadas.has(d.id);
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => tocarSimbolo(d.id)}
              disabled={concluida || found}
              aria-label={found ? "Encontrado" : "Procure aqui"}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.r * 2.6}%`, aspectRatio: "1 / 1" }}
            >
              <svg
                viewBox="0 0 24 24"
                className={
                  "h-full w-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)] transition " +
                  (found ? "scale-125 opacity-100" : "opacity-90 hover:scale-110 active:scale-95")
                }
              >
                <SimboloSvg tipo={d.simbolo} color={COR_MAP[d.cor]} />
              </svg>
              {found && (
                <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--leaf)] text-[color:var(--lily)] ring-2 ring-[color:var(--lily)]">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
        {achadas.size}/{data.diferencas.length} encontrados
      </p>
      {achadas.size === data.diferencas.length && (
        <SuccessBanner mensagem="Olhinhos atentos! 7/7 achados." />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * 4) Quebra-cabeça 3x3
 * ───────────────────────────────────────────── */
function QuebraCabeca({
  data,
  onCompleta,
  concluida,
}: {
  data: QuebraCabecaData;
  onCompleta: () => void;
  concluida: boolean;
}) {
  const total = data.n * data.n;
  // Ordem embaralhada estável (sem Math.random, pra evitar SSR mismatch)
  const trayInicial = useMemo(() => {
    const arr = Array.from({ length: total }, (_, i) => i);
    // permutação determinística
    return arr.reverse();
  }, [total]);

  const [colocadas, setColocadas] = useState<Set<number>>(new Set());
  const [reseted, setReseted] = useState(0);

  function tocarPeca(i: number) {
    if (concluida || colocadas.has(i)) return;
    const novo = new Set(colocadas);
    novo.add(i);
    setColocadas(novo);
    if (novo.size === total) onCompleta();
  }

  function resetar() {
    setColocadas(new Set());
    setReseted((r) => r + 1);
  }

  const tray = useMemo(
    () => trayInicial.filter((i) => !colocadas.has(i)),
    [trayInicial, colocadas, reseted],
  );

  return (
    <div>
      {data.dica && (
        <p className="mb-3 flex items-center gap-2 text-[12px] font-bold text-[color:var(--habit-deep)]">
          <HelpCircle className="h-4 w-4 text-[color:var(--habit)]" strokeWidth={2.6} />
          {data.dica}
        </p>
      )}

      {/* Tabuleiro */}
      <div
        className="relative mx-auto grid overflow-hidden rounded-2xl border-[3px] border-[color:var(--habit-deep)] bg-[color:var(--cream)] shadow-pop"
        style={{ gridTemplateColumns: `repeat(${data.n}, minmax(0, 1fr))`, aspectRatio: "1 / 1" }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const r = Math.floor(i / data.n);
          const c = i % data.n;
          const preenchida = colocadas.has(i);
          return (
            <div key={i} className="relative border border-[color:var(--habit-deep)]/10">
              {preenchida ? (
                <div
                  className="absolute inset-0 bg-cover"
                  style={{
                    backgroundImage: `url(${data.imagem})`,
                    backgroundSize: `${data.n * 100}% ${data.n * 100}%`,
                    backgroundPosition: `${(c / (data.n - 1)) * 100}% ${(r / (data.n - 1)) * 100}%`,
                  }}
                  aria-label={data.alt}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[color:var(--muted-foreground)]">
                  <span className="text-[11px] font-black uppercase tracking-wider">?</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tray */}
      {tray.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">
            Toque na peça para colocá-la no lugar
          </p>
          <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-[color:var(--lily)] p-2 shadow-pop">
            {tray.map((i) => {
              const r = Math.floor(i / data.n);
              const c = i % data.n;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => tocarPeca(i)}
                  disabled={concluida}
                  className="aspect-square overflow-hidden rounded-md border-2 border-[color:var(--habit-deep)]/15 bg-cover transition hover:-translate-y-0.5"
                  style={{
                    backgroundImage: `url(${data.imagem})`,
                    backgroundSize: `${data.n * 100}% ${data.n * 100}%`,
                    backgroundPosition: `${(c / (data.n - 1)) * 100}% ${(r / (data.n - 1)) * 100}%`,
                  }}
                  aria-label={`Peça linha ${r + 1}, coluna ${c + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {colocadas.size === total ? (
        <SuccessBanner mensagem="Quebra-cabeça pronto!" />
      ) : (
        <button
          type="button"
          onClick={resetar}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]"
        >
          <RefreshCw className="h-3 w-3" strokeWidth={2.6} />
          Recomeçar
        </button>
      )}
    </div>
  );
}