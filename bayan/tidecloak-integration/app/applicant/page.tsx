"use client";
import { useCallback, useEffect, useState } from "react";
import { useTideCloak } from "@/components/auth";
import AppShell, { Badge, money, statusKind } from "@/components/AppShell";
import { useApi } from "@/components/useApi";
import { Sim } from "@/components/IdentityPanel";
import { VAULT_TAG, tideMode, demoMode } from "@/lib/config";
import type { Application, Product, VaultItem } from "@/lib/types";

const EMPTY = {
  fullName: "",
  occupation: "",
  monthlyIncome: "",
  incomeMonths: "",
  ewalletInflow: "",
  commitments: "",
  amount: "",
  tenureMonths: "24",
  product: "Murabahah" as Product,
  purpose: "",
};

export default function ApplicantPage() {
  const api = useApi();
  const { token, doEncrypt, doDecrypt } = useTideCloak();
  const [apps, setApps] = useState<Application[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // vault
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [plain, setPlain] = useState<Record<string, string>>({});
  const [showCipher, setShowCipher] = useState<Record<string, boolean>>({});
  const [vLabel, setVLabel] = useState("IC number");
  const [vText, setVText] = useState("");
  const [vBusy, setVBusy] = useState(false);
  const [vErr, setVErr] = useState("");

  const load = useCallback(async () => {
    try {
      setApps(await api<Application[]>("/api/applications?scope=mine"));
      setVault(await api<VaultItem[]>("/api/vault"));
    } catch (e: any) {
      setMsg({ ok: false, text: e.message });
    }
  }, [api]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const set = (k: keyof typeof EMPTY) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const app = await api<Application>("/api/applications", { method: "POST", body: JSON.stringify(form) });
      setMsg({ ok: true, text: `Submitted ${app.id}. An officer will review it - you will see the decision here.` });
      setForm(EMPTY);
      load();
    } catch (err: any) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function storeSecret() {
    if (!vText.trim()) return;
    setVBusy(true);
    setVErr("");
    try {
      // Encrypted in the browser under THIS user's Tide identity. Only ciphertext leaves the device.
      const [ciphertext] = await doEncrypt([{ data: vText, tags: [VAULT_TAG] }]);
      await api("/api/vault", { method: "POST", body: JSON.stringify({ label: vLabel, ciphertext }) });
      setVText("");
      load();
    } catch (e: any) {
      setVErr(e.message || "Encryption failed - does your account have the _tide_vault roles?");
    } finally {
      setVBusy(false);
    }
  }

  async function reveal(item: VaultItem) {
    if (plain[item.id]) return setPlain(({ [item.id]: _, ...rest }) => rest);
    try {
      const [pt] = await doDecrypt([{ encrypted: item.ciphertext, tags: [VAULT_TAG] }]);
      setPlain({ ...plain, [item.id]: String(pt) });
    } catch (e: any) {
      setVErr(e.message || "Decryption failed");
    }
  }

  async function remove(id: string) {
    await api(`/api/vault?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AppShell title="My financing" subtitle="Apply for Shariah-compliant financing and keep your documents in a vault only you can open.">
      <div className="grid2">
        <form className="card" onSubmit={submit}>
          <h2>New application</h2>
          <p className="muted small">Income and e-wallet figures are self-declared <Sim title="No live bank / e-wallet / CCRIS API in the prototype">SIMULATED</Sim> - production pulls them via open-banking APIs.</p>
          <div className="fields">
            <label>
              Full name
              <input required value={form.fullName} onChange={set("fullName")} placeholder="As per MyKad" />
            </label>
            <label>
              Occupation
              <input required value={form.occupation} onChange={set("occupation")} placeholder="e.g. Grab driver" />
            </label>
            <label>
              Monthly income (RM)
              <input required type="number" min={1} value={form.monthlyIncome} onChange={set("monthlyIncome")} />
            </label>
            <label>
              Months of income history
              <input required type="number" min={0} value={form.incomeMonths} onChange={set("incomeMonths")} />
            </label>
            <label>
              E-wallet inflow / month (RM)
              <input required type="number" min={0} value={form.ewalletInflow} onChange={set("ewalletInflow")} />
            </label>
            <label>
              Existing commitments / month (RM)
              <input required type="number" min={0} value={form.commitments} onChange={set("commitments")} />
            </label>
            <label>
              Amount requested (RM)
              <input required type="number" min={500} value={form.amount} onChange={set("amount")} />
            </label>
            <label>
              Tenure (months)
              <select value={form.tenureMonths} onChange={set("tenureMonths")}>
                {[6, 12, 18, 24, 36, 48, 60].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="span2">
              Contract type
              <select value={form.product} onChange={set("product")}>
                <option>Murabahah</option>
                <option>Tawarruq</option>
                <option>Ijarah</option>
                <option>Conventional loan</option>
              </select>
            </label>
            <label className="span2">
              Purpose of financing
              <textarea required rows={3} value={form.purpose} onChange={set("purpose")} placeholder="What will the funds buy or pay for?" />
            </label>
          </div>
          <button className="btn" disabled={busy}>
            {busy ? "Submitting…" : "Submit application"}
          </button>
          {msg && <p className={msg.ok ? "ok-text" : "err-text"}>{msg.text}</p>}
        </form>

        <div className="stack">
          <div className="card">
            <h2>My applications</h2>
            {apps.length === 0 ? (
              <p className="muted">No applications yet.</p>
            ) : (
              <ul className="list">
                {apps.map((a) => (
                  <li key={a.id}>
                    <div>
                      <span className="mono">{a.id}</span>
                      <div className="muted small">
                        {a.input.product} · {money(a.input.amount)} · {new Date(a.createdAt).toLocaleString()}
                      </div>
                      {a.decision?.product && a.status === "Alternative offered" && (
                        <div className="small">
                          Offered instead: <strong>{a.decision.product}</strong>
                        </div>
                      )}
                    </div>
                    <Badge kind={statusKind(a.status) as any}>{a.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card vault">
            <h2>
              Private vault <Badge kind="info">Tide-encrypted</Badge>
            </h2>
            <p className="muted small">
              Encrypted in your browser with your Tide identity. BAYAN&apos;s server and database only ever hold ciphertext -
              no admin can read it.
            </p>
            <div className="row gap">
              <select value={vLabel} onChange={(e) => setVLabel(e.target.value)}>
                <option>IC number</option>
                <option>Bank account</option>
                <option>Payslip note</option>
                <option>Home address</option>
              </select>
              <input className="grow" value={vText} onChange={(e) => setVText(e.target.value)} placeholder="Sensitive value" />
              <button className="btn" type="button" onClick={storeSecret} disabled={vBusy || (!tideMode && !demoMode)}>
                {vBusy ? "Encrypting…" : "Encrypt & store"}
              </button>
            </div>
            {demoMode && (
              <p className="notice">
                <span className="sim">SIMULATED</span> Demo mode encrypts in your browser with AES-GCM; the server still stores only ciphertext.
                With TideCloak connected this becomes Tide encryption, where no key is held anywhere.
              </p>
            )}
            {!tideMode && !demoMode && (
              <p className="notice">
                Tide licence pending: vault encryption needs a Tide-licensed realm (the licence service timed out during setup). The
                server-side design is in place - <code>/api/vault</code> only accepts ciphertext - and switches on with{" "}
                <code>init/tcinit.sh</code>.
              </p>
            )}
            {vErr && <p className="err-text">{vErr}</p>}
            <ul className="list">
              {vault.map((v) => (
                <li key={v.id} className="vault-item">
                  <div className="grow">
                    <strong>{v.label}</strong>
                    <div className="mono small">
                      {plain[v.id] ? <span className="ok-text">{plain[v.id]}</span> : showCipher[v.id] ? v.ciphertext : "••••••••••••"}
                    </div>
                  </div>
                  <div className="row gap-s">
                    <button className="btn ghost s" type="button" onClick={() => setShowCipher({ ...showCipher, [v.id]: !showCipher[v.id] })}>
                      {showCipher[v.id] ? "Hide" : "What the server sees"}
                    </button>
                    <button className="btn s" type="button" onClick={() => reveal(v)}>
                      {plain[v.id] ? "Lock" : "Decrypt"}
                    </button>
                    <button className="btn ghost s" type="button" onClick={() => remove(v.id)}>
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
