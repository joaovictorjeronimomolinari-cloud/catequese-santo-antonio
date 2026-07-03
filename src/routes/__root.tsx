import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { setSessionFromAuth, type Session } from "@/lib/store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Catequizando Digital — Paróquia Santo Antônio · Jacutinga/MG" },
      { name: "description", content: "Aplicativo de catequese da Paróquia Santo Antônio de Jacutinga. Atividades, devocional e formação para a Primeira Eucaristia e a Crisma." },
      { name: "author", content: "Paróquia Santo Antônio · Jacutinga/MG" },
      { name: "theme-color", content: "#1c2a52" },
      { property: "og:title", content: "Catequizando Digital — Paróquia Santo Antônio · Jacutinga/MG" },
      { property: "og:description", content: "Aplicativo de catequese da Paróquia Santo Antônio de Jacutinga. Atividades, devocional e formação para a Primeira Eucaristia e a Crisma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Catequizando Digital — Paróquia Santo Antônio · Jacutinga/MG" },
      { name: "twitter:description", content: "Aplicativo de catequese da Paróquia Santo Antônio de Jacutinga. Atividades, devocional e formação para a Primeira Eucaristia e a Crisma." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5e8c1902-a5bb-40e7-8b8a-687fbc56701a/id-preview-95f802ec--2a2baafe-68ce-46d9-8693-c02af900c6c4.lovable.app-1782925914142.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5e8c1902-a5bb-40e7-8b8a-687fbc56701a/id-preview-95f802ec--2a2baafe-68ce-46d9-8693-c02af900c6c4.lovable.app-1782925914142.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=Nunito:wght@400;600;700;800;900&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Ponte entre o Supabase Auth (fonte de verdade) e o store local.
  // Todo o resto do app lê a sessão pelo useStore((s) => s.session).
  useEffect(() => {
    let cancelled = false;
    const applyUser = async (userId: string | null, meta?: Record<string, unknown>) => {
      if (!userId) {
        if (!cancelled) setSessionFromAuth(null);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (cancelled) return;
      const roles = (data ?? []).map((r) => r.role as "admin" | "catequista" | "aluno");
      const nome = (meta?.nome as string | undefined) ?? undefined;
      const email = (meta?.email as string | undefined) ?? undefined;
      const s: Session = roles.includes("admin")
        ? { kind: "admin", id: userId, nome, email }
        : roles.includes("catequista")
        ? { kind: "catequista", id: userId }
        : { kind: "aluno", id: userId };
      setSessionFromAuth(s);
    };

    supabase.auth.getUser().then(({ data }) => {
      applyUser(data.user?.id ?? null, {
        ...(data.user?.user_metadata ?? {}),
        email: data.user?.email,
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      applyUser(session?.user?.id ?? null, {
        ...(session?.user?.user_metadata ?? {}),
        email: session?.user?.email,
      });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
