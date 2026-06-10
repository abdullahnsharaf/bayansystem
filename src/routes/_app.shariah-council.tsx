import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/page-transition";
import { shariahGuidelines } from "@/lib/bayan-data";

export const Route = createFileRoute("/_app/shariah-council")({
  component: ShariahCouncilPage,
});

function ShariahCouncilPage() {
  return (
    <PageTransition>
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-lg bg-bayan-green-deep/10 p-3 text-bayan-green-deep">
          <BookOpenText className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Governance</p>
          <h1 className="display-heading text-3xl text-bayan-green-deep">Shariah Council</h1>
        </div>
      </div>

      <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
        Active fatwa references and guidelines that BAYAN uses to evaluate Shariah compliance. Updates are versioned and traceable to the originating authority.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {shariahGuidelines.map((guideline) => (
          <Card key={guideline.reference} className="card-flat rounded-xl border-border shadow-none">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <CardTitle className="display-heading text-lg text-bayan-green-deep">{guideline.title}</CardTitle>
              <Badge className="rounded-full bg-success/12 text-success">{guideline.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{guideline.summary}</p>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="font-mono text-foreground">{guideline.reference}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd>{guideline.category}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Issued</dt>
                  <dd>{guideline.issuedOn}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd>{guideline.updated}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTransition>
  );
}
