import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { listAudit, verifyChain } from "@/lib/server/db";

// Auditors (read-only) and officers can read the tamper-evident trail.
export async function GET(req: NextRequest) {
  const r = await requireRole(req, ["auditor", "officer"]);
  if ("error" in r) return r.error;
  const entries = listAudit();
  return NextResponse.json({ entries, integrity: verifyChain(entries) });
}
