import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PageTransition } from "@/components/page-transition";
import { useApplicationsStore } from "@/stores/applications-store";

type SearchParams = { id?: string };

export const Route = createFileRoute("/_app/assessment/processing")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: ProcessingPage,
});

const stages = [
  { key: "ingest", label: "Ingesting applicant data", icon: Sparkles },
  { key: "credit", label: "Running credit risk engine", icon: TrendingUp },
  { key: "shariah", label: "Running Shariah compliance engine", icon: ShieldCheck },
  { key: "fusion", label: "Fusing decisions and generating narrative", icon: CheckCircle2 },
] as const;

function ProcessingPage() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();
  const setStatus = useApplicationsStore((s) => s.setStatus);
  const getApplication = useApplicationsStore((s) => s.getApplicationById);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    stages.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) setStep(index + 1);
        }, (index + 1) * 700),
      );
    });
    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        const existing = getApplication(id);
        if (existing && !existing.creditEngine) {
          setStatus(id, "review_needed");
        }
        navigate({ to: "/assessment/$id/result", params: { id }, replace: true });
      }, (stages.length + 1) * 700),
    );
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [id, navigate, setStatus, getApplication]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm text-muted-foreground">Application {id}</p>
          <h1 className="display-heading mt-1 text-3xl text-bayan-green-deep">Running BAYAN assessment</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Two cognitive engines are evaluating this case in parallel. This usually takes a few seconds.
          </p>
        </div>

        <Card className="card-flat rounded-xl border-border shadow-none">
          <CardContent className="space-y-5 p-6">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const status = index < step ? "done" : index === step ? "active" : "pending";
              return (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
                >
                  <span
                    className={
                      status === "done"
                        ? "rounded-full bg-success/10 p-2 text-success"
                        : status === "active"
                          ? "rounded-full bg-bayan-amber/10 p-2 text-bayan-amber"
                          : "rounded-full bg-muted p-2 text-muted-foreground"
                    }
                  >
                    {status === "active" ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{stage.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {status === "done" ? "Completed" : status === "active" ? "In progress" : "Queued"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
