import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { BayanLogo } from "@/components/bayan-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [employeeId, setEmployeeId] = useState("MB-2891");
  const [password, setPassword] = useState("••••••••");
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setTimeout(() => {
      login(employeeId, password, remember);
      navigate({ to: "/dashboard" });
    }, 600);
  }

  return (
    <div className="page-shell flex min-h-dvh items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card-flat w-full max-w-md rounded-xl bg-card p-10"
      >
        <BayanLogo />
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              autoComplete="username"
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="h-11"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={remember}
                onCheckedChange={(value) => setRemember(Boolean(value))}
              />
              <span>Remember this device</span>
            </label>
            <button type="button" className="text-sm text-bayan-green-deep hover:underline">
              Need help?
            </button>
          </div>
          <Button
            type="submit"
            disabled={pending}
            className="h-11 w-full bg-bayan-green-deep text-primary-foreground hover:bg-bayan-green-deep/90"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          BAYAN demo · Maybank Islamic preview environment
        </p>
      </motion.div>
    </div>
  );
}
