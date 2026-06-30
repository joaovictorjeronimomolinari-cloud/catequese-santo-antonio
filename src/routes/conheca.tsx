import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Baby,
  Sparkles,
  HeartHandshake,
  Search,
  Shuffle,
  Eye,
  Puzzle,
  BookOpen,
  CheckCircle2,
  Image as ImageIcon,
  PenLine,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/conheca")({
  head: () => ({
    meta: [
      { title: "Conheça o app — Catequizando Digital" },
      {
        name: "description",
        content:
          "Faça um tour pelo Catequizando Digital: exemplos de atividades infantis, da Crisma e uma mensagem aos responsáveis.",
      },
      { property: "og:title", content: "Conheça o Catequizando Digital" },
      {
        property: "og:description",
        content: "Tour pelas atividades, devocional e proposta pedagógica do app da Paróquia Santo Antônio.",
      },
    ],
  }),
  component: ConhecaPage,
});

type Aba = "infantil" | "crisma" | "responsaveis";

function ConhecaPage() {
  const [aba, setAba] = useState<Aba>("infantil");

  return (
    <main className="relative min-h-screen bg-gradient-sky pb-16">
      <div className="pointer-events-none fixed inset-0 texture-cream opacity-60" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center gap-3 px-5 pt-6">
        <Link
          to="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop"
          aria-label="Voltar para o início"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">
            Tour guiado
          </p>
          <h1 className="font-display text-2xl font-extrabold leading-tight text-[color:var(--habit-deep)] sm:text-3xl">
            Conheça o app
          </h1>
        </div>
      </header>

      <p className="relative z-10 mx-auto mt-2 max-w-3xl px-5 text-[13px] font-semibold text-[color:var(--muted-foreground)]">
        Veja como funcionam as atividades e a proposta do Catequizando Digital — mesmo sem matrícula.
      </p>

      {/* Tabs */}
      <nav className="relative z-10 mx-auto mt-5 max-w-3xl px-5">
        <ul className="grid grid-cols-3 gap-2 rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-1 shadow-pop">
          <TabBtn ativo={aba === "infantil"} onClick={() => setAba("infantil")} Icon={Baby} label="Infantil" />
          <TabBtn ativo={aba === "crisma"} onClick={() => setAba("crisma")} Icon={Sparkles} label="Crisma" />
          <TabBtn ativo={aba === "responsaveis"} onClick={() => setAba("responsaveis")} Icon={HeartHandshake} label="Responsáveis" />
        </ul>
      </nav>

      <section className="relative z-10 mx-auto mt-6 max-w-3xl px-5">
        {aba === "infantil" && <AbaInfantil />}
        {aba === "crisma" && <AbaCrisma />}
        {aba === "responsaveis" && <AbaResponsaveis />}
      </section>

      <footer className="relative z-10 mx-auto mt-10 max-w-3xl px-5 text-center">
        <Link
          to="/matricula"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-gold px-6 text-[12px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop"
        >
          Gostou? Faça a matrícula
        </Link>
      </footer>
    </main>
  );
}

function TabBtn({
  ativo,
  onClick,
  Icon,
  label,
}: {
  ativo: boolean;
  onClick: () => void;
  Icon: typeof Baby;
  label: string;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={
          "flex w-full flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-black uppercase tracking-wider transition " +
          (ativo
            ? "bg-gradient-habit text-[color:var(--lily)] shadow-pop"
            : "text-[color:var(--habit-deep)] hover:bg-[color:var(--habit-deep)]/5")
        }
      >
        <Icon className="h-4 w-4" strokeWidth={2.5} />
        {label}
      </button>
    </li>
  );
}

/* ------------------ Aba 1: Infantil ------------------ */
function AbaInfantil() {
  return (
    <div className="space-y-4">
      <IntroCard
        titulo="Atividades para crianças (7–13 anos)"
        descricao="Prévias visuais dos tipos de atividade que o catequizando infantil encontra na trilha — coloridas, lúdicas e com recompensas."
      />

      <PreviewCard Icon={Search} cor="gold" titulo="Caça-palavras" detalhe="Grade 8x8 com palavras bíblicas marcadas">
        <CacaPalavrasPreview />
      </PreviewCard>

      <PreviewCard Icon={Shuffle} cor="leaf" titulo="Organize as Cenas Bíblicas" detalhe="4 imagens de uma história em ordem embaralhada">
        <CenasPreview />
      </PreviewCard>

      <PreviewCard Icon={Eye} cor="habit" titulo="7 Erros" detalhe="Duas imagens lado a lado com diferenças destacadas">
        <SeteErrosPreview />
      </PreviewCard>

      <PreviewCard Icon={Puzzle} cor="gold" titulo="Quebra-Cabeça" detalhe="Imagem bíblica em peças (ex.: Última Ceia em 9 peças)">
        <QuebraCabecaPreview />
      </PreviewCard>
    </div>
  );
}

function CacaPalavrasPreview() {
  const grid = [
    ["J", "E", "S", "U", "S", "P", "A", "Z"],
    ["M", "A", "R", "I", "A", "F", "É", "D"],
    ["A", "M", "O", "R", "T", "L", "G", "E"],
    ["G", "R", "A", "Ç", "A", "U", "Z", "U"],
    ["B", "T", "C", "D", "E", "F", "G", "S"],
    ["P", "A", "Z", "H", "I", "J", "K", "L"],
    ["M", "N", "O", "P", "Q", "R", "S", "T"],
    ["U", "V", "F", "É", "W", "X", "Y", "Z"],
  ];
  // Highlight indexes (row,col)
  const hl = new Set([
    "0,0","0,1","0,2","0,3","0,4", // JESUS
    "1,0","1,1","1,2","1,3","1,4", // MARIA
    "2,0","2,1","2,2","2,3","2,4", // AMOR
    "3,0","3,1","3,2","3,3","3,4", // GRAÇA
    "0,5","0,6","0,7",             // PAZ
    "1,5","1,6","1,7",             // FÉD (FÉ)
  ]);
  return (
    <div className="grid grid-cols-8 gap-1 rounded-xl bg-[color:var(--cream)] p-2">
      {grid.map((row, r) =>
        row.map((ch, c) => {
          const ativo = hl.has(`${r},${c}`);
          return (
            <div
              key={`${r}-${c}`}
              className={
                "flex aspect-square items-center justify-center rounded-md text-[11px] font-black " +
                (ativo
                  ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
                  : "bg-[color:var(--lily)] text-[color:var(--habit-deep)]/60")
              }
            >
              {ch}
            </div>
          );
        }),
      )}
    </div>
  );
}

function CenasPreview() {
  const cenas = [
    { n: 1, titulo: "Anunciação", emoji: "👼" },
    { n: 2, titulo: "Viagem a Belém", emoji: "🐴" },
    { n: 3, titulo: "Presépio", emoji: "🌟" },
    { n: 4, titulo: "Adoração dos Magos", emoji: "👑" },
  ];
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {cenas.map((c) => (
        <li key={c.n} className="rounded-xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-3 text-center">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-habit text-[10px] font-black text-[color:var(--lily)]">
            {c.n}
          </span>
          <p className="mt-2 text-2xl">{c.emoji}</p>
          <p className="mt-1 text-[11px] font-extrabold text-[color:var(--habit-deep)]">{c.titulo}</p>
        </li>
      ))}
    </ol>
  );
}

