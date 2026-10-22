"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTideCloak } from "@/components/auth";

// After Tide login, send each user to the workspace for their highest role.
export default function RedirectPage() {
  const { authenticated, isInitializing, logout, hasRealmRole } = useTideCloak();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your Tide identity…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "failed") {
      setMessage("Session expired. Signing you out…");
      sessionStorage.setItem("tokenExpired", "true");
      logout();
    }
  }, [logout]);

  useEffect(() => {
    if (isInitializing) return;
    if (!authenticated) return router.push("/");
    if (hasRealmRole("officer")) router.push("/officer");
    else if (hasRealmRole("auditor")) router.push("/auditor");
    else if (hasRealmRole("applicant")) router.push("/applicant");
    else router.push("/access-denied");
  }, [authenticated, isInitializing, hasRealmRole, router]);

  return <div className="center-page muted">{message}</div>;
}
