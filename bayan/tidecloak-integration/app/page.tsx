"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTideCloak } from "@/components/auth";
import { Logo } from "@/components/SetupScreen";
import { tideMode, demoMode } from "@/lib/config";
import { useState } from "react";

export default function Landing() {
  const { login, authenticated, isInitializing } = useTideCloak();
  const [err, setErr] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authenticated) router.push("/auth/redirect");
  }, [authenticated, router]);

  return (
    <main className="landing">
      <section className="hero">
        <Logo size={46} />
        <h1>
          Shariah-compliant credit for gig workers.
          <br />
          <span>Even if we are breached.</span>
        </h1>
        <p className="lead">
          BAYAN helps Islamic banks assess B40 and gig-economy applicants on alternative data. Identity, roles and
          private data are protected by <strong>TideCloak</strong>: the keys are split across the Tide network, so no
          password database, no single admin and not even BAYAN can unlock them.
        </p>
        {demoMode ? (
          <div className="demo-login">
            <p className="small">
              <span className="sim">DEMO LOGIN · SIMULATED</span> Choose a role. Sessions are still signed and verified on the server; TideCloak
              replaces this login when <code>tidecloak.json</code> is configured.
            </p>
            <div className="row gap wrap">
              {[
                ["aisyah", "Applicant", "Aisyah · apply + private vault"],
                ["officer.hafiz", "Credit officer", "Hafiz · review and decide"],
                ["auditor.lim", "Auditor", "Mei Ling · audit trail"],
              ].map(([u, r, d]) => (
                <button key={u} className="btn role-btn" disabled={isInitializing} onClick={() => Promise.resolve(login(u)).catch((e) => setErr(e.message))}>
                  <strong>{r}</strong>
                  <span>{d}</span>
                </button>
              ))}
            </div>
            {err && <p className="err-text">{err}</p>}
          </div>
        ) : (
          <button className="btn big" onClick={() => login()} disabled={isInitializing}>
            {isInitializing ? "Connecting…" : tideMode ? "Sign in with Tide" : "Sign in with TideCloak"}
          </button>
        )}
        {demoMode ? null : tideMode ? (
          <p className="muted small">New users join as an applicant. Officer and auditor roles are granted by quorum-approved admins.</p>
        ) : (
          <p className="notice">
            Running in <strong>TideCloak standard sign-in mode</strong>: Tide&apos;s licence service timed out during realm setup, so
            Tide keyless login, vault encryption and quorum approval are pending. Roles, server-side token checks and the audit trail
            are fully live. Demo users: <code>aisyah</code>, <code>officer.hafiz</code>, <code>auditor.lim</code>.
          </p>
        )}
      </section>

      <section className="pillars">
        {[
          ["Role-separated access", "Applicants, credit officers and Shariah auditors each see only their own workspace - enforced server-side on every request."],
          ["Private vault", "IC numbers and payslips are encrypted in the browser with Tide. The server stores ciphertext only."],
          ["Quorum governance", "Granting an officer or auditor role is a change request that admins must approve - one stolen admin account cannot escalate."],
          ["Tamper-evident audit", "Every submission, decision and export is chained with SHA-256. Auditors can prove nothing was altered."],
        ].map(([t, d]) => (
          <div className="card pillar" key={t}>
            <h3>{t}</h3>
            <p className="muted">{d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
