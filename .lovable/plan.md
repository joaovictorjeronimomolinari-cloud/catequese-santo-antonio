# Roadmap de aprimoramento — Catequizando Digital

Foco: **Área do Catequizando** + **Conteúdo/Atividades**, para as duas faixas (Crianças 1ª Comunhão e Jovens Crisma). Estética atual preservada — paleta franciscana (habit/gold/lily/leaf/sky), tipografia Fraunces + Nunito, botões "chunky" com shadow-pop. Adições permitidas: micro-animações + modo escuro.

---

## Fase 1 — Polimento e vida (base estética, sem quebrar nada)

**Objetivo:** deixar o app "vivo" mantendo o visual atual.

1. **Micro-animações consistentes** (via utilitários Tailwind já presentes: `animate-fade-in`, `hover-scale`, `scale-in`).
   - Entrada suave em cards de trilha, medalhas, orações e devocionais.
   - Feedback tátil ao completar atividade: pulo do XP, chuva de lírios, medalha "estourando" (scale-in + shadow-gold-glow).
   - Botão de resposta correta/incorreta com animação sutil (verde leaf / cocoa habit-deep).
2. **Feedback sonoro opcional** (toggle no Perfil):
   - 3 SFX curtos: acerto, conquista, transição de etapa. Silencioso por padrão.
3. **Modo escuro** (o token `.dark` já existe em `styles.css`):
   - Toggle no Perfil do aluno e do catequista, persistido em `localStorage`.
   - Ajustar contrastes de cards `bg-lily` e textos `text-habit-deep` que somem no dark.
4. **Skeleton loaders** nas telas de trilha e conquistas para evitar "flash" na hidratação.

## Fase 2 — Trilha do Catequizando (rota `/aluno`)

**Objetivo:** transformar a trilha numa jornada narrativa clara.

1. **Mapa da jornada visual**: substituir a lista por uma trilha vertical em zigue-zague (estilo Duolingo), com marcos por capítulo (Batismo → Palavra → Eucaristia → Missão / Crisma: Espírito Santo → Dons → Frutos → Envio).
2. **Estados dos nós**: bloqueado (Lock cinza), disponível (gold-glow pulsante), concluído (medalha leaf).
3. **Cabeçalho "companheiro de fé"**: Frei Antônio (crianças) / Santo padroeiro escolhido (jovens) com balão de fala contextual ao progresso.
4. **Streak e XP**: barra fixa no topo, animada ao ganhar pontos.
5. **Baú do Frei Antônio** (já referenciado em conquistas): abrir a cada 5 atividades — mini-modal com scale-in revelando lírios/XP bônus.

## Fase 3 — Devocional / Orações (rota `/aluno/devocional`)

**Objetivo:** conteúdo diário útil, diferenciando faixas.

1. **Santo do dia + citação bíblica** carregados de uma tabela de conteúdo curado (`src/lib/santos.ts` já existe — expandir para 30+ santos franciscanos e do calendário).
2. **Crianças**: cartões ilustrados com oração curta (Pai-Nosso, Ave-Maria, Anjo da Guarda), botão "rezei hoje" que incrementa streak.
3. **Jovens**: devocional em 3 blocos — *Palavra* (versículo), *Reflexão* (2–3 parágrafos), *Compromisso do dia* (ação prática). Marcador de leitura.
4. **Terço interativo** (bônus, opcional): 5 dezenas com progresso visual em contas douradas.

## Fase 4 — Conquistas ampliadas (rota `/aluno/conquistas`)

1. Novo conjunto de medalhas por conteúdo real (não só XP): "Leitor da Palavra", "Amigo dos pobres" (referência franciscana), "Semeador de paz", "Discípulo de Cristo".
2. **Estampa/álbum**: layout de figurinhas colecionáveis com verso (descrição + versículo).
3. **Certificado imprimível** ao concluir a etapa (PDF gerado no cliente com nome, comunidade, data).

## Fase 5 — Biblioteca de atividades pedagógicas

**Objetivo:** aumentar o acervo em `InteractiveActivity.tsx` / `atividades-infantis.ts`.

1. **Novos tipos de atividade**:
   - *Ligue os pontos* (sacramento ↔ símbolo).
   - *Complete o versículo* (arrastar palavras).
   - *Quiz com áudio* (jovens) — pequenas homilias/versículos gravados.
   - *Colorir digital* (crianças) — SVG com áreas clicáveis.
2. **Progressão adaptativa**: dificuldade sobe conforme acertos; erros geram atividade de reforço.
3. **Catálogo mínimo alvo**: 12 atividades por capítulo × 4 capítulos por etapa = 48 por faixa.

---

## Detalhes técnicos (para você conferir)

- **Modo escuro**: usar `class="dark"` no `<html>` via hook `useTheme` novo em `src/hooks/`; persistir com `localStorage` lido em `useEffect` (evitar mismatch SSR — regra do template).
- **Áudio**: `Howler.js` ou `<audio>` nativo; assets em `src/assets/sfx/`.
- **Conteúdo curado**: manter em arquivos TS versionados (`src/lib/santos.ts`, novo `src/lib/devocional.ts`, `src/lib/atividades-*.ts`) — sem depender do backend para leitura pública.
- **Backend (Lovable Cloud)**: só para registrar progresso/streak quando o usuário está logado (já há store local — evoluir para sync opcional).
- **Sem quebrar rotas atuais**: cada fase é aditiva; testes visuais em `/aluno`, `/aluno/devocional`, `/aluno/conquistas` a cada fase.

## Ordem sugerida de entrega

```text
Fase 1  → 1 rodada  (micro-anim + dark mode + SFX toggle)
Fase 2  → 1 rodada  (mapa da trilha em zigue-zague)
Fase 3  → 1 rodada  (devocional/orações por faixa + santo do dia)
Fase 4  → 1 rodada  (medalhas novas + certificado)
Fase 5  → 2 rodadas (novos tipos de atividade + expansão do acervo)
```

Se aprovar, começo pela **Fase 1** por ser a que dá "sensação de novo" imediata sem risco. Posso também pular direto para outra fase se você preferir.
