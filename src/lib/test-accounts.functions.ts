import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Contas de teste persistentes do app.
 *
 * Regras:
 *  - As duas contas de admin (responsavel@ e catequista@) são PERMANENTES:
 *    não podem ser excluídas pela interface e são recriadas por seedTestAccounts.
 *  - As contas de aluno de teste podem ser excluídas pelo admin quando quiser.
 *  - As senhas são fixas para facilitar o teste do app; ficam apenas no servidor,
 *    nunca em localStorage.
 */
export type SeedKind = "admin" | "catequista" | "aluno";

export type SeedAccount = {
  email: string;
  password: string;
  nome: string;
  kind: SeedKind;
  etapa?: "primeira-comunhao" | "crisma" | "pre-catequese";
};

// Emails de admin permanentes (nunca podem ser excluídos por deleteAppUser).
export const PROTECTED_ADMIN_EMAILS = [
  "responsavel@gmail.com",
  "catequista@gmail.com",
] as const;

// Fonte única das contas de teste — mantidas idênticas em todo dispositivo.
export const TEST_ACCOUNTS: SeedAccount[] = [
  {
    email: "responsavel@gmail.com",
    password: "#paroquia2026",
    nome: "Responsável da catequese",
    kind: "admin",
  },
  {
    email: "catequista@gmail.com",
    password: "#adm182",
    nome: "João Victor Jerônimo Molinari",
    kind: "admin",
  },
  {
    email: "pedro@gmail.com",
    password: "#pedro182",
    nome: "Pedro teste",
    kind: "aluno",
    etapa: "primeira-comunhao",
  },
  {
    email: "joao@gmail.com",
    password: "#joao182",
    nome: "João teste",
    kind: "aluno",
    etapa: "crisma",
  },
];

export type SeededUser = {
  id: string;
  email: string;
  nome: string;
  kind: SeedKind;
  etapa?: SeedAccount["etapa"];
  created: boolean;
  protected: boolean;
};

type SupabaseUser = { id: string; email?: string | null; user_metadata?: Record<string, unknown> };

async function assertAdmin(context: { supabase: unknown; userId: string }) {
  const supabase = context.supabase as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || data !== true) {
    throw new Error("Forbidden");
  }
}

async function findUserByEmail(
  admin: {
    auth: {
      admin: {
        listUsers: (args: {
          page: number;
          perPage: number;
        }) => Promise<{ data: { users: SupabaseUser[] } | null; error: unknown }>;
      };
    };
  },
  email: string,
): Promise<SupabaseUser | null> {
  const target = email.toLowerCase();
  // 3 páginas de 200 são mais que suficientes para o app.
  for (let page = 1; page <= 3; page++) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    const users = data?.users ?? [];
    const hit = users.find((u) => (u.email ?? "").toLowerCase() === target);
    if (hit) return hit;
    if (users.length < 200) break;
  }
  return null;
}

export const seedTestAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const out: SeededUser[] = [];
    for (const acc of TEST_ACCOUNTS) {
      let user = await findUserByEmail(supabaseAdmin, acc.email);
      let created = false;
      if (!user) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: acc.email,
          password: acc.password,
          email_confirm: true,
          user_metadata: { nome: acc.nome, kind: acc.kind },
        });
        if (error || !data.user) {
          throw new Error(`Falha ao criar ${acc.email}: ${error?.message ?? "desconhecido"}`);
        }
        user = data.user as SupabaseUser;
        created = true;
      } else {
        // Reforça a senha e o metadata, caso alguém tenha alterado.
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          password: acc.password,
          email_confirm: true,
          user_metadata: { nome: acc.nome, kind: acc.kind },
        });
      }

      const roleToAssign = acc.kind; // 'admin' | 'catequista' | 'aluno'
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: user.id, role: roleToAssign }, { onConflict: "user_id,role" });

      out.push({
        id: user.id,
        email: acc.email,
        nome: acc.nome,
        kind: acc.kind,
        etapa: acc.etapa,
        created,
        protected: (PROTECTED_ADMIN_EMAILS as readonly string[]).includes(acc.email),
      });
    }
    return out;
  });

export type AppUserRow = {
  id: string;
  email: string;
  nome: string;
  roles: SeedKind[];
  protected: boolean;
  createdAt: string;
};

export const listAppUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AppUserRow[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const rows: AppUserRow[] = [];
    for (let page = 1; page <= 5; page++) {
      const { data } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      const users = (data?.users ?? []) as Array<
        SupabaseUser & { created_at?: string }
      >;
      if (users.length === 0) break;
      for (const u of users) {
        const { data: rd } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", u.id);
        const roles = ((rd ?? []) as Array<{ role: SeedKind }>).map((r) => r.role);
        const email = (u.email ?? "").toLowerCase();
        rows.push({
          id: u.id,
          email,
          nome: (u.user_metadata?.nome as string | undefined) ?? email,
          roles,
          protected: (PROTECTED_ADMIN_EMAILS as readonly string[]).includes(email),
          createdAt: u.created_at ?? "",
        });
      }
      if (users.length < 200) break;
    }
    rows.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return rows;
  });

export const deleteAppUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string }) => {
    if (!data || typeof data.userId !== "string" || data.userId.length < 8) {
      throw new Error("userId inválido");
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: got, error: getErr } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    if (getErr || !got?.user) throw new Error("Usuário não encontrado");
    const email = (got.user.email ?? "").toLowerCase();
    if ((PROTECTED_ADMIN_EMAILS as readonly string[]).includes(email)) {
      throw new Error("Esta conta de admin é permanente e não pode ser excluída.");
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const, id: data.userId };
  });