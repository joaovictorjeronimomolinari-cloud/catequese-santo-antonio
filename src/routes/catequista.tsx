import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/catequista")({
  head: () => ({
    meta: [
      { title: "Sou Catequista — Catequizando Digital" },
      {
        name: "description",
        content:
          "Crie sua conta de catequista da Paróquia Santo Antônio de Jacutinga: dados, vínculo paroquial, formação e credenciais.",
      },
      { property: "og:title", content: "Catequista — Criar conta" },
      {
        property: "og:description",
        content:
          "Conta de catequista no Catequizando Digital: gerencie sua turma e acompanhe o caminho dos seus catequizandos.",
      },
    ],
  }),
  component: CatequistaPage,
});

type Comunidade = { id: string; nome: string; emoji: string };
const COMUNIDADES: Comunidade[] = [
  { id: "matriz", nome: "Igreja Matriz", emoji: "⛪" },
  { id: "santuario", nome: "Santuário", emoji: "🕯️" },
  { id: "santa-rita", nome: "Santa Rita de Cássia", emoji: "🌹" },
  { id: "guadalupe", nome: "N. Sra. de Guadalupe", emoji: "🌺" },
  { id: "sao-benedito", nome: "São Benedito", emoji: "🙏" },
  { id: "sagrada-familia", nome: "Sagrada Família", emoji: "👨‍👩‍👧" },
  { id: "sao-francisco", nome: "São Francisco de Assis", emoji: "🕊️" },
  { id: "sao-judas", nome: "São Judas Tadeu", emoji: "✨" },
];

const ETAPAS_CATEQ = [
  { id: "pre-catequese", nome: "Pré-catequese · 7 a 9 anos", emoji: "🧒" },
  { id: "primeira-comunhao", nome: "Primeira Comunhão · 10 a 13 anos", emoji: "🤍" },
  { id: "crisma", nome: "Crisma · 14 a 17 anos", emoji: "🕊️" },
];

const STEPS = [
  { n: 1, label: "Você" },
  { n: 2, label: "Contato" },
  { n: 3, label: "Vínculo" },
  { n: 4, label: "Formação" },
  { n: 5, label: "Credenciais" },
] as const;

function CatequistaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // 1 - pessoais
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  // 2 - contato
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");

  // 3 - vinculo
  const [comunidade, setComunidade] = useState("");
  const [anos, setAnos] = useState(0);
  const [etapas, setEtapas] = useState<string[]>([]);
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);

  // 4 - formacao
  const [sacBatismo, setSacBatismo] = useState(true);
  const [sacEucaristia, setSacEucaristia] = useState(true);
  const [sacCrisma, setSacCrisma] = useState(true);
  const [biblia, setBiblia] = useState(false);

  // 5 - credenciais
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [aceite, setAceite] = useState(false);

  const comunidadeSel = useMemo(
    () => COMUNIDADES.find((c) => c.id === comunidade),
    [comunidade],
  );

  const senhaForca = useMemo(() => {
    let s = 0;
    if (senha.length >= 6) s++;
    if (senha.length >= 10) s++;
    if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) s++;
    if (/\d/.test(senha)) s++;
    if (/[^A-Za-z0-9]/.test(senha)) s++;
    return Math.min(s, 4);
  }, [senha]);

  const canNext: Record<number, boolean> = {
    1: nome.trim().length > 2 && !!nascimento,
    2: email.includes("@") && telefone.trim() !== "" && endereco.trim() !== "" && bairro.trim() !== "",
    3: !!comunidade && etapas.length > 0 && diasDisponiveis.length > 0,
    4: true,
    5: senha.length >= 6 && senha === senha2 && aceite,
  };

  const toggleArr = (arr: string[], v: string, setter: (a: string[]) => void) => {
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const onPickFoto = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const goNext = () => setStep((s) => (s < 6 ? ((s + 1) as 1 | 2 | 3 | 4 | 5 | 6) : s));
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5 | 6) : s));
  const submit = () => setStep(6);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-sky pb-32">
      <div className="pointer-events-none absolute inset-0 texture-cream opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-10 top-32 h-24 w-44 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute right-2 top-12 h-20 w-32 rounded-full bg-white/60 blur-2xl" />
        <div className="absolute left-1/3 top-1/2 h-2 w-2 rounded-full bg-[color:var(--gold)]" />
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
            Sou catequista
          </p>
          <h1 className="font-display text-xl font-extrabold leading-none text-[color:var(--habit-deep)]">
            Criar conta
          </h1>
        </div>
        {step <= 5 && (
          <span className="inline-flex h-9 items-center gap-1 rounded-full bg-gradient-habit px-3 text-[11px] font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop">
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
                        ? "bg-gradient-habit"
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

      <section className="relative z-10 mx-auto mt-6 max-w-3xl px-5">
        {/* STEP 1 */}
        {step === 1 && (
          <Card>
            <SectionHeading
              kicker="Passo 1"
              title="Quem é o catequista?"
              subtitle="Sua identidade e foto de perfil dentro do aplicativo."
            />
            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row">
              <label className="group relative cursor-pointer">
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-[4px] border-[color:var(--habit-deep)] bg-gradient-habit text-[color:var(--gold-soft)] shadow-pop">
                  {foto ? (
                    <img src={foto} alt="Foto do catequista" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-3xl font-black">
                      ✝️
                    </div>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-[color:var(--habit-deep)]/70 py-1 text-center text-[9px] font-black uppercase tracking-wider text-[color:var(--lily)] opacity-0 transition group-hover:opacity-100">
                    Trocar
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--habit-deep)] shadow-gold-pop ring-4 ring-[color:var(--lily)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => onPickFoto(e.target.files?.[0])}
                />
              </label>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-display text-lg font-extrabold text-[color:var(--habit-deep)]">
                  Foto de perfil
                </p>
                <p className="text-[12px] font-semibold text-[color:var(--muted-foreground)]">
                  Use uma foto clara do rosto, como se fosse para o livrinho de catequese.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <Field label="Nome completo" required>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Ana Beatriz Pereira"
                  className={inputCls}
                />
              </Field>
              <Field
                label="Como gosta de ser chamado(a)?"
                hint="É o nome que aparecerá para os catequizandos."
              >
                <input
                  type="text"
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  placeholder="Ex.: Tia Aninha"
                  className={inputCls}
                />
              </Field>
              <Field label="Data de nascimento" required>
                <input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </Card>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Card>
            <SectionHeading
              kicker="Passo 2"
              title="Como falamos com você?"
              subtitle="A coordenação usa esses dados para enviar avisos e materiais."
            />
            <div className="mt-5 grid gap-4">
              <Field label="E-mail" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="catequista@email.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Telefone (WhatsApp)" required>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(35) 9 9999-9999"
                  className={inputCls}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <Field label="Endereço" required>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, complemento"
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

        {/* STEP 3 */}
        {step === 3 && (
          <Card>
            <SectionHeading
              kicker="Passo 3"
              title="Vínculo paroquial"
              subtitle="Em qual comunidade e turma você quer servir?"
            />
            <div className="mt-5 grid gap-5">
              <Field label="Comunidade onde atua" required>
                <div className="grid gap-2 sm:grid-cols-2">
                  {COMUNIDADES.map((c) => {
                    const sel = comunidade === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setComunidade(c.id)}
                        className={
                          "flex items-center gap-3 rounded-2xl border-[3px] p-3 text-left shadow-pop transition hover:-translate-y-0.5 " +
                          (sel
                            ? "border-[color:var(--habit-deep)] bg-gradient-habit text-[color:var(--lily)]"
                            : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
                        }
                      >
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="text-sm font-extrabold">{c.nome}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Etapas que pode acompanhar" required hint="Pode escolher mais de uma.">
                <div className="flex flex-wrap gap-2">
                  {ETAPAS_CATEQ.map((e) => {
                    const sel = etapas.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => toggleArr(etapas, e.id, setEtapas)}
                        className={
                          "inline-flex h-10 items-center gap-2 rounded-full border-[3px] px-4 text-[12px] font-black uppercase tracking-wider shadow-pop transition hover:-translate-y-0.5 " +
                          (sel
                            ? "border-[color:var(--habit-deep)] bg-gradient-gold text-[color:var(--habit-deep)]"
                            : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
                        }
                      >
                        <span>{e.emoji}</span>
                        {e.nome}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Dias disponíveis" required>
                <div className="flex flex-wrap gap-2">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => {
                    const sel = diasDisponiveis.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleArr(diasDisponiveis, d, setDiasDisponiveis)}
                        className={
                          "h-11 w-12 rounded-2xl border-[3px] text-[12px] font-black uppercase tracking-wider shadow-pop transition hover:-translate-y-0.5 " +
                          (sel
                            ? "border-[color:var(--habit-deep)] bg-gradient-leaf text-[color:var(--lily)]"
                            : "border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-[color:var(--habit-deep)]")
                        }
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Anos de catequese">
                <div className="flex items-center gap-3 rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--cream)]/60 p-3">
                  <button
                    type="button"
                    onClick={() => setAnos(Math.max(0, anos - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-lg font-black text-[color:var(--habit-deep)] shadow-pop"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <p className="font-display text-3xl font-black text-[color:var(--habit-deep)]">{anos}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {anos === 1 ? "ano servindo" : "anos servindo"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnos(anos + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold text-lg font-black text-[color:var(--habit-deep)] shadow-gold-pop"
                  >
                    +
                  </button>
                </div>
              </Field>
            </div>
          </Card>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <Card>
            <SectionHeading
              kicker="Passo 4"
              title="Formação e sacramentos"
              subtitle="Para a coordenação conhecer seu caminho de fé."
            />
            <div className="mt-5 grid gap-5">
              <Field label="Sacramentos recebidos">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Toggle checked={sacBatismo} onChange={setSacBatismo} label="Batismo" emoji="💧" />
                  <Toggle checked={sacEucaristia} onChange={setSacEucaristia} label="Eucaristia" emoji="🍞" />
                  <Toggle checked={sacCrisma} onChange={setSacCrisma} label="Crisma" emoji="🕊️" />
                </div>
              </Field>

              <Toggle
                checked={biblia}
                onChange={setBiblia}
                label="Tenho formação bíblica"
                emoji="📖"
              />
            </div>
          </Card>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <Card>
            <SectionHeading
              kicker="Passo 5"
              title="Crie suas credenciais"
              subtitle="Esse será o acesso ao painel do catequista."
            />
            <div className="mt-5 grid gap-4">
              <Field label="E-mail de acesso">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className={inputCls + " bg-[color:var(--cream)]/60 text-[color:var(--muted-foreground)]"}
                />
              </Field>
              <Field label="Senha" required hint="Mínimo de 6 caracteres.">
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                />
                <div className="mt-2 flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={
                        "h-1.5 flex-1 rounded-full transition " +
                        (i < senhaForca
                          ? senhaForca >= 3
                            ? "bg-gradient-leaf"
                            : "bg-gradient-gold"
                          : "bg-[color:var(--habit-deep)]/10")
                      }
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">
                  Força:{" "}
                  {["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"][senhaForca]}
                </p>
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
                  placeholder="••••••••"
                  className={
                    inputCls +
                    (senha2 && senha !== senha2
                      ? " border-[color:var(--destructive)] focus:border-[color:var(--destructive)] focus:ring-[color:var(--destructive)]/30"
                      : "")
                  }
                />
              </Field>

              <label className="flex items-start gap-3 rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--cream)]/60 p-3 text-[12px] font-semibold text-[color:var(--habit-deep)]">
                <input
                  type="checkbox"
                  checked={aceite}
                  onChange={(e) => setAceite(e.target.checked)}
                  className="mt-0.5 h-5 w-5 accent-[color:var(--habit)]"
                />
                <span>
                  Sou catequista em atividade na{" "}
                  <strong>Paróquia Santo Antônio</strong> e confirmo que os dados informados são
                  verdadeiros, zelando pelo cuidado e proteção das crianças (LGPD).
                </span>
              </label>

              {comunidadeSel && (
                <div className="rounded-2xl border-2 border-dashed border-[color:var(--cord)]/60 bg-[color:var(--cream)]/60 p-3 text-[12px] font-bold text-[color:var(--habit-deep)]">
                  Sua conta ficará vinculada à comunidade{" "}
                  <span className="font-black">{comunidadeSel.emoji} {comunidadeSel.nome}</span>.
                </div>
              )}
            </div>
          </Card>
        )}

        {/* STEP 6 - success */}
        {step === 6 && (
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 -m-6 rounded-full bg-[color:var(--gold)]/30 blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-habit text-4xl shadow-pop ring-4 ring-[color:var(--gold)]">
                  🕊️
                </div>
              </div>
              <h2 className="font-display text-3xl font-extrabold text-[color:var(--habit-deep)]">
                Conta criada!
              </h2>
              <p className="mt-2 max-w-md text-[14px] font-semibold text-[color:var(--muted-foreground)]">
                Sua conta de catequista da <strong>Paróquia Santo Antônio</strong> está pronta.
                Já pode entrar e acompanhar a sua turma. Deus abençoe sua missão!
              </p>

              <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
                <Stat k="Comunidade" v={comunidadeSel?.nome ?? "—"} />
                <Stat k="Etapas" v={etapas.length ? String(etapas.length) : "—"} />
                <Stat k="Status" v="Conta ativa" />
              </div>

              <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-[3px] border-[color:var(--habit-deep)]/15 bg-[color:var(--card)] text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-pop"
                >
                  Voltar ao início
                </Link>
                <Link
                  to="/matricula"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-gradient-gold text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop"
                >
                  Matricular um catequizando
                </Link>
              </div>
            </div>
          </Card>
        )}
      </section>

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
                className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-habit text-sm font-black uppercase tracking-wider text-[color:var(--lily)] shadow-pop transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
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
                className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-black uppercase tracking-wider text-[color:var(--habit-deep)] shadow-gold-pop transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Criar conta
                <span>✝️</span>
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/* Shared atoms — kept local to keep the route self-contained */
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

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border-2 border-[color:var(--habit-deep)]/10 bg-[color:var(--card)] p-3 text-center shadow-pop">
      <p className="text-[10px] font-black uppercase tracking-wider text-[color:var(--muted-foreground)]">{k}</p>
      <p className="mt-1 font-display text-sm font-extrabold text-[color:var(--habit-deep)]">{v}</p>
    </div>
  );
}