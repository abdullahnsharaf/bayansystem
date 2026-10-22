"use client";
import Link from "next/link";
import { useTideCloak } from "@/components/auth";

export default function AccessDenied() {
  const { logout } = useTideCloak();
  const from = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("from") : null;
  return (
    <main className="center-page">
      <div className="card narrow">
        <div className="big-icon">⛔</div>
        <h1>Access denied</h1>
        <p className="muted">
          Your Tide identity does not hold the role required for {from ? <code>{from}</code> : "this page"}. TideCloak
          verified this on the server before the page loaded.
        </p>
        <p className="muted small">
          Need officer or auditor access? A realm admin must raise a role change request in the TideCloak console, and
          it only takes effect after quorum approval.
        </p>
        <div className="row gap">
          <Link className="btn" href="/auth/redirect">
            Go to my workspace
          </Link>
          <button className="btn ghost" onClick={() => logout()}>
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
