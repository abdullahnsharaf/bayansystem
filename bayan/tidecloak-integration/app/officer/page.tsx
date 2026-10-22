"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTideCloak } from "@/components/auth";
import AppShell, { Badge, money, recKind, shariahKind, statusKind } from "@/components/AppShell";
import { useApi } from "@/components/useApi";
import { Sim } from "@/components/IdentityPanel";
import type { Application, Product } from "@/lib/types";

export default function OfficerPage() {
  const api = useApi();
  const { token } = useTideCloak();
  const [apps, setApps] = useState<Application[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [tab, setTab] = useState<"Pending" | "Decided">("Pending");
  const [lang, setLang] = useState<"EN" | "BM">("EN");
  const [note, setNote] = useState("");
  const [alt, setAlt] = useState<Product>("Tawarruq");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setApps(await api<Application[]>("/api/applications"));
    } catch (e: any) {
      setErr(e.message);
    }
  }, [api]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const shown = apps.filter((a) => (tab === "Pending" ? a.status === "Pending" : a.status !== "Pending"));
  const cur = useMemo(() => apps.find((a) => a.id === sel) || null, [apps, sel]);

  useEffect(() => {
    if (cur?.assessment.suggestedProduct) setAlt(cur.assessment.suggestedProduct);
    setNote("");
    setErr("");
  }, [cur?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "Pending").length,
    flagged: apps.filter((a) => a.assessment.guard.flagged).length,
    noncompliant: apps.filter((a) => a.assessment.shariah.verdict === "Non-compliant").length,
  };

  async function decide(status: "Approved" | "Declined" | "Alternative offered") {
    if (!cur) return;
    setBusy(true);
    setErr("");
    try {
      await api(`/api/applications/${cur.id}/decision`, {
        method: "POST",
        body: JSON.stringify({ status, note, product: status === "Alternative offered" ? alt : undefined }),
      });
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="Credit officer queue" subtitle="Engine recommends - you decide. Every decision is chained into the audit trail.">
      <div className="stats">
        <div className="card stat"><span>Applications</span><strong>{stats.total}</strong></div>
        <div className="card stat warn"><span>Awaiting decision</span><strong>{stats.pending}</strong></div>
        <div className="card stat bad"><span>Shariah non-compliant</span><strong>{stats.noncompliant}</strong></div>
        <div className="card stat info"><span>Prompt-injection flagged</span><strong>{stats.flagged}</strong></div>
      </div>

      <div className="grid-q">
        <div className="card">
          <div className="tabs">
            {(["Pending", "Decided"] as const).map((t) => (
              <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
          <ul className="list click">
            {shown.map((a) => (
              <li key={a.id} className={a.id === sel ? "sel" : ""} onClick={() => setSel(a.id)}>
                <div>
                  <div className="row gap-s">
                    <span className="mono">{a.id}</span>
                    {a.assessment.guard.flagged && <Badge kind="info">injection</Badge>}
                  </div>
                  <strong>{a.input.fullName}</strong>
                  <div className="muted small">
                    {a.input.occupation} · {money(a.input.amount)} · {a.input.product}
                  </div>
                </div>
                <div className="col-end">
                  <Badge kind={recKind(a.assessment.recommendation) as any}>{a.assessment.recommendation}</Badge>
                  {a.status !== "Pending" && <Badge kind={statusKind(a.status) as any}>{a.status}</Badge>}
                </div>
              </li>
            ))}
            {shown.length === 0 && <p className="muted">Nothing here.</p>}
          </ul>
        </div>

        <div className="card detail">
          {!cur ? (
            <p className="muted">Select an application to see the assessment.</p>
          ) : (
            <>
              <div className="row between">
                <div>
                  <span className="mono">{cur.id}</span>
                  <h2>{cur.input.fullName}</h2>
                  <p className="muted small">
                    {cur.ownerSub === "seed" && <><Sim>DEMO DATA</Sim> </>}
                    {cur.input.occupation} · submitted by <strong>{cur.ownerUsername}</strong> · {new Date(cur.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="score">
                  <span>Credit score <Sim title="Transparent rules model for the demo; production = XGBoost + SHAP">SIMULATED</Sim></span>
                  <strong>{cur.assessment.score}</strong>
                  <em>{cur.assessment.band}</em>
                </div>
              </div>

              {cur.assessment.guard.flagged && (
                <div className="alert info">
                  <strong>AI input guard</strong> <Sim title="Keyword guard for the demo; production = our Challenge-1 XLM-R classifier (Macro-F1 0.97)">SIMULATED</Sim>: the applicant&apos;s text looks like a prompt-injection attempt (
                  {cur.assessment.guard.reasons.join(", ")}). The AI narrative was disabled and the case forced to manual
                  review.
                </div>
              )}

              <div className="kv">
                <div><span>Requested</span><strong>{money(cur.input.amount)} · {cur.input.tenureMonths} mo</strong></div>
                <div><span>Contract</span><strong>{cur.input.product}</strong></div>
                <div><span>Instalment</span><strong>{money(cur.assessment.installment)}</strong></div>
                <div><span>Debt service ratio</span><strong>{Math.round(cur.assessment.dsr * 100)}%</strong></div>
              </div>
              <p className="small"><span className="muted">Purpose:</span> {cur.input.purpose}</p>

              <h3>Why this score</h3>
              <ul className="factors">
                {cur.assessment.factors.map((f) => (
                  <li key={f.label}>
                    <span className={f.impact >= 0 ? "pos" : "neg"}>{f.impact >= 0 ? `+${f.impact}` : f.impact}</span>
                    <strong>{f.label}</strong> <span className="muted">{f.note}</span>
                  </li>
                ))}
              </ul>

              <h3>
                Shariah screening <Sim title="Keyword rules for the demo; production = fatwa-RAG engine">SIMULATED</Sim> <Badge kind={shariahKind(cur.assessment.shariah.verdict) as any}>{cur.assessment.shariah.verdict}</Badge>
              </h3>
              {cur.assessment.shariah.findings.length === 0 ? (
                <p className="muted small">No riba, gharar or maysir indicators found.</p>
              ) : (
                <ul className="findings">
                  {cur.assessment.shariah.findings.map((f, k) => (
                    <li key={k}>
                      <Badge kind={f.severity === "fail" ? "bad" : "warn"}>{f.principle}</Badge> {f.detail}
                    </li>
                  ))}
                </ul>
              )}

              <div className="row between">
                <h3>Officer narrative</h3>
                <div className="tabs small">
                  {(["EN", "BM"] as const).map((l) => (
                    <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <p className="narrative">{lang === "EN" ? cur.assessment.narrativeEN : cur.assessment.narrativeBM}</p>

              <div className="decision">
                <div className="row between">
                  <span>
                    Engine recommendation: <Badge kind={recKind(cur.assessment.recommendation) as any}>{cur.assessment.recommendation}</Badge>
                    {cur.assessment.suggestedProduct && <> · suggested alternative <strong>{cur.assessment.suggestedProduct}</strong></>}
                  </span>
                </div>
                {cur.status === "Pending" ? (
                  <>
                    <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Decision note (recorded in the audit trail)" />
                    <div className="row gap wrap">
                      <button className="btn ok" disabled={busy} onClick={() => decide("Approved")}>Approve</button>
                      <span className="row gap-s">
                        <select value={alt} onChange={(e) => setAlt(e.target.value as Product)}>
                          <option>Tawarruq</option>
                          <option>Murabahah</option>
                          <option>Ijarah</option>
                        </select>
                        <button className="btn info" disabled={busy} onClick={() => decide("Alternative offered")}>Offer alternative</button>
                      </span>
                      <button className="btn bad" disabled={busy} onClick={() => decide("Declined")}>Decline</button>
                    </div>
                  </>
                ) : (
                  <p>
                    <Badge kind={statusKind(cur.status) as any}>{cur.status}</Badge> by <strong>{cur.decision?.by}</strong>{" "}
                    {cur.decision?.product && <>({cur.decision.product}) </>}
                    <span className="muted small">{cur.decision && new Date(cur.decision.at).toLocaleString()}</span>
                    {cur.decision?.note && <span className="block muted small">“{cur.decision.note}”</span>}
                  </p>
                )}
                {err && <p className="err-text">{err}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
