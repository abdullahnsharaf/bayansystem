import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="page-shell flex min-h-dvh items-center justify-center px-4">
      <div className="card-flat max-w-md rounded-lg p-10 text-center">
        <p className="font-mono text-sm text-bayan-gold-warm">404</p>
        <h1 className="display-heading mt-3 text-5xl text-bayan-green-deep">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you are looking for is not available in this BAYAN preview.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex h-11 items-center justify-center rounded-md border border-bayan-green-deep bg-bayan-green-deep px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-bayan-green-deep/90"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="page-shell flex min-h-dvh items-center justify-center px-4">
      <div className="card-flat max-w-md rounded-lg p-10 text-center">
        <h1 className="display-heading text-4xl text-bayan-green-deep">This screen could not load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          An unexpected error interrupted the BAYAN demo. You can retry or return to sign in.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 items-center justify-center rounded-md border border-bayan-green-deep bg-bayan-green-deep px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-bayan-green-deep/90"
          >
            Try again
          </button>
          <a
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go to sign in
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
      { title: "BAYAN — Cognitive credit assessment" },
      {
        name: "description",
        content:
          "BAYAN is a cognitive credit assessment platform for Islamic banks, combining explainable credit risk and Shariah compliance review.",
      },
      { property: "og:title", content: "BAYAN — Cognitive credit assessment" },
      {
        property: "og:description",
        content:
          "Executive-ready BAYAN demo for Islamic bank officers assessing underserved households with explainable risk and Shariah screening.",
      },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bayan-green-deep focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
