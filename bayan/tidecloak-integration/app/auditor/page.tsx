"use client";
import { useCallback, useEffect, useState } from "react";
import { useTideCloak } from "@/components/auth";
import AppShell, { Badge } from "@/components/AppShell";
import { useApi } from "@/components/useApi";
import { Sim } from "@/components/IdentityPanel";
import type { Application, AuditEntry } from "@/lib/types";

const actionKind = (a: string) =>
  a === "DECIDE" ? "ok" : a === "BLOCKED" ? "bad" : a === "EXPORT" ? "warn" : a === "VAULT_STORE" ? "info" : "muted";

export default function AuditorPage() {
  const api = useApi();
  const { token } = useTideCloak();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [integrity, setIntegrity] = useState<{ ok: boolean; brokenAt: number | null } | null>(null);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await api<{ entries: AuditEntry[]; integrity: { ok: boolean; brokenAt: number | null } }>("/api/audit");
      setEntries([...r.entries].reverse());
      setIntegrity(r.integrity);
    } catch (e: any) {
      setErr(e.message);
    }
  }, [api]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  async function exportCsv() {
    try {
      const apps = await api<Application[]>("/api/applications", { method: "PUT" });
      const rows = [
        ["id", "applicant", "occupation", "product", "amount", "score", "shariah", "engine", "status", "decided_by"],
        ...apps.map((a) => [a.id, a.input.fullName, a.input.occupation, a.input.product, a.input.amount, a.assessment.score, a.assessment.shariah.verdict, a.assessment.recommendation, a.status, a.decision?.by || ""]),
      ];
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `bayan-register-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  const shown = entries.filter((e) => !q || JSON.stringify(e).toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell title="Audit trail" subtitle="Read-only. Every entry is hash-chained to the previous one, so any edit or deletion is detectable.">
      <div className="row gap wrap">
        <div className={`card integrity ${integrity?.ok ? "ok" : "bad"}`}>
          {integrity === null ? "Checking chain…" : integrity.ok ? `✓ Chain intact - ${entries.length} entries verified (SHA-256)` : `✗ Chain broken at entry #${integrity.brokenAt} - records were altered`}
        </div>
        <input className="grow" placeholder="Search actor, action, application…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" onClick={exportCsv}>Export register (CSV)</button>
        <button className="btn ghost" onClick={load}>Refresh</button>
        <Sim title="Stored in a JSON file (.data/bayan.json) for the prototype; production = append-only database">FILE STORE · SIMULATED</Sim>
      </div>
      {err && <p className="err-text">{err}</p>}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Actor</th>
              <th>Role</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((e) => (
              <tr key={e.seq}>
                <td className="mono">{e.seq}</td>
                <td className="small">{new Date(e.ts).toLocaleString()}</td>
                <td>{e.actor}</td>
                <td className="small muted">{e.role}</td>
                <td><Badge kind={actionKind(e.action) as any}>{e.action}</Badge></td>
                <td className="mono small">{e.target}</td>
                <td className="small">{e.details}</td>
                <td className="mono small muted" title={`prev ${e.prevHash}`}>{e.hash.slice(0, 10)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
