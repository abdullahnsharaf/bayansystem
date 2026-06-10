import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/page-transition";
import { formatCurrency } from "@/lib/format";
import { useApplicationsStore } from "@/stores/applications-store";

export const Route = createFileRoute("/_app/assessment/$id/alternative")({
  component: AlternativePage,
});

function AlternativePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const application = useApplicationsStore((s) => s.getApplicationById(id));
  const setStatus = useApplicationsStore((s) => s.setStatus);
  const [reassessing, setReassessing] = useState(false);

  const alternatives = application?.shariahEngine?.alternativeProducts ?? [];

  if (!application) {
    return (
      <PageTransition>
        <p className="text-sm text-muted-foreground">Application not found.</p>
      </PageTransition>
    );
  }

  function reassess(productName: string) {
    setReassessing(true);
    setTimeout(() => {
      setStatus(application!.id, "review_needed");
      toast.success("Re-assessed with compliant alternative", {
        description: `${productName} is now under review.`,
      });
      setReassessing(false);
      navigate({ to: "/assessment/$id/result", params: { id: application!.id } });
    }, 1200);
  }

  return (
    <PageTransition>
      <Button asChild variant="ghost" className="mb-4 gap-2 text-muted-foreground">
        <Link to="/assessment/$id/result" params={{ id: application.id }}>
          <ArrowLeft className="size-4" /> Back to result
        </Link>
      </Button>

      <div className="mb-6">
        <p className="font-mono text-xs text-muted-foreground">{application.id}</p>
        <h1 className="display-heading text-3xl text-bayan-green-deep">Shariah-compliant alternatives</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The original financing purpose was flagged non-compliant. BAYAN proposes the following structures for{" "}
          {application.applicant.name}. Each can be re-assessed instantly.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {alternatives.map((product) => (
          <Card
            key={product.name}
            className={
              product.recommended
                ? "card-flat rounded-xl border-bayan-green-deep/40 bg-bayan-green-deep/5 shadow-none"
                : "card-flat rounded-xl border-border shadow-none"
            }
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="display-heading text-xl text-bayan-green-deep">{product.name}</CardTitle>
                {product.recommended && (
                  <Badge className="rounded-full bg-bayan-green-deep text-primary-foreground">Recommended</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-md border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Monthly payment</p>
                  <p className="display-heading mt-1 text-2xl text-bayan-green-deep">{formatCurrency(product.monthlyPayment)}</p>
                </div>
                <div className="rounded-md border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Profit rate</p>
                  <p className="display-heading mt-1 text-2xl text-bayan-green-deep">{product.profitRate.toFixed(2)}%</p>
                </div>
              </div>
              <Button
                onClick={() => reassess(product.name)}
                disabled={reassessing}
                className="w-full gap-2 bg-bayan-green-deep text-primary-foreground hover:bg-bayan-green-deep/90"
              >
                {reassessing ? <Loader2 className="size-4 animate-spin" /> : product.recommended ? <Check className="size-4" /> : <Sparkles className="size-4" />}
                {reassessing ? "Re-running BAYAN..." : "Re-assess with this product"}
              </Button>
            </CardContent>
          </Card>
        ))}
        {alternatives.length === 0 && (
          <Card className="card-flat rounded-xl border-border shadow-none md:col-span-2">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No alternative products available for this application.
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