function SeteErrosPreview() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2].map((n) => (
        <div key={n} className="relative aspect-square overflow-hidden rounded-xl border-2 border-[color:var(--habit-deep)]/10 bg-gradient-to-b from-[color:var(--sky)]/60 to-[color:var(--cream)]">
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🐑</div>
          <div className="absolute bottom-2 left-2 text-3xl">🧎</div>
          {n === 2 && (
            <>
              <span className="absolute right-3 top-3 h-4 w-4 rounded-full ring-2 ring-[color:var(--gold)]" />
              <span className="absolute left-4 top-4 h-3 w-3 rounded-full ring-2 ring-[color:var(--gold)]" />
              <span className="absolute bottom-4 right-4 h-3 w-3 rounded-full ring-2 ring-[color:var(--gold)]" />
            </>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-[color:var(--lily)]/90 px-2 py-0.5 text-[10px] font-black text-[color:var(--habit-deep)]">
            {n === 1 ? "Original" : "Procure 7"}
          </span>
        </div>
      ))}
    </div>
  );
}

function QuebraCabecaPreview() {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-[color:var(--cream)] p-2">
      {Array.from({ length: 9 }).map((_, i) => {
        const faltando = i === 4;
        return (
          <div
            key={i}
            className={
              "flex aspect-square items-center justify-center rounded-md text-2xl " +
              (faltando
                ? "border-2 border-dashed border-[color:var(--habit-deep)]/30 bg-[color:var(--card)] text-[color:var(--muted-foreground)]"
                : "bg-gradient-habit text-[color:var(--gold-soft)]")
            }
          >
            {faltando ? "?" : "🍞"}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------ Aba 2: Crisma ------------------ */
function AbaCrisma() {
  return (
    <div className="space-y-4">
      <IntroCard
        titulo="Atividades para a Crisma (14+ anos)"
        descricao="Atividades mais reflexivas, focadas em identidade, fé madura e protagonismo."
      />

      <PreviewCard Icon={BookOpen} cor="habit" titulo="Reflexão Bíblica" detalhe="Trecho bíblico com pergunta aberta">
        <div className="rounded-xl border-l-4 border-[color:var(--gold)] bg-[color:var(--cream)] p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-[color:var(--habit)]">Jo 15,13</p>
          <p className="mt-1 font-display text-base italic leading-snug text-[color:var(--habit-deep)]">
            “Não há amor maior do que dar a vida pelos amigos.”
          </p>
          <p className="mt-3 text-[12px] font-semibold text-[color:var(--habit-deep)]">
            O que esse versículo significa para você hoje?
          </p>
          <div className="mt-2 h-16 rounded-lg border-2 border-dashed border-[color:var(--habit-deep)]/20 bg-[color:var(--lily)]" />
        </div>
      </PreviewCard>

      <PreviewCard Icon={CheckCircle2} cor="gold" titulo="Sobre a Santa Missa" detalhe="Pergunta de múltipla escolha (4 opções)">
        <div className="rounded-xl bg-[color:var(--card)] p-4">
          <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">O que é o Credo?</p>
          <ul className="mt-3 grid gap-1.5">
            {[
              { l: "A", t: "Uma oração de pedido", ok: false },
              { l: "B", t: "A profissão de fé da Igreja", ok: true },
              { l: "C", t: "Um hino litúrgico", ok: false },
              { l: "D", t: "Uma bênção final", ok: false },
            ].map((o) => (
              <li
                key={o.l}
                className={
                  "flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-[12px] font-semibold " +
                  (o.ok
                    ? "border-[color:var(--leaf)] bg-gradient-leaf text-[color:var(--lily)]"
                    : "border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] text-[color:var(--habit-deep)]")
                }
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 text-[11px] font-black">
                  {o.l}
                </span>
                {o.t}
              </li>
            ))}
          </ul>
        </div>
      </PreviewCard>

      <PreviewCard Icon={ImageIcon} cor="leaf" titulo="Símbolos Litúrgicos" detalhe="Imagem de objeto + campo para nomear">
        <div className="flex items-center gap-4 rounded-xl bg-[color:var(--card)] p-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-gold text-5xl shadow-gold-pop">
            🍷
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-[color:var(--habit)]">Como se chama este objeto sagrado?</p>
            <div className="mt-2 h-10 rounded-lg border-2 border-dashed border-[color:var(--habit-deep)]/20 bg-[color:var(--lily)]" />
          </div>
        </div>
      </PreviewCard>

      <PreviewCard Icon={PenLine} cor="habit" titulo="Dissertativa" detalhe="Trecho + caixa de texto para resposta">
        <div className="rounded-xl bg-[color:var(--card)] p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-[color:var(--habit)]">Mt 5,3-10</p>
          <p className="mt-1 text-[12px] font-semibold leading-snug text-[color:var(--habit-deep)]">
            Leia as Bem-aventuranças. Escolha uma e explique como ela pode ser vivida hoje.
          </p>
          <div className="mt-2 h-24 rounded-lg border-2 border-dashed border-[color:var(--habit-deep)]/20 bg-[color:var(--lily)]" />
        </div>
      </PreviewCard>
    </div>
  );
}

/* ------------------ Aba 3: Responsáveis ------------------ */
function AbaResponsaveis() {
  const texto =
    "Aos responsáveis: vocês podem e devem ajudar seus filhos a entender as atividades que eles irão realizar. As aulas presenciais nas comunidades ainda acontecem, mas é de extrema importância que os catequizandos e suas famílias não se limitem a buscar as coisas de Deus somente nas missas e eventos das comunidades e paróquias. Devemos sempre buscar a Deus também em nossas casas para fortalecer nossas famílias.";

  const compartilhar = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`"${texto}" — Catequizando Digital · Paróquia Santo Antônio · Jacutinga/MG`)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-[3px] border-[color:var(--habit-deep)] bg-gradient-habit p-6 text-[color:var(--lily)] shadow-pop">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          Mensagem aos responsáveis
        </p>
        <p className="mt-3 font-display text-lg italic leading-relaxed text-[color:var(--lily)]/95">
          “{texto}”
        </p>
        <button
          type="button"
          onClick={compartilhar}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-gold px-5 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar esta mensagem
        </button>
      </div>

      <div className="rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-5 shadow-pop">
        <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">
          Como acompanhar seu filho no app
        </p>
        <ul className="mt-3 grid gap-2 text-[13px] font-semibold text-[color:var(--habit-deep)]">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[color:var(--leaf)]">●</span>
            Reze junto ao final de cada atividade — vale 5 minutos.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[color:var(--leaf)]">●</span>
            Acompanhe as conquistas e celebre cada troféu como família.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[color:var(--leaf)]">●</span>
            Mantenha contato com o catequista responsável pela comunidade.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------ Wrappers visuais ------------------ */
function IntroCard({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-4 shadow-pop">
      <p className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">{titulo}</p>
      <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">{descricao}</p>
    </div>
  );
}

function PreviewCard({
  Icon,
  cor,
  titulo,
  detalhe,
  children,
}: {
  Icon: typeof Search;
  cor: "gold" | "leaf" | "habit";
  titulo: string;
  detalhe: string;
  children: React.ReactNode;
}) {
  const bg =
    cor === "gold"
      ? "bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop"
      : cor === "leaf"
      ? "bg-gradient-leaf text-[color:var(--lily)]"
      : "bg-gradient-habit text-[color:var(--lily)]";
  return (
    <article className="overflow-hidden rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] shadow-pop">
      <header className="flex items-center gap-3 border-b-2 border-dashed border-[color:var(--habit-deep)]/10 p-4">
        <span className={"flex h-11 w-11 items-center justify-center rounded-xl " + bg}>
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <div>
          <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">{titulo}</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--muted-foreground)]">
            {detalhe}
          </p>
        </div>
      </header>
      <div className="p-4">{children}</div>
    </article>
  );
}