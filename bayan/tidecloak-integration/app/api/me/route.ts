import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";

// Any authenticated BAYAN user. Returns the identity the SERVER verified from the token.
export async function GET(req: NextRequest) {
  const r = await requireRole(req, ["applicant", "officer", "auditor"]);
  if ("error" in r) return r.error;
  return NextResponse.json(r.caller);
}
