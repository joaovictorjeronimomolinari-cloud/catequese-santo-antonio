# Migração de autenticação para Lovable Cloud

Os três findings (`admin_creds_bundle`, `plaintext_passwords_localstorage`, `localstorage_session_bypass`) têm a mesma causa: hoje o app inteiro roda em cima de `localStorage` com senhas em texto puro. A única correção real é mover contas, senhas e sessão para um servidor. Este plano faz essa migração de forma faseada, mantendo o app utilizável entre as fases.

## Consequências que você precisa aceitar antes

- **Todos os cadastros atuais serão perdidos.** Alunos, catequistas e admins precisam se recadastrar com senha nova — não há como importar senhas em texto puro para o Auth em segurança.
- **As senhas de admin `adm182` e `paroquia2026` deixam de existir.** Você (João Victor) e o Padre criam contas novas de admin com senhas próprias, e essas senhas nunca mais entram no código.
- **Recadastro passa pela mesma fila de aprovação atual** — nada muda no processo pedagógico.
- **Progresso, devocional e conquistas dos alunos existentes serão zerados** (moram no mesmo `localStorage` das senhas). Só faz sentido migrar para o Cloud num momento em que perder esse histórico seja aceitável.

Se algum desses pontos for inaceitável, me diz antes de aprovar e eu ajusto o plano (ex.: manter progresso local por enquanto e migrar só auth).

## Fases

### Fase 1 — Fundações (Cloud + schema + auth)
1. Ativar Lovable Cloud.
2. Criar migração com:
   - Enum `app_role` (`admin`, `catequista`, `aluno`) + tabela `user_roles` + função `has_role` (SECURITY DEFINER, `search_path=public`).
   - Tabela `profiles` (1↔1 com `auth.users`) com dados comuns: nome, telefone, avatar.
   - Tabela `alunos_perfil` (idade, etapa: pré‑catequese / 1ª eucaristia / crisma, `catequista_id`, `status`: pendente/ativo/recusado, dados de matrícula).
   - Tabela `catequistas_perfil` (etapas atendidas, `status`).
   - Trigger `on_auth_user_created` que popula `profiles`.
   - `GRANT`s explícitos + RLS em todas as tabelas.
3. Trocar rotas de login/matrícula/criação de catequista para usar `supabase.auth.signUp` / `signInWithPassword` (senha nunca sai do formulário para o cliente logado).
4. Substituir a "sessão" do `localStorage` por `supabase.auth.getUser()` + `onAuthStateChange` no `__root.tsx`.
5. Substituir os `useEffect` que checam papel por gate real: rotas admin sob `_authenticated/` + verificação server‑side via `has_role` no `beforeLoad`/loader.
6. Remover do bundle: array `ADMINS` de `store.ts`, campo `senha` de qualquer tipo TS, qualquer leitura/escrita de senha no `localStorage`.

Ao final da Fase 1 os três findings já estão fechados. O app fica temporariamente com um único fluxo de auth funcionando.

### Fase 2 — Aprovações e turma no servidor
7. Mover fluxo de matrícula pendente e aprovação para o banco (RLS: admin vê tudo, aluno vê o próprio status, catequista vê os alunos vinculados).
8. Mover "mover aluno de turma" para RPC protegida por `has_role('admin')`.

### Fase 3 — Dados pedagógicos (progresso, devocional, conquistas)
9. Tabelas `progresso_no`, `devocional_registro`, `conquistas` com RLS por `auth.uid()`.
10. Reescrever leitura/escrita nessas áreas do `store.ts` como server functions.
11. Aposentar `cd:state:v2` do `localStorage` e o `src/lib/store.ts` como fonte de verdade — vira só cache de UI.

### Fase 4 — Limpeza
12. Rodar security scan e marcar os três findings como corrigidos.
13. Atualizar `security-memory` descrevendo o novo modelo (Supabase Auth + RLS + `has_role`), o que é público (nada) e o que é intencional.
14. Documentar no README interno como criar novos admins (via painel do Supabase, não código).

## Detalhes técnicos

- Auth: email + senha (Supabase Auth). Sem OAuth por enquanto — pode ser adicionado depois sem quebrar nada.
- Papéis: `user_roles` separada, nunca em `profiles`. Todas as checagens via `public.has_role(auth.uid(), 'admin')`.
- Server functions autenticadas via `createServerFn` + `requireSupabaseAuth`. Operações privilegiadas (aprovar aluno, mover turma, promover admin) checam `has_role` no handler antes de agir.
- Nada de `supabaseAdmin` fora de operações de manutenção. Nunca importado no topo de arquivos `.functions.ts`.
- `src/start.ts`: anexar `attachSupabaseAuth` ao `functionMiddleware` existente.
- Rotas protegidas migram para `src/routes/_authenticated/`. Rotas hoje em `/painel/*` e `/aprovacoes` viram `/_authenticated/painel/*` e `/_authenticated/aprovacoes` com gate adicional de `has_role('admin' | 'catequista')` no `beforeLoad`.
- `src/routes/index.tsx`, `/matricula`, `/catequista`, `/login`, `/conheca` continuam públicas.
- Removidas do código: constantes `ADMINS`, tipos `senha: string`, `Session` local do `store.ts`, listeners que gravam sessão no `localStorage`.

## Escopo fora deste plano

- Não vou tocar em nenhuma outra rota estética/pedagógica (Crisma, devocional, atividades infantis) exceto para trocar como leem/gravam dados.
- Não vou implementar recuperação de senha nesta rodada (pode ser um passo curto depois — precisa da tela `/reset-password`).
- Nada além dos três findings citados é corrigido ou ignorado.

## O que preciso de você para começar

1. **OK ativar Lovable Cloud?**
2. **OK perder cadastros e progresso atuais** (Fases 1–3)? Se quiser preservar progresso, posso adiar a Fase 3 e manter progresso local por enquanto — só auth e aprovações migram, e os três findings ainda ficam fechados.
3. **Quais os e-mails** que devem virar admin inicial (você e o Padre)? Vou criar as contas via painel e você define as senhas na primeira entrada por "esqueci minha senha", ou você me passa as senhas que quer setar agora via `secrets` — nunca no chat.
