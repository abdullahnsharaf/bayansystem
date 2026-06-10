import { useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, ThumbsDown, ThumbsUp, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreditGauge } from "@/components/credit-gauge";
import { ShapBars } from "@/components/shap-bars";
import { StatusBadge } from "@/components/status-badge";
import { PageTransition } from "@/components/page-transition";
import { formatCurrency, formatPercentage, sentenceCase } from "@/lib/format";
import { useApplicationsStore } from "@/stores/applications-store";
import { useAssessmentStore } from "@/stores/assessment-store";

export const Route = createFileRoute("/_app/assessment/$id/result")({
  component: ResultPage,
});

function ResultPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const application = useApplicationsStore((s) => s.getApplicationById(id));
  const setStatus = useApplicationsStore((s) => s.setStatus);
  const language = useAssessmentStore((s) => s.language);
  const setLanguage = useAssessmentStore((s) => s.setLanguage);

  const credit = application?.creditEngine;
  const shariah = application?.shariahEngine;
  const fusion = application?.fusion;

  const narrative = useMemo(() => {
    if (!fusion) {
      return "BAYAN has prepared a preliminary assessment for this application. Detailed narrative will appear once the cognitive engines complete deeper analysis.";
    }
    return language === "bm" ? fusion.narrative_bm ?? "" : fusion.narrative_en ?? "";
  }, [fusion, language]);

  if (!application) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm text-muted-foreground">Application not found.</p>
          <Button className="mt-4" onClick={() => navigate({ to: "/dashboard" })}>
            Back to dashboard
          </Button>
        </div>
      </PageTransition>
    );
  }

  const isNonCompliant = shariah?.verdict === "NON_COMPLIANT";

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border border-border">
            <AvatarFallback className="bg-bayan-green-deep/10 text-bayan-green-deep">
              {application.applicant.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-mono text-xs text-muted-foreground">{application.id}</p>
            <h1 className="display-heading text-3xl text-bayan-green-deep">{application.applicant.name}</h1>
            <p className="text-sm text-muted-foreground">
              {application.applicant.occupation}
              {application.applicant.state ? ` · ${application.applicant.state}` : ""}
              {" "}· {formatCurrency(application.financing.amount)} {application.financing.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={application.status} />
          {fusion && (
            <Badge className="rounded-full bg-bayan-green-deep px-3 py-1 text-primary-foreground">
              Recommendation: {sentenceCase(fusion.recommendation)}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-flat rounded-xl border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-bayan-amber/10 p-2 text-bayan-amber"><ShieldCheck className="size-4" /></span>
              <CardTitle className="display-heading text-xl text-bayan-green-deep">Credit risk engine</CardTitle>
            </div>
            {credit && (
              <Badge className="rounded-full bg-bayan-amber/12 text-bayan-amber">{sentenceCase(credit.decisionZone)}</Badge>
            )}
          </CardHeader>
          <CardContent className="pt-2">
            {credit ? (
              <>
                <CreditGauge score={credit.score} maxScore={credit.maxScore ?? 1000} />
                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs text-muted-foreground">
                  <div className="rounded-md border border-border bg-muted/40 p-3">
                    <p className="text-muted-foreground">Default probability</p>
                    <p className="display-heading mt-1 text-2xl text-bayan-green-deep">{formatPercentage(credit.defaultProbability)}</p>
                  </div>
                  <div className="rounded-md border border-border bg-muted/40 p-3">
                    <p className="text-muted-foreground">Model confidence</p>
                    <p className="display-heading mt-1 text-2xl text-bayan-green-deep">{formatPercentage(credit.confidence)}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-foreground">Top contributing factors (SHAP)</p>
                  <ShapBars factors={credit.topFactors} />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Credit engine results pending.</p>
            )}
          </CardContent>
        </Card>

        <Card className="card-flat rounded-xl border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-bayan-green-deep/10 p-2 text-bayan-green-deep"><BookOpen className="size-4" /></span>
              <CardTitle className="display-heading text-xl text-bayan-green-deep">Shariah compliance engine</CardTitle>
            </div>
            {shariah && (
              <Badge
                className={
                  shariah.verdict === "COMPLIANT"
                    ? "rounded-full bg-success/12 text-success"
                    : "rounded-full bg-danger/12 text-danger"
                }
              >
                {shariah.verdict === "COMPLIANT" ? "Compliant" : "Non-compliant"}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="pt-2">
            {shariah ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {(["riba", "gharar", "maysir"] as const).map((key) => {
                    const value = shariah.checks[key];
                    const ok = value === "NOT_DETECTED";
                    return (
                      <div
                        key={key}
                        className={
                          ok
                            ? "rounded-lg border border-success/30 bg-success/10 p-3 text-center"
                            : "rounded-lg border border-danger/30 bg-danger/10 p-3 text-center"
                        }
                      >
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{key}</p>
                        <div className="mt-2 flex justify-center">
                          {ok ? <CheckCircle2 className="size-5 text-success" /> : <XCircle className="size-5 text-danger" />}
                        </div>
                        <p className="mt-1 text-xs font-medium">{ok ? "Clear" : "Detected"}</p>
                      </div>
                    );
                  })}
                </div>
                {shariah.reason && (
                  <div className="mt-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                    {shariah.reason}
                  </div>
                )}
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium">Fatwa references</p>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {shariah.fatwaReferences.map((reference) => (
                      <li key={reference} className="flex gap-2">
                        <span className="text-bayan-gold-warm">◆</span>
                        <span>{reference}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {isNonCompliant && (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-5 w-full gap-2"
                  >
                    <Link to="/assessment/$id/alternative" params={{ id: application.id }}>
                      View Shariah-compliant alternatives
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Shariah engine results pending.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 card-flat rounded-xl border-border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="display-heading text-xl text-bayan-green-deep">Decision narrative</CardTitle>
          <Tabs value={language} onValueChange={(value) => setLanguage(value as "bm" | "en")}>
            <TabsList>
              <TabsTrigger value="bm">Bahasa Melayu</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TabsContent value="bm" />
            <TabsContent value="en" />
          </Tabs>
        </CardHeader>
        <CardContent>
          <motion.p
            key={language + narrative}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            lang={language === "bm" ? "ms" : "en"}
            className="text-sm leading-relaxed text-foreground"
          >
            {narrative}
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="gap-2 bg-bayan-green-deep text-primary-foreground hover:bg-bayan-green-deep/90"
              onClick={() => {
                setStatus(application.id, "approved");
                toast.success("Application approved", { description: `${application.id} marked as approved.` });
                navigate({ to: "/dashboard" });
              }}
              disabled={isNonCompliant}
            >
              <ThumbsUp className="size-4" /> Approve application
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-danger/40 text-danger hover:bg-danger/10"
              onClick={() => {
                setStatus(application.id, "rejected");
                toast("Application rejected", { description: `${application.id} marked as rejected.` });
                navigate({ to: "/dashboard" });
              }}
            >
              <ThumbsDown className="size-4" /> Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStatus(application.id, "review_needed");
                toast("Marked for senior review");
                navigate({ to: "/dashboard" });
              }}
            >
              Send to senior reviewer
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
