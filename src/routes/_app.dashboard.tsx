import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ClipboardList, ClockIcon, FilePlus, FileText, Filter, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { PageTransition } from "@/components/page-transition";
import { formatCurrency } from "@/lib/format";
import { useApplicationsStore } from "@/stores/applications-store";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const applications = useApplicationsStore((s) => s.applications);
  const [filter, setFilter] = useState<"all" | "review_needed" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");

  const metrics = useMemo(() => {
    const totals = { pending: 0, approved: 0, rejected: 0, shariah: 0 };
    for (const a of applications) {
      if (a.status === "review_needed") totals.pending += 1;
      if (a.status === "approved") totals.approved += 1;
      if (a.status === "rejected") totals.rejected += 1;
      if (a.shariahEngine?.verdict === "COMPLIANT") totals.shariah += 1;
    }
    return totals;
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        a.id.toLowerCase().includes(term) ||
        a.applicant.name.toLowerCase().includes(term) ||
        a.applicant.occupation.toLowerCase().includes(term)
      );
    });
  }, [applications, filter, search]);

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Selamat datang kembali, Ahmad</p>
          <h1 className="display-heading mt-1 text-4xl text-bayan-green-deep">Application queue</h1>
        </div>
        <Button
          onClick={() => navigate({ to: "/assessment/new" })}
          className="h-11 gap-2 bg-bayan-green-deep text-primary-foreground hover:bg-bayan-green-deep/90"
        >
          <FilePlus className="size-4" />
          New assessment
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={ClockIcon} title="Pending review" value={String(metrics.pending)} trend="Awaiting officer" accentClass="text-bayan-amber" />
        <MetricCard icon={ClipboardList} title="Approved today" value={String(metrics.approved)} trend="+12% vs yesterday" accentClass="text-success" />
        <MetricCard icon={FileText} title="Rejected" value={String(metrics.rejected)} trend="Non-compliant / risk" accentClass="text-danger" />
        <MetricCard icon={ShieldCheck} title="Shariah compliant" value={String(metrics.shariah)} trend="Verified by engine" accentClass="text-bayan-green-deep" />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: "all", label: "All" },
              { value: "review_needed", label: "Review needed" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value as typeof filter)}
                className={
                  filter === option.value
                    ? "rounded-full bg-bayan-green-deep px-4 py-1.5 text-xs font-medium text-primary-foreground"
                    : "rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ID or name"
              className="h-10 w-full sm:w-64"
            />
            <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Filter">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>

        <Card className="card-flat overflow-hidden rounded-xl border-border shadow-none">
          <CardContent className="p-0">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left">Applicant</th>
                  <th className="px-5 py-3 text-left">Application</th>
                  <th className="px-5 py-3 text-left">Financing</th>
                  <th className="px-5 py-3 text-left">Submitted</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((application, index) => (
                  <motion.tr
                    key={application.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-t border-border subtle-hover"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarFallback className="bg-bayan-green-deep/10 text-bayan-green-deep">
                            {application.applicant.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{application.applicant.name}</p>
                          <p className="text-xs text-muted-foreground">{application.applicant.occupation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{application.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{formatCurrency(application.financing.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {application.financing.type} · {application.financing.tenure} mo
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{application.submittedAt}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate({
                            to: "/assessment/$id/result",
                            params: { id: application.id },
                          })
                        }
                      >
                        View
                      </Button>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No applications match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
