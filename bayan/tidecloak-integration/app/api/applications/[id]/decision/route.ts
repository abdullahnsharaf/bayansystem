import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { decide, getApplication, audit } from "@/lib/server/db";
import type { Product, Status } from "@/lib/types";

const STATUSES: Status[] = ["Approved", "Declined", "Alternative offered"];
const PRODUCTS: Product[] = ["Murabahah", "Tawarruq", "Ijarah"];

// Only officers decide. Segregation of duties: an officer can never decide their own application.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const r = await requireRole(req, ["officer"]);
  if ("error" in r) return r.error;
  const { id } = await params;
  const app = getApplication(id);
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  if (app.ownerSub === r.caller.sub) {
    audit({ actor: r.caller.username, role: "officer", action: "BLOCKED", target: id, details: "Officer attempted to decide own application (segregation of duties)" });
    return NextResponse.json({ error: "Segregation of duties: you cannot decide your own application." }, { status: 403 });
  }
  if (app.status !== "Pending") return NextResponse.json({ error: `Already decided (${app.status})` }, { status: 409 });

  const body = await req.json().catch(() => ({}));
  const status: Status | undefined = STATUSES.includes(body.status) ? body.status : undefined;
  if (!status) return NextResponse.json({ error: "status must be Approved, Declined or Alternative offered" }, { status: 400 });
  const product: Product | null = status === "Alternative offered" ? (PRODUCTS.includes(body.product) ? body.product : null) : status === "Approved" ? app.input.product : null;
  if (status === "Alternative offered" && !product) return NextResponse.json({ error: "Choose a Shariah-compliant alternative product" }, { status: 400 });
  if (status === "Approved" && (app.input.product === "Conventional loan" || app.assessment.shariah.verdict === "Non-compliant"))
    return NextResponse.json({ error: "Cannot approve a non-compliant structure. Offer a compliant alternative or decline." }, { status: 422 });

  const note = typeof body.note === "string" ? body.note.slice(0, 400) : "";
  return NextResponse.json(decide(id, r.caller.username, status, note, product));
}
