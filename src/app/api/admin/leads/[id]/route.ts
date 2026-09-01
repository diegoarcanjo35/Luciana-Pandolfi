import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { LEAD_STATUS_VALUES, deleteLead, updateLeadStatus, type LeadStatus } from "@/lib/db";

function parseLeadId(id: string): number | null {
  const leadId = Number(id);
  return Number.isInteger(leadId) && leadId > 0 ? leadId : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const leadId = parseLeadId(id);
  if (!leadId) {
    return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { status?: unknown } | null;
  const status = LEAD_STATUS_VALUES.find((s) => s === body?.status) as LeadStatus | undefined;
  if (!status) {
    return NextResponse.json({ ok: false, error: "Status inválido." }, { status: 400 });
  }

  await updateLeadStatus(leadId, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const leadId = parseLeadId(id);
  if (!leadId) {
    return NextResponse.json({ ok: false, error: "ID inválido." }, { status: 400 });
  }

  await deleteLead(leadId);
  return NextResponse.json({ ok: true });
}
