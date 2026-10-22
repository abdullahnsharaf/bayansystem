import { NextRequest, NextResponse } from "next/server";
import { isConfigured } from "@/lib/config";
import { issueDemoToken } from "@/lib/demoToken";
import { audit } from "@/lib/server/db";

// Demo login - only exists while TideCloak is NOT configured.
export async function POST(req: NextRequest) {
  if (isConfigured) return NextResponse.json({ error: "Demo login is disabled: TideCloak is configured." }, { status: 404 });
  const { username } = await req.json().catch(() => ({}));
  const token = issueDemoToken(String(username || ""));
  if (!token) return NextResponse.json({ error: "Unknown demo user" }, { status: 400 });
  audit({ actor: String(username), role: "-", action: "LOGIN", target: "demo", details: "Demo sign-in (simulated identity provider)" });
  const res = NextResponse.json({ token });
  res.cookies.set("kcToken", token, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 8 * 3600 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("kcToken", "", { path: "/", maxAge: 0 });
  return res;
}
