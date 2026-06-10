import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Calculator, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageTransition } from "@/components/page-transition";
import { employmentTypes, financingTypes, malaysianStates } from "@/lib/bayan-data";
import { useApplicationsStore } from "@/stores/applications-store";
import type { ApplicationRecord } from "@/lib/types";

export const Route = createFileRoute("/_app/assessment/new")({
  component: NewAssessmentPage,
});

function NewAssessmentPage() {
  const navigate = useNavigate();
  const addApplication = useApplicationsStore((s) => s.addApplication);

  const [form, setForm] = useState({
    name: "",
    mykad: "",
    age: "32",
    state: "Selangor",
    occupation: "Grab driver",
    months: "12",
    income: "3500",
    type: "Murabahah",
    amount: "10000",
    tenure: "24",
    purpose: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = `APP-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const initials = form.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "NA";
    const newApp: ApplicationRecord = {
      id,
      applicant: {
        name: form.name || "New Applicant",
        mykad: form.mykad,
        age: Number(form.age),
        state: form.state,
        occupation: form.occupation,
        monthsActive: Number(form.months),
        avatarInitials: initials,
      },
      financing: {
        type: form.type,
        amount: Number(form.amount),
        tenure: Number(form.tenure),
        purpose: form.purpose,
      },
      submittedAt: "Just now",
      status: "processing",
    };
    addApplication(newApp);
    navigate({ to: "/assessment/processing", search: { id } });
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Step 1 of 2</p>
          <h1 className="display-heading text-3xl text-bayan-green-deep">New credit assessment</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Submit applicant information to BAYAN. Both the Credit Risk and Shariah Compliance engines will evaluate this case in parallel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="card-flat rounded-xl border-border shadow-none">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <span className="rounded-lg bg-bayan-green-deep/10 p-2 text-bayan-green-deep">
                <User className="size-4" />
              </span>
              <CardTitle className="display-heading text-xl text-bayan-green-deep">Applicant identity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
              <Field id="name" label="Full name">
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="As per MyKad" />
              </Field>
              <Field id="mykad" label="MyKad number">
                <Input id="mykad" value={form.mykad} onChange={(e) => update("mykad", e.target.value)} placeholder="000000-00-0000" />
              </Field>
              <Field id="age" label="Age">
                <Input id="age" type="number" min={18} max={70} value={form.age} onChange={(e) => update("age", e.target.value)} />
              </Field>
              <Field id="state" label="State">
                <Select value={form.state} onValueChange={(value) => update("state", value)}>
                  <SelectTrigger id="state" className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {malaysianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card className="card-flat rounded-xl border-border shadow-none">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <span className="rounded-lg bg-bayan-amber/10 p-2 text-bayan-amber">
                <Building2 className="size-4" />
              </span>
              <CardTitle className="display-heading text-xl text-bayan-green-deep">Income & gig profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
              <Field id="occupation" label="Primary gig role">
                <Select value={form.occupation} onValueChange={(value) => update("occupation", value)}>
                  <SelectTrigger id="occupation" className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field id="months" label="Months active">
                <Input id="months" type="number" min={1} value={form.months} onChange={(e) => update("months", e.target.value)} />
              </Field>
              <Field id="income" label="Monthly earnings (RM)">
                <Input id="income" type="number" min={0} value={form.income} onChange={(e) => update("income", e.target.value)} />
              </Field>
            </CardContent>
          </Card>

          <Card className="card-flat rounded-xl border-border shadow-none">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <span className="rounded-lg bg-bayan-blue/10 p-2 text-bayan-blue">
                <Calculator className="size-4" />
              </span>
              <CardTitle className="display-heading text-xl text-bayan-green-deep">Financing request</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
              <Field id="type" label="Financing type">
                <Select value={form.type} onValueChange={(value) => update("type", value)}>
                  <SelectTrigger id="type" className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {financingTypes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} — <span className="text-muted-foreground">{option.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field id="amount" label="Amount requested (RM)">
                <Input id="amount" type="number" min={500} step={500} value={form.amount} onChange={(e) => update("amount", e.target.value)} />
              </Field>
              <Field id="tenure" label="Tenure (months)">
                <Input id="tenure" type="number" min={6} max={120} value={form.tenure} onChange={(e) => update("tenure", e.target.value)} />
              </Field>
              <Field id="purpose" label="Purpose of financing" className="sm:col-span-2">
                <Textarea
                  id="purpose"
                  rows={3}
                  value={form.purpose}
                  onChange={(e) => update("purpose", e.target.value)}
                  placeholder="Describe how the funds will be used"
                />
              </Field>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-bayan-green-deep text-primary-foreground hover:bg-bayan-green-deep/90"
            >
              Run BAYAN assessment
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
