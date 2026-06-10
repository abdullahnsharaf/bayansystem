import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, ShieldCheck, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { PageTransition } from "@/components/page-transition";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

const reports = [
  { name: "Monthly approval summary — May 2026", category: "Operations", updated: "2 days ago" },
  { name: "Shariah Council audit report Q1 2026", category: "Shariah", updated: "1 week ago" },
  { name: "Underserved segment performance", category: "Strategy", updated: "3 weeks ago" },
  { name: "Model drift & fairness review", category: "Model risk", updated: "1 month ago" },
];

function ReportsPage() {
  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Insights & governance</p>
        <h1 className="display-heading text-3xl text-bayan-green-deep">Reports & audits</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard icon={TrendingUp} title="Approval rate (30d)" value="68%" trend="+4.2% MoM" accentClass="text-success" />
        <MetricCard icon={ShieldCheck} title="Shariah pass rate" value="92%" trend="Stable" accentClass="text-bayan-green-deep" />
        <MetricCard icon={BarChart3} title="Avg decision time" value="9.4s" trend="−1.1s vs last month" accentClass="text-bayan-amber" />
      </div>

      <Card className="mt-6 card-flat rounded-xl border-border shadow-none">
        <CardHeader>
          <CardTitle className="display-heading text-xl text-bayan-green-deep">Available reports</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border p-0">
          {reports.map((report) => (
            <div key={report.name} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">{report.name}</p>
                <p className="text-xs text-muted-foreground">{report.category} · Updated {report.updated}</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="size-4" /> Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageTransition>
  );
}
