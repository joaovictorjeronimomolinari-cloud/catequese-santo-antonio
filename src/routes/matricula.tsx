import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { COMUNIDADES, registrarAluno, type EtapaId } from "@/lib/store";

export const Route = createFileRoute("/matricula")({
  head: () => ({
    meta: [
      { title: "Matrícula do Catequizando — Catequizando Digital" },
      {
        name: "description",
        content:
          "Inscreva o catequizando na catequese da Paróquia Santo Antônio de Jacutinga. Preencha em poucos passos: etapa, dados, sacramentos e família.",
      },
      { property: "og:title", content: "Matrícula do Catequizando" },
      {
        property: "og:description",
        content:
          "Cinco passos rápidos para garantir a vaga do seu pequeno na catequese de Santo Antônio.",
      },
    ],
  }),
  component: MatriculaPage,
});

/* ─────────────────────────────────────────────────────────────────────── */
/*  Data                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

type Etapa = {
  id: string;
  nome: string;
  faixa: string;
  descricao: string;
  emoji: React.ReactNode;
  cor: "gold" | "leaf" | "habit" | "sky";
  duracao: string;
};

function HostIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <radialGradient id="hostGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="60%" stopColor="#F4E5B2" />
          <stop offset="100%" stopColor="#D9B65A" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#hostGrad)" stroke="#8A6A1F" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="#8A6A1F" strokeOpacity="0.35" strokeWidth="0.8" />
      <g stroke="#5B3F12" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 9.5v13" />
        <path d="M9.5 16h13" />
      </g>
    </svg>
  );
}

const ETAPAS: Etapa[] = [
  {
    id: "pre-catequese",
    nome: "Pré-catequese",
    faixa: "7 a 9 anos",
    descricao: "Primeiros passos na fé — orações, sinais e a alegria de ser filho de Deus.",
    emoji: "🧒",
    cor: "sky",
    duracao: "1 ano",
  },
  {
    id: "primeira-comunhao",
    nome: "Primeira Comunhão",
    faixa: "10 a 13 anos",
    descricao: "Preparação para receber o Pão da Vida — o Corpo e Sangue de Cristo.",
    emoji: <HostIcon className="h-7 w-7" />,
    cor: "gold",
    duracao: "1 ano",
  },
  {
    id: "crisma",
    nome: "Crisma",
    faixa: "14 a 17 anos",
    descricao: "Selo do Espírito Santo — discernimento, missão e serviço.",
    emoji: "🕊️",
    cor: "habit",
    duracao: "1 ano",
  },
];

const STEPS = [
  { n: 1, label: "Etapa" },
  { n: 2, label: "Catequizando" },
  { n: 3, label: "Sacramentos" },
  { n: 4, label: "Família" },
  { n: 5, label: "Revisão" },
] as const;

/* ─────────────────────────────────────────────────────────────────────── */
/*  Page                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */
function MatriculaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [etapaId, setEtapaId] = useState<string>("");

  // Catequizando
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [sexo, setSexo] = useState<"F" | "M" | "">("");
  const [observacoes, setObservacoes] = useState("");

  // Sacramentos
  const [batizado, setBatizado] = useState<"sim" | "nao" | "">("");
  const [batismoParoquia, setBatismoParoquia] = useState("");
  const [paroquiaDesconhecida, setParoquiaDesconhecida] = useState(false);
  const [batismoData, setBatismoData] = useState("");
  const [eucaristia, setEucaristia] = useState<boolean>(false);
  const [crisma, setCrisma] = useState<boolean>(false);

  // Família
  const [responsavel, setResponsavel] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [secResponsavel, setSecResponsavel] = useState("");
  const [secTelefone, setSecTelefone] = useState("");
  const [comunidade, setComunidade] = useState("");

  // Acesso do catequizando
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [aceite, setAceite] = useState(true);

  const etapa = useMemo(() => ETAPAS.find((e) => e.id === etapaId), [etapaId]);

  const canNext: Record<number, boolean> = {
    1: !!etapaId,
    2: nome.trim().length > 2 && !!nascimento && !!sexo,
    3:
      batizado !== "" &&
      (batizado === "nao" ||
        ((paroquiaDesconhecida || batismoParoquia.trim() !== "") && batismoData !== "")),
    4:
      responsavel.trim() !== "" &&
      parentesco.trim() !== "" &&
      telefone.trim() !== "" &&
      comunidade !== "",
    5: senha.length >= 4 && senha === senha2 && aceite,
  };

  const goNext = () => setStep((s) => (s < 6 ? ((s + 1) as 1 | 2 | 3 | 4 | 5 | 6) : s));
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5 | 6) : s));

  const submit = () => {
    if (!etapa || !aceite) return;
    if (senha.length < 4 || senha !== senha2) return;
    registrarAluno({
      nome: nome.trim(),
      senha,
      nascimento,
      sexo,
      etapa: etapa.id as EtapaId,
      responsavel,
      telefone,
      email,
      comunidade,
      batizado,
      batismoParoquia: paroquiaDesconhecida ? "" : batismoParoquia,
      batismoData,
      eucaristia,
      crisma,
      observacoes,
    });
    setStep(6);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-sky pb-32">
      <div className="pointer-events-none absolute inset-0 texture-cream opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-8 top-24 h-24 w-44 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute right-4 top-10 h-20 w-32 rounded-full bg-white/60 blur-2xl" />
        <div className="absolute right-8 bottom-40 h-2 w-2 rounded-full bg-[color:var(--gold)]" />
      </div>

      {/* App bar */}
      <header className="relative z-10 mx-auto flex max-w-3xl items-center gap-3 px-5 pt-5">
        <button
          type="button"
          onClick={() => (step === 1 ? navigate({ to: "/" }) : goBack())}
          aria-label="Voltar"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)] shadow-pop transition hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
            Catequizando Digital
          </p>
          <h1 className="font-display text-xl font-extrabold leading-none text-[color:var(--habit-deep)]">
            Matrícula
          </h1>
        </div>
        {step <= 5 && (
          <span className="inline-flex h-9 items-center gap-1 rounded-full bg-gradient-gold px-3 text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop">
            Passo {step}/5
          </span>
        )}
      </header>

      {/* Stepper */}
      {step <= 5 && (
        <nav className="relative z-10 mx-auto mt-5 max-w-3xl px-5">
          <ol className="flex items-center gap-1.5">
            {STEPS.map((s) => {
              const active = s.n === step;
              const done = s.n < step;
              return (
                <li key={s.n} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className={
                      "h-2 w-full rounded-full transition-all " +
                      (done
                        ? "bg-gradient-leaf"
                        : active
                        ? "bg-gradient-gold"
                        : "bg-[color:var(--habit-deep)]/10")
                    }
                  />
                  <span
                    className={
                      "text-[9px] font-black uppercase tracking-wider " +
                      (done || active
                        ? "text-[color:var(--habit-deep)]"
                        : "text-[color:var(--muted-foreground)]")
                    }
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Content */}
      <section className="relative z-10 mx-auto mt-6 max-w-3xl px-5">
        {step === 1 && (
          <Card>
            <SectionHeading
              kicker="Passo 1"
              title="Escolha a etapa catequética"
              subtitle="Selecione o nível de acordo com a idade do catequizando."
            />
            <ul className="mt-5 grid gap-3">
              {ETAPAS.map((e) => {
                const selected = etapaId === e.id;
                const tone =
                  e.cor === "gold"
                    ? "bg-gradient-gold text-[color:var(--habit-deep)]"
                    : e.cor === "leaf"
                    ? "bg-gradient-leaf text-[color:var(--lily)]"
                    : e.cor === "habit"
                    ? "bg-gradient-habit text-[color:var(--lily)]"
                    : "bg-[color:var(--sky)] text-[color:var(--habit-deep)]";
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setEtapaId(e.id)}
                      aria-pressed={selected}
                      className={
                        "group flex w-full items-stretch gap-3 rounded-2xl border-[3px] p-3 text-left transition-transform shadow-pop hover:-translate-y-0.5 " +
                        (selected
                          ? "border-[color:var(--habit-deep)] bg-[color:var(--lily)] ring-4 ring-[color:var(--gold)]/40"
                          : "border-[color:var(--habit-deep)]/10 bg-[color:var(--card)]")
                      }
                    >
                      <div className={"flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl " + tone}>
                        <span>{e.emoji}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">{e.nome}</p>
                          <span className="shrink-0 rounded-full bg-[color:var(--habit-deep)]/8 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
                            {e.faixa}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12px] font-semibold leading-snug text-[color:var(--muted-foreground)]">
                          {e.descricao}
                        </p>
                        <div className="mt-1.5 flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit)]">
                          <span>⏳ {e.duracao}</span>
                        </div>
                      </div>
                      <div
                        className={
                          "flex h-6 w-6 shrink-0 items-center justify-center self-center rounded-full border-2 " +
                          (selected
                            ? "border-[color:var(--gold)] bg-gradient-gold"
                            : "border-[color:var(--habit-deep)]/20 bg-[color:var(--card)]")
                        }
                      >
                        {selected && (
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[color:var(--habit-deep)]" fill="none" stroke="currentColor" strokeWidth="4">
                            <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <SectionHeading
              kicker="Passo 2"
              title="Quem é o catequizando?"
              subtitle="Conte‑nos como ele(a) é conhecido(a)."
            />
            <div className="mt-5 grid gap-4">
              <Field label="Nome completo" required>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Maria Eduarda Silva"
                  className={inputCls}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Data de nascimento" required>
                  <input
                    type="date"
                    value={nascimento}
                    onChange={(e) => setNascimento(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Sexo" required>
                  <div className="grid grid-cols-2 gap-2">
                    {(["F", "M"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSexo(s)}
                        className={
                          "h-12 rounded-xl border-[3px] text-sm font-black uppercase tracking-wider shadow-pop transition hover:-translate-y-0.5 " +
                          (sexo === s
                            ? "border-[color:var(--habit-deep)] bg-gradient-gold text-[color:var(--habit-deep)]"
                            : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
                        }
                      >
                        {s === "F" ? "Feminino" : "Masculino"}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <Field
                label="Observações"
                hint="Necessidades especiais, alergias, condições de saúde — opcional."
              >
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  className={inputCls + " resize-none leading-snug"}
                  placeholder="Algo que a equipe de catequese precisa saber?"
                />
              </Field>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <SectionHeading
              kicker="Passo 3"
              title="Sacramentos já recebidos"
              subtitle="Essas informações ajudam a definir a turma correta."
            />

            <div className="mt-5 grid gap-4">
              <Field label="O catequizando já foi batizado?" required>
                <div className="grid grid-cols-2 gap-2">
                  {(["sim", "nao"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBatizado(b)}
                      className={
                        "h-12 rounded-xl border-[3px] text-sm font-black uppercase tracking-wider shadow-pop transition hover:-translate-y-0.5 " +
                        (batizado === b
                          ? "border-[color:var(--habit-deep)] bg-gradient-leaf text-[color:var(--lily)]"
                          : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
                      }
                    >
                      {b === "sim" ? "✝️ Sim" : "Ainda não"}
                    </button>
                  ))}
                </div>
              </Field>

              {batizado === "sim" && (
                <div className="grid gap-4 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-4 sm:grid-cols-2">
                  <Field label="Paróquia do batismo" required={!paroquiaDesconhecida}>
                    <input
                      type="text"
                      value={batismoParoquia}
                      onChange={(e) => setBatismoParoquia(e.target.value)}
                      placeholder="Ex.: Paróquia Santo Antônio"
                      disabled={paroquiaDesconhecida}
                      className={inputCls + (paroquiaDesconhecida ? " opacity-50" : "")}
                    />
                    <label className="mt-2 flex items-center gap-2 text-[12px] font-bold text-[color:var(--habit-deep)]">
                      <input
                        type="checkbox"
                        checked={paroquiaDesconhecida}
                        onChange={(e) => {
                          setParoquiaDesconhecida(e.target.checked);
                          if (e.target.checked) setBatismoParoquia("");
                        }}
                        className="h-4 w-4 accent-[color:var(--habit)]"
                      />
                      Não sei informar a paróquia
                    </label>
                  </Field>
                  <Field label="Data do batismo" required>
                    <input
                      type="date"
                      value={batismoData}
                      onChange={(e) => setBatismoData(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}

              {batizado === "nao" && (
                <p className="rounded-2xl border-2 border-[color:var(--gold)]/40 bg-[color:var(--gold-soft)]/40 p-3 text-[12px] font-bold text-[color:var(--habit-deep)]">
                  Sem problemas! O batismo poderá ser preparado durante o caminho catequético.
                </p>
              )}

              <Field label="Outros sacramentos já recebidos">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Toggle checked={eucaristia} onChange={setEucaristia} label="Primeira Eucaristia" emoji="🍞" />
                  <Toggle checked={crisma} onChange={setCrisma} label="Crisma" emoji="🕊️" />
                </div>
              </Field>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <SectionHeading
              kicker="Passo 4"
              title="Família e contato"
              subtitle="Para acompanharmos juntos a caminhada."
            />
            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                <Field label="Responsável principal" required>
                  <input
                    type="text"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    placeholder="Nome completo"
                    className={inputCls}
                  />
                </Field>
                <Field label="Parentesco" required>
                  <input
                    type="text"
                    value={parentesco}
                    onChange={(e) => setParentesco(e.target.value)}
                    placeholder="Ex.: Mãe"
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Telefone (WhatsApp)" required>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(35) 9 9999-9999"
                    className={inputCls}
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="familia@email.com"
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-4">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--habit)]">
                  Contato secundário (opcional)
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nome">
                    <input
                      type="text"
                      value={secResponsavel}
                      onChange={(e) => setSecResponsavel(e.target.value)}
                      placeholder="Ex.: Pai, avó..."
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Telefone">
                    <input
                      type="tel"
                      value={secTelefone}
                      onChange={(e) => setSecTelefone(e.target.value)}
                      placeholder="(35) 9 9999-9999"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <Field label="Endereço" required>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número e complemento"
                    className={inputCls}
                  />
                </Field>
                <Field label="Bairro" required>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex.: Centro"
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <SectionHeading
              kicker="Passo 5"
              title="Revise e confirme"
              subtitle="Confira tudo antes de enviar à secretaria paroquial."
            />
            <div className="mt-5 grid gap-3">
              <ReviewBlock title="Etapa" onEdit={() => setStep(1)}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{etapa?.emoji}</span>
                  <div>
                    <p className="font-display text-base font-extrabold text-[color:var(--habit-deep)]">
                      {etapa?.nome}
                    </p>
                    <p className="text-[11px] font-bold text-[color:var(--muted-foreground)]">
                      {etapa?.faixa} · {etapa?.duracao}
                    </p>
                  </div>
                </div>
              </ReviewBlock>
              <ReviewBlock title="Catequizando" onEdit={() => setStep(2)}>
                <ReviewRow k="Nome" v={nome} />
                <ReviewRow k="Nascimento" v={nascimento} />
                <ReviewRow k="Sexo" v={sexo === "F" ? "Feminino" : sexo === "M" ? "Masculino" : "—"} />
              </ReviewBlock>
              <ReviewBlock title="Sacramentos" onEdit={() => setStep(3)}>
                <ReviewRow k="Batizado" v={batizado === "sim" ? "Sim" : "Ainda não"} />
                {batizado === "sim" && (
                  <>
                    <ReviewRow k="Paróquia" v={paroquiaDesconhecida ? "Não informada" : batismoParoquia} />
                    <ReviewRow k="Data" v={batismoData} />
                  </>
                )}
                <ReviewRow k="Eucaristia" v={eucaristia ? "Sim" : "Não"} />
                <ReviewRow k="Crisma" v={crisma ? "Sim" : "Não"} />
              </ReviewBlock>
              <ReviewBlock title="Família" onEdit={() => setStep(4)}>
                <ReviewRow k={parentesco || "Responsável"} v={responsavel} />
                <ReviewRow k="Telefone" v={telefone} />
                {email && <ReviewRow k="E-mail" v={email} />}
                <ReviewRow k="Endereço" v={`${endereco}, ${bairro}`} />
              </ReviewBlock>

              <div className="mt-2 rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-4">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--habit)]">
                  Crie o acesso do catequizando
                </p>
                <p className="mb-3 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
                  Esse será o login no app — o nome do catequizando e a senha abaixo.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Senha" required hint="Mínimo 4 caracteres.">
                    <input
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••"
                      className={inputCls}
                    />
                  </Field>
                  <Field
                    label="Confirme a senha"
                    required
                    hint={senha2 && senha !== senha2 ? "As senhas não conferem." : undefined}
                  >
                    <input
                      type="password"
                      value={senha2}
                      onChange={(e) => setSenha2(e.target.value)}
                      placeholder="••••••"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              <label className="mt-2 flex items-start gap-3 rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-3 text-[12px] font-semibold text-[color:var(--habit-deep)] shadow-pop">
                <input
                  type="checkbox"
                  checked={aceite}
                  onChange={(e) => setAceite(e.target.checked)}
                  className="mt-0.5 h-5 w-5 accent-[color:var(--habit)]"
                />
                <span>
                  Autorizo o uso dos dados acima pela <strong>Paróquia Santo Antônio</strong> para fins
                  catequéticos e pastorais, conforme a LGPD.
                </span>
              </label>
            </div>
          </Card>
        )}

        {step === 6 && (
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 -m-6 rounded-full bg-[color:var(--gold)]/30 blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-gold text-4xl shadow-gold-pop ring-4 ring-[color:var(--lily)]">
                  ✨
                </div>
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[color:var(--habit-deep)]">
                Matrícula enviada!
              </h2>
              <p className="mt-2 max-w-md text-[14px] font-semibold text-[color:var(--muted-foreground)]">
                A coordenação vai revisar e <strong>aprovar</strong> a matrícula. Assim que liberada,
                <strong> {nome || "o catequizando"}</strong> poderá entrar com o nome e a senha cadastrada.
              </p>

              <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
                <Stat k="Etapa" v={etapa?.nome ?? "—"} />
                <Stat k="Duração" v={etapa?.duracao ?? "—"} />
                <Stat k="Status" v="Aguardando aprovação" />
              </div>

              <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop"
                >
                  Voltar ao início
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-gradient-habit text-sm font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop"
                >
                  Ir para o login
                </Link>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Sticky footer actions */}
      {step <= 5 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)]/95 px-5 py-3 backdrop-blur sm:py-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              Voltar
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canNext[step]}
                className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                Continuar
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canNext[5]}
                className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-leaf text-sm font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop transition hover:-translate-y-0.5"
              >
                Enviar matrícula
                <span>✨</span>
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Shared UI bits                                                        */
/* ─────────────────────────────────────────────────────────────────────── */

const inputCls =
  "h-12 w-full rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] px-3.5 text-[14px] font-semibold text-[color:var(--habit-deep)] shadow-[inset_0_2px_0_oklch(0.30_0.06_50_/_0.06)] outline-none transition focus:border-[color:var(--gold)] focus:ring-4 focus:ring-[color:var(--gold)]/30 placeholder:text-[color:var(--muted-foreground)]/70";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border-[3px] border-[color:var(--habit-deep)]/10 bg-[color:var(--lily)] p-5 shadow-pop sm:p-7">
      {children}
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--habit)]">{kicker}</p>
      <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-[color:var(--habit-deep)] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-1.5 text-[13px] font-semibold text-[color:var(--muted-foreground)]">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-[color:var(--habit-deep)]">
          {label}
          {required && <span className="ml-1 text-[color:var(--destructive)]">*</span>}
        </span>
      </div>
      {children}
      {hint && <p className="mt-1 text-[11px] font-semibold text-[color:var(--muted-foreground)]">{hint}</p>}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  emoji,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  emoji: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={
        "flex h-14 items-center gap-3 rounded-2xl border-[3px] px-4 text-left text-sm font-extrabold shadow-pop transition hover:-translate-y-0.5 " +
        (checked
          ? "border-[color:var(--habit-deep)] bg-gradient-leaf text-[color:var(--lily)]"
          : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
      }
    >
      <span className="text-xl">{emoji}</span>
      <span className="flex-1">{label}</span>
      <span
        className={
          "flex h-6 w-6 items-center justify-center rounded-full border-2 " +
          (checked
            ? "border-[color:var(--lily)] bg-[color:var(--lily)] text-[color:var(--leaf)]"
            : "border-[color:var(--habit-deep)]/30 bg-[color:var(--card)]")
        }
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

function ReviewBlock({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--cream)]/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--habit)]">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full bg-[color:var(--lily)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop transition hover:-translate-y-0.5"
        >
          Editar
        </button>
      </div>
      <div className="grid gap-1.5">{children}</div>
    </div>
  );
}

function ReviewRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="font-bold text-[color:var(--muted-foreground)]">{k}</span>
      <span className="text-right font-extrabold text-[color:var(--habit-deep)]">{v || "—"}</span>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-3 text-center shadow-pop">
      <p className="text-[10px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">{k}</p>
      <p className="mt-1 font-display text-sm font-extrabold text-[color:var(--habit-deep)]">{v}</p>
    </div>
  );
}