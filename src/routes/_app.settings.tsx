import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <PageTransition>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Account & preferences</p>
        <h1 className="display-heading text-3xl text-bayan-green-deep">Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-flat rounded-xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="display-heading text-xl text-bayan-green-deep">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={user?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={user?.role ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Institution</Label>
              <Input id="bank" defaultValue={user?.bankName ?? ""} />
            </div>
            <Button className="bg-bayan-green-deep text-primary-foreground hover:bg-bayan-green-deep/90">
              Save changes
            </Button>
          </CardContent>
        </Card>

        <Card className="card-flat rounded-xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="display-heading text-xl text-bayan-green-deep">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "lang", label: "Default narrative language: Bahasa Melayu" },
              { id: "alerts", label: "Email alerts on high-risk applications" },
              { id: "audit", label: "Auto-generate Shariah audit logs" },
              { id: "two-factor", label: "Two-factor authentication" },
            ].map((option) => (
              <div key={option.id} className="flex items-center justify-between rounded-md border border-border bg-card p-4">
                <Label htmlFor={option.id} className="text-sm text-foreground">{option.label}</Label>
                <Switch id={option.id} defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
