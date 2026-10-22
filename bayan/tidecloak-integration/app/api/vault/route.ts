import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { addVaultItem, deleteVaultItem, getVault } from "@/lib/server/db";

// The vault only ever receives Tide CIPHERTEXT. Encryption/decryption happens in the
// browser via TideCloak (doEncrypt/doDecrypt) under the user's own identity, so neither
// this server, its database, nor any BAYAN admin can read the contents.
export async function GET(req: NextRequest) {
  const r = await requireRole(req, ["applicant"]);
  if ("error" in r) return r.error;
  return NextResponse.json(getVault(r.caller.sub));
}

export async function POST(req: NextRequest) {
  const r = await requireRole(req, ["applicant"]);
  if ("error" in r) return r.error;
  const body = await req.json().catch(() => ({}));
  const label = typeof body.label === "string" ? body.label.trim().slice(0, 60) : "";
  const ciphertext = typeof body.ciphertext === "string" ? body.ciphertext : "";
  if (!label || !ciphertext || ciphertext.length > 200_000)
    return NextResponse.json({ error: "label and ciphertext required" }, { status: 400 });
  return NextResponse.json(addVaultItem(r.caller.sub, r.caller.username, label, ciphertext), { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const r = await requireRole(req, ["applicant"]);
  if ("error" in r) return r.error;
  const id = req.nextUrl.searchParams.get("id") || "";
  return deleteVaultItem(r.caller.sub, id) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
