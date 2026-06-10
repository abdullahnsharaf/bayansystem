import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { PageTransition } from "@/components/page-transition";
import { formatCurrency } from "@/lib/format";
import { useApplicationsStore } from "@/stores/applications-store";

export const Route = createFileRoute("/_app/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const applications = useApplicationsStore((s) => s.applications);
  const [search, setSearch] = useState("");

  const filtered = applications.filter((a) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      a.id.toLowerCase().includes(term) ||
      a.applicant.name.toLowerCase().includes(term)
    );
  });

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Audit log</p>
          <h1 className="display-heading text-3xl text-bayan-green-deep">Application history</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 pl-9"
            placeholder="Search applicant or ID"
          />
        </div>
      </div>

      <Card className="card-flat rounded-xl border-border shadow-none">
        <CardContent className="p-0">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Applicant</th>
                <th className="px-5 py-3 text-left">Application</th>
                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">Submitted</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((application) => (
                <tr key={application.id} className="border-t border-border subtle-hover">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-bayan-green-deep/10 text-bayan-green-deep">
                          {application.applicant.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{application.applicant.name}</p>
                        <p className="text-xs text-muted-foreground">{application.applicant.occupation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{application.id}</td>
                  <td className="px-5 py-4">{formatCurrency(application.financing.amount)}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{application.submittedAt}</td>
                  <td className="px-5 py-4"><StatusBadge status={application.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate({ to: "/assessment/$id/result", params: { id: application.id } })
                      }
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
