import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { createApplication, listApplications, audit } from "@/lib/server/db";
import type { ApplicationInput, Product } from "@/lib/types";

const PRODUCTS: Product[] = ["Murabahah", "Tawarruq", "Ijarah", "Conventional loan"];

// GET: officers & auditors see the whole queue; applicants see only their own.
export async function GET(req: NextRequest) {
  const r = await requireRole(req, ["applicant", "officer", "auditor"]);
  if ("error" in r) return r.error;
  const c = r.caller;
  const staff = c.roles.includes("officer") || c.roles.includes("auditor");
  const scope = req.nextUrl.searchParams.get("scope");
  const apps = staff && scope !== "mine" ? listApplications() : listApplications({ ownerSub: c.sub });
  return NextResponse.json(apps);
}

// POST: only applicants submit. Input is validated server-side; the engine runs on the server.
export async function POST(req: NextRequest) {
  const r = await requireRole(req, ["applicant"]);
  if ("error" in r) return r.error;
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const num = (v: any, min: number, max: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= min && n <= max ? n : null;
  };
  const str = (v: any, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
  const input: Partial<ApplicationInput> = {
    fullName: str(body.fullName, 80) ?? undefined,
    occupation: str(body.occupation, 60) ?? undefined,
    monthlyIncome: num(body.monthlyIncome, 1, 1_000_000) ?? undefined,
    incomeMonths: num(body.incomeMonths, 0, 600) ?? undefined,
    ewalletInflow: num(body.ewalletInflow, 0, 1_000_000) ?? undefined,
    commitments: num(body.commitments, 0, 1_000_000) ?? undefined,
    amount: num(body.amount, 500, 500_000) ?? undefined,
    tenureMonths: num(body.tenureMonths, 3, 120) ?? undefined,
    product: PRODUCTS.includes(body.product) ? body.product : undefined,
    purpose: str(body.purpose, 600) ?? undefined,
  };
  const missing = Object.entries(input).filter(([, v]) => v === undefined).map(([k]) => k);
  if (missing.length) return NextResponse.json({ error: `Invalid or missing: ${missing.join(", ")}` }, { status: 400 });
  const app = createApplication(r.caller.sub, r.caller.username, input as ApplicationInput);
  return NextResponse.json(app, { status: 201 });
}

// Export of the full queue (staff only) - logged.
export async function PUT(req: NextRequest) {
  const r = await requireRole(req, ["auditor"]);
  if ("error" in r) return r.error;
  audit({ actor: r.caller.username, role: "auditor", action: "EXPORT", target: "applications", details: "Full application register exported" });
  return NextResponse.json(listApplications());
}
